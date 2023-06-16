import {Request, Response, Router} from "express";

const Path = require('path');
const _Router: Router = Router();

const CreateNotFoundMessage = (): object => {
    return {
        data: {},
        code: 404,
        message: 'No Found'
    };
};

_Router
    .route('/*')
    .post((req: Request, res: Response) => {
        res.json(CreateNotFoundMessage());
        return req;
    })
    .get((req: Request, res: Response) => {
        // 检查包含的目录
        if (req.url.includes('/css') || req.url.includes('/static') || req.url.includes('/js') || req.url.includes('/style') || req.url.includes('/favicon.ico'))
            res.sendFile(Path.resolve('./dist/web' + req.url));// 写出文件
        else
            res.sendFile(Path.resolve('./dist/web/index.html'));// 写出索引页
        return req;
    });

export default _Router;