/**
 * sqlite/sqlite.ts
 * @author ayuanlmo
 * @class T_DB
 * @constructor
 * Database module
 * **/

interface _GET_INSERT_LOG_SQL {
    id: string;
    log_file_path: string;
    temp_file_path: string;
}

interface _UPDATE_RESOURCE_STATUS {
    status: number;
    name: string;
}

interface _GET_INSERT_RESOURCE_SQL {
    name: string;
    path: string;
    status: string;
}

const _SQLITE: any = require('sqlite3');
const _FS: any = require("fs-extra");
const _Global: any = global;
// @ts-ignore
const _Ti: any = global.dbConf.index;

class T_DB {
    private _: any;

    constructor() {
        this._ = null;
        this._OPEN();
    }

    _OPEN(): void {
        this._ = new _SQLITE.Database(_Global.dbConf._path, (_e: any) => {
            if (_e)
                console.warn('[Warn]:Database open failed...')
            else
                this._QUERY_TEMPLATE_LIST().then((R: any) => {
                    if (R.length === 0)
                        this._INIT_TEMPLATE();
                })
        })
    }

    _CLOSE(): void {
        if (this._ !== null)
            this._.close();
    }

    _INIT_TEMPLATE(): void {
        this['_']['all']('SELECT * FROM Template', (_e: any) => {
            if (_e)
                console.warn(['[Warn]:Failed to init template...'], _e);
            else {
                _Fs.readdir(_Global.dbConf._template, (e: any, data: Array<any>) => {
                    if (!e) {
                        data.map(i => {
                            const _SQL = this._GET_INSERT_TEMPLATE_TABLE_SQL({
                                T_Name: i,
                                T_Id: `lmo_data_visualization_template_${i}`,
                                T_Title: _Ti[i]['title'],
                                T_Description: _Ti[i]['description'],
                                T_Path: `/static/DataVisualizationTemplate/${i}/index.html`,
                                T_Type: '0'
                            });

                            if (_SQL !== '')
                                this._.eun(_SQL, (e: any) => {
                                    if (e)
                                        console.warn('[Warn]:Template write failed...', e);
                                });
                        });
                    }
                });
            }
        });
    }

    _GET_INSERT_TEMPLATE_TABLE_SQL(_: any): string {
        return `INSERT INTO "Template" ( T_Name, T_Id, T_Title, T_Description, T_Path, T_Type ) 
                VALUES('${_.T_Name}','${_.T_Id}','${_.T_Title}','${_.T_Description}','${_.T_Path}','${_.T_Type}');`;
    }

    _GET_INSERT_RESOURCE_SQL(_: _GET_INSERT_RESOURCE_SQL): string {
        return `INSERT INTO Resource (T_Nane, T_Path, T_Create_At, T_Status) 
                VALUES ('${_.name}', '${_.path}', '${new Date().getTime()}', ${_.status});`;
    }

    _UPDATE_RESOURCE_STATUS(_: _UPDATE_RESOURCE_STATUS): string {
        return `UPDATE Resource SET T_Status = ${_.status} WHERE T_Name = '${_.name}'`;
    }

    _GET_INSERT_LOG_SQL(_: _GET_INSERT_LOG_SQL): string {
        return `INSERT INTO Log(T_Resource_ID, T_Log_File_Path, T_Log_Temp_File_Path) 
                VALUES ('${_.id}', '${_.log_file_path}', '${_.temp_file_path}');`;
    }

    _QUERY_TEMPLATE_LIST(): any {
        return new Promise((_resolve) => {
            this._.all('SELECT * FROM Template', (_e: any, _d: any) => {
                if (!_e)
                    _resolve(_d ?? []);
                else
                    console.log(_e);
            });
        });
    }

}

module.exports.T_DB = T_DB;
