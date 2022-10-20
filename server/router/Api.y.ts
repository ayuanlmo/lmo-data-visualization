import {Router} from "express";
import TemplateController from '../bin/Controllers/TemplateController.y'

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
    .route('EditTemplateInfo')
    .post(TemplateController.EditTemplateInfo)

export default _Router;