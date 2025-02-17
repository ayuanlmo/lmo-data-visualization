import {Request, Response} from "express";
import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from "node:fs";
import path from "path";
import Utils from "../../utils";
import {ResourcesModel, TemplateModel} from "../dataBase";
import AppConfig from "../../conf/AppConfig";
import {WebSocketServer} from "../WebSocketServer";
import TaskScheduler from "../TaskScheduler";
import {get as httpGet, IncomingMessage} from "http";
import MemoryCache from "../../lib/MemoryCache";
import sharp from 'sharp';
import fs from "fs";
import createErrorMessage = Utils.createErrorMessage;
import createSuccessMessage = Utils.createSuccessMessage;

export default class Task {

    /**
     * @method createTask
     * @author ayuanlmo
     * @description 用于创建合成任务和保存自定义模板的方法
     *
     * 这一块业务有点复杂？，在这里简单介绍一下 合成、自定义模板的流程
     * 合成流程：
     *  当为合成任务时，首先需要检查合成服务器是否在线。否则将直接拒绝该任务。
     *  在生成合成任务前，需要先经行模板基础文件拷贝、配置文件生成，如果模板存在音频，检查是否需要处理拷贝后的音频html文件（为什么？ 请见下面p1）
     *  以上准备好后，向”调度器“推送任务并置数据库。
     *  PS：在数据库中，任务即资源。相关参数都在 Resources 表下
     *
     *  自定义模板流程
     *   拷贝模板基础文件（同合成任务一样）
     *   生成模板封面图
     *   置数据库
     *
     * P1：
     *     模板音频有个full模式，即音频存在两种状态。例如音频xxx.mp3为60s。模板为5s，非full，那么模板的音频持续时间则为5s。
     * 当为full模式时，模板的动画依旧为5s。但视频的持续时间为60s。前者，由于合成服务使用了wvc模块，可以内嵌html的audio标签作为音频。
     * 但这种只适用于非full模式。所以在非full模式下使用生成audio标签来完成音频的插入。而在full模式下，需要在合成服务单独处理音频。
     *
     * **/
    public static createTask(req: Request, res: Response): void {
        const {
            currentTemplateConfig = {}, // 当前模板配置
            saveAsCustomTemplate = false, // 保存为自定义模板
            customTemplateDesc = '', // 自定义模板介绍
            customTemplateName = require('uuid').v4(), // 自定义模板名称
            id = '', // 源模板id
            taskName = '', // 合成任务名称
            preview = false, // 是否预览
            cover = '' // 封面
        } = req.body;

        if (id === '')
            return void res.json(createErrorMessage('ext003'));

        if (!MemoryCache.get('SYNTHESIS_SERVICES_CONNECT_STATUS') && !saveAsCustomTemplate && !preview) {
            WebSocketServer.sendMessage(JSON.stringify({
                type: 'SERVICE_RE_CONNECT_ERROR',
                message: {}
            }));

            return void res.json(createErrorMessage('ext009'));
        }

        TemplateModel.findOne({
            where: {
                id
            }
        }).then(async (template) => {
            if (!template)
                return void res.json(createErrorMessage('ext004'));

            const pathName: string = preview ? 'previewTemplate' : 'templates';
            const originalTemplate: string = path.resolve(`./_data/static/public/${template?.dataValues.path.replace('/static', '').replace('/index.html', '')}`);
            const templatePathName: string = require('uuid').v4();
            const dirPath: string = path.resolve(`./_data/static/public/${pathName}/${templatePathName}`);
            const templateStaticPath: string = `/static/${pathName}/${templatePathName}`;
            const dbId: string = require('uuid').v4();
            const serverHttpUrl: string = `http://localhost:${AppConfig.__SERVER_PORT}`;
            const htmlPath: string = path.resolve(dirPath, 'index.html');
            const htmPath: string = path.resolve(dirPath, 'index.htm');
            const taskAudioConfig = {
                audioPath: '',
                audioVolume: 100,
                pAudio: false
            };

            // 源模板是否存在
            if (existsSync(originalTemplate)) {
                if (!existsSync(dirPath))
                    mkdirSync(dirPath);

                // 读取 并 拷贝模板相关文件
                readdirSync(originalTemplate).forEach((file: string): void => {
                    const ignoreFiles: Array<string> = ['index.js', 'index.html', 'index.htm'];

                    if (ignoreFiles.includes(file))
                        copyFileSync(path.resolve(`${originalTemplate}/${file}`), path.resolve(`${dirPath}/${file}`));
                });
                // 写出模板配置文件 "conf.js"
                writeFileSync(path.resolve(dirPath, 'conf.js'), `const config = ${JSON.stringify({
                    ...currentTemplateConfig,
                    id: dbId,
                    template: id
                })}\n export default config;`);

                if (currentTemplateConfig?.data && Array.isArray(currentTemplateConfig.data))
                    // 写出模板数据文件
                    writeFileSync(path.resolve(dirPath, 'data.json'), JSON.stringify(currentTemplateConfig?.data));
                else
                    return void res.json(createErrorMessage('ext00e'));

                // 保存为自定义模板时为模板增加封面图
                if (saveAsCustomTemplate) {
                    if (!cover.includes(';base64,'))
                        return res.json(createErrorMessage('ext0010'));

                    const base64Cover = cover.split(';base64,').pop();
                    const base64Buffer = Buffer.from(base64Cover, 'base64');

                    try {
                        await sharp(base64Buffer)
                            .resize(460, 258)
                            .toFile(path.resolve(dirPath, 'cover.png'));
                        await sharp(base64Buffer)
                            .resize(460, 258)
                            .toFile(path.resolve(dirPath, 'cover.gif'));
                    } catch (e) {
                        res.json(createErrorMessage('ext00e'));
                        console.log(e);
                    }
                }

                if (!preview && !saveAsCustomTemplate) {
                    try {
                        // 合成时 处理模板音频（如果有
                        if (currentTemplateConfig.config.audio.path !== '') {
                            if (currentTemplateConfig.config.audio.full) {
                                taskAudioConfig.pAudio = true; // 合成服务器是否需要处理音频（full模式下
                                taskAudioConfig.audioVolume = Number(currentTemplateConfig.config.audio.volume); // 音量
                                taskAudioConfig.audioPath = path.resolve(`./_data/static/public${currentTemplateConfig.config.audio.path.replace('/static', '')}`) // 音频文件地址
                            } else {
                                const audioElement: string = `<audio src="${serverHttpUrl}${currentTemplateConfig.config.audio.src}" volume="${Number(currentTemplateConfig.config.audio.volume) / 100}"></audio>`;
                                const audioTag: string = `<!--__LMO_SERVER_AUDIO_RENDER_TAG-->`; // 这个html注释，将会被替换成<audio src="..." />
                                let originHtmlContent: string = '';
                                let afterHtmlContent: string = '';

                                if (existsSync(htmlPath))
                                    originHtmlContent = readFileSync(path.resolve(dirPath, 'index.html')).toString();
                                else if (existsSync(htmPath))
                                    originHtmlContent = readFileSync(path.resolve(dirPath, 'index.htm')).toString();
                                else
                                    originHtmlContent = await Task.getTemplateHTMLString(); // index.html 和 index.htm都不存在的情况下，则取内置的模板引擎

                                if (originHtmlContent.includes(audioTag))
                                    afterHtmlContent = originHtmlContent.replace(audioTag, audioElement);
                                else
                                    afterHtmlContent = originHtmlContent + '\n' + audioElement;

                                writeFileSync(path.resolve(dirPath, 'index.html'), afterHtmlContent);
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
                // 预览
                if (preview) {
                    return void res.json(createSuccessMessage({
                        path: `${templateStaticPath}/${existsSync(htmlPath) ? 'index.html' : existsSync(htmPath) ? 'index.htm' : '/'}?__type=h`,
                        id: templatePathName
                    }));
                }
                // 保存自定义模板
                else if (saveAsCustomTemplate) {
                    const dbData = {
                        id: dbId,
                        name: customTemplateName,
                        description: customTemplateDesc,
                        path: `${templateStaticPath}/${existsSync(htmlPath) ? 'index.html' : existsSync(htmPath) ? 'index.htm' : '/'}`,
                        createTime: new Date().getTime(),
                        cover: templateStaticPath + '/cover.png',
                        gifCover: templateStaticPath + '/cover.gif',
                        type: 0
                    };
                    fs.writeFileSync(path.resolve(`${dirPath}/.initialized.t.bin`), Buffer.from(JSON.stringify(dbData)));

                    TemplateModel.create(dbData).then(() => {
                        res.status(204).send();
                    }).catch(() => {
                        res.json(createErrorMessage('ext00d'));
                    });
                } else {
                    // 生成合成任务，并通知合成服务器
                    try {
                        const templateServerUrl: string = `${templateStaticPath}/${existsSync(htmlPath) ? 'index.html' : existsSync(htmPath) ? 'index.htm' : ''}?__type=h`;

                        await (async (): Promise<void> => {
                            const taskConfig = {
                                id: dbId,
                                path: `${serverHttpUrl}${templateServerUrl}`,
                                duration: currentTemplateConfig.config.video.duration ?? 5000 as number,
                                ...Task.getVideoClarity(currentTemplateConfig.config.video.clarity ?? ''),
                                fps: currentTemplateConfig.config.video.fps ?? 30 as number,
                                optPath: path.resolve(`./_data/static/public/output/${dbId}.mp4`),
                                fileName: `${dbId}`,
                                folder: path.resolve(`./_data/static/public/output/`)
                            };
                            const dbData = {
                                id: dbId,
                                template: id,
                                filePath: '',
                                name: taskName === '' ? require('uuid').v4() : taskName,
                                templatePath: dirPath,
                                createTime: new Date().getTime(),
                                url: templateServerUrl,
                                clarity: currentTemplateConfig.config.video.clarity ?? '1080P',
                                status: 'pending',
                                taskConfig: JSON.stringify(taskConfig)
                            };

                            await ResourcesModel.create(dbData);

                            res.status(204).send();

                            // @ts-ignore
                            TaskScheduler.push({
                                ...taskConfig,
                                name: dbData.name,
                                ...taskAudioConfig
                            });

                            // 通知页面
                            WebSocketServer.sendMessage(JSON.stringify({
                                type: 'TASK_PENDING',
                                message: {
                                    id: dbId,
                                    name: dbData.name
                                }
                            }));
                        })();
                    } catch (e) {
                        res.json(createErrorMessage('ext00d'));
                    }
                }

            } else
                res.json(createErrorMessage('ext00e'));
        });
    }

    private static getTemplateHTMLString(): Promise<string> {
        return new Promise((resolve: (data: string) => void, reject: (data: string) => void): void => {
            httpGet(`http://localhost:3000/static/templates`, (res: IncomingMessage): void => {
                res.on('data', (htmlData: Buffer): void => resolve(htmlData.toString()));
                res.on('error', (): void => reject(''));
            });
        });
    }

    private static getVideoClarity = (clarity: string): {
        width: number;
        height: number;
    } => {
        switch (clarity) {
            case '1080P':
                return {
                    width: 1920,
                    height: 1080
                }
            case '2K':
                return {
                    width: 2560,
                    height: 1440
                }
            case '4K':
                return {
                    width: 4096,
                    height: 2160
                }
            default:
                return {
                    width: 1920,
                    height: 1080
                }
        }
    }
}
