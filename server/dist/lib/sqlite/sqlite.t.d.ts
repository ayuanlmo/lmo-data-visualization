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
    id: any;
}
interface UPDATE_TEMPLATE_INFO {
    title: string;
    description: string;
}
declare const _SQLITE: any;
declare const _Global: any;
declare const _Ti: any;
declare class T_DB {
    private _;
    private readonly _FS;
    private readonly _RESOLVE_PATH;
    constructor();
    INIT_TABLE(): void;
    CREATE_TABLE(name: string, sql: string): Promise<any>;
    OPEN(): void;
    CLOSE(): void;
    INIT_TEMPLATE(): void;
    RUN(SQL: string, CALL_BACK: Function): any;
    ALL(SQL: string, CALL_BACK: Function): any;
    SET_RESOURCE(data: any): void;
    DEL_MEDIA_ITEM(id: string): Promise<number>;
    DEL_LOG(id: string): void;
    UPDATE_RESOURCE_STATUS(data: any): void;
    GET_INSERT_TEMPLATE_TABLE_SQL(_: any): string;
    GET_MEDIA_LIST(type: string): any;
    GET_INSERT_RESOURCE_SQL(_: INSERT_RESOURCE_SQL): string;
    GET_UPDATE_RESOURCE_STATUS_SQL(_: RESOURCE_STATUS): string;
    INSERT_LOG(data: any): void;
    GET_INSERT_LOG_SQL(_: INSERT_LOG_SQL): string;
    SQL_QUERY(SQL: string): Promise<unknown>;
    QUERY_TEMPLATE_LIST(): any;
    QUERY_TEMPLATE_BY_ID(id: string): any;
    DEL_TEMPLATE(id: string): Promise<string>;
    EDIT_TEMPLATE_INFO(id: string, params: UPDATE_TEMPLATE_INFO): Promise<string>;
}
//# sourceMappingURL=sqlite.t.d.ts.map