import Logger from "./Log.js";

/**
 * 进程级兜底：
 * - unhandledRejection：仅记录，保持存活（大量异步外部调用不应拖垮整个进程）；
 * - uncaughtException：记录后保持存活，交由 PM2 作为最后防线而非首选；
 * 二者都在 stderr/fatal 级别留下可观测堆栈。
 *
 * 说明：ESM 下必须在任何业务模块加载前注册，故 main.ts 将本模块置于首位导入。
 */
process.on('unhandledRejection', (reason: unknown): void => {
    Logger.fatal(
        {err: reason instanceof Error ? reason : new Error(String(reason))},
        'Unhandled promise rejection (process kept alive)'
    );
});

process.on('uncaughtException', (error: Error): void => {
    Logger.fatal({err: error}, 'Uncaught exception (process kept alive; PM2 is last resort)');
});
