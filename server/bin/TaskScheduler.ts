/**
 * @class TaskScheduler
 * @author ayuanlmo
 * @description Task scheduler
 * **/
import socketClient from "./Socket";
import {WebSocketServer} from "./WebSocketServer";

export interface ITask {
    readonly id: string;
    readonly path: string;
    readonly duration: number;
    readonly width: number;
    readonly height: number;
    readonly fps: number;
    readonly optPath: number;
    readonly fileName: string;
    readonly folder: string;
    readonly name: string;
    readonly audioPath: string;
    readonly pAudio: boolean;
    readonly audioVolume: number;
}

class TaskScheduler {
    private readonly concurrencyLimit: number;
    private taskQueue: Array<ITask>;
    private runningTask: number;
    private timer: any;

    constructor() {
        this.concurrencyLimit = 1; // 多进程负载均衡 默认允许1个
        this.taskQueue = [];
        this.runningTask = 0;
        this.init();
    }

    public push(task: ITask): void {
        this.taskQueue.push(task);
        this.init();
        this.initProcessQueue();
    }

    public removeTask(): void {
        this.runningTask--;
        this.initProcessQueue();
    }

    private init(): void {
        clearInterval(this.timer);
        this.timer = setInterval((): void => {
            if (this.runningTask === 0)
                clearInterval(this.timer);
            else
                this.initProcessQueue();
        }, 3000);
    }

    private initProcessQueue(): void {
        while (this.taskQueue.length > 0 && this.runningTask < this.concurrencyLimit) {
            const task: ITask | undefined = this.taskQueue.shift();

            if (task)
                this.runTask(task);
        }
    }

    private runTask(task: ITask): void {
        this.runningTask++;

        setTimeout((): void => {
            socketClient.sendMessage({
                type: "COMPOSITE-VIDEO",
                data: JSON.stringify({
                    ...task
                })
            });
            WebSocketServer.sendMessage(JSON.stringify({
                type: 'TASK_READY',
                message: {
                    id: task.id,
                    name: task.name
                }
            }));
        }, 1000);
    }
}

export default new TaskScheduler();
