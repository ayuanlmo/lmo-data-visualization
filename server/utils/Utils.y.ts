/**
 * @method STRING_TO_BINARY
 * @description 字符串转二进制
 * @param str {string}
 * @return string
 * **/

export const STRING_TO_BINARY = (str: string): string => {
    const result: string[] = [];
    const list: string[] = str.split('');

    for (let i: number = 0; i < list.length; i++) {
        if (i !== 0)
            result.push(" ");
        // @ts-ignore
        result.push(list[i].charCodeAt().toString(2));
    }
    return result.join('');
};

/**
 * @method BINARY_TO_STRING
 * @description 二进制转字符串
 * @param str {string}
 * @return string
 * **/
export const BINARY_TO_STRING = (str: string): string => {
    const result: string[] = [];
    const list: string[] = str.split(' ');

    for (let i: number = 0; i < list.length; i++) {
        result.push(String.fromCharCode(parseInt(list[i], 2)));
    }
    return result.join('');
};

/**
 * @method CMD_EXISTS
 * @description 判定某条命令是否存在于系统（仅适用于Windows_NT）
 * @param cmd {string}
 * @return boolean
 * **/
export const CMD_EXISTS = (cmd: string): boolean => {
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

/**
 * @method CHECK_264_LIB
 * @description 检查ffmpeg是否支持 H.264库
 * @return Promise<boolean>
 * **/

export const CHECK_264_LIB = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        try {
            require('child_process').exec('ffmpeg -codecs', (e: any, stdout: string) => {
                if (!e)
                    resolve(stdout.indexOf('h264') !== -1 && stdout.indexOf('H.264') !== -1 && stdout.indexOf('libx264') !== -1);
            });
        } catch (e) {
            reject(false);
        }
    });
};

/**
 * @method EXEC_CMD
 * @description 执行命令
 * @param cmd {string}
 * @param opt {any}
 * @return Promise<any>
 * **/
export const EXEC_CMD = (cmd: string, opt: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            require('child_process').exec(cmd, opt, (e: any, stdout: string) => {
                if (!e)
                    resolve(stdout);
            });
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * @method TO_UTF8
 * @description 转UTF8字符串
 * @param str {String}
 * @return String
 * **/
export const TO_UTF8 = (str: string): string => {
    return require('iconv-lite').decode(str, 'utf8');
};

/**
 * @method FILE_TO_BASE64
 * @description 文件转base64
 * @param path {String} File path
 * @return Promise<string>
 * **/
export const FILE_TO_BASE64 = (path: string): Promise<string> => {
    return new Promise((resolve, reject): any => {
        try {
            const binary = require('fs').readFileSync(path);

            resolve(Buffer.from(binary, 'binary').toString('base64'));
        } catch (e) {
            reject(e ?? '');
        }
    });
};

/**
 * @method RESOLVE_STATIC_FILE_PATH
 * @description 静态文件路径转换
 * @param path {String}
 * @return String
 * **/
export const RESOLVE_STATIC_FILE_PATH = (path: string = ''): string => {
    if (path === '') return '/';
    return `/static${path.split('/static')[1]}`;
};

/**
 * @method GET_FILE_TYPE
 * @description 获取文件类型
 * @param name {String}
 * @return String
 * **/
export const GET_FILE_TYPE = (name: string): string => {
    return name.split('.')[1];
};

/**
 * @method CREATE_SUCCESS_MESSAGE
 * @description 创建成功消息
 * @param data {Object}
 * @return Object
 * **/
export const CREATE_SUCCESS_MESSAGE = (data: object = {}): object => {
    return {
        data: {
            ...data
        },
        message: 'success',
        code: 200,
        _t: new Date().getTime()
    };
};

/**
 * @method GET_ERROR_MESSAGE
 * @description 创建失败消息
 * @param data{Object}
 * @param msg {String}
 * @return Object
 * **/
export const CREATE_ERROR_MESSAGE = (data: object, msg: String = ''): object => {
    return {
        data: {
            ...data
        },
        message: msg,
        code: 500,
        _t: new Date().getTime()
    };
};

/**
 * @method STRINGIFY
 * @description Object转String
 * @param data {Object | Array | null}
 * @return String
 * **/
export const STRINGIFY = (data: object): string => {
    return JSON.stringify(data);
}

/**
 * @method CREATE_UUID
 * @description 生成一个UUID
 * @return String
 * **/
export const CREATE_UUID = (): string => {
    const ids: Array<string> = [];
    const str = 'ying0123456789QWERYUOPASDFHJKLZXCVBNM';

    for (let i = 0; i < 36; i++) {
        ids[i] = str.substr(Math.floor(Math.random() * 0x10), 1);
    }
    ids[14] = '4';
    // @ts-ignore
    ids[19] = str.substr(ids[19] & 0x3 | 0x8, 1);
    ids[8] = ids[13] = ids[19] = ids[23] = '-';
    return ids.join('');
};