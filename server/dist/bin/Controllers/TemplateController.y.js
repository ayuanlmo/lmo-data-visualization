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
class TemplateControllerY {
}
_a = TemplateControllerY;
TemplateControllerY.GetTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, BasicsFuncs_y_1.GetTemplateList)(res);
    return req;
});
TemplateControllerY.DeleteTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, BasicsFuncs_y_1.DeleteTemplate)(req, res);
});
TemplateControllerY.EditTemplateInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, BasicsFuncs_y_1.EditTempInfo)(req, res);
});
exports.default = TemplateControllerY;
//# sourceMappingURL=TemplateController.y.js.map