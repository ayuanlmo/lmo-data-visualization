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
import createErrorMessage = Utils.createErrorMessage;
import createSuccessMessage = Utils.createSuccessMessage;

export default class Task {
    public static createTask(req: Request, res: Response): void {
        const {
            currentTemplateConfig = {},
            customTemplateDesc = '',
            customTemplateName = require('uuid').v4(),
            id = '',
            taskName = '',
            preview = false
        } = req.body;

        if (id === '')
            return void res.json(createErrorMessage('ext003'));

        if (!MemoryCache.get('SYNTHESIS_SERVICES_CONNECT_STATUS')) {
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

            if (existsSync(originalTemplate)) {
                if (!existsSync(dirPath))
                    mkdirSync(dirPath);

                readdirSync(originalTemplate).forEach((file: string): void => {
                    const ignoreFiles: Array<string> = ['index.js', 'index.html', 'index.htm'];

                    if (ignoreFiles.includes(file))
                        copyFileSync(path.resolve(`${originalTemplate}/${file}`), path.resolve(`${dirPath}/${file}`));
                });
                writeFileSync(path.resolve(dirPath, 'conf.js'), `const config = ${JSON.stringify({
                    ...currentTemplateConfig,
                    id: dbId,
                    template: id
                })}\n export default config;`);
                writeFileSync(path.resolve(dirPath, 'data.json'), JSON.stringify(currentTemplateConfig?.data));

                const taskAudioConfig = {
                    audioPath: '',
                    audioVolume: 100,
                    pAudio: false
                };
                const htmlPath: string = path.resolve(dirPath, 'index.html');
                const htmPath: string = path.resolve(dirPath, 'index.htm');

                try {
                    if (currentTemplateConfig.config.audio.path !== '') {
                        if (currentTemplateConfig.config.audio.full) {
                            taskAudioConfig.pAudio = true;
                            taskAudioConfig.audioVolume = Number(currentTemplateConfig.config.audio.volume);
                            taskAudioConfig.audioPath = path.resolve(`./_data/static/public${currentTemplateConfig.config.audio.path.replace('/static', '')}`)
                        } else {
                            const audioElement: string = `<audio src="${serverHttpUrl}${currentTemplateConfig.config.audio.src}" volume="${Number(currentTemplateConfig.config.audio.volume) / 100}"></audio>`;
                            const audioTag: string = `<!--__LMO_SERVER_AUDIO_RENDER_TAG-->`;
                            let originHtmlContent: string = '';
                            let afterHtmlContent: string = '';

                            if (existsSync(htmlPath))
                                originHtmlContent = readFileSync(path.resolve(dirPath, 'index.html')).toString();
                            else if (existsSync(htmPath))
                                originHtmlContent = readFileSync(path.resolve(dirPath, 'index.htm')).toString();
                            else
                                originHtmlContent = await Task.getTemplateHTMLString();

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
                if (preview) {
                    return void res.json(createSuccessMessage({
                        path: `${templateStaticPath}/${existsSync(htmlPath) ? 'index.html' : existsSync(htmPath) ? 'index.htm' : '/'}?__type=h`,
                        id: templatePathName
                    }));
                } else {
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
