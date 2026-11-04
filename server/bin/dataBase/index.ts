/**
 * 数据库模型的 barrel 再导出（指向纯定义层 `repository/models.ts`，保持既有导入路径与调用点不变）。
 * 启动期的 connect / sync / 初始化数据 / 失败退出 见 `./bootstrap.ts`，由 main.ts 显式调用。
 */
export * from "../../repository/models.js";
