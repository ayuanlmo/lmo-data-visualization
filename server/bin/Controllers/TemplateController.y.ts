/**
 * TemplateController.t.ts
 * @description 模板相关控制器
 * @author ayuanlmp
 * **/

import {Request, Response} from "express";

class TemplateControllerY {
    // 获取模板
    static GetTemplate = async (req: Request, res: Response): Promise<void> => {
        console.log(req);
        console.log(res);
        res.send('GetTemplate');
        console.log('GetTemplate');
    }
    static DeleteTemplate = async (req: Request, res: Response): Promise<void> => {
        console.log(req);
        console.log(res);
        res.send('DeleteTemplate');
        console.log('DeleteTemplate');
    }
    static EditTemplateInfo = async (req: Request, res: Response): Promise<void> => {
        console.log(req);
        console.log(res);
        res.send('EditTemplateInfo');
        console.log('EditTemplateInfo');
    }
}

export default TemplateControllerY;