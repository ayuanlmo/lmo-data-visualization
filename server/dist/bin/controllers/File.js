"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,a,r){void 0===r&&(r=a);var i=Object.getOwnPropertyDescriptor(t,a);i&&("get"in i?t.__esModule:!i.writable&&!i.configurable)||(i={enumerable:!0,get:function(){return t[a]}}),Object.defineProperty(e,r,i)}:function(e,t,a,r){e[r=void 0===r?a:r]=t[a]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)"default"!==a&&Object.prototype.hasOwnProperty.call(e,a)&&__createBinding(t,e,a);return __setModuleDefault(t,e),t},__importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}},fs=(Object.defineProperty(exports,"__esModule",{value:!0}),__importStar(require("fs"))),path_1=__importDefault(require("path")),utils_1=__importDefault(require("../../utils")),AppConfig_1=__importDefault(require("../../conf/AppConfig")),UpLoadFileTypes_1=__importDefault(require("../../const/UpLoadFileTypes")),dataBase_1=require("../dataBase"),createErrorMessage=utils_1.default.createErrorMessage,createSuccessMessage=utils_1.default.createSuccessMessage,File=function(){function e(){}return e.upload=function(e,t){var a,r,i,n,s;AppConfig_1.default.__LIVE_SERVER?t.json(createErrorMessage("ext00el")):(a=e.file)?UpLoadFileTypes_1.default.includes(a.mimetype)?(e=void 0===(e=(null!=(e=e.body)?e:{}).name)?a.filename:e,i=path_1.default.extname(a.originalname),r=fs.createReadStream(a.path),i="/"+a.filename+"".concat(i),n=fs.createWriteStream(a.destination+i),s={id:require("uuid").v4(),name:e,path:"".concat(AppConfig_1.default.__STATIC_PATH,"/uploads")+i,type:a.mimetype,createTime:(new Date).getTime().toString()},r.pipe(n),n.on("finish",function(){fs.unlink(a.path,function(e){e?t.json(createErrorMessage("ext00e")):dataBase_1.UpLoadFilesModel.create(s).then(function(){t.json(createSuccessMessage(s))}).catch(function(){t.json(createErrorMessage("ext00d"))})})})):t.json(createErrorMessage("ext002")):t.json(createErrorMessage("ext001"))},e.delete=function(e,a){var r;AppConfig_1.default.__LIVE_SERVER?a.json(createErrorMessage("ext00el")):(e=e.params.id,""===(r=void 0===e?"":e)?a.json(createErrorMessage("ext003")):dataBase_1.UpLoadFilesModel.findOne({where:{id:r}}).then(function(e){var t;0===Object.keys(null!=e?e:{}).length?a.json(createErrorMessage("ext004")):(t=path_1.default.resolve("./".concat(null==e?void 0:e.dataValues.path)),dataBase_1.UpLoadFilesModel.destroy({where:{id:r}}).then(function(e){0<e?(fs.existsSync(t)&&fs.unlinkSync(t),a.status(204).send()):a.json(createErrorMessage("ext00d"))}))}))},e}();exports.default=File;