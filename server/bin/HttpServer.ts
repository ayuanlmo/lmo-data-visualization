import path from "path";
import {WithWebsocketMethod} from "express-ws";
import {NextFunction, Request, Response} from "express";
import AppConfig from "../conf/AppConfig";
import Utils from "../utils";
import router from "../router";
import Cli from "../lib/Cli";
import {IWsApp, WebSocketServer} from "./WebSocketServer";
import Express = require("express");
import CreateErrorMessage = Utils.createErrorMessage;

interface IExpressApp extends Express.Application {
    ws?: (url: string, cb: (ws: IWsApp) => void) => void;
}

interface IWsAppType extends WithWebsocketMethod {
    getWss?: (url: string) => Array<IWsApp>;
}

export default class HttpServer {
    public readonly WsApp: IWsAppType;
    private readonly App: IExpressApp;
    private onLineUsers: number;
    private readonly WsPool: Array<IWsApp>;

    constructor() {
        this.App = Express();
        this.WsApp = require('express-ws')(this.App) as WithWebsocketMethod;
        this.WsPool = this.WsApp?.getWss?.(AppConfig.__SOCKET_CONNECT) as Array<IWsApp>;
        const _: any = global;

        _.WebSocketPool = this.WsApp;
        this.onLineUsers = 0;
        this.init();
    }

    private init(): void {
        this.App.use(Express.json({
            limit: "5mb"
        }));
        this.App.use((require('cors')()));
        this.App.ws?.(AppConfig.__SOCKET_CONNECT, (ws: IWsApp): void => {
            this.onLineUsers++;
            new WebSocketServer(ws, this.onLineUsers, this.WsPool);
            ws?.on('close', (): void => {
                this.onLineUsers--;
            });
        });
        this.App.use((_req: Request, res: Response, next: NextFunction): void => {
            const methods: Array<string> = ['GET', 'PUT', 'DELETE'];
            const routers: Array<string> = ['uploadFile', 'template/copy'];

            if (AppConfig.__LIVE_SERVER) {
                if (methods.some((i: string): boolean => _req.method === i) || routers.some((i: string): boolean => _req.url.includes(i)))
                    return void res.json(CreateErrorMessage('ext00el'));
                else
                    next();
            } else
                next();
        });
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
            res.status(200).json(CreateErrorMessage('ext00n', 404));
        });
        this.App.use((_err: any, req: Request, res: Response): void => {
            res.status(200).json(CreateErrorMessage('ext00e'));
        });
        this.App.listen(AppConfig.__SERVER_PORT, (): void => {
            Cli.log('Server started on port ', AppConfig.__SERVER_PORT)
        });
    }
}
