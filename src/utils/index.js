/**
 * @method formatTime 将秒 转换为 : '00:00:00'格式
 * @author ayuanlmo
 * @param {Number} s 秒数
 * @return {String} 转换后的格式 eg：'00:00:00'
 * **/
const {stringify} = require("@/utils/index");

module.exports.formatTime = (s) => {
    const h = Math.floor(s / 3600) >= 10 ? Math.floor(s / 3600) : '0' + Math.floor(s / 3600);

    s -= 3600 * h;
    const m = Math.floor(s / 60) >= 10 ? Math.floor(s / 60) : '0' + Math.floor(s / 60);

    s -= 60 * m;
    const sec = s >= 10 ? s : '0' + s;

    return h + ':' + m + ':' + sec;
};

/**
 * @method isObject 判断是否为Object
 * @author ayuanlmo
 * @param {Object} data 秒数
 * @return {Boolean}
 * **/
const isObject = (data = {}) => {
    return typeof data === 'object' && Object.prototype.toString.call(data).toLowerCase() === '[object object]' && data.length;
};

module.exports.isObject = isObject;

/**
 * @method isObject 判断是否为Object
 * @author ayuanlmo
 * @param {Object} data 秒数
 * @return {string|string}
 * **/
module.exports.stringify = (data = null) => {
    return data === null ? 'null' : JSON.stringify(data);
};

/**
 * @method toString 将任意格式数据转换为String
 * @author ayuanlmo
 * @param {Object|Boolean|String|Number|Array|any} data 转换的数据
 * @return {string|string}
 * **/
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

/**
 * @method isArray 是否为Array
 * @author ayuanlmo
 * @param {Array|Object} arr
 * @return {boolean}
 * **/
module.exports.isArray = (arr = []) => {
    return Object.prototype.toString.call(arr) === "[object Array]";
};


module.exports.isString = (str = '') => {
    return typeof str === 'string';
};

/**
 * @method encode 编码
 * @author ayuanlmo
 * @param {String} str
 * @return {string|String}
 * **/
module.exports.encode = (str = '') => {
    let code = '_lmo_ting^';

    for (const i of str.split('')) {
        code += i.charCodeAt() + '-';
    }
    return code.slice(0, code.length - 1);
};

/**
 * @method decode 解码
 * @author ayuanlmo
 * @param {String} code
 * @return {string|String}
 * **/
module.exports.decode = (code = '') => {
    const codeTemplate = '_lmo_ting^';

    let str = '';

    for (const i of code.split('^')[1].split('-')) {
        if (i !== codeTemplate) str += String.fromCharCode(i);
    }
    return str;
};