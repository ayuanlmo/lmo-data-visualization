interface ErrorTypes {
    code: string;
}

interface NetTypes {
    createServer: Function;
}

interface TestServerTypes {
    on: Function;
    close: Function;
}

import Conf from "../../conf/Conf.y";
import {Express} from "express";

const _Net: NetTypes = require('net');
const _Clc: any = require('cli-color');
const _Global: any = global;

export default class Net {
    private readonly App: Express;
    private Port: number;

    constructor(App: Express) {
        this.App = App;
        this.Port = Conf.__SERVER_PORT - 1;
        this.StartServer();
    }

    private StartServer(): void {
        if (this.Port === Conf.__SERVER_MAX_PORT){
            console.warn('已超过当前允许的最大端口范围，程序已退出');
            return require('process').exit();
        }
        this.Port++;
        const test_server: TestServerTypes = _Net.createServer().listen(this.Port);

        test_server.on('listening', async () => {
            //新连接埠正常 关掉测试服务
            await test_server.close();
            setTimeout((): void => {
                this.App.listen(this.Port, async () => {
                    _Global.__SERVER_PORT = this.Port;
                    await this.PrintNetworkInfo();
                });
            }, 200);
        });
        test_server.on('error', (_e: ErrorTypes): void => {
            // 连接埠被占用
            if (_e.code === 'EADDRINUSE') {
                console.warn(`连接埠${this.Port}被占用,正在其他埠尝试启动`);
                this.StartServer();
            }
        });
    }

    private PrintNetworkInfo(): void {
        console.log('\n\n=========================================\n\n');
        console.log('        _                 _ _          _   _             ');
        console.log('       (_)               | (_)        | | (_)            ');
        console.log(' __   ___ ___ _   _  __ _| |_ ______ _| |_ _  ___  _ __  ');
        console.log(' \\ \\ / / / __| | | |/ _` | | |_  / _` | __| |/ _ \\| \'_ \\ ');
        console.log('  \\ V /| \\__ \\ |_| | (_| | | |/ / (_| | |_| | (_) | | | |');
        console.log('   \\_/ |_|___/\\__,_|\\__,_|_|_/___\\__,_|\\__|_|\\___/|_| |_|\n\n');
        console.log(_Clc['red']('\n Server running at:\n'));
        console.log(`   -Local: ${_Clc['blue'](`  //localhost:${this.Port}/`)}`);
        this.LocalNetworkInformation().map((i: string) => {
            console.log(`   -NetWork: ${_Clc.blue(`//${i}:${this.Port}/`)}`);
        });
        console.log('\n\n=========================================');
    }

    private LocalNetworkInformation(): Array<string> {
        const nf: any = require('os')['networkInterfaces']();
        const list: Array<string> = [];

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