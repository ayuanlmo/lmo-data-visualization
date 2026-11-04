import Logger from "./Log.js";

/**
 * Cli 是 pino（Logger）的薄封装：统一走 Logger，使 APP_LOG_LEVEL 过滤生效、避免双重输出。
 */
const format = (Args: any[]): string => Args.map((arg: any): string => {
    if (typeof arg === 'object' && arg !== null) {
        try {
            return JSON.stringify(arg);
        } catch {
            return String(arg);
        }
    }
    return String(arg);
}).join(' ');

namespace Cli {
    export const debug = (...Args: any[]): void => Logger.debug(format(Args));
    export const log = (...Args: any[]): void => Logger.info(format(Args));
    export const warn = (...Args: any[]): void => Logger.warn(format(Args));
    export const error = (...Args: any[]): void => Logger.error(format(Args));
}

export default Cli;
