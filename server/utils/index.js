module.exports.stringToBinary = stringToBinary;
module.exports.binaryToString = binaryToString;

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