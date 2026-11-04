import path from "path";
import * as fs from "fs";
import Cli from "./Cli.js";
import {dataPath, dataRoot, packageRoot} from "./dataDir.js";

((): void => {
    function mkdir(dir: string): void {
        if (!fs.existsSync(dir))
            // recursive：嵌套目录（如 _data/static/public/xxx）需递归创建，
            // 否则父目录不存在时 mkdirSync 会直接抛 ENOENT 使进程崩溃
            fs.mkdirSync(dir, {recursive: true});
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
        const origin: string = dataPath('static', 'public', 'previewTemplate');
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
    // unref：该定时器只做过期预览产物清理，不应单独撑住事件循环——
    // 否则任何只为了建目录而导入本模块的短生命周期进程（测试、脚本）会挂在退出前。
    }, 1000 * 60).unref();

    // 全部子目录由数据根（dataRoot）派生：既不再跟 cwd 走，也让 DATA_DIR（包含测试的临时目录）能整体重定向。
    Cli.log(`数据根: ${dataRoot}（包根: ${packageRoot}）`);
    mkdir(dataPath('db'));
    mkdir(dataPath('static'));
    mkdir(dataPath('log'));
    mkdir(dataPath('static/public/previewTemplate'));
    mkdir(dataPath('static/public/templates'));
    mkdir(dataPath('static/public/scripts'));
    mkdir(dataPath('static/public/styles'));
    mkdir(dataPath('static/public/uploads'));
    mkdir(dataPath('static/public/output'));
})();
