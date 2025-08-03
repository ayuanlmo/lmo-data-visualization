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
import createErrorMessage = Utils.createErrorMessage;
import createSuccessMessage = Utils.createSuccessMessage;
import calculatePagination = Utils.calculatePagination;

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
                    File.getFilesHash(fileFolderPath).then(async (hash: string): Promise<void> => {
                        data.hash = hash;

                        const existing: IUpLoadFilesModel | null = await UpLoadFilesModel.findOne({where: {hash}});

                        if (existing) {
                            fs.unlinkSync(fileFolderPath);
                            return void res.json(createSuccessMessage(existing.dataValues));
                        }

                        try {
                            const dbRecord: IUpLoadFilesModel = await UpLoadFilesModel.create(data);

                            if (file.mimetype.includes('audio')) {
                                const audioCoverName: string = fileId + '-v.t.png';
                                const audioCoverPath: string = path.resolve(__dirname, '../../_data/static/public/uploads/', audioCoverName);

                                socketClient.sendMessage({
                                    type: 'GENERATING-AUDIO-VISUALIZATIONS',
                                    data: JSON.stringify({
                                        audioPath: path.resolve(file.destination, fileName),
                                        optPath: audioCoverPath
                                    })
                                });
                            }

                            res.json(createSuccessMessage(dbRecord.toJSON()));
                        } catch (err) {
                            try {
                                fs.unlinkSync(fileFolderPath);
                            } catch (cleanupErr) {
                                Cli.debug(cleanupErr);
                            }
                            res.json(createErrorMessage('ext00d'));
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
        }).then(async (data): Promise<void> => {
            if (!data)
                return void res.json(createErrorMessage('ext004'));
            if (Object.keys(data ?? {}).length === 0)
                return void res.json(createErrorMessage('ext004'));

            const filePath: string = path.resolve(
                __dirname,
                `../../_data/static/public/${data.dataValues.path.replace('/static', '')}`
            );
            const deletedRows: number = await UpLoadFilesModel.destroy({where: {id}});

            if (deletedRows > 0) {
                try {
                    if (fs.existsSync(filePath))
                        fs.unlinkSync(filePath);
                } catch (err) {
                    Cli.debug(err);
                }
                res.status(204).send();
            } else
                res.json(createErrorMessage('ext00d'));
        }).catch(() => {
            return void res.json(createErrorMessage('ext004'));
        });
    }

    public static async edit(req: Request, res: Response): Promise<void> {
        try {
            const {id} = req.params;
            const {name = '', categoryId = null} = req.body;

            if (!id)
                res.json(createErrorMessage('ext003'));


            const file = await UpLoadFilesModel.findOne({where: {id}});

            if (!file)
                res.json(createErrorMessage('ext00e'));

            const updateResult: [affectedCount: number] = await UpLoadFilesModel.update(
                {name, categoryId},
                {where: {id}}
            );

            if (updateResult[0]) res.status(204).send();
            else
                res.json(createErrorMessage('ext00d'));

        } catch (error) {
            res.json(createErrorMessage('ext00e'));
        }
    }

    public static async getFiles(req: Request, res: Response): Promise<void> {
        try {
            const {name = '', pageIndex = 0, pageSize = 10, categoryId = '', type = ''} = req.query ?? {};
            const where: IQueryCriteria = {
                name: {[Op.like]: `%${name}%`},
                type: {[Op.like]: `%${type}%`}
            };

            if (categoryId) where.categoryId = categoryId;

            const [offset, limit] = calculatePagination(Number(pageIndex), Number(pageSize));

            const {rows, count} = await UpLoadFilesModel.findAndCountAll({
                where,
                offset,
                limit
            });

            res.json(createSuccessMessage({rows, total: count}));
        } catch (error) {
            res.json(createErrorMessage('ext00e'));
        }
    }

    public static async getFileCategory(_req: Request, res: Response): Promise<void> {
        try {
            const categories: IUpLoadFilesCategoryModel[] = await UpLoadFilesCategoryModel.findAll();
            const map: any = {};
            const tree: any[] = [];
            const ids: Array<string> = [];

            categories.forEach(item => {
                map[item.dataValues.id] = {...item.dataValues, children: []};
                ids.push(item.dataValues.id);
            });

            categories.forEach(item => {
                if (item.dataValues.parentId !== null)
                    map[item.dataValues.parentId].children.push(map[item.dataValues.id]);
                else
                    tree.push(map[item.dataValues.id]);
            });

            res.json(createSuccessMessage({tree, ids}));
        } catch (error) {
            res.json(createErrorMessage('ext00e'));
        }
    }

    public static async addFileCategory(req: Request, res: Response): Promise<void> {
        try {
            const {name = '', parentId = null, id = ''} = req.body ?? {};

            if (!name || name.length > 16)
                return void res.json(createErrorMessage('ext00e'));

            if (id) {
                const category: IUpLoadFilesCategoryModel | null = await UpLoadFilesCategoryModel.findOne({where: {id}});

                if (!category)
                    return void res.json(createErrorMessage('ext00e'));

                await UpLoadFilesCategoryModel.update({name}, {where: {id}});
                res.status(204).send();
            } else if (parentId) {
                await UpLoadFilesCategoryModel.create({
                    id: require('uuid').v4(),
                    name,
                    parentId
                });
                res.status(204).send();
            } else
                res.json(createErrorMessage('ext00e'));
        } catch (error) {
            res.json(createErrorMessage('ext00e'));
        }
    }

    public static async deleteFileCategory(req: Request, res: Response): Promise<void> {
        try {
            const {id = ""} = req.params;

            if (!id)
                return void res.json(createErrorMessage('ext003'));

            const item: IUpLoadFilesCategoryModel | null = await UpLoadFilesCategoryModel.findOne({where: {id}});

            if (!item)
                return void res.json(createErrorMessage('ext00e'));

            const subCategories = await UpLoadFilesCategoryModel.findAll({where: {parentId: id}});

            if (subCategories.length > 0)
                return void res.json(createErrorMessage('ext00e'));

            await UpLoadFilesCategoryModel.destroy({where: {id}});
            res.status(204).send();
        } catch (error) {
            res.json(createErrorMessage('ext00e'));
        }
    }
}
