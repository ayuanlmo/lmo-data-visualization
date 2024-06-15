import {Request, Response} from "express";
import {ResourcesModel} from "../dataBase";
import {Op} from "sequelize";
import Utils from "../../utils";
import path from "path";
import fs from "node:fs";
import createSuccessMessage = Utils.createSuccessMessage;
import createErrorMessage = Utils.createErrorMessage;

export default class Resources {
    public static getResources(req: Request, res: Response): void {
        const {
            name = '',
            pageIndex = 0,
            pageSize = 10,
        } = req.query;

        ResourcesModel.findAndCountAll({
            where: {
                name: {[Op.like]: `%${name}%`},
            },
            attributes: {
                exclude: ['templatePath', 'url', 'template']
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

    public static deleteResources(req: Request, res: Response): void {
        const {id = ''} = req.params;

        if (id === '')
            res.json(createErrorMessage('ext003'));

        ResourcesModel.findOne({
            where: {
                id
            }
        }).then((resource): void => {
            if (!resource)
                return void res.json(createErrorMessage('ext005'));

            const videoPath: string = path.resolve(__dirname, `../../_data/static/public/${resource?.dataValues.filePath.replace('/static', '')}`);
            const gifPath: string = path.resolve(__dirname, `../../_data/static/public/${resource?.dataValues.gifPath.replace('/static', '')}`);
            const videoCover: string = path.resolve(__dirname, `../../_data/static/public/${resource?.dataValues.videoCover.replace('/static', '')}`);
            const templatePath: string = resource?.dataValues.templatePath;

            if (fs.existsSync(videoPath))
                fs.unlinkSync(videoPath);
            if (fs.existsSync(gifPath))
                fs.unlinkSync(gifPath);
            if (fs.existsSync(videoCover))
                fs.unlinkSync(videoCover);
            if (fs.existsSync(templatePath)) {
                fs.readdirSync(templatePath).forEach((file: string): void => {
                    fs.unlinkSync(path.resolve(templatePath, file));
                });
                fs.rmdirSync(templatePath);
            }

            ResourcesModel.destroy({
                where: {
                    id
                }
            }).then((): void => {
                res.status(204).send();
            });
        });
    }
}