/***
 * func.ts
 * @author ayuanlmo
 * 一些函数
 * */

const _Fs: any = require('fs-extra');
const _F = {
    _GetSuccessMessage: (data: object = {}): object => {
        return {
            data: data,
            message: 'success',
            code: 200,
            _t: new Date()['getTime']()
        };
    },
    async _GetTemplateList(_: any) {
        await _Fs.readdir('./static/DataVisualizationTemplate', () => {
            const __: Array<object> = [];
            const _T_DB = new (require('./lib/sqlite/sqlite.t')['T_DB']);

            _T_DB._QUERY_TEMPLATE_LIST().then((res: Array<any>) => {
                res.map((i: any) => {
                    __.push({
                        id: i.T_Id,
                        url: i.T_Path,
                        cover: `/static/DataVisualizationTemplate/${i.T_Name}/cover.png`,
                        template: i.T_Name,
                        title: i.T_Title,
                        description: i.T_Description
                    });
                });
                _.json(
                    _F._GetSuccessMessage({
                        list: __
                    })
                );
                _T_DB._CLOSE();
            });
        });
    },
    _GetMedia: (_: any): void => {
        const _outputDir = './static/output';

        if (!_Fs.existsSync(_outputDir))
            _Fs.mkdir(_outputDir);
        _Fs.readdir('./static/output', (_e: never, _d: Array<any>) => {
            const __: Array<object> = [];

            _d.forEach((i: string) => {
                if (i.split('.')[1] === 'mp4') {
                    __.push({
                        name: i,
                        path: `/static/output/${i}`
                    });
                }
            });
            _.json(
                _F._GetSuccessMessage({
                    list: __
                })
            );
        });
    },
    _Stringify(data = {}): string {
        return JSON.stringify(data);
    },
    _Get_UUID(): string {
        const _: Array<string> = [];
        const __ = "ting0123456789QWERYUOPASDFHJKLZXCVBNM";

        for (let i = 0; i < 36; i += 1) {
            _[i] = __.substr(Math.floor(Math.random() * 0x10), 1);
        }
        _[14] = "4";
        // @ts-ignore
        _[19] = __.substr(_[19] & 0x3 | 0x8, 1);
        _[8] = _[13] = _[18] = _[23] = "-";
        return _.join("");
    }
};

module.exports = _F;
