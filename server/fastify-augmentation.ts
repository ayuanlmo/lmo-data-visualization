import type {FastifyRequest} from 'fastify';

/**
 * i18n 翻译函数在 onRequest 钩子上挂到 `request.t`。
 * 必须是「模块」文件（含 import/export）才能对 'fastify' 做真正的模块增强；
 * 若写在 global .d.ts 中会变成对整模块的环境重声明，反而屏蔽 Fastify 自身类型。
 * 由 main.ts 首位副作用导入以纳入编译图。
 */
declare module 'fastify' {
    interface FastifyRequest {
        t: (key: string, options?: Record<string, any>) => string;
    }
}

export type {FastifyRequest};
