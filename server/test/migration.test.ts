import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {DataTypes, Sequelize} from 'sequelize';

/**
 * Umzug 迁移双 dialect 测试（sqlite 实跑）。
 *
 * 思路：先用「旧 schema」形态建表（createTime=STRING、taskConfig=STRING、Colors.type=CHAR、无索引），
 * 模拟存量库漂移；再跑 createMigrator(db).up()，断言：
 *  - createTime 收敛为 BIGINT、taskConfig 收敛为 TEXT、Colors.type 收敛为 STRING；
 *  - 目标索引全部建立（含 UX_lmo_UpLoadFiles_hash 唯一）；
 *  - 迁移幂等：第二次 up() 不重复执行、不报错（SequelizeStorage 记录已应用）。
 *
 * mssql 分支依赖外部实例，标 `@mssql` 手动门（见计划），此处不跑。
 */

let db: Sequelize;
let tmp: string;
const createMigrator = async (): Promise<any> => {
    const {createMigrator: build} = await import('../repository/umzug.js');
    return build(db);
};

beforeAll(async (): Promise<void> => {
    // env zod 对 NODE_ENV 枚举校验，vitest 默认 test 非法 → 必须在动态 import 前置为合法值
    process.env.NODE_ENV = 'development';
    process.env.APP_LOG_LEVEL = 'fatal';

    tmp = mkdtempSync(join(tmpdir(), 'lmo-mig-'));
    db = new Sequelize({
        dialect: 'sqlite',
        storage: join(tmp, 'legacy.db'),
        logging: false,
    });

    const qi = db.getQueryInterface();

    // 旧形态：createTime 存字符串、taskConfig 存短串、Colors.type 定长 CHAR、无索引
    await qi.createTable('lmo_Templates', {
        id: {type: DataTypes.STRING, primaryKey: true},
        name: {type: DataTypes.STRING},
        type: {type: DataTypes.INTEGER},
        createTime: {type: DataTypes.STRING},
    });
    await qi.createTable('lmo_Resources', {
        id: {type: DataTypes.STRING, primaryKey: true},
        status: {type: DataTypes.STRING},
        taskConfig: {type: DataTypes.STRING},
        createTime: {type: DataTypes.STRING},
    });
    await qi.createTable('lmo_UpLoadFiles', {
        id: {type: DataTypes.STRING, primaryKey: true},
        hash: {type: DataTypes.STRING},
        createTime: {type: DataTypes.STRING},
    });
    await qi.createTable('lmo_Colors', {
        id: {type: DataTypes.STRING, primaryKey: true},
        type: {type: DataTypes.CHAR(1)},
    });

    await db.authenticate();

    // 统一在此处实跑一次迁移，后续用例断言其结果（避免用例间顺序依赖）
    const m = await createMigrator();
    await m.up();
});

afterAll(async (): Promise<void> => {
    await db?.close();
    rmSync(tmp, {recursive: true, force: true});
});

const columnType = async (table: string, column: string): Promise<string> => {
    const desc = await db.getQueryInterface().describeTable(table);
    return String((desc as any)[column].type).toLowerCase();
};

describe('Umzug 迁移（sqlite 实跑）', (): void => {
    it('up() 后列类型向模型收敛（createTime BIGINT / taskConfig TEXT / Colors.type STRING）', async (): Promise<void> => {
        expect(await columnType('lmo_Templates', 'createTime')).toContain('bigint');
        expect(await columnType('lmo_Resources', 'createTime')).toContain('bigint');
        expect(await columnType('lmo_UpLoadFiles', 'createTime')).toContain('bigint');
        expect(await columnType('lmo_Resources', 'taskConfig')).toContain('text');
        // Colors.type 由定长 CHAR → STRING（sqlite 下 STRING 即 VARCHAR）
        const colorType = await columnType('lmo_Colors', 'type');
        expect(colorType).toContain('char');
        expect(colorType).not.toMatch(/char\(1\)/);
    });

    it('目标索引全部建立，且 hash 为唯一索引', async (): Promise<void> => {
        const qi = db.getQueryInterface();

        const tplIdx = (await qi.showIndex('lmo_Templates')) as Array<{ name: string }>;
        for (const n of ['IX_lmo_Templates_name', 'IX_lmo_Templates_type', 'IX_lmo_Templates_createTime'])
            expect(tplIdx.some((i): boolean => i.name === n), n).toBe(true);

        const resIdx = (await qi.showIndex('lmo_Resources')) as Array<{ name: string }>;
        for (const n of ['IX_lmo_Resources_status', 'IX_lmo_Resources_createTime'])
            expect(resIdx.some((i): boolean => i.name === n), n).toBe(true);

        const upIdx = (await qi.showIndex('lmo_UpLoadFiles')) as Array<any>;
        const uxHash = upIdx.find((i): boolean => i.name === 'UX_lmo_UpLoadFiles_hash');
        expect(uxHash).toBeTruthy();
        expect(uxHash.unique).toBe(true);
    });

    it('幂等：第二次 up() 无新迁移、不重复报错', async (): Promise<void> => {
        const m = await createMigrator();
        const applied = await m.up();
        expect(applied).toHaveLength(0);
    });
});
