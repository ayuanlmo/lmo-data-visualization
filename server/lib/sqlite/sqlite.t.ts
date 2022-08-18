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
}

interface INSERT_RESOURCE_SQL {
    name: string;
    path: string;
    status: string;
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

    INIT_TABLE(): void {
        Promise.all([
            this.CREATE_TABLE('Template', 'create table Template(T_Name text(128) not null,T_Id text(128) not null,T_Title text(128) not null,T_Description text(255) not null,T_Path text(255) not null,T_Type text(12)  not null);'),
            this.CREATE_TABLE('Resource', 'create table Resource(T_Nane TEXT(128) not null,T_Path TEXT(128) not null,T_Create_At text(128) not null,T_Status int(2));'),
            this.CREATE_TABLE('Log', 'create table Log(T_Resource_ID text(128) not null,T_Log_File_Path text(256),T_Log_Temp_File_Path text(256));')
        ]).then(() => {
            this.INIT_TEMPLATE();
        });
    }

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

    OPEN(): void {
        this._ = new _SQLITE.Database(_Global.dbConf._path, (_e: any) => {
            if (_e)
                console.warn('[Warn]:Database open failed...');
        });
    }

    CLOSE(): void {
        if (this._ !== null)
            this._.close();
    }

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

    GET_INSERT_TEMPLATE_TABLE_SQL(_: any): string {
        return `INSERT INTO "Template" ( T_Name, T_Id, T_Title, T_Description, T_Path, T_Type ) 
                VALUES('${_.T_Name}','${_.T_Id}','${_.T_Title}','${_.T_Description}','${_.T_Path}','${_.T_Type}');`;
    }

    GET_INSERT_RESOURCE_SQL(_: INSERT_RESOURCE_SQL): string {
        return `INSERT INTO Resource (T_Nane, T_Path, T_Create_At, T_Status) 
                VALUES ('${_.name}', '${_.path}', '${new Date().getTime()}', ${_.status});`;
    }

    UPDATE_RESOURCE_STATUS(_: RESOURCE_STATUS): string {
        return `UPDATE Resource SET T_Status = ${_.status} WHERE T_Name = '${_.name}'`;
    }

    GET_INSERT_LOG_SQL(_: INSERT_LOG_SQL): string {
        return `INSERT INTO Log(T_Resource_ID, T_Log_File_Path, T_Log_Temp_File_Path) 
                VALUES ('${_.id}', '${_.log_file_path}', '${_.temp_file_path}');`;
    }

    QUERY_TEMPLATE_LIST(): any {
        return new Promise((resolve, reject) => {
            try {
                this._.all('SELECT * FROM Template', (_e: any, _d: any) => {
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

}

module.exports.T_DB = T_DB;
