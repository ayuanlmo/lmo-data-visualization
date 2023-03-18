import TC from 'timecut';
import FFMPEG from 'fluent-ffmpeg';
import FS from 'fs-extra';
import Path from "../const/Path.y";
import Conf from "../conf/Conf.y";
import DefaultConf from "../conf/Default.y";
import Message from "../conf/Message.y";
import YingDB from "../lib/db/DataBase.y";
import {GET_IMAGE_BASE64_TYPE} from "../const/ImageBase64Type.y";
import {
    CREATE_TEMPLATE,
    SHOW_MESSAGE,
    SUCCESS,
    TASK_END,
    TASK_ERROR,
    TASK_PENDING,
    TASK_PRO,
    TASK_PRO_READY,
    TASK_PRO_SUCCESS,
    TASK_PROCESSING
} from "../const/MessageTypes.y";
import {
    CopyFileItemType,
    CreateTaskDataType,
    FluentFfmpegErrorTypes,
    WsAppType,
    WsClientsType
} from "../interface/Core.y";
import {FILE_TO_BASE64, GET_FILE_TYPE, RESOLVE_STATIC_FILE_PATH, STRING_TO_BINARY, STRINGIFY} from "../utils/Utils.y";

const TimeCut: TC = require('timecut');
const Ffmpeg: FFMPEG = require('fluent-ffmpeg');
const ResolvePath: Function = require('path').resolve;
const Fs: FS = require('fs-extra');
const OS = require('os');

class YingCore {
    private readonly WsPool: WsAppType;
    private readonly Data: CreateTaskDataType;
    private Logs: Array<string>;
    private Schedule: number;
    private readonly TaskName: string;
    private readonly Name: string;
    private readonly TaskType: number;
    private readonly YingDB: YingDB;

    public constructor(public readonly ws: WsAppType, public readonly data: CreateTaskDataType, public readonly type: number) {
        this.WsPool = ws;
        this.Data = data;
        this.TaskType = type;
        this.Logs = [];
        this.TaskName = `lmo_${new Date().getTime()}`;
        this.Schedule = 0;
        this.Name = this.Data.name === '' ? this.TaskName : this.Data.name;
        this.YingDB = new YingDB();

        // 是否合成任务
        if (this.TaskType === 0) {
            // 是否允许发起合成
            if (!DefaultConf.__SYNTHESIS) {
                this.SendMessage(SHOW_MESSAGE, SHOW_MESSAGE, {
                    message: Message.__SYNTHESIS_CLOSE
                });
                return;
            }else{
                // ffmpeg是否存在
                if (!Conf.__FFMPEG) {
                    this.SendMessage(SHOW_MESSAGE, SHOW_MESSAGE, {
                        message: Message.__NO_FFMPEG
                    });
                    return;
                }else{
                    this.SendMessage(TASK_PENDING, TASK_PENDING, {
                        taskName: this.Name
                    });
                }
            }
        }

        // 是否演示服务器
        if (Conf.__LIVE_SERVER) {
            this.SendMessage(SHOW_MESSAGE, SHOW_MESSAGE, {
                message: Message.__LIVE_SERVER
            });
            return;
        }

        this.Init();
    }

    private async Init(): Promise<void> {
        await this.CopyTempLate();
    }

    private async CopyTempLate(): Promise<number> {
        const tmp: string = ResolvePath(this.TaskType === 0 ? Path.COPY_TEMPLATE.TEMP : Path.COPY_TEMPLATE.ORIGIN + '/');
        const src: string = ResolvePath(`${this.TaskType === 0 ? Path.COPY_TEMPLATE.THIS : Path.COPY_TEMPLATE.ORIGIN + '/'}${this.TaskName}`);

        // 创建模板目录
        if (!Fs.existsSync(tmp))
            Fs.mkdir(tmp);

        // 检查源
        if (!Fs.existsSync(src)) {
            Fs.mkdirSync(src);
            await this.CopyFile(`${ResolvePath(`${Path.COPY_TEMPLATE.ORIGIN}`)}/${this.Data.template}`, src);

            const origin: string = this.Data.templateConfig.background.image;
            // 检查背景图像
            if (origin !== '') {
                const base = GET_IMAGE_BASE64_TYPE(GET_FILE_TYPE(origin));
                const path = ResolvePath(`./${RESOLVE_STATIC_FILE_PATH(this.Data.templateConfig.background.image)}`);

                FILE_TO_BASE64(path).then(async (res: string) => {
                    this.Data.templateConfig.background.image = `${base}${res}`;
                    await this.WriteConfJSFile(this.Data.templateConfig, src);
                }).catch((e: any) => {
                    console.warn('YingWarn: [FILE_TO_BASE64]', e);
                });
            } else
                await this.WriteConfJSFile(this.Data.templateConfig, src);
        }

        return Promise.resolve(0);
    }

    private WriteConfJSFile(conf: object, path: string): void {
        const data: object = this.TaskType === 1 ? {} : {
            _video: {
                ...this.Data.config.video
            }
        };

        Fs.writeFile(`${path}/conf.js`, `window.chartConfig = ${STRINGIFY({
            ...conf,
            ...data
        })};`, (e: any) => {
            if (!e) {
                if (this.TaskType === 0)
                    this.CreateTask(); // 创建合成任务
                if (this.TaskType === 1)
                    this.CreateTemplate();// 创建模板
            }
        });
    }

    private WriteLogFile(): void {
        const logPath: string = ResolvePath(Path.LOG.PATH);
        const s: string = '===== BEGIN LMO-DATA-VISUALIZATION TASK LOG =====\n';
        const e: string = '\n\n===== END LMO-DATA-VISUALIZATION TASK LOG =====';

        if (!Fs.existsSync(logPath))
            Fs.mkdir(logPath);

        const path = ResolvePath(`${logPath}/${this.TaskName}.y.log`);

        Fs.writeFile(path, `${s}${this.Logs.join('\n')}${e}`, ((e: any) => {
            if (!e) {
                this.Logs = [];
                this.YingDB.InsertLog({
                    id: this.TaskName,
                    logFilePath: `${Path.LOG.PATH.replace('.', '')}${this.TaskName}.y.log`,
                    tempFilePath: '/'
                });
            }
        }));
    }

    private CopyFile(from: string, to: string): void {
        Fs.readdirSync(from, {
            withFileTypes: true
        }).forEach((i: CopyFileItemType) => {
            Fs.copyFileSync(ResolvePath(from, i.name), ResolvePath(to, i.name));
        });
    }

    private CreateTemplate(): void {
        const sql: string = this.YingDB.GetInsertTemplateTableSql({
            name: this.TaskName,
            id: `lmo_data_visualization_template_${this.TaskName}`,
            title: this.Data.customize.title ?? '自定义模板',
            description: this.Data.customize.description ?? '这是一个自定义模板',
            path: '/static/DataVisualizationTemplate/' + this.TaskName + '/index.html',
            type: 'customize'
        });

        this.YingDB.SqlQuery(sql, true).catch(e => {
            if (e)
                console.warn('[YingWarn]:Core-CreateTemplate');
        }).then(() => {
            this.SendMessage(CREATE_TEMPLATE, SUCCESS);
        })
    }

    private CreateTask(): void {
        this.Logs.push(`\nCREATE AT: ${new Date().getTime()}`);
        this.Logs.push(`SOURCE TEMPLATE: ${this.Data.template}`);
        this.Logs.push(`PLATFORM: ${OS.type()} / ${OS.platform()} / ${OS.arch()} / ${OS.release()}`);
        this.Logs.push(`NODE VERSION: ${process.version}`);
        this.Logs.push(`CURRENT: ${Path.SYNTHESIS.CURRENT_TEMPLATE.replace('$t', this.TaskName)}`);
        this.Logs.push(`CONFIG ${STRINGIFY(this.Data)}\n\n`);

        let audioPath: string = '';
        this.YingDB.SetResourcesItem({
            name: this.Name,
            path: '/',
            status: 'Processing',
            id: this.TaskName
        }).catch(e => {
            console.warn('[Ying warn] CreateTask', e);
        })

        const templateConf = this.Data.config;
        const conf: object = {
            url: `http://localhost:${Conf.__SERVER_PORT}${Path.SYNTHESIS.SERVER.replace('$y', this.TaskName)}`,
            selector: '#app',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            pipeMode: OS.freemem() / 1024 / 1024 > 2048,
            fps: parseInt(templateConf.video.fps),
            duration: templateConf.video.duration,
            output: Path.SYNTHESIS.OUTPUT.replace('$y', this.TaskName),
            viewport: {
                ...this.GetVideoClarity(templateConf.video.clarity ?? '1080P')
            },
            preparePageForScreenshot: async (page: object, currentFrame: number, totalFrames: number) => {
                if (page) {
                    const schedule: number = parseInt(String(currentFrame / totalFrames * 100));

                    if (this.Schedule !== schedule) {
                        this.Schedule = schedule;
                        await this.SendMessage(TASK_PROCESSING, TASK_PROCESSING, {
                            taskName: this.Name,
                            schedule: this.Schedule,
                            taskId: this.TaskName
                        });
                    }
                }
            }
        }

        if (templateConf.audio.src !== '') {
            audioPath = ResolvePath(`.${templateConf.audio.src}`);
            if (Fs.existsSync(audioPath))
                this.Data.config.audio.src = audioPath;
            else
                this.Data.config.audio.src = '';
        }

        TimeCut(conf).then(() => {
            this.ProcessAudio(templateConf.audio.src !== '' ? `${Path.PROCESS_AUDIO.PATH.replace('$y', this.TaskName)}` : '', audioPath).then(async (r: number) => {
                    await this.WriteLogFile();
                    const path = Path.SYNTHESIS.OUTPUT.replace('$y', `${this.TaskName}${r === 1 ? '' : '264'}`);

                    await this.YingDB.UpdateResourceStatus({
                        status: 'Finish',
                        name: this.TaskName,
                        path: path
                    });

                    const sendSuccessMessage: Function = (): void => {
                        setTimeout(async () => {
                            await this.YingDB.Close();
                            await this.SendMessage(TASK_END, TASK_PROCESSING, {
                                state: 'success',
                                taskName: this.Name,
                                path: path
                            });
                        }, 2000);
                    }

                    if (r === 1) {
                        await sendSuccessMessage();
                    } else {
                        this.SendMessage(TASK_PRO, TASK_PRO_SUCCESS, {
                            taskName: this.Name,
                            path: path
                        });
                        await sendSuccessMessage();
                    }
                    await this.DelTempFiles(`${ResolvePath(`./static/temp/${this.TaskName}`)}`)
                }
            );
        }).catch(() => {
            this.SendMessage(TASK_END, TASK_END, {
                taskName: this.Name
            });
        });

    }

    private ProcessAudio(src: string, audioPath: string): Promise<number> {
        return new Promise((resolve: any) => {
            this.SendMessage(TASK_PRO, TASK_PRO_READY, {
                taskName: this.Name
            });
            // 音频不存在
            if (src === '')
                return resolve(1);

            const ffmpeg = Ffmpeg(src);
            ffmpeg.videoCodec('libx264');// 使用H.264编码
            ffmpeg.input(audioPath);// 输入音频
            ffmpeg.audioFilters(`volume=${this.Data.config.audio.volume}`);// 音频过滤器
            ffmpeg.audioBitrate('128k');// 采样率

            if (!this.Data.config.audio.complete)
                ffmpeg.duration(this.Data.config.video.duration);// 设置持续时间
            ffmpeg.output(`${Path.PROCESS_AUDIO.OUTPUT.replace('$y', this.TaskName)}`);// 设置输入目录
            // 完毕
            ffmpeg.on('end', () => {
                Fs.unlinkSync(src);
                resolve();
            });
            // 出现异常
            ffmpeg.on('error', (e: FluentFfmpegErrorTypes) => {
                this.SendMessage(TASK_PRO, TASK_ERROR, {
                    message: e.message
                });
            });
            ffmpeg.on('stderr', (msg: string) => {
                this.SendMessage(TASK_PROCESSING, TASK_PROCESSING, {
                    taskName: this.Name,
                    message: msg
                });
            });
            // 开始
            ffmpeg.run();
        });
    }

    private DelTempFiles(path: string): void {
        let files: Array<string> = [];

        if (Fs.existsSync(path)) {
            files = Fs.readdirSync(path);
            files.forEach((i: string) => {
                const tmp: string = `${path}/${i}`;

                if (Fs.statSync(tmp).isDirectory())
                    this.DelTempFiles(tmp);
                else
                    Fs.unlinkSync(tmp);
            });
            Fs.rmdirSync(path);
        }
    }

    private GetVideoClarity(type: string): object {
        if (type === '1080P')
            return {
                width: 1920,
                height: 1080
            };
        if (type === '2K')
            return {
                width: 2560,
                height: 1440
            };
        if (type === '4K')
            return {
                width: 4096,
                height: 2160
            };
    }

    private SendMessage(type: string, cmd: string, data: object = {}): void {
        if (type !== 'task_pending' && cmd !== 'task_pending')
            this.Logs.push(`[${new Date().getTime()}]${type} ${cmd} > ${STRINGIFY(data)}`);
        this.WsPool.clients.forEach((i: WsClientsType) => {
            i.send(STRING_TO_BINARY(STRINGIFY({
                type: type,
                data: {
                    cmd: cmd,
                    timestamp: new Date().getTime(),
                    ...data
                }
            })));
        })
    }
}

export default YingCore;