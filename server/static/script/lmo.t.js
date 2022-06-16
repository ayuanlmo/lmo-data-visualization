/**
 * @class TempLate
 * @constructor
 * @param conf {Object} 当前模板配置文件
 * @param renderFunc {function} 渲染函数
 * @author ayuanlmo
 * 该类包含了模板的一些公共方法
 * **/

class TempLate {
    constructor(conf = {}, renderFunc = () => {
    }, type = 'echarts') {
        this.render = renderFunc;
        this.conf = conf;
        this.csvData = null;
        this.chart = null;
        this.chartType = type;
        this.d3 = window['d3'] ?? window.d3;
        this.echarts = window['echarts'] ?? window.echarts;
        this.renderDom = document.getElementById('canvas');
        this.appDom = document.getElementById('app');
        this.setChart();
        this.init();
    }

    setChart() {
        if (this.chartType === 'echarts') {
            this.chart = this.echarts.init(this.getRenderDom(), null, {renderer: 'svg'});
        }
    }

    init() {
        //设置分辨率 ('_video')对象需要在合成时才会存在
        if ('_video' in this.conf) {
            const clarity = this.conf['_video']['clarity'];

            if (clarity === '1080P') {
                this.renderDom.style.height = '1080px';
                this.appDom.style.width = '1920px';
                this.appDom.style.height = '1080px';
            }
            if (clarity === '2K') {
                this.renderDom.style.height = '1440px';
                this.appDom.style.width = '2560px';
                this.appDom.style.height = '1440px';
            }
            if (clarity === '4K') {
                this.renderDom.style.height = '2160px';
                this.appDom.style.width = '4096px';
                this.appDom.style.height = '2160px';
            }
        } else {
            this.renderDom.style.height = '1080px';
            this.appDom.style.width = '1920px';
            this.appDom.style.height = '1080px';
        }
        if (this.conf['isCustom'] === 0)
            this.render(this.csvData ?? this.conf.data.split('\r\n'), true);
        else {
            addEventListener('message', (e) => {
                this.onMessage(e);
            });
            this.fetchCSV();
        }
        this.initTitle();
        this.initBackground();
    }

    getRenderDom() {
        return this.renderDom;
    }

    setTitleAnimate() {
        const el = document.getElementById('text');

        el.className = `animated  ${this.conf.titleAnimateName}`;
        setTimeout(() => {
            el.className = '';
        }, this.conf.titleAnimateDuration);
    }

    initTitle() {
        this.d3.select('.title_main').text(this.conf.text.mainTitle.value).style('color', this.conf.color.mainTitle.value);
        this.d3.select('.title_sub').text(this.conf.text.subTitle.value).style('color', this.conf.color.subTitle.value);
        this.d3.select('.data_source').text(this.conf.text.dataSource.value);
        this.d3.select('.from').style('color', this.conf.color.dataSource.value);
    }

    initBackground() {
        if (this.conf.background.image !== '')
            this.appDom.style.background = `url(${this.conf.background.image}) ${this.conf.background.arrange}`;
        else
            this.appDom.style.background = this.conf.background.color;
    }

    onMessage(msg) {
        const m = msg.data;

        if (msg.origin === location.origin) {
            //更新图表数据
            if (m.type === 'UpdateData') {
                this.conf.data = m.data;
                const data = [];

                this.conf.data.split('\r\n').map(i => {
                    if (i !== '')
                        data.push(i);
                });
                this.csvData = data;
                this.render(this.csvData, true);
            }
            //更新文本相关配置
            if (m.type === 'UpdateText') {
                this.conf.text = m.data;
                this.initTitle();
                this.render(this.csvData, false);
            }
            //更新颜色相关配置
            if (m.type === 'UpdateColor') {
                this.conf.color = m.data;
                this.initTitle();
                this.render(this.csvData, false);
            }
            //更新主题颜色
            if (m.type === 'UpdateThemeColor') {
                this.conf.themeColorKey = m.data.index;
                this.conf.themeColor = m.data.colors;
                this.render(this.csvData, false);
            }
            //更新背景
            if (m.type === 'UpdateBackground_image') {
                this.conf.background = m.data;
                this.initBackground();
            }
            //更新标题动画
            if (m.type === 'UpdateAnimateName') {
                this.conf.titleAnimateName = m.data;
                this.setTitleAnimate();
                this.render(this.csvData, true);
            }
            //触发预览
            if (m.type === 'Preview') {
                this.conf = m.data;
                this.initBackground();
                this.render(this.csvData ?? this.conf.data.split('\r\n'), true);
            }
            //触发播放
            if (m.type === 'Play') {
                this.render(this.csvData ?? this.conf.data.split('\r\n'), true);
                this.initBackground();
            }
            //更新动画时长
            if (m.type === 'UpdateDuration') {
                this.conf.duration = m.data;
                this.initBackground();
                this.render(this.csvData ?? this.conf.data.split('\r\n'), true);
            }
            //发送当前模板所有配置文件
            parent.postMessage({
                type: 'FullConfig',
                data: this.conf
            }, location.origin);
        }
    }

    fetchCSV() {
        fetch('data.csv').then(res => {
            return res.text();
        }).then(text => {
            this.conf.data = text;
            this.csvData = this.conf.data.split('\r\n');
            parent.postMessage({
                type: 'first',
                data: this.conf
            }, location.origin);
            this.render(this.csvData);
        });
    }
}