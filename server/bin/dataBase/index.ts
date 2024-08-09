import path = require('path');
import {DataTypes, Sequelize} from 'sequelize';
import Cli from "../../lib/Cli";
import AppConfig from "../../conf/AppConfig";
import initDefaultData from "./init";
import {Process} from "../Process";

const DB: Sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve('./_data/db/dv_data.ting'),
    logging: AppConfig.__DEV_SERVER
});

const TemplateModel = DB.define('Templates', {
    id: {
        primaryKey: true,
        type: DataTypes.TEXT
    },
    name: DataTypes.TEXT,
    description: DataTypes.TEXT,
    path: DataTypes.TEXT,
    cover: DataTypes.TEXT,
    gifCover: DataTypes.TEXT,
    createTime: DataTypes.TEXT,
    type: DataTypes.INTEGER
}, {
    timestamps: false
});

const ColorModel = DB.define('Colors', {
    id: {
        primaryKey: true,
        type: DataTypes.TEXT
    },
    value: DataTypes.TEXT,
    cssCode: DataTypes.TEXT,
    type: DataTypes.INTEGER
}, {
    timestamps: false
});

const ResourcesModel = DB.define('Resources', {
    id: {
        primaryKey: true,
        type: DataTypes.TEXT
    },
    name: DataTypes.TEXT,
    template: DataTypes.TEXT,
    filePath: DataTypes.TEXT,
    createTime: DataTypes.TEXT,
    templatePath: DataTypes.TEXT,
    url: DataTypes.TEXT,
    gifPath: DataTypes.TEXT,
    videoCover: DataTypes.TEXT,
    clarity: DataTypes.TEXT,
    status: DataTypes.TEXT,
    taskConfig: DataTypes.TEXT
}, {
    timestamps: false
});

const UpLoadFilesModel = DB.define('UpLoadFiles', {
    id: {
        primaryKey: true,
        type: DataTypes.TEXT
    },
    name: DataTypes.TEXT,
    path: DataTypes.TEXT,
    cover: DataTypes.TEXT,
    createTime: DataTypes.TEXT,
    type: DataTypes.TEXT,
    hash: DataTypes.TEXT
}, {
    timestamps: false
});

export const UpLoadFilesCategoryModel = DB.define('UpLoadFilesCategory', {
    id: {
        primaryKey: true,
        type: DataTypes.TEXT
    },
    name: DataTypes.TEXT
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
