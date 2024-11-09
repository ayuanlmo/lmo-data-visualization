import {Op} from "sequelize";
import {Request, Response} from "express";
import {TemplateModel} from "../dataBase";
import Utils from "../../utils";
import initDefaultData from "../dataBase/init";
import path from "path";
import {copyFileSync, existsSync, mkdirSync, readdirSync} from "node:fs";
import createSuccessMessage = Utils.createSuccessMessage;
import createErrorMessage = Utils.createErrorMessage;
import deleteFolderRecursive = Utils.deleteFolderRecursive;

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

        if (type !== "")
            whereCondition.type = type;

        TemplateModel.findAndCountAll({
            where: {
                ...whereCondition
            },
            offset: (Number(pageIndex) - 1) * Number(pageIndex),
            limit: Number(pageSize)
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
}
