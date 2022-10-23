export interface MediaTypeApp {
    T_Name: string;
    T_Path: string;
    T_Create_At: string;
    T_Status: string;
    T_ID: string;
}

export interface MediaType {
    name: string;
    path: string;
    create_at: string;
    status: string;
    id: string;
}

export interface DeleteMedia {
    id: string;
    path: string;
}

export interface MediaListType {
    name: string;
    type: string;
    path: string;
}