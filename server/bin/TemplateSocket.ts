import {IWsApp} from "./WebSocketServer.js";
import Logger from "./../lib/Log.js";
import {ResourcesModel, TemplateModel} from "./dataBase/index.js";
import AppConfig from "./../conf/AppConfig.js";
import {templateHandshakeMessage} from "../router/schemas.js";

class TemplateSocket {
    private readonly WsApp: IWsApp;
    private isOpen: boolean;

    constructor(Ws: IWsApp) {
        this.WsApp = Ws;
        this.isOpen = false;
        this.WsApp.on("message", async (msg: string): Promise<void> => {
            if (msg === AppConfig.__SOCKET_PONG_KEY) {
                this.WsApp.send(AppConfig.__SOCKET_PONG_MESSAGE);
                return;
            }

            if (this.isOpen) return;

            // 握手消息过 Zod（{id, template}），非法 JSON / 结构不符 → 断开
            let parsed: unknown;

            try {
                parsed = JSON.parse(msg);
            } catch (e) {
                Logger.warn(e);
                this.isOpen = false;
                return void this.WsApp.close();
            }

            const result = templateHandshakeMessage.safeParse(parsed);

            if (!result.success || !result.data.template) {
                this.isOpen = false;
                return void this.WsApp.close();
            }

            const {id, template} = result.data;

            try {
                const task = await ResourcesModel.findOne({
                    where: {
                        id
                    }
                });

                const _template = await TemplateModel.findOne({
                    where: {
                        id: template
                    }
                });

                if (_template && task) {
                    this.isOpen = true;
                    this.WsApp.send('open');
                } else
                    this.WsApp.close();
            } catch (e) {
                Logger.warn(e);
                this.isOpen = false;
                this.WsApp.close();
            }
        });
        setTimeout((): void => {
            if (!this.isOpen)
                this.WsApp.close();
        }, 3000);
    }

    public sendMessage(message: string): void {
        this.WsApp.send(message);
    }
}

export default TemplateSocket;
