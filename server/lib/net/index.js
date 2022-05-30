const _Net = require('net');
const _Conf = require('../../conf/ServerConfig');
const _Clc = require("cli-color");


let _Port = _Conf.__SERVER_PORT - 1;

const _ = {
    __START_SERVER: (_app) => {

        _Port += 1;
        const _test_server = _Net.createServer().listen(_Port);

        _test_server.on('listening', () => {
            _test_server.close();
            setTimeout(async () => {
                _app.listen(_Port, () => {
                    _.__PRINT_NETWORK_INTO();
                });
            });
        });
        _test_server.on('error', (e) => {
            if (e.code === 'EADDRINUSE') {
                console.log(`${_Port}端口被占用,正在尝试启动新的端口`);
                _.__START_SERVER(_app);
            }
        });
    },
    __LOCAL_NETWORK_INTERFACES() {
        const _NF = require('os').networkInterfaces();
        const _net_address = [];

        // eslint-disable-next-line guard-for-in
        for (const i in _NF) {
            // eslint-disable-next-line guard-for-in
            for (const j in _NF[i]) {
                const _t = _NF[i][j];

                if (_t.family === 'IPv4')
                    _net_address.push(_t.cidr.split('/')[0]);
            }
        }
        return _net_address;
    },
    __PRINT_NETWORK_INTO: () => {
        console.log('\n\n=========================================');
        console.log('\n Server running at:            \n');
        console.log(`   -Local: ${_Clc.blue(`  http://localhost:${_Port}`)}`);
        _.__LOCAL_NETWORK_INTERFACES().map(i => {
            console.log(`   -NetWork: ${_Clc.blue(`${i}:${_Port}`)}`);
        });
        console.log('\n=========================================');
        console.log(_Clc.bgGreen('Done'));
    }
};

module.exports = _;