import TC from 'timecut';
import FFMPEG from 'fluent-ffmpeg';
import FS from 'fs-extra';
import Path from "../const/Path.y";
import Conf from "../conf/Conf.y";
import DefaultConf from "../conf/Default.y";
import Message from "../conf/Message.y";
import YingDB from "../lib/sqlite/DataBase.y";
import {GET_IMAGE_BASE64_TYPE} from "../const/ImageBase64Type.y";
import {
    CREATE_TEMPLATE,
    SHOW_MESSAGE,
    SUCCESS,
    TASK_END,
    TASK_PENDING,
    TASK_PRO,
    TASK_PROCESSING
} from "../const/MessageTypes.y";
import {CopyFileItemType, FluentFfmpegErrorTypes, WsAppType, WsClientsType} from "../interface/Core.y";
import {FILE_TO_BASE64, GET_FILE_TYPE, RESOLVE_STATIC_FILE_PATH, STRING_TO_BINARY, STRINGIFY} from "../utils/Utils.y";

const TimeCut: TC = require('timecut');
const Ffmpeg: FFMPEG = require('fluent-ffmpeg');
const ResolvePath: Function = require('path').resolve;
const Fs: FS = require('fs-extra');
const OS = require('os');

class YingCore {
    private readonly WsPool: WsAppType;// Socket连接池
    private readonly Data: any;// 模板数据
    private Logs: Array<string>;// 日志
    private Schedule: number;// 进度
    private readonly TaskName: string;// 任务名称
    private readonly Name: string;// 模板名称
    private readonly TaskType: number;// 任务类型 0 or 1
    private readonly YingDB: YingDB;

    constructor(ws: WsAppType, data: any, type: number) {
        this.WsPool = ws;
        this.Data = data;
        this.TaskType = type;
        this.Logs = [];
        this.TaskName = `lmo_${new Date().getTime()}`;
        this.Schedule = 0;
        this.Name = this.Data.name === '' ? this.TaskName : this.Data.name;
        this.YingDB = new YingDB();

        // 是否允许发起合成
        if (!DefaultConf.__SYNTHESIS) {
            this.SendMessage(SHOW_MESSAGE, SHOW_MESSAGE, {
                message: Message.__SYNTHESIS_CLOSE
            });
            return;
        }

        // 是否合成任务
        if (this.TaskType === 0) {
            this.SendMessage(TASK_PENDING, TASK_PENDING, {
                taskName: this.Name
            });
        }

        // ffmpeg是否存在
        if (!Conf.__FFMPEG) {
            this.SendMessage(SHOW_MESSAGE, SHOW_MESSAGE, {
                message: Message.__NO_FFMPEG
            });
            return;
        }

        // 是否演示服务器
        if (Conf.__LIVE_SERVER) {
            this.SendMessage(SHOW_MESSAGE, SHOW_MESSAGE, {
                message: Message.__LIVE_SERVER
            });
        }

        this.Init();

    }

    Init(): void {
        this.CopyTempLate();
    }

    // 拷贝模板
    async CopyTempLate(): Promise<number> {
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

    // 写出模板配置文件
    WriteConfJSFile(conf: object, path: string): void {
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

    // 写出日志文件
    WriteLogFile(): void {
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

    // 拷贝文件
    CopyFile(from: string, to: string): void {
        Fs.readdirSync(from, {
            withFileTypes: true
        }).forEach((i: CopyFileItemType) => {
            Fs.copyFileSync(ResolvePath(from, i.name), ResolvePath(to, i.name));
        });
    }

    // 创建模板
    CreateTemplate(): void {
        const sql: string = this.YingDB.GetInsertTemplateTableSql({
            T_Name: this.TaskName,
            T_Id: `lmo_data_visualization_template_${this.TaskName}`,
            T_Title: this.Data.customize.title ?? '自定义模板',
            T_Description: this.Data.customize.description ?? '这是一个自定义模板',
            T_Path: '/static/DataVisualizationTemplate/' + this.TaskName + '/index.html',
            T_Type: 'customize'
        });

        this.YingDB.RunSql(sql, (e: any) => {
            if (e)
                console.warn('[YingWarn]:Core-CreateTemplate');
            else
                this.SendMessage(CREATE_TEMPLATE, SUCCESS);
        });
    }

    // 创建任务
    CreateTask(): void {
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
        });

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
            this.ProcessAudio(templateConf.audio.src !== '' ? `${Path.PROCESS_AUDIO.PATH.replace('$y', this.TaskName)}` : '', audioPath).then((r: number) => {
                    this.WriteLogFile();
                    const path = Path.SYNTHESIS.OUTPUT.replace('$y', `${this.TaskName}${r === 1 ? '' : '264'}`);

                    this.YingDB.UpdateResourceStatus({
                        status: 'Finish',
                        name: this.TaskName,
                        path: path
                    });

                    if (r === 1) {
                        setTimeout(async () => {
                            await this.YingDB.Close();
                            await this.SendMessage(TASK_END, TASK_END, {
                                state: 'success',
                                taskName: this.Name,
                                path: path
                            });
                        }, 2000);
                    } else
                        this.SendMessage(TASK_PRO, TASK_PRO, {
                            taskName: this.Name,
                            path: path
                        });
                    this.DelTempFiles(`${ResolvePath(`./static/temp/${this.TaskName}`)}`)
                }
            );
        }).catch(() => {
            this.SendMessage(TASK_END, TASK_END, {
                taskName: this.Name
            });
        });

    }

    // 处理音频
    ProcessAudio(src: string, audioPath: string): Promise<number> {
        return new Promise((resolve: any) => {
            this.SendMessage(TASK_PRO, TASK_PRO, {
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

            if (this.Data.config.audio.complete)
                ffmpeg.duration(this.Data.config.video.duration);// 设置持续时间
            ffmpeg.output(`${Path.PROCESS_AUDIO.OUTPUT.replace('$y', this.TaskName)}`);// 设置输入目录
            // 完毕
            ffmpeg.on('end', () => {
                Fs.unlinkSync(src);
                resolve();
            });
            // 出现异常
            ffmpeg.on('error', (e: FluentFfmpegErrorTypes) => {
                this.SendMessage(TASK_PRO, TASK_PRO, {
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

    // 删除临时文件
    DelTempFiles(path: string): void {
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

    // 取得视讯清晰度
    GetVideoClarity(type: string): object {
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

    // 发送消息
    SendMessage(type: string, cmd: string, data: object = {}): void {
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