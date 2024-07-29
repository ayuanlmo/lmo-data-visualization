export interface ParsedArgs {
    [key: string]: string | boolean;
}

export type TAppModeType = 'development' | 'live-server' | 'prod';

export interface IArgsParams {
    p: string;
    mode: TAppModeType;
}

function getArgvParams(): IArgsParams {
    const args: string[] = process.argv.slice(2);
    const parsedArgs: ParsedArgs = {};
    let currentKey: string | null = null;

    for (let i: number = 0; i < args.length; i++) {
        if (args[i].startsWith('-')) {
            currentKey = args[i].slice(1);
            parsedArgs[currentKey] = true;
        } else if (currentKey) {
            parsedArgs[currentKey] = args[i];
            currentKey = null;
        }
    }

    return parsedArgs as unknown as IArgsParams;
}

const argv: IArgsParams = getArgvParams();
const AppConfig = {
    __APP_NAME: 'lmo-Data-Visualization-Server-Application',
    __APP_AUTHOR: 'ayuanlmo',
    __SERVER_PORT: Number(argv.p) || 3000,
    __STATIC_PATH: '/static',
    __SOCKET_CONNECT: '/connect',
    __SOCKET_PONG_KEY: 'ping',
    __SOCKET_PONG_MESSAGE: 'pong',
    __DEV_SERVER: argv.mode === 'development',
    __LIVE_SERVER: argv.mode === 'live-server',
    __ARGV: argv as IArgsParams,
    __PROTECTED_STATIC_FILES: ['.ts', '.bin', 'config.json', 'package.json', 'tsconfig.json', '.pug'],
    __PROTECTED_ROUTERS: ['uploadFile', 'template/copy', 'createTask', 'uploadFileCategory']
} as const;

export default AppConfig;
