/**
 * sqlite/index.js
 * @author ayuanlmo
 * 数据库模块
 * **/

const _SQLITE = require('sqlite3');
const _Fs = require("fs-extra");
const _Ti = global.dbConf.index;

class T_DB {
    constructor() {
        this['_'] = null;
        this['_OPEN']();
    }

    _OPEN() {
        this['_'] = new _SQLITE['Database'](global['dbConf']['_path'], (_e) => {
                if (_e)
                    console.log('数据库打开失败', _e);
                else
                    this['_QUERY_TEMPLATE_LIST']()['then'](R => {
                        if (R['length'] === 0)
                            this['_INIT_TEMPLATE']();
                    });
            }
        );
    }

    _CLOSE() {
        if (this['_'] !== null)
            this['_']['close']();
    }

    _QUERY_TEMPLATE_LIST() {
        return new Promise((_resolve) => {
            this['_']['all']('SELECT * FROM Template', (_e, _d) => {
                if (!_e)
                    _resolve(_d ?? []);
                else
                    console.log(_e);
            });
        });
    }

    _INIT_TEMPLATE() {
        this['_']['all']('SELECT * FROM Template', (_e) => {
            if (_e)
                console.log('初始化模板失败', _e);
            else {
                //写入模板数据
                _Fs['readdir'](global['dbConf']['_template'], (e, data) => {
                    if (!e) {
                        data['map'](i => {
                            const _SQL = this['_GET_INSERT_TEMPLATE_TABLE_SQL']({
                                T_Name: i,
                                T_Id: `lmo_data_visualization_template_${i}`,
                                T_Title: _Ti[i]['title'],
                                T_Description: _Ti[i]['description'],
                                T_Path: `/static/DataVisualizationTemplate/${i}/index.html`,
                                T_Type: '0'
                            });

                            if (_SQL !== '')
                                this['_']['eun'](_SQL, (e) => {
                                    if (e)
                                        console.log('数据写入失败', e);
                                });
                        });
                    }
                });
            }
        });
    }

    _GET_INSERT_TEMPLATE_TABLE_SQL(DATA = null) {
        if (DATA === null) return '';
        return `INSERT INTO "Template" ( T_Name, T_Id, T_Title, T_Description, T_Path, T_Type ) 
                VALUES('${DATA.T_Name}','${DATA.T_Id}','${DATA.T_Title}','${DATA.T_Description}','${DATA.T_Path}','${DATA.T_Type}');`;
    }
}

module.exports.T_DB = T_DB;