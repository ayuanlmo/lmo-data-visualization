import {v4 as uuidv4} from "uuid";
import * as fs from "fs";
import path from "path";
import crypto from "node:crypto";
import {pipeline} from "node:stream/promises";
import type {FastifyReply, FastifyRequest} from "fastify";
import type {MultipartFile} from "@fastify/multipart";
import Utils from "./../../utils/index.js";
import AppConfig from "./../../conf/AppConfig.js";
import UpLoadFileTypes from "./../../const/UpLoadFileTypes.js";
import {
    IUpLoadFilesCategoryModel,
    IUpLoadFilesModel,
    UpLoadFilesCategoryModel,
    UpLoadFilesModel
} from "./../dataBase/index.js";
import {Op} from "sequelize";
import FFMPEG from "./../synthesis/ffmpeg.js";
import Logger from "./../../lib/Log.js";
import {AppError, ErrorCode, rethrowAppError} from "./../../lib/AppError.js";
import {staticPublicRoot} from "./../../lib/dataDir.js";

import createSuccessMessage = Utils.createSuccessMessage;
import calculatePagination = Utils.calculatePagination;

interface IQueryCriteria {
    [key: string]: any;
}

const UPLOADS_DIR: string = path.join(staticPublicRoot, 'uploads');

export default class File {
    public static async upload(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const part: MultipartFile | undefined = await request.file();

        if (!part || part.file === undefined || part.type !== 'file')
            throw new AppError(ErrorCode.FILE_MISSING);

        if (!UpLoadFileTypes.includes(part.mimetype)) {
            await part.toBuffer(); // 排空流，避免连接挂起
            throw new AppError(ErrorCode.FILE_UNSUPPORTED_TYPE);
        }

        const fields: Record<string, any> = part.fields ?? {};
        const name: string = fields.name?.value ?? part.filename;
        const categoryId: string | null = fields.categoryId?.value ?? null;
        const fileId: string = uuidv4();
        const fileExtension: string = path.extname(part.filename);
        const storedName: string = `${fileId}${fileExtension}`;
        // @fastify/multipart 直接以流写入目标名（无二次拷贝落盘）
        const storedPath: string = path.resolve(UPLOADS_DIR, storedName);
        const staticFilePath: string = `${AppConfig.__STATIC_PATH}/uploads/${storedName}`;

        try {
            await pipeline(part.file, fs.createWriteStream(storedPath));
        } catch (e) {
            Logger.error(e);
            if (fs.existsSync(storedPath)) fs.unlinkSync(storedPath);
            throw new AppError(ErrorCode.SERVER_ERROR);
        }

        try {
            const filesHash: string = await File.getFileHash(storedPath);
            const existing: IUpLoadFilesModel | null = await UpLoadFilesModel.findOne({
                where: {hash: filesHash}
            });

            if (existing) {
                fs.unlinkSync(storedPath);
                return void reply.send(createSuccessMessage(existing.dataValues ?? {}));
            }

            const data: any = {
                id: fileId,
                name: name,
                path: staticFilePath,
                cover: '',
                type: part.mimetype,
                createTime: Utils.getNowTimestamp().toString(),
                categoryId: categoryId,
                hash: filesHash
            };

            await UpLoadFilesModel.create(data);
            reply.send(createSuccessMessage(data));

            if (part.mimetype.includes('audio')) {
                const audioCoverName: string = fileId + '-v.t.png';
                const audioCoverStaticPath: string = `${AppConfig.__STATIC_PATH}/uploads/` + audioCoverName;
                const audioCoverPath: string = path.resolve(UPLOADS_DIR, audioCoverName);

                // 进程内直调 ffmpeg 生成波形图。
                // 只有波形图真正生成成功后才回写 cover，失败时保持 cover 为空（不悬空指向不存在文件）。
                FFMPEG.getAudioVisualizationDiagram(storedPath, audioCoverPath)
                    .then(async (): Promise<void> => {
                        try {
                            await UpLoadFilesModel.update({cover: audioCoverStaticPath}, {where: {id: fileId}});
                        } catch (e) {
                            Logger.error(e);
                        }
                    })
                    .catch((e: unknown): void => {
                        Logger.error(e);
                    });
            }
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static getFileHash(filePath: string): Promise<string> {
        // 用 end/error 事件 + pipeline 语义，空文件/立即 EOF 也能可靠 resolve
        return new Promise<string>((resolve, reject): void => {
            const hash: crypto.Hash = crypto.createHash('md5');
            const input: fs.ReadStream = fs.createReadStream(filePath);

            input.on('data', (chunk: Buffer | string): void => {
                hash.update(chunk);
            });
            input.on('end', (): void => resolve(hash.digest('hex').toUpperCase()));
            input.on('error', (err: Error): void => reject(err));
        });
    }

    public static async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const body = request.body as { id?: string } | undefined;
        const id: string = body?.id ?? "";

        if (id === '')
            throw new AppError(ErrorCode.INVALID_ID);

        try {
            const file = await UpLoadFilesModel.findByPk(id);

            if (!file)
                throw new AppError(ErrorCode.FILE_NOT_FOUND);

            const {dataValues} = file;
            const filePath: string = path.join(staticPublicRoot, dataValues.path.replace('/static', ''));
            const deleteRows: number = await UpLoadFilesModel.destroy({
                where: {id: id}
            });

            if (deleteRows > 0) {
                if (fs.existsSync(filePath))
                    fs.unlinkSync(filePath);
                return void reply.code(204).send();
            } else
                throw new AppError(ErrorCode.INVALID_ID);
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static async edit(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const {id} = request.params as { id: string };
        const body = request.body as { name?: string; categoryId?: string | null } | undefined;
        const name: string = body?.name ?? '';
        const categoryId: string | null = body?.categoryId ?? null;

        if (id === '')
            throw new AppError(ErrorCode.INVALID_ID);

        try {
            const file: IUpLoadFilesModel | null = await UpLoadFilesModel.findByPk(id);

            if (!file)
                throw new AppError(ErrorCode.SERVER_ERROR);

            const [affectedCount] = await UpLoadFilesModel.update({
                name,
                categoryId
            }, {
                where: {id: id}
            });

            if (affectedCount > 0)
                return void reply.code(204).send();
            else
                throw new AppError(ErrorCode.DATABASE_ERROR);
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static async getFiles(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const q = (request.query ?? {}) as Record<string, any>;
        const name: string = q.name ?? '';
        const pageIndex = q.pageIndex ?? 0;
        const pageSize = q.pageSize ?? 10;
        const categoryId: string = q.categoryId ?? '';
        const type: string = q.type ?? '';
        const whereCondition: IQueryCriteria = {
            name: {[Op.like]: `%${Utils.escapeLike(name)}%`},
            type: {[Op.like]: `%${Utils.escapeLike(type)}%`}
        };
        const [offset, limit] = calculatePagination(Number(pageIndex), Number(pageSize));

        if (categoryId !== '')
            whereCondition.categoryId = categoryId;

        try {
            const {rows, count} = await UpLoadFilesModel.findAndCountAll({
                where: whereCondition,
                offset,
                limit
            });

            reply.send(createSuccessMessage({
                rows,
                total: count
            }));
        } catch (e) {
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static async getFileCategory(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const category = await UpLoadFilesCategoryModel.findAll();
            const map: any = {};
            const tree: any[] = [];
            const ids: Array<string> = [];

            category.forEach((i: IUpLoadFilesCategoryModel): void => {
                map[i.dataValues.id] = {...i.dataValues, children: []};
                ids.push(i.dataValues.id);
            });

            category.forEach((i: IUpLoadFilesCategoryModel): void => {
                const parentId = i.dataValues.parentId;
                // parentId 悬空（父已被删）时容错——降级为根节点，而非 map[parentId] undefined 崩溃
                if (parentId !== null && map[parentId])
                    map[parentId].children.push(map[i.dataValues.id]);
                else
                    tree.push(map[i.dataValues.id]);
            });

            reply.send(createSuccessMessage({
                tree,
                ids
            }));
        } catch (e) {
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    public static async addFileCategory(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const body = (request.body ?? {}) as { name?: string; parentId?: string | null; id?: string };
        const name: string = body.name ?? '';
        const parentId: string | null = body.parentId ?? null;
        const id: string = body.id ?? '';

        // 名称非空且 ≤16（Zod 已在路由层校验，这里兜底）
        if (name === '' || name.length > 16)
            throw new AppError(ErrorCode.SERVER_ERROR);

        try {
            // 按 id 是否为空区分 update / create 职责
            if (id !== '') {
                await File.renameFileCategory(id, name);
                return void reply.code(204).send();
            }

            if (parentId !== '' && parentId !== undefined) {
                await File.createFileCategory(name, parentId);
                return void reply.code(204).send();
            }

            throw new AppError(ErrorCode.SERVER_ERROR);
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    /** 重命名已有分类（找不到目标即抛业务错，交出口映射）。 */
    private static async renameFileCategory(id: string, name: string): Promise<void> {
        const category: IUpLoadFilesCategoryModel | null = await UpLoadFilesCategoryModel.findByPk(id);

        if (!category)
            throw new AppError(ErrorCode.SERVER_ERROR);

        await UpLoadFilesCategoryModel.update({name}, {where: {id}});
    }

    /** 在指定父节点下创建新分类。 */
    private static async createFileCategory(name: string, parentId: string | null): Promise<void> {
        await UpLoadFilesCategoryModel.create({
            id: uuidv4(),
            name,
            parentId
        });
    }

    public static async deleteFileCategory(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const {id = ""} = request.params as { id?: string };

        if (id === "")
            throw new AppError(ErrorCode.INVALID_ID);

        try {
            const category: IUpLoadFilesCategoryModel | null = await UpLoadFilesCategoryModel.findByPk(id);

            if (!category)
                throw new AppError(ErrorCode.SERVER_ERROR);

            const rows: IUpLoadFilesCategoryModel[] = await UpLoadFilesCategoryModel.findAll({
                where: {parentId: id}
            });

            if (rows.length > 0)
                throw new AppError(ErrorCode.SERVER_ERROR);

            await UpLoadFilesCategoryModel.destroy({
                where: {id}
            });
            return void reply.code(204).send();
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }
}
