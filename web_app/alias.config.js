/**
 * 本文件仅作为 WebStorm 路径解析使用。
 * preferences -> Language & Framework -> JavaScript -> Webpack
 * **/

const resolve = (dir) => {
    return require('path').join(__dirname, dir);
};

module.exports = {
    resolve: {
        alias: {
            '@': resolve('src')
        }
    }
};