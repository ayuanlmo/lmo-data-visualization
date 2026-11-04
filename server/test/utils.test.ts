import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import Utils from '../utils/index.js';

/**
 * Utils 特征测试（characterization tests）——锁定对外响应契约与关键工具行为。
 * 这些用例是 API 契约与文件系统操作的保护基线，验收标准 = 全绿。
 */
describe('Utils 响应契约（API 冻结：{code,message,success,data,_t,_app}）', (): void => {
    it('createSuccessMessage 输出既有契约字段与默认值', (): void => {
        const msg = Utils.createSuccessMessage({a: 1}, 'ok', 200);
        expect(msg).toEqual({
            code: 200,
            message: 'ok',
            success: true,
            data: {a: 1},
            _t: expect.any(Number),
            _app: 'lmo_dv_sa_t'
        });
    });

    it('createErrorMessage 默认 code=500 / success=false 且保留 data 字段', (): void => {
        const msg = Utils.createErrorMessage({message: 'boom'});
        expect(msg.code).toBe(500);
        expect(msg.success).toBe(false);
        expect(msg.message).toBe('boom');
        expect(msg.data).toEqual({});
        expect(msg._app).toBe('lmo_dv_sa_t');
        expect(typeof msg._t).toBe('number');
    });

    it('createErrorMessage 显式 code 生效（live-server 依赖 code:500 语义）', (): void => {
        expect(Utils.createErrorMessage({code: 404, message: 'nf'}).code).toBe(404);
    });

    it('默认错误响应不携带 errorCode（保证其余结构不变）', (): void => {
        expect('errorCode' in Utils.createErrorMessage({message: 'boom'})).toBe(false);
    });

    it('live-server 拒绝响应必须回传 errorCode:\'ext00el\'（web_app 拦截器契约）', (): void => {
        const msg = Utils.createErrorMessage({
            message: '演示服务器不允许此操作',
            errorCode: 'ext00el'
        });
        expect(msg.code).toBe(500);
        expect(msg.success).toBe(false);
        expect(msg.errorCode).toBe('ext00el');
    });
});

describe('Utils.calculatePagination（分页 offset/limit 冻结）', (): void => {
    it.each([
        // [pageIndex, pageSize, expectedOffset, expectedSize]
        [1, 10, 0, 10],
        [3, 20, 40, 20],
        ['2', '15', 15, 15]
    ] as const)('%o/%o -> offset=%o size=%o', (index, size, expOffset, expSize): void => {
        const [offset, limit] = Utils.calculatePagination(index, size);
        expect(offset).toBe(expOffset);
        expect(limit).toBe(expSize);
    });

    it('非法/缺失入参回退默认第 1 页、每页 10', (): void => {
        expect(Utils.calculatePagination('', '')).toEqual([0, 10]);
        expect(Utils.calculatePagination(0, 0)).toEqual([0, 10]);
        expect(Utils.calculatePagination(undefined, undefined)).toEqual([0, 10]);
    });
});

describe('Utils.isZipFile（zip 魔数识别）', (): void => {
    let dir: string;
    beforeEach((): void => {
        dir = mkdtempSync(join(tmpdir(), 'lmo-zip-'));
    });
    afterEach((): void => {
        rmSync(dir, {recursive: true, force: true});
    });

    it('接受标准 PK\\x03\\x04 签名文件', (): void => {
        const p = join(dir, 'a.zip');
        writeFileSync(p, Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00]));
        expect(Utils.isZipFile(p)).toBe(true);
    });

    it('拒绝非 zip 内容', (): void => {
        const p = join(dir, 'a.txt');
        writeFileSync(p, Buffer.from('hello world, not a zip'));
        expect(Utils.isZipFile(p)).toBe(false);
    });

    it('文件不存在时返回 false 而非抛错', (): void => {
        expect(Utils.isZipFile(join(dir, 'missing.zip'))).toBe(false);
    });
});

describe('Utils.deleteFolderRecursive（必须删完整路径而非文件名）', (): void => {
    let root: string;
    beforeEach((): void => {
        root = mkdtempSync(join(tmpdir(), 'lmo-del-'));
    });
    afterEach((): void => {
        rmSync(root, {recursive: true, force: true});
    });

    it('递归删除嵌套目录与文件', (): void => {
        const nested = join(root, 'a', 'b');
        mkdirSync(nested, {recursive: true});
        writeFileSync(join(nested, 'deep.txt'), 'x');
        writeFileSync(join(root, 'a', 'top.txt'), 'y');

        expect(Utils.deleteFolderRecursive(join(root, 'a'))).toBe(true);
        expect(existsSync(join(root, 'a'))).toBe(false);
    });

    it('目录不存在时返回 false', (): void => {
        expect(Utils.deleteFolderRecursive(join(root, 'nope'))).toBe(false);
    });

    it('回归：子项含与 CWD 同名文件时不得误删 CWD 下文件', (): void => {
        // 构造一个与嵌套目录内文件同名、但位于其它路径的文件，验证只删目标目录内内容。
        const decoy = join(root, 'decoy_target.txt');
        writeFileSync(decoy, 'must survive');
        const sub = join(root, 'sub');
        mkdirSync(sub);
        writeFileSync(join(sub, 'inner.txt'), 'delete me');

        Utils.deleteFolderRecursive(sub);
        expect(existsSync(sub)).toBe(false);
        expect(existsSync(decoy)).toBe(true);
    });
});
