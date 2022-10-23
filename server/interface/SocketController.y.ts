export interface MessageType {
    cmd: string;
    data: object;
}


export interface WsType {
    send: any;
    on: any;
}