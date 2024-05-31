import {createServer, Server, Socket} from 'node:net';
import AppConfig from "../config/AppConfig";
import Cli from "cli-color";

class SocketServer {
    private readonly server: Server;
    private socket: Socket | null;

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
        this.socket = null;
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

                }
                if (message.type === 'COMPOSITE-VIDEO') {

                }

                this.sendMessage(AppConfig.__SOCKET_PONG_KEY);
            } catch (e) {
                console.log(e);
            }
        });
    }
}

export default new SocketServer();
