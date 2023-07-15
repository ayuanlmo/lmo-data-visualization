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
        const allowedPaths: Array<string> = ['/css', '/static', '/js', '/style', '/favicon.ico'];

        if (allowedPaths.some((path: string) => req.url.includes(path))) {
            res.sendFile(Path.resolve('./web' + req.url), {}, (e: any) => {
                if (e)
                    res.status(e.status).end();
            });
        } else
            res.sendFile(Path.resolve('./web/index.html'));
        return req;
    });

export default _Router;
