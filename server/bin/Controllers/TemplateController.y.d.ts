import {Request, Response} from "express";

declare class TemplateControllerY {
    static GetTemplate: (req: Request, res: Response) => Promise<any>;
    static DeleteTemplate: (req: Request, res: Response) => Promise<void>;
    static EditTemplateInfo: (req: Request, res: Response) => Promise<void>;
}

export default TemplateControllerY;