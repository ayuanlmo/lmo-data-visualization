import {createConnection, Socket} from 'node:net';
import {ResourcesModel} from "./dataBase";
import {Op} from "sequelize";
import {WebSocketServer} from "./WebSocketServer";

export interface ISocketSendMessage {
    type: string;
    data: any;
}

class SocketClient {
    private client: Socket | undefined;

    constructor() {
        this.init();
    }

    public sendMessage(message: ISocketSendMessage): void {
        this.client?.write(JSON.stringify(message));
    }

    private init(): void {
        this.client = createConnection(3002, '0.0.0.0');
        this.client.on('connect', (): void => {
            setInterval((): void => {
                this.client?.write('ping')
            }, 10000);
        });
        this.client.on('close', (): void => {
            this.init();
        });
        this.client.on('error', (e: Error): void => {
            this.init();
        });
        this.client.on('data', this.onData);
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