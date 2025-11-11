import * as fs from "fs";
import path from "path";
import crypto from "node:crypto";
import {Request, Response} from "express";
import Utils from "../../utils";
import AppConfig from "../../conf/AppConfig";
import UpLoadFileTypes from "../../const/UpLoadFileTypes";
import {ReadStream, WriteStream} from "node:fs";
import {IUpLoadFilesCategoryModel, IUpLoadFilesModel, UpLoadFilesCategoryModel, UpLoadFilesModel} from "../dataBase";
import {Op} from "sequelize";
import Cli from "../../lib/Cli";
import socketClient from "../Socket";
import Logger from "../../lib/Log";
import createErrorMessage = Utils.createErrorMessage;
import createSuccessMessage = Utils.createSuccessMessage;
import calculatePagination = Utils.calculatePagination;

interface IQueryCriteria {
    [key: string]: any;
}

export default class File {
    public static async upload(req: Request, res: Response): Promise<void> {
        const file: Express.Multer.File | undefined = req.file;

        if (!file)
            return void res.json(createErrorMessage({
                message: req.t('errors.fileMissing')
            }));

        if (!UpLoadFileTypes.includes(file.mimetype))
            return void res.json(createErrorMessage({
                message: req.t('errors.fileUnsupportedType')
            }));

        const {
            name = file.filename,
            categoryId = null
        } = req.body ?? {};

        try {
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
                fs.unlink(file.path, async (err: NodeJS.ErrnoException | null): Promise<void> => {
                    if (err) {
                        Logger.error(err.message);
                        return void res.json(createErrorMessage({
                            message: req.t('errors.serverError')
                        }));
                    } else {
                        try {
                            const filesHash: string = await File.getFileHash(fileFolderPath);

                            data.hash = filesHash;

                            const fileItem: IUpLoadFilesModel | null = await UpLoadFilesModel.findOne({
                                where: {
                                    hash: filesHash
                                }
                            });

                            if (fileItem) {
                                const {dataValues} = fileItem;

                                fs.unlinkSync(fileFolderPath);
                                res.json(createSuccessMessage(dataValues ?? {}));
                            } else {
                                await UpLoadFilesModel.create(data);

                                res.json(createSuccessMessage(data));

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
                            }
                        } catch (e) {
                            Logger.error(e);
                            res.json(createErrorMessage({
                                message: req.t('errors.databaseError')
                            }));
                        }
                    }
                });
            });
            fw.on('error', (e): void => {
                Logger.error(e.message);
            });
        } catch (e) {
            Logger.error(e);
            return void res.json(createErrorMessage({
                message: req.t('errors.serverError')
            }));
        }
    }

    public static getFileHash(filePath: string): Promise<string> {
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

    public static async delete(req: Request, res: Response): Promise<void> {
        const {
            id = ""
        } = req.body;

        if (id === '')
            return void res.json(createErrorMessage({
                message: req.t('errors.invalidId')
            }));

        try {
            const file = await UpLoadFilesModel.findByPk(id);

            if (!file)
                return void res.json(createErrorMessage({
                    message: req.t('errors.fileNotFoundById')
                }));

            const {dataValues} = file;
            const filePath: string = path.resolve(__dirname, `../../_data/static/public/${dataValues.path.replace('/static', '')}`);
            const deleteRows: number = await UpLoadFilesModel.destroy({
                where: {id: id}
            });

            if (deleteRows > 0) {
                if (fs.existsSync(filePath))
                    fs.unlinkSync(filePath);
                res.status(204).send();
            } else
                res.json(createErrorMessage({
                    message: req.t('errors.invalidId')
                }));
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }

    public static async edit(req: Request, res: Response): Promise<void> {
        const {id} = req.params;
        const {
            name = '',
            categoryId = null
        } = req.body;

        if (id === '')
            return void res.json(createErrorMessage({
                message: req.t('errors.invalidId')
            }));

        try {
            const file: IUpLoadFilesModel | null = await UpLoadFilesModel.findByPk(id);

            if (!file)
                return void res.json(createErrorMessage({
                    message: req.t('errors.serverError')
                }));

            const [affectedCount] = await UpLoadFilesModel.update({
                name,
                categoryId
            }, {
                where: {id: id}
            });

            if (affectedCount > 0)
                res.status(204).send();
            else
                res.json(createErrorMessage({
                    message: req.t('errors.databaseError')
                }));
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }

    public static async getFiles(req: Request, res: Response): Promise<void> {
        const {
            name = '',
            pageIndex = 0,
            pageSize = 10,
            categoryId = '',
            type = ''
        } = req.query ?? {};
        const whereCondition: IQueryCriteria = {
            name: {[Op.like]: `%${name}%`},
            type: {[Op.like]: `%${type}%`}
        };
        const [offset, limit] = calculatePagination(Number(pageIndex), Number(pageSize));

        if (categoryId !== '')
            whereCondition.categoryId = categoryId;

        try {
            const {rows, count} = await UpLoadFilesModel.findAndCountAll({
                where: whereCondition,
                offset,
                limit
            });

            res.json(createSuccessMessage({
                rows,
                total: count
            }));
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }

    public static async getFileCategory(req: Request, res: Response): Promise<void> {
        try {
            const category = await UpLoadFilesCategoryModel.findAll();
            const map: any = {};
            const tree: any[] = [];
            const ids: Array<string> = [];

            category.forEach((i: IUpLoadFilesCategoryModel): void => {
                map[i.dataValues.id] = {...i.dataValues, children: []};
                ids.push(i.dataValues.id);
            });

            category.forEach((i: IUpLoadFilesCategoryModel): void => {
                if (i.dataValues.parentId !== null)
                    map[i.dataValues.parentId].children.push(map[i.dataValues.id]);
                else
                    tree.push(map[i.dataValues.id]);
            });

            res.json(createSuccessMessage({
                tree,
                ids
            }));
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }

    public static async addFileCategory(req: Request, res: Response): Promise<void> {
        const {
            name = '',
            parentId = null,
            id = ''
        } = req.body ?? {};

        if (name === '' && name.length > 16)
            return void res.json(createErrorMessage({
                message: req.t('errors.serverError')
            }));

        try {
            if (name !== '' && id !== '') {
                const category: IUpLoadFilesCategoryModel | null = await UpLoadFilesCategoryModel.findByPk(id);

                if (category) {
                    await UpLoadFilesCategoryModel.update({name}, {where: {id}});

                    return void res.status(204).send();
                }
            }
            if (name !== '' && parentId !== '') {
                await UpLoadFilesCategoryModel.create({
                    id: require('uuid').v4(),
                    name,
                    parentId
                });
                return void res.status(204).send();
            } else
                return void res.json(createErrorMessage({
                    message: req.t('errors.serverError')
                }));
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }

    public static async deleteFileCategory(req: Request, res: Response): Promise<void> {
        const {
            id = ""
        } = req.params;

        if (id === "")
            return void res.json(createErrorMessage({
                message: req.t('errors.invalidId')
            }));

        try {
            const category: IUpLoadFilesCategoryModel | null = await UpLoadFilesCategoryModel.findByPk(id);

            if (!category)
                return void res.json(createErrorMessage({
                    message: req.t('errors.serverError')
                }));

            const rows: IUpLoadFilesCategoryModel[] = await UpLoadFilesCategoryModel.findAll({
                where: {parentId: id}
            });

            if (rows.length > 0)
                return void res.json(createErrorMessage({
                    message: req.t('errors.serverError')
                }));

            await UpLoadFilesCategoryModel.destroy({
                where: {id}
            });
            res.status(204).send();
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }
}
