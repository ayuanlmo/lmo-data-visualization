import {createConnection, Socket} from 'node:net';
import {ResourcesModel} from "./dataBase";
import {Op} from "sequelize";
import {WebSocketServer} from "./WebSocketServer";
import Cli from "../lib/Cli";

export interface ISocketSendMessage {
    type: string;
    data: any;
}

class SocketClient {
    private client: Socket | undefined;
    private pingInterval: NodeJS.Timeout | undefined;
    private reConnectNumber: number;
    private isFirstConnect: boolean;

    constructor() {
        this.init();
        this.reConnectNumber = 0;
        this.isFirstConnect = true;
    }

    public sendMessage(message: ISocketSendMessage): void {
        this.client?.write(JSON.stringify(message));
    }

    private init(): void {
        if (this.reConnectNumber === 5) return
        this.client = createConnection(3002, '0.0.0.0');
        this.client.on('connect', (): void => {
            Cli.warn('Connected to server');
            this.startPing();
            this.reConnectNumber = 0;
            if (!this.isFirstConnect) {
                WebSocketServer.sendMessage(JSON.stringify({
                    type: 'SERVICE_RE_CONNECT_SUCCESS',
                    message: {}
                }));
            }
        });
        this.client.on('close', (): void => {
            Cli.warn('Connection closed, attempting to reconnect');
            this.reconnect();
            this.isFirstConnect = false;
            WebSocketServer.sendMessage(JSON.stringify({
                type: 'SERVICE_CONNECT_CLOSE',
                message: {}
            }));

        });
        this.client.on('error', (e: Error): void => {
            Cli.debug('Connection error:', e);
            this.isFirstConnect = false;
            this.reconnect();
            WebSocketServer.sendMessage(JSON.stringify({
                type: 'SERVICE_RE_CONNECT_ERROR',
                message: {}
            }));
        });
        this.client.on('data', this.onData);
    }

    private startPing(): void {
        this.pingInterval = setInterval(() => {
            this.client?.write('ping');
        }, 10000);
    }

    private stopPing(): void {
        if (this.pingInterval)
            clearInterval(this.pingInterval);
    }

    private reconnect(): void {
        this.stopPing();
        this.reConnectNumber++;
        this.client?.removeAllListeners();
        this.client?.destroy();
        setTimeout((): void => {
            this.init();
        }, 3000);
    }

    private onData = (msg: Buffer): void => {
        if (msg.toString() !== 'pong') {
            const {data, type} = JSON.parse(msg.toString());

            // 合成结束
            if (type === 'TASK_END') {
                ResourcesModel.update({
                    filePath: `/static/output/${data?.id}.mp4`
                }, {
                    where: {
                        id: {[Op.like]: `${data?.id}`}
                    }
                }).then((): void => {
                    ResourcesModel.findOne({
                        where: {
                            id: data?.id
                        }
                    }).then(resources => {
                        WebSocketServer.sendMessage(JSON.stringify({
                            type: type,
                            message: {
                                id: data?.id,
                                name: resources?.dataValues.name,
                                filePath: `/static/output/${data?.id}.mp4`
                            }
                        }));
                    });
                });
            }
        }
    }
}

const socketClient: SocketClient = new SocketClient();

export default socketClient;