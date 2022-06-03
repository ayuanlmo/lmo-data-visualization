/**
 * Data-Visualization Server
 * @author ayuanlmo
 * @module express
 * @module express-ws
 * Created by ayuanlmo on 2022/06
 * **/

(() => {
    const _Express = require('express');
    const _App = _Express();
    const _Router = require('./const/routers');
    const _Func = require('./funcs');
    const _Conf = require('./conf/ServerConfig');
    const _Cmd = require('./const/cmd');
    const _Net = require('./lib/net');

    require('express-ws')(_App);
    _App.use(_Express.urlencoded({extended: false}));
    _App.use(_Conf.__STATIC_PATH, _Express.static(`${__dirname}${_Conf.__STATIC_PATH}`));
    _App.use(_Conf.__STATIC_PATH, _Express.static(`../dist`));
    _App.ws(_Router.__SOCKET_CONNECT, (ws, request) => {
        ws.on('message', msg => {
            if (msg === _Conf.__SOCKET_PONG_KEY) return ws.send(_Conf.__SOCKET_PONG_MESSAGE);
            const m = JSON.parse(msg);

            if (m['cmd'] === _Cmd.__SYNTHESIS)
                new (require('./timecut/index')).tc(ws, m.data);
        });
    });
    _App.post(_Router.__GET_TEMPLATE, (req, res) => {
        return _Func.__GET_TEMPLATE_LIST(res);
    });
    _App.post(_Router.__GET_MEDIA, (req, res) => {
        _Func.__GET_MEDIA(res);
    });
    _App.get('*', (req, res) => {
        res.json({data: {}, code: 404, message: 'No Found'});
    });
    _App.post('*', (req, res) => {
        res.json({data: {}, code: 404, message: 'No Found'});
    });
    _Net.__START_SERVER(_App);
})();
