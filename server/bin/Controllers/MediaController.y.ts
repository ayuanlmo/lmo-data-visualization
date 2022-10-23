/**
 * MediaController.y.ts
 * @description 媒体文件相关控制器
 * @author ayuanlmo
 * **/

import {Request, Response} from "express";
import {DeleteMedia, GetMedia, GetUploadMediaFile, UpLoadMediaFile} from "../BasicsFuncs.y";

class MediaController {
    // 上传媒体文件
    static UpLoadMediaFile = async (req: Request, res: Response): Promise<void> => {
        await UpLoadMediaFile(req, res);
    }

    // 获取合成媒体文件
    static GetMedia = async (req: Request, res: Response) => {
        await GetMedia(req, res);
    }

    // 删除合成媒体文件
    static DeleteMedia = async (req: Request, res: Response): Promise<void> => {
        await DeleteMedia(req, res);
    }

    static GetUploadMediaFile = async (req: Request, res: Response): Promise<any> => {
        await GetUploadMediaFile(res);
        return req;
    }
}

export default MediaController;
