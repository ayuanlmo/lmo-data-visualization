import {existsSync, readdirSync, rmdirSync, statSync, unlinkSync} from "node:fs";
import path from "path";
import fs from "fs";

export interface IResponseMessage {
    code: number;
    message: string;
    success: boolean;
    data: any;
    _t: number;
    _app: string;
}

export type TErrorCode = 500 | 404 | 401;

export interface IErrorMessage {
    code?: TErrorCode;
    message?: string;
    data?: any;
}

namespace Utils {
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
        const {code = 500, message = '', data = {}} = options;

        return {
            code,
            message,
            data,
            success: false,
            _t: getNowTimestamp(),
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

    export const isZipFile = (filePath: string): boolean => {
        try {
            const buffer: Buffer = fs.readFileSync(filePath);
            const signature: Buffer = buffer.slice(0, 4);

            return signature[0] === 0x50 && signature[1] === 0x4B &&
                (signature[2] === 0x03 || signature[2] === 0x05 || signature[2] === 0x07) &&
                (signature[3] === 0x04 || signature[3] === 0x06 || signature[3] === 0x08);
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    export const getNowTimestamp = (): number => Date.now();

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
