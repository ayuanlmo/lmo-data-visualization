import {Router, Request, Response} from "express";

const _Router = Router();

const CreateNotFoundMessage = (): object => {
    return {
        data: {},
        code: 404,
        message: 'No Found'
    };
};

_Router
    .route('')
    .post((req: Request, res: Response) => {
        res.json(CreateNotFoundMessage());
        return req;
    })
    .get((req: Request, res: Response) => {
        res.json(CreateNotFoundMessage());
        return req;
    });

export default _Router;