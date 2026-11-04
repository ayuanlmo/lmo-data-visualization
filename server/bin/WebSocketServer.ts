import AppConfig from "./../conf/AppConfig.js";
import {WsHub} from "./../lib/wsHub.js";
import {abortRenderMessage} from "../router/schemas.js";

export interface IWsApp {
    send: (msg: string) => void;
    close: () => void;
    on: (key: string, cb: (msg: string) => void) => void;
}

export class WebSocketServer {
    private readonly WsApp: IWsApp;
    private readonly OnLineUsers: number;

    constructor(Ws: IWsApp, OnLineUsers: number) {
        this.WsApp = Ws;
        this.OnLineUsers = OnLineUsers;
        this.initConnect();
    }

    /** 经 WsHub 定向广播。 */
    public static sendMessage(message: string): void {
        WsHub.broadcastToClients(message);
    }

    private initConnect(): void {
        this.WsApp.send?.(JSON.stringify({
            type: 'connect',
            success: true,
            onLineUser: this.OnLineUsers
        }));

        this.WsApp.on('message', (msg: string): void => {
            if (msg === AppConfig.__SOCKET_PONG_KEY)
                return this.WsApp.send(AppConfig.__SOCKET_PONG_MESSAGE);

            // 结构化消息过 Zod，仅接受 {cmd:'__ABORT_RENDER', id}；其余一律不回显（避免反射回显）
            let parsed: unknown;

            try {
                parsed = JSON.parse(msg);
            } catch {
                return; // 非 JSON：忽略
            }

            const result = abortRenderMessage.safeParse(parsed);

            if (result.success)
                WsHub.broadcastToTemplates(JSON.stringify({
                    id: result.data.id,
                    _signal: "__ABORT_RENDER"
                }));
        });
    }
}
