import {beforeEach, describe, expect, it, vi} from 'vitest';

/**
 * 合成链路（进程内）：用 mock runner 驱动事件流，验证 TaskScheduler：
 *  - 事件顺序 TASK_READY → TASK_PROGRESS_CHANGE → TASK_END / TASK_ERROR；
 *  - 并发位（默认 1）：同时只跑一个，完成后再从队列取下一个；
 *  - 终态经 TaskService.onTaskFinished 回写并广播 filePath。
 * runner / TaskService / WebSocketServer 均打桩，不触发真实 ffmpeg/wvc（CI 无重依赖）。
 */

const h = vi.hoisted((): any => ({
    wsMessages: [] as Array<any>,
    started: [] as Array<string>,
    runs: new Map(),
    taskServiceCalls: [] as Array<any>
}));

vi.mock('../bin/synthesis/runner.js', (): any => ({
    default: {
        run: (task: any, events: any): Promise<void> => {
            h.started.push(task.id);
            h.runs.set(task.id, events);
            // 终态由 events 回调驱动，Promise 本身挂起（与真实 runner 的 settle 语义一致）
            return new Promise<void>((): void => { /* noop */
            });
        }
    }
}));

vi.mock('../bin/synthesis/TaskService.js', (): any => ({
    default: {
        onTaskFinished: async (id: string, _result: any, isError: boolean): Promise<{
            name: string;
            filePath: string
        }> => {
            h.taskServiceCalls.push({id, isError});
            return {name: `name-${id}`, filePath: `path-${id}`};
        }
    }
}));

vi.mock('../bin/WebSocketServer.js', (): any => ({
    WebSocketServer: {
        sendMessage: (msg: string): void => {
            h.wsMessages.push(JSON.parse(msg));
        }
    }
}));

const flush = async (): Promise<void> => {
    for (let i = 0; i < 8; i++) await Promise.resolve();
    await new Promise((r): void => setTimeout(r, 0));
};

// TaskScheduler 的未打桩依赖（Log/AppConfig）在 import 期读 env；vitest 默认 NODE_ENV=test 会被 env zod 拒绝。
// 与生产一致置为合法值（DB/合成器/WS 均已 mock，无需真实环境变量）。
process.env.NODE_ENV = 'development';
process.env.APP_LOG_LEVEL = 'fatal';

const scheduler = (await import('../bin/TaskScheduler.js')).default;

beforeEach((): void => {
    h.wsMessages.length = 0;
    h.started.length = 0;
    h.runs.clear();
    h.taskServiceCalls.length = 0;
});

describe('TaskScheduler（进程内合成）', (): void => {
    it('事件流 TASK_READY → TASK_PROGRESS_CHANGE → TASK_END', async (): Promise<void> => {
        scheduler.push({id: 't1', name: 'Task1'} as any);

        expect(h.started).toContain('t1');
        expect(h.wsMessages.some((m): boolean => m.type === 'TASK_READY' && m.message.id === 't1')).toBe(true);

        const ev = h.runs.get('t1');
        ev.onProgress('t1', 55);
        expect(h.wsMessages.some((m): boolean => m.type === 'TASK_PROGRESS_CHANGE' && m.message.progress === 55)).toBe(true);

        ev.onEnd({id: 't1', videoCover: 'vc', gifPath: 'gp'});
        await flush();

        expect(h.taskServiceCalls).toEqual([{id: 't1', isError: false}]);
        const end = h.wsMessages.find((m): boolean => m.type === 'TASK_END');
        expect(end).toBeTruthy();
        expect(end.message.filePath).toBe('path-t1');
    });

    it('onError → TASK_ERROR（失败隔离，不抛出）', async (): Promise<void> => {
        scheduler.push({id: 't2', name: 'Task2'} as any);

        const ev = h.runs.get('t2');
        ev.onError();
        await flush();

        expect(h.taskServiceCalls).toEqual([{id: 't2', isError: true}]);
        expect(h.wsMessages.some((m): boolean => m.type === 'TASK_ERROR' && m.message.id === 't2')).toBe(true);
    });

    it('并发位为 1：第二个任务在第一个终态后才启动', async (): Promise<void> => {
        scheduler.push({id: 'a', name: 'A'} as any);
        scheduler.push({id: 'b', name: 'B'} as any);

        // 仅 a 启动，b 仍在队列
        expect(h.started).toEqual(['a']);
        expect(h.runs.has('b')).toBe(false);

        // a 完成 → 释放并发位 → b 启动
        h.runs.get('a').onEnd({id: 'a'});
        await flush();

        expect(h.started).toEqual(['a', 'b']);
    });
});
