"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_UUID = exports.STRINGIFY = exports.CREATE_ERROR_MESSAGE = exports.CREATE_SUCCESS_MESSAGE = exports.GET_FILE_TYPE = exports.RESOLVE_STATIC_FILE_PATH = exports.FILE_TO_BASE64 = exports.TO_UTF8 = exports.EXEC_CMD = exports.CHECK_264_LIB = exports.CMD_EXISTS = exports.BINARY_TO_STRING = exports.STRING_TO_BINARY = void 0;
const STRING_TO_BINARY = (STR) => {
    const result = [];
    const list = STR.split('');
    for (let i = 0; i < list.length; i++) {
        if (i !== 0)
            result.push(" ");
        result.push(list[i].charCodeAt().toString(2));
    }
    return result.join('');
};
exports.STRING_TO_BINARY = STRING_TO_BINARY;
const BINARY_TO_STRING = (STR) => {
    const result = [];
    const list = STR.split(' ');
    for (let i = 0; i < list.length; i++) {
        result.push(String.fromCharCode(parseInt(list[i], 2)));
    }
    return result.join('');
};
exports.BINARY_TO_STRING = BINARY_TO_STRING;
const CMD_EXISTS = (CMD) => {
    try {
        require('child_process').execSync(require('os').platform() === 'win32'
            ? `cmd /c "(help ${CMD} > nul || exit 0) && where ${CMD} > nul 2> nul"`
            : `command -v ${CMD}`);
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.CMD_EXISTS = CMD_EXISTS;
const CHECK_264_LIB = () => {
    return new Promise((resolve, reject) => {
        try {
            require('child_process').exec('ffmpeg -codecs', (e, stdout) => {
                if (!e)
                    resolve(stdout.indexOf('h264') !== -1 && stdout.indexOf('H.264') !== -1 && stdout.indexOf('libx264') !== -1);
            });
        }
        catch (e) {
            reject(false);
        }
    });
};
exports.CHECK_264_LIB = CHECK_264_LIB;
const EXEC_CMD = (CMD, OPT) => {
    return new Promise((resolve, reject) => {
        try {
            require('child_process').exec(CMD, OPT, (e, stdout) => {
                if (!e)
                    resolve(stdout);
            });
        }
        catch (e) {
            reject(e);
        }
    });
};
exports.EXEC_CMD = EXEC_CMD;
const TO_UTF8 = (STR) => {
    return require('iconv-lite').decode(STR, 'utf8');
};
exports.TO_UTF8 = TO_UTF8;
const FILE_TO_BASE64 = (PATH) => {
    return new Promise((resolve, reject) => {
        try {
            const binary = require('fs').readFileSync(PATH);
            resolve(Buffer.from(binary, 'binary').toString('base64'));
        }
        catch (e) {
            reject(e !== null && e !== void 0 ? e : '');
        }
    });
};
exports.FILE_TO_BASE64 = FILE_TO_BASE64;
const RESOLVE_STATIC_FILE_PATH = (PATH = '') => {
    if (PATH === '')
        return '/';
    return `/static${PATH.split('/static')[1]}`;
};
exports.RESOLVE_STATIC_FILE_PATH = RESOLVE_STATIC_FILE_PATH;
const GET_FILE_TYPE = (NAME) => {
    return NAME.split('.')[1];
};
exports.GET_FILE_TYPE = GET_FILE_TYPE;
const CREATE_SUCCESS_MESSAGE = (DATA = {}) => {
    return {
        data: Object.assign({}, DATA),
        message: 'success',
        code: 200,
        _t: new Date().getTime()
    };
};
exports.CREATE_SUCCESS_MESSAGE = CREATE_SUCCESS_MESSAGE;
const CREATE_ERROR_MESSAGE = (DATA, MSG = '') => {
    return {
        data: Object.assign({}, DATA),
        message: MSG,
        code: 500,
        _t: new Date().getTime()
    };
};
exports.CREATE_ERROR_MESSAGE = CREATE_ERROR_MESSAGE;
const STRINGIFY = (DATA) => {
    return JSON.stringify(DATA);
};
exports.STRINGIFY = STRINGIFY;
const CREATE_UUID = () => {
    const ids = [];
    const str = 'ying0123456789QWERYUOPASDFHJKLZXCVBNM';
    for (let i = 0; i < 36; i++) {
        ids[i] = str.substr(Math.floor(Math.random() * 0x10), 1);
    }
    ids[14] = '4';
    ids[19] = str.substr(ids[19] & 0x3 | 0x8, 1);
    ids[8] = ids[13] = ids[19] = ids[23] = '-';
    return ids.join('');
};
exports.CREATE_UUID = CREATE_UUID;
//# sourceMappingURL=Utils.y.js.map