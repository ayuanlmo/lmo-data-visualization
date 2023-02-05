module.exports.formatTime = formatTime;
module.exports.formatDate = formatDate;
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
module.exports.getFormData = getFormData;
module.exports.getMediaType = getMediaType;
module.exports.createQueryParams = createQueryParams;
module.exports.isMobileDevice = isMobileDevice;

function formatTime(s) {
    const h = Math.floor(s / 3600) >= 10 ? Math.floor(s / 3600) : '0' + Math.floor(s / 3600);

    s -= 3600 * h;
    const m = Math.floor(s / 60) >= 10 ? Math.floor(s / 60) : '0' + Math.floor(s / 60);

    s -= 60 * m;
    return h + ':' + m + ':' + `${s >= 10 ? s : '0' + s}`;
}

/**
 * @method formatDate
 * @param time {number} UNIX时间戳
 * @description 将时间戳转为'2022-01-02 12:01:01'格式
 * @return {string}
 * **/
function formatDate(time) {
    const date = new Date(time);
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    const currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    const hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    return date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm;
}

/**
 * @method getWsUrl
 * @param url {string} url
 * @description 将 http/https 格式url转换为socket专用的 ws/wss 地址
 * @return {string}
 * **/
function getWsUrl(url = location.origin ?? global.location.origin) {
    const urls = location.origin.split(':');
    const origin = location.host;

    if (urls[0].indexOf('http') !== -1)
        return urls[0] === 'https' ? `wss:${origin}${url}` : `ws:${origin}${url}`;
}

/**
 * @method isObject
 * @param data {object}
 * @description 判断当前数据类型是否为 对象
 * @return {boolean}
 * **/
function isObject(data = {}) {
    return typeof data === 'object' && Object.prototype.toString.call(data).toLowerCase() === '[object object]' && data.length;
}

/**
 * @method stringify
 * @param data {object}
 * @description 将对象转换为JSON字符串
 * @return {string}
 * **/
function stringify(data = null) {
    return data === null ? 'null' : JSON.stringify(data);
}

/**
 * @method toString
 * @param data {any}
 * @description 将常见数据类型转换为字符串
 * @return {string}
 * **/
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

/**
 * @method isArray
 * @param arr{any}
 * @description 判断数据类型是否为 数组
 * @return {boolean}
 * **/
function isArray(arr = []) {
    return Object.prototype.toString.call(arr) === "[object Array]";
}

/**
 * @method isString
 * @param str{any}
 * @description 判断数据类型是否为 字符串
 * @return {boolean}
 * **/
function isString(str = '') {
    return typeof str === 'string';
}

/**
 * @method encode
 * @param str {string} 编码字符串
 * @description 将字符串进行编码（需要使用decode解码）
 * @return {string}
 * **/
function encode(str = '') {
    let code = '_lmo_ting^';

    for (const i of str.split('')) {
        code += i.charCodeAt() + '-';
    }
    return code.slice(0, code.length - 1);
}

/**
 * @method decode
 * @param code {string} 解码字符串
 * @description 将字符串进行解码（需要使用encode编码）
 * @return {string}
 * **/
function decode(code = '') {
    const codeTemplate = '_lmo_ting^';

    let str = '';

    for (const i of code.split('^')[1].split('-')) {
        if (i !== codeTemplate) str += String.fromCharCode(i);
    }
    return str;
}

/**
 * @method toBase64
 * @param file {file}
 * @description 将二进制文件 转换为base64
 * @return {Promise}
 * **/
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

/**
 * @method selectFile
 * @param multiple {boolean} 多文件
 * @description 选择文件
 * @return {Promise}
 * **/
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

/**
 * @method getRouterQuery
 * @description 将路由查询 按照对象返回
 * @return {object}
 * **/
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

/**
 * @method routerPush
 * @param t {any} RouterObject
 * @param to {string} 目标地址
 * @param t {string} 跳转类型 push&replace 可选
 * @description 路由跳转
 * **/
function routerPush(r, to, t = 'push') {
    t === 'push' ? r['push']({
        path: to,
        query: {
            ...getRouterQuery()
        }
    }) : r['replace'](to);
}

/**
 * @method downloadFile
 * @param conf{object}
 * @description 下载文件
 * @return {Promise}
 *
 * **/
function downloadFile(conf) {
    const a = document.createElement('a');

    return new Promise((resolve, reject) => {
        a.download = `${conf.download}`;
        a.href = conf.href;
        resolve(a);
    });
}

/**
 * @method stringToBinary
 * @param str {string}
 * @description 字符串转换为 二进制字符串
 * @return {string}
 * **/
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

/**
 * @method binaryToString
 * @param str {string}
 * @description 二进制字符串转换为 字符串
 * @return {string}
 * **/
function binaryToString(str = '') {
    const _ = [];
    const list = str.split(" ");

    for (let i = 0; i < list.length; i += 1) {
        _.push(String.fromCharCode(parseInt(list[i], 2)));
    }
    return _.join("");
}

/**
 * @method formatSec
 * @param sec {number}
 * @param isMs {boolean}
 * @description 将 整秒 转换为 01:22 格式
 * @return {string}
 * **/
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

/**
 * @method toCSV
 * @param arr{array}
 * @description 转换为CSV文件(只返回地址，下载请调用downloadFile函数)
 * @return {string} 地址
 * **/
function toCSV(arr = []) {
    let _ = 'data:text/csv;charset=utf-8,\ufeff';

    arr.forEach(i => {
        _ += i.join(',') + '\r\n';
    });
    return encodeURI(_);
}

/**
 * @method getFormData
 * @param data{object}
 * @description 将对象转换为FormData
 * @return {FormData}
 * **/
function getFormData(data = {}) {
    const fd = new FormData();

    Object.keys(data).map(i => {
        fd.append(i, data[i]);
    });
    return fd;
}

/**
 * @method getMediaType
 * @param mediaName {string} 'xxx.mp4'
 * @description 获取媒体文件类型
 * @return {string} 'mp4'
 * **/
function getMediaType(mediaName = '') {
    if (mediaName === '')
        return '';
    return mediaName.split('.')[1];
}

/**
 * @method createQueryParams
 * @param data {string}
 * @description 创建一个http查询参数
 * @return {string}  '?id=xx&name=xx'
 * **/
function createQueryParams(data = {}) {
    let str = '?';

    Object.keys(data).map(i => {
        str += `${i}=${data[i]}&`;
    });

    return str.substring(0, str.length - 1);
}

/**
 * @method isMobileDevice
 * @description 是否移动设备
 * @return {boolean}
 * **/
function isMobileDevice() {
    const _ = navigator.userAgent.match(/Mobile/i);

    if (_ === null)
        return false;
    return navigator.userAgent.match(/Mobile/i).length > 0;
}
