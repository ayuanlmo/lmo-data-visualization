/**
 * timeCut module
 * @author ayuanlmo
 * @module timecut
 * @module fs-extra
 * @module path
 * Created by ayuanlmo on 2022/06
 * **/

const timeCut = require('timecut');
const fs = require('fs-extra');
const path = require('path');

class TC {
    constructor(_WS = {}, _DATA = {}) {
        this._WS = _WS;//获得socket对象
        this._DATA = _DATA;//获得数据
        this._TASK_NAME = `lmo_${new Date().getTime()}`;//创建任务名称
        //下发任务状态
        this._WS.send(require('../funcs').__STRINGIFY({
            type: 'task_pending',
            data: {
                cmd: 'task_pending',
                taskName: this._TASK_NAME
            }
        }));
        this.__INIT();//初始化
    }

    __INIT() {
        this.__copyTemplate();
    }

    __copyTemplate() {
        const _temp = '../server/static/temp/';

        //临时文件夹是否存在
        if (!fs.existsSync(_temp)) {
            fs.mkdir(_temp);
        }
        const _DIR = `../server/static/temp/${this._TASK_NAME}`;

        if (!fs.existsSync(_DIR)) {
            fs.mkdir(_DIR);
            this.__COPYFILE(`../server/static/DataVisualizationTemplate/${this._DATA.template}`, _DIR);

            setTimeout(() => {
                const str = 'const chartConfig = ';

                //替换 配置文件对象
                fs.writeFile(`${_DIR}/conf.js`, `${str}${JSON.stringify(this._DATA['templateConfig'])};`, e => {
                    if (e) {
                        console.log('模板配置文件替换失败');
                    } else {
                        this.__SYNTHESIS();//开始合成视频
                    }
                });
            }, 1000);
        }
    }

    //复制
    __COPYFILE(_DIR, _TO) {
        const _SOURCE_FILE = fs.readdirSync(_DIR, {withFileTypes: true});//获取源文件

        _SOURCE_FILE.forEach(i => {
            const n = path.resolve(_DIR, i.name);
            const t = path.resolve(_TO, i.name);

            fs.copyFileSync(n, t);
        });
    }

    //合成
    __SYNTHESIS(_FPS = 30, _DURATION = 1) {
        const _DATA = this._DATA['config'];

        timeCut({
                url: `http://localhost:3000/static/temp/${this._TASK_NAME}/index.html`,
                viewport: {width: 1920, height: 1080},
                selector: '#app',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                fps: parseInt(_DATA.video.fps),
                duration: _DATA.video.duration,
                output: `static/output/${this._TASK_NAME}.mp4`,
                preparePageForScreenshot: async () => {
                    this._WS.send(require('../funcs').__STRINGIFY({
                        type: 'task_processing',
                        data: {
                            cmd: 'task_processing',
                            state: this._TASK_NAME
                        }
                    }));
                }
            }
        ).then(() => {
            this._WS.send(require('../funcs').__STRINGIFY(
                {
                    type: 'task_end',
                    data: {
                        cmd: 'task_processing',
                        state: 'success',
                        taskName: this._TASK_NAME,
                        path: `/static/output/'${this._TASK_NAME}.mp4`
                    }
                }
            ));
            //删除临时目录
            this.__DEL_TEMP_FILE(`${path.resolve(`../server/static/temp/${this._TASK_NAME}`)}`);
        });
    }

    __DEL_TEMP_FILE(_path) {
        let files = [];

        if (fs.existsSync(_path)) {
            files = fs.readdirSync(_path);
            files.forEach((file, index) => {
                const curPath = _path + "/" + file;

                if (fs.statSync(curPath).isDirectory()) {
                    this.__DEL_TEMP_FILE(curPath); //递归删除文件夹
                } else {
                    fs.unlinkSync(curPath); //删除文件
                }
            });
            fs.rmdirSync(_path);
        }
    }
}

module.exports.tc = TC;