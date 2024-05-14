import {Request, Response, Router} from "express";
import TemplateController from "../bin/controllers/Template";
import File from "../bin/controllers/File";
import Color from "../bin/controllers/Color";
import Catch from "../bin/controllers/Catch";
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
_Router.post('/template/refresh', (req: Request, res: Response): void => {
    TemplateController.refreshTemplate(req, res);
});
_Router.post('/uploadFile', multer.single('media'), (req: Request, res: Response): void => {
    File.upload(req, res);
});
_Router.get('/uploadFile', (req: Request, res: Response): void => {
    File.getFiles(req, res);
});
_Router.get('/uploadFileCategory', (req: Request, res: Response): void => {
    File.getFileCategory(req, res);
});
_Router.post('/uploadFileCategory', (req: Request, res: Response): void => {
    File.addFileCategory(req, res);
});
_Router.delete('/uploadFileCategory', (req: Request, res: Response): void => {
    File.deleteFileCategory(req, res);
});
_Router.get('/color', (req: Request, res: Response): void => {
    Color.getColors(req, res);
});
_Router.post('/clearCatch', (req: Request, res: Response): void => {
    Catch.clearCatch(req, res);
});

export default _Router;
