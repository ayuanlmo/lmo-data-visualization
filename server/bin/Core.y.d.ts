import {CreateTaskDataType, WsAppType} from "../interface/Core.y";

declare class YingCore {
    private readonly WsPool;
    private readonly Data;
    private Logs;
    private Schedule;
    private readonly TaskName;
    private readonly Name;
    private readonly TaskType;
    private readonly YingDB;

    public constructor(ws: WsAppType, data: CreateTaskDataType, type: number);

    private Init(): Promise<void>;

    private CopyTempLate(): Promise<number>;

    private WriteConfJSFile(conf: object, path: string): void;

    private WriteLogFile(): void;

    private CopyFile(from: string, to: string): void;

    private CreateTemplate(): void;

    private CreateTask(): void;

    private ProcessAudio(src: string, audioPath: string): Promise<number>;

    private DelTempFiles(path: string): void;

    private GetVideoClarity(type: string): object;
    
    private SendMessage(type: string, cmd: string, data?: object): void;
}

export default YingCore;