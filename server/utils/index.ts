import errorMessage from "../const/ErrorMessage";

export interface IResponseMessage {
    code: number;
    message: string;
    errorCode?: string;
    success: boolean;
    data: any;
    _t: number;
    _app: string;
}

export type ErrorMessage = typeof errorMessage;

export type ErrorCode = 500 | 404 | 401;

namespace Utils {
    export const createSuccessMessage = (data = {}, msg: string = 'success', code = 200): IResponseMessage => {
        return {
            code: code,
            message: msg,
            success: true,
            data: data,
            _t: new Date().getTime(),
            _app: 'lmo_dv_sa_t'
        }
    }

    export const createErrorMessage = <T extends keyof ErrorMessage>(errCode: T, code: ErrorCode = 500, data: object | Array<any> = {}): IResponseMessage => {
        return {
            code: code,
            message: errorMessage[errCode].message,
            errorCode: errCode,
            data: data,
            success: false,
            _t: new Date().getTime(),
            _app: 'lmo_dv_sa_t'
        }
    }
}


export default Utils
