var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import BaseEventEmitter from "../lib/BaseEventEmitter.js";
import { useDebounce, useObserver } from "../utils.js";
var BaseTemplateMethods = /** @class */ (function () {
    function BaseTemplateMethods(conf) {
        var _this_1 = this;
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
            addEventListener('message', function (e) { return _this_1.onMessage(e); });
            document.addEventListener('contextmenu', function (e) { return e.preventDefault(); });
        }
        else
            this.initSocket();
    }
    BaseTemplateMethods.prototype.addAnimationEventListener = function (type, listener) {
        var _a;
        var config = this.conf.config;
        var chatAnimationIsControllable = (_a = (config.animation && config.animation.chatAnimationIsControllable)) !== null && _a !== void 0 ? _a : false;
        if (!this.isSynthesisMode && chatAnimationIsControllable)
            this.animationEventEmitter.on(type, listener);
    };
    BaseTemplateMethods.prototype.tryRender = function () {
        var _this_1 = this;
        (function () { return __awaiter(_this_1, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        this.sendMessage('TEMPLATE_RENDER', 'RENDER');
                        return [4 /*yield*/, this.render()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        if (!this.isSynthesisMode)
                            throw e_1;
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
        this.render();
    };
    BaseTemplateMethods.prototype.initSocket = function () {
        var _this_1 = this;
        var ws = new WebSocket("".concat(location.protocol.includes('https') ? 'wss' : 'ws', "://").concat(location.host, "/template"));
        var messageHandel = function (msg) {
            var _a, _b;
            var data = msg.data;
            if (typeof data !== 'string')
                return;
            if (data === 'pong' || data === 'open')
                return;
            try {
                var _data = JSON.parse(data);
                if (_data._signal === '__ABORT_RENDER') {
                    if (_data.id === _this_1.conf.id)
                        (_b = (_a = window === null || window === void 0 ? void 0 : window.captureCtx) === null || _a === void 0 ? void 0 : _a.throwError) === null || _b === void 0 ? void 0 : _b.call(_a, -1, "Abort");
                }
            }
            catch (e) {
                throw e;
            }
        };
        ws.addEventListener('message', messageHandel);
        ws.addEventListener('open', function () {
            ws.send(JSON.stringify({
                id: _this_1.conf.id,
                template: _this_1.conf.template
            }));
            setInterval(function () {
                if (ws.readyState.toString() === '1')
                    ws.send('ping');
            }, 100 * 10 * 10);
        });
    };
    BaseTemplateMethods.prototype.sendMessage = function (type, message) {
        if (this.isSynthesisMode)
            return;
        parent.postMessage({
            type: type,
            message: message
        }, location.origin);
    };
    BaseTemplateMethods.prototype.fetchData = function () {
        var _this_1 = this;
        fetch('data.json')
            .then(function (res) { return res.json(); })
            .then(function (json) {
            _this_1.sendMessage('TEMPLATE_DATA', json);
            _this_1.conf.data = json;
            _this_1.tryRender();
        });
    };
    BaseTemplateMethods.prototype.initText = function (data) {
        var _this_1 = this;
        var _this = this;
        if (!data)
            Object.values(this.conf.config.text).forEach(function (text) { return _this_1.initText(text); });
        if (typeof (data === null || data === void 0 ? void 0 : data.key) === 'string' && data.key !== '')
            this.conf.config.text[data.key] = data;
        var elements = {
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
        Object.entries(elements).forEach(function (_a) {
            var id = _a[0], _b = _a[1], value = _b.value, style = _b.style;
            var element = document.getElementById(id);
            if (!element)
                return;
            var textValue = element.querySelector('.text-value');
            if (!textValue)
                return;
            setValueStyle(textValue, value);
            setStyle(element, style);
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
                if (!_this.isSynthesisMode)
                    el.setAttribute('contenteditable', 'true');
                else {
                    try {
                        document.querySelectorAll('.text-value').forEach(function (i) { return i.removeAttribute('contenteditable'); });
                    }
                    catch (e) {
                        throw e;
                    }
                }
            }
        });
    };
    BaseTemplateMethods.prototype.sendTemplateSelectTextConfig = function (el) {
        var _a;
        var style = getComputedStyle(el);
        var y = style.top;
        var x = style.left;
        var w = style.width;
        var h = style.height;
        var key = (_a = el.getAttribute('data-name')) !== null && _a !== void 0 ? _a : '';
        var subTextValueEl = el.querySelector('.text-value');
        var conf = {
            width: parseInt(w.substring(0, w.length - 2)),
            height: parseInt(h.substring(0, h.length - 2)),
            x: parseInt(x.substring(0, x.length - 2)),
            y: parseInt(y.substring(0, y.length - 2)),
            value: ''
        };
        if (key === '' && subTextValueEl)
            return;
        conf.value = subTextValueEl.innerHTML;
        this.conf.config.text[key] = __assign(__assign(__assign({}, this.conf.config.text[key]), conf), { key: key });
        this.sendMessage('TEMPLATE_SELECT_TEXT_ELEMENT', __assign({}, this.conf.config.text[key]));
    };
    BaseTemplateMethods.prototype.onMessage = function (e) {
        if (e.origin !== origin)
            return;
        var data = e.data;
        if (!('message' in data) || !('type' in data))
            return;
        var type = data.type, message = data.message;
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
                this.conf.otherConfig.values = __assign(__assign({}, this.conf.otherConfig.values), message);
                this.otherConfigChange(this.conf.otherConfig);
                break;
            case 'SET_THEME_COLOR':
                this.conf.config.theme = __assign(__assign({}, this.conf.config.theme), message);
                this.themeColorChange(message);
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
                this.conf.config.video = __assign(__assign({}, this.conf.config.video), message);
                var appEl = document.getElementById('app');
                if (appEl) {
                    appEl.style.width = "".concat(document.body.offsetWidth, "px");
                    appEl.style.height = "calc(".concat(document.body.offsetHeight, "px - 120px)");
                    appEl.style.userSelect = 'none';
                    appEl.style.marginTop = '120px';
                }
                this.initViewStyle();
                break;
            default:
                break;
        }
    };
    BaseTemplateMethods.prototype.initDrag = function () {
        var _this_1 = this;
        if (this.isSynthesisMode)
            return;
        function getElementById(id) {
            return document.getElementById(id);
        }
        getElementById('main-title').setAttribute('data-name', 'mainTitle');
        getElementById('sub-title').setAttribute('data-name', 'subTitle');
        getElementById('from-source').setAttribute('data-name', 'fromSource');
        var elements = ['main-title', 'sub-title', 'from-source'];
        var classListObServerConfig = { attributes: true, attributeFilter: ['class'] };
        var initInteract = function (element) {
            initSquare(element);
            var __this = _this_1;
            var moveDebounce = useDebounce(function (x, y, el) {
                var elData = el.getAttribute('data-name');
                __this.conf.config.text[elData].x = x;
                __this.conf.config.text[elData].y = y;
                __this.sendTemplateSelectTextConfig(el);
            }, 100);
            var x = 0, y = 0, angle = 0, scale = 1;
            var interact = window.interact;
            interact(element)
                .draggable({
                inertia: false, modifiers: [interact.modifiers.restrictRect({
                        restriction: 'parent', endOnly: true
                    })], onstart: function (event) {
                    x = event.clientX;
                    y = event.clientY;
                }, onmove: function (event) {
                    var dx = event.clientX - x;
                    var dy = event.clientY - y;
                    var newX = parseInt(element.style.left) + dx;
                    var newY = parseInt(element.style.top) + dy;
                    element.style.left = newX + 'px';
                    element.style.top = newY + 'px';
                    x = event.clientX;
                    y = event.clientY;
                    moveDebounce(newY, newX, element);
                }
            })
                .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    move: function (event) {
                        var target = event.target;
                        var x = (parseFloat(target.getAttribute('data-x')) || 0);
                        var y = (parseFloat(target.getAttribute('data-y')) || 0);
                        target.style.width = event.rect.width + 'px';
                        target.style.height = event.rect.height + 'px';
                        x += event.deltaRect.left;
                        y += event.deltaRect.top;
                        target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    }
                }, modifiers: [interact.modifiers.restrictEdges({
                        outer: 'parent'
                    }), interact.modifiers.restrictSize({
                        min: { width: 10, height: 10 }
                    })],
                inertia: true
            });
        };
        var initEvent = function (element) {
            var isInputChinese = false;
            var handleEvent = function (e) {
                var inputHandleEvent = function () {
                    if (e.type === 'click' && e.target)
                        _this_1.sendTemplateSelectTextConfig(e.target.classList.contains('text-value') ? e.target.parentElement : e.target);
                };
                if (e.type === 'compositionstart') {
                    isInputChinese = true;
                    return;
                }
                if (e.type === 'input') {
                    if (!isInputChinese)
                        return inputHandleEvent();
                }
                if (e.type === 'compositionend') {
                    isInputChinese = false;
                    return inputHandleEvent();
                }
                elements.forEach(function (i) {
                    var targetId = e.target.classList.contains('text-value') ? e.target.parentElement.id : e.target.id;
                    var _ = document.getElementById(i);
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
        elements.map(function (i) {
            var el = document.getElementById(i);
            initInteract(el);
            initEvent(el);
            useObserver(function (e) {
                if (!(Array.from(e[0].target.classList).includes('active')))
                    _this_1.sendMessage('TEMPLATE_SELECT_TEXT_CLOSE', {});
            }).observe(el, classListObServerConfig);
        });
        function initSquare(element) {
            function createSquare(className) {
                var square = document.createElement('div');
                square.classList.add('square');
                square.classList.add(className);
                return square;
            }
            var squareTL = createSquare('top-left');
            var squareTR = createSquare('top-right');
            var squareBL = createSquare('bottom-left');
            var squareBR = createSquare('bottom-right');
            element.append(squareTL, squareTR, squareBL, squareBR);
            initSquareEvent();
            element.append(squareBR);
            initSquareEvent();
        }
        function initSquareEvent() {
            document.querySelectorAll('.square').forEach(function (i) {
                i.addEventListener('click', function (e) {
                    e.stopPropagation();
                });
            });
        }
        function initGlobalEvent() {
            document.addEventListener('click', function (e) {
                elements.forEach(function (i) {
                    // @ts-ignore
                    var idName = e.target.parentElement.id;
                    var el = getElementById(i);
                    if (i !== idName && elements.includes(idName) || idName === '') {
                        var classList = el.classList;
                        if (Array.from(classList).includes('active')) {
                            el.classList.remove('active');
                            el.classList.remove('square-container');
                        }
                    }
                });
            });
        }
    };
    BaseTemplateMethods.prototype.initBackground = function () {
        var _a = this.conf.config.background, type = _a.type, color = _a.color, image = _a.image, arrangement = _a.arrangement;
        var templateEl = document.getElementById('template');
        if (!templateEl)
            return;
        if (type === '')
            templateEl.style.background = '#fff';
        else if (type === 'color' || type === 'theme')
            templateEl.style.background = color || '#fff';
        else if (type === 'image') {
            templateEl.style.backgroundImage = "url(".concat(image.includes('data:image') && image.includes('base64,') ? image : "/api/".concat(image), ")");
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
    };
    BaseTemplateMethods.prototype.initHTMLTemplate = function () {
        var _this_1 = this;
        if (document.getElementById('template'))
            return;
        var fragment = document.createDocumentFragment();
        var templateElement = document.createElement('div');
        var mainTitleElement = document.createElement('div');
        var subTitleElement = document.createElement('div');
        var fromSourceElement = document.createElement('div');
        var logoElement = document.createElement('div');
        var chartAppElement = document.createElement('div');
        var createTextElement = function () {
            var textValueElement = document.createElement('div');
            textValueElement.classList.add('text-value');
            textValueElement.contentEditable = String(!_this_1.isSynthesisMode);
            return textValueElement;
        };
        var addDefaultAnimatedClass = function (el) { return el.classList.add('animated', 'fadeInDown'); };
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
    };
    BaseTemplateMethods.prototype.initViewStyle = function () {
        var body = document.body;
        var clarity = this.conf.config.video.clarity;
        var width;
        var height;
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
    };
    return BaseTemplateMethods;
}());
export default BaseTemplateMethods;
