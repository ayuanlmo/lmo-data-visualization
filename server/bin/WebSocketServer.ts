import AppConfig from "../conf/AppConfig";
import OS from "node:os";

const platform: string = OS.platform();
const cpuName: string = OS.cpus()[0].model;
const arch: string = OS.arch();

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

    public static sendMessage(message: string): void {
        const _: any = global;

        _.WebSocketPool?.getWss()?.clients?.forEach((ws: IWsApp): void => {
            ws.send?.(message);
        });
    }

    private initConnect(): void {
        this.WsApp.send?.(JSON.stringify({
            type: 'connect',
            success: true,
            onLineUser: this.OnLineUsers,
            serverInfo: {
                __isX86Windows: platform === 'win32' && arch === 'x64',
                __isArmWindows: platform === 'win32' && arch === 'arm64',
                __isLinux: platform === 'linux',
                __isIntelMac: platform === 'darwin' && arch === 'x64',
                __isAppleSiliconMac: platform === 'darwin' && arch === 'arm64' && cpuName.includes('Apple'),
                __enCoding: 'CPU.H264',
                __cpuEnCode: {
                    __AMD: cpuName.includes('AMD'),
                    __Intel: cpuName.includes('Intel'),
                    __AppleSilicon: cpuName.includes('Apple')
                }
            }
        }));
        const _: any = global;

        this.WsApp.on('message', (msg: string): void => {
            if (msg === AppConfig.__SOCKET_PONG_KEY)
                return this.WsApp.send(AppConfig.__SOCKET_PONG_MESSAGE);

            try {
                const data = JSON.parse(msg);
                const keys: Array<string> = Object.keys(data);

                if ('cmd' in keys && 'data' in keys) {
                    if (data.cmd === '__ABORT_RENDER') {
                        _.TemplateWsPool?.clients?.forEach((ws: IWsApp): void => {
                            ws.send?.(JSON.stringify({
                                id: data.id,
                                _signal: "__ABORT_RENDER"
                            }));
                        });
                    }
                } else
                    this.WsApp.send(msg);
            } catch (e) {
                this.WsApp.send(msg);
            }
        });
    }
}
