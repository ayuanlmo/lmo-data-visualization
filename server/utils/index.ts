import * as fsx from "./../lib/fsx.js";

// fs 操作实现在 lib/fsx.ts；下方 Utils 命名空间内以同名成员委派，
// 保持既有调用点（Utils.deleteFolderRecursive / Utils.isZipFile）不变。

export interface IResponseMessage {
    code: number;
    message: string;
    success: boolean;
    data: any;
    _t: number;
    _app: string;
    /** 仅 live-server 拒绝场景输出 'ext00el'（web_app 拦截器契约） */
    errorCode?: string;
}

// 业务码由 AppError.contractCode 统一提供，类型为宽数值。
export type TErrorCode = number;

export interface IErrorMessage {
    code?: TErrorCode;
    message?: string;
    data?: any;
    /** live-server 拒绝需回传 errorCode:'ext00el'（web_app Request 拦截器依赖） */
    errorCode?: string;
}

namespace Utils {
    // 委派至 lib/fsx.ts
    export const deleteFolderRecursive = fsx.deleteFolderRecursive;
    export const isZipFile = fsx.isZipFile;

    export const createSuccessMessage = (data = {}, msg: string = 'success', code = 200): IResponseMessage => {
        return {
            code: code,
            message: msg,
            success: true,
            data: data,
            _t: getNowTimestamp(),
            _app: 'lmo_dv_sa_t'
        }
    }

    export const createErrorMessage = (options: IErrorMessage): IResponseMessage => {
        const {code = 500, message = '', data = {}, errorCode} = options;

        return {
            code,
            message,
            data,
            success: false,
            _t: getNowTimestamp(),
            _app: 'lmo_dv_sa_t',
            // 仅在显式传入时输出，保证其余错误响应结构不变
            ...(errorCode ? {errorCode} : {})
        }
    }

    export const getNowTimestamp = (): number => Date.now();

    /**
     * LIKE 元字符转义。查询字符串中的 `%`/`_`/`\` 若不转义直接拼入 Op.like，
     * 可绕过模糊语义（用户输入 % 即拉全表）。转义后作为字面量匹配。
     */
    export const escapeLike = (value: string): string =>
        String(value ?? '').replace(/[\%_\\]/g, '\\$&');

    export const calculatePagination = (pageIndex: unknown, pageSize: unknown): [number, number] => {
        const numIndex: number = typeof pageIndex === 'string' && pageIndex.trim() === '' ? NaN : Number(pageIndex);
        const numSize: number = typeof pageSize === 'string' && pageSize.trim() === '' ? NaN : Number(pageSize);
        const page: number = isNaN(numIndex) || numIndex < 1 ? 1 : Math.floor(numIndex);
        const size: number = isNaN(numSize) || numSize < 1 ? 10 : Math.floor(numSize);
        const offset = (page - 1) * size;

        return [offset, size];
    };
}


export default Utils
