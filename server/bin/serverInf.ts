/**
 * @class ServerInf
 * @author ayuanlmo
 * @constructor
 * **/

class ServerInf {
    private _OS: any;

    constructor() {
        this._OS = require('os');
    }

    GET(): object {
        return {
            system: this._OS.release(),
            systemArch: this._OS.arch(),
            systemPlatform: this._OS.platform(),
            systemType: this._OS.type(),
            systemRunTime: (this._OS.uptime() / 60 / 60 / 24).toFixed(2)
        };
    }
}

module.exports = new ServerInf().GET();