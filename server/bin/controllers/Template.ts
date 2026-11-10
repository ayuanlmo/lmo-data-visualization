import {v4 as uuidv4} from "uuid";
import {Op} from "sequelize";
import type {FastifyReply, FastifyRequest} from "fastify";
import type {MultipartFile} from "@fastify/multipart";
import {pipeline} from "node:stream/promises";
import {ITemplateModel, TemplateModel} from "./../dataBase/index.js";
import Utils from "./../../utils/index.js";
import initDefaultData, {checkArrayIncludes, templateLocalFiles} from "./../dataBase/init.js";
import path from "path";
import {cpSync, existsSync, mkdirSync} from "node:fs";
import fs from "fs";
import AdmZip from "adm-zip";
import Logger from "./../../lib/Log.js";
import {AppError, ErrorCode, rethrowAppError} from "./../../lib/AppError.js";
import {staticPublicRoot} from "./../../lib/dataDir.js";
import createSuccessMessage = Utils.createSuccessMessage;
import deleteFolderRecursive = Utils.deleteFolderRecursive;
import isZipFile = Utils.isZipFile;
import calculatePagination = Utils.calculatePagination;
import getNowTimestamp = Utils.getNowTimestamp;

const UPLOADS_DIR: string = path.join(staticPublicRoot, 'uploads');

/**
 * 把「单根目录」的解压结果拍平到 root：用户在文件管理器里右键模板文件夹压缩时，
 * zip 内所有条目都带一层 `folder/` 前缀，直接解压会得到 root/folder/conf.js 而不是 root/conf.js，
 * 导致后续必备文件校验和 config.json 读取全部落空。仅当 root 下恰好只有一个子目录时才拍平，
 * 避免误伤本身就包含多目录结构的合法模板。
 */
const flattenSingleRootFolder = (root: string): void => {
    const entries = fs.readdirSync(root, {withFileTypes: true});

    if (entries.length !== 1 || !entries[0].isDirectory()) return;

    const innerPath: string = path.join(root, entries[0].name);

    for (const child of fs.readdirSync(innerPath))
        fs.renameSync(path.join(innerPath, child), path.join(root, child));

    fs.rmdirSync(innerPath);
};

export default class TemplateController {
    public static async getTemplates(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const q = (request.query ?? {}) as Record<string, any>;
        const name: string = q.name ?? '';
        const pageIndex = q.pageIndex ?? 0;
        const pageSize = q.pageSize ?? 10;
        const type: string = q.type ?? '';
        const whereCondition: any = {
            name: {[Op.like]: `%${Utils.escapeLike(name)}%`}
        };
        const [offset, limit] = calculatePagination(Number(pageIndex), Number(pageSize));

        if (type !== "")
            whereCondition.type = type;

        try {
            const {rows, count} = await TemplateModel.findAndCountAll({
                where: whereCondition,
                offset,
                limit,
                order: ['createTime']
            });
            reply.send(createSuccessMessage({
                rows,
                total: count
            }));
        } catch (e) {
            Logger.error(e);
            throw new AppError(ErrorCode.SERVER_ERROR);
        }
    }

    public static async getTemplate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const {id = ''} = request.params as { id?: string };

        try {
            const template: ITemplateModel | null = await TemplateModel.findByPk(id);

            if (!template)
                throw new AppError(ErrorCode.TEMPLATE_NOT_FOUND);

            reply.send(createSuccessMessage(template ?? {}));
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static async copyTemplate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const body = (request.body ?? {}) as { id?: string; name?: string; description?: string };
        const id: string = body.id ?? '';
        const name: string = body.name ?? '';
        const description: string = body.description ?? '';

        try {
            if (id === '')
                throw new AppError(ErrorCode.INVALID_ID);

            const template: ITemplateModel | null = await TemplateModel.findByPk(id);

            if (!template)
                throw new AppError(ErrorCode.TEMPLATE_NOT_FOUND);

            const {dataValues}: any = template;
            const originalTemplate: string = path.join(staticPublicRoot, template?.dataValues.path.replace('/static', '').replace('/index.html', ''));
            const templatePathName: string = uuidv4();
            const dirPath: string = path.join(staticPublicRoot, 'templates', templatePathName);
            const templateStaticPath: string = `/static/templates/${templatePathName}`;
            const htmlPath: string = path.resolve(dirPath, 'index.html');
            const htmPath: string = path.resolve(dirPath, 'index.htm');

            if (existsSync(originalTemplate)) {
                if (!existsSync(dirPath))
                    mkdirSync(dirPath);
                // 递归拷贝：模板可能带 assets/ 等嵌套资源目录，copyFileSync 遇目录抛 EISDIR。
                // filter 排除会在 DB 中重新生成的文件（按 basename 判定，含任意层级同名文件）。
                const ignoreFiles: Array<string> = ['.initialized.t.bin', 'config.json'];

                cpSync(originalTemplate, dirPath, {
                    recursive: true,
                    filter: (src: string): boolean =>
                        src === originalTemplate || !ignoreFiles.includes(path.basename(src))
                });
            }

            const data = {
                ...dataValues,
                name: name === '' ? dataValues.name : name,
                description: description === '' ? dataValues.description : description,
                path: `${templateStaticPath}/${existsSync(htmlPath) ? 'index.html' : existsSync(htmPath) ? 'index.htm' : '/'}`,
                cover: templateStaticPath + '/cover.png',
                gifCover: templateStaticPath + '/cover.gif',
                createTime: getNowTimestamp(),
                id: uuidv4(),
                type: '0'
            };

            await TemplateModel.create(data);
            return void reply.code(204).send();
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static async editTemplate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const body = (request.body ?? {}) as { id?: string; name?: string; description?: string };
        const id: string = body.id ?? '';
        const name: string = body.name ?? '';
        const description: string = body.description ?? '';

        if (id === '')
            throw new AppError(ErrorCode.INVALID_ID);

        try {
            const template: ITemplateModel | null = await TemplateModel.findByPk(id);

            if (!template)
                throw new AppError(ErrorCode.TEMPLATE_NOT_FOUND);
            if (template.type === 1)
                throw new AppError(ErrorCode.TEMPLATE_NOT_EDITABLE);

            const updateData: any = {};

            if (name !== undefined && name !== '')
                updateData.name = name;
            if (description !== undefined && description !== '')
                updateData.description = description;

            const [affectedCount] = await TemplateModel.update(updateData, {
                where: {id}
            });

            if (affectedCount === 1)
                return void reply.code(204).send();
            else
                throw new AppError(ErrorCode.UPDATE_FAILED);
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static async deleteTemplate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const {id = ''} = request.params as { id?: string };

        if (id === '')
            throw new AppError(ErrorCode.INVALID_ID);

        try {
            const template: ITemplateModel | null = await TemplateModel.findByPk(id);

            if (!template)
                throw new AppError(ErrorCode.TEMPLATE_NOT_FOUND);

            const {dataValues}: any = template;

            if (dataValues.type === 1)
                throw new AppError(ErrorCode.TEMPLATE_READ_FAILED);

            const originalTemplate: string = path.join(staticPublicRoot, dataValues.path.replace('/static', '').replace('/index.html', ''));

            await TemplateModel.destroy({where: {id: id}});
            deleteFolderRecursive(originalTemplate);
            return void reply.code(204).send();
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static refreshTemplate(_request: FastifyRequest, reply: FastifyReply): void {
        initDefaultData().then((): void => {
            reply.code(204).send();
        }).catch((e: unknown): void => {
            Logger.error(e);
            reply.send(createSuccessMessage({}));
        });
    }

    public static async uploadTemplate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const part: MultipartFile | undefined = await request.file();

        if (!part || part.type !== 'file')
            throw new AppError(ErrorCode.FILE_MISSING);

        // 直接以流落盘
        const storedName: string = `${uuidv4()}.zip`;
        const filePath: string = path.resolve(UPLOADS_DIR, storedName);

        try {
            await pipeline(part.file, fs.createWriteStream(filePath));
        } catch (e) {
            Logger.error(e);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            throw new AppError(ErrorCode.SERVER_ERROR);
        }

        const originPath: string = path.join(staticPublicRoot, 'templates');
        const fileFolderName: string = uuidv4();
        const templatePathName: string = path.join(originPath, fileFolderName);

        try {
            fs.mkdirSync(templatePathName);

            if (!fs.existsSync(filePath)) {
                deleteFolderRecursive(templatePathName);
                throw new AppError(ErrorCode.SERVER_ERROR);
            }

            if (!isZipFile(filePath)) {
                deleteFolderRecursive(templatePathName);
                fs.unlinkSync(filePath);
                throw new AppError(ErrorCode.TEMPLATE_NOT_ZIP);
            }

            const zip: AdmZip = new AdmZip(filePath);

            // zip-slip 防线：条目名含 .. 段（含反斜杠变体）即整包拒绝，防止解压越出模板目录
            for (const entry of zip.getEntries()) {
                if (entry.entryName.split(/[\\/]/).includes('..')) {
                    deleteFolderRecursive(templatePathName);
                    fs.unlinkSync(filePath);
                    throw new AppError(ErrorCode.TEMPLATE_READ_FAILED);
                }
            }

            zip.extractAllTo(templatePathName, true);
            fs.unlinkSync(filePath);

            // 「右键文件夹→压缩」产出单根目录包（folder/conf.js…），拍平后统一按根目录校验
            flattenSingleRootFolder(templatePathName);

            // 以解压后的文件系统为准校验必备文件（zipEntries 无法反映拍平/嵌套形态）
            if (checkArrayIncludes(fs.readdirSync(templatePathName), templateLocalFiles)) {
                const templateConfig = JSON.parse(fs.readFileSync(path.resolve(templatePathName + `/config.json`), 'utf-8'));
                const isHTMLTemplate: boolean = fs.existsSync(path.resolve(templatePathName, 'index.html'));
                const isHTTemplate: boolean = fs.existsSync(path.resolve(templatePathName, 'index.htm'));
                const templateData = {
                    id: uuidv4(),
                    ...templateConfig,
                    // 上传的模板一律按用户模板入库：即使 zip 内 config.json 抄了内置模板的 type:1，
                    // 也不允许产生不可编辑/不可删除的行
                    type: 0,
                    cover: `/static/templates/${fileFolderName}/cover.png`,
                    gifCover: `/static/templates/${fileFolderName}/cover.gif`,
                    path: `/static/templates/${fileFolderName}${isHTMLTemplate ? '/index.html' : isHTTemplate ? '/index.htm' : '/'}`,
                    createTime: getNowTimestamp(),
                    index: 0,
                    dsp: 1
                };

                await TemplateModel.create(templateData);
                reply.send(createSuccessMessage({...templateData}));
            } else {
                deleteFolderRecursive(templatePathName);
                throw new AppError(ErrorCode.TEMPLATE_READ_FAILED);
            }
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            deleteFolderRecursive(templatePathName);
            throw new AppError(ErrorCode.SERVER_ERROR);
        }
    }
}
