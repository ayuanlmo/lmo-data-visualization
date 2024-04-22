import {Request, Response} from "express";
import {ColorModel} from "../dataBase";
import Utils from "../../utils";
import {Op} from "sequelize";
import createSuccessMessage = Utils.createSuccessMessage;
import MemoryCache from "../../lib/MemoryCache";

export type TColorType = 'theme' | 'background';

export default class Color {
    public static getColors(req: Request, res: Response): void {
        const {
            type = 'theme' as TColorType
        } = req.query ?? {};
        const query: string = type === 'theme' ? '__theme_color' : '__background_color';
        const data = MemoryCache.get(query);

        if (data)
            return void res.json(createSuccessMessage(data));

        ColorModel.findAndCountAll({
            where: {
                type: {[Op.like]: `%${type}%`}
            }
        }).then(({rows, count}): void => {
            MemoryCache.set(query, {rows, total: count});
            res.json(createSuccessMessage({
                rows,
                total: count
            }));
        });
    }
}
