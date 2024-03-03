import path from "path";
import Express = require("express");
import {WithWebsocketMethod} from "express-ws";
import {NextFunction, Request, Response} from "express";
import AppConfig from "../conf/AppConfig";
import Utils from "../utils";
import router from "../router";
import Cli from "../lib/Cli";
import CreateErrorMessage = Utils.createErrorMessage;
import {WebSocketServer, WsObj} from "./WebSocketServer";

interface ExpressApp extends Express.Application {
    ws?: (url: string, cb: (ws: WsObj) => void) => void;
}

interface WsAppType extends WithWebsocketMethod {
    getWss?: (url: string) => Array<WsObj>;
}

export default class HttpServer {
    private readonly App: ExpressApp;
    public readonly WsApp: WsAppType;
    private onLineUsers: number;
    private readonly WsPool: Array<WsObj>;

    constructor() {
        this.App = Express();
        this.WsApp = require('express-ws')(this.App) as WithWebsocketMethod;
        this.WsPool = this.WsApp?.getWss?.(AppConfig.__SOCKET_CONNECT) as Array<WsObj>;
        this.onLineUsers = 0;
        this.init();
    }

    private init(): void {
        this.App.use(Express.json());
        this.App.use((require('cors')()));
        this.App.use('/api', router);
        this.App.use(Express.urlencoded({
            extended: false
        }));
        this.App.use(AppConfig.__STATIC_PATH, Express.static(path.resolve(`./_data/${AppConfig.__STATIC_PATH}/public`)));
        this.App.use((_req: Request, res: Response, next: NextFunction): void => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE');
            res.header('Allow', 'GET, POST');
            return next();
        });
        this.App.use((req: Request, _res: Response, next: NextFunction): void => {
            try {
                req.body = JSON.parse(JSON.stringify(req.body));
                next();
            } catch (e) {
                next(e);
            }
        });
        this.App.use((_req: Request, res: Response): void => {
            res.status(200).json(CreateErrorMessage('ext00n',404));
        });
        this.App.use((_err: any, req: Request, res: Response): void => {
            res.status(200).json(CreateErrorMessage('ext00e'));
        });
        this.App.listen(AppConfig.__SERVER_PORT, (): void => {
            Cli.log('Server started on port ', AppConfig.__SERVER_PORT)
        });
        this.App.ws?.(AppConfig.__SOCKET_CONNECT, (ws: WsObj): void => {
            this.onLineUsers++;
            new WebSocketServer(ws, this.onLineUsers, this.WsPool);
            ws?.on('close', (): void => {
                this.onLineUsers--;
            });
        });
    }
}
