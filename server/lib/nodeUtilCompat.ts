/**
 * Node util 兼容性补丁。
 *
 * 第三方合成库（web-video-creator@0.0.34）仍调用 Node 早期版本 `util` 上已被移除的
 * 遗留类型判定函数（DEP0048 系列：isString/isNumber/... 及 isURL/isLinux 等），
 * 这些函数在 `util` 命名空间上已不存在，一旦调用即抛 "xxx is not a function" 导致合成崩溃。
 * 这里在进程最早期补齐（仅在缺失时定义），语义与旧版 Node 一致，使其可在 Node 24 上运行。
 *
 * 必须在任何业务模块（尤其 synthesis/wvc）加载前执行，故 main.ts 首位导入。
 */
import util from "node:util";
import OS from "node:os";

type LegacyUtil = Record<string, ((...args: any[]) => any) | undefined>;

const legacy: LegacyUtil = util as unknown as LegacyUtil;

const defineIfMissing = (name: string, fn: (...args: any[]) => any): void => {
    if (typeof legacy[name] !== 'function') {
        try {
            Object.defineProperty(util, name, {value: fn, writable: true, configurable: true, enumerable: true});
        } catch (e) {
            /* 若命名空间被冻结则忽略：后续合成调用会走各自的 try/catch 隔离 */
        }
    }
};

defineIfMissing('isString', (arg: unknown): boolean => typeof arg === 'string');
defineIfMissing('isNumber', (arg: unknown): boolean => typeof arg === 'number' && !Number.isNaN(arg));
defineIfMissing('isBoolean', (arg: unknown): boolean => typeof arg === 'boolean');
defineIfMissing('isFunction', (arg: unknown): boolean => typeof arg === 'function');
defineIfMissing('isNull', (arg: unknown): boolean => arg === null);
defineIfMissing('isUndefined', (arg: unknown): boolean => arg === undefined);
defineIfMissing('isNullOrUndefined', (arg: unknown): boolean => arg === null || arg === undefined);
defineIfMissing('isObject', (arg: unknown): boolean => arg !== null && (typeof arg === 'object' || typeof arg === 'function'));
defineIfMissing('isArray', (arg: unknown): boolean => Array.isArray(arg));
defineIfMissing('isRegExp', (arg: unknown): boolean => arg instanceof RegExp);
defineIfMissing('isDate', (arg: unknown): boolean => arg instanceof Date);
defineIfMissing('isSymbol', (arg: unknown): boolean => typeof arg === 'symbol');
defineIfMissing('isError', (arg: unknown): boolean => arg instanceof Error);
defineIfMissing('isPrimitive', (arg: unknown): boolean =>
    arg === null || arg === undefined ||
    typeof arg === 'string' || typeof arg === 'number' ||
    typeof arg === 'bigint' || typeof arg === 'symbol' || typeof arg === 'boolean');
defineIfMissing('isBuffer', (arg: unknown): boolean => Buffer.isBuffer(arg));

// web-video-creator 还用到以下从未存在于公共 util API 的判定函数（历史第三方约定），一并补齐。
defineIfMissing('isURL', (arg: unknown): boolean => {
    if (typeof arg !== 'string') return false;

    try {
        const url: URL = new URL(arg);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
});
defineIfMissing('isLinux', (): boolean => OS.platform() === 'linux');
defineIfMissing('isWindows', (): boolean => OS.platform() === 'win32');
defineIfMissing('isMac', (): boolean => OS.platform() === 'darwin');
defineIfMissing('isIOS', (): boolean => false);

export {};
