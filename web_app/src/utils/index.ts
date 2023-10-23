namespace Utils {
    export function formatTime(s: number): string {
        const h: number | string = Math.floor(s / 3600) >= 10 ? Math.floor(s / 3600) : '0' + Math.floor(s / 3600);

        s -= 3600 * Number(h);
        const m: number | string = Math.floor(s / 60) >= 10 ? Math.floor(s / 60) : '0' + Math.floor(s / 60);

        s -= 60 * Number(m);
        return h + ':' + m + ':' + `${s >= 10 ? s : '0' + s}`;
    }

    export function formatDate(time: number): string {
        const date: Date = new Date(time);
        const month: number | string = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        const currentDate: number | string = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const hh: number | string = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        const mm: number | string = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

        return date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm;
    }

    export function getWsUrl(url: string): string {
        if (!url || !origin)
            throw new Error('Invalid URL');

        return `${origin.includes('https') ? 'wss' : 'ws'}://${location.host}${url}`;
    }

    export function isObject(data = {}): boolean {
        return typeof data === 'object' && data !== null && !Array.isArray(data);
    }

    export function toString<T>(data: T): string {
        const typeHandlers = {
            boolean: (data: boolean) => `${data}`,
            string: (data: string) => data,
            number: (data: number) => `${data}`,
            object: (data: object) => isObject(data) ? stringify(data) : ''
        };

        const type = typeof data;

        if (typeHandlers.hasOwnProperty(type)) {
            // @ts-ignore
            return typeHandlers[type](data);
        }
        return '';
    }

    export function stringify(data: any): string {
        return JSON.stringify(data);
    }

    export function isArray(arr: any): boolean {
        return Object.prototype.toString.call(arr) === "[object Array]" && Array.isArray(arr);
    }

    export function toBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const fr: FileReader = new FileReader();

            fr.readAsDataURL(file);
            fr.onload = function (res: ProgressEvent<FileReader>): void {
                resolve(res.target?.result as string);
            };
            fr.onerror = (msg: ProgressEvent<FileReader>): void => {
                reject(msg);
            };
        });
    }

    export function selectFiles(multiple: boolean = false): Promise<Array<FileList>> {
        return new Promise((resolve, reject): void => {
            const i: HTMLInputElement = document.createElement('input');

            if (multiple)
                i.multiple = true;
            i.type = 'file';

            const _ = (): void => {
                resolve(i.files as unknown as Array<FileList>);
                i.removeEventListener('change', _);
            }
            i.addEventListener('change', _);
            i.click();
        });
    }

    export function downloadFile(conf: {
        download: string;
        href: string;
    }): Promise<HTMLAnchorElement> {
        return new Promise((resolve, reject): void => {
            const a: HTMLAnchorElement = document.createElement('a');

            a.download = `${conf.download}`;
            a.href = conf.href;
            resolve(a);
        });
    }

    export function formatSec(sec: number, isMs?: boolean): string {
        if (isMs)
            sec /= 1000;

        let _: string = String(parseInt(String(sec / 60)));
        let __: string = String(parseInt(String(sec % 60)));

        if (_.length === 1)
            _ = `0${_}`;
        if (__.length === 1)
            __ = `0${__}`;

        return `${_}:${__}`;
    }

    export function createFormData<T extends object>(data: T): FormData {
        const fd: FormData = new FormData();

        Object.keys(data).map((i: string): void => {
            // @ts-ignore
            fd.append(i, data[i]);
        });
        return fd;
    }

    export function createQueryParams(data = {}): string {
        let str = '?';

        Object.keys(data).map((i: string): void => {
            // @ts-ignore
            str += `${i}=${data[i]}&`;
        });

        return str.substring(0, str.length - 1);
    }

    export function isMobileDevice(): boolean {
        return !!navigator.userAgent.match(/Mobile/i)?.length;
    }
}

export default Utils;
