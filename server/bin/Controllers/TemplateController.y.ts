/**
 * TemplateController.t.ts
 * @description 模板相关控制器
 * @author ayuanlmp
 * **/

import {Request, Response} from "express";
import {DeleteTemplate, EditTempInfo, GetTemplateList} from "../BasicsFuncs.y";

class TemplateControllerY {
    // 获取模板
    static GetTemplate = async (req: Request, res: Response): Promise<any> => {
        await GetTemplateList(req, res);
        return req;
    }
    static DeleteTemplate = async (req: Request, res: Response): Promise<void> => {
        await DeleteTemplate(req, res);
    }
    static EditTemplateInfo = async (req: Request, res: Response): Promise<void> => {
        await EditTempInfo(req, res);
    }
}

export default TemplateControllerY;