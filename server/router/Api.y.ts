import TemplateController from '../bin/Controllers/TemplateController.y'
import MediaController from "../bin/Controllers/MediaController.y";
import {Router} from "express";

const _Router = Router();

// 获取模板
_Router
    .route('/GetTemplate')
    .post(TemplateController.GetTemplate);

// 删除模板
_Router
    .route('/DeleteTemplate')
    .post(TemplateController.DeleteTemplate);

// 编辑模板信息
_Router
    .route('/EditTemplateInfo')
    .post(TemplateController.EditTemplateInfo);

// 上传媒体文件
_Router
    .route('/UpLoadMediaFile')
    .post(MediaController.UpLoadMediaFile);

// 获取合成媒体文件
_Router
    .route('/GetMedia')
    .post(MediaController.GetMedia);

// 删除合成媒体文件
_Router
    .route('/DeleteMedia')
    .post(MediaController.DeleteMedia);

// 获取上传媒体文件
_Router
    .route('/GetUploadMediaFile')
    .post(MediaController.GetUploadMediaFile);

export default _Router;