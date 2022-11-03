"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TemplateController_y_1 = require("../bin/Controllers/TemplateController.y");
const MediaController_y_1 = require("../bin/Controllers/MediaController.y");
const express_1 = require("express");
const _Router = (0, express_1.Router)();
_Router
    .route('/GetTemplate')
    .post(TemplateController_y_1.default.GetTemplate);
_Router
    .route('/DeleteTemplate')
    .post(TemplateController_y_1.default.DeleteTemplate);
_Router
    .route('/EditTemplateInfo')
    .post(TemplateController_y_1.default.EditTemplateInfo);
_Router
    .route('/UpLoadMediaFile')
    .post(MediaController_y_1.default.UpLoadMediaFile);
_Router
    .route('/GetMedia')
    .post(MediaController_y_1.default.GetMedia);
_Router
    .route('/DeleteMedia')
    .post(MediaController_y_1.default.DeleteMedia);
_Router
    .route('/GetUploadMediaFile')
    .post(MediaController_y_1.default.GetUploadMediaFile);
exports.default = _Router;
//# sourceMappingURL=Api.y.js.map