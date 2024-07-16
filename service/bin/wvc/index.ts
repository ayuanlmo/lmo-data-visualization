// @ts-ignore
import WebVideoCreator from "web-video-creator";
// @ts-ignore
import SingleVideo from 'web-video-creator/api/SingleVideo';
import {DECODES} from "./config";
import OS from "node:os";
import ffmpegPath from "ffmpeg-static";
import fs from "node:fs";
import ffmpeg from "fluent-ffmpeg";
import AppConfig from "../../config/AppConfig";

ffmpeg.setFfmpegPath(ffmpegPath as string);

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
    private readonly wvc: WebVideoCreator;

    constructor() {
        this.wvc = new WebVideoCreator();
        this.wvc.config({
            mp4Encoder: DECODES.CPU.H264,
            compatibleRenderingMode: OS.platform() === 'darwin',
            browserUseAngle: true,
            numBrowserMin: 1,
            numBrowserMax: 3,
            numPageMin: 1,
            numPageMax: 3,
            browserHeadless: AppConfig.__OPEN_BROWSER,
            browserDebug: AppConfig.__OPEN_BROWSER
        });
    }

    public init(conf: ICreateTaskConfig, progressCb: (data: {
        id: string;
        progress: number;
    }) => void): Promise<any> {
        this.config = conf;

        return new Promise((resolve, reject): void => {
            const video: SingleVideo = this.wvc.createSingleVideo({
                url: this.config?.path,
                width: this.config?.width,
                height: this.config?.height,
                fps: this.config?.fps,
                duration: this.config?.duration,
                outputPath: this.config?.optPath,
                showProgress: false,
                videoQuality: 100,
                pixelFormat: 'yuv420p'
            });

            video.once('completed', (data: {
                takes: number;
                duration: number;
                outputPath: string;
                rtf: number;
            }): void => {
                (async (): Promise<void> => {
                    if (this.config?.pAudio)
                        await this.processAudio(this.config.audioPath, this.config.optPath as string);

                    resolve({
                        ...data,
                        id: this.config?.id,
                        gifPath: this.config?.fileName,
                        videoCover: this.config?.fileName
                    });
                    this.getLastFrame(this.config?.optPath as string);
                })();
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
        return new Promise((resolve: (value: (0 | 1 | PromiseLike<0 | 1>)) => void): void => {
            if (audioPath === '') resolve(0);

            const _ff: ffmpeg.FfmpegCommand = ffmpeg(videoPath);
            const optPath: string = videoPath.replace('.mp4', `lib.mp4`);

            _ff.videoCodec('libx264')
                .input(audioPath)
                .audioFilters(`volume=${this.config?.audioVolume}`)
                .audioBitrate('128k')
                .output(optPath)
                .on('end', (): void => {
                    fs.unlinkSync(videoPath);
                    fs.renameSync(optPath, videoPath);
                    resolve(1);
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
