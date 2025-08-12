import {createStream, RotatingFileStream} from "rotating-file-stream";
import {resolve} from "path";
import {createLogger, format, Logger, transports} from "winston";
import AppConfig from "../conf/AppConfig";

const {combine, timestamp, label, printf} = format;
const logDir: string = resolve(__dirname, "../_data/log");
const HTTPLogStream: RotatingFileStream = createStream((time: number | Date): any => {
    if (!time) return "lmo-app-log.h.t.log";
    if (time instanceof Date) {
        const pad = (num: number): string => (num > 9 ? "" : "0") + num;
        const year: number = time.getFullYear();
        const month: string = time.getFullYear() + "" + pad(time.getMonth() + 1);
        const day: string = pad(time.getDate());

        return `lmo-app-log.${year}${month}${day}.o.h.t.log`;
    }
}, {
    interval: '1d',
    path: logDir,
    maxFiles: AppConfig.__APP_LOG_MAX_FILE,
    compress: 'gzip'
});
const customFormat = printf(info => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger: Logger = createLogger({
    level: AppConfig.__APP_LOG_LEVEL,
    format: combine(
        label({label: 'app-log'}),
        timestamp(),
        customFormat
    ),
    transports: [
        new transports.File({
            filename: 'lmo-app.t.log',
            dirname: logDir,
            level: AppConfig.__APP_LOG_LEVEL,
            maxFiles: AppConfig.__APP_LOG_MAX_FILE,
            maxsize: AppConfig.__APP_LOG_FILE_MAX_SIZE,
            tailable: true
        }),
        new transports.Console(),
    ],
});

export default logger;
export {HTTPLogStream};
