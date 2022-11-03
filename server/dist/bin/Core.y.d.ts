import { WsAppType, CreateTaskDataType } from "../interface/Core.y";
declare class YingCore {
    private readonly WsPool;
    private readonly Data;
    private Logs;
    private Schedule;
    private readonly TaskName;
    private readonly Name;
    private readonly TaskType;
    private readonly YingDB;
    constructor(ws: WsAppType, data: CreateTaskDataType, type: number);
    Init(): void;
    CopyTempLate(): Promise<number>;
    WriteConfJSFile(conf: object, path: string): void;
    WriteLogFile(): void;
    CopyFile(from: string, to: string): void;
    CreateTemplate(): void;
    CreateTask(): void;
    ProcessAudio(src: string, audioPath: string): Promise<number>;
    DelTempFiles(path: string): void;
    GetVideoClarity(type: string): object;
    SendMessage(type: string, cmd: string, data?: object): void;
}
export default YingCore;
//# sourceMappingURL=Core.y.d.ts.map