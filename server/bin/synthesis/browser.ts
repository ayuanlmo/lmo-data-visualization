/**
 * 合成用浏览器（Chrome for Testing）的定位、预置与自检。
 *
 * 为什么不复用 web-video-creator 自带的浏览器下载器：
 * 其依赖链 `@puppeteer/browsers@1.9.1 → extract-zip@2.0.1 → yauzl@2.10.0 → fd-slicer`（2020 年的
 * legacy stream 写法）在 Node 26 上会在解压大 entry 时读循环静默终止——Chrome 主程序被截断
 * （实测 119：落盘 230,143,680 / 应为 231,091,872 字节，138 个条目只解出 4 个文件），
 * 并且 `install()` 的 Promise 永不 settle。wvc 因此永远卡在 `init`，而 TaskScheduler 并发位为 1，
 * 首个任务把队列焊死：Resources 里有记录，却没有一个真正合成过。
 *
 * 本模块自己完成「下载 → 解包 → 补执行位 → 校验」，产物落在 wvc 认可的缓存目录布局上，
 * 运行时通过 `wvc.config({browserExecutablePath})` 直接指路，不再进入上述链路。
 */
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { access, chmod, mkdir, rename, rm, stat } from 'node:fs/promises';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { promisify } from 'node:util';
import AdmZip from 'adm-zip';
import { env } from '../../conf/env.js';
import { packagePath } from '../../lib/dataDir.js';

const execFileAsync = promisify(execFile);

/** chrome-for-testing 发布的平台标识（同时是下载 URL 与压缩包目录名的平台段）。 */
export type TChromePlatform = 'linux64' | 'mac-x64' | 'mac-arm64' | 'win32' | 'win64';

/** @puppeteer/browsers 缓存目录前缀（`<cacheDir>/chrome/<前缀>-<构建号>/`），保持同布局以便复用与排查。 */
const CACHE_DIR_PREFIX: Record<TChromePlatform, string> = {
    'linux64': 'linux',
    'mac-x64': 'mac',
    'mac-arm64': 'mac-arm',
    'win32': 'win32',
    'win64': 'win64'
};

/** 压缩包解出的顶层目录名。 */
const ARCHIVE_FOLDER: Record<TChromePlatform, string> = {
    'linux64': 'chrome-linux64',
    'mac-x64': 'chrome-mac-x64',
    'mac-arm64': 'chrome-mac-arm64',
    'win32': 'chrome-win32',
    'win64': 'chrome-win64'
};

/** 各平台可执行文件相对压缩包顶层目录的路径。 */
const EXECUTABLE_REL: Record<TChromePlatform, string[]> = {
    'linux64': ['chrome'],
    'win32': ['chrome.exe'],
    'win64': ['chrome.exe'],
    // macOS 为 .app bundle，可执行文件在 bundle 内部
    'mac-x64': ['Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'],
    'mac-arm64': ['Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing']
};

/**
 * 需要可执行位的伴生程序。
 * adm-zip 不保留压缩包里的权限位（实测解出为 0666），必须显式补齐，否则 spawn 直接 EACCES。
 */
const EXECUTABLE_FILES: string[] = ['chrome', 'chrome-wrapper', 'chrome_crashpad_handler', 'xdg-mime', 'xdg-settings'];

const CDN_BASE = 'https://storage.googleapis.com/chrome-for-testing-public';
/** 压缩包大小下限（早筛）：真正的完整性判据是 EOCD 能否解析，这里只用来避免明显无意义的读取。 */
const MIN_ARCHIVE_BYTES = 50 * 1024 * 1024;
/** wvc 依赖的 H264 VideoDecoder 要求不低于该版本（见 wvc/lib/install-browser.js 注释）。 */
export const MIN_CHROME_VERSION = '119.0.6018.0';
/** 旧 headless（含 HeadlessExperimental.beginFrame）自 132 起被移除，wvc 的 beginFrame 路径不可用。 */
export const OLD_HEADLESS_LAST_VERSION = 131;

export interface IBrowserStatus {
    ok: boolean;
    /** 期望/实际使用的可执行文件路径 */
    executablePath: string;
    /** 形如 `Google Chrome for Testing 131.0.6778.85`；自检失败时为空 */
    version?: string;
    /** 失败原因与修复指引 */
    reason?: string;
}

/** 由宿主平台推断 chrome-for-testing 的平台标识。 */
export function detectPlatform(): TChromePlatform {
    const platform = process.platform;
    const arch = os.arch();

    if (platform === 'linux') {
        // chrome-for-testing 不提供 linux-arm64 构建（linux64 即 x86_64）。
        // 若直接返回 linux64，ARM 宿主（Graviton / 树莓派 / Apple Silicon 未开 Rosetta 的容器）
        // 会下载到跑不了的二进制，只能得到“Exec format error”这种看不出根因的报错。
        if (arch === 'arm64' || arch === 'arm') {
            throw new Error('chrome-for-testing 没有 linux-arm64 构建，无法预置浏览器；'
                + 'ARM 环境请改用系统 Chromium：apt-get install -y chromium 后设 CHROME_PATH=/usr/bin/chromium');
        }
        return 'linux64';
    }
    if (platform === 'darwin') return arch === 'arm64' ? 'mac-arm64' : 'mac-x64';
    if (platform === 'win32') return arch === 'ia32' ? 'win32' : 'win64';

    throw new Error(`不支持的宿主平台用于浏览器预置: ${platform}/${arch}`);
}

/** 配置的浏览器构建号。 */
export function configuredVersion(): string {
    return env.CHROME_VERSION;
}

/**
 * 浏览器缓存根目录：默认 `<包根>/.bin`（与 Dockerfile 里 BROWSER_CACHE_DIR 的写法同一位置）。
 * 以前用 `process.cwd()`：从仓库根跑 `browser:install` 会把 Chrome 装到仓库根/.bin，
 * 而从服务目录启动的应用去 `<服务>/.bin` 找，两边不一致时只能多一次运行期下载。
 */
export function browserCacheDir(): string {
    return env.BROWSER_CACHE_DIR !== '' ? path.resolve(env.BROWSER_CACHE_DIR) : packagePath('.bin');
}

/** 主版本号，用于版本相关的策略判定。 */
export function majorVersion(version: string): number {
    return Number(version.split('.')[0]);
}

/**
 * 构建号对应的可执行文件路径（不做存在性判断）。
 * CHROME_PATH 显式配置时优先，便于直接指向系统安装的浏览器。
 */
export function resolveExecutablePath(version: string = configuredVersion(), cacheDir: string = browserCacheDir()): string {
    if (env.CHROME_PATH !== '') return path.resolve(env.CHROME_PATH);

    const platform = detectPlatform();
    return path.join(cacheDir, 'chrome', `${CACHE_DIR_PREFIX[platform]}-${version}`, ARCHIVE_FOLDER[platform], ...EXECUTABLE_REL[platform]);
}

/**
 * 压缩包下载地址。基址默认官方 CDN，可用 CHROME_MIRROR_BASE 换源（国内构建/网络受限时必需）。
 * 镜像必须保持与官方一致的目录结构：<base>/<构建号>/<平台>/chrome-<平台>.zip。
 */
export function archiveUrl(version: string, platform: TChromePlatform, mirrorBase: string = env.CHROME_MIRROR_BASE): string {
    const base: string = (mirrorBase === '' ? CDN_BASE : mirrorBase).replace(/\/+$/, '');
    return `${base}/${version}/${platform}/chrome-${platform}.zip`;
}

/** 当前生效的下载基址（仅用于日志与排错）。 */
export function archiveBase(): string {
    return (env.CHROME_MIRROR_BASE === '' ? CDN_BASE : env.CHROME_MIRROR_BASE).replace(/\/+$/, '');
}

/** 构建号对应的压缩包缓存路径。 */
function archivePathOf(version: string, platform: TChromePlatform, cacheDir: string): string {
    return path.join(cacheDir, 'chrome', `${version}-${ARCHIVE_FOLDER[platform]}.zip`);
}

const exists = async (p: string): Promise<boolean> => {
    try {
        await access(p);
        return true;
    } catch {
        return false;
    }
};

/** 跑一次 `--version`：既能确认二进制完整，也能暴露缺失动态库等启动障碍。 */
async function probe(executablePath: string): Promise<{ ok: boolean; version?: string; detail?: string }> {
    if (!(await exists(executablePath))) {
        return { ok: false, detail: `文件不存在: ${executablePath}` };
    }

    try {
        const { stdout } = await execFileAsync(executablePath, ['--version'], { timeout: 20_000 });
        const version = stdout.trim();
        if (version === '') return { ok: false, detail: `${executablePath} --version 无输出（二进制可能残缺）` };
        return { ok: true, version };
    } catch (e) {
        const err = e as NodeJS.ErrnoException & { stderr?: string; killed?: boolean };
        // Linux 下补充缺失库清单：这是容器/WSL 最常见的失败原因，直接给出包名线索
        let detail = `${err.code ?? ''} ${err.message}`.trim();
        if (process.platform === 'linux') {
            try {
                const { stdout } = await execFileAsync('ldd', [executablePath], { timeout: 20_000 });
                const missing = stdout.split('\n').filter((line) => line.includes('not found')).map((line) => line.trim().split(' ')[0]);
                if (missing.length > 0) detail = `缺少动态库 ${missing.length} 个: ${missing.join(', ')}（需 apt-get 安装对应运行时包）`;
            } catch {
                /* ldd 不可用则保留原始错误 */
            }
        }
        return { ok: false, detail };
    }
}

/**
 * 运行时自检：供启动阶段调用，把「浏览器不可用」变成一条明确日志，
 * 而不是等合成任务在 wvc 内部无限挂起。
 */
export async function preflight(): Promise<IBrowserStatus> {
    let executablePath: string;
    try {
        executablePath = resolveExecutablePath();
    } catch (e) {
        // 平台不支持等「解析期」错误也归入自检结果：调用方只看 ok/reason，不必各自 try
        return {ok: false, executablePath: '<未解析>', reason: (e as Error).message};
    }

    const found = await probe(executablePath);

    if (found.ok) {
        return { ok: true, executablePath, version: found.version };
    }

    return {
        ok: false,
        executablePath,
        reason: `浏览器不可用（${found.detail}）。请执行 ` +
            `「pnpm --filter lmo-data-visualization-server-application browser:install」预置 Chrome ` +
            `${configuredVersion()}，或用 CHROME_PATH 指向可用的 Chrome/Chromium。`
    };
}

/**
 * 以 EOCD/中央目录能否解析作为压缩包完整性判据。
 * 不能只靠文件大小：实测一个 86MB 的截断包同样能通过「>50MB」的猜测，
 * 但解包时只会得到一堆莫名其妙的缺失文件，最终又回到「残缺浏览器」那个坑。
 */
function openZip(file: string): AdmZip | undefined {
    try {
        return new AdmZip(file);
    } catch {
        return undefined;
    }
}

/** 下载压缩包到 `.part` 后原子改名；已存在且完整则直接复用。 */
async function downloadArchive(version: string, platform: TChromePlatform, cacheDir: string, force: boolean): Promise<AdmZip> {
    const file = archivePathOf(version, platform, cacheDir);
    const url = archiveUrl(version, platform);

    if (!force && await exists(file)) {
        const { size } = await stat(file);
        const cached = size > MIN_ARCHIVE_BYTES ? openZip(file) : undefined;
        if (cached) {
            console.log(`[browser] 复用已下载压缩包 (${(size / 1024 / 1024).toFixed(1)}MB): ${file}`);
            return cached;
        }
        console.warn(`[browser] 已下载压缩包不可用（大小 ${size}B 或 EOCD 解析失败），重新下载`);
    }

    await mkdir(path.dirname(file), { recursive: true });

    // 先写 .part 再 rename：中断（网络抖动/进程被 kill）只会留下临时文件，
    // 不会在规范路径上留下一个“看起来像缓存”的截断包。
    const partFile = `${file}.part`;
    const MAX_ATTEMPTS = 3;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
            console.log(`[browser] 下载 (${attempt}/${MAX_ATTEMPTS}) ${url}${env.CHROME_MIRROR_BASE !== '' ? '（镜像源）' : ''}`);
            const res = await fetch(url);
            if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} ${res.statusText}`);

            await pipeline(Readable.fromWeb(res.body as import('node:stream/web').ReadableStream), createWriteStream(partFile));
            const { size } = await stat(partFile);
            if (size < MIN_ARCHIVE_BYTES) throw new Error(`下载结果过小 (${size}B)，判定为截断`);

            const zip = openZip(partFile);
            if (!zip) throw new Error('下载结果 EOCD 解析失败，压缩包被截断');

            await rename(partFile, file);
            console.log(`[browser] 下载完成 (${(size / 1024 / 1024).toFixed(1)}MB)`);
            return zip;
        } catch (e) {
            console.warn(`[browser] 下载失败: ${(e as Error).message}`);
            await rm(partFile, { force: true });
            if (attempt === MAX_ATTEMPTS) throw e;
        }
    }
    /* unreachable：循环内要么 return 要么 throw */
    return openZip(file) as AdmZip;
}

/** 解包并补齐执行位。 */
async function extractArchive(zip: AdmZip, destDir: string, platform: TChromePlatform): Promise<number> {
    await mkdir(destDir, { recursive: true });
    zip.extractAllTo(destDir, true);

    const root = path.join(destDir, ARCHIVE_FOLDER[platform]);
    let fixed = 0;
    if (platform === 'linux64') {
        for (const name of EXECUTABLE_FILES) {
            const p = path.join(root, name);
            if (await exists(p)) {
                await chmod(p, 0o755);
                fixed++;
            }
        }
    }
    console.log(`[browser] 解包完成：${path.basename(root)}（补执行位 ${fixed} 个）`);
    return fixed;
}

export interface IInstallOptions {
    /** 构建号，默认取 env CHROME_VERSION */
    version?: string;
    cacheDir?: string;
    /** 忽略缓存重新下载解包 */
    force?: boolean;
}

/**
 * 预置浏览器：下载 → 解包 → 补执行位 → `--version` 校验。
 * 校验失败即抛错（非 0 退出由调用方决定），绝不留下"看起来装好了"的残缺产物。
 */
export async function install(options: IInstallOptions = {}): Promise<IBrowserStatus> {
    const version = options.version ?? configuredVersion();
    const cacheDir = options.cacheDir ?? browserCacheDir();
    const force = options.force ?? false;
    const platform = detectPlatform();

    if (majorVersion(version) < majorVersion(MIN_CHROME_VERSION)) {
        throw new Error(`Chrome ${version} 低于下限 ${MIN_CHROME_VERSION}（H264 VideoDecoder 不可用）`);
    }
    if (majorVersion(version) > OLD_HEADLESS_LAST_VERSION) {
        console.warn(`[browser] 注意：Chrome ${version} 已移除旧 headless，wvc 的 HeadlessExperimental.beginFrame 路径不可用；` +
            `本项目在非 darwin 平台已启用 compatibleRenderingMode（Page.screenshot），可继续工作但渲染效率下降。`);
    }

    const destDir = path.join(cacheDir, 'chrome', `${CACHE_DIR_PREFIX[platform]}-${version}`);
    const executablePath = resolveExecutablePath(version, cacheDir);

    if (!force && await exists(executablePath)) {
        const found = await probe(executablePath);
        if (found.ok) {
            console.log(`[browser] 已存在且可用，跳过安装：${found.version}`);
            return { ok: true, executablePath, version: found.version };
        }
        console.warn(`[browser] 已存在但不可用（${found.detail}），重新安装`);
    }

    const zipFile = await downloadArchive(version, platform, cacheDir, force);
    if (force) await rm(destDir, { recursive: true, force: true });
    await extractArchive(zipFile, destDir, platform);
    const found = await probe(executablePath);
    if (!found.ok) {
        throw new Error(`浏览器安装后仍不可用：${found.detail}`);
    }
    console.log(`[browser] 预置成功：${found.version}`);
    return { ok: true, executablePath, version: found.version };
}
