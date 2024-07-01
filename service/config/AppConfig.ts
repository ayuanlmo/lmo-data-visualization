import process from 'process';

const AppConfig = {
    __APP_NAME: 'lmo-Data-Visualization-Synthesis-Service-Application',
    __HTTP_SERVER_PORT: 3002,
    __SOCKET_SERVER_PORT: 3002,
    __SOCKET_PONG_KEY: 'pong',
    __SOCKET_PING_KEY: 'ping',
    __OPEN_BROWSER: false
} as const;

export default AppConfig;

((): void => {
    process.title = AppConfig.__APP_NAME;
})();
