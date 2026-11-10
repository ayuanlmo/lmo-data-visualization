import {v4 as uuidv4} from "uuid";
import {ColorModel, TemplateModel} from "./index.js";
import fs, {constants} from 'fs';
import path from "path";
import Cli from "./../../lib/Cli.js";
import Logger from "./../../lib/Log.js";
import {DB_COLOR_TABLE_DEFAULT_DATA} from './defaultData.js';
import Utils from "./../../utils/index.js";
import {staticPublicRoot} from "./../../lib/dataDir.js";

export const ignoreFolder: string[] = ['.DS_Store', '$Recycle.Bin', 'System Volume Information', 'ProgramData'];
export const templateLocalFiles = [
    'conf.js',
    'data.json',
    'cover.png',
    'cover.gif',
    'config.json',
    'index.js'
];

const INIT_FLAG_FILE = '.initialized.t.bin';

type TTemplateInitItem = {
    id: any;
    name: string;
    description: string;
    type: number;
    cover: string;
    gifCover: string;
    path: string;
    createTime: number;
};

const initDefaultData = async (): Promise<void> => {
    const colorOneData = await ColorModel.findOne();

    if (colorOneData === null) {
        const colorData = DB_COLOR_TABLE_DEFAULT_DATA.map(i => {
            return {
                ...i,
                cssCode: '',
                id: uuidv4(),
                value: JSON.stringify(i.value)
            }
        });

        await ColorModel.bulkCreate(colorData);
    }

    // 模板增量注册：不再要求 Template 表为空，每次只把「库里尚不存在的新模板目录」补进库。
    await registerTemplates();
}

/**
 * 扫描内置模板目录并增量注册入库。
 *
 * 旧实现只在 Template 表完全为空时扫描一次，导致仓库升级新增内置模板后，
 * 已部署的库永远看不到它们（refreshTemplate 也因此变成 no-op）。现改为按 id/path 判重：
 *  - 带 .initialized.t.bin：复用其中缓存的 id（DB 重建后仍能保持主键稳定），已在库则跳过；
 *  - 无标记文件：文件齐全且 path 未被占用才注册，并回写标记加速下次扫描。
 * 合成/复制产生的 UUID 目录缺少 config.json，会被齐全性校验自然跳过，不会被误注册。
 */
const registerTemplates = async (): Promise<void> => {
    const templatePath: string = path.join(staticPublicRoot, 'templates');

    // 模板根目录缺失/不可读时不抛错终止启动，降级为空扫描
    let templateFiles: string[] = [];

    try {
        templateFiles = fs.readdirSync(templatePath);
    } catch (e) {
        Cli.warn(`模板目录不可读，跳过注册：${templatePath}`, e);
        return;
    }

    const existing = await TemplateModel.findAll({attributes: ['id', 'path']});
    const existingIds = new Set<string>(existing.map((t: any): string => t.dataValues.id as string));
    const existingPaths = new Set<string>(existing.map((t: any): string => t.dataValues.path as string));

    const toCreate: TTemplateInitItem[] = [];

    for (const folder of templateFiles) {
        if (ignoreFolder.includes(folder) || folder.startsWith('.')) continue;

        const folderAbs: string = path.resolve(templatePath, folder);

        try {
            fs.accessSync(folderAbs, constants.F_OK | constants.R_OK | constants.W_OK);
        } catch {
            // 目录不可访问（如正被写入的运行时产物）：跳过，不终止全局
            continue;
        }

        let entries: string[];

        try {
            entries = fs.readdirSync(folderAbs);
        } catch (e) {
            Cli.warn(`跳过模板 ${folder} 的注册：目录不可读`, e);
            continue;
        }

        try {
            // 1) 已有初始化标记：复用缓存项（保持主键稳定），已在库则跳过
            if (entries.includes(INIT_FLAG_FILE)) {
                const cached = JSON.parse(
                    fs.readFileSync(path.resolve(folderAbs, INIT_FLAG_FILE), 'utf-8')
                ) as TTemplateInitItem;

                if (existingIds.has(cached.id) || existingPaths.has(cached.path)) continue;

                toCreate.push(cached);
                existingIds.add(cached.id);
                existingPaths.add(cached.path);
                continue;
            }

            // 2) 无标记：文件齐全且 path 未被占用才注册
            if (!checkArrayIncludes(entries, templateLocalFiles)) continue;

            const item = buildTemplateItem(folder, folderAbs);

            // 打/补初始化标记文件，后续扫描可直接走缓存分支
            fs.writeFileSync(path.resolve(folderAbs, INIT_FLAG_FILE), Buffer.from(JSON.stringify(item)));

            if (existingPaths.has(item.path)) continue;

            toCreate.push(item);
            existingIds.add(item.id);
            existingPaths.add(item.path);
        } catch (e) {
            // 单个模板注册失败只记日志，不终止全局
            Cli.warn(`模板注册失败，请检查[${folderAbs}]的 config.json 是否存在或正确配置`, e);
            Logger.warn(`跳过模板 ${folder} 的注册`);
        }
    }

    if (toCreate.length === 0) return;

    await TemplateModel.bulkCreate(toCreate);
    Cli.log(`模板增量注册成功，新增 ${toCreate.length} 个...`);
}

/** 依据文件齐全的模板目录构建一条注册项（含全新 uuid 主键）。 */
const buildTemplateItem = (folder: string, folderAbs: string): TTemplateInitItem => {
    const templateRoot: string = `/static/public/templates/${folder}`;
    const templateConfig = JSON.parse(
        fs.readFileSync(path.resolve(folderAbs, 'config.json'), 'utf-8')
    ) as { name: string; description: string; type: number };
    const isHTMLTemplate: boolean = fs.existsSync(path.resolve(folderAbs, 'index.html'));
    const isHTMTemplate: boolean = fs.existsSync(path.resolve(folderAbs, 'index.htm'));

    return {
        id: uuidv4(),
        ...templateConfig,
        cover: `${templateRoot.replace('/public', '')}/cover.png`,
        gifCover: `${templateRoot.replace('/public', '')}/cover.gif`,
        path: `${templateRoot.replace('/public', '')}${isHTMLTemplate ? '/index.html' : isHTMTemplate ? '/index.htm' : '/'}`,
        createTime: Utils.getNowTimestamp()
    };
}

export function checkArrayIncludes(arr1: Array<string>, arr2: Array<string>): boolean {
    for (let i: number = 0; i < arr2.length; i++) {
        if (!arr1.includes(arr2[i]))
            return false;
    }
    return true;
}

export default initDefaultData;
