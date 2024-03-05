import AppConfig from "../conf/AppConfig";

export interface IWsApp {
    send: (msg: string) => void;
    close: () => void;
    on: (key: string, cb: (msg: string) => void) => void;
}

export class WebSocketServer {
    private readonly WsApp: IWsApp;
    private readonly OnLineUsers: number;
    private readonly Pool: Array<IWsApp>;

    constructor(Ws: IWsApp, OnLineUsers: number, Pool: Array<IWsApp>) {
        this.WsApp = Ws;
        this.OnLineUsers = OnLineUsers;
        this.Pool = Pool;
        this.initConnect();
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

            try {
                const data = JSON.parse(msg);
                const keys: Array<string> = Object.keys(data);

                if ('cmd' in keys && 'data' in keys) {
                    console.log(data);
                } else {
                    this.WsApp.send(msg);
                }
            } catch (e) {
                this.WsApp.send(msg);
            }
        });
    }
}
