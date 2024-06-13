import {Request, Response} from "express";
import {copyFileSync, existsSync, mkdirSync, readdirSync, writeFileSync} from "node:fs";
import path from "path";
import Utils from "../../utils";
import {ResourcesModel, TemplateModel} from "../dataBase";
import AppConfig from "../../conf/AppConfig";
import socketClient from "../Socket";
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
                    (async (): Promise<void> => {
                        const dbData = {
                            id: dbId,
                            template: id,
                            filePath: '',
                            name: taskName === '' ? require('uuid').v4() : taskName,
                            templatePath: dirPath,
                            createTime: new Date().getTime(),
                            url: `${templateStaticPath}/index.html?__type=h`
                        };

                        await ResourcesModel.create(dbData);

                        res.status(204).send();

                        // 通知合成服务，准备合成
                        socketClient.sendMessage({
                            type: "COMPOSITE-VIDEO",
                            data: JSON.stringify({
                                id: dbId,
                                path: `http://localhost:${AppConfig.__SERVER_PORT}${templateStaticPath}?__type=h`,
                                duration: 5000,
                                width: 1920,
                                height: 1080,
                                fps: 24,
                                optPath: path.resolve(`./_data/static/public/output/${dbId}.mp4`)
                            })
                        });

                        // 通知页面
                        WebSocketServer.sendMessage(JSON.stringify({
                            type: 'TASK_READY',
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
}