import {env} from "./env.js";

const AppConfig = {
    __APP_NAME: 'lmo-Data-Visualization-Server-Application',
    __APP_AUTHOR: 'ayuanlmo',
    // 端口统一为 number（env.PORT 已经 zod 校验+强制转换）
    __SERVER_PORT: env.PORT,
    __STATIC_PATH: '/static',
    __SOCKET_CONNECT: '/connect',
    __SOCKET_PONG_KEY: 'ping',
    __SOCKET_PONG_MESSAGE: 'pong',
    __DEV_SERVER: env.NODE_ENV !== 'prod',
    __LIVE_SERVER: env.NODE_ENV === 'live-server',
    __PROTECTED_STATIC_FILES: ['.ts', '.bin', 'config.json', 'package.json', 'tsconfig.json', '.pug'],
    __PROTECTED_ROUTERS: ['uploadFile', 'template/copy', 'createTask', 'uploadFileCategory', 'createCustomTemplate', 'uploadTemplate'],
    __APP_LOG_MAX_FILE: 14,
    __APP_LOG_LEVEL: 'warn',
    __APP_LOG_FILE_MAX_SIZE: 20 * 1024 * 1024,
} as const;

export default AppConfig;
