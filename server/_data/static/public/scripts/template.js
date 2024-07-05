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
import { useDebounce, useObserver } from "./utils.js";
var LmoTemplate = /** @class */ (function () {
    function LmoTemplate(conf) {
        var _this_1 = this;
        this.conf = conf;
        this.isSynthesisMode = location.href.includes('__type=h');
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
    }
    LmoTemplate.prototype.tryRender = function () {
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
    LmoTemplate.prototype.sendMessage = function (type, message) {
        if (this.isSynthesisMode)
            return;
        parent.postMessage({
            type: type,
            message: message
        }, location.origin);
    };
    LmoTemplate.prototype.fetchData = function () {
        var _this_1 = this;
        fetch('data.json')
            .then(function (res) { return res.json(); })
            .then(function (json) {
            _this_1.sendMessage('TEMPLATE_DATA', json);
            _this_1.conf.data = json;
            _this_1.tryRender();
        });
    };
    LmoTemplate.prototype.initText = function (data) {
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
    LmoTemplate.prototype.sendTemplateSelectTextConfig = function (el) {
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
    LmoTemplate.prototype.onMessage = function (e) {
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
    LmoTemplate.prototype.initDrag = function () {
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
        elements.map(function (i) {
            var el = document.getElementById(i);
            initInteract(el);
            initEvent(el);
            useObserver(function (e) {
                if (e[0].target.classList.length === 0)
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
            // 给所有square 阻止冒泡
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
                    if (i !== idName && elements.includes(idName) || idName === '') {
                        var classList = getElementById(i).classList;
                        if (classList.length !== 0) {
                            getElementById(i).classList.remove('active');
                            getElementById(i).classList.remove('square-container');
                        }
                    }
                });
            });
        }
    };
    LmoTemplate.prototype.initBackground = function () {
        var _a = this.conf.config.background, type = _a.type, color = _a.color, image = _a.image, arrangement = _a.arrangement;
        var templateEl = document.getElementById('template');
        if (!templateEl)
            return;
        if (type === '')
            templateEl.style.background = '#fff';
        if (type === 'color' || type === 'theme')
            templateEl.style.background = color === '' ? '#fff' : color;
        if (type === 'image') {
            if (image.includes('data:image') && image.includes('base64'))
                templateEl.style.backgroundImage = "url(" + image + ")";
            else
                templateEl.style.backgroundImage = "url(" + "/api/" + image + ")";
            templateEl.style.backgroundRepeat = 'no-repeat';
            if (arrangement === 'cover')
                templateEl.style.backgroundSize = 'cover';
            if (arrangement === 'left')
                templateEl.style.backgroundPositionX = 'left';
            if (arrangement === 'right')
                templateEl.style.backgroundPositionX = 'right';
        }
    };
    LmoTemplate.prototype.initViewStyle = function () {
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
    return LmoTemplate;
}());
export default LmoTemplate;
