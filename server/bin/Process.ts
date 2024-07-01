import AppConfig from "../conf/AppConfig";
import HttpServer from "./HttpServer";

((): void => {
    process.title = AppConfig.__APP_NAME;
    new HttpServer();
})();
