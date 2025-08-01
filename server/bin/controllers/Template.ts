import {Op} from "sequelize";
import {Request, Response} from "express";
import {TemplateModel} from "../dataBase";
import Utils from "../../utils";
import initDefaultData, {checkArrayIncludes, templateLocalFiles} from "../dataBase/init";
import path from "path";
import {copyFileSync, existsSync, mkdirSync, readdirSync, ReadStream, WriteStream} from "node:fs";
import fs from "fs";
import AdmZip from "adm-zip";
import createSuccessMessage = Utils.createSuccessMessage;
import createErrorMessage = Utils.createErrorMessage;
import deleteFolderRecursive = Utils.deleteFolderRecursive;
import isZipFile = Utils.isZipFile;
import calculatePagination = Utils.calculatePagination;

export default class TemplateController {
    public static getTemplates(req: Request, res: Response): void {
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

        TemplateModel.findAndCountAll({
            where: {
                ...whereCondition
            },
            offset,
            limit
        }).then(({rows, count}): void => {
            res.json(createSuccessMessage({
                rows,
                total: count
            }));
        });
    }

    public static getTemplate(req: Request, res: Response): void {
        const {id = ''} = req.params;

        TemplateModel.findOne({
            where: {
                id: {[Op.like]: `${id}`}
            }
        }).then((template): void => {
            res.json(createSuccessMessage(template ?? {}));
        });
    }

    public static copyTemplate(req: Request, res: Response): void {
        const {
            id = '',
            name = '',
            description = ''
        } = req.body;

        TemplateModel.findOne({
            where: {
                id: {[Op.like]: `${id}`}
            }
        }).then((template): void => {
            if (!template)
                return void res.json(createErrorMessage('ext006'));
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
                createTime: new Date().getTime(),
                id: require('uuid').v4(),
                type: '0'
            };

            TemplateModel.create(data).then((): void => {
                res.status(204).send();
            }).catch((): void => {
                res.json(createErrorMessage('ext00d'));
            });
        });
    }

    public static editTemplate(req: Request, res: Response): void {

        const {id = '', name = '', description = ''} = req.body ?? {};

        if (id === '')
            return void res.json(createErrorMessage('ext005'));

        TemplateModel.findOne({
            where: {
                id: {[Op.like]: `${id}`}
            }
        }).then((template): void => {
            if (!template)
                return void res.json(createErrorMessage('ext006'));

            const dataValues = template.dataValues;

            if (dataValues.type === 1)
                return void res.json(createErrorMessage('ext007'));

            TemplateModel.update({
                name: name === '' ? dataValues.name : name,
                description: description === '' ? dataValues.description : description,
            }, {
                where: {
                    id: {[Op.like]: `${id}`}
                }
            }).then(([cont]): void => {
                if (cont === 1)
                    res.status(204).send();
                else
                    res.json(createErrorMessage('ext00d1'));
            }).catch((): void => {
                res.json(createErrorMessage('ext00d'));
            });
        });
    }

    public static deleteTemplate(req: Request, res: Response): void {
        const {id = ''} = req.params ?? {};

        if (id === '')
            return void res.json(createErrorMessage('ext005'));

        TemplateModel.findOne({
            where: {
                id: {[Op.like]: `${id}`}
            }
        }).then((template): void => {
            if (template === null)
                return void res.json(createErrorMessage('ext005'));

            const {dataValues}: any = template;

            if (dataValues.type === 1)
                return void res.json(createErrorMessage('ext008'));

            const originalTemplate: string = path.resolve(`./_data/static/public/${dataValues.path.replace('/static', '').replace('/index.html', '')}`);

            TemplateModel.destroy({
                where: {id: id}
            }).then((): void => {
                deleteFolderRecursive(originalTemplate);
                res.status(204).send();
            }).catch(() => {
                res.json(createErrorMessage('ext00d'));
            });
        });
    }

    public static refreshTemplate(_req: Request, res: Response): void {
        initDefaultData().then((): void => {
            res.status(204).send();
        });
    }

    public static uploadTemplate(req: Request, res: Response): void {
        const file: Express.Multer.File | undefined = req.file;

        if (!file)
            return void res.json(createErrorMessage('ext001'));

        const fileExtension: string = path.extname(file.originalname);
        const fr: ReadStream = fs.createReadStream(file.path);
        const fileName: string = '/' + file.filename + `${fileExtension}`;
        const filePath: string = file.destination + fileName;
        const fw: WriteStream = fs.createWriteStream(filePath);

        fr.pipe(fw);
        fw.on('finish', () => {
            fs.unlink(file.path, (err: NodeJS.ErrnoException | null): void => {
                console.log(file.destination + fileName);
                if (err)
                    return void res.json(createErrorMessage('ext00e'));
                else {
                    try {
                        const originPath: string = path.join(__dirname, '../../_data/static/public/templates/');
                        const fileFolderName: string = require('uuid').v4();
                        const templatePathName: string = path.join(originPath, fileFolderName);

                        fs.mkdirSync(templatePathName);

                        if (fs.existsSync(filePath)) {
                            if (!isZipFile(filePath)) {
                                deleteFolderRecursive(templatePathName);
                                return void res.json(createErrorMessage('ext0012'));
                            }
                            const zip: AdmZip = new AdmZip(filePath);
                            const zipEntries: string[] = [];

                            zip.getEntries().forEach((i: AdmZip.IZipEntry) => {
                                if (!i.isDirectory)
                                    zipEntries.push(i.entryName);
                            });
                            zip.extractAllToAsync(templatePathName, true, true, (error) => {
                                if (error)
                                    res.json(createErrorMessage('ext00e'));
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
                                            createTime: new Date().getTime(),
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
                                        res.json(createErrorMessage('ext0011'));
                                    }
                                }
                            });
                        } else {
                            deleteFolderRecursive(templatePathName);
                            res.json(createErrorMessage('ext00e'));
                        }
                    } catch (e) {
                        console.log(e);
                        res.json(createErrorMessage('ext00e'));
                    }
                }
            });
        });
    }
}
