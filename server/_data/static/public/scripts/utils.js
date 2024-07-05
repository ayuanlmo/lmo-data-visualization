export function getDiffColor(start, end, step, gamma) {
    if (gamma === void 0) { gamma = 1; }
    var _pc = function (_hs) {
        return _hs.length === 4 ? _hs.substr(1).split('').map(function (_) {
            return 0x11 * parseInt(_, 16);
        }) : [_hs.substr(1, 2), _hs.substr(3, 2), _hs.substr(5, 2)].map(function (_) {
            return parseInt(_, 16);
        });
    };
    var _p = function (_) {
        return _.length === 1 ? '0' + _ : _;
    };
    var normalize = function (_) {
        return Math.pow(_ / 255, gamma);
    };
    var output = [];
    var so = [];
    var i = 0, j = 0, ms = 0, me = 0;
    var _start = _pc(start).map(normalize);
    var _end = _pc(end).map(normalize);
    for (i = 0; i < step; i += 1) {
        ms = i / (step - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j += 1) {
            so[j] = _p(Math.round(Math.pow(_start[j] * me + _end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push("#".concat(so.join('')));
    }
    return output;
}
export function rgbToHex(color) {
    if (color === void 0) { color = ''; }
    var _ = color;
    var _r = /^#([\da-fA-f]{3}|[\da-fA-f]{6})$/;
    if (_.indexOf('rgb') === -1)
        return _;
    if (/^(rgb|RGB)/.test(_)) {
        var _color = _.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var _hex = "#";
        for (var i = 0; i < _color.length; i += 1) {
            var _h = Number(_color[i]).toString(16);
            if (_h.length < 2)
                _h = '0' + _h;
            _hex += _h;
        }
        if (_hex.length !== 7)
            _hex = _;
        return _hex;
    }
    else if (_r.test(_)) {
        var _n = _.replace(/#/, "").split("");
        if (_n.length === 6)
            return _;
        else if (_n.length === 3) {
            var _nHex = "#";
            for (var i = 0; i < _n.length; i += 1) {
                _nHex += _n[i] + _n[i];
            }
            return _nHex;
        }
    }
    return _;
}
export function throttle(func, delay) {
    var timerId;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!timerId) {
            timerId = setTimeout(function () {
                func.apply(void 0, args);
                timerId = null;
            }, delay);
        }
    };
}
export function useDebounce(func, delay) {
    var timerId;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        clearTimeout(timerId);
        timerId = setTimeout(function () {
            func.apply(void 0, args);
        }, delay);
    };
}
export function useObserver(cb) {
    return new MutationObserver(function (mutation) {
        cb(mutation);
    });
}
