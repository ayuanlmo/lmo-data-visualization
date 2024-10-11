import {DataTypes, Sequelize} from 'sequelize';
import Cli from "../../lib/Cli";
import initDefaultData from "./init";
import {Process} from "../Process";
import AppConfig from "../../conf/AppConfig";
import path from "path";

const {
    dbType,
    dbName,
    dbUserName,
    dbPassWord,
    dbHost
} = AppConfig.__ARGV;

const DB: Sequelize = dbType === 'mssql' ?
    new Sequelize(dbName, dbUserName, dbPassWord, {
        host: dbHost,
        dialect: 'mssql',
        dialectModule: require('tedious'),
        logging: AppConfig.__DEV_SERVER
    }) :
    new Sequelize({
        dialect: 'sqlite',
        storage: path.resolve('./_data/db/dv_data.ting'),
        logging: AppConfig.__DEV_SERVER
    });

const TemplateModel = DB.define('Templates', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    path: DataTypes.STRING,
    cover: DataTypes.STRING,
    gifCover: DataTypes.STRING,
    createTime: DataTypes.STRING,
    type: DataTypes.INTEGER
}, {
    timestamps: false
});

const ColorModel = DB.define('Colors', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING
    },
    value: DataTypes.STRING,
    cssCode: DataTypes.STRING,
    type: DataTypes.CHAR
}, {
    timestamps: false
});

const ResourcesModel = DB.define('Resources', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING
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
    taskConfig: DataTypes.STRING
}, {
    timestamps: false
});

const UpLoadFilesModel = DB.define('UpLoadFiles', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING
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

export const UpLoadFilesCategoryModel = DB.define('UpLoadFilesCategory', {
    id: {
        primaryKey: true,
        type: DataTypes.STRING
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

export default DB;
export {TemplateModel};
export {ResourcesModel};
export {UpLoadFilesModel};
export {ColorModel};
