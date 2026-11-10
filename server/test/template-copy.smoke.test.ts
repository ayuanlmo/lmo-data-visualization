import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

/**
 * 模板嵌套资源（assets/ 子目录）递归拷贝回归。
 *
 * 历史缺陷：copyTemplate 与 TaskService.prepareTemplateFiles 都用 readdirSync+copyFileSync
 * 逐个拷贝顶层条目，遇到子目录（assets/）时 copyFileSync 抛 EISDIR，导致任何带资源的模板
 * 既不能被设计器复制、也不能进入合成。已改为 fs.cpSync(recursive) + filter 排除待重生成文件。
 *
 * 隔离方式与 template-preview.smoke.test.ts 一致：DATA_DIR 指向 mkdtemp，不读写仓库 server/_data。
 */

let tmp: string;
let publicRoot: string;
let DB: any;

beforeAll(async (): Promise<void> => {
    tmp = mkdtempSync(join(tmpdir(), 'lmo-copy-'));
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
});

afterAll(async (): Promise<void> => {
    await DB?.close();
    rmSync(tmp, {recursive: true, force: true});
});

/** 建一个带 assets/img + assets/data 嵌套资源的源模板目录。 */
const makeSourceTemplate = (dir: string): void => {
    mkdirSync(join(dir, 'assets', 'img'), {recursive: true});
    mkdirSync(join(dir, 'assets', 'data'), {recursive: true});
    writeFileSync(join(dir, 'index.html'), '<html>SRC_ENTRY</html>');
    writeFileSync(join(dir, 'index.js'), '// entry\n');
    writeFileSync(join(dir, 'conf.js'), 'export default {STALE:true};');
    writeFileSync(join(dir, 'data.json'), '[["stale","0"]]');
    writeFileSync(join(dir, 'config.json'), '{"name":"src","type":1}');
    writeFileSync(join(dir, 'assets', 'img', 'frame.svg'), '<svg>FRAME</svg>');
    writeFileSync(join(dir, 'assets', 'data', 'notes.json'), '{"a":"note-a"}');
};

describe('TaskService.prepareTemplateFiles：合成准备的递归拷贝', (): void => {
    it('带 assets/ 子目录不再抛 EISDIR，嵌套资源完整落盘且待重生成文件按配置重写', async (): Promise<void> => {
        const {default: TaskService} = await import('../bin/synthesis/TaskService.js');

        const originalTemplate = join(tmp, 'prep-src');
        const dirPath = join(tmp, 'prep-task');
        makeSourceTemplate(originalTemplate);
        mkdirSync(dirPath, {recursive: true});

        const ctx = {
            originalTemplate,
            dirPath,
            dbId: 'db-id-1',
            input: {
                id: 'tpl-id-1',
                currentTemplateConfig: {
                    data: [['label', '42']],
                    config: {video: {duration: 5000}}
                }
            }
        } as any;

        // 核心断言：这一步过去会在 assets/ 上抛 EISDIR
        expect(() => TaskService.prepareTemplateFiles(ctx)).not.toThrow();

        // 嵌套资源递归拷贝到位
        expect(readFileSync(join(dirPath, 'assets', 'img', 'frame.svg'), 'utf-8')).toBe('<svg>FRAME</svg>');
        expect(readFileSync(join(dirPath, 'assets', 'data', 'notes.json'), 'utf-8')).toBe('{"a":"note-a"}');
        // 入口与脚本被拷贝
        expect(existsSync(join(dirPath, 'index.js'))).toBe(true);
        expect(existsSync(join(dirPath, 'index.html'))).toBe(true);
        // conf.js 按当前配置重写（不再是源里的 STALE），并带上 id/template
        const confJs = readFileSync(join(dirPath, 'conf.js'), 'utf-8');
        expect(confJs).toContain('db-id-1');
        expect(confJs).toContain('tpl-id-1');
        expect(confJs).not.toContain('STALE');
        // data.json 重写为下发数据
        expect(readFileSync(join(dirPath, 'data.json'), 'utf-8')).toContain('42');
        // config.json 属 regeneratedFiles，不从源模板拷贝
        expect(existsSync(join(dirPath, 'config.json'))).toBe(false);
    });
});

describe('TemplateController.copyTemplate：设计器复制的递归拷贝', (): void => {
    it('复制带 assets/ 的模板时子目录完整拷贝，并落库为自定义模板（type=0）', async (): Promise<void> => {
        const {default: TemplateController} = await import('../bin/controllers/Template.js');
        const {TemplateModel} = await import('../repository/models.js');

        const srcId = 'src-copy-1';
        const srcDir = join(publicRoot, 'templates', 'src-assets');
        makeSourceTemplate(srcDir);

        await TemplateModel.create({
            id: srcId,
            name: '源模板',
            description: '带 assets',
            path: '/static/templates/src-assets/index.html',
            cover: '/static/templates/src-assets/cover.png',
            gifCover: '/static/templates/src-assets/cover.gif',
            createTime: '0',
            type: 1
        } as any);

        const reply = {code: () => ({send: () => undefined})} as any;
        await TemplateController.copyTemplate({body: {id: srcId}} as any, reply);

        // 找到新建的副本行（type=0），据其 path 定位副本目录
        const copies = await TemplateModel.findAll({where: {type: 0}});
        expect(copies.length).toBe(1);
        const copyPath: string = (copies[0] as any).dataValues.path as string;
        const copyDir = join(publicRoot, copyPath.replace('/static', '').replace('/index.html', ''));

        // 嵌套资源被递归拷贝（EISDIR 回归点）
        expect(readFileSync(join(copyDir, 'assets', 'img', 'frame.svg'), 'utf-8')).toBe('<svg>FRAME</svg>');
        expect(readFileSync(join(copyDir, 'assets', 'data', 'notes.json'), 'utf-8')).toBe('{"a":"note-a"}');
        expect(existsSync(join(copyDir, 'index.js'))).toBe(true);
        // config.json 被忽略（不随复制携带，副本信息由 DB 承载）
        expect(existsSync(join(copyDir, 'config.json'))).toBe(false);
    });
});
