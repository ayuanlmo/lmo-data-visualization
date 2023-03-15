import FS from 'fs-extra';
import Message from "../conf/Message.y";
import Conf from "../conf/Conf.y";
import DefaultConf from "../conf/Default.y";
import FileTypes from "../const/FileTypes.y";
import MediaTypes from "../const/MediaTypes.Y";
import {Request, Response} from "express";
import {TempLateItemApp} from "../interface/DataBase.y";
import {DeleteMedia, MediaListType, MediaType, MediaTypeApp} from "../interface/Media.y";
import {DeleteTemplateParams, EditTemplateInfoParams} from "../interface/Template.y";
import {FileType} from "../interface/File.y";
import {CREATE_ERROR_MESSAGE, CREATE_SUCCESS_MESSAGE, TO_UTF8} from "../utils/Utils.y";
import YingDB from "../lib/db/DataBase.y";

const Fs: FS = require('fs-extra');
const Path = require('path');
const DB = new YingDB();

interface ResponseTemplateItemTypes {
    id: string;
    url: string;
    cover: string;
    template: string;
    title: string;
    description: string;
    type: string;
}

function FilterMediaFile(list: Array<string>, type: string = '__AUDIO') {
    const List: Array<MediaListType> = [];

    list.filter((i: string) => {
        return MediaTypes[type].includes(i.split('.')[1]);
    }).map((i: string) => {
        const media: Array<string> = i.split('.');

        List.push({
            name: media[0],
            type: media[1],
            path: `/static/uploads/${i}`
        });
    });

    return List;
}

async function DeleteTempFile(path: string): Promise<void> {
    await Fs.unlink(path);
}

export async function GetTemplateList(req: Request, res: Response): Promise<void> {
    const query: any = req.query;
    const params: { title: string, type: string } = query;
    params.title = params.title ?? '';
    params.type = params.type ?? '';
    if (params.type === 'all')
        params.type = '';

    DB.GetTemplateList(params).then((resp: Array<any>) => {
        const defaultTemplates: Array<ResponseTemplateItemTypes> = [];
        const customTemplates: Array<ResponseTemplateItemTypes> = [];

        resp.map((i: TempLateItemApp) => {
            if (i.type === '0') {
                defaultTemplates.push({
                    id: i.id,
                    url: i.path,
                    cover: `/static/DataVisualizationTemplate/${i.name}/cover.png`,
                    template: i.name,
                    title: i.title,
                    description: i.description,
                    type: i.type
                });
            } else {
                customTemplates.push({
                    id: i.id,
                    url: i.path,
                    cover: `/static/DataVisualizationTemplate/${i.name}/cover.png`,
                    template: i.name,
                    title: i.title,
                    description: i.description,
                    type: i.type
                });
            }
        });
        res.json(CREATE_SUCCESS_MESSAGE({
            list: [...defaultTemplates, ...customTemplates]
        }));
    }).catch(err => {
        res.json(CREATE_ERROR_MESSAGE({}, err));
    });
}

export async function DeleteTemplate(req: Request, res: Response): Promise<any> {
    if (Conf.__LIVE_SERVER)
        return res.json(CREATE_ERROR_MESSAGE({}, Message.__LIVE_SERVER));

    const query: any = req.query;
    const params: DeleteTemplateParams = query;

    if (!Object.keys(params).includes('id') || params.id === '')
        res.json(CREATE_ERROR_MESSAGE({}, Message.__DEL_TEMPLATE_ERROR_NT));
    else {
        DB.DeleteTemplate(params.id).then(() => {
            res.json(CREATE_SUCCESS_MESSAGE());
        }).catch((err: string) => {
            if (err === 'No-template')
                res.json(CREATE_ERROR_MESSAGE({}, Message.__DEL_TEMPLATE_ERROR_NT))
            if (err === 'Prohibited')
                res.json(CREATE_ERROR_MESSAGE({}, Message.__DEL_PROHIBITED))
        });
    }
}

export async function EditTempInfo(req: Request, res: Response): Promise<void> {
    const query: any = req.query;
    const params: EditTemplateInfoParams = query;

    if (!Object.keys(params).includes('id')) {
        res.json(CREATE_ERROR_MESSAGE({}, Message.__NO_MEDIA_ID));
    } else {
        DB.EditTemplateInfo(params.id, params).then(() => {
            res.json(CREATE_SUCCESS_MESSAGE({}));
        }).catch((e: string) => {
            if (e === 'err')
                res.json(CREATE_ERROR_MESSAGE({}, Message.__EDIT_DEFAULT_TEMPLATE));
        })
    }
    return new Promise(() => {
        Promise.resolve(1);
    });
}

export async function GetMedia(req: Request, res: Response): Promise<void> {
    const type: any = req.query.type;
    const list: Array<MediaType> = [];

    DB.GetMediaList(type ?? '').then((MediaList: Array<MediaTypeApp>) => {
        MediaList.map((i: MediaTypeApp) => {
            list.push({
                name: i.name,
                path: i.path,
                create_at: i.create_at,
                status: i.status,
                id: i.id
            });
        });
        res.json(CREATE_SUCCESS_MESSAGE({
            list: list
        }));
    });
}

export async function DeleteMedia(req: Request, res: Response): Promise<void> {
    if (Conf.__LIVE_SERVER)
        res.json(CREATE_ERROR_MESSAGE({}, Message.__LIVE_SERVER));
    else {
        const data: any = req.query;
        const params: DeleteMedia = data;

        DB.DeleteMediaItem(params.id).then(async (r: number) => {
            if (r === 1) {
                const mediaPath: string = Path.resolve(`server/../${params.path}`);
                const mediaLogPath: string = Path.resolve(`server/../static/log/${params.id}.y.log`);

                await Fs.unlinkSync(mediaPath);
                await Fs.unlinkSync(mediaLogPath);
                await DB.DeleteLog(params.id);
                await res.json(CREATE_SUCCESS_MESSAGE({}));
            } else
                await res.json(CREATE_ERROR_MESSAGE({}, Message.__DEL_MEDIA_ERROR));
        });
    }
}

export async function UpLoadMediaFile(req: Request, res: Response): Promise<any> {
    if (!DefaultConf.__UPLOAD)
        return res.json(CREATE_ERROR_MESSAGE({}, Message.__UPLOAD_CLOSE));

    const File: FileType = req['file'];

    if (!File)
        return res.json(CREATE_ERROR_MESSAGE({}, Message.__NO_FILE));

    File.originalname = TO_UTF8(File.originalname);
    const OriginPath: string = Path.resolve('server/../static/uploads');
    const TempFilePath: string = `${OriginPath}/${File.filename}`;

    if (!FileTypes.includes(File.mimetype)) {
        await DeleteTempFile(TempFilePath);
        return res.json(CREATE_ERROR_MESSAGE({}, Message.__FILE_NS.replace('$y', `[${File.originalname}]`)));
    }
    const Extname: Array<string> = File.originalname.split('.');
    Extname[1].split(' ').join('');
    const Fr: any = Fs.createReadStream(File.path);
    const FileName: string = `${Extname[0]}${new Date().getTime()}.${Extname[1]}`;
    const Fw = Fs.createWriteStream(`${OriginPath}/${FileName}`);
    await Fr.pipe(Fw);
    await DeleteTempFile(TempFilePath);
    await res.json(CREATE_SUCCESS_MESSAGE({
        path: `/static/uploads/${FileName}`
    }));
}

export async function GetUploadMediaFile(res: Response): Promise<void> {
    Fs.readdir(Path.resolve('server/../static/uploads'), (err: never, list: Array<any>) => {
        if (!err)
            res.json(CREATE_SUCCESS_MESSAGE({
                audioMedia: FilterMediaFile(list, '__AUDIO'),
                videoMedia: FilterMediaFile(list, '__VIDEO'),
                imageMedia: FilterMediaFile(list, '__IMAGE'),
            }));
    });
}
