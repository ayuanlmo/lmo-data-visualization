import * as fs from "fs";
import path from "path";
import {Request, Response} from "express";
import Utils from "../../utils";
import AppConfig from "../../conf/AppConfig";
import UpLoadFileTypes from "../../const/UpLoadFileTypes";
import {ReadStream, WriteStream} from "node:fs";
import {UpLoadFilesCategoryModel, UpLoadFilesModel} from "../dataBase";
import {Op} from "sequelize";
import createErrorMessage = Utils.createErrorMessage;
import createSuccessMessage = Utils.createSuccessMessage;

interface IQueryCriteria {
    [key: string]: any;
}

export default class File {
    public static upload(req: Request, res: Response): void {
        const File: Express.Multer.File | undefined = req.file;

        if (!File)
            return void res.json(createErrorMessage('ext001'));

        if (!UpLoadFileTypes.includes(File.mimetype))
            return void res.json(createErrorMessage('ext002'));

        const {
            name = File.filename,
            categoryId = null
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
            createTime: new Date().getTime().toString(),
            categoryId: categoryId
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
        } = req.body;

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

    public static edit(req: Request, res: Response): void {
        const {
            id = '',
            name = '',
            categoryId = null
        } = req.body;

        UpLoadFilesModel.findOne({
            where: {id: id}
        }).then((data) => {
            if (data) {
                UpLoadFilesModel.update({
                    name,
                    categoryId
                }, {
                    where: {id: id}
                }).then((editRes): void => {
                    if (editRes)
                        res.status(204).send();
                    else
                        res.json(createErrorMessage('ext00d'));
                });
            } else {
                res.json(createErrorMessage('ext00e'));
            }
        });
    }

    public static getFiles(req: Request, res: Response): void {
        const {
            name = '',
            pageIndex = 0,
            pageSize = 10,
            categoryId = ''
        } = req.query ?? {};
        const where: IQueryCriteria = {
            name: {[Op.like]: `%${name}%`}
        }

        if (categoryId !== '')
            where.categoryId = categoryId;

        UpLoadFilesModel.findAndCountAll({
            where: where,
            offset: (Number(pageIndex) - 1) * Number(pageIndex),
            limit: Number(pageSize)
        }).then(({rows, count}): void => {
            res.json(createSuccessMessage({
                rows,
                total: count
            }));
        });
    }

    public static getFileCategory(_req: Request, res: Response): void {
        UpLoadFilesCategoryModel.findAll().then((data) => {
            const map: any = {};
            const tree: any[] = [];
            const ids: Array<string> = [];

            data.forEach(i => {
                map[i.dataValues.id] = {...i.dataValues, children: []};
                ids.push(i.dataValues.id);
            });

            data.forEach(i => {
                if (i.dataValues.parentId !== null)
                    map[i.dataValues.parentId].children.push(map[i.dataValues.id]);
                else
                    tree.push(map[i.dataValues.id]);
            });

            res.json(createSuccessMessage({
                tree,
                ids
            }));
        });
    }

    public static addFileCategory(req: Request, res: Response): void {
        const {
            name = '',
            parentId = null,
            id = ''
        } = req.body ?? {};

        if (name === '' || name.length > 16)
            return void res.json(createErrorMessage('ext00e'));

        if (name !== '' && id !== '') {
            return void UpLoadFilesCategoryModel.findOne({
                where: {id: id}
            }).then(category => {
                if (category)
                    UpLoadFilesCategoryModel.update({
                        name
                    }, {
                        where: {id: id}
                    }).then((): void => {
                        res.status(204).send();
                    });
            });
        }
        if (name !== '' && parentId !== '') {
            return void UpLoadFilesCategoryModel.create({
                id: require('uuid').v4(),
                name,
                parentId
            }).then((): void => {
                res.status(204).send();
            }).catch((): void => {
                res.json(createErrorMessage('ext00e'));
            });
        } else
            res.json(createErrorMessage('ext00e'));
    }

    public static deleteFileCategory(req: Request, res: Response): void {
        const {
            id = ""
        } = req.body;

        if (id === "")
            return void res.json(createErrorMessage('ext003'));

        UpLoadFilesCategoryModel.findOne({
            where: {id}
        }).then((item): void => {
            if (item) {
                UpLoadFilesCategoryModel.findAll({
                    where: {parentId: id}
                }).then((Category: any): void => {
                    if (Category.length > 0)
                        return void res.json(createErrorMessage('ext00e'));
                    else {
                        UpLoadFilesCategoryModel.destroy({
                            where: {id}
                        }).then((): void => {
                            res.status(204).send();
                        });
                    }
                });
            } else
                return void res.json(createErrorMessage('ext00e'));
        });
    }
}
