// @ts-ignore
import WebVideoCreator, {VIDEO_ENCODER} from "web-video-creator";
// @ts-ignore
import SingleVideo from 'web-video-creator/api/SingleVideo';
import SocketServer from "./SocketServer";

interface ICreateTaskConfig {
    id: string;
    path: string;
    duration: number;
    width?: number;
    height?: number;
    fps?: number;
    optPath: string;
}

class CreateTask {
    private config: ICreateTaskConfig | undefined;
    private readonly wvc: WebVideoCreator;

    constructor(conf: ICreateTaskConfig) {
        this.wvc = new WebVideoCreator();
        this.wvc.config({
            mp4Encoder: VIDEO_ENCODER.CPU.H264
        });
    }

    public init(conf: ICreateTaskConfig): Promise<any> {
        this.config = conf;
        const {config} = this;

        return new Promise((resolve, reject) => {
            const video: SingleVideo = this.wvc.createSingleVideo({
                url: config.path,
                width: config.width,
                height: config.height,
                fps: config.fps,
                duration: config.duration,
                outputPath: this.config?.optPath,
                showProgress: false
            });

            video.once('completed', (data: {
                takes: number;
                duration: number;
                outputPath: string;
                rtf: number;
            }): void => {
                resolve({
                    ...data
                });
            });
            video.once('progress', (data: {
                progress: number;
            }): void => {
                SocketServer.sendMessage(JSON.stringify({
                    type: 'progress',
                    data: {
                        id: this.config?.id,
                        progress: data
                    }
                }));
            });
            video.start();
        });
    }
}

export default CreateTask;
