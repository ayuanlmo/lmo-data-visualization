import {Request, Response} from "express";
import {IResourcesModel, ResourcesModel} from "../dataBase";
import {Op} from "sequelize";
import Utils from "../../utils";
import path from "path";
import fs from "node:fs";
import Logger from "../../lib/Log";
import createSuccessMessage = Utils.createSuccessMessage;
import createErrorMessage = Utils.createErrorMessage;
import calculatePagination = Utils.calculatePagination;

export default class Resources {
    public static async getResources(req: Request, res: Response): Promise<void> {
        const {
            name = '',
            pageIndex = 1,
            pageSize = 10,
        } = req.query;
        const [offset, limit] = calculatePagination(Number(pageIndex), Number(pageSize));

        try {
            const {rows, count} = await ResourcesModel.findAndCountAll({
                where: {
                    name: {[Op.like]: `%${name}%`},
                },
                attributes: {
                    exclude: ['templatePath', 'url', 'template', 'taskConfig']
                },
                offset,
                limit,
                order: [['createTime', 'DESC']]
            });

            res.json(createSuccessMessage({
                rows,
                total: count
            }));
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage('ext00d'));
        }
    }

    public static async deleteResources(req: Request, res: Response): Promise<void> {
        const {id = ''} = req.params;

        if (id === '')
            res.json(createErrorMessage('ext003'));

        try {
            const resources: IResourcesModel | null = await ResourcesModel.findByPk(id);

            if (!resources)
                return void res.json(createErrorMessage('ext005'));

            const {dataValues} = resources;
            if (dataValues.filePath !== null && dataValues.gifPath !== null && dataValues.videoCover !== null) {
                const videoPath: string = path.resolve(__dirname, `../../_data/static/public/${dataValues.filePath.replace('/static', '')}`);
                const gifPath: string = path.resolve(__dirname, `../../_data/static/public/${dataValues.gifPath.replace('/static', '')}`);
                const videoCover: string = path.resolve(__dirname, `../../_data/static/public/${dataValues.videoCover.replace('/static', '')}`);

                if (fs.existsSync(videoPath))
                    fs.unlinkSync(videoPath);
                if (fs.existsSync(gifPath))
                    fs.unlinkSync(gifPath);
                if (fs.existsSync(videoCover))
                    fs.unlinkSync(videoCover);

                const templatePath: string = dataValues.templatePath;

                if (fs.existsSync(templatePath)) {
                    fs.readdirSync(templatePath).forEach((file: string): void => {
                        fs.unlinkSync(path.resolve(templatePath, file));
                    });
                    fs.rmdirSync(templatePath);
                }
            }
            await ResourcesModel.destroy({where: {id}});

            res.status(204).send();
        } catch (e) {
            Logger.error(e);
            res.json(createErrorMessage('ext00d'));
        }
    }
}
