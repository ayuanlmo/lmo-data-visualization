import Router from "./router/index.y";
import Conf from "./conf/Conf.y";
import SocketController from "./bin/Controllers/SocketController.y";
import TemplateIndex from "./const/TemplateIndex.y";
import Net from "./lib/net/Net.y";
import {CONNECT} from "./router/Socket.y";
import {WsObj} from "./interface/Main.y";
import {Request, Response} from "express";

((): void => {
    const Express = require('express');
    const App = Express();
    const WsApp = require('express-ws')(App);
    const Pool = WsApp.getWss(CONNECT);
    const Path = require('path');
    const Multer = require('multer')({
        dest: './static/uploads'
    });
    let OnLineUsers: number = 0;

    // @ts-ignore
    global['dbConf'] = {
        _path: Path.resolve(__dirname + '/lib/sqlite/db/db.ting.db'),
        _template: Path.resolve(__dirname + '/static/DataVisualizationTemplate'),
        index: TemplateIndex
    };
    App.use(Express.urlencoded({
        extended: false
    }));
    App.use((req: Request, res: Response, next: Function): Request => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');
        res.header('Allow', 'GET, POST');
        next();
        return req;
    });
    App.use(Multer.single('media'));
    App.use(Conf.__STATIC_PATH, Express.static(`${__dirname}${Conf.__STATIC_PATH}`));
    App.use(Conf.__STATIC_PATH, Express.static(`/dist/web`));
    App.ws(CONNECT, async (ws: WsObj) => {
        OnLineUsers++;
        new SocketController(ws, OnLineUsers, Pool);
        ws.on('close', () => {
            OnLineUsers--;
        });
    });
    App.use(Router);
    new Net(App);
})();