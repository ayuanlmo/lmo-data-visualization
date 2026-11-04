/**
 * 浏览器预置 CLI：`pnpm browser:install`
 *
 * Docker 构建期执行一次，镜像内即带有完整可用的 Chrome；本地开发（WSL2/Linux/macOS）首次 clone 后执行一次。
 * 之所以要在构建/开发期做，而不是让 wvc 在首次合成时自己下载：其解包依赖链在新版 Node 上会静默截断二进制
 * （详见 bin/synthesis/browser.ts 顶部说明），而残缺的浏览器会让合成任务无限挂起。
 */
import { install, browserCacheDir, configuredVersion } from '../bin/synthesis/browser.js';

interface IParsedArgs {
    version: string;
    cacheDir: string;
    force: boolean;
}

const parseArgs = (argv: string[]): IParsedArgs => {
    const out: IParsedArgs = { version: configuredVersion(), cacheDir: browserCacheDir(), force: false };

    for (const arg of argv) {
        const [key, value] = arg.includes('=') ? [arg.split('=')[0], arg.split('=').slice(1).join('=')] : [arg, ''];
        if (key === '--version') out.version = value;
        else if (key === '--dir') out.cacheDir = value;
        else if (key === '--force') out.force = true;
        else {
            process.stderr.write(`未知参数: ${arg}\n可用: --version=<构建号> --dir=<缓存目录> --force\n`);
            process.exit(2);
        }
    }
    return out;
};

const args = parseArgs(process.argv.slice(2));

try {
    console.log(`[browser:install] version=${args.version} cacheDir=${args.cacheDir} force=${args.force}`);
    const status = await install(args);
    console.log(`[browser:install] OK: ${status.version}\n  executablePath=${status.executablePath}`);
    process.exitCode = 0;
} catch (e) {
    process.stderr.write(`[browser:install] FAILED: ${(e as Error).message}\n`);
    process.exitCode = 1;
}
