"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Conf_y_1 = require("../../conf/Conf.y");
const _Net = require('net');
const _Clc = require('cli-color');
const _Global = global;
class Net {
    constructor(App) {
        this.App = App;
        this.Port = Conf_y_1.default.__SERVER_PORT - 1;
        this.StartServer();
    }
    StartServer() {
        this.Port++;
        const test_server = _Net.createServer().listen(this.Port);
        test_server.on('listening', () => __awaiter(this, void 0, void 0, function* () {
            yield test_server.close();
            setTimeout(() => {
                this.App.listen(this.Port, () => __awaiter(this, void 0, void 0, function* () {
                    _Global.__SERVER_PORT = this.Port;
                    yield this.PrintNetworkInfo();
                }));
            }, 200);
        }));
        test_server.on('error', (_e) => {
            if (_e.code === 'EADDRINUSE') {
                console.warn(`连接埠${this.Port}被占用,正在其他埠尝试启动`);
                this.StartServer();
            }
        });
    }
    PrintNetworkInfo() {
        console.log('\n\n=========================================\n\n');
        console.log('        _                 _ _          _   _             ');
        console.log('       (_)               | (_)        | | (_)            ');
        console.log(' __   ___ ___ _   _  __ _| |_ ______ _| |_ _  ___  _ __  ');
        console.log(' \\ \\ / / / __| | | |/ _` | | |_  / _` | __| |/ _ \\| \'_ \\ ');
        console.log('  \\ V /| \\__ \\ |_| | (_| | | |/ / (_| | |_| | (_) | | | |');
        console.log('   \\_/ |_|___/\\__,_|\\__,_|_|_/___\\__,_|\\__|_|\\___/|_| |_|\n\n');
        console.log(_Clc['red']('\n Server running at:\n'));
        console.log(`   -Local: ${_Clc['blue'](`  //localhost:${this.Port}/`)}`);
        this.LocalNetworkInformation().map((i) => {
            console.log(`   -NetWork: ${_Clc.blue(`//${i}:${this.Port}/`)}`);
        });
        console.log('\n\n=========================================');
    }
    LocalNetworkInformation() {
        const nf = require('os')['networkInterfaces']();
        const list = [];
        for (const i in nf) {
            for (const j in nf[i]) {
                const _t = nf[i][j];
                if (_t['family'] === 'IPv4')
                    list['push'](_t.cidr['split']('/')[0]);
            }
        }
        return list;
    }
}
exports.default = Net;
//# sourceMappingURL=Net.y.js.map