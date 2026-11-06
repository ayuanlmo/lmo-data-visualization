import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * 模板目录 URL 的回归冒烟（HTTP 层，不占端口）。
 *
 * 覆盖两类历史缺陷：
 *  1. 带尾斜杠的模板目录根 404。DB 对「没有入口文件的模板」存的 path 就是 `<目录>/<id>/`，
 *     设计页（web_app Preview.tsx）把它原样拼进 iframe；find-my-way 默认不忽略尾斜杠，
 *     这类 URL 原先只被 @fastify/static 的 `/static/*` 接住并在找不到 index.html 或者index.htm时 出现404，
 *     导致内置引擎模板（base-bar-chart / base-single-line-chart / base-step-line-chart）打不开。
 *  2. 预览模式 URL 拼出双斜杠（`<id>//?__type=h`），任何路由都接不住。
 *
 * 隔离方式与 contract.smoke.test.ts 一致：DATA_DIR 指向 mkdtemp，不读写仓库 server/_data。
 */

let app: any;
let DB: any;
let tmp: string;
let publicRoot: string;

const ENGINE_MARKER: string = 'TEMPLATE_ENGINE';

const mkTpl = (kind: string, id: string, files: Record<string, string>): void => {
    const dir: string = join(publicRoot, kind, id);
    mkdirSync(dir, {recursive: true});
    for (const [name, content] of Object.entries(files)) writeFileSync(join(dir, name), content);
};

beforeAll(async (): Promise<void> => {
    tmp = mkdtempSync(join(tmpdir(), 'lmo-prev-'));
    process.env.DATA_BASE_TYPE = 'sqlite';
    process.env.DATA_DIR = tmp;
    process.env.NODE_ENV = 'development';
    process.env.APP_LOG_LEVEL = 'fatal';
    process.env.SERVER_HOST = 'localhost';

    await import('../lib/CheckDirectory.js');
    const models = await import('../repository/models.js');
    DB = models.DB;
    await DB.sync();

    publicRoot = join(tmp, 'static', 'public');
    // 引擎模板：只有 conf.js/index.js，没有入口 html —— 必须走 pug
    mkTpl('templates', 'engine-only', {'index.js': '// entry\n', 'config.json': '{}'});
    // HTML 模板：自带 index.html —— 目录根请求必须让位给真实文件，不能渲染成引擎壳
    mkTpl('templates', 'with-entry', {'index.html': '<html>REAL_ENTRY</html>'});
    mkTpl('previewTemplate', 'engine-only', {'index.js': '// entry\n'});
    mkTpl('previewTemplate', 'with-entry', {'index.html': '<html>REAL_PREVIEW_ENTRY</html>'});
    writeFileSync(join(publicRoot, 'styles', 'default.css'), 'BODY_CSS_SENTINEL{}');

    const { createApp } = await import('../bin/HttpServer.js');
    app = await createApp();
    await app.ready();
});

afterAll(async (): Promise<void> => {
    await app?.close();
    await DB?.close();
    rmSync(tmp, {recursive: true, force: true});
});

describe('模板目录 URL（/static/<kind>/<id>[/]）', (): void => {
    it('带尾斜杠且无入口文件 → 渲染内置引擎壳，而不是 404 封套', async (): Promise<void> => {
        const res = await app.inject({method: 'GET', url: '/static/templates/engine-only/'});
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toContain('text/html');
        expect(res.body).toContain(ENGINE_MARKER);
        expect(res.body).toContain('src="./index.js"');
    });

    it('无斜杠形式维持原行为（引擎壳）', async (): Promise<void> => {
        const res = await app.inject({method: 'GET', url: '/static/templates/engine-only'});
        expect(res.statusCode).toBe(200);
        expect(res.body).toContain(ENGINE_MARKER);
    });

    it('带尾斜杠但有 index.html → 让位给真实入口文件（HTML 模板不得被引擎壳覆盖）', async (): Promise<void> => {
        const dir = await app.inject({method: 'GET', url: '/static/templates/with-entry/'});
        expect(dir.statusCode).toBe(200);
        expect(dir.body).toContain('REAL_ENTRY');
        expect(dir.body).not.toContain(ENGINE_MARKER);

        const explicit = await app.inject({method: 'GET', url: '/static/templates/with-entry/index.html'});
        expect(explicit.body).toContain('REAL_ENTRY');
    });

    it('previewTemplate 目录同样可用（合成实时预览走这一层）', async (): Promise<void> => {
        const engine = await app.inject({method: 'GET', url: '/static/previewTemplate/engine-only/?__type=h'});
        expect(engine.body).toContain(ENGINE_MARKER);

        const real = await app.inject({method: 'GET', url: '/static/previewTemplate/with-entry/'});
        expect(real.body).toContain('REAL_PREVIEW_ENTRY');
    });

    it('查询串透传进引擎壳（__type=h 决定模板页是否进入合成模式）', async (): Promise<void> => {
        const res = await app.inject({method: 'GET', url: '/static/templates/engine-only/?__type=h&lang=zh'});
        expect(res.body).toContain('__type');
        expect(res.body).toContain('h');
    });

    it('目录内缺失的具体资源仍走 404 封套（修复不得吞掉真实缺文件）', async (): Promise<void> => {
        const res = await app.inject({method: 'GET', url: '/static/templates/engine-only/missing.js'});
        expect(res.statusCode).toBe(200); // 出口恒 HTTP 200，业务码在 body.code
        expect(res.json().code).toBe(404);
    });

    it('编码后的 ../ 不得越出静态根读到别处文件', async (): Promise<void> => {
        const res = await app.inject({method: 'GET', url: '/static/templates/..%2f..%2fstyles%2fdefault.css/'});
        expect(res.body).not.toContain('BODY_CSS_SENTINEL');
    });
});

describe('TaskService.getPreviewResponse 的 URL 形状', (): void => {
    it('无入口文件时输出单尾斜杠，不再出现 //', async (): Promise<void> => {
        // TaskService 是 default 导出（bin/TaskScheduler.ts、controllers/Task.ts 都这么引）
        const {default: TaskService} = await import('../bin/synthesis/TaskService.js');
        const missing: string = join(tmp, 'nope');
        const ctx = {
            templateStaticPath: '/static/previewTemplate/abc',
            htmlPath: `${missing}.html`,
            htmPath: `${missing}.htm`,
            templatePathName: 'abc'
        } as any;

        const path: string = TaskService.getPreviewResponse(ctx).path;
        expect(path).toBe('/static/previewTemplate/abc/?__type=h');
        expect(path).not.toContain('//?');

        // 该形状必须真的被路由接住，否则只是把一种 404 换成另一种
        const res = await app.inject({method: 'GET', url: path});
        expect(res.body).toContain(ENGINE_MARKER);
    });
});
