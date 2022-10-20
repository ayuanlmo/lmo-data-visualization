module.exports = {
    __SERVER_PORT: 3000,
    __STATIC_PATH: '/static',
    __SOCKET_PONG_KEY: 'ping',
    __SOCKET_PONG_MESSAGE: 'pong',
    __LIVE_SERVER: false,
    __FFMPEG: require('../utils/utils.t').CMD_EXISTS('ffmpeg')
};
