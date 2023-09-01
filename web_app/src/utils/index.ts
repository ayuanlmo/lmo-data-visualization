
/**
 * @method formatDate
 * @description 将时间戳转为'2022-01-02 12:01:01'格式
 * @return {string}
 * @param s
 */
export function formatTime(s: number): string {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    s %= 3600;
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    s %= 60;
    const sec = s.toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
}

/**
 * @method formatDate
 * @param time {number} UNIX时间戳
 * @description 将时间戳转为'2022-01-02 12:01:01'格式
 * @return {string}
 */
export function formatDate(time: number): string {
    const date = new Date(time);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * @method getWsUrl
 * @param url {string} url
 * @param origin
 * @description 将 http/https 格式url转换为socket专用的 ws/wss 地址
 * @return {string}
 * **/
export function getWsUrl(url: string, origin?: string): string {
    if (!url || !origin) throw new Error('Invalid URL');
    return `${origin.includes('https') ? 'wss' : 'ws'}://${new URL(origin).host}${url}`;
}

/**
 * @method isObject
 * @param data {object}
 * @description 判断当前数据类型是否为 对象
 * @return {boolean}
 * **/
export function isObject(data: any): boolean {
    return typeof data === 'object' && data !== null && !Array.isArray(data);
}

/**
 * @method stringify
 * @param data {object}
 * @description 将对象转换为JSON字符串
 * @return {string}
 * **/
export function stringify(data: any): string {
    return JSON.stringify(data);
}

/**
 * @method toString
 * @param data {any}
 * @description 将常见数据类型转换为字符串
 * @return {string}
 * **/
export function toString(data: any): string {
    const type = typeof data;
    return type === 'object' ? (isObject(data) ? stringify(data) : '') : String(data);
}

/**
 * @method isArray
 * @param arr{any}
 * @description 判断数据类型是否为 数组
 * @return {boolean}
 * **/
export function isArray(arr: any): boolean {
    return Array.isArray(arr);
}

/**
 * @method isString
 * @param str{any}
 * @description 判断数据类型是否为 字符串
 * @return {boolean}
 * **/
export function isString(str: any): boolean {
    return typeof str === 'string';
}

/**
 * @method encode
 * @param str {string} 编码字符串
 * @description 将字符串进行编码（需要使用decode解码）
 * @return {string}
 * **/
export function encode(str: string = ''): string {
    return str.split('').map(c => c.charCodeAt(0)).join('-');
}

/**
 * @method decode
 * @param code {string} 解码字符串
 * @description 将字符串进行解码（需要使用encode编码）
 * @return {string}
 * **/
export function decode(code: string = ''): string {
    return code.split('-').map(c => String.fromCharCode(Number(c))).join('');
}

/**
 * @method toBase64
 * @param file {file}
 * @description 将二进制文件 转换为base64
 * @return {Promise}
 * **/
export function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = res => resolve(res?.target?.result as string);
        fr.onerror = e => reject(e);
    });
}

/**
 * @method selectFile
 * @param multiple {boolean} 多文件
 * @description 选择文件
 * @return {Promise}
 * **/
export function selectFile(multiple: boolean = false): Promise<File | FileList> {
    return new Promise((resolve, _reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        if (multiple) input.multiple = true;
        input.addEventListener('change', () => resolve(multiple ? input.files! : input.files![0]));
        input.click();
    });
}

/**
 * @method getRouterQuery
 * @description 将路由查询 按照对象返回
 * @return {object}
 * **/
export function getRouterQuery(): { [key: string]: string } {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
}

/**
 * @method routerPush
 * @param r {any} RouterObject
 * @param to {string} 目标地址
 * @param type {string} 跳转类型 push&replace 可选
 * @description 路由跳转
 * **/
export function routerPush(r: any, to: string, type: string = 'push'): void {
    r[type]({
        path: to,
        query: getRouterQuery()
    });
}

/**
 * @method downloadFile
 * @param conf{object}
 * @description 下载文件
 * @return {Promise}
 * **/
export function downloadFile(conf: { download: string; href: string }): Promise<HTMLAnchorElement> {
    return new Promise((resolve, _reject) => {
        const a = document.createElement('a');
        a.download = conf.download;
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
export function stringToBinary(str: string): string {
    return str.split('').map(char => char.charCodeAt(0).toString(2)).join(' ');
}

/**
 * @method binaryToString
 * @param str {string}
 * @description 二进制字符串转换为 字符串
 * @return {string}
 * **/
export function binaryToString(str: string): string {
    return str.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
}

/**
 * @method formatSec
 * @param sec {number}
 * @param isMs {boolean}
 * @description 将 整秒 转换为 01:22 格式
 * @return {string}
 * **/
export function formatSec(sec: number, isMs: boolean = false): string {
    if (isMs) sec /= 1000;
    const minutes = Math.floor(sec / 60).toString().padStart(2, '0');
    const seconds = (sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

/**
 * @method toCSV
 * @param arr{array}
 * @description 转换为CSV文件(只返回地址，下载请调用downloadFile函数)
 * @return {string} 地址
 * **/
export function toCSV(arr: string[][]): string {
    return 'data:text/csv;charset=utf-8,\ufeff' + arr.map(row => row.join(',')).join('\r\n');
}

/**
 * @method getFormData
 * @param data{object}
 * @description 将对象转换为FormData
 * @return {FormData}
 * **/
export function getFormData(data: { [key: string]: any }): FormData {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return formData;
}

/**
 * @method getMediaType
 * @param mediaName {string} 'xxx.mp4'
 * @description 获取媒体文件类型
 * @return {string} 'mp4'
 * **/
export function getMediaType(mediaName: string): string {
    return mediaName.split('.').pop() || '';
}

/**
 * @method createQueryParams
 * @param data {string}
 * @description 创建一个http查询参数
 * @return {string}  '?id=xx&name=xx'
 * **/
export function createQueryParams(data: { [key: string]: any }): string {
    return new URLSearchParams(data).toString();
}

/**
 * @method isMobileDevice
 * @description 是否移动设备
 * @return {boolean}
 * **/
export function isMobileDevice(): boolean {
    return !!navigator.userAgent.match(/Mobile/i)?.length;
}
