import {Request, Response, Router} from "express";
import TemplateController from "../bin/controllers/Template";
import File from "../bin/controllers/File";
import Multer = require("multer");

export const multer: Multer.Multer = Multer({
    dest: require('path').resolve('./_data/static/public/uploads'),
});
const _Router: Router = Router();

_Router.get('/template', (req: Request, res: Response): void => {
    TemplateController.getTemplates(req, res);
});
_Router.get('/template/:id', (req: Request, res: Response): void => {
    TemplateController.getTemplate(req, res);
});
_Router.put('/template', (req: Request, res: Response): void => {
    TemplateController.editTemplate(req, res);
});
_Router.delete('/template', (req: Request, res: Response): void => {
    TemplateController.deleteTemplate(req, res);
});
_Router.post('/template/copy', (req: Request, res: Response): void => {
    TemplateController.copyTemplate(req, res);
});
_Router.post('/uploadFile', multer.single('media'), (req: Request, res: Response): void => {
    File.upload(req, res);
});

export default _Router;
