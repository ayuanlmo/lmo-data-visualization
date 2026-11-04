/**
 * @class TaskScheduler
 * @author ayuanlmo
 * @description Task scheduler —— 进程内合成调度：
 *  - 直接调用进程内 synthesisRunner（不经跨进程投递）；
 *  - 入队即触发 processQueue，出队/完成事件驱动，无轮询定时器；
 *  - runningTask 下界为 0，并发判断可靠。
 * **/
import synthesisRunner from "./synthesis/runner.js";
import TaskService from "./synthesis/TaskService.js";
import {ICreateTaskConfig} from "./synthesis/wvc.js";
import {WebSocketServer} from "./WebSocketServer.js";
import Logger from "../lib/Log.js";

export interface ITask extends ICreateTaskConfig {
    name: string;
}

class TaskScheduler {
    private readonly concurrencyLimit: number;
    private taskQueue: Array<ITask>;
    private runningTask: number;

    constructor() {
        this.concurrencyLimit = 1; // 单进程合成默认并发 1
        this.taskQueue = [];
        this.runningTask = 0;
    }

    public push(task: ITask): void {
        this.taskQueue.push(task);
        this.processQueue();
    }

    public removeTask(): void {
        // runningTask 下界为 0，避免被减成负数导致并发判断恒真
        this.runningTask = Math.max(0, this.runningTask - 1);
        this.processQueue();
    }

    private processQueue(): void {
        while (this.taskQueue.length > 0 && this.runningTask < this.concurrencyLimit) {
            const task: ITask | undefined = this.taskQueue.shift();

            if (task)
                this.runTask(task);
        }
    }

    private runTask(task: ITask): void {
        this.runningTask++;

        WebSocketServer.sendMessage(JSON.stringify({
            type: 'TASK_READY',
            message: {
                id: task.id,
                name: task.name
            }
        }));

        synthesisRunner.run(task, {
            onProgress: (id: string, progress: number): void => {
                WebSocketServer.sendMessage(JSON.stringify({
                    type: 'TASK_PROGRESS_CHANGE',
                    message: {id, progress}
                }));
            },
            onEnd: (result: any): void => {
                void this.finish(task, result, false);
            },
            onError: (): void => {
                void this.finish(task, undefined, true);
            }
        }).catch((e: unknown): void => {
            // runner 内部已保证单一终态事件；此处仅兜底记录，不重复释放并发位
            Logger.error(e);
        });
    }

    private async finish(
        task: ITask,
        result: { id?: string; videoCover?: string; gifPath?: string } | undefined,
        isError: boolean
    ): Promise<void> {
        const type: string = isError ? 'TASK_ERROR' : 'TASK_END';
        const {name, filePath} = await TaskService.onTaskFinished(task.id, result, isError);

        // 先释放并发位并驱动下一个队列任务，再向前端广播终态
        this.removeTask();

        WebSocketServer.sendMessage(JSON.stringify({
            type: type,
            message: {
                id: task.id,
                name,
                filePath
            }
        }));
    }
}

export default new TaskScheduler();
