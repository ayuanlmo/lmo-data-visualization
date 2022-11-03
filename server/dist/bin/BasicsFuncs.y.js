"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUploadMediaFile = exports.UpLoadMediaFile = exports.DeleteMedia = exports.GetMedia = exports.EditTempInfo = exports.DeleteTemplate = exports.GetTemplateList = void 0;
const Message_y_1 = require("../conf/Message.y");
const Conf_y_1 = require("../conf/Conf.y");
const Default_y_1 = require("../conf/Default.y");
const FileTypes_y_1 = require("../const/FileTypes.y");
const MediaTypes_Y_1 = require("../const/MediaTypes.Y");
const DataBase_y_1 = require("../lib/sqlite/DataBase.y");
const Utils_y_1 = require("../utils/Utils.y");
const Fs = require('fs-extra');
const Path = require('path');
function FilterMediaFile(list, type = '__AUDIO') {
    const List = [];
    list.filter((i) => {
        return MediaTypes_Y_1.default[type].includes(i.split('.')[1]);
    }).map((i) => {
        const media = i.split('.');
        List.push({
            name: media[0],
            type: media[1],
            path: `/static/uploads/${i}`
        });
    });
    return List;
}
function DeleteTempFile(path) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Fs.unlink(path);
    });
}
function GetTemplateList(res) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = [];
        new DataBase_y_1.default().GetTemplateList().then((r) => {
            r.map((i) => {
                list.push({
                    id: i.T_Id,
                    url: i.T_Path,
                    cover: `/static/DataVisualizationTemplate/${i.T_Name}/cover.png`,
                    template: i.T_Name,
                    title: i.T_Title,
                    description: i.T_Description,
                    type: i.T_Type
                });
            });
            res.json((0, Utils_y_1.CREATE_SUCCESS_MESSAGE)({
                list: list
            }));
        });
    });
}
exports.GetTemplateList = GetTemplateList;
function DeleteTemplate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Conf_y_1.default.__LIVE_SERVER)
            return res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__LIVE_SERVER));
        const query = req.query;
        const params = query;
        if (!Object.keys(params).includes('id') || params.id === '')
            res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__DEL_TEMPLATE_ERROR_NT));
        else
            new DataBase_y_1.default().DeleteTemplate(params.id).then(() => {
                res.json((0, Utils_y_1.CREATE_SUCCESS_MESSAGE)());
            }).catch((err) => {
                if (err === 'No-template')
                    res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__DEL_TEMPLATE_ERROR_NT));
                if (err === 'Prohibited')
                    res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__DEL_PROHIBITED));
            });
    });
}
exports.DeleteTemplate = DeleteTemplate;
function EditTempInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = req.query;
        const params = query;
        if (!Object.keys(params).includes('id')) {
            res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__NO_MEDIA_ID));
        }
        else {
            new DataBase_y_1.default().EditTemplateInfo(params.id, params).then(() => {
                res.json((0, Utils_y_1.CREATE_SUCCESS_MESSAGE)({}));
            }).catch((e) => {
                if (e === 'err')
                    res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__EDIT_DEFAULT_TEMPLATE));
            });
        }
        return new Promise(() => {
            Promise.resolve(1);
        });
    });
}
exports.EditTempInfo = EditTempInfo;
function GetMedia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const type = req.query.type;
        const list = [];
        new DataBase_y_1.default().GetMediaList(type !== null && type !== void 0 ? type : '').then((l) => {
            l.map((i) => {
                list.push({
                    name: i.T_Name,
                    path: i.T_Path,
                    create_at: i.T_Create_At,
                    status: i.T_Status,
                    id: i.T_ID
                });
            });
            res.json((0, Utils_y_1.CREATE_SUCCESS_MESSAGE)({
                list: list
            }));
        });
    });
}
exports.GetMedia = GetMedia;
function DeleteMedia(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Conf_y_1.default.__LIVE_SERVER)
            res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__LIVE_SERVER));
        else {
            const data = req.query;
            const params = data;
            new DataBase_y_1.default().DeleteMediaItem(params.id).then((r) => __awaiter(this, void 0, void 0, function* () {
                if (r === 1) {
                    const mediaPath = Path.resolve(`server/../${params.path}`);
                    const mediaLogPath = Path.resolve(`server/../static/log/${params.id}.y.log`);
                    yield Fs.unlinkSync(mediaPath);
                    yield Fs.unlinkSync(mediaLogPath);
                    yield new DataBase_y_1.default().DeleteLog(params.id);
                    yield res.json((0, Utils_y_1.CREATE_SUCCESS_MESSAGE)({}));
                }
                else
                    yield res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__DEL_MEDIA_ERROR));
            }));
        }
    });
}
exports.DeleteMedia = DeleteMedia;
function UpLoadMediaFile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Default_y_1.default.__UPLOAD)
            return res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__UPLOAD_CLOSE));
        const File = req['file'];
        if (!File)
            return res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__NO_FILE));
        File.originalname = (0, Utils_y_1.TO_UTF8)(File.originalname);
        const OriginPath = Path.resolve('server/../static/uploads');
        const TempFilePath = `${OriginPath}/${File.filename}`;
        if (!FileTypes_y_1.default.includes(File.mimetype)) {
            yield DeleteTempFile(TempFilePath);
            return res.json((0, Utils_y_1.CREATE_ERROR_MESSAGE)({}, Message_y_1.default.__FILE_NS.replace('$y', `[${File.originalname}]`)));
        }
        const Extname = File.originalname.split('.');
        Extname[1].split(' ').join('');
        const Fr = Fs.createReadStream(File.path);
        const FileName = `${Extname[0]}${new Date().getTime()}.${Extname[1]}`;
        const Fw = Fs.createWriteStream(`${OriginPath}/${FileName}`);
        yield Fr.pipe(Fw);
        yield DeleteTempFile(TempFilePath);
        yield res.json((0, Utils_y_1.CREATE_SUCCESS_MESSAGE)({
            path: `/static/uploads/${FileName}`
        }));
    });
}
exports.UpLoadMediaFile = UpLoadMediaFile;
function GetUploadMediaFile(res) {
    return __awaiter(this, void 0, void 0, function* () {
        Fs.readdir(Path.resolve('server/../static/uploads'), (err, list) => {
            if (!err)
                res.json((0, Utils_y_1.CREATE_SUCCESS_MESSAGE)({
                    audioMedia: FilterMediaFile(list, '__AUDIO'),
                    videoMedia: FilterMediaFile(list, '__VIDEO'),
                    imageMedia: FilterMediaFile(list, '__IMAGE'),
                }));
        });
    });
}
exports.GetUploadMediaFile = GetUploadMediaFile;
//# sourceMappingURL=BasicsFuncs.y.js.map