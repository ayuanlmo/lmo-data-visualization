"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Os = require('os');
class ServerInf {
    constructor() {
        this.init();
    }
    init() {
        return {
            system: Os.release(),
            systemArch: Os.arch(),
            systemPlatform: Os.platform(),
            systemType: Os.type(),
            systemRunTime: (Os.uptime() / 60 / 60 / 24).toFixed(2)
        };
    }
}
exports.default = new ServerInf().init();
//# sourceMappingURL=ServerInf.y.js.map