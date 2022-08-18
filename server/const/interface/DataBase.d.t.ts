//日志
export interface INSERT_LOG_SQL {
    id: string;
    log_file_path: string;
    temp_file_path: string;
}

//资源状态
export interface RESOURCE_STATUS {
    status: number;
    name: string;
}

//写入资源
export interface INSERT_RESOURCE_SQL {
    name: string;
    path: string;
    status: string;
}