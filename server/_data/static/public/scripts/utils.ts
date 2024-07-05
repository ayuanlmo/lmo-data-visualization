export function getDiffColor(start: string, end: string, step: number, gamma: number = 1): Array<string> {
    const _pc = (_hs: string): Array<number> => {
        return _hs.length === 4 ? _hs.substr(1).split('').map((_: string) => {
            return 0x11 * parseInt(_, 16);
        }) : [_hs.substr(1, 2), _hs.substr(3, 2), _hs.substr(5, 2)].map((_: string) => {
            return parseInt(_, 16);
        });
    };
    const _p = (_: string): string => {
        return _.length === 1 ? '0' + _ : _;
    };
    const normalize = (_: number): number => {
        return Math.pow(_ / 255, gamma);
    };
    const output: Array<string> = [];
    const so: Array<string> = [];
    let i: number = 0, j: number = 0, ms: number = 0, me: number = 0;
    const _start: Array<number> = _pc(start).map(normalize);
    const _end: Array<number> = _pc(end).map(normalize);

    for (i = 0; i < step; i += 1) {
        ms = i / (step - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j += 1) {
            so[j] = _p(Math.round(Math.pow(_start[j] * me + _end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push(`#${so.join('')}`);
    }
    return output;
}

export function rgbToHex(color: string = ''): string {
    const _: string = color;
    const _r: RegExp = /^#([\da-fA-f]{3}|[\da-fA-f]{6})$/;

    if (_.indexOf('rgb') === -1)
        return _;
    if (/^(rgb|RGB)/.test(_)) {
        const _color: Array<string> = _.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");

        let _hex: string = "#";

        for (let i: number = 0; i < _color.length; i += 1) {
            let _h: string = Number(_color[i]).toString(16);

            if (_h.length < 2)
                _h = '0' + _h;
            _hex += _h;
        }
        if (_hex.length !== 7)
            _hex = _;
        return _hex;
    } else if (_r.test(_)) {
        const _n: Array<string> = _.replace(/#/, "").split("");

        if (_n.length === 6)
            return _;
        else if (_n.length === 3) {
            let _nHex: string = "#";

            for (let i: number = 0; i < _n.length; i += 1) {
                _nHex += _n[i] + _n[i];
            }
            return _nHex;
        }
    }
    return _;
}

export function throttle(func: Function, delay: number) {
    let timerId: any;
    return function (...args: Array<any>): void {
        if (!timerId) {
            timerId = setTimeout((): void => {
                func(...args);
                timerId = null;
            }, delay);
        }
    };
}

export function useDebounce(func: Function, delay: number) {
    let timerId: any;
    return function (...args: Array<any>): void {
        clearTimeout(timerId);
        timerId = setTimeout((): void => {
            func(...args);
        }, delay);
    };
}

export function useObserver(cb: Function): MutationObserver {
    return new MutationObserver((mutation: Array<MutationRecord>): void => {
        cb(mutation);
    });
}
