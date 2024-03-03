"use strict";
var __awaiter = this && this.__awaiter || function (e, l, o, n) { return new (o = o || Promise)(function (a, t) { function i(e) { try {
    r(n.next(e));
}
catch (e) {
    t(e);
} } function s(e) { try {
    r(n.throw(e));
}
catch (e) {
    t(e);
} } function r(e) { var t; e.done ? a(e.value) : ((t = e.value) instanceof o ? t : new o(function (e) { e(t); })).then(i, s); } r((n = n.apply(e, l || [])).next()); }); }, __generator = this && this.__generator || function (i, s) { var r, l, o, n = { label: 0, sent: function () { if (1 & o[0])
        throw o[1]; return o[1]; }, trys: [], ops: [] }, u = { next: e(0), throw: e(1), return: e(2) }; return "function" == typeof Symbol && (u[Symbol.iterator] = function () { return this; }), u; function e(a) { return function (e) { var t = [a, e]; if (r)
    throw new TypeError("Generator is already executing."); for (; n = u && t[u = 0] ? 0 : n;)
    try {
        if (r = 1, l && (o = 2 & t[0] ? l.return : t[0] ? l.throw || ((o = l.return) && o.call(l), 0) : l.next) && !(o = o.call(l, t[1])).done)
            return o;
        switch (l = 0, (t = o ? [2 & t[0], o.value] : t)[0]) {
            case 0:
            case 1:
                o = t;
                break;
            case 4: return n.label++, { value: t[1], done: !1 };
            case 5:
                n.label++, l = t[1], t = [0];
                continue;
            case 7:
                t = n.ops.pop(), n.trys.pop();
                continue;
            default:
                if (!(o = 0 < (o = n.trys).length && o[o.length - 1]) && (6 === t[0] || 2 === t[0])) {
                    n = 0;
                    continue;
                }
                if (3 === t[0] && (!o || t[1] > o[0] && t[1] < o[3]))
                    n.label = t[1];
                else if (6 === t[0] && n.label < o[1])
                    n.label = o[1], o = t;
                else {
                    if (!(o && n.label < o[2])) {
                        o[2] && n.ops.pop(), n.trys.pop();
                        continue;
                    }
                    n.label = o[2], n.ops.push(t);
                }
        }
        t = s.call(i, n);
    }
    catch (e) {
        t = [6, e], l = 0;
    }
    finally {
        r = o = 0;
    } if (5 & t[0])
    throw t[1]; return { value: t[0] ? t[1] : void 0, done: !0 }; }; } }, __importDefault = this && this.__importDefault || function (e) { return e && e.__esModule ? e : { default: e }; }, path = (Object.defineProperty(exports, "__esModule", { value: !0 }), exports.UpLoadFilesModel = exports.ResourcesModel = exports.TemplateModel = void 0, require("path")), sequelize_1 = require("sequelize"), Cli_1 = __importDefault(require("../../lib/Cli")), AppConfig_1 = __importDefault(require("../../conf/AppConfig")), DB = new sequelize_1.Sequelize({ dialect: "sqlite", storage: path.resolve("./_data/db/dv_data.ting"), logging: AppConfig_1.default.__DEV_SERVER }), TemplateModel = DB.define("Templates", { id: { primaryKey: !0, type: sequelize_1.DataTypes.TEXT }, name: sequelize_1.DataTypes.TEXT, description: sequelize_1.DataTypes.TEXT, path: sequelize_1.DataTypes.TEXT, cover: sequelize_1.DataTypes.TEXT, createTime: sequelize_1.DataTypes.TEXT, type: sequelize_1.DataTypes.INTEGER }, { timestamps: !1 }), ResourcesModel = (exports.TemplateModel = TemplateModel, DB.define("Resources", { id: { primaryKey: !0, type: sequelize_1.DataTypes.TEXT }, name: sequelize_1.DataTypes.TEXT, template: sequelize_1.DataTypes.TEXT, filePath: sequelize_1.DataTypes.TEXT, createTime: sequelize_1.DataTypes.TEXT }, { timestamps: !1 })), UpLoadFilesModel = (exports.ResourcesModel = ResourcesModel, DB.define("UpLoadFiles", { id: { primaryKey: !0, type: sequelize_1.DataTypes.TEXT }, name: sequelize_1.DataTypes.TEXT, path: sequelize_1.DataTypes.TEXT, createTime: sequelize_1.DataTypes.TEXT, type: sequelize_1.DataTypes.TEXT }, { timestamps: !1 }));
exports.UpLoadFilesModel = UpLoadFilesModel;
try {
    __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (e) { switch (e.label) {
        case 0: return [4, DB.authenticate()];
        case 1: return e.sent(), DB.sync().then(function () { Cli_1.default.debug("Models synced successfully."); }), [2];
    } }); });
}
catch (e) {
    Cli_1.default.warn("Unable to connect to the database:", e), process.exit(0);
}
exports.default = DB;
