/**
 * 浏览器自检 CLI：`pnpm browser:check`
 *
 * 打印当前生效的合成配置与实际解析到的浏览器，用于排查「合成排队但不出片」这类问题。
 * 不可用时非 0 退出，可直接作为容器健康检查/CI 的一道门。
 */
import { preflight, configuredVersion, browserCacheDir, detectPlatform, majorVersion, archiveBase, archiveUrl, OLD_HEADLESS_LAST_VERSION } from '../bin/synthesis/browser.js';
import { resolveMediaTools, IResolvedMediaTools } from '../bin/synthesis/mediaTools.js';
import { env } from '../conf/env.js';

const platform = detectPlatform();
const version = configuredVersion();
// 与 bin/synthesis/wvc.ts 中 ensure() 保持一致的判定，避免「检查通过但运行时参数不同」
const useGPU: boolean = env.BROWSER_USE_GPU && majorVersion(version) <= OLD_HEADLESS_LAST_VERSION;

console.log('[browser:check] 生效配置');
console.log(`  platform              = ${platform}`);
console.log(`  CHROME_VERSION        = ${version}`);
console.log(`  CHROME_PATH           = ${env.CHROME_PATH === '' ? '(未设置，按缓存目录解析)' : env.CHROME_PATH}`);
console.log(`  BROWSER_CACHE_DIR     = ${browserCacheDir()}`);
console.log(`  下载基址            = ${archiveBase()}${env.CHROME_MIRROR_BASE !== '' ? '（已换镜像源）' : ''}`);
console.log(`  本次会拉取的 URL  = ${archiveUrl(version, platform)}`);
console.log(`  BROWSER_USE_GPU       = ${env.BROWSER_USE_GPU} -> 实际启用 = ${useGPU}${useGPU ? '' : '（wvc 的 GPU 参数段在 Chrome ≥131 上会打死 target，已按版本关闭）'}`);
console.log(`  BROWSER_USE_ANGLE     = ${env.BROWSER_USE_ANGLE}`);

const status = await preflight();
// 逐个真跑一次 -version：静态包里的残缺二进制只有执行才能识别
let media: IResolvedMediaTools | undefined;
let mediaError = '';
try {
    media = await resolveMediaTools();
} catch (e) {
    mediaError = (e as Error).message;
}

if (media) {
    console.log(`  ffmpeg                = ${media.ffmpeg}  (${media.ffmpegVersion})`);
    console.log(`  ffprobe               = ${media.ffprobe ?? '(沿用 wvc 内置 ffprobe-static)'}`);
}

if (status.ok && mediaError === '') {
    console.log(`[browser:check] OK: ${status.version}`);
    console.log(`  executablePath = ${status.executablePath}`);
    process.exitCode = 0;
} else {
    if (!status.ok) {
        process.stderr.write(`[browser:check] FAILED\n  executablePath = ${status.executablePath}\n  ${status.reason}\n`);
    } else {
        process.stderr.write(`[browser:check] 浏览器可用但 ffmpeg 不可用: ${mediaError}\n`);
    }
    process.exitCode = 1;
}
