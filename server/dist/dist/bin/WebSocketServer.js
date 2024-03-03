"use strict";
var __importDefault = this && this.__importDefault || function (e) { return e && e.__esModule ? e : { default: e }; }, AppConfig_1 = (Object.defineProperty(exports, "__esModule", { value: !0 }), exports.WebSocketServer = void 0, __importDefault(require("../conf/AppConfig"))), WebSocketServer = function () { function e(e, t, n) { this.WsApp = e, this.OnLineUsers = t, this.Pool = n, this.initConnect(); } return e.prototype.initConnect = function () { var e, t, s = this; null != (t = (e = this.WsApp).send) && t.call(e, JSON.stringify({ type: "connect", success: !0, onLineUser: this.OnLineUsers })), this.WsApp.on("message", function (t) { if (t === AppConfig_1.default.__SOCKET_PONG_KEY)
    return s.WsApp.send(AppConfig_1.default.__SOCKET_PONG_MESSAGE); try {
    var e = JSON.parse(t), n = Object.keys(e);
    "cmd" in n && "data" in n ? console.log(e) : s.WsApp.send(t);
}
catch (e) {
    s.WsApp.send(t);
} }); }, e; }();
exports.WebSocketServer = WebSocketServer;
