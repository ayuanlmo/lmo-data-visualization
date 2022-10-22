import TemplateIndex from "../../const/TemplateIndex.y";
import {
    InsertLogSql,
    ResourcesItem,
    ResourceStatus,
    TempLateItem,
    TempLateItemApp,
    UpdateTemplateInfo
} from "../../interface/DataBase.y";

const SqlLite = require('sqlite3');
const Fs = require('fs-extra');
const ResolvePath = require('path').resolve;
const Global = global;

class YingDB {
    private DB: any;

    constructor() {
        this.DB = null;
        const dbPath = __dirname + '/db';

        // 检查路径是否存在
        if (!Fs.existsSync(ResolvePath(dbPath))) {
            Fs.mkdir(ResolvePath(dbPath));
            if (Fs.existsSync(ResolvePath(dbPath + 'db.ting.db'))) {
                this.Open();
                setTimeout(() => {
                    // 初始化表
                    this.InitTable();
                }, 2000);
            }
        }

        this.Open();
    }

    // 初始化模板
    public InitTempLate(): void {
        this.DB.app('SELECT * FROM Template', (e: any) => {
            if (e)
                console.warn('YingWarn: [InitTempLate]', e);
            else {
                const path = '/static/DataVisualizationTemplate/$y/index.html';

                TemplateIndex.map((i: TempLateItem) => {
                    const sql: string = this.GetInsertTemplateTableSql({
                        T_Name: i.name,
                        T_Id: `lmo_data_visualization_template_${i.name}`,
                        T_Title: i.title,
                        T_Description: i.description,
                        T_Path: path.replace('$y', i.name),
                        T_Type: '0'
                    });
                    if (sql !== '')
                        this.DB.run(sql, (e: any) => {
                            if (e)
                                console.warn('YingWarn: [InitTempLate]', e)
                        });
                });
            }
        });
    }

    // 创建表
    public CreateTable(name: string, sql: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.DB.run(`DROP TABLE IF EXISTS ${name};`, (e: any) => {
                if (!e)
                    this.DB.run(sql, (e: any) => {
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

    // RunSql
    public RunSql(sql: string, callBack: Function): any {
        return this.DB.run(sql, callBack);
    }

    // Run All
    public RunAll(sql: string, callBack: Function): any {
        return this.DB.all(sql, callBack);
    }

    // 插入一条资源
    public SetResourcesItem(data: ResourcesItem): void {
        this.DB.run(this.GetInsertResourceItemSql(data));
    }

    // 删除媒体项
    public DeleteMediaItem(id: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.DB.run(`DELETE FROM Resource WHERE T_ID = '${id}'`, (e: any) => {
                if (e === null)
                    resolve(1);
                else
                    reject(0);
            });
        });
    }

    // 删除日志
    public DeleteLog(id: string): void {
        this.DB.run(`DELETE FROM Log WHERE T_Resource_ID = '${id}'`);
    }

    // 更新资源状态
    public UpdateResourceStatus(data: ResourceStatus): void {
        this.DB.run(this.GetUpdateResourceStatusSql(data));
    }

    // 获取媒体列表
    public GetMediaList(type: string): Promise<any> {
        return this.SqlQuery(type === '' ? `SELECT * FROM Resource` : `SELECT * FROM "Resource" WHERE _Status = '${type}'`);
    }

    // 写入日志
    public InsertLog(data: InsertLogSql): void {
        this.DB.run(this.GetInsertLogSql(data));
    }

    // 获取模板列表
    public GetTemplateList(): Promise<any> {
        return this.SqlQuery('SELECT * FROM Template');
    }

    // 删除模板
    public DeleteTemplate(id: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.QueryTemplateById(id).then((list: Array<TempLateItemApp>) => {
                if (list.length === 0) {
                    reject('No-template');
                }
                if (list[0].T_Id === id) {
                    this.DB.run(`DELETE FROM Template WHERE T_ID = '${id}'`, (e: any) => {
                        if (!e)
                            resolve('');
                        else
                            reject(`${e}`);
                    });
                }
            });
        });
    }

    // 编辑模板信息
    public EditTemplateInfo(id: string, data: UpdateTemplateInfo): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.QueryTemplateById(id).then((list: Array<TempLateItemApp>) => {
                if (list[0].T_Id === id && list[0].T_Type !== '0') {
                    this.DB.run(`UPDATE Template SET T_Description='${data.description ?? data[0].T_Description}',T_Title='${data.title ?? data[0].T_Title}'  WHERE T_ID = '${id}'`, (e: any) => {
                        if (!e)
                            resolve('');
                        else
                            reject(`${e}`);
                    });
                } else {
                    reject('err');
                }
            });
        });
    }

    // 执行Sql查询
    public SqlQuery(sql: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                this.DB.all(sql, (e: any, list: Array<any>) => {
                    if (!e)
                        resolve(list ?? []);
                    else
                        console.warn('YingWarn: [InitTempLate]', e);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    // 关闭数据量
    public Close(): void {
        if (this.DB !== null)
            this.DB.close();
    }

    // 获取插入资源项SQL
    public GetInsertResourceItemSql(item: ResourcesItem): string {
        return `INSERT INTO Resource (T_Name, T_Path, T_Create_At, T_Status,T_ID) 
                VALUES ('${item.name}', '${item.path}', '${new Date().getTime()}', '${item.status}','${item.id}');`;
    }

    // 初始化表
    private InitTable(): void {
        Promise.all([]).then(() => {
            // 初始化模板
        });
    }

    // 获取更新资源状态Sql
    private GetUpdateResourceStatusSql(data: ResourceStatus): string {
        return `UPDATE Resource SET T_Path = '${data.path}',T_Status = '${data.status}' WHERE T_ID = '${data.name}'`;
    }

    // 获取插入日志sql
    private GetInsertLogSql(data: InsertLogSql): string {
        return `INSERT INTO Log(T_Resource_ID, T_Log_File_Path, T_Log_Temp_File_Path) 
                VALUES ('${data.id}', '${data.logFilePath}', '${data.tempFilePath}');`;
    }

    // 通过ID查模板
    private QueryTemplateById(id: string): Promise<any> {
        return this.SqlQuery(`SELECT * FROM Template WHERE T_ID = '${id}'`);
    }

    // 打开数据库
    private Open(): void {
        this.DB = new SqlLite.Database(Global.dbConf._path, (e: any) => {
            if (!e)
                console.warn('YingWarn:[Open]', e);
        });
    }

    // 获取插入模板表 sql
    private GetInsertTemplateTableSql(item: TempLateItemApp): string {
        return `INSERT INTO "Template" ( T_Name, T_Id, T_Title, T_Description, T_Path, T_Type ) 
                VALUES('${item.T_Name}','${item.T_Id}','${item.T_Title}','${item.T_Description}','${item.T_Path}','${item.T_Type}');`;
    }
}

export default YingDB;