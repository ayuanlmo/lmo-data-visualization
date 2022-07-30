/**
 * utils/utils.ts
 * @author ayuanlmo
 * 一些工具函数
 * **/

module.exports.stringToBinary = (str: string): string => {
    const _: string[] = [];
    const __: string[] = str.split("");

    for (let i: number = 0; i < __.length; i += 1) {
        if (i !== 0)
            _.push(" ");
        // @ts-ignore
        _.push(__[i].charCodeAt().toString(2));
    }
    return _.join("");
};

module.exports.binaryToString = (str: string): string => {
    const _: string[] = [];
    const list: string[] = str.split(" ");

    for (let i: number = 0; i < list.length; i += 1) {
        _.push(String.fromCharCode(parseInt(list[i], 2)));
    }
    return _.join("");
};

module.exports.cmdExists = (cmd: string): boolean => {
    try {
        require('child_process').execSync(
            require('os').platform() === 'win32'
                ? `cmd /c "(help ${cmd} > nul || exit 0) && where ${cmd} > nul 2> nul"`
                : `command -v ${cmd}`
        );
        return true;
    } catch {
        return false;
    }
};

module.exports.check264Lib = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            require('child_process').exec('ffmpeg -codecs', (e: any, stdout: string) => {
                resolve(stdout.indexOf('h264') !== -1 && stdout.indexOf('H.264') !== -1 && stdout.indexOf('libx264') !== -1);
            });
        } catch (e) {
            reject(false);
        }
    });
};

module.exports.execCmd = (cmd: string, opt: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            require('child_process').exec(cmd, opt, (e: any, stdout: string) => {
                resolve(stdout);
            });
        } catch (e) {
            reject(e);
        }
    });
};