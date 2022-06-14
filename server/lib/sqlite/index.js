const _SQLITE = require('sqlite3');
const _FS = require("fs-extra");
const _TEMPLATE_INDEX = require('../../const/templateIndex');

class T_DB {
    constructor() {
        this._ = null;
        this._OPEN();
    }

    _OPEN() {
        this._ = new _SQLITE.Database(`${__dirname}/db/db.ting.db`, (e) => {
                if (e)
                    console.log('数据库打开失败', e);
                else
                    this._QUERY_TEMPLATE_LIST().then(R => {
                        //判断模板是否存在
                        if (R.length === 0)
                            this._INIT_TEMPLATE();
                    });
            }
        );
    }

    _CLOSE() {
        if (this._ !== null)
            this._.close();
    }

    //查询模板
    _QUERY_TEMPLATE_LIST() {
        return new Promise((resolve, reject) => {
            this._.all('SELECT * FROM Template', (e, data) => {
                if (!e) {
                    resolve(data ?? []);
                } else {
                    console.log(e);
                }
            });
        });
    }

    //初始化模板
    _INIT_TEMPLATE() {
        this._.all('SELECT * FROM Template', (e, row) => {
            if (e)
                console.log('初始化模板失败', e);
            else {
                //写入模板数据
                _FS.readdir('../../static/DataVisualizationTemplate', (e, data) => {
                    if (!e) {
                        data.map(i => {
                            const _SQL = this._GET_INSERT_TEMPLATE_TABLE_SQL({
                                T_Name: i,
                                T_Id: `lmo_data_visualization_template_${i}`,
                                T_Title: _TEMPLATE_INDEX[i]['title'],
                                T_Description: _TEMPLATE_INDEX[i]['description'],
                                T_Path: `/static/DataVisualizationTemplate/${i}/index.html`,
                                T_Type: '0'
                            });

                            if (_SQL !== '')
                                this._.run(_SQL, (e) => {
                                    if (e) {
                                        console.log('数据写入失败', e);
                                    }
                                });
                        });
                    }
                });
            }
        });
    }

    //获取插入模板表SQL
    _GET_INSERT_TEMPLATE_TABLE_SQL(DATA = null) {
        if (DATA === null) return '';
        return `INSERT INTO "Template" ( T_Name, T_Id, T_Title, T_Description, T_Path, T_Type ) 
                VALUES('${DATA.T_Name}','${DATA.T_Id}','${DATA.T_Title}','${DATA.T_Description}','${DATA.T_Path}','${DATA.T_Type}');`;
    }
}

module.exports.T_DB = T_DB;