import { CreateTaskDataType } from "./Core.y";
export interface MessageType {
    cmd: string;
    data: CreateTaskDataType;
}
export interface WsType {
    send: any;
    on: any;
}
//# sourceMappingURL=SocketController.y.d.ts.map