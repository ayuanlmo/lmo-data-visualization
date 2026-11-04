import {DataTypes, Sequelize} from 'sequelize';
import type {RunnableMigration} from 'umzug/lib/types.js';

/**
 * Umzug 迁移集合（对齐「模型定义 / T-SQL 脚本 / 存量库」三者）。
 *
 * 设计要点：
 *  - **幂等**：changeColumn 将列设为目标类型天然幂等；addIndex 先 showIndex 判存再建。
 *  - **双方言**：全部走 Sequelize QueryInterface（sqlite/mssql 由方言适配层翻译），不在迁移里写死 T-SQL。
 *  - 存量 mssql 库的历史漂移（createTime NVARCHAR→BIGINT、taskConfig NVARCHAR(255)→TEXT、Colors.type CHAR→STRING、缺失索引）
 *    由本迁移修复；新库由 bootstrap 的 `sync`（开发）或迁移（生产）建立。
 *  - 名称带时间戳前缀，Umzug 依名称排序执行，并记入 SequelizeStorage 迁移表。
 */

export const migrations: Array<RunnableMigration<Sequelize>> = [
    {
        name: '20240601000000-align-schema',
        up: async ({context: db}): Promise<void> => {
            const qi = db.getQueryInterface();

            // createTime 数值化（避免按字典序排序）
            for (const table of ['lmo_Templates', 'lmo_Resources', 'lmo_UpLoadFiles']) {
                await qi.changeColumn(table, 'createTime', {type: DataTypes.BIGINT, allowNull: true});
            }

            // taskConfig 大 JSON → TEXT（NVARCHAR(255) 会截断）
            await qi.changeColumn('lmo_Resources', 'taskConfig', {type: DataTypes.TEXT, allowNull: true});

            // Colors.type 由定长 CHAR → STRING
            await qi.changeColumn('lmo_Colors', 'type', {type: DataTypes.STRING, allowNull: true});
        },
        down: async ({context: db}): Promise<void> => {
            // 迁移为「向模型收敛」的修复，回滚仅恢复为旧的宽松字符串列（不还原数据）
            const qi = db.getQueryInterface();

            for (const table of ['lmo_Templates', 'lmo_Resources', 'lmo_UpLoadFiles']) {
                await qi.changeColumn(table, 'createTime', {type: DataTypes.STRING, allowNull: true});
            }

            await qi.changeColumn('lmo_Resources', 'taskConfig', {type: DataTypes.STRING, allowNull: true});
            await qi.changeColumn('lmo_Colors', 'type', {type: DataTypes.STRING, allowNull: true});
        }
    },
    {
        name: '20240601000100-add-indexes',
        up: async ({context: db}): Promise<void> => {
            const qi = db.getQueryInterface();
            const wanted: Array<{ table: string; name: string; fields: Array<string>; unique?: boolean }> = [
                {table: 'lmo_Templates', name: 'IX_lmo_Templates_name', fields: ['name']},
                {table: 'lmo_Templates', name: 'IX_lmo_Templates_type', fields: ['type']},
                {table: 'lmo_Templates', name: 'IX_lmo_Templates_createTime', fields: ['createTime']},
                {table: 'lmo_Resources', name: 'IX_lmo_Resources_status', fields: ['status']},
                {table: 'lmo_Resources', name: 'IX_lmo_Resources_createTime', fields: ['createTime']},
                {table: 'lmo_UpLoadFiles', name: 'UX_lmo_UpLoadFiles_hash', fields: ['hash'], unique: true},
                {table: 'lmo_UpLoadFiles', name: 'IX_lmo_UpLoadFiles_createTime', fields: ['createTime']}
            ];

            for (const idx of wanted) {
                const existing = (await qi.showIndex(idx.table)) as Array<{ name: string }>;

                if (!existing.some((i): boolean => i.name === idx.name))
                    await qi.addIndex(idx.table, {name: idx.name, fields: idx.fields, unique: Boolean(idx.unique)});
            }
        },
        down: async ({context: db}): Promise<void> => {
            const qi = db.getQueryInterface();
            const names: Array<{ table: string; name: string }> = [
                {table: 'lmo_Templates', name: 'IX_lmo_Templates_name'},
                {table: 'lmo_Templates', name: 'IX_lmo_Templates_type'},
                {table: 'lmo_Templates', name: 'IX_lmo_Templates_createTime'},
                {table: 'lmo_Resources', name: 'IX_lmo_Resources_status'},
                {table: 'lmo_Resources', name: 'IX_lmo_Resources_createTime'},
                {table: 'lmo_UpLoadFiles', name: 'UX_lmo_UpLoadFiles_hash'},
                {table: 'lmo_UpLoadFiles', name: 'IX_lmo_UpLoadFiles_createTime'}
            ];

            for (const idx of names)
                await qi.removeIndex(idx.table, idx.name);
        }
    }
];
