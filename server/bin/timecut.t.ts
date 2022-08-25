/**
 * /bin/timecut/timecut.ts
 * @author ayuanlmo
 * @class TC
 * @constructor
 * **/
const _TimeCut = require('timecut');
const _Ffmpeg = require('fluent-ffmpeg');
const _Tool = require('../utils/utils.t');
const _ResolvePath = require('path').resolve;
const _PATH: any = require('../const/Path');

class TC {
    private readonly _Ws: any;
    private readonly _Data: any;
    private _Logs: Array<string>;
    private _Schedule: number;
    private readonly _Task_Name: string;
    private _Name: string;
    private readonly _Fs: any;
    private readonly _OS: any;
    private readonly _DB: any;

    constructor(ws: any, data: any) {
        this._Ws = ws;
        this._Data = data;
        this._Logs = [];
        this._Task_Name = `lmo_${new Date().getTime()}`;
        this._Fs = require('fs-extra');
        this._OS = require('os');
        this._DB = new (require('../lib/sqlite/sqlite.t').T_DB);
        this._Schedule = 0;
        this._Name = this._Data.name === '' ? this._Task_Name : this._Data.name;
        this.SEND_MESSAGE('task_pending', 'task_pending', {
            taskName: this._Name
        });
        if (!require('../conf/default.t').__SYNTHESIS) {
            this.SEND_MESSAGE('showMessage', 'showMessage', {
                message: require('../conf/Message.t').__SYNTHESIS_CLOSE,
                timestamp: new Date().getTime()
            });
            return;
        }
        if (!require('../conf/Conf.t').__FFMPEG) {
            this.SEND_MESSAGE('showMessage', 'showMessage', {
                message: require('../conf/Message.t').__NO_FFMPEG,
                timestamp: new Date().getTime()
            });
            return;
        }
        this.INIT();
    }

    INIT(): void {
        this.COPY_TEMPLATE();
    }

    OUTPUT_LOG_FILE(): void {
        const _logPath: string = _ResolvePath(_PATH.LOG.PATH);
        const s: string = '===== BEGIN LMO-DATA-VISUALIZATION TASK LOG =====\n';
        const e: string = '\n\n===== END LMO-DATA-VISUALIZATION TASK LOG =====';
        if (!this._Fs.existsSync(_logPath))
            this._Fs.mkdir(_logPath);
        const P = _ResolvePath(`${_logPath}/${this._Task_Name}.t.log`);

        this._Fs.writeFile(P, `${s}${this._Logs.join('\n')}${e}`, (e: any) => {
            if (!e) {
                this._Logs = [];
                this._DB.INSERT_LOG({
                    id: this._Task_Name,
                    log_file_path: `${_PATH.LOG.PATH.replace('.', '')}${this._Task_Name}.t.log`,
                    temp_file_path: '/'
                });
            }

        });
    }

    async COPY_TEMPLATE() {
        const _temp: string = _ResolvePath(_PATH.COPY_TEMPLATE.TEMP);
        const _: string = _ResolvePath(`${_PATH.COPY_TEMPLATE.THIS}${this._Task_Name}`);

        if (!this._Fs.existsSync(_temp))
            this._Fs.mkdir(_temp);
        if (!this._Fs.existsSync(_)) {
            this._Fs.mkdirSync(_);
            await this.COPY_FILE(`${_ResolvePath(`${_PATH.COPY_TEMPLATE.ORIGIN}`)}/${this._Data.template}`, _);
            const Origin = this._Data.templateConfig.background.image;

            if (Origin !== '') {
                const BaseHead = require('../const/ImageBase64Type').GET_IMAGE_BASE64_TYPE(require('../utils/utils.t').GET_FILE_TYPE(Origin));
                const Path = _ResolvePath(`./${require('../utils/utils.t').RESOLVE_STATIC_FILE_PATH(this._Data.templateConfig.background.image)}`);

                require('../utils/utils.t').FILE_TO_BASE64(Path).then(async (r: string) => {
                    this._Data.templateConfig.background.image = `${BaseHead}${r}`;
                    await this.WRITE_CONF_JS(this._Data.templateConfig, _);
                }).catch((e: any) => {
                    console.log('错误', e);
                })
            } else {
                await this.WRITE_CONF_JS(this._Data.templateConfig, _);
            }
        }
        return Promise.resolve(0);
    }

    WRITE_CONF_JS(conf: object, path: string) {
        this._Fs.writeFile(`${path}/conf.js`, `window.chartConfig = ${JSON.stringify({
            ...conf,
            _video: {
                ...this._Data.config.video
            }
        })};`, (e: any) => {
            if (!e)
                this.SYNTHESIS();
        });
    }

    COPY_FILE(dir: string, to: string): void {
        this._Fs.readdirSync(dir, {withFileTypes: true}).forEach((i: any) => {
            this._Fs.copyFileSync(_ResolvePath(dir, i.name), _ResolvePath(to, i.name));
        });
    }

    SYNTHESIS(): void {
        this._Logs.push(`\nCREATE AT: ${new Date().getTime()}`);
        this._Logs.push(`SOURCE TEMPLATE: ${this._Data.template}`);
        this._Logs.push(`PLATFORM: ${this._OS.type()} / ${this._OS.platform()} / ${this._OS.arch()} / ${this._OS.release()}`);
        this._Logs.push(`NODE VERSION: ${process.version}`);
        this._Logs.push(`CURRENT: ${_PATH.SYNTHESIS.CURRENT_TEMPLATE.replace('$t', this._Task_Name)}`);
        this._Logs.push(`CONFIG ${require('../funcs.t').STRINGIFY(this._Data)}\n\n`);
        let audioPath = '';
        this._DB.SET_RESOURCE({
            name: this._Name,
            path: '/',
            status: 'Processing',
            id: this._Task_Name
        });
        const _ = this._Data.config;
        const _conf: object = {
            url: `http://localhost:${require('../conf/Conf.t').__SERVER_PORT}${_PATH.SYNTHESIS.SERVER.replace('$t', this._Task_Name)}`,
            selector: '#app',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            pipeMode: require('os').freemem() / 1024 / 1024 > 2048,
            fps: parseInt(_.video.fps),
            duration: _.video.duration,
            output: _PATH.SYNTHESIS.OUTPUT.replace('$t', this._Task_Name),
            viewport: {
                ...this.GET_VIDEO_CLARITY(_.video.clarity)
            },
            preparePageForScreenshot: async (page: any, currentFrame: number, totalFrames: number) => {
                this._Schedule = parseInt(String(currentFrame / totalFrames * 100));
                await this.SEND_MESSAGE('task_processing', 'task_processing', {
                    taskName: this._Name,
                    schedule: this._Schedule
                });
            }
        };

        if (_.audio.src !== '') {
            audioPath = _ResolvePath(`.${_.audio.src}`);
            if (this._Fs.existsSync(audioPath))
                this._Data.config.audio.src = audioPath;
            else
                this._Data.config.audio.src = ''
        }

        _TimeCut(_conf).then(() => {
            this.PROCESS_AUDIO(_.audio.src !== '' ? `${_PATH.PROCESS_AUDIO.PATH.replace('$t', this._Task_Name)}` : '', audioPath).then((_r: number) => {
                this.OUTPUT_LOG_FILE();
                const P = _PATH.SYNTHESIS.OUTPUT.replace('$t', `${this._Task_Name}${_r === 1 ? '' : '264'}`);

                this._DB.UPDATE_RESOURCE_STATUS({
                    status: 'Finish',
                    name: this._Task_Name,
                    path: P
                });

                if (_r === 1) {
                    setTimeout(() => {
                        this._DB.CLOSE();
                        this.SEND_MESSAGE('task_end', 'task_processing', {
                            state: 'success',
                            taskName: this._Name,
                            path: P
                        });
                    }, 2000);
                } else {
                    this.SEND_MESSAGE('task_pro', 'task_pro_success', {
                        taskName: this._Name,
                        path: P
                    });
                }
                this.DEL_TEMP_FILE(`${_ResolvePath(`./static/temp/${this._Task_Name}`)}`);
            });
        }).catch(() => {
            this.SEND_MESSAGE('task_end', 'error', {
                taskName: this._Name
            });
        });
    }

    PROCESS_AUDIO(src: string, audio: string): Promise<number> {
        return new Promise((resolve: any) => {
            this.SEND_MESSAGE('task_pro', 'task_pro_ready', {
                taskName: this._Name
            });
            if (src === '')
                return resolve(1);
            const _ = _Ffmpeg(src);

            _.videoCodec('libx264');
            _.input(audio);
            _.audioFilters(`volume=${this._Data.config.audio.volume}`);
            _.audioBitrate('128k');
            if (!this._Data.config.audio.complete)
                _.duration(this._Data.config.video.duration);
            _.output(`${_PATH.PROCESS_AUDIO.OUTPUT.replace('$t', this._Task_Name)}`);
            _.on('end', () => {
                this._Fs.unlinkSync(src);
                resolve();
            });
            _.on('error', (_e: any) => {
                this.SEND_MESSAGE('task_pro', 'task_pro_error', {
                    message: _e.message
                });
            });
            _.on('stderr', (msg: string) => {
                this.SEND_MESSAGE('task_processing', 'task_processing', {
                    taskName: this._Name,
                    message: msg
                });
            });
            _.run();
        });
    }

    SEND_MESSAGE(type: string, cmd: string, data: object = {}): void {
        if (type !== 'task_pending' && cmd !== 'task_pending')
            this._Logs.push(`[${new Date().getTime()}]${type} ${cmd} > ${require('../funcs.t').STRINGIFY(data)}`);
        this._Ws.clients.forEach((i: any) => {
            i.send(_Tool.STRING_TO_BINARY(require('../funcs.t').STRINGIFY(
                {
                    type: type,
                    data: {
                        cmd: cmd,
                        ...data
                    }
                }
            )));
        });
    }

    DEL_TEMP_FILE(_path: string): void {
        let _: Array<any> = [];

        if (this._Fs.existsSync(_path)) {
            _ = this._Fs.readdirSync(_path);
            _.forEach((_f: string) => {
                const __ = _path + "/" + _f;

                if (this._Fs.statSync(__).isDirectory())
                    this.DEL_TEMP_FILE(__);
                else
                    this._Fs.unlinkSync(__);
            });
            this._Fs.rmdirSync(_path);
        }
    }

    GET_VIDEO_CLARITY(k: string) {
        if (k === '1080P')
            return {
                width: 1920,
                height: 1080
            };
        if (k === '2K')
            return {
                width: 2560,
                height: 1440
            };
        if (k === '4K')
            return {
                width: 4096,
                height: 2160
            };
    }
}

module.exports.TC = TC;
