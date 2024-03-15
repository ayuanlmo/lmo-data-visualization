/***
 * @method getDiffColor 获取差异颜色
 * @author ayuanlmo
 * @param start {string} not null 开始
 * @param end {string} not null 结束
 * @param step {number} 长度
 * @param gamma {number}    伽马
 * @return {array}
 * **/
export function getDiffColor(start, end, step, gamma) {
    const _pc = (_hs) => {
        return _hs.length === 4 ? _hs.substr(1).split('').map(_ => {
            return 0x11 * parseInt(_, 16);
        }) : [_hs.substr(1, 2), _hs.substr(3, 2), _hs.substr(5, 2)].map((_) => {
            return parseInt(_, 16);
        });
    };
    const _p = (_) => {
        return _.length === 1 ? '0' + _ : _;
    };
    const normalize = (_) => {
        return Math.pow(_ / 255, gamma);
    };
    const output = [];
    const so = [];

    let i = 0, j = 0, ms = 0, me = 0;

    gamma = gamma || 1;
    start = _pc(start).map(normalize);
    end = _pc(end).map(normalize);
    for (i = 0; i < step; i += 1) {
        ms = i / (step - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j += 1) {
            so[j] = _p(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push(`#${so.join('')}`);
    }
    return output;
}

/**
 * @method rgbToHex reg转16进制
 * @author ayuanlmo
 * @param color {string} not null reg颜色
 * @return {string} 16进制颜色
 * **/
export function rgbToHex(color = '') {
    const _ = color;
    const _r = /^#([\da-fA-f]{3}|[\da-fA-f]{6})$/;

    if (_.indexOf('rgb') === -1)
        return _;
    if (/^(rgb|RGB)/.test(_)) {
        const _color = _.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");

        let _hex = "#";

        for (let i = 0; i < _color.length; i += 1) {
            let _h = Number(_color[i]).toString(16);

            if (_h.length < 2)
                _h = '0' + _h;
            _hex += _h;
        }
        if (_hex.length !== 7)
            _hex = _;
        return _hex;
    } else if (_r.test(_)) {
        const _n = _.replace(/#/, "").split("");

        if (_n.length === 6)
            return _;
        else if (_n.length === 3) {
            let _nHex = "#";

            for (let i = 0; i < _n.length; i += 1) {
                _nHex += _n[i] + _n[i];
            }
            return _nHex;
        }
    }
    return _;
}


export function throttle(func, delay) {
    let timerId;
    return function (...args) {
        if (!timerId) {
            timerId = setTimeout(() => {
                func(...args);
                timerId = null;
            }, delay);
        }
    };
}

export function useDebounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func(...args);
        }, delay);
    };
}

export function useObserver(cb) {
    return new MutationObserver((mutation) => {
        cb(mutation);
    });
}
