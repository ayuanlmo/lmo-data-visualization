"use strict";
Object.defineProperty(exports, "__esModule", { value: !0 });
var NC = require("node-cache"), MemoryCache = function () { function e() { this.Cache = new NC; } return e.prototype.set = function (e, t, r) { return this.Cache.set(e, t, r = void 0 === r ? 0 : r); }, e.prototype.get = function (e, t) { return this.Cache.get(e); }, e.prototype.remove = function (e) { return this.Cache.del(e); }, e.prototype.clear = function () { this.Cache.flushAll(); }, e; }();
exports.default = new MemoryCache;
