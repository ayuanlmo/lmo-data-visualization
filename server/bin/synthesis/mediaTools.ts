/**
 * 合成用 ffmpeg / ffprobe 的定位。
 *
 * 与浏览器同一个问题家族：ffmpeg-static / ffprobe-static 的二进制是「装包时下载」的产物，
 * 网络抖动或新版 Node 的解包回归会留下一个 size 看着正常、实际残缺的文件
 * （实测 8,461,378 字节，执行即 SIGSEGV；fluent-ffmpeg 侧则表现为 spawn EACCES / 进程被杀）。
 * 路径本身照样能解析出来，所以必须在用之前真跑一次 `-version`，不能只看文件存不存在。
 *
 * 优先级：显式环境变量 → 包内置二进制（可用者）→ PATH 上的系统份。
 * 先试内置是为了「各环境产物一致」，退化到系统份是为了「至少能出片」；
 * 两者都不可用时立即抛错，让任务秒级失败，而不是占住并发位挂到 30 分钟超时。
 */
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import ffmpegStaticPath from 'ffmpeg-static';
import { env } from '../../conf/env.js';

const execFileAsync = promisify(execFile);

/** 能跑出 `-version` 才算可用；返回空串表示不可用。 */
async function probe(binary: string): Promise<string> {
    try {
        const { stdout } = await execFileAsync(binary, ['-version'], { timeout: 20_000 });
        return (stdout.split('\n')[0] ?? '').trim();
    } catch {
        return '';
    }
}

/** 依次尝试候选，返回第一个真正能执行的。 */
async function firstUsable(candidates: string[]): Promise<{ path: string; version: string } | undefined> {
    const tried: Set<string> = new Set();
    for (const candidate of candidates) {
        if (candidate === '' || tried.has(candidate)) continue;
        tried.add(candidate);
        const version = await probe(candidate);
        if (version !== '') return { path: candidate, version };
    }
    return undefined;
}

/** 包内置二进制路径（ffmpeg-static 默认导出在类型上可能是 undefined）。 */
function staticFfmpegPath(): string {
    return typeof ffmpegStaticPath === 'string' ? ffmpegStaticPath : '';
}

export interface IResolvedMediaTools {
    ffmpeg: string;
    ffmpegVersion: string;
    /** 未配置 FFPROBE_PATH 且 PATH 上没有可用 ffprobe 时为 undefined，此时沿用库内置份 */
    ffprobe?: string;
    ffprobeVersion?: string;
}

/** 解析 ffmpeg / ffprobe：见文件头部的优先级说明。 */
export async function resolveMediaTools(): Promise<IResolvedMediaTools> {
    const ffmpegFound = await firstUsable([env.FFMPEG_PATH, staticFfmpegPath(), 'ffmpeg', 'ffmpeg.exe']);
    if (!ffmpegFound) {
        throw new Error(
            'ffmpeg 不可用：FFMPEG_PATH 未设置、包内置 ffmpeg-static 无法执行（多为下载被截断）、PATH 上也没有 ffmpeg。' +
            '修复任选其一：apt-get install -y ffmpeg 并设 FFMPEG_PATH=/usr/bin/ffmpeg；' +
            '或在 Node 24 下重装 ffmpeg-static。'
        );
    }

    // ffprobe 不强求：wvc 内部自带 ffprobe-static，那份在 Docker（node:24）里是完好的；
    // 只有它坏了才需要 FFPROBE_PATH 指路，或系统份顺路可用时直接复用。
    const ffprobeFound = await firstUsable([env.FFPROBE_PATH, 'ffprobe', 'ffprobe.exe']);

    return {
        ffmpeg: ffmpegFound.path,
        ffmpegVersion: ffmpegFound.version,
        ffprobe: ffprobeFound?.path,
        ffprobeVersion: ffprobeFound?.version
    };
}
