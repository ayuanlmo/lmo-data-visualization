import ConfY from "../../conf/Conf.y";
import {Express} from "express";

const _Net: any = require('net');
const _Clc: any = require('cli-color');
const _Global: any = global;

let Port = ConfY.__SERVER_PORT - 1;


export const Net: any = {
    START_SERVER: (App: Express) => {
        Port++;
        //启动一个测试服务
        const _Test_Server: any = _Net.createServer().listen(Port);

        _Test_Server.on('listening', async () => {
            //新连接埠正常 关掉测试服务
            await _Test_Server.close();
            setTimeout(async () => {
                App.listen(Port, () => {
                    _Global.__SERVER_PORT = Port;
                    Net.PRINT_NETWORK_INTO();
                });
            });
        });
        _Test_Server.on('error', (_e: any): void => {
            //新连接埠被占用 重新获取一个新连接埠
            if (_e.code === 'EADDRINUSE') {
                console.warn(`${Port}端口被占用,正在尝试在新的端口启动`);
                Net.START_SERVER(App);
            }
        });
    },
    PRINT_NETWORK_INTO: (): void => {
        console.log('\n\n=========================================\n\n');
        console.log('        _                 _ _          _   _             ');
        console.log('       (_)               | (_)        | | (_)            ');
        console.log(' __   ___ ___ _   _  __ _| |_ ______ _| |_ _  ___  _ __  ');
        console.log(' \\ \\ / / / __| | | |/ _` | | |_  / _` | __| |/ _ \\| \'_ \\ ');
        console.log('  \\ V /| \\__ \\ |_| | (_| | | |/ / (_| | |_| | (_) | | | |');
        console.log('   \\_/ |_|___/\\__,_|\\__,_|_|_/___\\__,_|\\__|_|\\___/|_| |_|\n\n');
        console.log(_Clc['red']('\n Server running at:\n'));
        console.log(`   -Local: ${_Clc['blue'](`  //localhost:${Port}/`)}`);
        Net.LOCAL_NETWORK_INTERFACES().map((i: string) => {
            console.log(`   -NetWork: ${_Clc.blue(`//${i}:${Port}/`)}`);
        });
        console.log('\n\n=========================================');
    },
    LOCAL_NETWORK_INTERFACES: (): Array<string> => {
        const Nf: any = require('os')['networkInterfaces']();
        const List: Array<string> = [];

        for (const i in Nf) {
            for (const j in Nf[i]) {
                const _t = Nf[i][j];

                if (_t['family'] === 'IPv4')
                    List['push'](_t.cidr['split']('/')[0]);
            }
        }

        return List;
    }
}
