import type {FastifyReply, FastifyRequest} from "fastify";
import {ColorModel} from "./../dataBase/index.js";
import Utils from "./../../utils/index.js";
import {Op} from "sequelize";
import MemoryCache from "./../../lib/MemoryCache.js";
import createSuccessMessage = Utils.createSuccessMessage;

export type TColorType = 'theme' | 'background';

export default class Color {
    public static getColors(request: FastifyRequest, reply: FastifyReply): void {
        const q = (request.query ?? {}) as Record<string, any>;
        const type: string = (q.type as TColorType) ?? 'theme';
        const query: string = type === 'theme' ? '__theme_color' : '__background_color';
        const data = MemoryCache.get(query);

        if (data)
            return void reply.send(createSuccessMessage(data));

        ColorModel.findAndCountAll({
            where: {
                type: {[Op.like]: `%${Utils.escapeLike(type)}%`}
            }
        }).then(({rows, count}): void => {
            MemoryCache.set(query, {rows, total: count});
            reply.send(createSuccessMessage({
                rows,
                total: count
            }));
        });
    }
}
