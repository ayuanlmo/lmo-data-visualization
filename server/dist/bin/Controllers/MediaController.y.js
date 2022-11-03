"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const BasicsFuncs_y_1 = require("../BasicsFuncs.y");
class MediaController {
}
_a = MediaController;
MediaController.UpLoadMediaFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, BasicsFuncs_y_1.UpLoadMediaFile)(req, res);
});
MediaController.GetMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, BasicsFuncs_y_1.GetMedia)(req, res);
});
MediaController.DeleteMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, BasicsFuncs_y_1.DeleteMedia)(req, res);
});
MediaController.GetUploadMediaFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, BasicsFuncs_y_1.GetUploadMediaFile)(res);
    return req;
});
exports.default = MediaController;
//# sourceMappingURL=MediaController.y.js.map