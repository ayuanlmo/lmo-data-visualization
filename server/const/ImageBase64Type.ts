/**
 * ImageBase64Type 图片base64头
 * @enum
 * **/
enum ImageBase64Type {
    jpg = 'data:image/jpeg;base64,',
    jpeg = 'data:image/jpeg;base64,',
    png = 'data:image/png;base64,',
    svg = 'data:image/svg+xml;base64,'
}

module.exports.GET_IMAGE_BASE64_TYPE = (type: string): string => {
    // @ts-ignore
    return ImageBase64Type[`${type}`] || '';
}