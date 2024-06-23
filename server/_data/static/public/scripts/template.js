import {useDebounce, useObserver} from "./utils.js";

const defaultEvent = {
    // 其他配置更改
    otherConfigChange: () => {
    },
    // 主题颜色更改
    themeColorChange: () => {
    }
};

class LmoTempLate {
    constructor(conf, render, event = defaultEvent, templateContext) {
        this.conf = conf;
        this.renderFunc = render;
        this.event = event;
        this.templateContext = templateContext;
        this.isSynthesisMode = location.href.includes('__type=h');
        this.initDrag();
        this.initViewStyle();
        this.sendMessage('TEMPLATE_FULL_CONFIG', conf);
        this.initText();
        this.initBackground();
        this.fetchData();
        if (!this.isSynthesisMode) {
            addEventListener('message', (e) => {
                this.onMessage(e);
            }, conf);
            document.addEventListener('contextmenu', function (event) {
                event.preventDefault();
            });
        }
    }

    tryRender() {
        if (this.renderFunc) {
            this.sendMessage('TEMPLATE_RENDER', 'RENDER');
            this.event?.themeColorChange?.(this.conf.config.theme, this.templateContext, this);
            (async () => {
                try {
                    await this.renderFunc?.(this.templateContext);
                } catch (e) {
                    this.sendMessage('TEMPLATE_RENDER_ERROR', e.message);
                    if (!this.isSynthesisMode)
                        throw e;
                }
            })();
        }
    }

    fetchData() {
        fetch('data.json')
            .then(res => res.json())
            .then(json => {
                this.sendMessage('TEMPLATE_DATA', json);
                this.conf.data = json;
                this.tryRender();
            });
    }

    initText(data) {
        if (!data)
            Object.values(this.conf.config.text).forEach(text => this.initText(text));
        else
            this.conf.config.text[data.key] = data;

        const elements = {
            'main-title': {
                value: this.conf.config.text.mainTitle, style: this.conf.config.text.mainTitle
            },
            'sub-title': {
                value: this.conf.config.text.subTitle, style: this.conf.config.text.subTitle
            },
            'from-source': {
                value: this.conf.config.text.fromSource, style: this.conf.config.text.fromSource
            }
        };

        Object.entries(elements).forEach(([id, {value, style}]) => {
            const element = document.getElementById(id);
            const textValue = element.querySelector('.text-value');

            setValueStyle(textValue, value);
            setStyle(element, style);
        });

        function setValueStyle(el, config) {
            el.innerHTML = config.value;
            el.style.color = config.color;
            el.style.fontSize = config.fontSize + 'px';
        }

        function setStyle(el, config) {
            el.style.top = config.y + 'px';
            el.style.textAlign = config.align;
            el.style.left = config.x + 'px';
            el.style.width = config.width + 'px';
            el.style.height = config.height + 'px';
            el.style.display = config.display ? 'block' : 'none';
            el.setAttribute('contenteditable', true);
        }
    }

    sendTemplateSelectTextConfig(el) {
        const style = getComputedStyle(el);
        const y = style.top;
        const x = style.left;
        const w = style.width;
        const h = style.height;
        const key = el.getAttribute('data-name');
        const subTextValueEl = el.querySelector('.text-value');
        const conf = {
            width: parseInt(w.substring(0, w.length - 2)),
            height: parseInt(h.substring(0, h.length - 2)),
            x: parseInt(x.substring(0, x.length - 2)),
            y: parseInt(y.substring(0, y.length - 2)),
        }

        if (subTextValueEl)
            conf.value = subTextValueEl.textContent

        this.conf.config.text[key] = {
            ...this.conf.config.text[key], ...conf, key: key,
        }
        this.sendMessage('TEMPLATE_SELECT_TEXT_ELEMENT', {
            ...this.conf.config.text[key]
        });
    }

    sendMessage(type = '', message = '') {
        if (this.isSynthesisMode) return;

        parent.postMessage({
            type, message
        }, location.origin);
    }

    onMessage(e) {
        if (e.origin !== origin) return;
        const {data} = e;

        if ((!'message' in data) && (!'type' in data)) return;

        const {
            type,
            message
        } = data;

        switch (type) {
            // 设置文字配置
            case 'SET_TEXT_CONFIG':
                this.initText(message);
                break;
            case 'SET_DURATION':
                this.conf.config.video.duration = message.duration;
                this.tryRender();
                break;
            // 设置数据
            case 'SET_DATA':
                this.conf.data = message;
                this.tryRender();
                break;
            // 设置背景图片
            case 'SET_BACKGROUND_IMAGE':
                this.conf.config.background = message;
                this.initBackground();
                break;
            // 设置其他配置
            case 'SET_OTHER_CONFIG':
                this.conf.otherConfig.values = {
                    ...this.conf.otherConfig.values, ...message
                }
                this.event?.otherConfigChange?.(message, this.templateContext);
                break;
            // 主题颜色
            case 'SET_THEME_COLOR':
                this.conf.config.theme = {
                    ...this.conf.config.theme,
                    ...message
                };
                this.event?.themeColorChange?.(message, this.templateContext, this);
                break;
            // 渲染
            case 'RENDER':
                this.tryRender();
                break;
            // 获取数据
            case 'GET_TEMPLATE_DATA':
                this.sendMessage('GET_TEMPLATE_DATA', this.conf.data);
                break;
            // 获取配置
            case 'GET_CONFIG':
                this.sendMessage('GET_CONFIG', this.conf);
                break;
            default:
                break;
        }
    }

    initDrag() {
        if (this.isSynthesisMode) return;

        document.getElementById('main-title').setAttribute('data-name', 'mainTitle');
        document.getElementById('sub-title').setAttribute('data-name', 'subTitle');
        document.getElementById('from-source').setAttribute('data-name', 'fromSource');

        const elements = ['main-title', 'sub-title', 'from-source'];
        const classListObServerConfig = {attributes: true, attributeFilter: ['class']};
        const initInteract = (element) => {
            initSquare(element);

            const __this = this;

            const moveDebounce = useDebounce(function (x, y, el) {
                const elData = el.getAttribute('data-name');

                __this.conf.config.text[elData].x = x;
                __this.conf.config.text[elData].y = y;

                __this.sendTemplateSelectTextConfig(el);
            }, 100);

            let x = 0, y = 0, angle = 0, scale = 1;

            interact(element)
                .draggable({
                    inertia: false, modifiers: [interact.modifiers.restrictRect({
                        restriction: 'parent', endOnly: true
                    })], onstart: function (event) {
                        x = event.clientX;
                        y = event.clientY;
                    }, onmove: function (event) {
                        const dx = event.clientX - x;
                        const dy = event.clientY - y;
                        const newX = parseInt(element.style.left) + dx;
                        const newY = parseInt(element.style.top) + dy;
                        element.style.left = newX + 'px';
                        element.style.top = newY + 'px';
                        x = event.clientX;
                        y = event.clientY;
                        moveDebounce(newY, newX, element);
                    }
                })
                .resizable({
                    edges: {left: true, right: true, bottom: true, top: true},

                    listeners: {
                        move(event) {
                            const target = event.target;
                            let x = (parseFloat(target.getAttribute('data-x')) || 0);
                            let y = (parseFloat(target.getAttribute('data-y')) || 0);

                            target.style.width = event.rect.width + 'px'
                            target.style.height = event.rect.height + 'px'
                            x += event.deltaRect.left
                            y += event.deltaRect.top

                            target.style.transform = 'translate(' + x + 'px,' + y + 'px)'
                            target.setAttribute('data-x', x)
                            target.setAttribute('data-y', y)
                        }
                    }, modifiers: [interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }), interact.modifiers.restrictSize({
                        min: {width: 10, height: 10}
                    })],

                    inertia: true
                })
        }
        const initEvent = (element) => {
            let isInputChinese = false;

            const handleEvent = (e) => {

                const inputHandleEvent = () => {
                    if (e.type === 'click') this.sendTemplateSelectTextConfig(e.target.classList.contains('text-value') ? e.target.parentElement : e.target);
                }

                if (e.type === 'compositionstart') {
                    isInputChinese = true;
                    return;
                }
                if (e.type === 'input') {
                    if (!isInputChinese) return inputHandleEvent();
                }
                if (e.type === 'compositionend') {
                    isInputChinese = false;
                    return inputHandleEvent();
                }

                elements.forEach(i => {
                    const targetId = e.target.classList.contains('text-value') ? e.target.parentElement.id : e.target.id;
                    const _ = document.getElementById(i);

                    if (i !== targetId && _.classList.length > 0) {
                        _.classList.remove('active');
                        _.classList.remove('square-container');
                    }
                });
                if (e.type === 'click') {
                    e.stopPropagation();
                    inputHandleEvent();
                }
                element.classList.add('square-container');
                element.classList.add('active');
            };

            element.addEventListener('mousedown', handleEvent);
            element.addEventListener('click', handleEvent);
            element.addEventListener('input', handleEvent);
            element.addEventListener('compositionend', handleEvent);
            element.addEventListener('compositionstart', handleEvent);
            initGlobalEvent();
        };

        elements.map(i => {
            const el = document.getElementById(i);

            initInteract(el);
            initEvent(el);
            useObserver((e) => {
                if (e[0].target.classList.length === 0) this.sendMessage('TEMPLATE_SELECT_TEXT_CLOSE', {});
            }).observe(el, classListObServerConfig);
        });

        function initSquare(element) {
            function createSquare(className) {
                const square = document.createElement('div');

                square.classList.add('square');
                square.classList.add(className);

                return square;
            }

            const squareTL = createSquare('top-left');
            const squareTR = createSquare('top-right');
            const squareBL = createSquare('bottom-left');
            const squareBR = createSquare('bottom-right');

            element.append(squareTL, squareTR, squareBL, squareBR);

            initSquareEvent();
            element.append(squareBR);
            initSquareEvent();
        }

        function initSquareEvent() {
            // 给所有square 阻止冒泡
            document.querySelectorAll('.square').forEach(i => {
                i.addEventListener('click', (e) => {
                    e.stopPropagation();
                })
            });
        }

        function initGlobalEvent() {
            document.addEventListener('click', (e) => {
                elements.forEach(i => {
                    const idName = e.target.parentElement.id;

                    if (i !== idName && elements.includes(idName) || idName === '') {
                        const classList = document.getElementById(i).classList;

                        if (classList.length !== 0) {
                            document.getElementById(i).classList.remove('active');
                            document.getElementById(i).classList.remove('square-container');
                        }
                    }
                });
            })
        }
    }

    initBackground() {
        const {
            type = '',
            color = '',
            image = '',
            arrangement = ''
        } = this.conf.config.background;
        const templateDom = document.getElementById('template');

        if (type === '')
            templateDom.style.background = '#fff';

        if (type === 'color' || type === 'theme')
            templateDom.style.background = color === '' ? '#fff' : color;

        if (type === 'image') {
            if (image.includes('data:image') && image.includes('base64'))
                templateDom.style.backgroundImage = "url(" + image + ")";
            else
                templateDom.style.backgroundImage = "url(" + "/api/" + image + ")";

            templateDom.style.backgroundRepeat = 'no-repeat';

            if (arrangement === 'cover')
                templateDom.style.backgroundSize = 'cover';

            if (arrangement === 'left')
                templateDom.style.backgroundPositionX = 'left';

            if (arrangement === 'right')
                templateDom.style.backgroundPositionX = 'right';
        }
    }

    initViewStyle() {
        const body = document.body;
        const {clarity} = this.conf.config.video;

        if (typeof clarity !== 'string')
            body.style = 'width: 1920px;height: 1080px;';

        switch (clarity) {
            case '1080P':
                body.style = 'width: 1920px;height: 1080px;';
                break;
            case '2K':
                body.style = 'width: 2560px;height: 1440px;';
                break;
            case '4K':
                body.style = 'width: 4096px;height: 2160px;';
                break;
            default:
                body.style = 'width: 1920px;height: 1080px;';
        }
    }
}

export default LmoTempLate;
