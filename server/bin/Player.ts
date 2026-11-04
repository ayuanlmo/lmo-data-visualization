import {ReadStream} from "node:fs";
import fs from "fs";
import type { FastifyRequest, FastifyReply } from "fastify";
import {UpLoadFilesModel} from "./dataBase/index.js";
import Logger from "./../lib/Log.js";
import {AppError, ErrorCode, rethrowAppError} from "./../lib/AppError.js";
import {dataPath} from "./../lib/dataDir.js";

// 允许透传的媒体类型白名单（防止把 DB 存的任意字符串当响应头，造成存储型响应头注入）
const ALLOWED_CONTENT_TYPES: Array<string> = [
    'video/mp4', 'video/webm', 'video/ogg',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/aac'
];

export default class Player {
    public static async stream(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const range: string | undefined = request.headers.range as string | undefined;

        if (!range) {
            return void reply.send({
                code: 500,
                message: 'No range header'
            });
        }

        const {id} = request.params as {id: string};

        try {
            const data = await UpLoadFilesModel.findOne({
                where: {
                    id
                }
            });

            if (!data)
                throw new AppError(ErrorCode.FILE_NOT_FOUND);

            const {path: dbPath, type} = data.dataValues;
            const filePath: string = dataPath('static', 'public', 'uploads', dbPath.split('/static/uploads')[1]);

            if (!fs.existsSync(filePath))
                throw new AppError(ErrorCode.FILE_MISSING);

            const size: number = fs.statSync(filePath).size;
            const p: Array<string> = range.replace(/bytes=/, '').split('-');
            const start: number = parseInt(p[0], 10);
            const end: number = p[1] ? parseInt(p[1], 10) : size - 1;

            // createReadStream 必须传 {start, end}，否则 Content-Range 与实际字节不符
            const stream: ReadStream = fs.createReadStream(filePath, {start, end});
            const safeType: string = ALLOWED_CONTENT_TYPES.includes(type) ? type : 'application/octet-stream';

            reply.code(206).headers({
                'Content-Type': safeType,
                'Accept-Ranges': 'bytes',
                'Content-Length': (end - start) + 1,
                'Content-Range': `bytes ${start}-${end}/${size}`
            }).send(stream);
        } catch (e) {
            rethrowAppError(e);
            Logger.error(e);
            throw new AppError(ErrorCode.SERVER_ERROR);
        }
    }
}
