import {Op} from "sequelize";
import {Request, Response} from "express";
import {ITemplateModel, TemplateModel} from "../dataBase";
import Utils from "../../utils";
import initDefaultData, {checkArrayIncludes, templateLocalFiles} from "../dataBase/init";
import path from "path";
import {copyFileSync, existsSync, mkdirSync, readdirSync, ReadStream, WriteStream} from "node:fs";
import fs from "fs";
import AdmZip from "adm-zip";
import Logger from "../../lib/Log";
import createSuccessMessage = Utils.createSuccessMessage;
import createErrorMessage = Utils.createErrorMessage;
import deleteFolderRecursive = Utils.deleteFolderRecursive;
import isZipFile = Utils.isZipFile;
import calculatePagination = Utils.calculatePagination;
import getNowTimestamp = Utils.getNowTimestamp;

export default class TemplateController {
    public static async getTemplates(req: Request, res: Response): Promise<void> {
        const {
            name = '',
            pageIndex = 0,
            pageSize = 10,
            type = ''
        } = req.query ?? {};
        const whereCondition: any = {
            name: {[Op.like]: `%${name}%`}
        };
        const [offset, limit] = calculatePagination(Number(pageIndex), Number(pageSize));

        if (type !== "")
            whereCondition.type = type;

        try {
            const {rows, count} = await TemplateModel.findAndCountAll({
                where: whereCondition,
                offset,
                limit,
                order: ['createTime']
            });
            res.json(createSuccessMessage({
                rows,
                total: count
            }));
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.serverError')
            }));
        }
    }

    public static async getTemplate(req: Request, res: Response): Promise<void> {
        const {id = ''} = req.params;

        try {
            const template: ITemplateModel | null = await TemplateModel.findByPk(id);

            if (!template)
                return void res.json(createErrorMessage({
                    message: req.t('errors.templateNotFound')
                }));

            res.json(createSuccessMessage(template ?? {}));
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }

    public static async copyTemplate(req: Request, res: Response): Promise<void> {
        const {
            id = '',
            name = '',
            description = ''
        } = req.body;

        try {
            if (id === '')
                return void res.json(createErrorMessage({
                    message: req.t('errors.invalidId')
                }));

            const template: ITemplateModel | null = await TemplateModel.findByPk(id);

            if (!template)
                return void res.json(createErrorMessage({
                    message: req.t('errors.templateNotFound')
                }));

            const {dataValues}: any = template;
            const originalTemplate: string = path.resolve(`./_data/static/public/${template?.dataValues.path.replace('/static', '').replace('/index.html', '')}`);
            const templatePathName: string = require('uuid').v4();
            const dirPath: string = path.resolve(`./_data/static/public/templates/${templatePathName}`);
            const templateStaticPath: string = `/static/templates/${templatePathName}`;
            const htmlPath: string = path.resolve(dirPath, 'index.html');
            const htmPath: string = path.resolve(dirPath, 'index.htm');

            if (existsSync(originalTemplate)) {
                if (!existsSync(dirPath))
                    mkdirSync(dirPath);
                readdirSync(originalTemplate).forEach((file: string): void => {
                    const ignoreFiles: Array<string> = ['.initialized.t.bin', 'config.json'];

                    if (!ignoreFiles.includes(file))
                        copyFileSync(path.resolve(`${originalTemplate}/${file}`), path.resolve(`${dirPath}/${file}`));
                });
            }

            const data = {
                ...dataValues,
                name: name === '' ? dataValues.name : name,
                description: description === '' ? dataValues.description : description,
                path: `${templateStaticPath}/${existsSync(htmlPath) ? 'index.html' : existsSync(htmPath) ? 'index.htm' : '/'}`,
                cover: templateStaticPath + '/cover.png',
                gifCover: templateStaticPath + '/cover.gif',
                createTime: getNowTimestamp(),
                id: require('uuid').v4(),
                type: '0'
            };

            await TemplateModel.create(data);
            res.status(204).send();
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }

    public static async editTemplate(req: Request, res: Response): Promise<void> {
        const {id = '', name = '', description = ''} = req.body ?? {};

        if (id === '')
            return void res.json(createErrorMessage({
                message: req.t('errors.invalidId')
            }));

        try {
            const template: ITemplateModel | null = await TemplateModel.findByPk(id);

            if (!template)
                return void res.json(createErrorMessage({
                    message: req.t('errors.templateNotFound')
                }));
            if (template.type === 1)
                return void res.json(createErrorMessage({
                    message: req.t('errors.templateNotEditable')
                }));

            const updateData: Partial<typeof template> = {};

            if (name !== undefined && name !== '')
                updateData.name = name;
            if (description !== undefined && description !== '')
                updateData.description = description;

            const [affectedCount] = await TemplateModel.update(updateData, {
                where: {id}
            });

            if (affectedCount === 1)
                return void res.status(204).send();
            else
                return void res.json(createErrorMessage({
                    message: req.t('errors.updateFailed')
                }));
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }

    public static async deleteTemplate(req: Request, res: Response): Promise<void> {
        const {id = ''} = req.params ?? {};

        if (id === '')
            res.json(createErrorMessage({
                message: req.t('errors.invalidId')
            }));

        try {
            const template: ITemplateModel | null = await TemplateModel.findByPk(id);

            if (!template)
                return void res.json(createErrorMessage({
                    message: req.t('errors.templateNotFound')
                }));

            const {dataValues}: any = template;

            if (dataValues.type === 1)
                return void res.json(createErrorMessage({
                    message: req.t('errors.templateReadFailed')
                }));

            const originalTemplate: string = path.resolve(`./_data/static/public/${dataValues.path.replace('/static', '').replace('/index.html', '')}`);

            await TemplateModel.destroy({where: {id: id}});
            deleteFolderRecursive(originalTemplate);
            res.status(204).send();
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage({
                message: req.t('errors.databaseError')
            }));
        }
    }

    public static refreshTemplate(_req: Request, res: Response): void {
        initDefaultData().then((): void => {
            res.status(204).send();
        });
    }

    public static uploadTemplate(req: Request, res: Response): void {
        const file: Express.Multer.File | undefined = req.file;

        if (!file)
            return void res.json(createErrorMessage({
                message: req.t('errors.fileMissing')
            }));

        const fileExtension: string = path.extname(file.originalname);
        const fr: ReadStream = fs.createReadStream(file.path);
        const fileName: string = '/' + file.filename + `${fileExtension}`;
        const filePath: string = file.destination + fileName;
        const fw: WriteStream = fs.createWriteStream(filePath);

        fr.pipe(fw);
        fw.on('finish', (): void => {
            fs.unlink(file.path, (err: NodeJS.ErrnoException | null): void => {
                if (err)
                    return void res.json(createErrorMessage({
                        message: req.t('errors.serverError')
                    }));
                else {
                    try {
                        const originPath: string = path.join(__dirname, '../../_data/static/public/templates/');
                        const fileFolderName: string = require('uuid').v4();
                        const templatePathName: string = path.join(originPath, fileFolderName);

                        fs.mkdirSync(templatePathName);

                        if (fs.existsSync(filePath)) {
                            if (!isZipFile(filePath)) {
                                deleteFolderRecursive(templatePathName);
                                return void res.json(createErrorMessage({
                                    message: req.t('errors.templateNotZip')
                                }));
                            }
                            const zip: AdmZip = new AdmZip(filePath);
                            const zipEntries: string[] = [];

                            zip.getEntries().forEach((i: AdmZip.IZipEntry) => {
                                if (!i.isDirectory)
                                    zipEntries.push(i.entryName);
                            });
                            zip.extractAllToAsync(templatePathName, true, true, (error) => {
                                if (error)
                                    res.json(createErrorMessage({
                                        message: req.t('errors.serverError')
                                    }));
                                else {
                                    fs.unlinkSync(filePath);

                                    if (checkArrayIncludes(zipEntries, templateLocalFiles)) {
                                        const templateConfig = JSON.parse(fs.readFileSync(path.resolve(templatePathName + `/config.json`), 'utf-8'));
                                        const isHTMLTemplate: boolean = fs.existsSync(path.resolve(templatePathName, 'index.html'));
                                        const isHTTemplate: boolean = fs.existsSync(path.resolve(templatePathName, 'index.htm'));
                                        const templateData = {
                                            id: require('uuid').v4(),
                                            ...templateConfig,
                                            cover: `/static/${fileFolderName}/cover.png`,
                                            gifCover: `/static/${fileFolderName}/cover.gif`,
                                            path: `/static/${fileFolderName}${isHTMLTemplate ? '/index.html' : isHTTemplate ? '/index.htm' : '/'}`,
                                            createTime: getNowTimestamp(),
                                            index: 0,
                                            dsp: 1
                                        };

                                        TemplateModel.create(templateData).then((): void => {
                                            res.json(createSuccessMessage({
                                                ...templateData
                                            }));
                                        });
                                    } else {
                                        deleteFolderRecursive(templatePathName);
                                        res.json(createErrorMessage({
                                            message: req.t('errors.templateReadFailed')
                                        }));
                                    }
                                }
                            });
                        } else {
                            deleteFolderRecursive(templatePathName);
                            res.json(createErrorMessage({
                                message: req.t('errors.serverError')
                            }));
                        }
                    } catch (e) {
                        console.log(e);
                        res.json(createErrorMessage({
                            message: req.t('errors.serverError')
                        }));
                    }
                }
            });
        });
    }
}
