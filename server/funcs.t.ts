/***
 * func.ts
 * @author ayuanlmo
 * 一些函数
 * */

const _Fs: any = require('fs-extra');
const _F = {
    /**
     * @method GET_SUCCESS_MESSAGE
     * @description 获取成功消息
     * @param data {Object}
     * @return Object
     * **/
    GET_SUCCESS_MESSAGE: (data: object = {}): object => {
        return {
            data: data,
            message: 'success',
            code: 200,
            _t: new Date()['getTime']()
        };
    },
    /**
     * @method GET_ERROR_MESSAGE
     * @description 获取失败消息
     * @param data{Object}
     * @param msg {String}
     * @return Object
     * **/
    GET_ERROR_MESSAGE(data: object = {}, msg: string = ''): object {
        return {
            data: data,
            message: msg,
            code: 500,
            _t: new Date()['getTime']()
        };
    },
    /**
     * @method GET_TEMPLATE_LIST
     * @description 获取模板列表
     * @param _ {any} 响应对象
     * @async
     * **/
    async GET_TEMPLATE_LIST(_: any) {
        await _Fs.readdir('./static/DataVisualizationTemplate', () => {
            const __: Array<object> = [];
            const _T_DB = new (require('./lib/sqlite/sqlite.t')['T_DB']);

            _T_DB.QUERY_TEMPLATE_LIST().then((res: Array<any>) => {
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
                    _F.GET_SUCCESS_MESSAGE({
                        list: __
                    })
                );
                _T_DB.CLOSE();
            });
        });
    },
    /**
     * @method GET_UPLOAD_MEDIA
     * @description 获取上传媒体文件
     * @param _ {any} 响应对象
     * **/
    GET_UPLOAD_MEDIA: (_: any) => {
        _Fs.readdir('./static/uploads', (_e: never, _d: Array<any>) => {
            _.json(
                _F.GET_SUCCESS_MESSAGE({
                    audioMedia: _F.FILTER_MEDIA(_d, 'audio'),
                    videoMedia: _F.FILTER_MEDIA(_d, 'video'),
                    imageMedia: _F.FILTER_MEDIA(_d, 'image')
                })
            );
        });
    },
    /**
     * @method FILTER_MEDIA
     * @description 过滤媒体文件
     * @param _ {Array}<string> 媒体文件组
     * @param type {String} 媒体类型
     * @return Array
     * **/
    FILTER_MEDIA: (_: Array<string>, type: string = 'audio') => {
        const Arr: Array<object> = [];

        _.filter((i: string) => {
            return require('./const/MediaTypes.t')[type].includes(i.split('.')[1])
        }).map((i: string) => {
            Arr.push({
                name: i,
                path: `/static/uploads/${i}`
            })
        });
        return Arr;
    },
    /**
     * @method UPLOAD_FILE
     * @description 上传文件
     * @param _ {any} 请求对象
     * @param __ {any} 响应对象
     * @return Promise<any>
     * **/
    UPLOAD_FILE: async (_: any, __: any): Promise<any> => {
        const File: any = _.file;

        File.originalname = require('./utils/utils.t').TO_UTF8(File.originalname);

        if (!File) {
            return __.send(_F.GET_ERROR_MESSAGE({}, require('./conf/Message.t').__NO_FILE));
        }
        const FD: string = require('path').resolve('./static/uploads');
        const OriginName: string = `${FD}/${File.filename}`;
        if (!require('./const/FileTypes.t').includes(File.mimetype)) {
            await _F.DEL_TEMP_FILE(OriginName);
            return __.send(_F.GET_ERROR_MESSAGE({}, require('./conf/Message.t').__FILE_NS.replace('$t', `${File.originalname}`)))
        }
        const Extname: Array<string> = File.originalname.split('.');
        Extname[1].split(' ').join('');
        const FR: any = _Fs.createReadStream(File.path);
        const FN: string = `${Extname[0]}${new Date().getTime()}.${Extname[1]}`;
        const FW = await _Fs.createWriteStream(`${FD}/${FN}`);
        await FR.pipe(FW);
        await _F.DEL_TEMP_FILE(OriginName);
        await __.send(_F.GET_SUCCESS_MESSAGE({
            path: `/static/uploads/${FN}`
        }));
    },
    /**
     * @method DEL_TEMP_FILE
     * @description 删除文件上传产生的临时文件
     * @param _ {String} 文件路径
     * @async
     * @return Promise<any>
     * **/
    DEL_TEMP_FILE: async (_: string): Promise<any> => {
        await _Fs.unlink(_);
    },
    /**
     * @method GET_MEDIA
     * @description 获取合成媒体
     * @param _ {any} 响应对象
     * **/
    GET_MEDIA: (_: any): void => {
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
                _F.GET_SUCCESS_MESSAGE({
                    list: __
                })
            );
        });
    },
    /**
     * @method STRINGIFY
     * @description Object转String
     * @param data {Object | Array | null}
     * @return String
     * **/
    STRINGIFY(data = {}): string {
        return JSON.stringify(data);
    },
    /**
     * @method GET_UUID
     * @description 获取一个UUID
     * @return String
     * **/
    GET_UUID(): string {
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
