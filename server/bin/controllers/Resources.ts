import type {FastifyReply, FastifyRequest} from "fastify";
import {IResourcesModel, ResourcesModel} from "./../dataBase/index.js";
import {Op} from "sequelize";
import Utils from "./../../utils/index.js";
import path from "path";
import fs from "node:fs";
import Logger from "./../../lib/Log.js";
import {AppError, ErrorCode, rethrowAppError} from "./../../lib/AppError.js";
import {staticPublicRoot} from "./../../lib/dataDir.js";

import createSuccessMessage = Utils.createSuccessMessage;
import calculatePagination = Utils.calculatePagination;

export default class Resources {
    public static async getResources(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const q = (request.query ?? {}) as Record<string, any>;
        const name: string = q.name ?? '';
        const pageIndex = q.pageIndex ?? 1;
        const pageSize = q.pageSize ?? 10;
        const [offset, limit] = calculatePagination(Number(pageIndex), Number(pageSize));

        try {
            const {rows, count} = await ResourcesModel.findAndCountAll({
                where: {
                    name: {[Op.like]: `%${Utils.escapeLike(name)}%`},
                },
                attributes: {
                    exclude: ['templatePath', 'url', 'template', 'taskConfig']
                },
                offset,
                limit,
                order: [['createTime', 'DESC']]
            });

            reply.send(createSuccessMessage({
                rows,
                total: count
            }));
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static async deleteResources(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const {id = ''} = request.params as { id?: string };

        if (id === '')
            throw new AppError(ErrorCode.INVALID_ID);

        try {
            const resources: IResourcesModel | null = await ResourcesModel.findByPk(id);

            if (!resources)
                throw new AppError(ErrorCode.INVALID_ID);

            const {dataValues} = resources;
            if (dataValues.filePath !== null && dataValues.gifPath !== null && dataValues.videoCover !== null) {
                const videoPath: string = path.join(staticPublicRoot, dataValues.filePath.replace('/static', ''));
                const gifPath: string = path.join(staticPublicRoot, dataValues.gifPath.replace('/static', ''));
                const videoCover: string = path.join(staticPublicRoot, dataValues.videoCover.replace('/static', ''));

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

            return void reply.code(204).send();
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }
}
