/**
 * net/index.js
 * @author ayuanlmo
 * 该模块用于检查端口是否被占用 和 启动服务
 * **/

const _Net = require('net');
const _Clc = require("cli-color");

let _Port = require('../../conf/ServerConfig')['__SERVER_PORT'] - 1;
const _ = {
    __START_SERVER: (__) => {
        _Port += 1;
        const _test_server = _Net['createServer']()['listen'](_Port);

        _test_server['on']('listening', () => {
            _test_server['close']();
            setTimeout(async () => {
                __['listen'](_Port, () => {
                    global['__SERVER_PORT'] = _Port;
                    _['__PRINT_NETWORK_INTO']();
                });
            });
        });
        _test_server['on']('error', (_e) => {
            if (_e['code'] === 'EADDRINUSE') {
                console.log(`${_Port}端口被占用,正在尝试启动新的端口`);
                _['__START_SERVER'](__);
            }
        });
    },
    __LOCAL_NETWORK_INTERFACES() {
        const _NF = require('os')['networkInterfaces']();
        const _na = [];

        // eslint-disable-next-line guard-for-in
        for (const i in _NF) {
            // eslint-disable-next-line guard-for-in
            for (const j in _NF[i]) {
                const _t = _NF[i][j];

                if (_t['family'] === 'IPv4')
                    _na['push'](_t.cidr['split']('/')[0]);
            }
        }
        return _na;
    },
    __PRINT_NETWORK_INTO: () => {
        console.log('\n\n=========================================\n\n');
        console.log('        _                 _ _          _   _             ');
        console.log('       (_)               | (_)        | | (_)            ');
        console.log(' __   ___ ___ _   _  __ _| |_ ______ _| |_ _  ___  _ __  ');
        console.log(' \\ \\ / / / __| | | |/ _` | | |_  / _` | __| |/ _ \\| \'_ \\ ');
        console.log('  \\ V /| \\__ \\ |_| | (_| | | |/ / (_| | |_| | (_) | | | |');
        console.log('   \\_/ |_|___/\\__,_|\\__,_|_|_/___\\__,_|\\__|_|\\___/|_| |_|\n\n');
        console.log(_Clc['red']('\n Server running at:\n'));
        console.log(`   -Local: ${_Clc['blue'](`  //localhost:${_Port}/`)}`);
        _['__LOCAL_NETWORK_INTERFACES']()['map'](i => {
            console.log(`   -NetWork: ${_Clc['blue'](`//${i}:${_Port}/`)}`);
        });
        console.log('\n\n=========================================');
    }
};

module.exports = _;