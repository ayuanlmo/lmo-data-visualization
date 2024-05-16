import path = require('path');
import {DataTypes, Sequelize} from 'sequelize';
import Cli from "../../lib/Cli";
import AppConfig from "../../conf/AppConfig";
import initDefaultData from "./init";

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
    type: DataTypes.TEXT
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

((): void => {
    try {
        (async (): Promise<void> => {
            await DB.authenticate();
            DB.sync().then(async (): Promise<void> => {
                Cli.debug('Models synced successfully.');
                await initDefaultData();
            });
        })();
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
