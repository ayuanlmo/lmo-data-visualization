const timeCut = require('timecut');
const fs = require('fs-extra');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

class TC {
    constructor(ws = {}, data) {
        this.ws = ws;//获得socket对象
        this.data = data;//获得数据
        this.taskName = `lmo_${new Date().getTime()}`;//创建任务名称
        //下发任务状态
        this.ws.send(require('../funcs')._stringify({
            type: 'task_pending',
            data: {
                cmd: 'task_pending',
                taskName: this.taskName
            }
        }));
        this._init();//初始化
    }

    _init() {
        this._copyTemplate();
    }

    _copyTemplate() {
        const _temp = '../server/static/temp/';

        //临时文件夹是否存在
        if (!fs.existsSync(_temp)) {
            fs.mkdir(_temp);
        }
        const dir = `../server/static/temp/${this.taskName}`;

        if (!fs.existsSync(dir)) {
            fs.mkdir(dir);
            this._copyFile(`../server/static/DataVisualizationTemplate/${this.data.template}`, dir);

            setTimeout(() => {
                const str = 'window.chartConfig = ';

                const data = {
                    ...this.data['templateConfig'],
                    _video: {
                        ...this.data['config']['video']
                    }
                };

                //替换 配置文件对象
                fs.writeFile(`${dir}/conf.js`, `${str}${JSON.stringify(data)};`, e => {
                    if (e) {
                        console.log('模板配置文件替换失败');
                    } else {
                        this._synthesis();//开始合成视频
                    }
                });
            }, 1000);
        }
    }

    //复制
    _copyFile(dir, to) {
        const sourceFile = fs.readdirSync(dir, {withFileTypes: true});//获取源文件

        sourceFile.forEach(i => {
            const n = path.resolve(dir, i.name);
            const t = path.resolve(to, i.name);

            fs.copyFileSync(n, t);
        });
    }

    //合成
    _synthesis() {
        let audioPath = '';
        const _data = this.data['config'];
        const _conf = {
            url: `http://localhost:${global.__SSERVER_PORT}/static/temp/${this.taskName}/index.html`,
            viewport: {
                ...this._getVideoClarity(_data.video.clarity)
            },
            selector: '#app',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            fps: parseInt(_data.video.fps),
            duration: _data.video.duration,
            output: `static/output/${this.taskName}.mp4`,
            preparePageForScreenshot: async () => {
                this.ws.send(require('../funcs')._stringify({
                    type: 'task_processing',
                    data: {
                        cmd: 'task_processing',
                        state: this.taskName
                    }
                }));
            }
        };

        //判断音频是否存在
        if (_data['audio']['src'] !== '') {
            const buffer = Buffer.from(_data['audio']['src'].replace('data:audio/x-m4a;base64,', ''), 'base64');

            fs.writeFile(`../server/static/temp/${this.taskName}.m4a`, buffer, (e) => {
                if (e)
                    console.log('音频保存失败');
                else
                    audioPath = `../server/static/temp/${this.taskName}.m4a`;
            });
        }

        timeCut(_conf).then((conf) => {
            //合成完成 处理音频
            this._processAudio(_data['audio']['src'] !== '' ? `static/output/${this.taskName}.mp4` : '', audioPath).then(() => {
                this.ws.send(require('../funcs')._stringify(
                    {
                        type: 'task_end',
                        data: {
                            cmd: 'task_processing',
                            state: 'success',
                            taskName: this.taskName,
                            path: `/static/output/'${this.taskName}.mp4`
                        }
                    }
                ));
                //删除临时目录
                this._delTempFile(`${path.resolve(`../server/static/temp/${this.taskName}`)}`);
            });
        });
    }

    _processAudio(src, audio) {
        return new Promise((resolve, reject) => {
            if (src === '')
                return resolve();
            const f = ffmpeg(src);

            f.videoCodec('libx264');//兼容Chrome的H.264视频编码
            f.input(audio);
            f.audioFilters(`volume=${this.data['config']['audio']['volume']}`);
            f.audioBitrate('128k');
            if (!this.data['config']['audio']['complete'])
                f.duration(this.data['config']['video']['duration']);
            f.output(`static/output/${this.taskName}264.mp4`);
            f.on('end', function () {
                fs.unlinkSync(src);
                fs.unlinkSync(audio);
                resolve();
            });
            f.run();
        });

    }

    _delTempFile(_path) {
        let files = [];

        if (fs.existsSync(_path)) {
            files = fs.readdirSync(_path);
            files.forEach((file, index) => {
                const curPath = _path + "/" + file;

                if (fs.statSync(curPath).isDirectory())
                    this._delTempFile(curPath); //递归删除文件夹
                else
                    fs.unlinkSync(curPath); //删除文件
            });
            fs.rmdirSync(_path);
        }
    }

    _getVideoClarity(k, s = 'w') {
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