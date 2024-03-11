import React, {useCallback, useEffect, useRef, useState} from "react";
import MyStorage from "../lib/Storage";
import Utils from "../utils";

export namespace Hooks {
    const __UNDEF: undefined = void false;

    export const useThrottle = (cb: Function, delay: number = 100) => {
        const timer: React.MutableRefObject<number | undefined> = useRef(__UNDEF);

        return useCallback((...args: any): void => {
            if (timer.current) return;

            timer.current = setTimeout((): void => {
                cb(...args);
                timer.current = __UNDEF;
            }, delay) as unknown as number;
        }, [cb, delay]);
    };

    export const useEventListener = <T extends keyof WindowEventMap>(type: T, listener: (...args: Array<WindowEventMap[T]>) => any, delay: number = 100): void => {
        useEffect(() => {
            const handler = (...args: Array<WindowEventMap[T]>): void => {
                useThrottle(listener(...args), delay);
            };

            addEventListener(type, handler);

            return (): void => removeEventListener(type, handler);
        }, []);
    };

    export const useMount = (cb: () => void): void => {
        useEffect((): void => {
            cb();
        }, [cb]);
    };

    export const useUnmount = (cb: () => void): void => {
        useEffect((): void => {
            return cb();
        }, [cb]);
    };

    export const useTimeout = (timeout: number, cb: () => void): void => {
        useEffect(() => {
            const _ = setTimeout(cb, timeout);

            return (): void => clearTimeout(_);
        }, [timeout, cb]);
    };

    export const useStorage = (k: string, v: any): [any, (value: any) => void] => {
        const [value, setValue] = useState<any>(v);

        useEffect((): void => {
            MyStorage.set(k, Utils.toString<typeof v>(v));
        }, [value]);

        return [value, setValue];
    };
}

export const {
    useMount,
    useUnmount,
    useTimeout,
    useThrottle,
    useEventListener,
    useStorage
} = Hooks;

export default Hooks;
