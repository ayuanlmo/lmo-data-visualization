import wvc, {ICreateTaskConfig} from "./wvc.js";
import Logger from "../../lib/Log.js";

/** 合成事件回调（进程内直发）。 */
export interface ISynthesisEvents {
    onProgress: (id: string, progress: number) => void;
    onEnd: (result: any) => void;
    onError: (err: Error) => void;
}

/**
 * 合成执行器抽象：同进程直接调用合成模块；若需子进程隔离，
 * 另实现一个 ISynthesisRunner（fork 子进程）即可，无需改动调度器/控制器。
 */
export interface ISynthesisRunner {
    run(task: ICreateTaskConfig, events: ISynthesisEvents): Promise<void>;
}

/** 单次合成最长允许时间，超时视为失败并释放并发位（防止 Promise 悬挂导致 runningTask 泄漏）。 */
const SYNTHESIS_TIMEOUT_MS: number = Number(process.env.SYNTHESIS_TIMEOUT_MS ?? 30 * 60 * 1000);

export class WvcSynthesisRunner implements ISynthesisRunner {
    public async run(task: ICreateTaskConfig, events: ISynthesisEvents): Promise<void> {
        // 路径可信校验：任务渲染 URL 必须指向本机 SERVER_HOST，防止提交任意 URL。
        try {
            const url: URL = new URL(task.path);
            const serverHost: string = process.env.SERVER_HOST ?? 'localhost';

            if (url.hostname !== serverHost && url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') {
                events.onError(new Error(`Invalid task url host: ${url.hostname}`));
                return;
            }
        } catch (e) {
            events.onError(new Error(`Invalid task url: ${task.path}`));
            return;
        }

        let settled: boolean = false;
        const finish = (fn: () => void): void => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            fn();
        };

        const timer: NodeJS.Timeout = setTimeout((): void => {
            finish((): void => {
                Logger.error(`[synthesis] task ${task.id} timed out after ${SYNTHESIS_TIMEOUT_MS}ms`);
                events.onError(new Error('SYNTHESIS_TIMEOUT'));
            });
        }, SYNTHESIS_TIMEOUT_MS);

        try {
            const result: any = await wvc.init({...task}, ({id, progress}): void => {
                events.onProgress(id, progress);
            });
            finish((): void => events.onEnd(result));
        } catch (e) {
            finish((): void => {
                Logger.error(e);
                events.onError(e instanceof Error ? e : new Error(String(e)));
            });
        }
    }
}

const synthesisRunner: ISynthesisRunner = new WvcSynthesisRunner();

export default synthesisRunner;
