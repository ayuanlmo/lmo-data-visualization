import {ChildProcessWithoutNullStreams, spawn} from "node:child_process";
import ffmpegPath from "ffmpeg-static";

namespace FFMPEG {
    export const getAudioVisualizationDiagram = (audioPath: string, optPath: string): Promise<string> => {
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
            const ffmpegProcess: ChildProcessWithoutNullStreams = spawn(ffmpegPath ?? '', args);

            ffmpegProcess.on('exit', (code: number | null): void => {
                if (code !== 0)
                    reject(`FFMPEG exited with code ${code}`);
                else
                    resolve(_optPath);
            });
        });
    }
}

export default FFMPEG;
