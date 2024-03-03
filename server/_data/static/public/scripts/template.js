/**
 * @class TempLate
 * @constructor
 * @param conf {Object} 当前模板配置文件
 * @param renderFunc {function} 渲染函数
 * @author ayuanlmo
 * 该类包含了模板的一些公共方法
 * **/
import {getDiffColor, rgbToHex} from "./utils.js";

export default class TempLate {
    constructor(conf = {}, renderFunc = () => {
    }, type = 'echarts') {
        this.render = renderFunc;
        this.isPreview = location.href.indexOf('type=preview') !== -1;
        this.conf = conf;
        this.csvData = null;
        this.chart = null;
        this.timer = 0;
        this.chartType = type;
        this.isCustom = this.conf.isCustom === 0;
        this.d3 = window['d3'] ?? window.d3;
        this.echarts = window['echarts'] ?? window.echarts;
        this.renderDom = document.getElementById('canvas');
        this.appDom = document.getElementById('app');
        this.setChart();
        this.init();
        this.initLOGO();
        addEventListener('load', () => {
            if (!this.isCustom && !this.isPreview)
                parent.postMessage({
                    type: 'FullConfig',
                    data: this.conf
                }, location.origin);
            parent.postMessage({
                type: 'TemplateLoad'
            });
        });
    }

    initLOGO() {
        const img = document.createElement('img');

        img.style = 'width: 12%;border-radius: 50%;position: absolute;right: 8%;top: 8%;';
        img.src = '../../public/lmo-logo.png';
        img.addEventListener('load', () => {
            document.getElementById('logo').append(img);
        });
    }

    setChart() {
        if (this.chartType === 'echarts')
            this.chart = this.echarts.init(this.getRenderDom(), null, {renderer: 'svg'});
    }

    postMessage(type = '', message = {}) {
        parent.postMessage({
            type: type,
            data: message
        }, location.origin);
    }

    tryRender(t) {
        try {
            this.render(this.csvData ?? this.conf.data, t);
            this.postMessage('TemplateRender');
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.postMessage('TemplateRenderFinish');
            }, this.conf.duration);
        } catch (e) {
            parent.postMessage({
                type: 'RenderError',
                data: e
            }, location.origin);
            console.error('[Lmo warn]: Template render error\n\n', Error(e));
        }
    }

    init() {
        if ('_video' in this.conf) {
            const clarity = this.conf['_video']['clarity'];

            if (clarity === '1080P') {
                this.renderDom.style.height = 1080 - 135 + 'px';
                this.appDom.style.width = '1920px';
                this.appDom.style.height = '1080px';
            }
            if (clarity === '2K') {
                this.renderDom.style.height = 1440 - 135 + 'px';
                this.appDom.style.width = '2560px';
                this.appDom.style.height = '1440px';
            }
            if (clarity === '4K') {
                this.renderDom.style.height = 2160 - 135 + 'px';
                this.appDom.style.width = '4096px';
                this.appDom.style.height = '2160px';
            }
        } else {
            this.renderDom.style.height = 1080 - 135 + 'px';
            this.appDom.style.width = '1920px';
            this.appDom.style.height = '1080px';
        }
        if (this.isCustom) {
            this.csvData = this.conf.data;
            this.initThemeColor();
            this.tryRender(true);
        } else {
            addEventListener('message', (e) => {
                this.onMessage(e);
            });
            if (!this.isPreview)
                this.fetchJSON();
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

    initThemeColor(colors = []) {
        const _ = this.conf.color.more;

        if (_ !== undefined) {
            if ('type' in _) {
                if (_.type === 'Theme')
                    this.conf.themeColor = this.conf.themeColors[this.conf.themeColorKey].colors;
                if (_.type === 'Monotone')
                    this.conf.themeColor = [_.config.Monotone.color];
                if (_.type === 'Gradient')
                    this.conf.themeColor = getDiffColor(rgbToHex(_.config.Gradient.color[0]), rgbToHex(_.config.Gradient.color[1]), this.csvData.length, 1);
            }
        } else {
            if (colors.length !== 0)
                this.conf.themeColor = colors;
        }
        this.tryRender(true);
    }

    onMessage(msg) {
        const m = msg.data;

        if (msg.origin === location.origin) {
            if (m.type === 'UpdateData') {
                this.conf.data = m.data;
                this.csvData = m.data;
                this.tryRender(true);
            }
            if (m.type === 'UpdateText') {
                this.conf.text = m.data;
                this.initTitle();
                this.tryRender(false);
            }
            if (m.type === 'UpdateColorMode') {
                this.conf.color.more = m.data;
                this.initThemeColor();
            }
            if (m.type === 'UpdateColor') {
                this.conf.color = m.data;
                this.initTitle();
                this.tryRender(false);
            }
            if (m.type === 'UpdateThemeColor') {
                this.conf.themeColorKey = m.data.index;
                this.initThemeColor(m.data.colors);
                this.tryRender(false);
            }
            if (m.type === 'UpdateBackground_image') {
                this.conf.background = m.data;
                this.initBackground();
            }
            if (m.type === 'UpdateAnimateName') {
                this.conf.titleAnimateName = m.data;
                this.setTitleAnimate();
                this.tryRender(true);
            }
            if (m.type === 'Preview') {
                this.conf = m.data;
                this.csvData = this.conf.data;
                this.setTitleAnimate();
                this.initBackground();
                this.initTitle();
                this.initThemeColor();
                this.tryRender(true);
            }
            if (m.type === 'Play') {
                this.tryRender(true);
                this.initBackground();
            }
            if (m.type === 'UpdateDuration') {
                this.conf.duration = m.data;
                this.initBackground();
                this.tryRender(true);
            }
        }
    }

    fetchJSON() {
        fetch('data.json').then(res => {
            return res.json();
        }).then(json => {
            this.conf.data = json;
            this.csvData = json;
            this.conf.defaultData = JSON.parse(JSON.stringify(json));
            this.postMessage('first', this.conf);
            this.postMessage('FullConfig', this.conf);
        });
    }
}