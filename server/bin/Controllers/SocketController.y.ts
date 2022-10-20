/**
 * TemplateController.t.ts
 * @description Socket控制器
 * @author ayuanlmp
 * **/

import Conf from "../../conf/Conf.y";
import {STRING_TO_BINARY, STRINGIFY, CHECK_264_LIB, BINARY_TO_STRING} from "../../utils/Utils.y";
import Message from "../../conf/Message.y";
import CMD from "../../const/CMD.y";

// Socket消息类型
interface MessageType {
    cmd: string;
    data: object;
}

// WS对象(基础类型)
interface WsType {
    send: any;
    on: any;
}

class SocketController {
    private Ws: WsType;

    constructor(Ws: WsType) {
        this.Ws = Ws;
        this.Connect();
    }

    //Socket连接
    private async Connect(): Promise<void> {
        //不存在ffmpeg
        if (Conf.__FFMPEG)
            await this.Ws.send(STRING_TO_BINARY(STRINGIFY({
                type: 'showMessage',
                data: {
                    message: Message.__NO_FFMPEG,
                    timestamp: new Date().getTime()
                }
            })));
        //检查ffmpeg是否支持 h.264lib
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
        await this.Ws.on('message', (msg: string) => {
            // 心跳消息
            if (msg === Conf.__SOCKET_PONG_KEY)
                return this.Ws.send(Conf.__SOCKET_PONG_MESSAGE);
            try {
                const data: MessageType = JSON.parse(BINARY_TO_STRING(msg));

                if (data.cmd === CMD.__SYNTHESIS) {
                    //TODO 合成
                }
                if (data.cmd === CMD.__CREATE_TEMPLATE) {
                    //TODO 创建模板
                }
            } catch (e) {
                // 未知消息
                this.Ws.send(msg);
            }
        });
    }
}

export default SocketController;