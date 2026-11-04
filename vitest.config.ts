import { defineConfig } from 'vitest/config';

// vitest 基座：重构期间（尤其 Express→Fastify、service 合并）的唯一回归安全网。
// 计划 Phase 0 要求「先于重构建立」，Phase 7 在此基座上补全集成/合成/数据库用例。
export default defineConfig({
    test: {
        environment: 'node',
        include: ['server/test/**/*.test.ts'],
        // 不占用端口、不连真实数据库；集成用例（fastify.inject）在 Phase 3 后补入本目录。
        globals: false
    }
});
