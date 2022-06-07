const timeCut = require('timecut');
const fs = require('fs-extra');
const path = require('path');

class TC {
    constructor(ws = {}, data) {
        this.ws = ws;//获得socket对象
        this.data = data;//获得数据
        console.log('初始化',this.data)
        console.log('初始化', typeof  this.data);
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

                //替换 配置文件对象
                fs.writeFile(`${dir}/conf.js`, `${str}${JSON.stringify(this.data['templateConfig'])};`, e => {
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
    _synthesis(fps = 30, duration = 1) {
        const _data = this.data['config'];

        timeCut({
                url: `http://localhost:3000/static/temp/${this.taskName}/index.html`,
                viewport: {width: 1920, height: 1080},
                selector: '#app',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                fps: parseInt(_data.video.fps),
                duration: _data.video.duration,
                // pixFmt: 'yuv420p',
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
            }
        ).then(() => {
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
    }

    _delTempFile(_path) {
        let files = [];

        if (fs.existsSync(_path)) {
            files = fs.readdirSync(_path);
            files.forEach((file, index) => {
                const curPath = _path + "/" + file;

                if (fs.statSync(curPath).isDirectory()) {
                    this._delTempFile(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });
            fs.rmdirSync(_path);
        }
    }
}

module.exports.TC = TC;