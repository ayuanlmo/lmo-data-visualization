import {createServer, Server, Socket} from 'node:net';
import AppConfig from "../config/AppConfig";
import Cli from "cli-color";
import wvc, {ICreateTaskConfig} from "./wvc";
import ffmpeg from "./ffmpeg";

class SocketServer {
    private readonly server: Server;
    private socket: Socket | undefined;

    constructor() {
        this.server = createServer((socket: Socket): void => {
            this.socket = socket;
        });
        this.server.on('connection', (socket: Socket): void => {
            this.onConnection(socket);
        });
        this.server.listen(AppConfig.__SOCKET_SERVER_PORT, '0.0.0.0', (): void => {
            console.log(Cli.bgBlue('Synthetic-Service-Socket-Server'), Cli.yellow('started on port'), Cli.red(AppConfig.__SOCKET_SERVER_PORT));
        });
    }

    public sendMessage(message: string): void {
        this.socket && this.socket.write(message);
    }

    private onConnection(socket: Socket): void {
        socket.on('data', (data: Buffer): void => {
            const _data: string = data.toString();

            if (_data === AppConfig.__SOCKET_PING_KEY)
                return this.sendMessage(AppConfig.__SOCKET_PONG_KEY);

            try {
                const message: {
                    type: string;
                    data: string;
                } = JSON.parse(_data);

                if (message.type === 'GENERATING-AUDIO-VISUALIZATIONS') {
                    const _ = JSON.parse(message.data);

                    ffmpeg.getAudioVisualizationDiagram(_?.audioPath ?? '', _?.optPath ?? '').then((r: string): void => {
                        this.sendMessage(JSON.stringify({
                            type: "GENERATING_AUDIO_VISUALIZATIONS",
                            data: {
                                path: r
                            }
                        }));
                    });
                }
                if (message.type === 'COMPOSITE-VIDEO') {
                    wvc.init({
                        ...JSON.parse(message.data) as unknown as ICreateTaskConfig
                    }, ({progress, id}): void => {
                        this.sendMessage(JSON.stringify({
                            type: "TASK_PROGRESS_CHANGE",
                            data: {
                                id, progress
                            }
                        }));
                    }).then((res): void => {
                        this.sendMessage(JSON.stringify({
                            type: "TASK_END",
                            data: {
                                id: res.id,
                                ...res
                            }
                        }));
                    });
                }

                this.sendMessage(AppConfig.__SOCKET_PONG_KEY);
            } catch (e) {
                console.log(e);
            }
        });
    }
}

export default new SocketServer();
