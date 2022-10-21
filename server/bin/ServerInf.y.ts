const Os = require('os');

class ServerInf {
    constructor() {
        this.init();
    }

    public init(): object {
        return {
            system: Os.release(),
            systemArch: Os.arch(),
            systemPlatform: Os.platform(),
            systemType: Os.type(),
            systemRunTime: (Os.uptime() / 60 / 60 / 24).toFixed(2)
        }
    }
}

export default new ServerInf().init();