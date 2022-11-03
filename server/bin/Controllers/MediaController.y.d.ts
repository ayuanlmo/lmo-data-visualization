import {Request, Response} from "express";

declare class MediaController {
    static UpLoadMediaFile: (req: Request, res: Response) => Promise<void>;
    static GetMedia: (req: Request, res: Response) => Promise<void>;
    static DeleteMedia: (req: Request, res: Response) => Promise<void>;
    static GetUploadMediaFile: (req: Request, res: Response) => Promise<any>;
}

export default MediaController;