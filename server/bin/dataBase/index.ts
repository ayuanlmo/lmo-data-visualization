import {DataTypes, Model as BaseModel, ModelCtor, Sequelize} from 'sequelize';
import Cli from "../../lib/Cli";
import initDefaultData from "./init";
import {Process} from "../Process";
import AppConfig from "../../conf/AppConfig";
import path from "path";
import {patchSequelize} from "./patchSequelize";

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

const dbType: string = process.env.DATA_BASE_TYPE ?? 'sqlite';
const dbName: string = process.env.DATA_BASE_NAME ?? '';
const dbUserName: string = process.env.DATA_BASE_USER_NAME ?? '';
const dbPassWord: string = process.env.DATA_BASE_PASSWORD ?? '';
const dbHost: string = process.env.DATA_BASE_HOST ?? '';
const usePatch: boolean = process.env.USE_PATCH_CAPTURE_SQL_ERRORS === '1';

const DANGEROUS_SQL_SERVER_ACCOUNT: string = 'sa' as const;

if (dbType === 'mssql' && dbUserName?.trim().toLowerCase() === DANGEROUS_SQL_SERVER_ACCOUNT && !AppConfig.__DEV_SERVER)
    throw new Error('Please do not use "sa" as your database username');

interface DatabaseConfig {
    dialect: 'mssql' | 'sqlite';
    host?: string;
    username?: string;
    password?: string;
    database?: string;
    storage?: string;
    dialectModule?: any;
    logging?: boolean | ((sql: string) => void);
    pool?: {
        max: number;
        min: number;
        acquire: number;
        idle: number;
    };
}

const buildDatabaseConfig = (): DatabaseConfig => {
    const commonConfig = {
        logging: AppConfig.__DEV_SERVER,
    };
    const pool = {
        max: 5,
        min: 2,
        acquire: 30000,
        idle: 30000
    };

    if (dbType === 'mssql')
        return {
            ...commonConfig,
            dialect: 'mssql',
            dialectModule: require('tedious'),
            host: dbHost,
            username: dbUserName,
            password: dbPassWord,
            database: dbName,
            pool
        };
    return {
        ...commonConfig,
        dialect: 'sqlite',
        storage: path.resolve('./_data/db/dv_data.ting'),
        pool
    };
};

const DB: Sequelize = new Sequelize(buildDatabaseConfig());

const TemplateModel: ModelCtor<ITemplateModel> = DB.define<ITemplateModel>('lmo_Templates', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING(36)
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    path: DataTypes.STRING,
    cover: DataTypes.STRING,
    gifCover: DataTypes.STRING,
    createTime: DataTypes.STRING,
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
    timestamps: false
});

const ColorModel: ModelCtor<IColorModel> = DB.define<IColorModel>('lmo_Colors', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING(36)
    },
    value: DataTypes.STRING,
    cssCode: DataTypes.STRING,
    type: DataTypes.CHAR
}, {
    timestamps: false
});

const ResourcesModel: ModelCtor<IResourcesModel> = DB.define<IResourcesModel>('lmo_Resources', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING(36)
    },
    name: DataTypes.STRING,
    template: DataTypes.STRING,
    filePath: DataTypes.STRING,
    createTime: DataTypes.STRING,
    templatePath: DataTypes.STRING,
    url: DataTypes.STRING,
    gifPath: DataTypes.STRING,
    videoCover: DataTypes.STRING,
    clarity: DataTypes.STRING,
    status: DataTypes.STRING,
    taskConfig: DataTypes.STRING('max')
}, {
    timestamps: false
});

const UpLoadFilesModel: ModelCtor<IUpLoadFilesModel> = DB.define<IUpLoadFilesModel>('lmo_UpLoadFiles', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING(36)
    },
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    cover: DataTypes.STRING,
    createTime: DataTypes.STRING,
    type: DataTypes.STRING,
    hash: DataTypes.STRING
}, {
    timestamps: false
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

(async (): Promise<void> => {
    try {
        await DB.authenticate();
        await DB.sync();
        await initDefaultData();
        await ResourcesModel.update({
            status: 'error'
        }, {
            where: {
                status: 'pending'
            }
        });
        Process.ready();
        Cli.debug('Models synced successfully.');
    } catch (error) {
        Cli.warn('Unable to connect to the database:', error);
        process.exit(0);
    }
})();

if (usePatch)
    patchSequelize(DB);

export default DB;
export {TemplateModel};
export {ResourcesModel};
export {UpLoadFilesModel};
export {ColorModel};
