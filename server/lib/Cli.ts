namespace Cli {
    const cli_color: any = require('cli-color');
    export const debug = (...Args: any[]): void => console.log(cli_color.bgGreen('Debug:'), ...Args);
    export const log = (...Args: any[]): void => console.log(cli_color.bgGreen('Log:'), ...Args);
    export const warn = (...Args: any[]): void => console.warn(cli_color.bgYellow('Warn:'), ...Args);
}

export default Cli;
