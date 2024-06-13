import Notification from "../Notification";

class Socket {
    private ws: WebSocket | undefined;

    constructor() {
        this.init();
    }

    public sendMessage(message: string): void {
        this.ws && this.ws.send(message);
    }

    private init(): void {
        this.ws && this.ws.close();
        this.ws = new WebSocket(`${location.href.includes('https') ? 'wss' : 'ws'}://${location.host}/connect`);

        this.ws.onopen = (): void => {
            this.sendMessage('ping');
        };
        this.ws.onclose = (): void => {
            this.init();
        };
        this.ws.onmessage = (e: MessageEvent): void => {
            this.onMessage(e.data);
        };
    }

    private onMessage(message: string): void {
        try {
            if (message === 'pong') return;

            const data = JSON.parse(message);

            if (data.type === 'TASK_END')
                Notification.openNotification('系统消息', `[${data.message.name ?? '未知'}] 合成已完毕`, 'success');
            if (data.type === 'TASK_READY')
                Notification.openNotification('系统消息', `[${data.message.name ?? '未知'}] 任务已就绪`, 'info');

        } catch (e) {
            console.log('error', e);
        }
    }
}

export default new Socket();
