/**
 * ImageBase64Type 图片base64头
 * @enum
 * **/
enum ImageBase64TypeY {
    jpg = 'data:image/jpeg;base64,',
    jpeg = 'data:image/jpeg;base64,',
    png = 'data:image/png;base64,',
    svg = 'data:image/svg+xml;base64,'
}

export const GET_IMAGE_BASE64_TYPE = (type: string) => {
    return ImageBase64TypeY[`${type}`] || '';
}