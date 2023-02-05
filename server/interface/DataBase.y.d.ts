export interface InsertLogSql {
    id: string;
    logFilePath: string;
    tempFilePath: string;
}

export interface ResourceStatus {
    status: string;
    name: string;
    path: string;
}

export interface UpdateTemplateInfo {
    title: string;
    description: string;
}

export interface TempLateItem extends TempLateItemApp {
    name: string;
    title: string;
    description: string;
}

export interface TempLateItemApp {
    name: string
    id: string;
    title: string;
    description: string;
    path: string;
    type: string;
}

export interface ResourcesItem {
    name: string;
    path: string;
    status: string;
    id: string;
}

