/**
 * utils/utils.ts
 * @author ayuanlmo
 * 一些工具函数
 * **/

module.exports.stringToBinary = stringToBinary;
module.exports.binaryToString = binaryToString;

function stringToBinary(str: string): string {
    const _: string[] = [];
    const __: string[] = str.split("");

    for (let i: number = 0; i < __.length; i += 1) {
        if (i !== 0)
            _.push(" ");
        // @ts-ignore
        _.push(__[i].charCodeAt().toString(2));
    }
    return _.join("");
}

function binaryToString(str: string): string {
    const _: string[] = [];
    const list: string[] = str.split(" ");

    for (let i: number = 0; i < list.length; i += 1) {
        _.push(String.fromCharCode(parseInt(list[i], 2)));
    }
    return _.join("");
}
