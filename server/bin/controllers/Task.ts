import {Request, Response} from "express";
import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync} from "node:fs";
import path from "path";
import Utils from "../../utils";
import {ResourcesModel, TemplateModel} from "../dataBase";
import AppConfig from "../../conf/AppConfig";
import TaskScheduler from "../TaskScheduler";
import {WebSocketServer} from "../WebSocketServer";
import createErrorMessage = Utils.createErrorMessage;

export default class Task {
    public static createTask(req: Request, res: Response): void {
        const {
            currentTemplateConfig = {},
            customTemplateDesc = '',
            customTemplateName = require('uuid').v4(),
            id = '',
            taskName = ''
        } = req.body;

        if (id === '')
            return void res.json(createErrorMessage('ext003'));

        TemplateModel.findOne({
            where: {
                id
            }
        }).then((template) => {
            if (!template)
                return void res.json(createErrorMessage('ext004'));

            const originalTemplate: string = path.resolve(`./_data/static/public/${template?.dataValues.path.replace('/static', '').replace('/index.html', '')}`);
            const templatePathName: string = require('uuid').v4();
            const dirPath: string = path.resolve(`./_data/static/public/templates/${templatePathName}`);
            const templateStaticPath: string = `/static/templates/${templatePathName}`;
            const dbId: string = require('uuid').v4();
            const serverHttpUrl: string = `http://localhost:${AppConfig.__SERVER_PORT}`;

            if (existsSync(originalTemplate)) {
                if (!existsSync(dirPath))
                    mkdirSync(dirPath);

                readdirSync(originalTemplate).forEach((file: string): void => {
                    if (file !== '.initialized.t.bin')
                        copyFileSync(path.resolve(`${originalTemplate}/${file}`), path.resolve(`${dirPath}/${file}`));
                });
                writeFileSync(path.resolve(`${dirPath}/.initialized.t.bin`), Buffer.from(JSON.stringify({
                    name: customTemplateName,
                    description: customTemplateDesc,
                    type: 0
                })));
                writeFileSync(path.resolve(dirPath, 'conf.js'), `const config = ${JSON.stringify({
                    ...currentTemplateConfig
                })}\n export default config;`);
                writeFileSync(path.resolve(dirPath, 'data.json'), JSON.stringify(currentTemplateConfig?.data));

                try {
                    if (currentTemplateConfig.config.audio.full) return;
                    if (currentTemplateConfig.config.audio.src !== '') {
                        const originHtmlContent: string = readFileSync(path.resolve(dirPath, 'index.html')).toString();
                        const audioElement: string = `<audio src="${serverHttpUrl}${currentTemplateConfig.config.audio.src}" volume="${Number(currentTemplateConfig.config.audio.volume) / 100}"></audio>`;
                        const audioTag: string = `<!--__LMO_SERVER_AUDIO_RENDER_TAG-->`;
                        let afterHtmlContent: string = '';
                        if (originHtmlContent.includes(audioTag))
                            afterHtmlContent = originHtmlContent.replace(audioTag, audioElement);
                        else
                            afterHtmlContent = originHtmlContent + '\n' + audioElement;

                        writeFileSync(path.resolve(dirPath, 'index.html'), afterHtmlContent);
                    }
                } catch (e) {
                    console.log(e);
                }
                try {
                    (async (): Promise<void> => {
                        const taskConfig = {
                            id: dbId,
                            path: `${serverHttpUrl}${templateStaticPath}?__type=h`,
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
                            url: `${templateStaticPath}/index.html?__type=h`,
                            clarity: currentTemplateConfig.config.video.clarity ?? '1080P',
                            status: 'pending',
                            taskConfig: JSON.stringify(taskConfig)
                        };

                        await ResourcesModel.create(dbData);

                        res.status(204).send();

                        // @ts-ignore
                        TaskScheduler.push({
                            ...taskConfig,
                            name: dbData.name
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
            } else
                res.json(createErrorMessage('ext00e'));
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