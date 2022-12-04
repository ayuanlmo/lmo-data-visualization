import MySql from 'mysql';
import {
    InsertLogSql,
    ResourcesItem,
    ResourceStatus,
    TempLateItemApp,
    UpdateTemplateInfo
} from "../../interface/DataBase.y";

declare class YingDB {
    private DB: MySql;

    public constructor();

    public CreateTable(name: string, sql: string): Promise<void>;

    public SetResourcesItem(data: ResourcesItem): Promise<void>;

    public UpdateResourceStatus(data: ResourceStatus): Promise<void>;

    public GetInsertResourceItemSql(item: ResourcesItem): string;

    public InsertLog(data: InsertLogSql): Promise<void>;

    public DeleteLog(id: string): Promise<void>;

    public DeleteMediaItem(id: string): Promise<number>;

    public GetMediaList(type: string): Promise<Array<object | any>>;

    public GetTemplateList(): Promise<Array<object | any>>;

    public DeleteTemplate(id: string): Promise<Array<object | any> | any>;

    public EditTemplateInfo(id: string, data: UpdateTemplateInfo): Promise<string>;

    public GetInsertTemplateTableSql(item: TempLateItemApp): string;

    public SqlQuery(sql: string, close: boolean): Promise<any>;

    public InitTemplate(): void;

    private GetUpdateResourceStatusSql(data: ResourceStatus): string;

    private GetInsertLogSql(data: InsertLogSql): string;

    private QueryTemplateById(id: string);

    private Open();

    public Close(): void;
}

export default YingDB;