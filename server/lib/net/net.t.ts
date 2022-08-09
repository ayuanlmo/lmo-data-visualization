/**
 * /lib/net/net.ts
 * @author ayuanlmo
 * Net module
 * **/

const _Net: any = require('net');
const _Clc: any = require('cli-color');
const _global: any = global;

let _Port: number = require('../../conf/Conf.t').__SERVER_PORT - 1;

const _: any = {
    START_SERVER: (__: any): void => {
        _Port += 1;
        const _test_server: any = _Net.createServer().listen(_Port);

        _test_server.on('listening', () => {
            _test_server.close();
            setTimeout(async () => {
                __.listen(_Port, () => {
                    _global.__SERVER_PORT = _Port;
                    _.PRINT_NETWORK_INTO();
                });
            });
        });
        _test_server.on('error', (_e: any): void => {
            if (_e.code === 'EADDRINUSE') {
                console.log(`${_Port}端口被占用,正在尝试在新的端口启动`);
                _.__START_SERVER(__);
            }
        });
    },
    LOCAL_NETWORK_INTERFACES(): Array<string> {
        const _NF: any = require('os')['networkInterfaces']();
        const _na: Array<string> = [];

        for (const i in _NF) {
            for (const j in _NF[i]) {
                const _t = _NF[i][j];

                if (_t['family'] === 'IPv4')
                    _na['push'](_t.cidr['split']('/')[0]);
            }
        }
        return _na;
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
        console.log(`   -Local: ${_Clc['blue'](`  //localhost:${_Port}/`)}`);
        _.LOCAL_NETWORK_INTERFACES().map((i: string) => {
            console.log(`   -NetWork: ${_Clc.blue(`//${i}:${_Port}/`)}`);
        });
        console.log('\n\n=========================================');
    }
};

module.exports = _;
