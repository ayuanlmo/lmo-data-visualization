import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

/**
 * 集成冒烟：使用 `fastify.inject` 直接打装配后的应用（createApp），不占端口、不连真实生产库。
 * 隔离靠单一开关 `DATA_DIR`：把整个运行时数据根（db / static / log）指到 mkdtemp 临时目录，
 * 因此不读写仓库 `server/_data`；AppConfig/env 在动态 import 前设置。
 * 覆盖：冻结响应契约、AppError→响应契约映射、404、DB 读取、multipart 上传端到端 + 查重。
 */

let app: any;
let DB: any;
let TemplateModel: any;
let UpLoadFilesModel: any;
let tmp: string;

// 临时数据根下的子目录（与生产布局一致，仅根不同）
let uploadsDir: string;
let templatesDir: string;

/**
 * 仓库里真实数据库的位置。它在测试前后必须保持同一存在性：这是「测试不碰仓库 _data」的可证伪断言。
 * 历史版本在本文件末尾写过 `rmSync(join(process.cwd(), '_data'), {recursive: true, force: true})`——
 * 从仓库根跑是空操作，从 server/ 目录跑就会递归删掉真实库、上传件与自建模板。
 */
const REAL_DB_FILE: string = fileURLToPath(new URL('../_data/db/dv_data.db', import.meta.url));
let realDbExistedBefore: boolean = false;

beforeAll(async (): Promise<void> => {
    tmp = mkdtempSync(join(tmpdir(), 'lmo-int-'));
    realDbExistedBefore = existsSync(REAL_DB_FILE);
    uploadsDir = join(tmp, 'static', 'public', 'uploads');
    templatesDir = join(tmp, 'static', 'public', 'templates');

    // 必须在动态 import（models/AppConfig 在 import 期读 env）之前设置
    process.env.DATA_BASE_TYPE = 'sqlite';
    // 单一注入点：库文件路径由 dataPath('db', 'dv_data.db') 从数据根派生，无需再单独指定存储位置
    process.env.DATA_DIR = tmp;
    process.env.NODE_ENV = 'development';
    process.env.APP_LOG_LEVEL = 'fatal';
    process.env.SERVER_HOST = 'localhost';
    // 把非 multipart 请求体上限压低到 1MB，便于用可控体积验证超限出口（避免测例真发几 MB）
    process.env.REQUEST_BODY_LIMIT_MB = '1';

    // 与生产启动同路径地建好目录骨架（其内部定时器已 unref，不会撑住测试进程）
    await import('../lib/CheckDirectory.js');

    const models = await import('../repository/models.js');
    DB = models.DB;
    TemplateModel = models.TemplateModel;
    UpLoadFilesModel = models.UpLoadFilesModel;

    await DB.sync();
    // 证伪点：库确实开在临时数据根下——DATA_DIR 未生效则此断言必挂
    expect(existsSync(join(tmp, 'db', 'dv_data.db'))).toBe(true);

    const { createApp } = await import('../bin/HttpServer.js');
    app = await createApp();
    await app.ready();
});

afterAll(async (): Promise<void> => {
    await app?.close();
    await DB?.close();
    rmSync(tmp, {recursive: true, force: true});
    // 真实库的存在性不得因本轮测试而改变（本地开发环境有库、全新 CI 无库，两种情况都成立）
    expect(existsSync(REAL_DB_FILE)).toBe(realDbExistedBefore);
});

const assertContract = (body: any, code: number): void => {
    expect(body.code).toBe(code);
    expect(typeof body.message).toBe('string');
    expect(typeof body.success).toBe('boolean');
    expect(typeof body._t).toBe('number');
    expect(body._app).toBe('lmo_dv_sa_t');
};

describe('集成契约 /api（fastify.inject）', (): void => {
    it('GET /api/serverInfo → code200 且 synthesisServicesConnectStatus 恒 true', async (): Promise<void> => {
        const res = await app.inject({method: 'GET', url: '/api/serverInfo'});
        expect(res.statusCode).toBe(200);
        const body = res.json();
        assertContract(body, 200);
        expect(body.success).toBe(true);
        expect(body.data.main.synthesisServicesConnectStatus).toBe(true);
    });

    it('GET /api/nonexistent → 404 处理器映射冻结契约（code404/message:"404"）', async (): Promise<void> => {
        const res = await app.inject({method: 'GET', url: '/api/__no_such_route__'});
        expect(res.statusCode).toBe(200); // 出口恒 HTTP 200，业务码在 body.code
        const body = res.json();
        assertContract(body, 404);
        expect(body.message).toBe('404');
        expect(body.success).toBe(false);
    });

    it('GET /api/template/:id（存在）→ code200 返回模板；不存在 → AppError TEMPLATE_NOT_FOUND 映射 code500', async (): Promise<void> => {
        const id = randomUUID();
        await TemplateModel.create({
            id,
            name: '集成测试模板',
            description: 'desc',
            path: '/static/templates/itest/index.html',
            cover: '/static/templates/itest/cover.png',
            gifCover: '/static/templates/itest/cover.gif',
            createTime: '1715749070217',
            type: 0
        });

        const found = await app.inject({method: 'GET', url: `/api/template/${id}`});
        expect(found.statusCode).toBe(200);
        const foundBody = found.json();
        assertContract(foundBody, 200);
        expect(foundBody.success).toBe(true);
        expect(foundBody.data.id).toBe(id);

        const missing = await app.inject({method: 'GET', url: '/api/template/does-not-exist-id'});
        expect(missing.statusCode).toBe(200);
        const missingBody = missing.json();
        // AppError(TEMPLATE_NOT_FOUND) → code500 + 翻译后的 errors.templateNotFound
        assertContract(missingBody, 500);
        expect(missingBody.success).toBe(false);
        expect(missingBody.message.length).toBeGreaterThan(0);
    });

    it('GET /api/template 分页读取 → code200 且 data.rows 为数组', async (): Promise<void> => {
        const res = await app.inject({method: 'GET', url: '/api/template?pageIndex=1&pageSize=10'});
        expect(res.statusCode).toBe(200);
        const body = res.json();
        assertContract(body, 200);
        expect(Array.isArray(body.data.rows)).toBe(true);
        expect(typeof body.data.total).toBe('number');
    });

    it('Zod 校验失败（PUT /api/template 缺 id）→ 出口映射冻结契约 code500', async (): Promise<void> => {
        const res = await app.inject({
            method: 'PUT',
            url: '/api/template',
            headers: {'content-type': 'application/json'},
            payload: JSON.stringify({})
        });
        expect(res.statusCode).toBe(200);
        const body = res.json();
        assertContract(body, 500);
        expect(body.success).toBe(false);
    });

    it('POST /api/uploadFile 端到端（image/png）→ code200 落库 + 返回 path；重复内容命中查重返回同 id', async (): Promise<void> => {
        // 最小合法 PNG（1x1）
        const png = Buffer.from(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC',
            'base64'
        );

        const buildMultipart = (): {payload: Buffer, headers: Record<string, string>} => {
            const boundary = '----lmoIntegrationBoundary';
            const head = Buffer.from(
                `--${boundary}\r\n` +
                'Content-Disposition: form-data; name="media"; filename="it.png"\r\n' +
                'Content-Type: image/png\r\n\r\n'
            );
            const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
            return {
                payload: Buffer.concat([head, png, tail]),
                headers: {'content-type': `multipart/form-data; boundary=${boundary}`}
            };
        };

        const first = buildMultipart();
        const res1 = await app.inject({method: 'POST', url: '/api/uploadFile', headers: first.headers, payload: first.payload});
        expect(res1.statusCode).toBe(200);
        const body1 = res1.json();
        assertContract(body1, 200);
        expect(body1.success).toBe(true);
        expect(typeof body1.data.path).toBe('string');
        expect(body1.data.id).toBeTruthy();

        // 落盘文件确实存在（位于临时数据根内：反向证明写入侧也受 DATA_DIR 管控）
        const storedName: string = body1.data.path.split('/').pop();
        expect(existsSync(join(uploadsDir, storedName))).toBe(true);

        // 相同内容二次上传 → hash 查重命中，返回同一条记录
        const second = buildMultipart();
        const res2 = await app.inject({method: 'POST', url: '/api/uploadFile', headers: second.headers, payload: second.payload});
        const body2 = res2.json();
        expect(body2.success).toBe(true);
        expect(body2.data.id).toBe(body1.data.id);

        // 清理落盘文件与记录
        await UpLoadFilesModel.destroy({where: {id: body1.data.id}});
        const p = join(uploadsDir, storedName);
        if (existsSync(p)) rmSync(p, {force: true});
    });

    it('POST /api/createTask 预览模式 → code200 冻结契约 + 相对路径', async (): Promise<void> => {
        const tplId = randomUUID();
        // 服务内部现在从数据根（本测例为临时目录）解析模板路径，不再依赖进程 CWD
        const srcAbs = join(templatesDir, 'ctest');
        rmSync(srcAbs, {recursive: true, force: true});
        mkdirSync(srcAbs, {recursive: true});
        writeFileSync(join(srcAbs, 'index.html'), '<html><body><!--__LMO_SERVER_AUDIO_RENDER_TAG--></body></html>');
        // previewTemplate 已由 CheckDirectory 在临时数据根下建好（与生产启动一致）

        await TemplateModel.create({
            id: tplId, name: 'ctest', description: 'd',
            path: '/static/templates/ctest/index.html',
            cover: '', gifCover: '', createTime: '1715749070217', type: 0
        });

        const res = await app.inject({
            method: 'POST', url: '/api/createTask',
            headers: {'content-type': 'application/json'},
            payload: JSON.stringify({id: tplId, preview: true, currentTemplateConfig: {data: [], config: {}}})
        });
        expect(res.statusCode).toBe(200);
        const body = res.json();
        assertContract(body, 200);
        expect(body.success).toBe(true);
        expect(body.data.id).toBeTruthy();
        expect(body.data.path).toContain('__type=h');

        // 清理记录；产物均落在临时数据根里，由 afterAll 统一删除（不删任何仓库内目录）
        await TemplateModel.destroy({where: {id: tplId}});
    });

    it('POST /api/createTask 源模板不存在 → AppError FILE_NOT_FOUND 映射冻结契约 code500', async (): Promise<void> => {
        const res = await app.inject({
            method: 'POST', url: '/api/createTask',
            headers: {'content-type': 'application/json'},
            payload: JSON.stringify({id: 'no-such-template-id', currentTemplateConfig: {data: []}})
        });
        expect(res.statusCode).toBe(200);
        const body = res.json();
        assertContract(body, 500);
        expect(body.success).toBe(false);
    });

    it('POST /api/createTask 请求体超 bodyLimit → 映射为可读提示（code500）而非笼统「服务器错误」', async (): Promise<void> => {
        // 构造 >1MB 的 JSON，触发 FST_ERR_CTP_BODY_TOO_LARGE（本文件已将上限压到 1MB）
        const payload: string = JSON.stringify({
            id: 'no-such-template-id',
            currentTemplateConfig: {data: Array.from({length: 60000}, (_v, i): object => ({i, name: 'row-xxxxx'}))}
        });
        expect(payload.length).toBeGreaterThan(1024 * 1024);

        const res = await app.inject({
            method: 'POST', url: '/api/createTask',
            headers: {'content-type': 'application/json'},
            payload
        });
        expect(res.statusCode).toBe(200);
        const body = res.json();
        assertContract(body, 500);
        expect(body.success).toBe(false);
        // 默认 zh-CN：「请求体过大，最大允许 1MB」；用 MB 断言以免销定具体文案
        expect(body.message).toContain('MB');
    });
});
