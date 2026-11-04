import {v4 as uuidv4} from "uuid";
import type {FastifyReply, FastifyRequest} from "fastify";
import Utils from "../../utils/index.js";
import {ITemplateModel, TemplateModel} from "../dataBase/index.js";
import Logger from "../../lib/Log.js";
import {AppError, ErrorCode, rethrowAppError} from "../../lib/AppError.js";
import TaskService, {ICreateTaskInput} from "../synthesis/TaskService.js";
import createSuccessMessage = Utils.createSuccessMessage;

export default class Task {

    /**
     * @method createTask
     * @author ayuanlmo
     * @description 创建合成任务 / 保存自定义模板 / 预览的控制器入口。
     *
     * 本方法仅解析请求体、校验并串联 TaskService 的助手方法，
     * 具体业务（模板文件拷贝、conf/data 生成、音频注入、封面生成、DB 落库、调度推送、WS 通知）
     * 见 `synthesis/TaskService.ts`。
     *
     * 三种模式：
     *  - preview：仅准备模板文件并返回预览静态路径；
     *  - saveAsCustomTemplate：拷贝 + 封面 + 落 Templates 表；
     *  - 合成：拷贝 + 音频注入 + 落 Resources 表 + 推送调度器 + WS 通知。
     **/
    public static async createTask(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const body = (request.body ?? {}) as Record<string, any>;
        debugger
        const input: ICreateTaskInput = {
            currentTemplateConfig: body.currentTemplateConfig ?? {}, // 当前模板配置
            saveAsCustomTemplate: body.saveAsCustomTemplate ?? false, // 保存为自定义模板
            customTemplateDesc: body.customTemplateDesc ?? '', // 自定义模板介绍
            customTemplateName: body.customTemplateName ?? uuidv4(), // 自定义模板名称
            id: body.id ?? '', // 源模板id
            taskName: body.taskName ?? '', // 合成任务名称
            preview: body.preview ?? false, // 是否预览
            cover: body.cover ?? '' // 封面
        };

        if (input.id === '')
            throw new AppError(ErrorCode.INVALID_ID);

        // 同进程合成能力恒可用，无需「服务离线」判断。

        try {
            const template: ITemplateModel | null = await TemplateModel.findByPk(input.id);

            if (!template)
                throw new AppError(ErrorCode.FILE_NOT_FOUND);

            const ctx = TaskService.resolveContext(input, template);

            TaskService.prepareTemplateFiles(ctx);

            if (input.preview) {
                return void reply.send(createSuccessMessage(TaskService.getPreviewResponse(ctx)));
            } else if (input.saveAsCustomTemplate) {
                await TaskService.createCustomTemplate(ctx);
                return void reply.code(204).send();
            } else {
                const audioConfig = await TaskService.injectAudioTag(ctx);
                await TaskService.createSynthesisTask(ctx, audioConfig, reply);
            }
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.DATABASE_ERROR);
        }
    }
}
