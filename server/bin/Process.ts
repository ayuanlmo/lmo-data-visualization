import cluster from "node:cluster";
import AppConfig from "../conf/AppConfig";
import HttpServer from "./HttpServer";

((): void => {
    if (cluster.isPrimary) {
        cluster.on('exit', (): void => {
            if (AppConfig.__AUTO_FORK)
                cluster.fork();
        });
        for (let i: number = 0; i < AppConfig.__MAX_PROCESS; i++) {
            cluster.fork();
        }
    }
    if (cluster.isWorker) {
        process.title = AppConfig.__APP_NAME + process.pid;
        new HttpServer();
    }
})();
