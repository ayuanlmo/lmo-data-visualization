import {createConnection, Socket} from 'node:net';

class SocketClient {
    private client: Socket | undefined;

    constructor() {
        this.init();
    }

    private init(): void {
        this.client = createConnection(3002, '0.0.0.0');
        this.client.on('connect', (): void => {
            this.client?.write('ping');
        });
        this.client.on('error', (e) => {
            console.log(e);
        });
        this.client.on('data', this.onData);
    }

    private onData = (data: Buffer): void => {
        console.log('收到', data.toString());
    }
}

const socketClient: SocketClient = new SocketClient();

export default socketClient;