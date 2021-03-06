/**
 * WebSocket Javascript(ECMAScript 6) Library
 * @author ayuanlmo
 * @class Socket
 * @constructor
 * @param {String} url WebSocket Address
 * @param {Function} callback [()=>{}] Message callback func
 * @param {String} maximumNumberOfReconnects [5] numberOfReconnections
 * Created by ayuanlmo on 2022/02
 * **/

import {Notification} from "element-ui";

export default class Socket {
    constructor(url, callback = () => {
    }, maximumNumberOfReconnects = 5) {
        this.url = require('@utils').getWsUrl(`${url}`);
        this.maximumNumberOfReconnects = maximumNumberOfReconnects;
        this.currentNumberOfReconnects = 0;
        this.ws = null;
        this.timer = 0;
        this.callback = callback;
        this.init();
    }

    init() {
        this.ws && this.ws.close();
        if (!this.ws) {
            if ('WebSocket' in window)
                this.ws = new WebSocket(this.url);
            else if ('__CreateWebSocket' in window['__lmo'])
                this.ws = new window['__lmo']['__CreateWebSocket'];
            else
                this.ws = new window['__ting']['__ConnectSocket'];

            this.ws.onopen = (e) => {
                this.onOpen(e);
            };
            this.ws.onmessage = (msg) => {
                this.onMessage(msg);
            };
            this.ws.onerror = (e) => {
                this.onError(e);
            };
            this.ws.onclose = (e) => {
                this.onClose(e);
            };
        }
    }

    onOpen() {
        this.ping();
    }

    onMessage(msg) {
        if (msg.data !== 'pong') {
            const _msg = JSON.parse(require('@/utils/index').binaryToString(msg.data));

            this.callback(_msg);
            if (_msg.type === 'showMessage')
                return Notification({
                    title: '系统消息',
                    message: `${_msg.data.message}`,
                    type: 'warning'
                });
            if (_msg.type === 'task_end' && _msg.data['cmd'] === 'task_processing')
                return Notification({
                    title: '系统消息',
                    message: `[${_msg.data['taskName']}] 合成完毕`,
                    type: 'success'
                });
            if (_msg.type === 'task_pending')
                return Notification({
                    title: '系统消息',
                    message: `[${_msg.data['taskName']}] 开始合成`,
                    type: 'success'
                });
            if (_msg.type === 'task_pro' && _msg.data['cmd'] === 'task_pro_ready')
                return Notification({
                    title: '系统消息',
                    message: `[${_msg.data['taskName']}] 开始转码`,
                    type: 'success'
                });
            if (_msg.type === 'task_pro' && _msg.data['cmd'] === 'task_pro_error')
                return Notification({
                    title: '系统消息',
                    message: `[${_msg.data['taskName']}] 转码失败`,
                    type: 'error'
                });
            if (_msg.type === 'task_pro' && _msg.data['cmd'] === 'task_pro_success')
                return Notification({
                    title: '系统消息',
                    message: `[${_msg.data['taskName']}] 转码完成`,
                    type: 'success'
                });
        }
    }

    onError() {
        this.ws.close();
        clearInterval(this.timer);
        if (this.ws.readyState !== 3) {
            this.ws = null;
            setTimeout(async () => {
                await this.reconnection();
            });
        }
    }

    onClose() {
        clearInterval(this.timer);
        if (this.ws.readyState !== 2) {
            this.ws = null;
            this.reconnection();
        }
    }

    ping(duration = 20000, str = 'ping') {
        clearInterval(this.timer);
        this.ws.send(str);
        this.timer = setInterval(async () => {
            await this.ws.send(str);
        }, duration);
    }

    send(msg = '') {
        if (this.ws !== null && this.ws.readyState === 3)
            setTimeout(async () => {
                await this.ws.close();
                await this.reconnection();
            });
        else this.ws.readyState === 1 ? this.ws.send(msg) : this.waitSendMessage(msg);
    }

    waitSendMessage(msg) {
        setTimeout(async () => {
            await this.ws.readyState === 0 ? this.waitSendMessage(msg) : this.ws.send(msg);
        });
    }

    reconnection() {
        this.currentNumberOfReconnects += 1;
        this.currentNumberOfReconnects !== this.maximumNumberOfReconnects ? this.init() : console.log('错误');
    }
}