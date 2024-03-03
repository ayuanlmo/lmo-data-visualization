import {Op} from "sequelize";
import {Request, Response} from "express";
import {TemplateModel} from "../dataBase";
import Utils from "../../utils";
import AppConfig from "../../conf/AppConfig";
import createSuccessMessage = Utils.createSuccessMessage;
import createErrorMessage = Utils.createErrorMessage;

export default class TemplateController {
    public static getTemplates(req: Request, res: Response): void {
        const {
            name = '',
            pageIndex = 0,
            pageSize = 10
        } = req.body ?? {};

        TemplateModel.findAndCountAll({
            where: {
                name: {[Op.like]: `%${name}%`}
            },
            offset: (pageIndex - 1) * pageIndex,
            limit: pageSize
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

    public static editTemplate(req: Request, res: Response): void {
        if (AppConfig.__LIVE_SERVER)
            return void res.json(createErrorMessage('ext00el'));

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
}
