import Logger from "./Log";

namespace Cli {
    const cli_color: any = require('cli-color');
    export const debug = (...Args: any[]): void => console.log(cli_color.bgGreen('Debug:'), ...Args);
    export const log = (...Args: any[]): void => console.log(cli_color.bgGreen('Log:'), ...Args);
    export const warn = (...Args: any[]): void => {
        const message: string = Args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                return JSON.stringify(arg, null, 2);
            }
            return String(arg);
        }).join(' ');

        Logger.warn(message);
        console.warn(cli_color.bgYellow('Warn:'), ...Args);
    };
}

export default Cli;
