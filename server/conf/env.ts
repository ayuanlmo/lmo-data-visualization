import { z } from 'zod';

/**
 * 配置入口 zod 化。
 * 在进程启动最早期（AppConfig 被广泛 import 时）一次性校验全部环境变量：
 * 非法配置输出「可读」错误并以非 0 退出，而非带病运行到 DB 连接阶段才崩。
 */
const envSchema = z
    .object({
        PORT: z.coerce.number().int().min(1).max(65535).default(3000),
        // 非 multipart 请求体上限（MB）。
        // 为何不是 Fastify 缺省的 1MB：前端一次 createTask 会带 **两张** base64 图——
        //   1) `cover`：html2canvas 对整个模板 DOM 截图的 PNG dataURL（随分辨率增长，4K 可达几 MB）；
        //   2) `currentTemplateConfig.config.background.image`：把服务器已有的背景图再读成 dataURL 回传。
        // 旧 Express 版上限是 5mb，迁移到 Fastify 后曾被隐式降到 1MB（缩小 5 倍）。
        // 三层体积门需保持递增：nginx `client_max_body_size 100M` > 本项 > multipart 单独 512MB（文件上传走后者）。
        REQUEST_BODY_LIMIT_MB: z.coerce.number().int().min(1).max(256).default(64),
        NODE_ENV: z.enum(['development', 'live-server', 'prod']).default('development'),
        APP_LOG_LEVEL: z
            .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
            .default('warn'),
        DATA_BASE_TYPE: z.enum(['sqlite', 'mssql']).default('sqlite'),
        DATA_BASE_NAME: z.string().default(''),
        DATA_BASE_USER_NAME: z.string().default(''),
        DATA_BASE_PASSWORD: z.string().default(''),
        DATA_BASE_HOST: z.string().default(''),
        // 运行时数据根（_data）覆盖。为空 = `<包根>/_data`（由 lib/dataDir.ts 沿目录定位包根，不跟 cwd 走）。
        // 存在两项理由：1) 部署时把数据放到非代码目录；2) 集成测试指向 mkdtemp 临时目录，完全不接触真实 _data。
        DATA_DIR: z.string().default(''),
        // ===== 合成依赖（浏览器 / ffmpeg）可配置化 =====
        // 浏览器版本：chrome-for-testing 的完整构建号。下限 119.0.6018.0（wvc 需 H264 VideoDecoder）。
        CHROME_VERSION: z.string().default('131.0.6778.85'),
        // 显式指定浏览器可执行文件；为空则取 BROWSER_CACHE_DIR 下按 CHROME_VERSION 预置的那一份
        CHROME_PATH: z.string().default(''),
        BROWSER_CACHE_DIR: z.string().default(''),
        // chrome-for-testing 的下载镜像基址（目录结构需与官方一致）。
        // 空 = 官方 CDN。注意预置用的是全局 fetch，它不读 HTTP_PROXY/HTTPS_PROXY，
        // 所以网络受限时只能靠这里换源，挂代理环境变量是无效的。
        CHROME_MIRROR_BASE: z.string().default(''),
        // wvc 的 GPU 参数段（含裸 --use-angle）在 Chrome >=131 上会直接打死 target，
        // 而该参数表无法从 config 注入修正，故默认关闭 GPU（无 GPU 的容器里本就只有 swiftshader 兼底）。
        BROWSER_USE_GPU: z.enum(['0', '1']).default('0').transform((v): boolean => v === '1'),
        BROWSER_USE_ANGLE: z.enum(['0', '1']).default('0').transform((v): boolean => v === '1'),
        // ffmpeg-static / ffprobe-static 的二进制可能被下载截断；允许指向系统安装份
        FFMPEG_PATH: z.string().default(''),
        FFPROBE_PATH: z.string().default('')
    })
    .superRefine((val, ctx): void => {
        if (val.CHROME_VERSION !== '' && !/^\d+\.\d+\.\d+\.\d+$/.test(val.CHROME_VERSION)) {
            ctx.addIssue({
                code: 'custom',
                message: 'CHROME_VERSION 必须是 chrome-for-testing 的完整构建号（形如 131.0.6778.85）'
            });
        }
        if (val.CHROME_MIRROR_BASE !== '' && !/^https?:\/\//i.test(val.CHROME_MIRROR_BASE)) {
            ctx.addIssue({
                code: 'custom',
                message: 'CHROME_MIRROR_BASE 必须是 http(s) 基址（末尾斜杠可省，拼接时会自动处理）'
            });
        }
        if (
            val.DATA_BASE_TYPE === 'mssql' &&
            (val.DATA_BASE_HOST === '' ||
                val.DATA_BASE_USER_NAME === '' ||
                val.DATA_BASE_PASSWORD === '')
        ) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'DATA_BASE_TYPE=mssql 时必须配置 DATA_BASE_HOST / DATA_BASE_USER_NAME / DATA_BASE_PASSWORD'
            });
        }
    });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    const detail: string = parsed.error.issues
        .map((issue): string => `  - ${issue.path.join('.') || '<root>'}: ${issue.message}`)
        .join('\n');
    process.stderr.write(`[env] 非法环境变量配置，进程退出:\n${detail}\n`);
    process.exit(1);
}

export const env = parsed.data;
