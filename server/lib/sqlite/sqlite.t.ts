/**
 * sqlite/sqlite.ts
 * @author ayuanlmo
 * @class T_DB
 * @constructor
 * Database module
 * **/

interface INSERT_LOG_SQL {
    id: string;
    log_file_path: string;
    temp_file_path: string;
}

interface RESOURCE_STATUS {
    status: number;
    name: string;
    path: string;
}

interface INSERT_RESOURCE_SQL {
    name: string;
    path: string;
    status: string;
    id: any
}

interface UPDATE_TEMPLATE_INFO {
    title: string;
    description: string;
}

const _SQLITE: any = require('sqlite3');
const _Global: any = global;
const _Ti: any = _Global.dbConf.index;

class T_DB {
    private _: any;
    private readonly _FS: any;
    private readonly _RESOLVE_PATH: any;

    constructor() {
        this._FS = require("fs-extra");
        this._ = null;
        this._RESOLVE_PATH = require('path').resolve;
        if (!this._FS.existsSync(this._RESOLVE_PATH(__dirname + '/db'))) {
            this._FS.mkdir(this._RESOLVE_PATH(__dirname + '/db'));
            if (!this._FS.existsSync(this._RESOLVE_PATH(__dirname + '/db/db.ting.db'))) {
                this.OPEN();
                setTimeout(async () => {
                    await this.INIT_TABLE();
                }, 2000);
            }
        } else
            this.OPEN();
    }

    //初始化表
    INIT_TABLE(): void {
        Promise.all([
            this.CREATE_TABLE('Template', 'create table Template(T_Name TEXT(128) not null,T_Id TEXT(128) not null,T_Title TEXT(128) not null,T_Description TEXT(255) not null,T_Path TEXT(255) not null,T_Type TEXT(12)  not null);'),
            this.CREATE_TABLE('Resource', 'create table Resource(T_Name TEXT(128) NOT NULL,T_Path TEXT(128) NOT NULL,T_Create_At TEXT(128) NOT NULL,T_Status TEXT(30),T_ID TEXT(128) NOT NULL)'),
            this.CREATE_TABLE('Log', 'create table Log(T_Resource_ID TEXT(128) not null,T_Log_File_Path TEXT(256),T_Log_Temp_File_Path TEXT(256));')
        ]).then(() => {
            this.INIT_TEMPLATE();
        });
    }

    //创建表
    CREATE_TABLE(name: string, sql: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this._.run(`DROP TABLE IF EXISTS ${name};`, (e: any) => {
                if (!e)
                    this._.run(sql, (e: any) => {
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

    //打开数据库
    OPEN(): void {
        this._ = new _SQLITE.Database(_Global.dbConf._path, (_e: any) => {
            if (_e)
                console.warn('[Warn]:Database open failed...');
        });
    }

    //关闭数据库
    CLOSE(): void {
        if (this._ !== null)
            this._.close();
    }

    //初始化模板
    INIT_TEMPLATE(): void {
        this._.all('SELECT * FROM Template', (_e: any) => {
            if (_e)
                console.warn(['[Warn]:Failed to init template...'], _e);
            else {
                const path = '/static/DataVisualizationTemplate/$t/index.html';

                _Ti.map((i: any) => {
                    const _SQL = this.GET_INSERT_TEMPLATE_TABLE_SQL({
                        T_Name: i.name,
                        T_Id: `lmo_data_visualization_template_${i.name}`,
                        T_Title: i.title,
                        T_Description: i.description,
                        T_Path: path.replace('$t', i.name),
                        T_Type: '0'
                    });
                    if (_SQL !== '')
                        this._.run(_SQL, (e: any) => {
                            if (e)
                                console.warn('[Warn]:Template write failed...', e);
                        });
                });
            }
        });
    }

    RUN(SQL: string, CALL_BACK: Function): any {
        return this._.run(SQL, CALL_BACK);
    }

    ALL(SQL: string, CALL_BACK: Function): any {
        return this._.all(SQL, CALL_BACK);
    }


    //插入一条资源
    SET_RESOURCE(data: any): void {
        this._.run(this.GET_INSERT_RESOURCE_SQL(data));
    }

    DEL_MEDIA_ITEM(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this._.run(`DELETE FROM Resource WHERE T_ID = '${id}'`, (e: any) => {
                if (e === null) {
                    resolve(1);
                } else {
                    reject(0);
                }
            });
        });
    }

    //删除日志
    DEL_LOG(id: string) {
        this._.run(`DELETE FROM Log WHERE T_Resource_ID = '${id}'`);
    }

    //更新资源状态
    UPDATE_RESOURCE_STATUS(data: any) {
        this._.run(this.GET_UPDATE_RESOURCE_STATUS_SQL(data));
    }

    //获取插入模板表 SQL
    GET_INSERT_TEMPLATE_TABLE_SQL(_: any): string {
        return `INSERT INTO "Template" ( T_Name, T_Id, T_Title, T_Description, T_Path, T_Type ) 
                VALUES('${_.T_Name}','${_.T_Id}','${_.T_Title}','${_.T_Description}','${_.T_Path}','${_.T_Type}');`;
    }

    //获取媒体列表
    GET_MEDIA_LIST(type: string): any {
        return this.SQL_QUERY(type === '' ? `SELECT * FROM Resource` : `SELECT * FROM "Resource" WHERE _Status = '${type}'`);
    }

    //获取插入资源 SQL
    GET_INSERT_RESOURCE_SQL(_: INSERT_RESOURCE_SQL): string {
        return `INSERT INTO Resource (T_Name, T_Path, T_Create_At, T_Status,T_ID) 
                VALUES ('${_.name}', '${_.path}', '${new Date().getTime()}', '${_.status}','${_.id}');`;
    }

    //更新资源状态
    GET_UPDATE_RESOURCE_STATUS_SQL(_: RESOURCE_STATUS): string {
        return `UPDATE Resource SET T_Path = '${_.path}',T_Status = '${_.status}' WHERE T_ID = '${_.name}'`;
    }

    //写入日志
    INSERT_LOG(data: any) {
        this._.run(this.GET_INSERT_LOG_SQL(data));
    }

    //获取插入日志 SQL
    GET_INSERT_LOG_SQL(_: INSERT_LOG_SQL): string {
        return `INSERT INTO Log(T_Resource_ID, T_Log_File_Path, T_Log_Temp_File_Path) 
                VALUES ('${_.id}', '${_.log_file_path}', '${_.temp_file_path}');`;
    }

    //执行SQL查询
    SQL_QUERY(SQL: string) {
        return new Promise((resolve, reject) => {
            try {
                this._.all(SQL, (_e: any, _d: any) => {
                    if (!_e)
                        resolve(_d ?? []);
                    else
                        console.log(_e);
                });
            } catch (e) {
                reject(e);
            }

        });
    }

    //查询模板列表
    QUERY_TEMPLATE_LIST(): any {
        return this.SQL_QUERY('SELECT * FROM Template');
    }

    //通过ID查询模板
    QUERY_TEMPLATE_BY_ID(id: string): any {
        return this.SQL_QUERY(`SELECT * FROM Template WHERE T_ID = '${id}'`);
    }

    //删除模板
    DEL_TEMPLATE(id: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.QUERY_TEMPLATE_BY_ID(id).then((template: Array<object>) => {
                if (template.length === 0)
                    reject('no_template');
                else {
                    // @ts-ignore
                    if (template[0].T_Id === id) {
                        this._.run(`DELETE FROM Template WHERE T_ID = '${id}'`, (e: any) => {
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

    //编辑模板信息
    EDIT_TEMPLATE_INFO(id: string, params: UPDATE_TEMPLATE_INFO) {
        return new Promise<string>((resolve, reject) => {
            this.QUERY_TEMPLATE_BY_ID(id).then((template: Array<any>) => {
                if (template.length === 0)
                    reject('no_template');
                else {
                    if (template[0].T_Id === id && template[0].T_Type !== '0') {
                        this._.run(`UPDATE Template SET T_Description='${params.description ?? template[0].T_Description}',T_Title='${params.title ?? template[0].T_Title}'  WHERE T_ID = '${id}'`, (e: any) => {
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
