import {CreateTaskDataType} from "./Core.y";

export interface MessageType {
    cmd: string;
    data: CreateTaskDataType;
}


export interface WsType {
    send: any;
    on: any;
}