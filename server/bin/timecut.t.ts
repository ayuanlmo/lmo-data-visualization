/**
 * /bin/timecut/timecut.ts
 * @author ayuanlmo
 * @class TC
 * @constructor
 * **/
import * as path from "path";

const _TimeCut = require('timecut');
const _Ffmpeg = require('fluent-ffmpeg');
const _Tool = require('../utils/utils.t');

class TC {
    private readonly ws: any;
    private readonly data: any;
    private logs: Array<string>;
    private schedule: number;
    private readonly taskName: string;
    private readonly _Fs: any;
    private readonly _Path: any;
    private readonly _OS: any;

    constructor(ws: object, data: any) {
        this.ws = ws;
        this.data = data;
        this.logs = [];
        this.taskName = `lmo_${new Date().getTime()}`;
        this._Fs = require('fs-extra');
        this._Path = require('path');
        this._OS = require('os');
        this._SendMessage('task_pending', 'task_pending', {
            taskName: this.taskName
        });
        this.schedule = 0;
        this._Init();
    }

    _Init(): void {
        this._CopyTemplate();
    }

    _OutputLogFile(): void {
        const _logPath: string = '../server/static/log/';
        const s: string = '===== BEGIN LMO-DATA-VISUALIZATION TASK LOG =====\n';
        const e: string = '\n\n===== END LMO-DATA-VISUALIZATION TASK LOG =====';

        if (!this._Fs.existsSync(_logPath))
            this._Fs.mkdir(_logPath);
        this._Fs.writeFile(`${_logPath}${this.taskName}.t.log`, `${s}${this.logs.join('\n')}${e}`, (e: any) => {
            if (!e)
                this.logs = [];
        });
    }

    _CopyTemplate(): void {
        const _temp: string = '../server/static/temp/';
        const _: string = `../server/static/temp/${this.taskName}`;

        if (!this._Fs.existsSync(_temp))
            this._Fs.mkdir(_temp);
        if (!this._Fs.existsSync(_)) {
            this._Fs.mkdir(_);
            this._CopyFile(`../server/static/DataVisualizationTemplate/${this.data.template}`, _);
            setTimeout(() => {
                this._Fs.writeFile(`${_}/conf.js`, `window.chartConfig = ${JSON.stringify({
                    ...this.data.templateConfig,
                    _video: {
                        ...this.data.config.video
                    }
                })};`, (e: any) => {
                    if (!e)
                        this._Synthesis();
                });
            }, 1000);
        }
    }

    _CopyFile(dir: string, to: string): void {
        this._Fs.readdirSync(path.resolve(dir), {withFileTypes: true}).forEach((i: any) => {
            this._Fs.copyFileSync(this._Path.resolve(dir, i.name), this._Path.resolve(to, i.name));
        });
    }

    _Synthesis(): void {
        this.logs.push(`\nCREATE AT: ${new Date().getTime()}`);
        this.logs.push(`SOURCE TEMPLATE: ${this.data.template}`);
        this.logs.push(`PLATFORM: ${this._OS.type()} / ${this._OS.platform()} / ${this._OS.arch()} / ${this._OS.release()}`);
        this.logs.push(`NODE VERSION: ${process.version}`);
        this.logs.push(`CURRENT: /static/temp/${this.taskName}/index.html\n`);
        this.logs.push(`CONFIG ${require('../funcs.t')._Stringify(this.data)}\n\n`);
        let audioPath = '';
        const _ = this.data.config;
        const _conf: object = {
            url: `http://localhost:${require('../conf/conf.t').__SERVER_PORT}/static/temp/${this.taskName}/index.html`,
            selector: '#app',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            pipeMode: require('os').freemem() / 1024 / 1024 > 2048,
            fps: parseInt(_.video.fps),
            duration: _.video.duration,
            output: `static/output/${this.taskName}.mp4`,
            viewport: {
                ...this._GetVideoClarity(_.video.clarity)
            },
            preparePageForScreenshot: async (page: any, currentFrame: number, totalFrames: number) => {
                this.schedule = parseInt(String(currentFrame / totalFrames * 100));
                await this._SendMessage('task_processing', 'task_processing', {
                    taskName: this.taskName,
                    schedule: this.schedule
                });
            }
        };

        if (_.audio.src !== '') {
            const buffer: any = Buffer.from(_.audio.src.replace('data:audio/x-m4a;base64,', ''), 'base64');

            this._Fs['writeFile'](`../server/static/temp/${this.taskName}.m4a`, buffer, (e: any) => {
                if (!e)
                    audioPath = `../server/static/temp/${this.taskName}.m4a`;
            });
        }

        _TimeCut(_conf).then(() => {
            this._ProcessAudio(_.audio.src !== '' ? `static/output/${this.taskName}.mp4` : '', audioPath).then((_r) => {
                this._OutputLogFile();
                if (_r === 1) {
                    setTimeout(() => {
                        this._SendMessage('task_end', 'task_processing', {
                            state: 'success',
                            taskName: this.taskName,
                            path: `/static/output/'${this.taskName}.mp4`
                        });
                    }, 2000);
                } else
                    this._SendMessage('task_pro', 'task_pro_success', {
                        taskName: this.taskName
                    });
                this._DelTempFile(`${this._Path.resolve(`../server/static/temp/${this.taskName}`)}`);
            });
        }).catch(() => {
            this._SendMessage('task_end', 'error', {
                taskName: this.taskName
            });
        });
    }

    _ProcessAudio(src: string, audio: string) {
        return new Promise((resolve: any) => {
            this._SendMessage('task_pro', 'task_pro_ready', {
                taskName: this.taskName
            });
            if (src === '')
                return resolve(1);
            const _ = _Ffmpeg(src);

            _.videoCodec('libx264');
            _.input(audio);
            _.audioFilters(`volume=${this.data.config.audio.volume}`);
            _.audioBitrate('128k');
            if (!this.data.config.audio.complete)
                _.duration(this.data.config.video.duration);
            _.output(`static/output/${this.taskName}264.mp4`);
            _.on('end', () => {
                this._Fs.unlinkSync(src);
                this._Fs.unlinkSync(audio);
                resolve();
            });
            _.on('error', (_e: any) => {
                this._SendMessage('task_pro', 'task_pro_error', {
                    message: _e.message
                });
            });
            _.on('stderr', (msg: string) => {
                this._SendMessage('task_processing', 'task_processing', {
                    taskName: this.taskName,
                    message: msg
                });
            });
            _.run();
        });
    }

    _SendMessage(type: string, cmd: string, data: object = {}): void {
        if (type !== 'task_pending' && cmd !== 'task_pending')
            this.logs.push(`[${new Date().getTime()}]${type} ${cmd} > ${require('../funcs.t')._Stringify(data)}`);
        this.ws.clients.forEach((i: any) => {
            i['send'](_Tool.stringToBinary(require('../funcs.t')['_Stringify'](
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

    _DelTempFile(_path: string): void {
        let _: Array<any> = [];

        if (this._Fs.existsSync(_path)) {
            _ = this._Fs.readdirSync(_path);
            _.forEach((_f: string) => {
                const __ = _path + "/" + _f;

                if (this._Fs.statSync(__).isDirectory())
                    this._DelTempFile(__);
                else
                    this._Fs.unlinkSync(__);
            });
            this._Fs.rmdirSync(_path);
        }
    }

    _GetVideoClarity(k: string) {
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
