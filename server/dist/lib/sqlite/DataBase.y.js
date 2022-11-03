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
const TemplateIndex_y_1 = require("../../const/TemplateIndex.y");
const SqlLite = require('sqlite3');
const Fs = require('fs-extra');
const ResolvePath = require('path').resolve;
const Global = global;
class YingDB {
    constructor() {
        this.DB = null;
        const dbPath = __dirname + '/db';
        if (!Fs.existsSync(ResolvePath(dbPath))) {
            Fs.mkdir(ResolvePath(dbPath));
            if (Fs.existsSync(ResolvePath(dbPath + 'db.ting.db'))) {
                this.Open();
                setTimeout(() => {
                    this.InitTable();
                }, 2000);
            }
        }
        this.Open();
    }
    CreateTable(name, sql) {
        return new Promise((resolve, reject) => {
            this.DB.run(`DROP TABLE IF EXISTS ${name};`, (e) => {
                if (!e)
                    this.DB.run(sql, (e) => {
                        if (!e)
                            resolve(e);
                        else {
                            console.warn('YingWarn: [CreateTable]', e);
                            reject(e);
                        }
                    });
            });
        });
    }
    RunSql(sql, callBack) {
        return this.DB.run(sql, callBack);
    }
    RunAll(sql, callBack) {
        return this.DB.all(sql, callBack);
    }
    SetResourcesItem(data) {
        this.DB.run(this.GetInsertResourceItemSql(data));
    }
    UpdateResourceStatus(data) {
        this.DB.run(this.GetUpdateResourceStatusSql(data));
    }
    InsertLog(data) {
        this.DB.run(this.GetInsertLogSql(data));
    }
    DeleteLog(id) {
        this.DB.run(`DELETE FROM Log WHERE T_Resource_ID = '${id}'`);
        this.Close();
    }
    DeleteMediaItem(id) {
        return new Promise((resolve, reject) => {
            this.DB.run(`DELETE FROM Resource WHERE T_ID = '${id}'`, (e) => {
                if (e === null)
                    resolve(1);
                else
                    reject(0);
            });
        });
    }
    GetMediaList(type) {
        return this.SqlQuery(type === '' ? `SELECT * FROM Resource` : `SELECT * FROM "Resource" WHERE T_Status = '${type}'`);
    }
    GetTemplateList() {
        return this.SqlQuery('SELECT * FROM Template');
    }
    DeleteTemplate(id) {
        return new Promise((resolve, reject) => {
            this.QueryTemplateById(id).then((list) => __awaiter(this, void 0, void 0, function* () {
                if (list.length === 0) {
                    reject('No-template');
                }
                else {
                    if (list[0].T_Type === '0') {
                        reject('Prohibited');
                    }
                    else if (list[0].T_Id === id) {
                        yield this.DB.run(`DELETE FROM Template WHERE T_ID = '${id}'`, (e) => {
                            if (!e)
                                resolve('');
                            else
                                reject(`${e}`);
                        });
                        this.Close();
                    }
                }
            }));
        });
    }
    EditTemplateInfo(id, data) {
        return new Promise((resolve, reject) => {
            this.QueryTemplateById(id).then((list) => {
                var _a, _b;
                if (list[0].T_Id === id && list[0].T_Type !== '0') {
                    this.DB.run(`UPDATE Template SET T_Description='${(_a = data.description) !== null && _a !== void 0 ? _a : data[0].T_Description}',T_Title='${(_b = data.title) !== null && _b !== void 0 ? _b : data[0].T_Title}'  WHERE T_ID = '${id}'`, (e) => {
                        if (!e)
                            resolve('');
                        else
                            reject(`${e}`);
                    });
                    this.Close();
                }
                else
                    reject('err');
            });
        });
    }
    SqlQuery(sql, close = true) {
        return new Promise((resolve, reject) => {
            try {
                this.DB.all(sql, (e, list) => {
                    if (!e)
                        resolve(list !== null && list !== void 0 ? list : []);
                    else
                        console.warn('YingWarn: [InitTempLate]', e);
                });
            }
            catch (e) {
                console.warn('YingWarn:[SqlQueryError]', e);
                reject(e);
            }
            if (close)
                this.Close();
        });
    }
    GetInsertResourceItemSql(item) {
        return `INSERT INTO Resource (T_Name, T_Path, T_Create_At, T_Status,T_ID) 
                VALUES ('${item.name}', '${item.path}', '${new Date().getTime()}', '${item.status}','${item.id}');`;
    }
    Close() {
        if (this.DB !== null)
            this.DB.close();
    }
    GetInsertTemplateTableSql(item) {
        return `INSERT INTO "Template" ( T_Name, T_Id, T_Title, T_Description, T_Path, T_Type ) 
                VALUES('${item.T_Name}','${item.T_Id}','${item.T_Title}','${item.T_Description}','${item.T_Path}','${item.T_Type}');`;
    }
    InitTempLate() {
        this.DB.app('SELECT * FROM Template', (e) => {
            if (e)
                console.warn('YingWarn: [InitTempLate]', e);
            else {
                const path = '/static/DataVisualizationTemplate/$y/index.html';
                TemplateIndex_y_1.default.map((i) => {
                    const sql = this.GetInsertTemplateTableSql({
                        T_Name: i.name,
                        T_Id: `lmo_data_visualization_template_${i.name}`,
                        T_Title: i.title,
                        T_Description: i.description,
                        T_Path: path.replace('$y', i.name),
                        T_Type: '0'
                    });
                    if (sql !== '')
                        this.DB.run(sql, (e) => {
                            if (e)
                                console.warn('YingWarn: [InitTempLate]', e);
                        });
                });
            }
        });
    }
    InitTable() {
        Promise.all([
            this.CreateTable('Template', 'create table Template(T_Name TEXT(128) not null,T_Id TEXT(128) not null,T_Title TEXT(128) not null,T_Description TEXT(255) not null,T_Path TEXT(255) not null,T_Type TEXT(12)  not null);'),
            this.CreateTable('Resource', 'create table Resource(T_Name TEXT(128) NOT NULL,T_Path TEXT(128) NOT NULL,T_Create_At TEXT(128) NOT NULL,T_Status TEXT(30),T_ID TEXT(128) NOT NULL)'),
            this.CreateTable('Log', 'create table Log(T_Resource_ID TEXT(128) not null,T_Log_File_Path TEXT(256),T_Log_Temp_File_Path TEXT(256));')
        ]).then(() => {
            this.InitTempLate();
        });
    }
    GetUpdateResourceStatusSql(data) {
        return `UPDATE Resource SET T_Path = '${data.path}',T_Status = '${data.status}' WHERE T_ID = '${data.name}'`;
    }
    GetInsertLogSql(data) {
        return `INSERT INTO Log(T_Resource_ID, T_Log_File_Path, T_Log_Temp_File_Path) 
                VALUES ('${data.id}', '${data.logFilePath}', '${data.tempFilePath}');`;
    }
    QueryTemplateById(id) {
        return this.SqlQuery(`SELECT * FROM Template WHERE T_ID = '${id}'`, false);
    }
    Open() {
        this.DB = new SqlLite.Database(Global.dbConf._path, (e) => {
            if (e)
                console.warn('YingWarn:[Open]', e);
        });
    }
}
exports.default = YingDB;
//# sourceMappingURL=DataBase.y.js.map