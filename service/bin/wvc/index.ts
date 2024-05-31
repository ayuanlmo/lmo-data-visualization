// @ts-ignore
import WebVideoCreator from "web-video-creator";
// @ts-ignore
import SingleVideo from 'web-video-creator/api/SingleVideo';
import {DECODES} from "./config";

interface ICreateTaskConfig {
    id: string;
    path: string;
    duration: number;
    width?: number;
    height?: number;
    fps?: number;
}

class Wvc {
    private config: ICreateTaskConfig | undefined;
    private readonly wvc: WebVideoCreator;

    constructor() {
        this.wvc = new WebVideoCreator();
        this.wvc.config({
            mp4Encoder: DECODES.CPU.H264
        });
    }

    public init(conf: ICreateTaskConfig): Promise<any> {
        this.config = conf;

        return new Promise((resolve, reject): void => {
            const video: SingleVideo = this.wvc.createSingleVideo({
                url: this.config?.path,
                width: this.config?.width,
                height: this.config?.height,
                fps: this.config?.fps,
                duration: this.config?.duration,
                outputPath: "./test.mp4",
                showProgress: false
            });

            video.once('completed', (data: {
                takes: number;
                duration: number;
                outputPath: string;
                rtf: number;
            }): void => {
                resolve(data);
            });
            video.once('progress', (data: {
                progress: number;
            }): void => {
                console.log('进度', data);
            });
            video.start();
        });

    }
}

const CreateTask: Wvc = new Wvc();

export default CreateTask;
