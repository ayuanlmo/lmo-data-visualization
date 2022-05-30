/**
 * Data-Visualization Server
 * **/

(() => {
    const express = require('express');
    const _App = express();
    const _Router = require('./const/routers');
    const _Func = require('./funcs');
    const _Conf = require('./conf/ServerConfig');
    const _Cmd = require('./const/cmd');
    const _Net = require('./lib/net');

    require('express-ws')(_App);

    _App.use(express.urlencoded({extended: false}));
    _App.use(_Conf.__STATIC_PATH, express.static(`${__dirname}${_Conf.__STATIC_PATH}`));
    _App.ws(_Router.__SOCKET_CONNECT, (ws, request) => {
        ws.on('message', msg => {
            if (msg === _Conf.__SOCKET_PONG_KEY) return ws.send(_Conf.__SOCKET_PONG_MESSAGE);
            const m = JSON.parse(msg);

            if (m['cmd'] === _Cmd.__SYNTHESIS)
                new (require('./timecut/index')).tc(ws, m.data);
        });
    });
    _App.post(_Router.__GET_TEMPLATE, (req, res) => {
        _Func._getTemplateList(res);
    });
    _App.post(_Router.__GET_MEDIA, (req, res) => {
        _Func._getMedia(res);
    });
    _Net.__START_SERVER(_App);
})();
