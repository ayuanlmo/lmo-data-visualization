import { v4 as uuidv4 } from "uuid";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import fs from "fs";
import path from "path";
import pug from "pug";
import sharp from "sharp";
import type { FastifyReply } from "fastify";
import Utils from "../../utils/index.js";
import AppConfig from "../../conf/AppConfig.js";
import Logger from "../../lib/Log.js";
import { AppError, ErrorCode } from "../../lib/AppError.js";
import { packagePath, staticPublicRoot } from "../../lib/dataDir.js";
import { ITemplateModel, ResourcesModel, TemplateModel } from "../dataBase/index.js";
import { WebSocketServer } from "../WebSocketServer.js";
import TaskScheduler from "../TaskScheduler.js";

export interface ITaskFinishResult {
    name: string | undefined;
    filePath: string;
}

/** createTask 请求体（控制器已完成默认值填充与 id 校验后传入）。 */
export interface ICreateTaskInput {
    currentTemplateConfig: Record<string, any>;
    saveAsCustomTemplate: boolean;
    customTemplateDesc: string;
    customTemplateName: string;
    id: string;
    taskName: string;
    preview: boolean;
    cover: string;
}

/** 一次 createTask 解析出的路径/标识上下文，供各助手方法共享（避免重复计算与隐式耦合）。 */
export interface ITaskContext {
    dbId: string;
    templatePathName: string;
    templateStaticPath: string;
    originalTemplate: string;
    dirPath: string;
    serverHttpUrl: string;
    htmlPath: string;
    htmPath: string;
    input: ICreateTaskInput;
}

export interface ITaskAudioConfig {
    audioPath: string;
    audioVolume: number;
    pAudio: boolean;
}

/**
 * 任务服务：createTask 的业务逻辑（文件拷贝、conf/data 生成、音频注入、封面生成、DB 落库、
 * 调度推送、WS 通知、错误码与契约映射），供控制器串联编排。
 */
export default class TaskService {
    /**
     * 任务结束回写：将合成结果（end / error）回写 Resources 表。
     * 按主键精确匹配更新（不用 Op.like 模糊），并显式 try/catch 避免未处理 rejection。
     */
    public static async onTaskFinished(
        taskId: string,
        result: {id?: string; videoCover?: string; gifPath?: string} | undefined,
        isError: boolean
    ): Promise<ITaskFinishResult> {
        const id: string = result?.id ?? taskId;
        const filePath: string = `/static/output/${id}.mp4`;

        const data: Record<string, any> = {
            status: isError ? 'error' : 'end'
        };

        if (!isError) {
            data.filePath = filePath;
            data.videoCover = `/static/output/${result?.videoCover}.png`;
            data.gifPath = `/static/output/${result?.gifPath}.gif`;
        }

        let name: string | undefined;

        try {
            // 按主键精确匹配更新
            await ResourcesModel.update(data, {where: {id}});
            const resources = await ResourcesModel.findByPk(id);

            name = resources?.dataValues?.name;
        } catch (e) {
            Logger.error(e);
        }

        return {name, filePath};
    }

    /** 解析所有派生路径/标识（三处模式共用）。 */
    public static resolveContext(input: ICreateTaskInput, template: ITemplateModel): ITaskContext {
        const pathName: string = input.preview ? 'previewTemplate' : 'templates';
        const templatePathName: string = uuidv4();
        const dbId: string = uuidv4();
        // 用 path.join 而非 path.resolve：DB 里的 URL 去掉 `/static` 后段首带 `/`，
        // resolve 会把它当绝对路径并丢弃基址，join 才是需要的拼接语义。
        const dirPath: string = path.join(staticPublicRoot, pathName, templatePathName);

        return {
            dbId,
            templatePathName,
            templateStaticPath: `/static/${pathName}/${templatePathName}`,
            originalTemplate: path.join(staticPublicRoot, template.dataValues.path.replace('/static', '').replace('/index.html', '')),
            dirPath,
            serverHttpUrl: `http://${process.env.SERVER_HOST ?? 'localhost'}:${AppConfig.__SERVER_PORT}`,
            htmlPath: path.resolve(dirPath, 'index.html'),
            htmPath: path.resolve(dirPath, 'index.htm'),
            input
        };
    }

    /** 拷贝模板基础文件并写出 conf.js / data.json（后续模式分支共用）。 */
    public static prepareTemplateFiles(ctx: ITaskContext): void {
        const {originalTemplate, dirPath, dbId, input} = ctx;

        // 源模板是否存在（缺失 → DATABASE_ERROR）
        if (!existsSync(originalTemplate))
            throw new AppError(ErrorCode.DATABASE_ERROR);

        if (!existsSync(dirPath))
            mkdirSync(dirPath);

        // 拷贝模板文件：以下文件会在后续流程中基于当前配置重新生成，因此不从源模板拷贝
        // （入口 index.js / index.html / index.htm 及模板自带的其他资源均必须拷贝，
        //  否则模板引用的子模块、图片等资源会丢失）
        const regeneratedFiles: Array<string> = ['conf.js', 'data.json', 'config.json', '.initialized.t.bin'];

        readdirSync(originalTemplate).forEach((file: string): void => {
            if (regeneratedFiles.includes(file)) return;

            copyFileSync(path.resolve(`${originalTemplate}/${file}`), path.resolve(`${dirPath}/${file}`));
        });

        // 写出模板配置文件 "conf.js"
        writeFileSync(path.resolve(dirPath, 'conf.js'), `const config = ${JSON.stringify({
            ...input.currentTemplateConfig,
            id: dbId,
            template: input.id
        })}\n export default config;`);

        if (input.currentTemplateConfig?.data && Array.isArray(input.currentTemplateConfig.data))
            // 写出模板数据文件
            writeFileSync(path.resolve(dirPath, 'data.json'), JSON.stringify(input.currentTemplateConfig?.data));
        else
            throw new AppError(ErrorCode.SERVER_ERROR);
    }

    /** 预览模式响应体（相对静态路径 + 模板 id）。 */
    public static getPreviewResponse(ctx: ITaskContext): {path: string; id: string} {
        const {templateStaticPath, htmlPath, htmPath, templatePathName} = ctx;

        return {
            path: `${templateStaticPath}/${existsSync(htmlPath) ? 'index.html' : existsSync(htmPath) ? 'index.htm' : '/'}?__type=h`,
            id: templatePathName
        };
    }

    /** 合成前处理模板音频（full 模式交合成服务；非 full 注入 <audio> 标签）。失败仅记日志，不阻断。 */
    public static async injectAudioTag(ctx: ITaskContext): Promise<ITaskAudioConfig> {
        const {dirPath, htmlPath, htmPath, serverHttpUrl, input} = ctx;
        const taskAudioConfig: ITaskAudioConfig = {audioPath: '', audioVolume: 100, pAudio: false};
        const audio = input.currentTemplateConfig?.config?.audio;

        try {
            if (audio && audio.path !== '') {
                if (audio.full) {
                    taskAudioConfig.pAudio = true; // 合成服务器是否需要处理音频（full模式下
                    taskAudioConfig.audioVolume = Number(audio.volume); // 音量
                    taskAudioConfig.audioPath = path.join(staticPublicRoot, audio.path.replace('/static', '')); // 音频文件地址
                } else {
                    const audioElement: string = `<audio src="${serverHttpUrl}${audio.src}" volume="${Number(audio.volume) / 100}"></audio>`;
                    const audioTag: string = `<!--__LMO_SERVER_AUDIO_RENDER_TAG-->`; // 这个html注释，将会被替换成<audio src="..." />
                    let originHtmlContent: string = '';
                    let afterHtmlContent: string = '';

                    if (existsSync(htmlPath))
                        originHtmlContent = readFileSync(path.resolve(dirPath, 'index.html')).toString();
                    else if (existsSync(htmPath))
                        originHtmlContent = readFileSync(path.resolve(dirPath, 'index.htm')).toString();
                    else
                        originHtmlContent = await TaskService.getTemplateHTMLString(); // index.html 和 index.htm都不存在的情况下，则取内置的模板引擎

                    if (originHtmlContent.includes(audioTag))
                        afterHtmlContent = originHtmlContent.replace(audioTag, audioElement);
                    else
                        afterHtmlContent = originHtmlContent + '\n' + audioElement;

                    writeFileSync(path.resolve(dirPath, 'index.html'), afterHtmlContent);
                }
            }
        } catch (e) {
            Logger.error(e);
        }

        return taskAudioConfig;
    }

    /** 保存自定义模板：生成封面（png/gif）→ 写 .initialized.t.bin → 落库。 */
    public static async createCustomTemplate(ctx: ITaskContext): Promise<void> {
        const {dirPath, templateStaticPath, htmlPath, htmPath, dbId, input} = ctx;

        if (!input.cover.includes(';base64,'))
            throw new AppError(ErrorCode.TEMPLATE_COVER_NOT_BASE64);

        const base64Cover = input.cover.split(';base64,').pop();
        const base64Buffer = Buffer.from(base64Cover as string, 'base64');

        try {
            await sharp(base64Buffer)
                .resize(460, 258)
                .toFile(path.resolve(dirPath, 'cover.png'));
            await sharp(base64Buffer)
                .resize(460, 258)
                .toFile(path.resolve(dirPath, 'cover.gif'));
        } catch (e) {
            Logger.error(e);
            throw new AppError(ErrorCode.SERVER_ERROR);
        }

        const dbData = {
            id: dbId,
            name: input.customTemplateName,
            description: input.customTemplateDesc,
            path: `${templateStaticPath}${existsSync(htmlPath) ? '/index.html' : existsSync(htmPath) ? '/index.htm' : '/'}`,
            createTime: Utils.getNowTimestamp(),
            cover: templateStaticPath + '/cover.png',
            gifCover: templateStaticPath + '/cover.gif',
            type: 0
        };
        fs.writeFileSync(path.resolve(`${dirPath}/.initialized.t.bin`), Buffer.from(JSON.stringify(dbData)));

        try {
            await TemplateModel.create(dbData);
        } catch (e) {
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }

    /** 生成合成任务配置（taskConfig + 待落库 dbData）。 */
    public static buildTaskConfig(ctx: ITaskContext): {taskConfig: Record<string, any>; dbData: Record<string, any>} {
        const {dbId, dirPath, templateStaticPath, htmlPath, htmPath, serverHttpUrl, input} = ctx;
        const video = input.currentTemplateConfig?.config?.video ?? {};

        const templateServerUrl: string = `${templateStaticPath}/${existsSync(htmlPath) ? 'index.html' : existsSync(htmPath) ? 'index.htm' : ''}?__type=h`;

        // 先取默认值再断言类型（`??` 与 `as` 的优先级），语义与运行时一致
        const duration: number = (video.duration ?? 5000) as number;
        const fps: number = (video.fps ?? 30) as number;

        const taskConfig = {
            id: dbId,
            path: `${serverHttpUrl}${templateServerUrl}`,
            duration,
            ...TaskService.getVideoClarity(video.clarity ?? ''),
            fps,
            optPath: path.join(staticPublicRoot, 'output', `${dbId}.mp4`),
            fileName: `${dbId}`,
            folder: path.join(staticPublicRoot, 'output')
        };
        const dbData = {
            id: dbId,
            template: input.id,
            filePath: '',
            name: input.taskName === '' ? uuidv4() : input.taskName,
            templatePath: dirPath,
            createTime: Utils.getNowTimestamp(),
            url: templateServerUrl,
            clarity: video.clarity ?? '1080P',
            status: 'pending',
            taskConfig: JSON.stringify(taskConfig)
        };

        return {taskConfig, dbData};
    }

    /** 合成任务：落库 → 204 → 推送调度器 → WS 通知页面。 */
    public static async createSynthesisTask(
        ctx: ITaskContext,
        audioConfig: ITaskAudioConfig,
        reply: FastifyReply
    ): Promise<void> {
        const {taskConfig, dbData} = TaskService.buildTaskConfig(ctx);

        try {
            await ResourcesModel.create(dbData);
        } catch (e) {
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }

        reply.code(204).send();

        // @ts-ignore
        TaskScheduler.push({
            ...taskConfig,
            name: dbData.name,
            ...audioConfig
        });

        // 通知页面
        WebSocketServer.sendMessage(JSON.stringify({
            type: 'TASK_PENDING',
            message: {
                id: ctx.dbId,
                name: dbData.name
            }
        }));
    }

    /**
     * 直接用 `pug.renderFile` 渲染内置模板引擎生成 HTML（无 HTTP 自调用、不依赖 listen 时序）。
     * locals 与 /static/templates 路由对空查询的渲染结果一致（title/lang/queryParams）。
     */
    private static getTemplateHTMLString(): Promise<string> {
        return new Promise((resolve: (data: string) => void, reject: (data: string) => void): void => {
            const templateFile: string = packagePath('views', 'template', 'index.pug');

            pug.renderFile(templateFile, {
                title: 'lmo-DV template',
                lang: 'en',
                queryParams: '{}'
            }, (err: Error | null, html: string): void => {
                if (err) reject(String(err));
                else resolve(html);
            });
        });
    }

    private static getVideoClarity = (clarity: string): {
        width: number;
        height: number;
    } => {
        switch (clarity) {
            case '1080P':
                return {
                    width: 1920,
                    height: 1080
                }
            case '2K':
                return {
                    width: 2560,
                    height: 1440
                }
            case '4K':
                return {
                    width: 4096,
                    height: 2160
                }
            default:
                return {
                    width: 1920,
                    height: 1080
                }
        }
    }
}
