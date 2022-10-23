/**
 * TemplateController.t.ts
 * @description Socket控制器
 * @author ayuanlmp
 * **/

import Conf from "../../conf/Conf.y";
import Message from "../../conf/Message.y";
import CMD from "../../const/CMD.y";
import ServerInf from "../ServerInf.y";
import YingCore from "../Core.y";
import {MessageType, WsType} from "../../interface/SocketController.y";
import {BINARY_TO_STRING, CHECK_264_LIB, CREATE_UUID, STRING_TO_BINARY, STRINGIFY} from "../../utils/Utils.y";

class SocketController {
    private readonly Ws: WsType;
    private readonly OnLineUsers: number;
    private readonly Pool: any;

    constructor(Ws: WsType, OnLineUsers: number, Pool: any) {
        this.Ws = Ws;
        this.OnLineUsers = OnLineUsers;
        this.Pool = Pool;
        this.Connect();
    }

    // Socket连接
    private async Connect(): Promise<void> {
        // 不存在ffmpeg
        if (!Conf.__FFMPEG)
            await this.Ws.send(STRING_TO_BINARY(STRINGIFY({
                type: 'showMessage',
                data: {
                    message: Message.__NO_FFMPEG,
                    timestamp: new Date().getTime()
                }
            })));
        // 检查ffmpeg是否支持 h.264lib
        await CHECK_264_LIB().then((r: boolean) => {
            if (!r)
                this.Ws.send(STRING_TO_BINARY(STRINGIFY({
                    type: 'showMessage',
                    data: {
                        message: Message.__NO_264LIB,
                        timestamp: new Date().getTime()
                    }
                })));
        });
        // 发送基本信息
        await this.Ws.send(STRING_TO_BINARY(STRINGIFY({
            type: 'connect',
            data: {
                onlineUsers: this.OnLineUsers,
                tenantID: `ying-${CREATE_UUID()}`,
                timestamp: new Date().getTime(),
                serverInfo: ServerInf
            }
        })));
        await this.Ws.on('message', (msg: string) => {
            // 心跳消息
            if (msg === Conf.__SOCKET_PONG_KEY)
                return this.Ws.send(Conf.__SOCKET_PONG_MESSAGE);
            try {
                const data: MessageType = JSON.parse(BINARY_TO_STRING(msg));

                if (data.cmd === CMD.__SYNTHESIS)
                    new YingCore(this.Pool, data.data, 0);
                if (data.cmd === CMD.__CREATE_TEMPLATE)
                    new YingCore(this.Pool, data.data, 1);
            } catch (e) {
                // 未知消息
                this.Ws.send(msg);
            }
        });
    }
}

export default SocketController;