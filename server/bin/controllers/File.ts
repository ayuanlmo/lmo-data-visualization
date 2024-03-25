import * as fs from "fs";
import path from "path";
import {Request, Response} from "express";
import Utils from "../../utils";
import AppConfig from "../../conf/AppConfig";
import UpLoadFileTypes from "../../const/UpLoadFileTypes";
import {ReadStream, WriteStream} from "node:fs";
import {UpLoadFilesModel} from "../dataBase";
import createErrorMessage = Utils.createErrorMessage;
import createSuccessMessage = Utils.createSuccessMessage;

export default class File {
    public static upload(req: Request, res: Response): void {
        const File: Express.Multer.File | undefined = req.file;

        if (!File)
            return void res.json(createErrorMessage('ext001'));

        if (!UpLoadFileTypes.includes(File.mimetype))
            return void res.json(createErrorMessage('ext002'));

        const {
            name = File.filename
        } = req.body ?? {};

        const fileExtension: string = path.extname(File.originalname);
        const fr: ReadStream = fs.createReadStream(File.path);
        const fileName: string = '/' + File.filename + `${fileExtension}`;
        const fw: WriteStream = fs.createWriteStream(File.destination + fileName);
        const data = {
            id: require('uuid').v4(),
            name: name,
            path: `${AppConfig.__STATIC_PATH}/uploads` + fileName,
            type: File.mimetype,
            createTime: new Date().getTime().toString()
        }

        fr.pipe(fw);
        fw.on('finish', (): void => {
            fs.unlink(File.path, (err: NodeJS.ErrnoException | null): void => {
                if (err)
                    return void res.json(createErrorMessage('ext00e'));
                else
                    UpLoadFilesModel.create(data).then((): void => {
                        res.json(createSuccessMessage(data));
                    }).catch((): void => {
                        res.json(createErrorMessage('ext00d'));
                    });
            });
        });
    }

    public static delete(req: Request, res: Response): void {
        const {
            id = ""
        } = req.params;

        if (id === '')
            return void res.json(createErrorMessage('ext003'));

        UpLoadFilesModel.findOne({
            where: {id: id}
        }).then((data) => {
            if (Object.keys(data ?? {}).length === 0)
                return void res.json(createErrorMessage('ext004'));

            const filePath: string = path.resolve(`./${data?.dataValues.path}`);

            UpLoadFilesModel.destroy({
                where: {id: id}
            }).then((rows: number): void => {
                if (rows > 0) {
                    if (fs.existsSync(filePath))
                        fs.unlinkSync(filePath);
                    res.status(204).send();
                } else
                    res.json(createErrorMessage('ext00d'));
            });
        });
    }
}
