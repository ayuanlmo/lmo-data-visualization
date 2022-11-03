import { InsertLogSql, ResourcesItem, ResourceStatus, TempLateItemApp, UpdateTemplateInfo } from "../../interface/DataBase.y";
declare class YingDB {
    private DB;
    constructor();
    CreateTable(name: string, sql: string): Promise<void>;
    RunSql(sql: string, callBack: Function): any;
    RunAll(sql: string, callBack: Function): any;
    SetResourcesItem(data: ResourcesItem): void;
    UpdateResourceStatus(data: ResourceStatus): void;
    InsertLog(data: InsertLogSql): void;
    DeleteLog(id: string): void;
    DeleteMediaItem(id: string): Promise<number>;
    GetMediaList(type: string): Promise<any>;
    GetTemplateList(): Promise<any>;
    DeleteTemplate(id: string): Promise<string>;
    EditTemplateInfo(id: string, data: UpdateTemplateInfo): Promise<string>;
    SqlQuery(sql: string, close?: boolean): Promise<any>;
    GetInsertResourceItemSql(item: ResourcesItem): string;
    Close(): void;
    GetInsertTemplateTableSql(item: TempLateItemApp): string;
    private InitTempLate;
    private InitTable;
    private GetUpdateResourceStatusSql;
    private GetInsertLogSql;
    private QueryTemplateById;
    private Open;
}
export default YingDB;
//# sourceMappingURL=DataBase.y.d.ts.map