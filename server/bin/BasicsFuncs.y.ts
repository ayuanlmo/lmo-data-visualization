// import Conf from "./conf/Conf.y";
import Message from "../conf/Message.y";
import {Request, Response} from "express";
import YingDB from "../lib/sqlite/DataBase.y";
import {TempLateItemApp} from "../interface/DataBase.y";
import {CREATE_ERROR_MESSAGE, CREATE_SUCCESS_MESSAGE} from "../utils/Utils.y";
import {DeleteMedia, MediaType, MediaTypeApp} from "../interface/Media.y";
import {EditTemplateInfoParams} from "../interface/Template.y";
import Conf from "../conf/Conf.y";

// const Fs = require('fs-extra');
// const Path = require('path');

export async function GetTemplateList(res: Response): Promise<void> {
    const list: Array<object> = [];

    new YingDB().GetTemplateList().then((r: Array<any>) => {
        r.map((i: TempLateItemApp) => {
            list.push({
                id: i.T_Id,
                url: i.T_Path,
                cover: `/static/DataVisualizationTemplate/${i.T_Name}/cover.png`,
                template: i.T_Name,
                title: i.T_Title,
                description: i.T_Description,
                type: i.T_Type
            });
        });
        res.json(CREATE_SUCCESS_MESSAGE({
            list: list
        }));
    });
}

export async function DeleteTemplate(req: Request, res: Response): Promise<void> {
    if (Conf.__LIVE_SERVER) {
        res.json(CREATE_ERROR_MESSAGE({}, Message.__LIVE_SERVER));
    }
    const query: any = req.query;
    const params: EditTemplateInfoParams = query;

    if (!Object.keys(params).includes('id') || params.id === '')
        res.json(CREATE_ERROR_MESSAGE({}, Message.__DEL_TEMPLATE_ERROR_NT));
    else
        new YingDB().DeleteTemplate(params.id).then(() => {
            res.json(CREATE_SUCCESS_MESSAGE());
        }).catch((err: string) => {
            if (err === 'No-template')
                res.json(CREATE_ERROR_MESSAGE({}, Message.__DEL_TEMPLATE_ERROR_NT))
            if (err === 'Prohibited')
                res.json(CREATE_ERROR_MESSAGE({}, Message.__DEL_PROHIBITED))
        });
}

export async function EditTempInfo(req: Request, res: Response): Promise<void> {
    const query: any = req.query;
    const params: EditTemplateInfoParams = query;

    if (!Object.keys(params).includes('id')) {
        res.json(CREATE_ERROR_MESSAGE({}, Message.__NO_MEDIA_ID));
    } else {
        new YingDB().EditTemplateInfo(params.id, params).then(() => {
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

    new YingDB().GetMediaList(type ?? '').then((l: Array<MediaTypeApp>) => {
        console.log('list', l);
        l.map((i: MediaTypeApp) => {
            list.push({
                name: i.T_name,
                path: i.T_Path,
                create_at: i.T_Create_At,
                status: i.T_Status,
                id: i.T_ID
            });
        });
        res.json(CREATE_SUCCESS_MESSAGE({
            list: list
        }));
    });
}

export async function DeleteMedia(req: Request, res: Response): Promise<any> {
    if (Conf.__LIVE_SERVER)
        res.json(CREATE_ERROR_MESSAGE({}, Message.__LIVE_SERVER));
    else {
        const data: any = req.query;
        const params: DeleteMedia = data;

        new YingDB().DeleteMediaItem(params.id).then((r: number) => {
            if (r === 1)
                res.json(CREATE_SUCCESS_MESSAGE({}))
            else
                res.json(CREATE_ERROR_MESSAGE({}, Message.__DEL_MEDIA_ERROR))
        });
    }
}
