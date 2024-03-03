"use strict";
var __importDefault = this && this.__importDefault || function (e) { return e && e.__esModule ? e : { default: e }; }, HttpServer_1 = (Object.defineProperty(exports, "__esModule", { value: !0 }), __importDefault(require("./bin/HttpServer"))), AppConfig_1 = __importDefault(require("./conf/AppConfig"));
require("./bin/dataBase/index"), require("./lib/CheckDirectory"), require("process").title = AppConfig_1.default.__APP_NAME, new HttpServer_1.default;
