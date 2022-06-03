/**
 * Net module
 * @author ayuanlmo
 * @module net
 * @module cli-color
 * Created by ayuanlmo on 2022/06
 * **/

const _Net = require('net');
const _Conf = require('../../conf/ServerConfig');
const _Clc = require("cli-color");

let _PORT = _Conf.__SERVER_PORT - 1;

const _ = {
    __START_SERVER: (_app) => {

        _PORT += 1;
        const _TEST_SERVER = _Net.createServer().listen(_PORT);

        _TEST_SERVER.on('listening', () => {
            _TEST_SERVER.close();
            setTimeout(async () => {
                _app.listen(_PORT, () => {
                    _.__PRINT_NETWORK_INTO();
                });
            });
        });
        _TEST_SERVER.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.log(`${_PORT}端口被占用,正在尝试启动新的端口`);
                _.__START_SERVER(_app);
            }
        });
    },
    __LOCAL_NETWORK_INTERFACES() {
        const _NF = require('os').networkInterfaces();
        const _NET_ADDRESS = [];

        // eslint-disable-next-line guard-for-in
        for (const i in _NF) {
            // eslint-disable-next-line guard-for-in
            for (const j in _NF[i]) {
                const _t = _NF[i][j];

                if (_t.family === 'IPv4')
                    _NET_ADDRESS.push(_t.cidr.split('/')[0]);
            }
        }
        return _NET_ADDRESS;
    },
    __PRINT_NETWORK_INTO: () => {
        console.log('\n\n=========================================');
        console.log(_Clc.red('\n Server running at:\n'));
        console.log(`   -Local: ${_Clc.blue(`  http://localhost:${_PORT}`)}`);
        _.__LOCAL_NETWORK_INTERFACES().map(i => {
            console.log(`   -NetWork: ${_Clc.blue(`http://${i}:${_PORT}`)}`);
        });
        console.log('\n=========================================');
        console.log(_Clc.bgGreen(' SERVER START '));
    }
};

module.exports = _;