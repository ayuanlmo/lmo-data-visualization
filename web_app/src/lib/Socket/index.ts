import Notification from "../Notification";
import i18n from "../../i18n";

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
                Notification.openNotification(i18n.t('systemMessage'), `[${data.message.name ?? i18n.t('unknown')}] ${i18n.t('synthesisSuccess')}`, 'success');
            if (data.type === 'TASK_READY')
                Notification.openNotification(i18n.t('systemMessage'), `[${data.message.name ?? i18n.t('unknown')}] ${i18n.t('synthesisRead')}`, 'info');
            if (data.type === 'SERVICE_RE_CONNECT_SUCCESS')
                Notification.openNotification(i18n.t('systemMessage'), i18n.t('serviceReConnect'), 'success');
            if (data.type === 'SERVICE_CONNECT_CLOSE')
                Notification.openNotification(i18n.t('systemMessage'), i18n.t('serviceConnectClose'), 'warning');

        } catch (e) {
            console.log('error', e);
        }
    }
}

export default new Socket();
