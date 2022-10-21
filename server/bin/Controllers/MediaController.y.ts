/**
 * MediaController.y.ts
 * @description 媒体文件相关控制器
 * @author ayuanlmo
 * **/

import {Request, Response} from "express";

class MediaController {
    // 上传媒体文件
    static UpLoadMediaFile(req: Request, res: Response) {
        console.log(req);
        console.log(res);
        res.send('UpLoadMediaFile');
    }

    // 获取合成媒体文件
    static GetMedia(req: Request, res: Response) {
        console.log(req);
        console.log(res);
        res.send('GetMedia');
    }

    // 删除合成媒体文件
    static DeleteMedia(req: Request, res: Response) {
        console.log(req);
        console.log(res);
        res.send('DeleteMedia');
    }
}

export default MediaController;
