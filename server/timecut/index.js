const _TimeCut = require('timecut');
const _Fs = require('fs-extra');
const _Path = require('path');
const _Ffmpeg = require('fluent-ffmpeg');
const _Tool = require('../utils/index');

class TC {
    constructor(ws = null, data) {
        this['ws'] = ws;
        this['data'] = data;
        this['taskName'] = `lmo_${new Date()['getTime']()}`;
        this['_SendMessage']('task_pending', 'task_pending', {
            taskName: this['taskName']
        });
        this['_Init']();
    }

    _Init() {
        this['_CopyTemplate']();
    }

    _CopyTemplate() {
        const _temp = '../server/static/temp/';
        const _ = `../server/static/temp/${this['taskName']}`;

        if (!_Fs['existsSync'](_temp))
            _Fs['mkdir'](_temp);
        if (!_Fs['existsSync'](_)) {
            _Fs['mkdir'](_);
            this['_CopyFile'](`../server/static/DataVisualizationTemplate/${this['data']['template']}`, _);
            setTimeout(() => {
                _Fs['writeFile'](`${_}/conf.js`, `window.chartConfig = ${JSON['stringify']({
                    ...this['data']['templateConfig'],
                    _video: {
                        ...this['data']['config']['video']
                    }
                })};`, e => {
                    if (!e)
                        this['_Synthesis']();
                });
            }, 1000);
        }
    }

    _CopyFile(dir, to) {
        _Fs['readdirSync'](dir, {withFileTypes: true})['forEach'](i => {
            _Fs['copyFileSync'](_Path['resolve'](dir, i['name']), _Path['resolve'](to, i['name']));
        });
    }

    _Synthesis() {
        let audioPath = '';
        const _ = this['data']['config'];
        const _conf = {
            url: `http://localhost:${global['__SERVER_PORT']}/static/temp/${this['taskName']}/index.html`,
            viewport: {
                ...this['_GetVideoClarity'](_['video']['clarity'])
            },
            selector: '#app',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            fps: parseInt(_['video']['fps']),
            duration: _['video']['duration'],
            output: `static/output/${this['taskName']}.mp4`,
            preparePageForScreenshot: async () => {
                this['_SendMessage']('task_processing', 'task_processing', {
                    state: this['taskName']
                });
            }
        };

        if (_['audio']['src'] !== '') {
            const buffer = Buffer['from'](_['audio']['src']['replace']('data:audio/x-m4a;base64,', ''), 'base64');

            _Fs['writeFile'](`../server/static/temp/${this['taskName']}.m4a`, buffer, (e) => {
                if (!e)
                    audioPath = `../server/static/temp/${this['taskName']}.m4a`;
            });
        }

        _TimeCut(_conf).then(() => {
            this['_ProcessAudio'](_['audio']['src'] !== '' ? `static/output/${this['taskName']}.mp4` : '', audioPath).then((_r) => {
                if (_r === 1) {
                    setTimeout(() => {
                        this['_SendMessage']('task_end', 'task_processing', {
                            state: 'success',
                            taskName: this['taskName'],
                            path: `/static/output/'${this['taskName']}.mp4`
                        });
                    }, 2000);
                } else
                    this['_SendMessage']('task_pro', 'task_pro_success', {
                        taskName: this['taskName']
                    });
                this['_DelTempFile'](`${_Path['resolve'](`../server/static/temp/${this['taskName']}`)}`);
            });
        });
    }

    _ProcessAudio(src, audio) {
        return new Promise((resolve) => {
            this['_SendMessage']('task_pro', 'task_pro_ready', {
                taskName: this['taskName']
            });
            if (src === '')
                return resolve(1);
            const _ = _Ffmpeg(src);

            _['videoCodec']('libx264');
            _['input'](audio);
            _['audioFilters'](`volume=${this['data']['config']['audio']['volume']}`);
            _['audioBitrate']('128k');
            if (!this['data']['config']['audio']['complete'])
                _['duration'](this['data']['config']['video']['duration']);
            _['output'](`static/output/${this['taskName']}264.mp4`);
            _['on']('end', () => {
                _Fs['unlinkSync'](src);
                _Fs['unlinkSync'](audio);
                resolve();
            });
            _['on']('error', (_e) => {
                this['_SendMessage']('task_pro', 'task_pro_error', {
                    message: _e['message']
                });
            });
            _['on']('stderr', (msg) => {
                this['_SendMessage']('task_processing', 'task_processing', {
                    taskName: this['taskName'],
                    message: msg
                });
            });
            _['run']();
        });
    }

    _SendMessage(type, cmd, data = {}) {
        this['ws']['clients']['forEach'](i => {
            i['send'](_Tool.stringToBinary(require('../funcs')['_Stringify'](
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

    _DelTempFile(_path) {
        let _ = [];

        if (_Fs['existsSync'](_path)) {
            _ = _Fs['readdirSync'](_path);
            _['forEach']((_f) => {
                const __ = _path + "/" + _f;

                if (_Fs['statSync'](__)['isDirectory']())
                    this['_DelTempFile'](__);
                else
                    _Fs['unlinkSync'](__);
            });
            _Fs['rmdirSync'](_path);
        }
    }

    _GetVideoClarity(k) {
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