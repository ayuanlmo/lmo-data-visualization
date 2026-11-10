import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {existsSync, mkdtempSync, readdirSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {crc32} from 'node:zlib';
import AdmZip from 'adm-zip';

/**
 * POST /api/uploadTemplate 的链路回归（fastify.inject，不占端口）。
 *
 * 冻结的契约：
 *  1. 平铺 zip（必备 6 文件 + assets/ 子目录）→ 注册成功，type 强制 0，assets 完整落盘，中转 zip 清理；
 *  2. 单根目录 zip（右键文件夹→压缩的常见形态）→ 拍平后照常注册；
 *  3. 缺 config.json 的 zip → TEMPLATE_READ_FAILED（code 500），不留半截模板目录；
 *  4. zip-slip（条目名含 ../）→ 整包拒绝，不得写出解压目标之外的文件。
 *
 * 隔离方式与 contract.smoke.test.ts 一致：DATA_DIR 指向 mkdtemp，不读写仓库 server/_data。
 */

let app: any;
let DB: any;
let TemplateModel: any;
let tmp: string;
let templatesDir: string;
let uploadsDir: string;

const REQUIRED: Record<string, string> = {
    'conf.js': 'export default {};',
    'data.json': '[["a","1"]]',
    'cover.png': 'PNG-STUB',
    'cover.gif': 'GIF-STUB',
    'config.json': JSON.stringify({name: '上传模板', description: '来自 zip', type: 1}),
    'index.js': '// entry'
};

const makeZip = (files: Record<string, string | Buffer>): Buffer => {
    const zip = new AdmZip();
    for (const [name, content] of Object.entries(files)) zip.addFile(name, Buffer.from(content));
    return zip.toBuffer();
};

/**
 * 极简 STORED（不压缩）ZIP 构造器：AdmZip.addFile 会把 `../` 净化掉，无法产出真正的
 * 路径穿越包，故手写 ZIP 字节以保留原始条目名，验证服务端 zip-slip 防线确实生效。
 * 读取侧 AdmZip 会原样保留这些名字（已核实），因此这正是攻击者用其他工具打出的形态。
 */
const makeRawZip = (files: Array<[string, string]>): Buffer => {
    const chunks: Buffer[] = [];
    const central: Buffer[] = [];
    let offset = 0;

    for (const [name, dataStr] of files) {
        const nameBuf = Buffer.from(name, 'utf8');
        const data = Buffer.from(dataStr, 'utf8');
        const crc = crc32(data);

        const local = Buffer.alloc(30);
        local.writeUInt32LE(0x04034b50, 0);
        local.writeUInt16LE(20, 4);
        local.writeUInt16LE(0x21, 12);
        local.writeUInt32LE(crc, 14);
        local.writeUInt32LE(data.length, 18);
        local.writeUInt32LE(data.length, 22);
        local.writeUInt16LE(nameBuf.length, 26);
        chunks.push(local, nameBuf, data);

        const cd = Buffer.alloc(46);
        cd.writeUInt32LE(0x02014b50, 0);
        cd.writeUInt16LE(20, 4);
        cd.writeUInt16LE(20, 6);
        cd.writeUInt16LE(0x21, 14);
        cd.writeUInt32LE(crc, 16);
        cd.writeUInt32LE(data.length, 20);
        cd.writeUInt32LE(data.length, 24);
        cd.writeUInt16LE(nameBuf.length, 28);
        cd.writeUInt32LE(offset, 42);
        central.push(Buffer.concat([cd, nameBuf]));

        offset += local.length + nameBuf.length + data.length;
    }

    const cdBuf = Buffer.concat(central);
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(files.length, 8);
    eocd.writeUInt16LE(files.length, 10);
    eocd.writeUInt32LE(cdBuf.length, 12);
    eocd.writeUInt32LE(offset, 16);

    return Buffer.concat([...chunks, cdBuf, eocd]);
};

const injectUpload = (zip: Buffer, filename: string = 'tpl.zip'): Promise<any> => {
    const boundary = '----lmoUploadTestBoundary';
    const payload = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: application/zip\r\n\r\n`),
        zip,
        Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);
    return app.inject({
        method: 'POST',
        url: '/api/uploadTemplate',
        headers: {'content-type': `multipart/form-data; boundary=${boundary}`},
        payload
    });
};

const templateDirs = (): string[] => existsSync(templatesDir) ? readdirSync(templatesDir) : [];

beforeAll(async (): Promise<void> => {
    tmp = mkdtempSync(join(tmpdir(), 'lmo-upl-'));
    process.env.DATA_BASE_TYPE = 'sqlite';
    process.env.DATA_DIR = tmp;
    process.env.NODE_ENV = 'development';
    process.env.APP_LOG_LEVEL = 'fatal';
    process.env.SERVER_HOST = 'localhost';

    await import('../lib/CheckDirectory.js');
    const models = await import('../repository/models.js');
    DB = models.DB;
    TemplateModel = models.TemplateModel;
    await DB.sync();

    templatesDir = resolve(tmp, 'static', 'public', 'templates');
    uploadsDir = resolve(tmp, 'static', 'public', 'uploads');

    const {createApp} = await import('../bin/HttpServer.js');
    app = await createApp();
    await app.ready();
});

afterAll(async (): Promise<void> => {
    await app?.close();
    await DB?.close();
    rmSync(tmp, {recursive: true, force: true});
});

describe('POST /api/uploadTemplate', (): void => {
    it('平铺 zip（含 assets/ 子目录）→ 注册成功且 type 强制为 0，中转 zip 被清理', async (): Promise<void> => {
        const res = await injectUpload(makeZip({
            ...REQUIRED,
            'assets/img/frame.svg': '<svg>FRAME</svg>'
        }));

        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.code).toBe(200);
        // config.json 里写 type:1 也不得产生「内置模板」行（不可编辑/删除）
        expect(body.data.type).toBe(0);
        expect(body.data.path).toMatch(/^\/static\/templates\/[\da-f-]{36}\/$/);

        const rows = await TemplateModel.findAll();
        expect(rows.length).toBe(1);

        const uuidFolder = body.data.path.replace('/static/templates/', '').replace(/\/$/, '');
        const onDisk = resolve(templatesDir, uuidFolder);
        expect(existsSync(join(onDisk, 'conf.js'))).toBe(true);
        expect(existsSync(join(onDisk, 'assets', 'img', 'frame.svg'))).toBe(true);
        // 中转 zip 不残留
        expect(readdirSync(uploadsDir).filter((f: string): boolean => f.endsWith('.zip')).length).toBe(0);
    });

    it('单根目录 zip（folder/conf.js…）拍平后照常注册', async (): Promise<void> => {
        const prefixed: Record<string, string> = {};
        for (const [name, content] of Object.entries(REQUIRED)) prefixed[`my-template/${name}`] = content;

        const res = await injectUpload(makeZip(prefixed));
        const body = res.json();
        expect(body.code).toBe(200);

        const uuidFolder = body.data.path.replace('/static/templates/', '').replace(/\/$/, '');
        const onDisk = resolve(templatesDir, uuidFolder);
        expect(existsSync(join(onDisk, 'config.json'))).toBe(true);
        // 拍平后不得残留内层目录
        expect(existsSync(join(onDisk, 'my-template'))).toBe(false);
        expect(await TemplateModel.count()).toBe(2);
    });

    it('缺 config.json → code500（TEMPLATE_READ_FAILED），不留半截模板目录', async (): Promise<void> => {
        const files = {...REQUIRED} as Record<string, string>;
        delete files['config.json'];
        const dirsBefore = templateDirs().length;

        const res = await injectUpload(makeZip(files));
        expect(res.json().code).toBe(500);
        expect(await TemplateModel.count()).toBe(2);
        expect(templateDirs().length).toBe(dirsBefore);
    });

    it('zip-slip：条目名含 ../ → 整包拒绝，不写出模板目录之外的文件', async (): Promise<void> => {
        // 必备文件齐全，唯一的拒绝理由只能是路径穿越防线（否则会与「缺文件」出口混淆）
        const malicious: Array<[string, string]> = [
            ...Object.entries(REQUIRED).map(([k, v]): [string, string] => [k, v as string]),
            ['../evil.txt', 'PWNED'],
            ['assets/../../evil2.txt', 'PWNED2']
        ];

        const res = await injectUpload(makeRawZip(malicious));
        expect(res.json().code).toBe(500);
        expect(existsSync(resolve(tmp, 'static', 'public', 'evil.txt'))).toBe(false);
        expect(existsSync(resolve(tmp, 'evil.txt'))).toBe(false);
        expect(existsSync(resolve(tmp, 'evil2.txt'))).toBe(false);
        expect(existsSync(resolve(templatesDir, 'evil.txt'))).toBe(false);
        expect(await TemplateModel.count()).toBe(2);
    });
});
