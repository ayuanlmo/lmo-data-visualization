import cluster from "node:cluster";
import os from 'node:os';
import AppConfig from "../conf/AppConfig";
import HttpServer from "./HttpServer";
import Cli from "../lib/Cli";


((): void => {
    if (cluster.isPrimary) {
        const cpus: number = os.cpus().length;
        const proc: number = Math.min(Number(AppConfig.__ARGV.proc), cpus);

        if (proc <= 0) {
            Cli.debug('Invalid number of processes');
            process.exit(0);
        } else {
            cluster.on('exit', (): void => {
                if (AppConfig.__ARGV.af)
                    cluster.fork();
            });
            for (let i: number = 0; i < proc; i++) {
                cluster.fork();
            }
        }
    }
    if (cluster.isWorker) {
        process.title = AppConfig.__APP_NAME;
        new HttpServer();
    }
})();
