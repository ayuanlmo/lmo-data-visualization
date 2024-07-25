import AppConfig from "../conf/AppConfig";
import HttpServer from "./HttpServer";
import os from "node:os";
import {close as closeDataBase} from "./dataBase";

export namespace Process {
    export const sendMessage = (message: string): boolean | undefined => process.send?.(message);

    export const exit = (code?: number): void => process.exit(code || 0);

    export const ready = (): void => void Process.sendMessage('ready');

    export const onClose = (cb: Function): void => {
        if (os.platform() === 'win32') {
            process.on('message', async (msg: string): Promise<void> => {
                if (msg === 'shutdown')
                    cb();
            });
        } else {
            process.on('SIGINT', (): void => cb());
            process.on('SIGTERM', (): void => cb());
        }
    };
}

((): void => {
    process.title = AppConfig.__APP_NAME;
    new HttpServer();
})();


((): void => {
    Process.onClose(async (): Promise<void> => {
        try {
            await closeDataBase();
        } catch (e) {
            throw e;
        } finally {
            Process.exit();
        }
    });
})();
