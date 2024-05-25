import {ReadStream} from "node:fs";
import fs from "fs";
import {resolve} from "path";
import {Request, Response} from "express";
import {UpLoadFilesModel} from "./dataBase";
import Utils from "../utils";
import createErrorMessage = Utils.createErrorMessage;

export default class Player {
    constructor(req: Request, res: Response) {
        if (!req.headers.range) {
            return res.json({
                code: 500,
                message: 'No range header'
            });
        }

        UpLoadFilesModel.findOne({
            where: {
                id: req.params.id
            }
        }).then(data => {
            if (!data)
                return res.json(createErrorMessage('ext004'));

            const {path, type} = data.dataValues;
            const filePath: string = resolve(__dirname, '../', '_data/static/public/uploads/' + path.split('/static/uploads')[1]);
            if (!fs.existsSync(filePath))
                return void res.json(createErrorMessage('ext001'));
            const size: number = fs.statSync(filePath).size;
            const p: Array<string> = (req.headers.range ?? '').replace(/bytes=/, '').split('-');
            const start: number = parseInt(p[0], 10);
            const end: number = p[1] ? parseInt(p[1], 10) : size - 1;
            const stream: ReadStream = fs.createReadStream(filePath);

            res.writeHead(206, {
                'Content-Type': type,
                'Accept-Ranges': 'bytes',
                'Content-Length': (end - start) + 1,
                'Content-Range': `bytes ${start}-${end}/${size}`
            });
            stream.pipe(res);
        });
    }
}