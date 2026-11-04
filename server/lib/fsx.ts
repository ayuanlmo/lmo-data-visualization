import {closeSync, existsSync, openSync, readdirSync, readSync, rmdirSync, statSync, unlinkSync} from "node:fs";
import path from "path";

/**
 * 文件系统操作工具模块（由 `utils` 再导出以保持既有调用点不变）。
 */

/**
 * 递归删除必须传入「完整路径」而非文件名，否则会在当前工作目录下误删同名文件。
 */
export const deleteFolderRecursive = (dir: string): boolean => {
    if (!existsSync(dir)) return false;
    const files: Array<string> = readdirSync(dir);

    for (const file of files) {
        const filePath: string = path.join(dir, file);
        const stats = statSync(filePath);

        if (stats.isDirectory())
            deleteFolderRecursive(filePath);
        else
            unlinkSync(filePath);
    }

    rmdirSync(dir);
    return true;
};

/**
 * 只校验普通 zip 的首部魔数 `PK\x03\x04`（排除空归档/分卷等伪组合），
 * 并仅读头部 4 字节的缓冲区分块读取，不整文件载入内存。
 */
export const isZipFile = (filePath: string): boolean => {
    let fd: number | undefined;

    try {
        fd = openSync(filePath, 'r');
        const signature: Buffer = Buffer.alloc(4);
        const bytesRead: number = readSync(fd, signature, 0, 4, 0);

        if (bytesRead < 4) return false;

        return signature[0] === 0x50 && signature[1] === 0x4B &&
            signature[2] === 0x03 && signature[3] === 0x04;
    } catch {
        return false;
    } finally {
        if (fd !== undefined) closeSync(fd);
    }
};
