import {CMD_EXISTS} from "../utils/Utils.y";

export default {
    __SERVER_PORT: 3000, // 起始端口范围
    __SERVER_MAX_PORT: 3010, // 结束端口范围
    __STATIC_PATH: '/static', // 静态文件路径
    __SOCKET_PONG_KEY: 'ping', // 套接字ping键
    __SOCKET_PONG_MESSAGE: 'pong', // 套接字pong键
    __LIVE_SERVER: false, // 演示服务器
    __FFMPEG: CMD_EXISTS('ffmpeg') // 存在ffmpeg
};