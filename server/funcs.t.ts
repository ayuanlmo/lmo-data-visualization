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
        _GetErrorMessage(data: object = {}, msg: string = ''): object {
            return {
                data: data,
                message: msg,
                code: 500,
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
        _GetUpLoadMedia: (__: any) => {
            _Fs.readdir('./static/uploads', (_e: never, _d: Array<any>) => {
                __.json(
                    _F._GetSuccessMessage({
                        audioMedia: _F._FilterMedia(_d, 'audio'),
                        videoMedia: _F._FilterMedia(_d, 'video'),
                        imageMedia: _F._FilterMedia(_d, 'image')
                    })
                );
            });
        },
        _FilterMedia: (_: Array<string>, type: string = 'audio') => {
            const Arr: Array<object> = [];

            _.filter((i: string) => {
                return require('./const/mediaTypes')[type].includes(i.split('.')[1])
            }).map((i: string) => {
                Arr.push({
                    name: i,
                    path: `/static/output/${i}`
                })
            });
            return Arr;
        },
        _UpLoadFile: async (_: any, __: any): Promise<any> => {
            const File: any = _.file;
            if (!File) {
                return __.send(_F._GetErrorMessage({}, require('./conf/message.t').__NO_FILE));
            }
            const FD: string = require('path').resolve('./static/uploads');
            const OriginName: string = `${FD}/${File.filename}`;
            if (!require('./const/fileTypes').includes(File.mimetype)) {
                await _F._DelTempFile(OriginName);
                return __.send(_F._GetErrorMessage({}, require('./conf/message.t').__FILE_NS.replace('$t', `${File.originalname}`)))
            }
            const Extname: Array<string> = File.originalname.split('.');
            Extname[1].split(' ').join('');
            const FR: any = _Fs.createReadStream(File.path);
            const FN: string = `${Extname[0]}${new Date().getTime()}.${Extname[1]}`;
            const FW = await _Fs.createWriteStream(`${FD}/${FN}`);
            await FR.pipe(FW);
            await _F._DelTempFile(OriginName);
            await __.send(_F._GetSuccessMessage({
                path: `/static/uploads/${FN}`
            }));
        },
        _DelTempFile: async (_: string): Promise<any> => {
            await _Fs.unlink(_);
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
        _Stringify(data = {})
            :
            string {
            return JSON.stringify(data);
        }
        ,
        _Get_UUID()
            :
            string {
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
    }
;

module.exports = _F;
