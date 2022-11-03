"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_y_1 = require("../utils/Utils.y");
exports.default = {
    __SERVER_PORT: 3000,
    __STATIC_PATH: '/static',
    __SOCKET_PONG_KEY: 'ping',
    __SOCKET_PONG_MESSAGE: 'pong',
    __LIVE_SERVER: false,
    __FFMPEG: (0, Utils_y_1.CMD_EXISTS)('ffmpeg')
};
//# sourceMappingURL=Conf.y.js.map