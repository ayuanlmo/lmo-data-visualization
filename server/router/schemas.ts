import {z} from 'zod';

/**
 * 路由级 Zod 校验（配合 fastify-type-provider-zod）。
 * 原则「校验强度只增不减、失败行为保持兼容」：
 *  - 只补充关键安全约束（分页上限、搜索长度、上传体积/类型、封面 base64、路径穿越）；
 *  - 富结构（currentTemplateConfig）用 loose 放行，避免拒绝既有前端载荷；
 *  - 语义存在性校验（invalidId / templateNotFound 等 i18n 消息）仍由处理器负责。
 */

// 分页：pageSize 上限 100（防止一次拉全表）
const pagination = z.object({
    name: z.string().max(128).optional(),
    pageIndex: z.coerce.number().int().min(0).optional(),
    pageSize: z.coerce.number().int().min(1).max(100).optional(),
});

export const idParam = z.object({
    id: z.string().min(1, 'errors.invalidId'),
});

export const templateListQuery = pagination.extend({
    type: z.string().max(64).optional(),
});

export const idOnlyBody = z.object({
    id: z.string().min(1),
}).loose();

export const templateEditBody = z.object({
    id: z.string(),
    name: z.string().max(128).optional(),
    description: z.string().max(512).optional(),
}).loose();

export const templateCopyBody = z.object({
    id: z.string().min(1),
    name: z.string().max(128).optional(),
    description: z.string().max(512).optional(),
}).loose();

export const colorQuery = z.object({
    type: z.enum(['theme', 'background']).optional(),
});

export const fileEditBody = z.object({
    name: z.string().max(128).optional(),
    categoryId: z.string().max(64).nullable().optional(),
}).loose();

export const fileCategoryBody = z.object({
    name: z.string().min(1, 'errors.serverError').max(16, 'errors.serverError'),
    parentId: z.string().max(64).nullable().optional(),
    id: z.string().max(64).optional(),
}).loose();

export const uploadFileListQuery = pagination.extend({
    type: z.string().max(64).optional(),
    categoryId: z.string().max(64).optional(),
});

// 合成任务：封面 base64 结构校验（防止伪 base64 进入 sharp）
const base64Image = z.string().regex(/^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=]+$/).optional();

export const createTaskBody = z.object({
    id: z.string().min(1, 'errors.invalidId'),
    currentTemplateConfig: z.object({}).loose().default({}),
    saveAsCustomTemplate: z.boolean().optional().default(false),
    preview: z.boolean().optional().default(false),
    customTemplateName: z.string().max(128).optional(),
    customTemplateDesc: z.string().max(512).optional(),
    taskName: z.string().max(128).optional(),
    cover: base64Image,
}).loose();

/**
 * WebSocket 消息 Zod 校验。
 *  - /connect：仅接受结构化 {cmd:'__ABORT_RENDER', id}，其余不回显（避免反射回显）；
 *  - /template：握手消息 {id, template}，非法即断开。
 * 心跳（__SOCKET_PONG_KEY）为裸字符串协议，在进入 JSON 解析前先判断，不经此处。
 */
export const abortRenderMessage = z.object({
    cmd: z.literal('__ABORT_RENDER'),
    id: z.string().min(1)
});

export const templateHandshakeMessage = z.object({
    id: z.string(),
    template: z.string().optional()
});
