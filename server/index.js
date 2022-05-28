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
        if (msg === 'ping') ws.send('pong');
    });
});
_App.post('/api/getTemplate', (re1, res) => {
    require('./funcs')._getTemplateList(res);
});
// _App.post('/api/synthesisVideo', (req, res) => {
//     const keys = Object.keys(req.body);
//
//     if (keys.indexOf('url') === -1 || keys.indexOf('config') === -1)
//         return res.json({
//             message: '参数不合法，请检查',
//             data: {},
//             code: 500
//         });
//     require('./timecut/index').synthesis();
//     res.json({
//         message: '成功',
//         data: {},
//         code: 200
//     });
// });

_App.listen(3000, () => {
    console.log(`\n服务启动\n http://localhost:${3000}/ \n http://127.0.0.1:${3000}/`);
});
