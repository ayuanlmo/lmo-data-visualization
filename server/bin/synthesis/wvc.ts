// @ts-ignore
import WebVideoCreator from "web-video-creator";
// @ts-ignore
import SingleVideo from 'web-video-creator/api/SingleVideo';
import {DECODES} from "./config.js";
import { resolveExecutablePath, configuredVersion, majorVersion, preflight, OLD_HEADLESS_LAST_VERSION, IBrowserStatus } from "./browser.js";
import { resolveMediaTools, IResolvedMediaTools } from "./mediaTools.js";
import Logger from "../../lib/Log.js";
import { env } from "../../conf/env.js";
import OS from "node:os";
import fs from "node:fs";
import ffmpeg from "fluent-ffmpeg";

export interface ICreateTaskConfig {
    id: string;
    path: string;
    duration: number;
    width?: number;
    height?: number;
    fps?: number;
    optPath?: string;
    fileName?: string;
    folder?: string;
    audioPath: string;
    pAudio: boolean;
    audioVolume: number;
}

class Wvc {
    private config: ICreateTaskConfig | undefined;
    private instance: WebVideoCreator | undefined;
    /** 首次构建进行中：并发首次调用共享同一个 Promise，避免起两个浏览器池 */
    private instancing: Promise<WebVideoCreator> | undefined;

    /**
     * 懒初始化：`new WebVideoCreator()` + `.config()` 不能在模块加载时执行——
     * 否则第三方库在 import 阶段抛错会中断整条 import 链，拖垮 API 启动。
     * 改为首次真正合成时才构建；失败由调用方（TaskScheduler/runner）的 try/catch 隔离成 TASK_ERROR。
     */
    private ensure(): Promise<WebVideoCreator> {
        if (this.instance)
            return Promise.resolve(this.instance);
        if (this.instancing)
            return this.instancing;

        // 构建失败时必须清掉 in-flight 记录，否则后续任务会一直拿到同一个已 rejected 的 Promise
        this.instancing = this.build().finally((): void => {
            this.instancing = undefined;
        });
        return this.instancing;
    }

    private async build(): Promise<WebVideoCreator> {
        // 依赖预检：两个「装包/装浏览器时下载」的二进制都可能是残缺的，必须真跑一次才算可用。
        // 不可用时在此立即报错（秒级），而不是等 wvc 内部挂 30 分钟占住并发位。
        const media: IResolvedMediaTools = await resolveMediaTools();
        ffmpeg.setFfmpegPath(media.ffmpeg);
        if (media.ffprobe)
            ffmpeg.setFfprobePath(media.ffprobe);

        const browserStatus: IBrowserStatus = await preflight();
        if (!browserStatus.ok)
            throw new Error(browserStatus.reason ?? '浏览器不可用');

        Logger.info(`[synthesis] ffmpeg=${media.ffmpeg} (${media.ffmpegVersion}) ffprobe=${media.ffprobe ?? '<wvc 内置>'}`);
        Logger.info(`[synthesis] chrome=${browserStatus.version} executablePath=${browserStatus.executablePath}`);

        const wvc: WebVideoCreator = new WebVideoCreator();

        // wvc 的 GPU 参数段会追加一个不带值的裸 `--use-angle`（core/Browser.js），
        // 且 config() 只接收 globalConfig 已有的键、无法从外部补上参数值。
        // 实测：该参数表在 Chrome 119 全部可用，在 >=131 会直接打死 target
        // （Protocol error (Target.createTarget): Target closed 或永久挂起）。
        // 故除非显式开启且不高于旧 headless 上限，否则一律关闭 GPU 加速。
        const useGPU: boolean = env.BROWSER_USE_GPU && majorVersion(configuredVersion()) <= OLD_HEADLESS_LAST_VERSION;

        wvc.config({
            mp4Encoder: DECODES.CPU.H264,
            compatibleRenderingMode: OS.platform() !== 'darwin',
            browserUseGPU: useGPU,
            browserUseAngle: useGPU && env.BROWSER_USE_ANGLE,
            numBrowserMin: 1,
            numBrowserMax: 3,
            numPageMin: 1,
            numPageMax: 3,
            browserHeadless: true,
            browserDebug: process.env.OPEN_BROWSER === '1',
            ffmpegDebug: true,
            allowUnsafeContext: process.env.ALLOW_UNSAFE_CONTEXT === '1',
            // 绕开 wvc 内置浏览器下载器（Node 26 下 extract-zip 会静默截断二进制并让 Promise 永不 settle）：
            // 固定由 `pnpm browser:install` 预置，这里只指路。路径不存在时 puppeteer 会立即报
            // “Failed to launch” 而非挂 30 分钟，并发位不会被焊死。
            browserExecutablePath: resolveExecutablePath(),
            browserVersion: configuredVersion(),
            // ffmpeg/ffprobe 走 config，而非仅依赖模块顶层的 setFfmpegPath：
            // wvc 的 core/Synthesizer.js 在 import 期就执行 setFfmpegPath(ffmpeg-static)，
            // 只有 config() 内的赋值（WebVideoCreator.js:71,73）稳定地晚于它，不会被 import 顺序反覆盖。
            ffmpegExecutablePath: media.ffmpeg,
            ...(media.ffprobe ? { ffprobeExecutablePath: media.ffprobe } : {})
        });

        this.instance = wvc;
        return wvc;
    }

    public async init(conf: ICreateTaskConfig, progressCb: (data: {
        id: string;
        progress: number;
    }) => void): Promise<any> {
        this.config = conf;
        const wvc: WebVideoCreator = await this.ensure();

        return new Promise((resolve, reject): void => {
            const video: SingleVideo = wvc.createSingleVideo({
                url: this.config?.path,
                width: this.config?.width,
                height: this.config?.height,
                fps: this.config?.fps,
                duration: this.config?.duration,
                outputPath: this.config?.optPath,
                showProgress: false,
                videoQuality: 100,
                pixelFormat: 'yuv420p',
                frameFormat: 'jpeg',
                frameQuality: 100
            });

            // 失败隔离：若只有 'completed' 会 resolve，渲染/编码出错时 Promise 永不 settle，
            // 会造成调度器 runningTask 泄漏（永远占位）。因此补 error 分支 reject。
            video.once('completed', (data: {
                takes: number;
                duration: number;
                outputPath: string;
                rtf: number;
            }): void => {
                (async (): Promise<void> => {
                    if (this.config?.pAudio) {
                        // 音轨合成失败不应让整个 Promise 挂起或抛出未捕获 rejection：
                        // 记录后按“无音频”继续 resolve，视频产物仍然有效。
                        try {
                            await this.processAudio(this.config.audioPath, this.config.optPath as string);
                        } catch (err) {
                            console.error('[wvc] processAudio failed, keep silent video:', err);
                        }
                    }

                    resolve({
                        ...data,
                        id: this.config?.id,
                        gifPath: this.config?.fileName,
                        videoCover: this.config?.fileName
                    });
                    this.getLastFrame(this.config?.optPath as string);
                })();
            });
            video.once('error', (err: Error): void => {
                reject(err instanceof Error ? err : new Error(String(err)));
            });
            video.on('progress', (progress: number): void => {
                progressCb({
                    id: this.config?.id as string,
                    progress: Math.ceil(progress)
                });
            });
            video.start();
        });
    }

    private processAudio(audioPath: string, videoPath: string): Promise<0 | 1> {
        return new Promise((resolve: (value: (0 | 1 | PromiseLike<0 | 1>)) => void, reject): void => {
            // 空音轨：必须 return，否则会以空输入继续跑 ffmpeg。
            if (audioPath === '') {
                resolve(0);
                return;
            }

            const _ff: ffmpeg.FfmpegCommand = ffmpeg(videoPath);
            const optPath: string = videoPath.replace('.mp4', `lib.mp4`);

            // settled 守卫：end/error 与 fs 操作只允许成功完成一次，避免竞态重复 resolve。
            let settled = false;
            const settle = (fn: () => void): void => {
                if (settled) return;
                settled = true;
                try {
                    fn();
                } catch (err) {
                    reject(err);
                }
            };

            _ff.videoCodec('libx264')
                .input(audioPath)
                .audioFilters(`volume=${this.config?.audioVolume}`)
                .audioBitrate('128k')
                .output(optPath)
                .on('end', (): void => {
                    settle((): void => {
                        // 产物缺失时不做 unlink/rename，避免覆盖或误删已完成的视频。
                        if (!fs.existsSync(optPath)) {
                            reject(new Error(`[wvc] audio output missing: ${optPath}`));
                            return;
                        }
                        fs.rmSync(videoPath, { force: true });
                        fs.renameSync(optPath, videoPath);
                        resolve(1);
                    });
                })
                // error 处理：ffmpeg 失败时 Promise 必须 settle，否则调度器永久占位。
                .on('error', (err: Error): void => {
                    settle((): void => reject(err));
                });
            _ff.run();
        });
    }

    private getLastFrame(path: string): void {
        if (!fs.existsSync(path)) return;

        ffmpeg(path)
            .screenshots({
                timestamps: ['98%'],
                filename: `${this.config?.fileName}.png`,
                folder: this.config?.folder,
                size: `${(230 * 2)}x${(129 * 2)}`
            }).on('end', (): void => {
            this.getVideoGif(path);
        })
    }

    private getVideoGif(path: string): void {
        ffmpeg(path)
            .outputFormat('gif')
            .withSize('100%')
            .videoFilters(`fps=${this.config?.fps ?? '24'},scale=${this.config?.width ?? '1920'}:-1:flags=lanczos`)
            .save(this.config?.folder + `/${this.config?.fileName}.gif`);
    }
}

const CreateTask: Wvc = new Wvc();

export default CreateTask;
