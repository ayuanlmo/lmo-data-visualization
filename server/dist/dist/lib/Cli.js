"use strict";
var Cli, __spreadArray = this && this.__spreadArray || function (r, e, o) { if (o || 2 === arguments.length)
    for (var l, n = 0, a = e.length; n < a; n++)
        !l && n in e || ((l = l || Array.prototype.slice.call(e, 0, n))[n] = e[n]); return r.concat(l || Array.prototype.slice.call(e)); };
Object.defineProperty(exports, "__esModule", { value: !0 }), function (r) { var o = require("cli-color"); r.debug = function () { for (var r = [], e = 0; e < arguments.length; e++)
    r[e] = arguments[e]; return console.log.apply(console, __spreadArray([o.bgGreen("Debug:")], r, !1)); }, r.log = function () { for (var r = [], e = 0; e < arguments.length; e++)
    r[e] = arguments[e]; return console.log.apply(console, __spreadArray([o.bgGreen("Log:")], r, !1)); }, r.warn = function () { for (var r = [], e = 0; e < arguments.length; e++)
    r[e] = arguments[e]; return console.warn.apply(console, __spreadArray([o.bgYellow("Warn:")], r, !1)); }; }(Cli = Cli || {}), exports.default = Cli;
