import { existsSync } from "node:fs";
import { join } from "node:path";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import multipart from "@fastify/multipart";
import websocket from "@fastify/websocket";
import view from "@fastify/view";
import pug from "pug";
import {
    serializerCompiler,
    validatorCompiler,
    hasZodFastifySchemaValidationErrors,
    type ZodTypeProvider,
} from "fastify-type-provider-zod";
import AppConfig from "./../conf/AppConfig.js";
import {env} from "./../conf/env.js";
import Utils from "./../utils/index.js";
import Logger from "./../lib/Log.js";
import {WsHub} from "./../lib/wsHub.js";
import {initI18n, resolveLng, translate} from "./../lib/i18n/index.js";
import {isAppError} from "./../lib/AppError.js";
import {packagePath, staticPublicRoot} from "./../lib/dataDir.js";
import {WebSocketServer, type IWsApp} from "./WebSocketServer.js";
import TemplateSocket from "./TemplateSocket.js";
import {registerApiRoutes} from "./../router/index.js";
import CreateErrorMessage = Utils.createErrorMessage;

// views 跟代码一起分发（取包根），_data/static 是运行时数据（取数据根，可被 DATA_DIR 改）。
// 两者以前都靠 __dirname 相对层级硬算，跑编译产物时会多钻一层 dist/ 而整体失效。
const VIEWS_DIR: string = packagePath('views');
const STATIC_ROOT: string = staticPublicRoot;

// 模板目录名的允许形式：UUID 与内置模板目录名（base-bar-chart 等）。
// 首字符限定为字母数字，顺带挡掉 "." 与 ".." —— 这个值要拿去拼磁盘路径，不能直接使用。
const SAFE_TEMPLATE_ID: RegExp = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
// 模板自带入口文件的候选（与 TaskService、controllers/Template.ts 里的判定保持一致）。
const TEMPLATE_ENTRY_FILES: Array<string> = ['index.html', 'index.htm'];

// 结构化的 ws 连接类型（避免对 'ws' 包的直接类型依赖，兼容 pnpm 严格解析）
interface WsLikeSocket {
    readyState: number;
    send(data: string): void;
    close(): void;
    on(event: string, cb: (data: unknown) => void): void;
}

/** 把 @fastify/websocket 的原生 socket 适配为既有的 IWsApp（message 回传 string）。 */
function toWsApp(socket: WsLikeSocket): IWsApp {
    return {
        send: (msg: string): void => {
            if (socket.readyState === 1) socket.send(msg);
        },
        close: (): void => socket.close(),
        on: (key: string, cb: (msg: string) => void): void => {
            socket.on(key, (data: unknown): void => cb((data as {toString(): string}).toString()));
        }
    };
}

/**
 * 组装 Fastify 实例（插件、钩子、错误映射、/api 路由、WS、pug 预览），但**不 listen**。
 * 供生产启动（HttpServer）与集成测试（`app.inject`，不占端口）共用同一装配，避免测试与线上分叉。
 */
export async function createApp() {
    await initI18n();

    // bodyLimit 必须显式设置：缺省值（1MB）对带大量自定义数据的 createTask 偏低，
    // 超限时 Fastify 抛 FST_ERR_CTP_BODY_TOO_LARGE，在下面分支中被映射为可读提示。
    const app = Fastify({logger: false, bodyLimit: env.REQUEST_BODY_LIMIT_MB * 1024 * 1024})
        .withTypeProvider<ZodTypeProvider>();

    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    // 关键：错误/未找到处理器必须在注册任何（子上下文）路由之前设置，
    // 否则子上下文在创建时已绑定默认错误处理，Zod 校验失败会回 400 原始体而非冻结契约。
    // 出口统一：校验错误/未知异常 → HTTP 200 + {code:500,...}（web_app 拦截器语义不变）。
    app.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply): void => {
        reply.code(200).send(CreateErrorMessage({message: '404', code: 404}));
    });

    app.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply): void => {
        // 控制器抛出的业务异常 → 按 i18nKey 翻译并映射为冻结契约
        if (isAppError(error)) {
            reply.code(200).send(CreateErrorMessage({
                code: error.contractCode,
                message: request.t(error.i18nKey),
                ...(error.errorCode ? {errorCode: error.errorCode} : {})
            }));
            return;
        }

        // 请求体超限：不特判会被下面归并为「服务器错误」，前端只看到笼统失败，
        // 排查时会误往合成/数据库方向查；这里留一行可定位的 warn 并回具体原因。
        if (error?.code === 'FST_ERR_CTP_BODY_TOO_LARGE') {
            Logger.warn(`Request body too large for ${request.method} ${request.url} (limit=${env.REQUEST_BODY_LIMIT_MB}MB)`);
            reply.code(200).send(CreateErrorMessage({
                code: 500,
                message: request.t('errors.bodyTooLarge', {max: env.REQUEST_BODY_LIMIT_MB})
            }));
            return;
        }

        if (hasZodFastifySchemaValidationErrors(error))
            Logger.warn(`Validation failed for ${request.method} ${request.url}: ${JSON.stringify(error.validation)}`);
        else
            Logger.error(error);

        reply.code(200).send(CreateErrorMessage({
            message: request.t('errors.serverError')
        }));
    });

    await app.register(cors);
    await app.register(multipart, {
        limits: {fileSize: 512 * 1024 * 1024} // 512MB 上限（防止大文件直接落盘 DoS）
    });
    await app.register(websocket);
    await app.register(view, {engine: {pug}, root: VIEWS_DIR});
    await app.register(fastifyStatic, {
        root: STATIC_ROOT,
        prefix: `${AppConfig.__STATIC_PATH}/`
    });

    // i18n：?lang= 优先（与 web_app 注入参数一致），回落 accept-language → request.t
    app.addHook('onRequest', async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
        const q = request.query as Record<string, unknown> | undefined;
        const lng: string = resolveLng(q?.lang, request.headers['accept-language'] as string | undefined);
        request.t = translate(lng);
    });

    // 请求日志（Fastify 内置 logger 关闭，统一走 pino）
    app.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        Logger.info(`${request.method} ${request.url} ${reply.statusCode}`);
    });

    // live-server 拦截 + 静态资源黑名单（preHandler 前置，确保早于路由处理生效）
    app.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const url: string = request.url;

        if (url.startsWith(AppConfig.__STATIC_PATH)) {
            const segments: Array<string> = url.split('?')[0].split('/');
            const last: string = segments[segments.length - 1];

            if (AppConfig.__PROTECTED_STATIC_FILES.some((i: string): boolean => last.includes(i))) {
                await reply.code(200).send(CreateErrorMessage({message: '404', code: 404}));
                return;
            }
        }

        if (AppConfig.__LIVE_SERVER) {
            const writeMethods: Array<string> = ['PUT', 'DELETE'];
            const isWrite: boolean = writeMethods.some((i: string): boolean => request.method === i);
            const isProtectedRoute: boolean = AppConfig.__PROTECTED_ROUTERS.some(
                (i: string): boolean => url.includes(i) && request.method !== 'GET'
            );

            if (isWrite || isProtectedRoute) {
                // live-server 拒绝必须带 errorCode:'ext00el'
                await reply.code(200).send(CreateErrorMessage({
                    message: request.t('errors.liveServerForbidden'),
                    errorCode: 'ext00el'
                }));
            }
        }
    });

    // 模板目录访问：/static/<templates|previewTemplate>/<id>[/]，无扩展名，渲染 template/index.pug。
    // 尾/必须单独注册，否则使用内置引擎的模板会出现404情况
    const renderTemplateEngine = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        const q = request.query as Record<string, unknown>;
        await (reply as any).view('template/index.pug', {
            title: 'lmo-DV template',
            lang: request.headers['accept-language'] ?? 'en',
            queryParams: JSON.stringify(q ?? {})
        });
    };

    /**
     * 目录根（带尾/）请求：模板自带入口文件时必须让位给真实文件，否则会把「HTML 模板」
     * 也渲染成通用引擎壳，设计预览与合成的内容都会跟着变。
     */
    const renderTemplateDir = (kind: 'templates' | 'previewTemplate') =>
        async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
            const {id}: {id: string} = request.params as {id: string};

            if (SAFE_TEMPLATE_ID.test(id)) {
                for (const entry of TEMPLATE_ENTRY_FILES) {
                    if (existsSync(join(STATIC_ROOT, kind, id, entry)))
                        return reply.sendFile(`${kind}/${id}/${entry}`);
                }
            }
            return renderTemplateEngine(request, reply);
        };

    app.get('/static/templates', renderTemplateEngine);
    // 无/形式沿用原行为（直接渲染引擎壳）：这类 URL 下 pug 里的 `./index.js` 会解析到上一层，
    // 本就不是模板资源的可用入口，DB 也从不对有入口文件的模板发这种地址，所以维持不变以免误伤。
    app.get('/static/templates/:id', renderTemplateEngine);
    app.get('/static/templates/:id/', renderTemplateDir('templates'));
    // 预览任务目录：TaskService.resolveContext 在 input.preview 时用这一层，模板文件是拷贝过去的，
    // 源模板带 index.html 时这里也会有，因此同样要先让位给真实入口文件。
    app.get('/static/previewTemplate/:id', renderTemplateEngine);
    app.get('/static/previewTemplate/:id/', renderTemplateDir('previewTemplate'));

    // /api 路由（含 Zod 校验），前缀 /api
    await app.register(async (instance) => registerApiRoutes(instance), {prefix: '/api'});

    // WebSocket：/connect（浏览器）与 /template（模板预览）
    app.get(AppConfig.__SOCKET_CONNECT, {websocket: true}, (socket: WsLikeSocket): void => {
        const wsApp: IWsApp = toWsApp(socket);
        const remove: () => void = WsHub.addClient(wsApp);
        new WebSocketServer(wsApp, WsHub.clientCount);
        socket.on('close', (): void => { remove(); });
    });
    app.get('/template', {websocket: true}, (socket: WsLikeSocket): void => {
        const wsApp: IWsApp = toWsApp(socket);
        const remove: () => void = WsHub.addTemplate(wsApp);
        new TemplateSocket(wsApp);
        socket.on('close', (): void => { remove(); });
    });

    return app;
}

export default class HttpServer {
    public constructor() {
        void this.bootstrap();
    }

    private async bootstrap(): Promise<void> {
        const app = await createApp();

        await app.listen({port: AppConfig.__SERVER_PORT, host: '0.0.0.0'});
        const banner = `\x1b[34m  _                           ____          _              __     __ _                     _  _             _    _               
 | | _ __ ___    ___         |  _ \\   __ _ | |_  __ _      \\ \\   / /(_) ___  _   _   __ _ | |(_) ____ __ _ | |_ (_)  ___   _ __  
 | || '_ \` _ \\  / _ \\  _____ | | | | / _\` || __|/ _\` | _____\\ \\ / / | |/ __|| | | | / _\` || || ||_  // _\` || __|| | / _ \\ | '_ \\ 
 | || | | | | || (_) ||_____|| |_| || (_| || |_| (_| ||_____|\\ V /  | |\\__ \\| |_| || (_| || || | / /| (_| || |_ | || (_) || | | |
 |_||_| |_| |_| \\___/        |____/  \\__,_| \\__|\\__,_|        \\_/   |_||___/ \\__,_| \\__,_||_||_|/___|\\__,_| \\__||_| \\___/ |_| |_|\x1b[0m`;
        console.info(banner);
        console.info(`\n Fastify API running on port \x1b[32m ${AppConfig.__SERVER_PORT} \x1b[0m \n`);
    }
}
