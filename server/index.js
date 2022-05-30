/**
 * Data-Visualization Server
 * **/
const express = require('express');
const _App = express();

require('express-ws')(_App);
_App.use(express.urlencoded({extended: false}));
_App.use('/static', express.static(__dirname + '/static'));
_App.ws('/ws/connect', (ws, request) => {
    ws.on('message', msg => {
        if (msg === 'ping') return ws.send('pong');
        const m = JSON.parse(msg);

        if (m['cmd'] === 'synthesis') {
            new (require('./timecut/index')).tc(ws, m.data);
        }
    });
});
_App.post('/api/getTemplate', (req, res) => {
    require('./funcs')._getTemplateList(res);
});
_App.post('/api/getMedia', (req, res) => {
    require('./funcs')._getMedia(res);
});

_App.listen(3000, () => {
    console.log(`\n服务启动\n http://localhost:${3000}/ \n http://127.0.0.1:${3000}/`);
});
