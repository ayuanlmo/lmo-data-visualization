import {CMD_EXISTS} from "../utils/Utils.y";

export default {
    __SERVER_PORT: 3000,
    __STATIC_PATH: '/static',
    __SOCKET_PONG_KEY: 'ping',
    __SOCKET_PONG_MESSAGE: 'pong',
    __LIVE_SERVER: false,
    __FFMPEG: CMD_EXISTS('ffmpeg')
};