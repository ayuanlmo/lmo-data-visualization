import {ChildProcessWithoutNullStreams, spawn} from "node:child_process";
import ffmpegPath from "ffmpeg-static";

/** ffmpeg 单次调用最长允许时间，防止音频异常时进程悬挂导致任务永不结束 */
const FFMPEG_TIMEOUT_MS: number = Number(process.env.FFMPEG_TIMEOUT_MS ?? 120000);

namespace FFMPEG {
    /**
     * @method getAudioVisualizationDiagram
     * @description 生成音频波形图。
     * 需同时注册 error 事件：ffmpeg 二进制缺失/无法启动时 spawn 触发 error，
     * 若不处理则 Promise 永不 settle，调用方 .then 不执行且无 catch，最终成为未处理 rejection。
     * **/
    export const getAudioVisualizationDiagram = (audioPath: string, optPath: string): Promise<string> => {
        if (!ffmpegPath)
            return Promise.reject(new Error('ffmpeg binary not found (ffmpeg-static installation failed)'));

        if (audioPath === '' || optPath === '')
            return Promise.reject(new Error('audioPath and optPath are required'));

        const _optPath: string = optPath.replace('/dist', '');
        const args: string[] = [
            '-i',
            audioPath,
            '-filter_complex',
            'showwavespic=s=640x120:colors=#407DF2',
            '-frames:v', '1',
            _optPath,
            '-y'
        ];

        return new Promise((resolve, reject): void => {
            let settled: boolean = false;
            let stderrTail: string = '';
            let ffmpegProcess: ChildProcessWithoutNullStreams | undefined;

            const settle = (fn: () => void): void => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                fn();
            };

            const timer: NodeJS.Timeout = setTimeout((): void => {
                try {
                    ffmpegProcess?.kill('SIGKILL');
                } catch (e) {
                    /* 进程已退出 */
                }
                settle((): void => reject(new Error(`ffmpeg timeout after ${FFMPEG_TIMEOUT_MS}ms`)));
            }, FFMPEG_TIMEOUT_MS);

            try {
                ffmpegProcess = spawn(ffmpegPath as unknown as string, args);
            } catch (e) {
                settle((): void => reject(e instanceof Error ? e : new Error(String(e))));
                return;
            }

            ffmpegProcess!.stderr.on('data', (chunk: Buffer): void => {
                stderrTail = `${stderrTail}${chunk.toString()}`.slice(-2000);
            });
            ffmpegProcess!.on('error', (e: Error): void => {
                settle((): void => reject(e));
            });
            ffmpegProcess!.on('close', (code: number | null): void => {
                if (code === 0)
                    settle((): void => resolve(_optPath));
                else
                    settle((): void => reject(new Error(`ffmpeg exited with code ${code}: ${stderrTail}`)));
            });
        });
    }
}

export default FFMPEG;
