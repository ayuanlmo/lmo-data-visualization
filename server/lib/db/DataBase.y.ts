import MySql from 'mysql';
import DataBaseConf from "../../conf/DataBase.y";
import {
    InsertLogSql,
    ResourcesItem,
    ResourceStatus,
    TempLateItemApp,
    UpdateTemplateInfo
} from "../../interface/DataBase.y";

const MySQL: MySql = require('mysql');

class YingDB {
    private DB: MySql;

    public constructor() {
        this.DB = null;
        this.Open();
    }

    // 创建表
    public CreateTable(name: string, sql: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.SqlQuery(`DROP TABLE IF EXISTS ${name};`, false).then(() => {
                this.SqlQuery(sql, false).catch((e) => {
                    console.warn('YingWarn: [CreateTable]', e);
                    reject(e);
                }).then(() => {
                    resolve();
                })
            })
        });
    }

    // 插入一条资源
    public async SetResourcesItem(data: ResourcesItem): Promise<void> {
        await this.SqlQuery(this.GetInsertResourceItemSql(data), false);
    }

    // 更新资源状态
    public async UpdateResourceStatus(data: ResourceStatus): Promise<void> {
        await this.SqlQuery(this.GetUpdateResourceStatusSql(data), false);
    }

    // 获取插入资源项SQL
    public GetInsertResourceItemSql(item: ResourcesItem): string {
        return `INSERT INTO y_resource (name, path, create_at, status,id) 
                VALUES ('${item.name}', '${item.path}', '${new Date().getTime()}', '${item.status}','${item.id}');`;
    }

    // 写入日志
    public async InsertLog(data: InsertLogSql): Promise<void> {
        await this.SqlQuery(this.GetInsertLogSql(data), false);
    }

    // 删除日志
    public async DeleteLog(id: string): Promise<void> {
        await this.SqlQuery(`DELETE FROM y_log WHERE id = '${id}'`, false);
    }

    // 删除媒体项
    public DeleteMediaItem(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.SqlQuery(`DELETE FROM y_resource WHERE id = '${id}'`, false).then(() => {
                resolve(1);
            }).catch(() => {
                reject(0);
            })
        });
    }

    // 获取媒体列表
    public GetMediaList(type: string): Promise<Array<object | any>> {
        return this.SqlQuery(type === '' ? `SELECT * FROM y_resource` : `SELECT * FROM "y_resource" WHERE status = '${type}'`);
    }

    // 获取模板列表
    public GetTemplateList(data:{
        title:string;
        type:string;
    }): Promise<Array<object | any>> {
        return this.SqlQuery(`SELECT * FROM y_template WHERE title LIKE '%${data.title}%' AND  \`type\` LIKE '%${data.type}%'`);
    }

    // 删除模板
    public DeleteTemplate(id: string): Promise<Array<object | any> | any> {
        return new Promise((resolve, reject) => {
            this.QueryTemplateById(id).then(async (list: Array<TempLateItemApp>) => {
                if (list.length === 0) {
                    reject('No-template');
                } else {
                    if (list[0].type === '0') {
                        reject('Prohibited');
                    } else if (list[0].id === id) {
                        await this.SqlQuery(`DELETE FROM y_template WHERE id = '${id}'`, false).catch((e) => {
                            reject(e);
                        }).then(() => {
                            resolve('')
                        })
                    }
                }
            }).catch(e => {
                console.log('删除错误', e);
            })
        })
    }

    // 编辑模板
    public EditTemplateInfo(id: string, data: UpdateTemplateInfo): Promise<string> {
        return new Promise((resolve, reject) => {
            this.QueryTemplateById(id).then((list: Array<TempLateItemApp>) => {
                if (list[0].id === id && list[0].type !== '0') {
                    this.SqlQuery(`UPDATE y_template SET description='${data.description ?? data[0].T_Description}',title='${data.title ?? data[0].T_Title}'  WHERE id = '${id}'`, false).then(() => {
                        resolve('');
                    }).catch(e => {
                        reject(e);
                        console.warn(e);
                    })
                }
            }).catch(err => {
                reject(err);
                console.log('错误', err)
            })
        });
    }

    // 获取插入模板表 sql
    public GetInsertTemplateTableSql(item: TempLateItemApp): string {
        return `INSERT INTO y_template ( name, id, title, description, path, type ) 
                VALUES('${item.name}','${item.id}','${item.title}','${item.description}','${item.path}','${item.type}');`;
    }

    // SQL查询
    public SqlQuery(sql: string, close: boolean = false): Promise<any> {
        return new Promise((resolve, reject) => {
            this.DB.query(sql, (err, result) => {
                if (err)
                    return reject(err.message);
                else {
                    resolve(result);
                    if (close)
                        this.Close();
                }
            })
        });
    }

    // 初始化模板
    public InitTemplate(): void {
        // const path = '/static/DataVisualizationTemplate/$y/index.html';
        //
        // TemplateIndex.map((i: TempLateItem) => {
        //     const sql: string = this.GetInsertTemplateTableSql({
        //         name: i.name,
        //         id: `lmo_data_visualization_template_${i.name}`,
        //         type: i.title,
        //         description: i.description,
        //         path: path.replace('$y', i.name),
        //         type: '0'
        //     });
        //     if (sql !== '')
        //         this.SqlQuery(sql, false).catch((e) => {
        //             console.warn('YingWarn: [InitTempLate]', e);
        //         })
        // });
    }

    // 关闭数据库
    public Close(): void {
        this.DB && this.DB.end();
        this.DB = null;
    }

    // 获取更新资源状态Sql
    private GetUpdateResourceStatusSql(data: ResourceStatus): string {
        return `UPDATE y_resource SET path = '${data.path}',status = '${data.status}' WHERE id = '${data.name}'`;
    }

    // 获取插入日志sql
    private GetInsertLogSql(data: InsertLogSql): string {
        return `INSERT INTO y_log(id, file_path, log_temp_file_path) 
                VALUES ('${data.id}', '${data.logFilePath}', '${data.tempFilePath}');`;
    }

    // 根据ID查询模板
    private QueryTemplateById(id: string = '') {
        return this.SqlQuery(`SELECT * FROM y_template WHERE id = '${id}'`, false);
    }

    // 打开数据库
    private async Open() {
        if (this.DB !== null)
            return
        else {
            this.DB = MySQL.createConnection({
                ...DataBaseConf
            });
            this.DB.connect(function (err: any) {
                if (err != null) {
                    console.warn('无法连接数据库，程序已退出：\n', err);
                    require('process').exit();
                }
            });
        }
    }
}

export default YingDB;