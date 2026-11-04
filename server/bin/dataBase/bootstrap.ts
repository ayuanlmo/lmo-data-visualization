import Logger from "../../lib/Log.js";
import Cli from "../../lib/Cli.js";
import AppConfig from "../../conf/AppConfig.js";
import initDefaultData from "./init.js";
import {Process} from "../Process.js";
import {createMigrator} from "../../repository/umzug.js";
import {DB, dbType, dbUserName, ResourcesModel} from "../../repository/models.js";

/**
 * 数据库显式初始化层，无 import 期副作用。
 * 由 main.ts 在进程启动流程中显式 await 调用，连接失败以非 0 退出。
 */

const DANGEROUS_SQL_SERVER_ACCOUNT: string = 'sa';

/** 配置校验：非 dev 环境使用 sa 账号 → 记录并退出。 */
const validateDatabaseConfig = (): void => {
    if (dbType === 'mssql' && dbUserName?.trim().toLowerCase() === DANGEROUS_SQL_SERVER_ACCOUNT && !AppConfig.__DEV_SERVER) {
        Logger.error('Please do not use "sa" as your database username');
        process.exit(1);
    }
};

export const bootstrapDatabase = async (): Promise<void> => {
    validateDatabaseConfig();

    try {
        await DB.authenticate();

        // 生产可用 DATA_BASE_MIGRATIONS=1 走 Umzug 迁移；开发期默认 DB.sync() 兜底。
        if (process.env.DATA_BASE_MIGRATIONS === '1') {
            await createMigrator(DB).up();
            Cli.debug('Database migrations applied (umzug).');
        } else {
            await DB.sync();
            Cli.debug('Models synced via sequelize.sync() (dev fallback).');
        }

        await initDefaultData();
        // 进程重启后，遗留在 pending 的任务无法续跑，统一置为 error
        await ResourcesModel.update({
            status: 'error'
        }, {
            where: {
                status: 'pending'
            }
        });
        Process.ready();
    } catch (error) {
        // 不能静默 exit(0)：PM2 会把退出码 0 视为正常退出而不重启，
        // 导致数据库故障时服务"安静地死掉"且无任何可观测信息
        Cli.warn('Unable to connect to the database:', error);
        Logger.error(`Database initialization failed: ${error instanceof Error ? error.stack : String(error)}`);
        process.exit(1);
    }
};
