"use strict";
var __importDefault = this && this.__importDefault || function (e) { return e && e.__esModule ? e : { default: e }; }, sequelize_1 = (Object.defineProperty(exports, "__esModule", { value: !0 }), require("sequelize")), dataBase_1 = require("../dataBase"), utils_1 = __importDefault(require("../../utils")), AppConfig_1 = __importDefault(require("../../conf/AppConfig")), createSuccessMessage = utils_1.default.createSuccessMessage, createErrorMessage = utils_1.default.createErrorMessage, TemplateController = function () { function e() { } return e.getTemplates = function (e, a) { var t, e = null != (e = e.body) ? e : {}, r = e.name, s = e.pageIndex, s = void 0 === s ? 0 : s, e = e.pageSize, e = void 0 === e ? 10 : e; dataBase_1.TemplateModel.findAndCountAll({ where: { name: ((t = {})[sequelize_1.Op.like] = "%".concat(void 0 === r ? "" : r, "%"), t) }, offset: (s - 1) * s, limit: e }).then(function (e) { var t = e.rows, e = e.count; a.json(createSuccessMessage({ rows: t, total: e })); }); }, e.getTemplate = function (e, t) { var a, e = e.params.id; dataBase_1.TemplateModel.findOne({ where: { id: ((a = {})[sequelize_1.Op.like] = "".concat(void 0 === e ? "" : e), a) } }).then(function (e) { t.json(createSuccessMessage(null != e ? e : {})); }); }, e.editTemplate = function (e, t) { var a, r, s, o, n; AppConfig_1.default.__LIVE_SERVER ? t.json(createErrorMessage("ext00el")) : (a = (e = null != (e = e.body) ? e : {}).id, o = e.name, s = void 0 === o ? "" : o, o = e.description, n = void 0 === o ? "" : o, "" === (r = void 0 === a ? "" : a) ? t.json(createErrorMessage("ext005")) : dataBase_1.TemplateModel.findOne({ where: { id: ((e = {})[sequelize_1.Op.like] = "".concat(r), e) } }).then(function (e) { e ? 1 === (e = e.dataValues).type ? t.json(createErrorMessage("ext007")) : dataBase_1.TemplateModel.update({ name: "" === s ? e.name : s, description: "" === n ? e.description : n }, { where: { id: ((e = {})[sequelize_1.Op.like] = "".concat(r), e) } }).then(function (e) { 1 === e[0] ? t.status(204).send() : t.json(createErrorMessage("ext00d1")); }).catch(function () { t.json(createErrorMessage("ext00d")); }) : t.json(createErrorMessage("ext006")); })); }, e; }();
exports.default = TemplateController;
