import {Request, Response} from "express";
import {ColorModel} from "../dataBase";
import Utils from "../../utils";
import {Op} from "sequelize";
import createSuccessMessage = Utils.createSuccessMessage;

export type TColorType = 'theme' | 'background';

export default class Color {
    public static getColors(req: Request, res: Response): void {
        const {
            type = 'theme'
        } = req.query ?? {};
        ColorModel.findAndCountAll({
            where: {
                type: {[Op.like]: `%${type}%`}
            }
        }).then(({rows, count}): void => {
            res.json(createSuccessMessage({
                rows,
                total: count
            }));
        });
    }
}