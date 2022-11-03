"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Api_y_1 = require("./Api.y");
const Default_y_1 = require("./Default.y");
const express_1 = require("express");
const _Router = (0, express_1.Router)();
_Router.use('/api', Api_y_1.default);
_Router.use('/', Default_y_1.default);
_Router.use('*', Default_y_1.default);
exports.default = _Router;
//# sourceMappingURL=index.y.js.map