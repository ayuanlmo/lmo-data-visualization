import HttpServer from "./bin/HttpServer";
import AppConfig from "./conf/AppConfig";
import './bin/dataBase/index';
import "./lib/CheckDirectory";

((): void => {
    require('process').title = AppConfig.__APP_NAME;
    new HttpServer();
})();
