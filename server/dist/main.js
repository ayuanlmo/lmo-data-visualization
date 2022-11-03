"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_y_1 = require("./router/index.y");
const Conf_y_1 = require("./conf/Conf.y");
const SocketController_y_1 = require("./bin/Controllers/SocketController.y");
const TemplateIndex_y_1 = require("./const/TemplateIndex.y");
const Net_y_1 = require("./lib/net/Net.y");
const Socket_y_1 = require("./router/Socket.y");
(() => {
    const Express = require('express');
    const App = Express();
    const WsApp = require('express-ws')(App);
    const Pool = WsApp.getWss(Socket_y_1.CONNECT);
    const Path = require('path');
    const Multer = require('multer')({
        dest: './static/uploads'
    });
    let OnLineUsers = 0;
    global['dbConf'] = {
        _path: Path.resolve(__dirname + '/lib/sqlite/db/db.ting.db'),
        _template: Path.resolve(__dirname + '/static/DataVisualizationTemplate'),
        index: TemplateIndex_y_1.default
    };
    App.use(Express.urlencoded({
        extended: false
    }));
    App.use(Multer.single('media'));
    App.use(Conf_y_1.default.__STATIC_PATH, Express.static(`${__dirname}${Conf_y_1.default.__STATIC_PATH}`));
    App.ws(Socket_y_1.CONNECT, (ws) => __awaiter(void 0, void 0, void 0, function* () {
        OnLineUsers++;
        new SocketController_y_1.default(ws, OnLineUsers, Pool);
        ws.on('close', () => {
            OnLineUsers--;
        });
    }));
    App.use(index_y_1.default);
    new Net_y_1.default(App);
})();
//# sourceMappingURL=main.js.map