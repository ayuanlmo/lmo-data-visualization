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

export default class Socket {
    constructor(url = location.origin, callback = () => {
    }, maximumNumberOfReconnects = 5) {
        this.url = require('@utils').getWsUrl(url);
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
            this.ws = new WebSocket(this.url);
            this.ws.onopen = () => {
                this.onOpen();
            };
            this.ws.onmessage = () => {
                this.onMessage();
            };
            this.ws.onerror = () => {
                this.onError();
            };
            this.ws.onclose = () => {
                this.onClose();
            };
        }
    }

    onOpen() {
        console.log(this);
        this.ping();
    }

    onMessage(msg) {
        this.callback(msg === 'pong' ? 'pong' : msg);
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

    ping(duration = 10000, str = 'ping') {
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