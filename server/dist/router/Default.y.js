"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _Router = (0, express_1.Router)();
const CreateNotFoundMessage = () => {
    return {
        data: {},
        code: 404,
        message: 'No Found'
    };
};
_Router
    .route('')
    .post((req, res) => {
    res.json(CreateNotFoundMessage());
    return req;
})
    .get((req, res) => {
    res.json(CreateNotFoundMessage());
    return req;
});
exports.default = _Router;
//# sourceMappingURL=Default.y.js.map