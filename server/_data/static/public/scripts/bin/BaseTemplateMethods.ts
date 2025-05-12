import {ITemplateConfig, TConfigTextType, TOtherConfig, TThemeConfig} from "../@types/template";
import BaseEventEmitter from "../lib/BaseEventEmitter.js";
import {useDebounce, useObserver} from "../utils.js";

export interface ILMOTemplateImplementsMethods {
    readonly otherConfigChange: (config: TOtherConfig) => void;
    readonly themeColorChange: (config: TThemeConfig) => void;
    readonly render: () => void | Promise<void>;
}

export interface ILMOTemplate extends ILMOTemplateImplementsMethods {
    readonly conf: ITemplateConfig;
    readonly isSynthesisMode: boolean;
    readonly tryRender: () => void;
}

export type TAnimationState = 'start-animation' | 'pause-animation';

export default abstract class BaseTemplateMethods implements ILMOTemplate {
    public conf: ITemplateConfig;
    public readonly isSynthesisMode: boolean;
    private readonly animationEventEmitter: BaseEventEmitter;

    protected constructor(conf: ITemplateConfig) {
        this.conf = conf;
        this.isSynthesisMode = location.href.includes('__type=h');
        this.animationEventEmitter = new BaseEventEmitter();
        this.initHTMLTemplate();
        this.initDrag();
        this.initViewStyle();
        this.sendMessage('TEMPLATE_FULL_CONFIG', conf);
        this.initText();
        this.initBackground();
        this.fetchData();

        if (!this.isSynthesisMode) {
            addEventListener('message', (e: MessageEvent): void => this.onMessage(e));
            document.addEventListener('contextmenu', (e: MouseEvent): void => e.preventDefault());
        } else
            this.initSocket();
    }

    public abstract otherConfigChange(config: TOtherConfig): void;

    public abstract themeColorChange(config: TThemeConfig): void;

    public abstract render(): void | Promise<void>;

    public addAnimationEventListener(type: TAnimationState, listener: Function) {
        const {config} = this.conf;
        const chatAnimationIsControllable: boolean =
            (config.animation && config.animation.chatAnimationIsControllable) ?? false;

        if (!this.isSynthesisMode && chatAnimationIsControllable)
            this.animationEventEmitter.on(type, listener);
    }

    public tryRender(): void {
        (async (): Promise<void> => {
            try {
                this.sendMessage('TEMPLATE_RENDER', 'RENDER');
                await this.render();
            } catch (e) {
                if (!this.isSynthesisMode)
                    throw e;
            }
        })();
        this.render();
    }

    private initSocket(): void {
        const ws: WebSocket = new WebSocket(`${location.protocol.includes('https') ? 'wss' : 'ws'}://${location.host}/template`);

        const messageHandel = (msg: MessageEvent): void => {
            const {data} = msg;

            if (typeof data !== 'string') return;
            if (data === 'pong' || data === 'open') return;

            try {
                const _data: {
                    _signal: string;
                    id: string;
                } = JSON.parse(data);

                if (_data._signal === '__ABORT_RENDER') {
                    if (_data.id === this.conf.id)
                        window?.captureCtx?.throwError?.(-1, "Abort");
                }
            } catch (e) {
                throw e;
            }
        };

        ws.addEventListener('message', messageHandel);
        ws.addEventListener('open', (): void => {
            ws.send(JSON.stringify({
                id: this.conf.id,
                template: this.conf.template
            }));
            setInterval((): void => {
                if (ws.readyState.toString() === '1')
                    ws.send('ping')
            }, 100 * 10 * 10);
        });
    }

    private sendMessage(type: string, message: any): void {
        if (this.isSynthesisMode) return;

        parent.postMessage({
            type, message
        }, location.origin);
    }

    private fetchData(): void {
        fetch('data.json')
            .then((res: Response) => res.json())
            .then(json => {
                this.sendMessage('TEMPLATE_DATA', json);
                this.conf.data = json;
                this.tryRender();
            });
    }

    private initText(data?: TConfigTextType): void {
        const _this: BaseTemplateMethods = this;

        if (!data)
            Object.values(this.conf.config.text).forEach((text: TConfigTextType) => this.initText(text));
        if (typeof data?.key === 'string' && data.key !== '')
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

        Object.entries(elements).forEach(([id, {value, style}]): void => {
            const element: HTMLElement | null = document.getElementById(id);

            if (!element) return;
            const textValue: HTMLElement | null = element.querySelector('.text-value');

            if (!textValue) return;

            setValueStyle(textValue, value);
            setStyle(element, style);

            function setValueStyle(el: HTMLElement, config: TConfigTextType): void {
                el.innerHTML = config.value;
                el.style.color = config.color;
                el.style.fontSize = config.fontSize + 'px';
            }

            function setStyle(el: HTMLElement, config: TConfigTextType): void {
                el.style.top = config.y + 'px';
                el.style.textAlign = config.align;
                el.style.left = config.x + 'px';
                el.style.width = config.width + 'px';
                el.style.height = config.height + 'px';
                el.style.display = config.display ? 'block' : 'none';
                if (!_this.isSynthesisMode)
                    el.setAttribute('contenteditable', 'true');
                else {
                    try {
                        document.querySelectorAll('.text-value').forEach((i: Element): void => i.removeAttribute('contenteditable'));
                    } catch (e) {
                        throw e;
                    }
                }
            }
        });
    }

    private sendTemplateSelectTextConfig(el: HTMLElement): void {
        const style: CSSStyleDeclaration = getComputedStyle(el);
        const y: string = style.top;
        const x: string = style.left;
        const w: string = style.width;
        const h: string = style.height;
        const key: string = el.getAttribute('data-name') ?? '';
        const subTextValueEl: Element = el.querySelector('.text-value') as Element;
        const conf = {
            width: parseInt(w.substring(0, w.length - 2)),
            height: parseInt(h.substring(0, h.length - 2)),
            x: parseInt(x.substring(0, x.length - 2)),
            y: parseInt(y.substring(0, y.length - 2)),
            value: ''
        };

        if (key === '' && subTextValueEl) return;

        conf.value = subTextValueEl.innerHTML;

        this.conf.config.text[key] = {
            ...this.conf.config.text[key],
            ...conf,
            key: key
        };

        this.sendMessage('TEMPLATE_SELECT_TEXT_ELEMENT', {
            ...this.conf.config.text[key]
        });
    }

    private onMessage(e: MessageEvent): void {
        if (e.origin !== origin) return;
        const {data} = e;

        if (!('message' in data) || !('type' in data)) return;

        const {type, message} = data;

        switch (type) {
            case 'SET_TEXT_CONFIG':
                this.initText(message);
                break;
            case 'SET_DURATION':
                this.conf.config.video.duration = message.duration;
                this.tryRender();
                break;
            case 'SET_DATA':
                this.conf.data = message;
                this.tryRender();
                break;
            case 'SET_BACKGROUND_IMAGE':
                this.conf.config.background = message;
                this.initBackground();
                break;
            case 'SET_OTHER_CONFIG':
                this.conf.otherConfig.values = {
                    ...this.conf.otherConfig.values, ...message
                }
                this.otherConfigChange(this.conf.otherConfig as TOtherConfig);
                break;
            case 'SET_THEME_COLOR':
                this.conf.config.theme = {
                    ...this.conf.config.theme,
                    ...message
                };
                this.themeColorChange(message as TThemeConfig);
                break;
            case 'RENDER':
                this.tryRender();
                break;
            case 'GET_TEMPLATE_DATA':
                this.sendMessage('GET_TEMPLATE_DATA', this.conf.data);
                break;
            case 'GET_CONFIG':
                this.sendMessage('GET_CONFIG', this.conf);
                break;
            case 'START_ANIMATION':
                this.animationEventEmitter.emitEvent('start-animation');
                break;
            case 'PAUSE_ANIMATION':
                this.animationEventEmitter.emitEvent('pause-animation');
                break;
            case 'VIDEO_CONFIG_CHANGE':
                this.conf.config.video = {
                    ...this.conf.config.video,
                    ...message
                };
                const appEl: HTMLElement | null = document.getElementById('app');

                if (appEl) {
                    appEl.style.width = `${document.body.offsetWidth}px`;
                    appEl.style.height = `calc(${document.body.offsetHeight}px - 120px)`;
                    appEl.style.userSelect = 'none';
                    appEl.style.marginTop = '120px';
                }
                this.initViewStyle();
                break;
            default:
                break;
        }
    }

    private initDrag(): void {
        if (this.isSynthesisMode) return;

        function getElementById(id: string): HTMLElement {
            return document.getElementById(id) as HTMLElement;
        }

        getElementById('main-title').setAttribute('data-name', 'mainTitle');
        getElementById('sub-title').setAttribute('data-name', 'subTitle');
        getElementById('from-source').setAttribute('data-name', 'fromSource');

        const elements: string[] = ['main-title', 'sub-title', 'from-source'];
        const classListObServerConfig = {attributes: true, attributeFilter: ['class']};
        const initInteract = (element: HTMLElement): void => {
            initSquare(element);

            const __this = this;

            const moveDebounce = useDebounce(function (x: number, y: number, el: HTMLElement): void {
                const elData: string = el.getAttribute('data-name') as string;

                __this.conf.config.text[elData].x = x;
                __this.conf.config.text[elData].y = y;

                __this.sendTemplateSelectTextConfig(el);
            }, 100);

            let x: number = 0, y: number = 0, angle: number = 0, scale: number = 1;

            const {interact}: any = window;

            interact(element)
                .draggable({
                    inertia: false, modifiers: [interact.modifiers.restrictRect({
                        restriction: 'parent', endOnly: true
                    })], onstart: function (event: MouseEvent): void {
                        x = event.clientX;
                        y = event.clientY;
                    }, onmove: function (event: MouseEvent): void {
                        const dx: number = event.clientX - x;
                        const dy: number = event.clientY - y;
                        const newX: number = parseInt(element.style.left) + dx;
                        const newY: number = parseInt(element.style.top) + dy;

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
                        move(event: any): void {
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
        const initEvent = (element: HTMLElement): void => {
            let isInputChinese: boolean = false;

            const handleEvent = (e: MouseEvent | Event | any): void => {

                const inputHandleEvent = (): void => {
                    if (e.type === 'click' && e.target)
                        this.sendTemplateSelectTextConfig(e.target.classList.contains('text-value') ? e.target.parentElement : e.target);
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

                elements.forEach((i: string): void => {
                    const targetId = e.target.classList.contains('text-value') ? e.target.parentElement.id : e.target.id;
                    const _: HTMLElement = document.getElementById(i) as HTMLElement;

                    if (i !== targetId && Array.from(_.classList).includes('active')) {
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

        elements.map((i: string): void => {
            const el: HTMLElement = document.getElementById(i) as HTMLElement;

            initInteract(el);
            initEvent(el);
            useObserver((e: any): void => {
                if (!(Array.from(e[0].target.classList).includes('active')))
                    this.sendMessage('TEMPLATE_SELECT_TEXT_CLOSE', {});
            }).observe(el, classListObServerConfig);
        });

        function initSquare(element: HTMLElement): void {
            function createSquare(className: string): HTMLDivElement {
                const square: HTMLDivElement = document.createElement('div');

                square.classList.add('square');
                square.classList.add(className);
                return square;
            }

            const squareTL: HTMLDivElement = createSquare('top-left');
            const squareTR: HTMLDivElement = createSquare('top-right');
            const squareBL: HTMLDivElement = createSquare('bottom-left');
            const squareBR: HTMLDivElement = createSquare('bottom-right');

            element.append(squareTL, squareTR, squareBL, squareBR);

            initSquareEvent();
            element.append(squareBR);
            initSquareEvent();
        }

        function initSquareEvent(): void {
            document.querySelectorAll('.square').forEach((i: Element): void => {
                i.addEventListener('click', (e: Event): void => {
                    e.stopPropagation();
                });
            });
        }

        function initGlobalEvent(): void {
            document.addEventListener('click', (e: MouseEvent): void => {
                elements.forEach((i: string): void => {
                    // @ts-ignore
                    const idName = e.target.parentElement.id;
                    const el: HTMLElement = getElementById(i) as HTMLElement;

                    if (i !== idName && elements.includes(idName) || idName === '') {
                        const classList: DOMTokenList = el.classList;

                        if (Array.from(classList).includes('active')) {
                            el.classList.remove('active');
                            el.classList.remove('square-container');
                        }
                    }
                });
            })
        }
    }

    private initBackground(): void {
        const {type, color, image, arrangement} = this.conf.config.background;
        const templateEl = document.getElementById('template');

        if (!templateEl) return;

        if (type === '')
            templateEl.style.background = '#fff';
        else if (type === 'color' || type === 'theme')
            templateEl.style.background = color || '#fff';
        else if (type === 'image') {
            templateEl.style.backgroundImage = `url(${image.includes('data:image') && image.includes('base64,') ? image : `/api/${image}`})`;
            templateEl.style.backgroundRepeat = 'no-repeat';

            switch (arrangement) {
                case 'cover':
                    templateEl.style.backgroundSize = 'cover';
                    break;
                case 'left':
                    templateEl.style.backgroundPositionX = 'left';
                    break;
                case 'right':
                    templateEl.style.backgroundPositionX = 'right';
                    break;
            }
        }
    }

    private initHTMLTemplate(): void {
        if (document.getElementById('template')) return;

        const fragment: DocumentFragment = document.createDocumentFragment();
        const templateElement: HTMLDivElement = document.createElement('div');
        const mainTitleElement: HTMLDivElement = document.createElement('div');
        const subTitleElement: HTMLDivElement = document.createElement('div');
        const fromSourceElement: HTMLDivElement = document.createElement('div');
        const logoElement: HTMLDivElement = document.createElement('div');
        const chartAppElement: HTMLDivElement = document.createElement('div');
        const createTextElement = (): HTMLDivElement => {
            const textValueElement: HTMLDivElement = document.createElement('div');
            textValueElement.classList.add('text-value');
            textValueElement.contentEditable = String(!this.isSynthesisMode);

            return textValueElement;
        }
        const addDefaultAnimatedClass = (el: HTMLDivElement): void => el.classList.add('animated', 'fadeInDown');

        templateElement.id = 'template';

        mainTitleElement.id = 'main-title';
        addDefaultAnimatedClass(mainTitleElement);
        mainTitleElement.append(createTextElement());

        subTitleElement.id = 'sub-title';
        addDefaultAnimatedClass(subTitleElement);
        subTitleElement.append(createTextElement());

        fromSourceElement.id = 'from-source';
        addDefaultAnimatedClass(fromSourceElement);
        fromSourceElement.append(createTextElement());

        logoElement.id = 'logo';

        chartAppElement.id = 'app';
        chartAppElement.style.width = '100vw';
        chartAppElement.style.height = 'calc(100vh - 120px)';
        chartAppElement.style.userSelect = 'none';
        chartAppElement.style.marginTop = '120px';

        templateElement.append(mainTitleElement, subTitleElement, fromSourceElement, logoElement, chartAppElement);
        fragment.appendChild(templateElement);
        document.body.appendChild(fragment);
    }

    private initViewStyle(): void {
        const body: HTMLElement = document.body;
        const {clarity} = this.conf.config.video;
        let width: string;
        let height: string;

        switch (clarity) {
            case '1080P':
                width = '1920px';
                height = '1080px';
                break;
            case '2K':
                width = '2560px';
                height = '1440px';
                break;
            case '4K':
                width = '4096px';
                height = '2160px';
                break;
            default:
                width = '1920px';
                height = '1080px';
        }

        body.style.width = width;
        body.style.height = height;
    }
}
