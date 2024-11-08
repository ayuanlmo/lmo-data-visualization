import {Request, Response, Router} from "express";
import TemplateController from "../bin/controllers/Template";
import File from "../bin/controllers/File";
import Color from "../bin/controllers/Color";
import Catch from "../bin/controllers/Catch";
import Player from "../bin/Player";
import Task from "../bin/controllers/Task";
import Resources from "../bin/controllers/Resources";
import Multer = require("multer");

export const multer: Multer.Multer = Multer({
    dest: require('path').resolve('./_data/static/public/uploads'),
});
const _Router: Router = Router();

_Router
    .get('/template', (req: Request, res: Response): void => TemplateController.getTemplates(req, res))
    .get('/template/:id', (req: Request, res: Response): void => TemplateController.getTemplate(req, res))
    .put('/template', (req: Request, res: Response): void => TemplateController.editTemplate(req, res))
    .delete('/template', (req: Request, res: Response): void => TemplateController.deleteTemplate(req, res))
    .post('/template/copy', (req: Request, res: Response): void => TemplateController.copyTemplate(req, res))
    .post('/template/refresh', (req: Request, res: Response): void => TemplateController.refreshTemplate(req, res))
    .post('/createCustomTemplate', (req: Request, res: Response): void => Task.createTask(req, res))
    .post('/uploadFile', multer.single('media'), (req: Request, res: Response): void => File.upload(req, res))
    .put('/editFileInfo/:id', (req: Request, res: Response): void => File.edit(req, res))
    .delete('/deleteFile', (req: Request, res: Response): void => File.delete(req, res))
    .get('/uploadFile', (req: Request, res: Response): void => File.getFiles(req, res))
    .get('/uploadFileCategory', (req: Request, res: Response): void => File.getFileCategory(req, res))
    .post('/uploadFileCategory', (req: Request, res: Response): void => File.addFileCategory(req, res))
    .delete('/uploadFileCategory/:id', (req: Request, res: Response): void => File.deleteFileCategory(req, res))
    .get('/color', (req: Request, res: Response): void => Color.getColors(req, res))
    .post('/clearCatch', (req: Request, res: Response): void => Catch.clearCatch(req, res))
    .get('/player/:id', (req: Request, res: Response): void => void new Player(req, res))
    .post('/createTask', (req: Request, res: Response): void => Task.createTask(req, res))
    .get('/resources', (req: Request, res: Response): void => Resources.getResources(req, res))
    .delete('/resources/:id', (req: Request, res: Response): void => Resources.deleteResources(req, res))
;

export default _Router;
