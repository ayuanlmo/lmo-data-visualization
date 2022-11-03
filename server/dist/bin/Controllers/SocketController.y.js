"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Conf_y_1 = require("../../conf/Conf.y");
const Message_y_1 = require("../../conf/Message.y");
const CMD_y_1 = require("../../const/CMD.y");
const ServerInf_y_1 = require("../ServerInf.y");
const Core_y_1 = require("../Core.y");
const Utils_y_1 = require("../../utils/Utils.y");
class SocketController {
    constructor(Ws, OnLineUsers, Pool) {
        this.Ws = Ws;
        this.OnLineUsers = OnLineUsers;
        this.Pool = Pool;
        this.Connect();
    }
    Connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Conf_y_1.default.__FFMPEG)
                yield this.Ws.send((0, Utils_y_1.STRING_TO_BINARY)((0, Utils_y_1.STRINGIFY)({
                    type: 'showMessage',
                    data: {
                        message: Message_y_1.default.__NO_FFMPEG,
                        timestamp: new Date().getTime()
                    }
                })));
            yield (0, Utils_y_1.CHECK_264_LIB)().then((r) => {
                if (!r)
                    this.Ws.send((0, Utils_y_1.STRING_TO_BINARY)((0, Utils_y_1.STRINGIFY)({
                        type: 'showMessage',
                        data: {
                            message: Message_y_1.default.__NO_264LIB,
                            timestamp: new Date().getTime()
                        }
                    })));
            });
            yield this.Ws.send((0, Utils_y_1.STRING_TO_BINARY)((0, Utils_y_1.STRINGIFY)({
                type: 'connect',
                data: {
                    onlineUsers: this.OnLineUsers,
                    tenantID: `ying-${(0, Utils_y_1.CREATE_UUID)()}`,
                    timestamp: new Date().getTime(),
                    serverInfo: ServerInf_y_1.default
                }
            })));
            yield this.Ws.on('message', (msg) => {
                if (msg === Conf_y_1.default.__SOCKET_PONG_KEY)
                    return this.Ws.send(Conf_y_1.default.__SOCKET_PONG_MESSAGE);
                try {
                    const data = JSON.parse((0, Utils_y_1.BINARY_TO_STRING)(msg));
                    if (data.cmd === CMD_y_1.default.__SYNTHESIS)
                        new Core_y_1.default(this.Pool, data.data, 0);
                    if (data.cmd === CMD_y_1.default.__CREATE_TEMPLATE)
                        new Core_y_1.default(this.Pool, data.data, 1);
                }
                catch (e) {
                    this.Ws.send(msg);
                }
            });
        });
    }
}
exports.default = SocketController;
//# sourceMappingURL=SocketController.y.js.map