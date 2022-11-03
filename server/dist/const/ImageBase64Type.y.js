"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_IMAGE_BASE64_TYPE = void 0;
var ImageBase64TypeY;
(function (ImageBase64TypeY) {
    ImageBase64TypeY["jpg"] = "data:image/jpeg;base64,";
    ImageBase64TypeY["jpeg"] = "data:image/jpeg;base64,";
    ImageBase64TypeY["png"] = "data:image/png;base64,";
    ImageBase64TypeY["svg"] = "data:image/svg+xml;base64,";
})(ImageBase64TypeY || (ImageBase64TypeY = {}));
const GET_IMAGE_BASE64_TYPE = (type) => {
    return ImageBase64TypeY[`${type}`] || '';
};
exports.GET_IMAGE_BASE64_TYPE = GET_IMAGE_BASE64_TYPE;
//# sourceMappingURL=ImageBase64Type.y.js.map