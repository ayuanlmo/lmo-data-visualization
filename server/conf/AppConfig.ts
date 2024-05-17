import OS from "node:os";

const _ENV: string = process.env.NODE_ENV as string;
const AppConfig = {
    __APP_NAME: 'lmo-Data-Visualization-Server-Application',
    __APP_AUTHOR: 'ayuanlmo',
    __SERVER_PORT: 3000,
    __STATIC_PATH: '/static',
    __SOCKET_CONNECT: '/connect',
    __SOCKET_PONG_KEY: 'ping',
    __SOCKET_PONG_MESSAGE: 'pong',
    __DEV_SERVER: _ENV.trim() === 'development',
    __LIVE_SERVER: _ENV.trim() === 'liveServer',
    __MAX_PROCESS: OS.cpus().length,
    __AUTO_FORK: true
} as const;

export default AppConfig;
