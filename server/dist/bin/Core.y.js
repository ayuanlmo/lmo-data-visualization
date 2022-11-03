"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path_y_1 = require("../const/Path.y");
const Conf_y_1 = require("../conf/Conf.y");
const Default_y_1 = require("../conf/Default.y");
const Message_y_1 = require("../conf/Message.y");
const DataBase_y_1 = require("../lib/sqlite/DataBase.y");
const ImageBase64Type_y_1 = require("../const/ImageBase64Type.y");
const MessageTypes_y_1 = require("../const/MessageTypes.y");
const Utils_y_1 = require("../utils/Utils.y");
const TimeCut = require('timecut');
const Ffmpeg = require('fluent-ffmpeg');
const ResolvePath = require('path').resolve;
const Fs = require('fs-extra');
const OS = require('os');
class YingCore {
    constructor(ws, data, type) {
        this.WsPool = ws;
        this.Data = data;
        this.TaskType = type;
        this.Logs = [];
        this.TaskName = `lmo_${new Date().getTime()}`;
        this.Schedule = 0;
        this.Name = this.Data.name === '' ? this.TaskName : this.Data.name;
        this.YingDB = new DataBase_y_1.default();
        if (!Default_y_1.default.__SYNTHESIS) {
            this.SendMessage(MessageTypes_y_1.SHOW_MESSAGE, MessageTypes_y_1.SHOW_MESSAGE, {
                message: Message_y_1.default.__SYNTHESIS_CLOSE
            });
            return;
        }
        if (this.TaskType === 0) {
            this.SendMessage(MessageTypes_y_1.TASK_PENDING, MessageTypes_y_1.TASK_PENDING, {
                taskName: this.Name
            });
        }
        if (!Conf_y_1.default.__FFMPEG) {
            this.SendMessage(MessageTypes_y_1.SHOW_MESSAGE, MessageTypes_y_1.SHOW_MESSAGE, {
                message: Message_y_1.default.__NO_FFMPEG
            });
            return;
        }
        if (Conf_y_1.default.__LIVE_SERVER) {
            this.SendMessage(MessageTypes_y_1.SHOW_MESSAGE, MessageTypes_y_1.SHOW_MESSAGE, {
                message: Message_y_1.default.__LIVE_SERVER
            });
            return;
        }
        this.Init();
    }
    Init() {
        this.CopyTempLate();
    }
    CopyTempLate() {
        return __awaiter(this, void 0, void 0, function* () {
            const tmp = ResolvePath(this.TaskType === 0 ? Path_y_1.default.COPY_TEMPLATE.TEMP : Path_y_1.default.COPY_TEMPLATE.ORIGIN + '/');
            const src = ResolvePath(`${this.TaskType === 0 ? Path_y_1.default.COPY_TEMPLATE.THIS : Path_y_1.default.COPY_TEMPLATE.ORIGIN + '/'}${this.TaskName}`);
            if (!Fs.existsSync(tmp))
                Fs.mkdir(tmp);
            if (!Fs.existsSync(src)) {
                Fs.mkdirSync(src);
                yield this.CopyFile(`${ResolvePath(`${Path_y_1.default.COPY_TEMPLATE.ORIGIN}`)}/${this.Data.template}`, src);
                const origin = this.Data.templateConfig.background.image;
                if (origin !== '') {
                    const base = (0, ImageBase64Type_y_1.GET_IMAGE_BASE64_TYPE)((0, Utils_y_1.GET_FILE_TYPE)(origin));
                    const path = ResolvePath(`./${(0, Utils_y_1.RESOLVE_STATIC_FILE_PATH)(this.Data.templateConfig.background.image)}`);
                    (0, Utils_y_1.FILE_TO_BASE64)(path).then((res) => __awaiter(this, void 0, void 0, function* () {
                        this.Data.templateConfig.background.image = `${base}${res}`;
                        yield this.WriteConfJSFile(this.Data.templateConfig, src);
                    })).catch((e) => {
                        console.warn('YingWarn: [FILE_TO_BASE64]', e);
                    });
                }
                else
                    yield this.WriteConfJSFile(this.Data.templateConfig, src);
            }
            return Promise.resolve(0);
        });
    }
    WriteConfJSFile(conf, path) {
        const data = this.TaskType === 1 ? {} : {
            _video: Object.assign({}, this.Data.config.video)
        };
        Fs.writeFile(`${path}/conf.js`, `window.chartConfig = ${(0, Utils_y_1.STRINGIFY)(Object.assign(Object.assign({}, conf), data))};`, (e) => {
            if (!e) {
                if (this.TaskType === 0)
                    this.CreateTask();
                if (this.TaskType === 1)
                    this.CreateTemplate();
            }
        });
    }
    WriteLogFile() {
        const logPath = ResolvePath(Path_y_1.default.LOG.PATH);
        const s = '===== BEGIN LMO-DATA-VISUALIZATION TASK LOG =====\n';
        const e = '\n\n===== END LMO-DATA-VISUALIZATION TASK LOG =====';
        if (!Fs.existsSync(logPath))
            Fs.mkdir(logPath);
        const path = ResolvePath(`${logPath}/${this.TaskName}.y.log`);
        Fs.writeFile(path, `${s}${this.Logs.join('\n')}${e}`, ((e) => {
            if (!e) {
                this.Logs = [];
                this.YingDB.InsertLog({
                    id: this.TaskName,
                    logFilePath: `${Path_y_1.default.LOG.PATH.replace('.', '')}${this.TaskName}.y.log`,
                    tempFilePath: '/'
                });
            }
        }));
    }
    CopyFile(from, to) {
        Fs.readdirSync(from, {
            withFileTypes: true
        }).forEach((i) => {
            Fs.copyFileSync(ResolvePath(from, i.name), ResolvePath(to, i.name));
        });
    }
    CreateTemplate() {
        var _a, _b;
        const sql = this.YingDB.GetInsertTemplateTableSql({
            T_Name: this.TaskName,
            T_Id: `lmo_data_visualization_template_${this.TaskName}`,
            T_Title: (_a = this.Data.customize.title) !== null && _a !== void 0 ? _a : '自定义模板',
            T_Description: (_b = this.Data.customize.description) !== null && _b !== void 0 ? _b : '这是一个自定义模板',
            T_Path: '/static/DataVisualizationTemplate/' + this.TaskName + '/index.html',
            T_Type: 'customize'
        });
        this.YingDB.RunSql(sql, (e) => {
            if (e)
                console.warn('[YingWarn]:Core-CreateTemplate');
            else
                this.SendMessage(MessageTypes_y_1.CREATE_TEMPLATE, MessageTypes_y_1.SUCCESS);
        });
    }
    CreateTask() {
        var _a;
        this.Logs.push(`\nCREATE AT: ${new Date().getTime()}`);
        this.Logs.push(`SOURCE TEMPLATE: ${this.Data.template}`);
        this.Logs.push(`PLATFORM: ${OS.type()} / ${OS.platform()} / ${OS.arch()} / ${OS.release()}`);
        this.Logs.push(`NODE VERSION: ${process.version}`);
        this.Logs.push(`CURRENT: ${Path_y_1.default.SYNTHESIS.CURRENT_TEMPLATE.replace('$t', this.TaskName)}`);
        this.Logs.push(`CONFIG ${(0, Utils_y_1.STRINGIFY)(this.Data)}\n\n`);
        let audioPath = '';
        this.YingDB.SetResourcesItem({
            name: this.Name,
            path: '/',
            status: 'Processing',
            id: this.TaskName
        });
        const templateConf = this.Data.config;
        const conf = {
            url: `http://localhost:${Conf_y_1.default.__SERVER_PORT}${Path_y_1.default.SYNTHESIS.SERVER.replace('$y', this.TaskName)}`,
            selector: '#app',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            pipeMode: OS.freemem() / 1024 / 1024 > 2048,
            fps: parseInt(templateConf.video.fps),
            duration: templateConf.video.duration,
            output: Path_y_1.default.SYNTHESIS.OUTPUT.replace('$y', this.TaskName),
            viewport: Object.assign({}, this.GetVideoClarity((_a = templateConf.video.clarity) !== null && _a !== void 0 ? _a : '1080P')),
            preparePageForScreenshot: (page, currentFrame, totalFrames) => __awaiter(this, void 0, void 0, function* () {
                if (page) {
                    const schedule = parseInt(String(currentFrame / totalFrames * 100));
                    if (this.Schedule !== schedule) {
                        this.Schedule = schedule;
                        yield this.SendMessage(MessageTypes_y_1.TASK_PROCESSING, MessageTypes_y_1.TASK_PROCESSING, {
                            taskName: this.Name,
                            schedule: this.Schedule,
                            taskId: this.TaskName
                        });
                    }
                }
            })
        };
        if (templateConf.audio.src !== '') {
            audioPath = ResolvePath(`.${templateConf.audio.src}`);
            if (Fs.existsSync(audioPath))
                this.Data.config.audio.src = audioPath;
            else
                this.Data.config.audio.src = '';
        }
        TimeCut(conf).then(() => {
            this.ProcessAudio(templateConf.audio.src !== '' ? `${Path_y_1.default.PROCESS_AUDIO.PATH.replace('$y', this.TaskName)}` : '', audioPath).then((r) => __awaiter(this, void 0, void 0, function* () {
                yield this.WriteLogFile();
                const path = Path_y_1.default.SYNTHESIS.OUTPUT.replace('$y', `${this.TaskName}${r === 1 ? '' : '264'}`);
                yield this.YingDB.UpdateResourceStatus({
                    status: 'Finish',
                    name: this.TaskName,
                    path: path
                });
                const sendSuccessMessage = () => {
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield this.YingDB.Close();
                        yield this.SendMessage(MessageTypes_y_1.TASK_END, MessageTypes_y_1.TASK_PROCESSING, {
                            state: 'success',
                            taskName: this.Name,
                            path: path
                        });
                    }), 2000);
                };
                if (r === 1) {
                    yield sendSuccessMessage();
                }
                else {
                    this.SendMessage(MessageTypes_y_1.TASK_PRO, MessageTypes_y_1.TASK_PRO_SUCCESS, {
                        taskName: this.Name,
                        path: path
                    });
                    yield sendSuccessMessage();
                }
                yield this.DelTempFiles(`${ResolvePath(`./static/temp/${this.TaskName}`)}`);
            }));
        }).catch(() => {
            this.SendMessage(MessageTypes_y_1.TASK_END, MessageTypes_y_1.TASK_END, {
                taskName: this.Name
            });
        });
    }
    ProcessAudio(src, audioPath) {
        return new Promise((resolve) => {
            this.SendMessage(MessageTypes_y_1.TASK_PRO, MessageTypes_y_1.TASK_PRO_READY, {
                taskName: this.Name
            });
            if (src === '')
                return resolve(1);
            const ffmpeg = Ffmpeg(src);
            ffmpeg.videoCodec('libx264');
            ffmpeg.input(audioPath);
            ffmpeg.audioFilters(`volume=${this.Data.config.audio.volume}`);
            ffmpeg.audioBitrate('128k');
            if (!this.Data.config.audio.complete)
                ffmpeg.duration(this.Data.config.video.duration);
            ffmpeg.output(`${Path_y_1.default.PROCESS_AUDIO.OUTPUT.replace('$y', this.TaskName)}`);
            ffmpeg.on('end', () => {
                Fs.unlinkSync(src);
                resolve();
            });
            ffmpeg.on('error', (e) => {
                this.SendMessage(MessageTypes_y_1.TASK_PRO, MessageTypes_y_1.TASK_ERROR, {
                    message: e.message
                });
            });
            ffmpeg.on('stderr', (msg) => {
                this.SendMessage(MessageTypes_y_1.TASK_PROCESSING, MessageTypes_y_1.TASK_PROCESSING, {
                    taskName: this.Name,
                    message: msg
                });
            });
            ffmpeg.run();
        });
    }
    DelTempFiles(path) {
        let files = [];
        if (Fs.existsSync(path)) {
            files = Fs.readdirSync(path);
            files.forEach((i) => {
                const tmp = `${path}/${i}`;
                if (Fs.statSync(tmp).isDirectory())
                    this.DelTempFiles(tmp);
                else
                    Fs.unlinkSync(tmp);
            });
            Fs.rmdirSync(path);
        }
    }
    GetVideoClarity(type) {
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
    SendMessage(type, cmd, data = {}) {
        if (type !== 'task_pending' && cmd !== 'task_pending')
            this.Logs.push(`[${new Date().getTime()}]${type} ${cmd} > ${(0, Utils_y_1.STRINGIFY)(data)}`);
        this.WsPool.clients.forEach((i) => {
            i.send((0, Utils_y_1.STRING_TO_BINARY)((0, Utils_y_1.STRINGIFY)({
                type: type,
                data: Object.assign({ cmd: cmd, timestamp: new Date().getTime() }, data)
            })));
        });
    }
}
exports.default = YingCore;
//# sourceMappingURL=Core.y.js.map