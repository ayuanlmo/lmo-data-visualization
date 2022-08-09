/**
 * Core
 * @author ayuanlmo
 * **/

(() => {
    const _Express = require('express');
    const _Router = require('./const/Routers.t');
    const _Func = require('./funcs.t');
    const _Conf: any = require('./conf/Conf.t');
    const _Cmd = require('./const/CMD.t');
    const _N = require('./lib/net/net.t');
    const _Path = require('path');
    const _App = _Express();
    const _Multer: any = require('multer')({dest: './static/uploads'});
    const _WsApp: any = require('express-ws')(_App);
    const _Pool: any = _WsApp['getWss'](_Router.__SOCKET_CONNECT);

    let _OnlineUsers: number = 0;

    // @ts-ignore
    global['dbConf'] = {
        _path: _Path['resolve'](__dirname + '/lib/sqlite/db/db.ting.db'),
        _template: _Path['resolve'](__dirname + '/static/DataVisualizationTemplate'),
        index: require('./const/TemplateIndex.t')
    };
    new (require('./lib/sqlite/sqlite.t').T_DB);
    _App.use(_Express.urlencoded({extended: false}));
    _App.use(_Multer.single('media'));
    _App.use(_Conf.__STATIC_PATH, _Express.static(`${__dirname}${_Conf.__STATIC_PATH}`));
    _App.use(_Conf.__STATIC_PATH, _Express.static(`../dist`));
    _App.ws(_Router.__SOCKET_CONNECT, async (_: any) => {
        _OnlineUsers += 1;
        if (!_Conf.__FFMPEG)
            await _.send(require('./utils/utils.t').STRING_TO_BINARY(_Func.STRINGIFY({
                type: 'showMessage',
                data: {
                    message: require('./conf/Message.t').__NO_FFMPEG,
                    timestamp: new Date().getTime()
                }
            })));
        await require('./utils/utils.t').CHECK_264_LIB().then((r: boolean) => {
            if (!r)
                _.send(require('./utils/utils.t').STRING_TO_BINARY(_Func.STRINGIFY({
                    type: 'showMessage',
                    data: {
                        message: require('./conf/Message.t').__NO_264LIB,
                        timestamp: new Date().getTime()
                    }
                })));
        });
        _.on('message', (__: string) => {
            if (__ === _Conf.__SOCKET_PONG_KEY)
                return _.send(_Conf.__SOCKET_PONG_MESSAGE);
            const _m: any = JSON.parse(require('./utils/utils.t').BINARY_TO_STRING(__));

            if (_m.cmd === _Cmd['__SYNTHESIS'])
                new (require('./bin/timecut.t')).TC(_Pool, _m['data']);
        });
        _.on('close', () => {
            _OnlineUsers -= 1;
        });
        await _.send(
            require('./utils/utils.t').STRING_TO_BINARY(_Func.STRINGIFY({
                type: 'connect',
                data: {
                    onlineUsers: _OnlineUsers,
                    tenantID: `ting-${_Func.GET_UUID()}`,
                    timestamp: new Date().getTime()
                }
            }))
        );
    });
    _App.post(_Router.__GET_TEMPLATE, (_: any, __: any) => {
        return _Func.GET_TEMPLATE_LIST(__);
    });
    _App.post(_Router.__UPLOAD_MEDIA, (_: any, __: any): void => {
        return _Func.UPLOAD_FILE(_, __);
    });
    _App.post(_Router.__GET_UPLOAD_MEDIA, (_: any, __: any): void => {
        return _Func.GET_UPLOAD_MEDIA(__);
    });
    _App.post(_Router.__GET_MEDIA, (_: any, __: any): void => {
        return _Func.GET_MEDIA(__);
    });
    _App.get('*', (_: any, __: any): void => {
        __.json({data: {}, code: 404, message: 'No Found'});
    });
    _App.post('*', (_: any, __: any): void => {
        __.json({data: {}, code: 404, message: 'No Found'});
    });
    _N.START_SERVER(_App);
})();
