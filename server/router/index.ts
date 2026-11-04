import type {FastifyBaseLogger, FastifyInstance} from "fastify";
import type {ZodTypeProvider} from "fastify-type-provider-zod";
import TemplateController from "./../bin/controllers/Template.js";
import File from "./../bin/controllers/File.js";
import Color from "./../bin/controllers/Color.js";
import Catch from "./../bin/controllers/Catch.js";
import Player from "./../bin/Player.js";
import Task from "./../bin/controllers/Task.js";
import Resources from "./../bin/controllers/Resources.js";
import ServerBase from "./../bin/controllers/ServerBase.js";
import {
    colorQuery,
    createTaskBody,
    fileCategoryBody,
    fileEditBody,
    idOnlyBody,
    idParam,
    templateCopyBody,
    templateEditBody,
    templateListQuery,
    uploadFileListQuery,
} from "./schemas.js";

// /api 路由表：URL/方法/响应契约保持稳定，入参叠加 Zod 校验。
export type ZodApp = FastifyInstance<any, any, any, FastifyBaseLogger, ZodTypeProvider>;

export function registerApiRoutes(app: ZodApp): void {
    app
        .get('/template', {schema: {querystring: templateListQuery}}, (req, reply) => TemplateController.getTemplates(req, reply))
        .get('/template/:id', {schema: {params: idParam}}, (req, reply) => TemplateController.getTemplate(req, reply))
        .put('/template', {schema: {body: templateEditBody}}, (req, reply) => TemplateController.editTemplate(req, reply))
        .delete('/template/:id', {schema: {params: idParam}}, (req, reply) => TemplateController.deleteTemplate(req, reply))
        .post('/template/copy', {schema: {body: templateCopyBody}}, (req, reply) => TemplateController.copyTemplate(req, reply))
        .post('/template/refresh', (req, reply) => TemplateController.refreshTemplate(req, reply))
        .post('/createCustomTemplate', {schema: {body: createTaskBody}}, (req, reply) => Task.createTask(req, reply))
        .post('/uploadFile', (req, reply) => File.upload(req, reply))
        .put('/editFileInfo/:id', {
            schema: {
                params: idParam,
                body: fileEditBody
            }
        }, (req, reply) => File.edit(req, reply))
        .delete('/deleteFile', {schema: {body: idOnlyBody}}, (req, reply) => File.delete(req, reply))
        .get('/uploadFile', {schema: {querystring: uploadFileListQuery}}, (req, reply) => File.getFiles(req, reply))
        .get('/uploadFileCategory', (req, reply) => File.getFileCategory(req, reply))
        .post('/uploadFileCategory', {schema: {body: fileCategoryBody}}, (req, reply) => File.addFileCategory(req, reply))
        .delete('/uploadFileCategory/:id', {schema: {params: idParam}}, (req, reply) => File.deleteFileCategory(req, reply))
        .get('/color', {schema: {querystring: colorQuery}}, (req, reply) => Color.getColors(req, reply))
        .post('/clearCatch', (req, reply) => Catch.clearCatch(req, reply))
        .get('/player/:id', {schema: {params: idParam}}, (req, reply) => Player.stream(req, reply))
        .post('/createTask', {schema: {body: createTaskBody}}, (req, reply) => Task.createTask(req, reply))
        .get('/resources', {schema: {querystring: templateListQuery}}, (req, reply) => Resources.getResources(req, reply))
        .delete('/resources/:id', {schema: {params: idParam}}, (req, reply) => Resources.deleteResources(req, reply))
        .get('/serverInfo', (req, reply) => ServerBase.GetServerBaseInfo(req, reply))
        .post('/uploadTemplate', (req, reply) => TemplateController.uploadTemplate(req, reply));
}

export default registerApiRoutes;
