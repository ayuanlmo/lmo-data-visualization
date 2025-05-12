import errorMessage from "../const/ErrorMessage";
import {existsSync, readdirSync, rmdirSync, statSync, unlinkSync} from "node:fs";
import path from "path";

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

    export const deleteFolderRecursive = (dir: string): boolean => {
        if (!existsSync(dir)) return false;
        const files = readdirSync(dir);

        for (let file of files) {
            const filePath = path.join(dir, file);
            const stats = statSync(filePath);

            if (stats.isDirectory())
                deleteFolderRecursive(file);
            else
                unlinkSync(filePath);
        }

        rmdirSync(dir);
        return true;
    }
}


export default Utils
