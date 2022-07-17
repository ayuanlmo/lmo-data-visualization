/***
 * fun's.js
 * @author ayuanlmo
 * 一些函数
 * */

const _Fs = require('fs-extra');

module.exports = {
    _GetSuccessMessage: (data = {}) => {
        return {
            data: data,
            message: 'success',
            code: 200,
            _t: new Date()['getTime']()
        };
    },
    async _GetTemplateList(_) {
        await _Fs['readdir']('./static/DataVisualizationTemplate', () => {
            const __ = [];
            const _T_DB = new (require('./lib/sqlite/index')['T_DB']);

            _T_DB['_QUERY_TEMPLATE_LIST']()['then'](res => {
                res['map'](i => {
                    __['push']({
                        id: i['T_Id'],
                        url: i['T_Path'],
                        cover: `/static/DataVisualizationTemplate/${i['T_Name']}/cover.png`,
                        template: i['T_Name'],
                        title: i['T_Title'],
                        description: i['T_Description']
                    });
                });
                _['json'](
                    require('./funcs')['_GetSuccessMessage']({
                        list: __
                    })
                );
                _T_DB['_CLOSE']();
            });
        });
    },
    _GetMedia: (_) => {
        const _outputDir = './static/output';

        if (!_Fs['existsSync'](_outputDir))
            _Fs['mkdir'](_outputDir);
        _Fs['readdir']('./static/output', (_e, _d) => {
            const __ = [];

            _d['forEach'](i => {
                if (i['split']('.')[1] === 'mp4') {
                    __['push']({
                        name: i,
                        path: `/static/output/${i}`
                    });
                }
            });
            _['json'](
                require('./funcs')['_GetSuccessMessage']({
                    list: __
                })
            );
        });
    },
    _Stringify(data = {}) {
        return JSON['stringify'](data);
    },
    _Get_UUID() {
        const _ = [];
        const __ = "ting0123456789QWERYUOPASDFHJKLZXCVBNM";

        for (let i = 0; i < 36; i += 1) {
            _[i] = __.substr(Math.floor(Math.random() * 0x10), 1);
        }
        _[14] = "4";
        _[19] = __.substr(_[19] & 0x3 | 0x8, 1);
        _[8] = _[13] = _[18] = _[23] = "-";
        return _.join("");
    }
};