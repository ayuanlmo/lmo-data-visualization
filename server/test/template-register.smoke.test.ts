import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';

/**
 * 内置模板增量注册（bin/dataBase/init.ts）的回归冒烟。
 *
 * 覆盖旧实现的核心缺陷：只在 Template 表为空时扫描一次，导致升级新增的内置模板
 * 在已部署库里永远不可见。现行为契约：
 *  1. 每次启动/refresh 都增量扫描，按 id/path 判重，不产生重复行；
 *  2. .initialized.t.bin 缓存已注册项的主键 —— DB 行被删后重扫仍复用同一 id；
 *  3. 缺 config.json 等必备文件的目录（如合成产生的 UUID 目录）被自然跳过；
 *  4. 单个坏目录不终止其余模板的注册。
 *
 * 隔离方式与 contract.smoke.test.ts 一致：DATA_DIR 指向 mkdtemp，不读写仓库 server/_data。
 */

let DB: any;
let TemplateModel: any;
let ColorModel: any;
let initDefaultData: () => Promise<void>;
let tmp: string;
let templatesDir: string;

const REQUIRED_FILES: string[] = ['conf.js', 'data.json', 'cover.png', 'cover.gif', 'config.json', 'index.js'];

const mkTemplate = (name: string, opts?: { skipFiles?: string[]; withFlag?: boolean }): string => {
    const dir: string = resolve(templatesDir, name);
    mkdirSync(dir, {recursive: true});

    const skip = new Set(opts?.skipFiles ?? []);
    for (const f of REQUIRED_FILES) {
        if (skip.has(f)) continue;
        writeFileSync(join(dir, f), f === 'config.json'
            ? JSON.stringify({name: `名称-${name}`, description: `描述-${name}`, type: 1})
            : `${f}-content`);
    }
    return dir;
};

beforeAll(async (): Promise<void> => {
    tmp = mkdtempSync(join(tmpdir(), 'lmo-reg-'));
    process.env.DATA_BASE_TYPE = 'sqlite';
    process.env.DATA_DIR = tmp;
    process.env.NODE_ENV = 'development';
    process.env.APP_LOG_LEVEL = 'fatal';
    process.env.SERVER_HOST = 'localhost';

    await import('../lib/CheckDirectory.js');
    const models = await import('../repository/models.js');
    DB = models.DB;
    TemplateModel = models.TemplateModel;
    ColorModel = models.ColorModel;

    await DB.sync();
    templatesDir = resolve(tmp, 'static', 'public', 'templates');

    // init.js 经 barrel 导入同一批模型实例（./index.js → repository/models.js）
    initDefaultData = (await import('../bin/dataBase/init.js')).default;
});

afterAll(async (): Promise<void> => {
    await DB?.close();
    rmSync(tmp, {recursive: true, force: true});
});

describe('内置模板增量注册 initDefaultData', (): void => {
    it('首次扫描：文件齐全的模板被注册，且回写 .initialized.t.bin（id 与库一致）', async (): Promise<void> => {
        const dir = mkTemplate('tpl-alpha');
        await initDefaultData();

        const rows = await TemplateModel.findAll();
        expect(rows.length).toBe(1);
        expect(rows[0].name).toBe('名称-tpl-alpha');
        expect(rows[0].path).toBe('/static/templates/tpl-alpha/');
        expect(rows[0].cover).toBe('/static/templates/tpl-alpha/cover.png');

        const flagPath = join(dir, '.initialized.t.bin');
        expect(existsSync(flagPath)).toBe(true);
        const cached = JSON.parse(readFileSync(flagPath, 'utf-8'));
        expect(cached.id).toBe(rows[0].id);

        // 颜色默认数据同轮播种
        expect(await ColorModel.count()).toBeGreaterThan(0);
    });

    it('重复调用幂等：不产生重复行', async (): Promise<void> => {
        await initDefaultData();
        await initDefaultData();
        expect(await TemplateModel.count()).toBe(1);
    });

    it('增量注册：升级新增的模板目录在库非空时也能被发现，旧行 id 不变', async (): Promise<void> => {
        const oldRow = (await TemplateModel.findAll())[0];
        mkTemplate('tpl-beta');
        await initDefaultData();

        const rows = await TemplateModel.findAll({order: [['name', 'ASC']]});
        expect(rows.length).toBe(2);
        expect(rows.map((r: any) => r.name)).toEqual(['名称-tpl-alpha', '名称-tpl-beta']);
        expect(rows.find((r: any) => r.name === '名称-tpl-alpha').id).toBe(oldRow.id);
    });

    it('缺 config.json 的目录（合成 UUID 产物形态）被跳过，不产生半截行', async (): Promise<void> => {
        mkTemplate('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', {skipFiles: ['config.json']});
        await initDefaultData();
        expect(await TemplateModel.count()).toBe(2);
    });

    it('坏目录不阻断其余模板：config.json 内容非法时只跳过它，同轮新模板照常注册', async (): Promise<void> => {
        const badDir = mkTemplate('tpl-broken');
        writeFileSync(join(badDir, 'config.json'), '{ not-json');
        mkTemplate('tpl-gamma');

        await initDefaultData();

        const names = (await TemplateModel.findAll()).map((r: any) => r.name);
        expect(names).toContain('名称-tpl-gamma');
        expect(names).not.toContain('名称-tpl-broken');
        expect(await TemplateModel.count()).toBe(3);
    });

    it('标记文件保住主键稳定：删库行后重扫，复用 .initialized.t.bin 里的同一 id', async (): Promise<void> => {
        const before = (await TemplateModel.findOne({where: {name: '名称-tpl-alpha'}})).id;
        await TemplateModel.destroy({where: {name: '名称-tpl-alpha'}});

        await initDefaultData();

        const after = await TemplateModel.findOne({where: {name: '名称-tpl-alpha'}});
        expect(after).not.toBeNull();
        expect(after.id).toBe(before);
        expect(await TemplateModel.count()).toBe(3);
    });
});
