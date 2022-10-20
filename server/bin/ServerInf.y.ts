class ServerInfY {
    private os: any;

    constructor() {
        this.os = require('os');
        this.init();
    }

    public init(): object {
        return {
            system: this.os.release(),
            systemArch: this.os.arch(),
            systemPlatform: this.os.platform(),
            systemType: this.os.type(),
            systemRunTime: (this.os.uptime() / 60 / 60 / 24).toFixed(2)
        }
    }
}

export default new ServerInfY().init();