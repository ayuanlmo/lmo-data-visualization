/**
 * @method formatTime 将秒 转换为 : '00:00:00'格式
 * @author ayuanlmo
 * @param {Number} s 秒数
 * @return {String} 转换后的格式 eg：'00:00:00'
 * **/
const {stringify} = require("@/utils/index");
const {UploadImageTypes} = require("@const/Default.t");

module.exports.formatTime = (s) => {
    const h = Math.floor(s / 3600) >= 10 ? Math.floor(s / 3600) : '0' + Math.floor(s / 3600);

    s -= 3600 * h;
    const m = Math.floor(s / 60) >= 10 ? Math.floor(s / 60) : '0' + Math.floor(s / 60);

    s -= 60 * m;
    const sec = s >= 10 ? s : '0' + s;

    return h + ':' + m + ':' + sec;
};

module.exports.getWsUrl = (url = location.origin ?? global.location.origin) => {
    const urls = location.origin.split(':');
    const origin = location.host;

    if (urls[0].indexOf('http') !== -1)
        return urls[0] === 'https' ? `wss:${origin}${url}` : `ws:${origin}${url}`;
};

const isObject = (data = {}) => {
    return typeof data === 'object' && Object.prototype.toString.call(data).toLowerCase() === '[object object]' && data.length;
};

module.exports.isObject = isObject;

module.exports.stringify = (data = null) => {
    return data === null ? 'null' : JSON.stringify(data);
};

module.exports.toString = (data) => {
    if (typeof data === 'boolean')
        return `${data}`;
    if (typeof data === 'string')
        return data;
    if (typeof data === 'number')
        return `${data}`;
    if (typeof data === 'object' && isObject(data))
        return stringify(data);
    return '';
};

module.exports.isArray = (arr = []) => {
    return Object.prototype.toString.call(arr) === "[object Array]";
};

module.exports.isString = (str = '') => {
    return typeof str === 'string';
};

module.exports.encode = (str = '') => {
    let code = '_lmo_ting^';

    for (const i of str.split('')) {
        code += i.charCodeAt() + '-';
    }
    return code.slice(0, code.length - 1);
};

module.exports.decode = (code = '') => {
    const codeTemplate = '_lmo_ting^';

    let str = '';

    for (const i of code.split('^')[1].split('-')) {
        if (i !== codeTemplate) str += String.fromCharCode(i);
    }
    return str;
};

module.exports.toBase64 = (file) => {
    return new Promise(function (r, e) {
        const fr = new FileReader();

        fr.readAsDataURL(file);
        fr.onload = function (res) {
            r(res.srcElement.result ?? res.target.result);
        };
        fr.onerror = (msg) => {
            e(msg);
        };
    });
};

module.exports.selectFile = () => {
    return new Promise((resolve, reject) => {
        const i = document.createElement('input');

        i.type = 'file';
        i.addEventListener('change', () => {
            resolve(i.files[0]);
        });
        i.click();
    });
};

const getRouterQuery = () => {
    const _ = [];
    const query = {};

    location.search.split('?').map(i => {
        if (i !== '') {
            _.push(i);
        }
    });

    _.map(i => {
        i.split('&').map(i => {
            const __ = i.split('=');

            query[__[0]] = __[1];

        });
    });
    return query;
};

module.exports.getRouterQuery = getRouterQuery;

module.exports.routerPush = (r, to, t = 'push') => {
    t === 'push' ? r['push']({
        path: to,
        query: {
            ...getRouterQuery()
        }
    }) : r['replace'](to);
};

module.exports.downloadFile = (conf) => {
    const a = document.createElement('a');

    return new Promise((resolve, reject) => {
        a.download = `${conf.download}${new Date().getTime()}`;
        a.href = require('@/config/AppConfig').devProxy.http + conf.href;
        resolve(a);
    });
};