module.exports.formatTime = formatTime;
module.exports.getWsUrl = getWsUrl;
module.exports.isObject = isObject;
module.exports.stringify = stringify;
module.exports.toString = toString;
module.exports.isArray = isArray;
module.exports.isString = isString;
module.exports.encode = encode;
module.exports.decode = decode;
module.exports.toBase64 = toBase64;
module.exports.selectFile = selectFile;
module.exports.getRouterQuery = getRouterQuery;
module.exports.routerPush = routerPush;
module.exports.downloadFile = downloadFile;
module.exports.stringToBinary = stringToBinary;
module.exports.binaryToString = binaryToString;
module.exports.formatSec = formatSec;
module.exports.toCSV = toCSV;

function formatTime(s) {
    const h = Math.floor(s / 3600) >= 10 ? Math.floor(s / 3600) : '0' + Math.floor(s / 3600);

    s -= 3600 * h;
    const m = Math.floor(s / 60) >= 10 ? Math.floor(s / 60) : '0' + Math.floor(s / 60);

    s -= 60 * m;
    return h + ':' + m + ':' + `${s >= 10 ? s : '0' + s}`;
}

function getWsUrl(url = location.origin ?? global.location.origin) {
    const urls = location.origin.split(':');
    const origin = location.host;

    if (urls[0].indexOf('http') !== -1)
        return urls[0] === 'https' ? `wss:${origin}${url}` : `ws:${origin}${url}`;
}

function isObject(data = {}) {
    return typeof data === 'object' && Object.prototype.toString.call(data).toLowerCase() === '[object object]' && data.length;
}

function stringify(data = null) {
    return data === null ? 'null' : JSON.stringify(data);
}

function toString(data) {
    if (typeof data === 'boolean')
        return `${data}`;
    if (typeof data === 'string')
        return data;
    if (typeof data === 'number')
        return `${data}`;
    if (typeof data === 'object' && isObject(data))
        return stringify(data);
    return '';
}

function isArray(arr = []) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}

function isString(str = '') {
    return typeof str === 'string';
}

function encode(str = '') {
    let code = '_lmo_ting^';

    for (const i of str.split('')) {
        code += i.charCodeAt() + '-';
    }
    return code.slice(0, code.length - 1);
}

function decode(code = '') {
    const codeTemplate = '_lmo_ting^';

    let str = '';

    for (const i of code.split('^')[1].split('-')) {
        if (i !== codeTemplate) str += String.fromCharCode(i);
    }
    return str;
}

function toBase64(file) {
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
}

function selectFile(multiple = false) {
    return new Promise((resolve, reject) => {
        const i = document.createElement('input');

        if (multiple)
            i.multiple = true;
        i.type = 'file';
        i.addEventListener('change', () => {
            resolve(multiple ? i.files : i.files[0]);
        });
        i.click();
    });
}

function getRouterQuery() {
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
}

function routerPush(r, to, t = 'push') {
    t === 'push' ? r['push']({
        path: to,
        query: {
            ...getRouterQuery()
        }
    }) : r['replace'](to);
}

function downloadFile(conf) {
    const a = document.createElement('a');

    return new Promise((resolve, reject) => {
        a.download = `${conf.download}${new Date().getTime()}`;
        a.href = conf.href;
        resolve(a);
    });
}

function stringToBinary(str = '') {
    const _ = [];
    const __ = str.split("");

    for (let i = 0; i < __.length; i += 1) {
        if (i !== 0) {
            _.push(" ");
        }
        _.push(__[i].charCodeAt().toString(2));
    }
    return _.join("");
}

function binaryToString(str = '') {
    const _ = [];
    const list = str.split(" ");

    for (let i = 0; i < list.length; i += 1) {
        _.push(String.fromCharCode(parseInt(list[i], 2)));
    }
    return _.join("");
}

function formatSec(sec, isMs) {
    if (isMs)
        sec /= 1000;

    let _ = String(parseInt(sec / 60));

    let __ = String(parseInt(sec % 60));

    if (_.length === 1) {
        _ = `0${_}`;
    }
    if (__.length === 1) {
        __ = `0${__}`;
    }
    return `${_}:${__}`;
}

function toCSV(arr = []) {
    let _ = 'data:text/csv;charset=utf-8,\ufeff';

    arr.forEach(i => {
        _ += i.join(',') + '\r\n';
    });
    return encodeURI(_);
}