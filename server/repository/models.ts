import {DataTypes, Model as BaseModel, ModelCtor, Sequelize} from 'sequelize';
import Cli from "../lib/Cli.js";
import AppConfig from "../conf/AppConfig.js";
import {dataPath} from "../lib/dataDir.js";
import fs from "node:fs";
import * as tedious from "tedious";

/**
 * 数据库「纯定义」层。
 * 只负责 Sequelize 实例化、模型/关联声明与连接关闭，**不含任何 import 期副作用**
 * （连接、sync、初始化数据、失败 exit、patch 均在 ./bin/dataBase/bootstrap.ts）。
 * `bin/dataBase/index.ts` 作为 barrel 再导出本模块，保持既有调用点导入路径不变。
 */

export interface ITemplateModel extends BaseModel {
    id: string;
    name: string;
    description: string;
    path: string;
    cover: string;
    gifCover: string;
    createTime: string;
    type: number;
}

export interface IColorModel extends BaseModel {
    id: string;
    value: string;
    cssCode: string;
    type: string;
}

export interface IResourcesModel extends BaseModel {
    id: string;
    name: string;
    template: string;
    filePath: string;
    createTime: string;
    templatePath: string;
    url: string;
    gifPath: string;
    videoCover: string;
    clarity: string;
    status: string;
    taskConfig: string;
}

export interface IUpLoadFilesModel extends BaseModel {
    id: string;
    name: string;
    path: string;
    cover: string;
    createTime: string;
    type: string;
    hash: string;
}

export interface IUpLoadFilesCategoryModel extends BaseModel {
    id: string;
    name: string;
    parentId: string;
}

export const dbType: string = process.env.DATA_BASE_TYPE ?? 'sqlite';

/** sqlite 用 TEXT，mssql 用 NVARCHAR(MAX) */
const LONG_TEXT = DataTypes.TEXT;
export const dbName: string = process.env.DATA_BASE_NAME ?? '';
export const dbUserName: string = process.env.DATA_BASE_USER_NAME ?? '';
export const dbPassWord: string = process.env.DATA_BASE_PASSWORD ?? '';
export const dbHost: string = process.env.DATA_BASE_HOST ?? '';

// tedious v18 默认 encrypt:true，连本地/内网 MSSQL（无 TLS 证书）大概率握手失败。
// 默认关闭加密 + 信任自签证书，可用 DATA_BASE_ENCRYPT=1 / DATA_BASE_TRUST_SERVER_CERTIFICATE=0 收紧。
export const dbEncrypt: boolean = process.env.DATA_BASE_ENCRYPT === '1';
const dbTrustServerCertificate: boolean = process.env.DATA_BASE_TRUST_SERVER_CERTIFICATE !== '0';

interface DatabaseConfig {
    dialect: 'mssql' | 'sqlite';
    host?: string;
    username?: string;
    password?: string;
    database?: string;
    storage?: string;
    dialectModule?: any;
    dialectOptions?: any;
    logging?: boolean | ((sql: string) => void);
    pool?: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
}

// 遗留库文件名笔误 dv_data.ting → dv_data.db。
// 存在旧文件且新文件不存在时先重命名，保证既有本地数据平滑迁移；
// _data/db 目录由 CheckDirectory 负责创建（main.ts 中先于本模块导入）。
const normalizeSqliteStorage = (storage: string): string => {
    const legacyPath: string = storage.replace(/\.db$/, '.ting');

    if (!fs.existsSync(storage) && fs.existsSync(legacyPath)) {
        try {
            fs.renameSync(legacyPath, storage);
            Cli.warn(`已将旧数据库文件重命名：${legacyPath} -> ${storage}`);
        } catch (e) {
            Cli.warn(`旧数据库文件重命名失败：${e}`);
        }
    }

    return storage;
};

const buildDatabaseConfig = (): DatabaseConfig => {
    const commonConfig = {
        logging: AppConfig.__DEV_SERVER ? (sql: string) => Cli.debug(sql) : false,
    };
    const pool = {
        max: 5,
        min: 2,
        acquire: 30000,
        idle: 30000
    };

    if (dbType === 'mssql') {
        if (!dbEncrypt)
            Cli.warn('MSSQL 连接未启用 TLS 加密（DATA_BASE_ENCRYPT!=1）；仅适用于本地/内网，生产请开启加密。');
        return {
            ...commonConfig,
            dialect: 'mssql',
            dialectModule: tedious,
            host: dbHost,
            username: dbUserName,
            password: dbPassWord,
            database: dbName,
            dialectOptions: {
                options: {
                    encrypt: dbEncrypt,
                    trustServerCertificate: dbTrustServerCertificate,
                    enableArithAbort: true
                }
            },
            pool
        };
    }
    return {
        ...commonConfig,
        dialect: 'sqlite',
        // 默认库文件跟着数据根走（DATA_DIR 可整体搬迁 / 指向测试临时目录）；
        // DATA_BASE_SQLITE_STORAGE 保留为显式覆盖口（单库调试、指向已有库）。
        storage: normalizeSqliteStorage(process.env.DATA_BASE_SQLITE_STORAGE ?? dataPath('db', 'dv_data.db')),
        pool
    };
};

export const DB: Sequelize = new Sequelize(buildDatabaseConfig());

export const TemplateModel: ModelCtor<ITemplateModel> = DB.define<ITemplateModel>('lmo_Templates', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING(36)
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    path: DataTypes.STRING,
    cover: DataTypes.STRING,
    gifCover: DataTypes.STRING,
    // createTime 以字符串存数字会使 order:['createTime'] 按字典序排（'9' > '10'）→ BIGINT
    createTime: DataTypes.BIGINT,
    type: DataTypes.INTEGER,
    index: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    dsp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: false,
    // 高频查询列建索引（name/type 过滤 + createTime 排序）
    indexes: [
        {fields: ['name']},
        {fields: ['type']},
        {fields: ['createTime']}
    ]
});

export const ColorModel: ModelCtor<IColorModel> = DB.define<IColorModel>('lmo_Colors', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING(36)
    },
    value: DataTypes.STRING,
    cssCode: DataTypes.STRING,
    // CHAR 定长 1 字符且 sqlite/mssql 行为不一致 → 统一 STRING
    type: DataTypes.STRING
}, {
    timestamps: false
});

export const ResourcesModel: ModelCtor<IResourcesModel> = DB.define<IResourcesModel>('lmo_Resources', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING(36)
    },
    name: DataTypes.STRING,
    template: DataTypes.STRING,
    filePath: DataTypes.STRING,
    // createTime 以字符串存数字会使 order:['createTime'] 按字典序排（'9' > '10'）→ BIGINT
    createTime: DataTypes.BIGINT,
    templatePath: DataTypes.STRING,
    url: DataTypes.STRING,
    gifPath: DataTypes.STRING,
    videoCover: DataTypes.STRING,
    clarity: DataTypes.STRING,
    status: DataTypes.STRING,
    taskConfig: LONG_TEXT
}, {
    timestamps: false,
    // status 过滤 + createTime 排序索引
    indexes: [
        {fields: ['status']},
        {fields: ['createTime']}
    ]
});

export const UpLoadFilesModel: ModelCtor<IUpLoadFilesModel> = DB.define<IUpLoadFilesModel>('lmo_UpLoadFiles', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING(36)
    },
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    cover: DataTypes.STRING,
    // createTime 以字符串存数字会使 order:['createTime'] 按字典序排（'9' > '10'）→ BIGINT
    createTime: DataTypes.BIGINT,
    type: DataTypes.STRING,
    hash: DataTypes.STRING
}, {
    timestamps: false,
    // hash 唯一（配合上传查重）+ createTime 索引
    indexes: [
        {unique: true, fields: ['hash']},
        {fields: ['createTime']}
    ]
});

export const UpLoadFilesCategoryModel: ModelCtor<IUpLoadFilesCategoryModel> = DB.define<IUpLoadFilesCategoryModel>('lmo_UpLoadFilesCategory', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING(36)
    },
    name: DataTypes.STRING
}, {
    timestamps: false
});

UpLoadFilesCategoryModel.hasMany(UpLoadFilesCategoryModel, {
    as: 'subCategory',
    foreignKey: 'parentId'
});
UpLoadFilesCategoryModel.belongsTo(UpLoadFilesCategoryModel, {
    as: 'parentCategory',
    foreignKey: 'parentId'
});
UpLoadFilesModel.belongsTo(UpLoadFilesCategoryModel, {
    foreignKey: 'categoryId'
});

export const close = async (): Promise<void> => {
    await DB?.close?.();
};

export default DB;
