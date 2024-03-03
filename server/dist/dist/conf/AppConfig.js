"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var _ENV = process.env.NODE_ENV, AppConfig = { __APP_NAME: "lmo-Data-Visualization-Server-Application", __APP_AUTHOR: "ayuanlmo", __SERVER_PORT: 3e3, __STATIC_PATH: "/static", __SOCKET_CONNECT: "/connect", __SOCKET_PONG_KEY: "ping", __SOCKET_PONG_MESSAGE: "pong", __DEV_SERVER: "development" === _ENV.trim(), __LIVE_SERVER: "liveServer" === _ENV.trim() };
exports.default = AppConfig;
