import {Sequelize} from 'sequelize';
import {Umzug} from 'umzug';
import {SequelizeStorage} from 'umzug/lib/storage/sequelize.js';
import {migrations} from "./migrations.js";
import Cli from "../lib/Cli.js";

/**
 * 以 Umzug 管理 sqlite/mssql 双方言迁移。
 * 生产用 `DATA_BASE_MIGRATIONS=1` 走迁移；开发期保留 `sync` 兜底（见 bootstrap）。
 */
export function createMigrator(db: Sequelize): Umzug<Sequelize> {
    return new Umzug({
        // 内联数组（编译产物稳定、无 glob/路径解析歧义），Umzug 依 name 排序执行
        migrations,
        context: db,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        storage: new SequelizeStorage({sequelize: db} as any),
        logger: {
            info: (msg: unknown): void => Cli.debug(`[umzug] ${JSON.stringify(msg)}`),
            warn: (msg: unknown): void => Cli.warn(`[umzug] ${JSON.stringify(msg)}`),
            error: (msg: unknown): void => Cli.warn(`[umzug] ${JSON.stringify(msg)}`),
            debug: (msg: unknown): void => Cli.debug(`[umzug] ${JSON.stringify(msg)}`)
        }
    });
}
