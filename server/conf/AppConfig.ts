export interface ParsedArgs {
    [key: string]: string | any;
}

export type TAppModeType = 'development' | 'live-server' | 'prod';

const AppConfig = {
    __APP_NAME: 'lmo-Data-Visualization-Server-Application',
    __APP_AUTHOR: 'ayuanlmo',
    __SERVER_PORT: process.env.PORT || 3000,
    __STATIC_PATH: '/static',
    __SOCKET_CONNECT: '/connect',
    __SOCKET_PONG_KEY: 'ping',
    __SOCKET_PONG_MESSAGE: 'pong',
    __DEV_SERVER: process.env.NODE_ENV !== 'prod',
    __LIVE_SERVER: process.env.NODE_ENV === 'live-server',
    __PROTECTED_STATIC_FILES: ['.ts', '.bin', 'config.json', 'package.json', 'tsconfig.json', '.pug'],
    __PROTECTED_ROUTERS: ['uploadFile', 'template/copy', 'createTask', 'uploadFileCategory', 'createCustomTemplate']
} as const;

export default AppConfig;
