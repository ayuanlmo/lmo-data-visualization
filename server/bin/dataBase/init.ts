import {TemplateModel} from "./index";
import fs from 'fs';
import path from "path";
import Cli from "../../lib/Cli";

const initDefaultData = async (): Promise<void> => {
    const templateOneData = await TemplateModel.findOne();

    if (templateOneData === null) {
        const data = initTemplate();

        if (data.length === 0) return;
        TemplateModel.bulkCreate(data).then((): void => {
            Cli.log('模板初始化成功...');
        });
    }
}

// 初始化模板
const initTemplate = () => {
    const templatePath: string = path.resolve('./_data/static/public/templates');
    const templateFiles: string[] = fs.readdirSync(templatePath);
    const templateData: {
        cover: string;
        path: string;
        createTime: number;
        name: string;
        description: string;
        type: number;
        id: any;
    }[] = [];

    templateFiles.map((i: string): void => {
        const templateItem: string[] = fs.readdirSync(path.resolve(templatePath + `/${i}`));

        if (checkArrayIncludes(templateItem, ['.initialized.t.bin'])) {
            const initData: string = fs.readFileSync(templatePath + `/${i}/.initialized.t.bin`).toString();

            try {
                templateData.push(JSON.parse(initData));
            } catch (e) {
                Cli.warn('模板初始化文件加载失败', e);
            }
            // 检查当前模板是否存在必要的依赖
        } else if (checkArrayIncludes(templateItem, [
            'conf.js',
            'data.json',
            'cover.png',
            'index.html',
            'config.json',
            'index.js'
        ])) {
            try {
                const templateRoot: string = `/static/public/templates/${i}`;
                const templateConfig: {
                    name: string;
                    description: string;
                    type: number;
                } = JSON.parse(fs.readFileSync(path.resolve(templatePath + `/${i}/config.json`), 'utf-8'));

                const item = {
                    id: require('uuid').v4(),
                    ...templateConfig,
                    cover: `${templateRoot.replace('/public', '')}/cover.png`,
                    path: `${templateRoot.replace('/public', '')}/index.html`,
                    createTime: new Date().getTime()
                };

                templateData.push(item);
                // 打一个初始化成功的标记文件，后续重新加载模板时可以忽略当前模板
                fs.writeFileSync(path.resolve(templatePath + `/${i}/.initialized.t.bin`), Buffer.from(JSON.stringify(item)));

            } catch (e) {
                Cli.warn(`模板初始化失败，请检查${templatePath + `/${i}/config.json`}是否存在或正确配置`, e);
            }
        }
    });

    return templateData;
}

function checkArrayIncludes(arr1: Array<string>, arr2: Array<string>): boolean {
    for (let i: number = 0; i < arr2.length; i++) {
        if (!arr1.includes(arr2[i]))
            return false;
    }
    return true;
}

export default initDefaultData;
