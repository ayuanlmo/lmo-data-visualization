import { resolve } from "node:path";
import { Writable } from "node:stream";
import pino, { Logger as PinoLogger } from "pino";
import AppConfig from "./../conf/AppConfig.js";
import {dataPath} from "./dataDir.js";

/**
 * 基于 pino + pino-roll 的日志层。
 * - 文件滚动：pino-roll 「按天 + 20MB + 最多 14 份」；
 * - level 由 env 控制：APP_LOG_LEVEL 覆盖，否则开发环境 debug、生产 warn；
 * - 开发环境同时输出到 stdout，生产仅落盘 + stdout（便于 pm2 采集）。
 */
const logDir: string = dataPath('log');
const level: string =
    process.env.APP_LOG_LEVEL ?? (AppConfig.__DEV_SERVER ? 'debug' : 'warn');

const logger: PinoLogger = pino({
    level,
    transport: {
        targets: [
            {
                target: "pino/file",
                level,
                options: { destination: 1 }
            },
            {
                target: "pino-roll",
                level,
                options: {
                    file: resolve(logDir, "lmo-app"),
                    frequency: "daily",
                    size: "20M",
                    mkdir: true,
                    extension: "log",
                    limit: { count: AppConfig.__APP_LOG_MAX_FILE }
                }
            }
        ]
    }
});

/**
 * HTTP 访问日志流：把每一行访问日志作为 info 事件写入 pino。
 */
const HTTPLogStream: Writable = new Writable({
    write(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        const line: string = chunk.toString().trimEnd();
        if (line.length > 0) logger.info(line);
        callback();
    }
});

export default logger;
export { HTTPLogStream };
