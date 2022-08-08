/**
 * Core
 * @author ayuanlmo
 * **/

(() => {
    const _Express = require('express');
    const _Router = require('./const/routers.t');
    const _Func = require('./funcs.t');
    const _Conf: any = require('./conf/conf.t');
    const _Cmd = require('./const/cmd.t');
    const _N = require('./lib/net/net.t');
    const _Path = require('path');
    const _App = _Express();
    const _Multer: any = require('multer')({dest: './static/uploads'});
    const _WsApp: any = require('express-ws')(_App);
    const _Pool: any = _WsApp['getWss'](_Router.__SOCKET_CONNECT);

    let onlineUsers: number = 0;

    // @ts-ignore
    global['dbConf'] = {
        _path: _Path['resolve'](__dirname + '/lib/sqlite/db/db.ting.db'),
        _template: _Path['resolve'](__dirname + '/static/DataVisualizationTemplate'),
        index: require('./const/templateIndex.t')
    };
    new (require('./lib/sqlite/sqlite.t').T_DB);
    _App.use(_Express.urlencoded({extended: false}));
    _App.use(_Multer.single('media'));
    _App.use(_Conf.__STATIC_PATH, _Express.static(`${__dirname}${_Conf.__STATIC_PATH}`));
    _App.use(_Conf.__STATIC_PATH, _Express.static(`../dist`));
    _App.ws(_Router.__SOCKET_CONNECT, async (_: any) => {
        onlineUsers += 1;
        if (!_Conf.__FFMPEG)
            await _.send(require('./utils/utils.t').stringToBinary(_Func._Stringify({
                type: 'showMessage',
                data: {
                    message: require('./conf/message.t').__NO_FFMPEG,
                    timestamp: new Date().getTime()
                }
            })));
        await require('./utils/utils.t').check264Lib().then((r: boolean) => {
            if (!r)
                _.send(require('./utils/utils.t').stringToBinary(_Func._Stringify({
                    type: 'showMessage',
                    data: {
                        message: require('./conf/message.t').__NO_264LIB,
                        timestamp: new Date().getTime()
                    }
                })));
        });
        _.on('message', (__: string) => {
            if (__ === _Conf.__SOCKET_PONG_KEY)
                return _.send(_Conf.__SOCKET_PONG_MESSAGE);
            const _m: any = JSON.parse(require('./utils/utils.t').binaryToString(__));

            if (_m.cmd === _Cmd['__SYNTHESIS'])
                new (require('./bin/timecut.t')).TC(_Pool, _m['data']);
        });
        _.on('close', () => {
            onlineUsers -= 1;
        });
        await _.send(
            require('./utils/utils.t').stringToBinary(_Func._Stringify({
                type: 'connect',
                data: {
                    onlineUsers: onlineUsers,
                    tenantID: `ting-${_Func._Get_UUID()}`,
                    timestamp: new Date().getTime()
                }
            }))
        );
    });
    _App.post(_Router.__GET_TEMPLATE, (_: any, __: any) => {
        return _Func._GetTemplateList(__);
    });
    _App.post(_Router.__UPLOAD_MEDIA, (_: any, __: any): void => {
        return _Func._UpLoadFile(_, __);
    });
    _App.post(_Router.__GET_UPLOAD_MEDIA, (_: any, __: any): void => {
        return _Func._GetUpLoadMedia(__);
    });
    _App.post(_Router.__GET_MEDIA, (_: any, __: any): void => {
        return _Func._GetMedia(__);
    });
    _App.get('*', (_: any, __: any): void => {
        __.json({data: {}, code: 404, message: 'No Found'});
    });
    _App.post('*', (_: any, __: any): void => {
        __.json({data: {}, code: 404, message: 'No Found'});
    });
    _N.__START_SERVER(_App);
})();
