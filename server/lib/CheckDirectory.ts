import path from "path";
import * as fs from "fs";
import Cli from "./Cli";

((): void => {
    function mkdir(dir: string): void {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
        else {
            try {
                fs.accessSync(dir, fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK);
            } catch (e) {
                try {
                    fs.chmodSync(dir, 0o777);
                } catch (csErr) {
                    Cli.warn(`Failed to add permissions to ${dir}: ${csErr}`);
                }
            }
        }
    }

    setInterval((): void => {
        const currentTime: number = new Date().getTime();
        const origin: string = path.resolve('./_data/static/public/previewTemplate');
        fs.readdir(path.resolve(origin), (err: NodeJS.ErrnoException | null, files: Array<string>): void => {
            if (err) return;

            files.map((i: string): void => {
                const stats: fs.Stats = fs.statSync(path.resolve(origin, i));
                const creationTime: number = stats.birthtime.getTime();
                const differenceInMinutes: number = (currentTime - creationTime) / (1000 * 60);

                if (differenceInMinutes >= 2) {
                    if (stats.isDirectory()) {
                        fs.readdirSync(path.resolve(origin, i)).map((j: string): void => {
                            fs.unlinkSync(path.resolve(origin, i, j));
                        });
                        fs.rmdirSync(path.resolve(origin, i));
                    }
                    if (stats.isFile())
                        fs.unlinkSync(path.resolve(origin, i));
                }
            });
        });
    }, 1000 * 60);

    mkdir(path.resolve('./_data/static'));
    mkdir(path.resolve('./_data/static/public/previewTemplate'));
    mkdir(path.resolve('./_data/static/public/templates'));
    mkdir(path.resolve('./_data/static/public/scripts'));
    mkdir(path.resolve('./_data/static/public/styles'));
    mkdir(path.resolve('./_data/static/public/output'));
})();
