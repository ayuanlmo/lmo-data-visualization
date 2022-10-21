export interface InsertLogSql {
    id: string;
    logFilePath: string;
    tempFilePath: string;
}

export interface ResourceStatus {
    status: number;
    name: string;
    path: string;
}

export interface UpdateTemplateInfo {
    title: string;
    description: string;
}

export interface TempLateItem {
    name: string;
    title: string;
    description: string;
}

export interface TempLateItemApp {
    T_Name: string
    T_Id: string;
    T_Title: string;
    T_Description: string;
    T_Path: string;
    T_Type: string;
}

export interface ResourcesItem {
    name: string;
    path: string;
    status: string;
    id: string;
}

export interface ResourceStatus {
    path: string;
    status: number;
    name: string;
}
