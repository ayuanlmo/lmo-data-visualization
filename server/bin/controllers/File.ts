import * as fs from "fs";
import path from "path";
import crypto from "node:crypto";
import {Request, Response} from "express";
import Utils from "../../utils";
import AppConfig from "../../conf/AppConfig";
import UpLoadFileTypes from "../../const/UpLoadFileTypes";
import {ReadStream, WriteStream} from "node:fs";
import {UpLoadFilesCategoryModel, UpLoadFilesModel} from "../dataBase";
import {Op} from "sequelize";
import Cli from "../../lib/Cli";
import socketClient from "../Socket";
import createErrorMessage = Utils.createErrorMessage;
import createSuccessMessage = Utils.createSuccessMessage;

interface IQueryCriteria {
    [key: string]: any;
}

export default class File {
    public static upload(req: Request, res: Response): void {
        const file: Express.Multer.File | undefined = req.file;

        if (!file)
            return void res.json(createErrorMessage('ext001'));

        if (!UpLoadFileTypes.includes(file.mimetype))
            return void res.json(createErrorMessage('ext002'));

        const {
            name = file.filename,
            categoryId = null
        } = req.body ?? {};

        const fileExtension: string = path.extname(file.originalname);
        const fr: ReadStream = fs.createReadStream(file.path);
        const fileName: string = '/' + file.filename + `${fileExtension}`;
        const fileFolderPath: string = file.destination + fileName;
        const fw: WriteStream = fs.createWriteStream(file.destination + fileName);
        const filePath: string = `${AppConfig.__STATIC_PATH}/uploads` + fileName;
        const fileId: string = require('uuid').v4();
        const data = {
            id: fileId,
            name: name,
            path: filePath,
            cover: '',
            type: file.mimetype,
            createTime: new Date().getTime().toString(),
            categoryId: categoryId,
            hash: ''
        }

        fr.pipe(fw);
        fw.on('finish', (): void => {
            fs.unlink(file.path, (err: NodeJS.ErrnoException | null): void => {
                if (err)
                    return void res.json(createErrorMessage('ext00e'));
                else {
                    File.getFilesHash(fileFolderPath).then((hash: string): void => {
                        data.hash = hash;
                        UpLoadFilesModel.findOne({
                            where: {
                                hash: hash
                            }
                        }).then((f): void => {
                            if (f?.dataValues) {
                                fs.unlinkSync(fileFolderPath);
                                res.json(createSuccessMessage(f.dataValues ?? {}));
                            } else
                                UpLoadFilesModel.create(data).then((): void => {
                                    res.json(createSuccessMessage(data));
                                }).catch((): void => {
                                    res.json(createErrorMessage('ext00d'));
                                });
                        });

                        if (file.mimetype.includes('audio')) {
                            const audioCoverName: string = fileId + '-v.t.png';
                            const audioCoverStaticPath: string = `${AppConfig.__STATIC_PATH}/uploads/` + audioCoverName;
                            const audioCoverPath: string = path.resolve(__dirname, '../../_data/static/public/uploads/' + audioCoverName);

                            try {
                                socketClient.sendMessage({
                                    type: 'GENERATING-AUDIO-VISUALIZATIONS',
                                    data: JSON.stringify({
                                        audioPath: path.resolve(file.destination + fileName),
                                        optPath: audioCoverPath
                                    })
                                });

                                data.cover = audioCoverStaticPath;
                            } catch (e) {
                                Cli.debug(e);
                            }
                        }
                    });
                }
            });
        });
    }

    public static getFilesHash(filePath: string): Promise<string> {
        return new Promise((resolve): void => {
            const hash: crypto.Hash = crypto.createHash('md5');
            const input: fs.ReadStream = fs.createReadStream(filePath);

            input.on('readable', (): void => {
                const data = input.read();

                if (data)
                    hash.update(data);
                else
                    resolve(hash.digest('hex').toUpperCase());
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
        const {id} = req.params;
        const {
            name = '',
            categoryId = null
        } = req.body;

        if (id === '')
            return void res.json(createErrorMessage('ext003'));

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
            categoryId = '',
            type = ''
        } = req.query ?? {};
        const where: IQueryCriteria = {
            name: {[Op.like]: `%${name}%`},
            type: {[Op.like]: `%${type}%`}
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
        } = req.params;

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
