export interface MediaTypeApp {
    name: string;
    path: string;
    create_at: string;
    status: string;
    id: string;
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