var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const _SQLITE = require('sqlite3');
const _Global = global;
const _Ti = _Global.dbConf.index;
class T_DB {
    constructor() {
        this._FS = require("fs-extra");
        this._ = null;
        this._RESOLVE_PATH = require('path').resolve;
        if (!this._FS.existsSync(this._RESOLVE_PATH(__dirname + '/db'))) {
            this._FS.mkdir(this._RESOLVE_PATH(__dirname + '/db'));
            if (!this._FS.existsSync(this._RESOLVE_PATH(__dirname + '/db/db.ting.db'))) {
                this.OPEN();
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield this.INIT_TABLE();
                }), 2000);
            }
        }
        else
            this.OPEN();
    }
    INIT_TABLE() {
        Promise.all([
            this.CREATE_TABLE('Template', 'create table Template(T_Name TEXT(128) not null,T_Id TEXT(128) not null,T_Title TEXT(128) not null,T_Description TEXT(255) not null,T_Path TEXT(255) not null,T_Type TEXT(12)  not null);'),
            this.CREATE_TABLE('Resource', 'create table Resource(T_Name TEXT(128) NOT NULL,T_Path TEXT(128) NOT NULL,T_Create_At TEXT(128) NOT NULL,T_Status TEXT(30),T_ID TEXT(128) NOT NULL)'),
            this.CREATE_TABLE('Log', 'create table Log(T_Resource_ID TEXT(128) not null,T_Log_File_Path TEXT(256),T_Log_Temp_File_Path TEXT(256));')
        ]).then(() => {
            this.INIT_TEMPLATE();
        });
    }
    CREATE_TABLE(name, sql) {
        return new Promise((resolve, reject) => {
            this._.run(`DROP TABLE IF EXISTS ${name};`, (e) => {
                if (!e)
                    this._.run(sql, (e) => {
                        if (!e)
                            resolve(e);
                        else {
                            console.warn(`CREATE_TABLE ${name} :`, e);
                            reject(e);
                        }
                    });
            });
        });
    }
    OPEN() {
        this._ = new _SQLITE.Database(_Global.dbConf._path, (_e) => {
            if (_e)
                console.warn('[Warn]:Database open failed...');
        });
    }
    CLOSE() {
        if (this._ !== null)
            this._.close();
    }
    INIT_TEMPLATE() {
        this._.all('SELECT * FROM Template', (_e) => {
            if (_e)
                console.warn(['[Warn]:Failed to init template...'], _e);
            else {
                const path = '/static/DataVisualizationTemplate/$t/index.html';
                _Ti.map((i) => {
                    const _SQL = this.GET_INSERT_TEMPLATE_TABLE_SQL({
                        T_Name: i.name,
                        T_Id: `lmo_data_visualization_template_${i.name}`,
                        T_Title: i.title,
                        T_Description: i.description,
                        T_Path: path.replace('$t', i.name),
                        T_Type: '0'
                    });
                    if (_SQL !== '')
                        this._.run(_SQL, (e) => {
                            if (e)
                                console.warn('[Warn]:Template write failed...', e);
                        });
                });
            }
        });
    }
    RUN(SQL, CALL_BACK) {
        return this._.run(SQL, CALL_BACK);
    }
    ALL(SQL, CALL_BACK) {
        return this._.all(SQL, CALL_BACK);
    }
    SET_RESOURCE(data) {
        this._.run(this.GET_INSERT_RESOURCE_SQL(data));
    }
    DEL_MEDIA_ITEM(id) {
        return new Promise((resolve, reject) => {
            this._.run(`DELETE FROM Resource WHERE T_ID = '${id}'`, (e) => {
                if (e === null) {
                    resolve(1);
                }
                else {
                    reject(0);
                }
            });
        });
    }
    DEL_LOG(id) {
        this._.run(`DELETE FROM Log WHERE T_Resource_ID = '${id}'`);
    }
    UPDATE_RESOURCE_STATUS(data) {
        this._.run(this.GET_UPDATE_RESOURCE_STATUS_SQL(data));
    }
    GET_INSERT_TEMPLATE_TABLE_SQL(_) {
        return `INSERT INTO "Template" ( T_Name, T_Id, T_Title, T_Description, T_Path, T_Type ) 
                VALUES('${_.T_Name}','${_.T_Id}','${_.T_Title}','${_.T_Description}','${_.T_Path}','${_.T_Type}');`;
    }
    GET_MEDIA_LIST(type) {
        return this.SQL_QUERY(type === '' ? `SELECT * FROM Resource` : `SELECT * FROM "Resource" WHERE _Status = '${type}'`);
    }
    GET_INSERT_RESOURCE_SQL(_) {
        return `INSERT INTO Resource (T_Name, T_Path, T_Create_At, T_Status,T_ID) 
                VALUES ('${_.name}', '${_.path}', '${new Date().getTime()}', '${_.status}','${_.id}');`;
    }
    GET_UPDATE_RESOURCE_STATUS_SQL(_) {
        return `UPDATE Resource SET T_Path = '${_.path}',T_Status = '${_.status}' WHERE T_ID = '${_.name}'`;
    }
    INSERT_LOG(data) {
        this._.run(this.GET_INSERT_LOG_SQL(data));
    }
    GET_INSERT_LOG_SQL(_) {
        return `INSERT INTO Log(T_Resource_ID, T_Log_File_Path, T_Log_Temp_File_Path) 
                VALUES ('${_.id}', '${_.log_file_path}', '${_.temp_file_path}');`;
    }
    SQL_QUERY(SQL) {
        return new Promise((resolve, reject) => {
            try {
                this._.all(SQL, (_e, _d) => {
                    if (!_e)
                        resolve(_d !== null && _d !== void 0 ? _d : []);
                    else
                        console.log(_e);
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
    QUERY_TEMPLATE_LIST() {
        return this.SQL_QUERY('SELECT * FROM Template');
    }
    QUERY_TEMPLATE_BY_ID(id) {
        return this.SQL_QUERY(`SELECT * FROM Template WHERE T_ID = '${id}'`);
    }
    DEL_TEMPLATE(id) {
        return new Promise((resolve, reject) => {
            this.QUERY_TEMPLATE_BY_ID(id).then((template) => {
                if (template.length === 0)
                    reject('no_template');
                else {
                    if (template[0].T_Type === '0') {
                        return reject(`prohibited`);
                    }
                    if (template[0].T_Id === id) {
                        this._.run(`DELETE FROM Template WHERE T_ID = '${id}'`, (e) => {
                            if (!e)
                                resolve('');
                            else
                                reject(`${e}`);
                        });
                    }
                }
            });
        });
    }
    EDIT_TEMPLATE_INFO(id, params) {
        return new Promise((resolve, reject) => {
            this.QUERY_TEMPLATE_BY_ID(id).then((template) => {
                var _a, _b;
                if (template.length === 0)
                    reject('no_template');
                else {
                    if (template[0].T_Id === id && template[0].T_Type !== '0') {
                        this._.run(`UPDATE Template SET T_Description='${(_a = params.description) !== null && _a !== void 0 ? _a : template[0].T_Description}',T_Title='${(_b = params.title) !== null && _b !== void 0 ? _b : template[0].T_Title}'  WHERE T_ID = '${id}'`, (e) => {
                            if (!e)
                                resolve('');
                            else
                                reject(`${e}`);
                        });
                    }
                }
            });
        });
    }
}
module.exports.T_DB = T_DB;
//# sourceMappingURL=sqlite.t.js.map