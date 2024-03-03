import path = require('path');
import {DataTypes, Sequelize} from 'sequelize';
import Cli from "../../lib/Cli";
import AppConfig from "../../conf/AppConfig";

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
    createTime: DataTypes.TEXT,
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
    createTime: DataTypes.TEXT,
    type: DataTypes.TEXT
}, {
    timestamps: false
});

((): void => {
    try {
        (async (): Promise<void> => {
            await DB.authenticate();
            DB.sync().then((): void => {
                Cli.debug('Models synced successfully.');
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
