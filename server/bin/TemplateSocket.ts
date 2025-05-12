import {IWsApp} from "./WebSocketServer";
import Cli from "../lib/Cli";
import {ResourcesModel, TemplateModel} from "./dataBase";
import AppConfig from "../conf/AppConfig";

class TemplateSocket {
    private readonly WsApp: IWsApp;
    private isOpen: boolean;

    constructor(Ws: IWsApp) {
        this.WsApp = Ws;
        this.isOpen = false;
        this.WsApp.on("message", async (msg: string): Promise<void> => {
            if (msg === AppConfig.__SOCKET_PONG_KEY)
                this.WsApp.send(AppConfig.__SOCKET_PONG_MESSAGE);

            if (this.isOpen) return;
            else {
                try {
                    const {id, template} = JSON.parse(msg);

                    if (!template) {
                        this.isOpen = false;
                        this.WsApp.close();
                    } else {
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
                    }
                } catch (e) {
                    Cli.warn(e);
                    this.isOpen = false;
                    this.WsApp.close();
                }
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
