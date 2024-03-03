import path from "path";
import * as fs from "fs";

((): void => {
    function mkdir(dir: string): void {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
    }

    mkdir(path.resolve('./_data/static'));
    mkdir(path.resolve('./_data/static/public/templates'));
    mkdir(path.resolve('./_data/static/public/scripts'));
    mkdir(path.resolve('./_data/static/public/styles'));
    mkdir(path.resolve('./_data/static/public/output'));
})();
