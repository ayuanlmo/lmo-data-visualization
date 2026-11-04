<div align="center">
    <img width="200px" src="../web_app/public/logo.svg">
</div>

<div align="center">
    <h1>lmo-DataVisualization</h1>
</div>

## 👋 介绍

这是 `🌐lmo-DataVisualization` 的服务器实现，基于 **Fastify** 构建，采用 **ESM**（`"type": "module"`）与 **TypeScript 7** 编译，数据库支持 **sqlite** 与 **mssql**（Sequelize v6）。

合成能力（headless Chromium + ffmpeg）在本进程内直接运行，无独立的 TCP Socket 层。

本项目运行在 **Node.js v24+** 之上，包管理器统一为 **pnpm**（workspace），开发环境使用 **WSL**。

---

## 🚀 快速开始

在仓库根目录执行（workspace 已包含 `server`）：

#### 1. 安装依赖

```bash
corepack enable
pnpm install
```

#### 2. 启动开发服务器

```bash
pnpm --filter lmo-data-visualization-server-application dev
```

#### 3. 类型检查 / 测试 / CI

```bash
pnpm -r typecheck     # tsc --noEmit
pnpm test             # vitest（单元 + 集成 + 迁移 + 合成）
pnpm run ci           # typecheck + test 门禁
```

---

## 📄 环境变量一览

配置在进程启动最早期由 Zod 一次性校验（`conf/env.ts`），非法配置以可读错误 + 非 0 退出，而非带病运行到数据库连接阶段。

| 变量名称                  | 描述                                              | 默认值         |
|-----------------------|-------------------------------------------------|-------------|
| `PORT`                | 服务器端口（强制 `Number`）                             | 3000        |
| `REQUEST_BODY_LIMIT_MB` | 非 multipart 请求体上限（MB）。一次 createTask 会带封面截图 + 背景图两张 base64，旧 Express 版为 5mb | 64 |
| `NODE_ENV`            | 环境（`development`/`live-server`/`prod`）          | development |
| `APP_LOG_LEVEL`       | pino 日志级别（`fatal`…`trace`）                     | warn        |
| `DATA_BASE_TYPE`      | 数据库类型（`sqlite`、`mssql`）                        | sqlite      |
| `DATA_BASE_NAME`      | 数据库名称（mssql）                                   | *           |
| `DATA_BASE_USER_NAME` | 数据库用户名（mssql）                                   | *           |
| `DATA_BASE_PASSWORD`  | 数据库密码（mssql）                                    | *           |
| `DATA_BASE_HOST`      | 数据库地址（mssql）                                    | *           |
| `SERVER_HOST`         | 服务器对外地址（合成任务/音频引用拼接 URL 用）                     | localhost   |
| `DATA_BASE_MIGRATIONS`| 置 `1` 时走 Umzug 迁移（生产修复存量库漂移）；否则开发期 `DB.sync()` | 0           |
| `DATA_BASE_SQLITE_STORAGE` | 覆盖 sqlite 库文件路径（单库调试/指向已有库）                    | `<数据根>/db/dv_data.db` |
| `DATA_DIR`            | 运行时数据根（db / log / static 全在里面）；为空则用 `<包根>/_data` | * |
| `CHROME_VERSION`      | 合成用 Chrome for Testing 完整构建号（下限 `119.0.6018.0`）  | 131.0.6778.85 |
| `CHROME_PATH`         | 直接指向可用的 Chrome/Chromium 可执行文件，跳过预置缓存解析           | * |
| `BROWSER_CACHE_DIR`   | 浏览器预置目录（默认 `<server>/.bin`）                        | * |
| `CHROME_MIRROR_BASE`  | Chrome 下载镜像基址；空为官方 CDN。国内/网络受限时建议设置         | * |
| `BROWSER_USE_GPU`     | `1` 开启 GPU 参数段；仅当 Chrome 在 119–131 且宿主真有 GPU 时才建议开 | 0 |
| `BROWSER_USE_ANGLE`   | `1` 附带 `--use-angle`（依赖 `BROWSER_USE_GPU=1`）        | 0 |
| `FFMPEG_PATH`         | 指定 ffmpeg；为空则自动探测（内置二进制 → PATH 上的系统 ffmpeg）     | * |
| `FFPROBE_PATH`        | 指定 ffprobe；为空则沿用库内置份                              | * |

> 📌 注：您可以不写任何环境变量，程序将使用默认值（sqlite 单文件库）。

> 若使用 mssql，必须配置 `DATA_BASE_TYPE=mssql` 以及 `DATA_BASE_HOST` / `DATA_BASE_USER_NAME` / `DATA_BASE_PASSWORD`，否则启动即校验失败退出。

> `SERVER_HOST` 是服务器程序对外地址。开发环境默认 `localhost`；容器部署时需指定，以确保合成流程能访问到它。

> 生产环境建议以 `DATA_BASE_MIGRATIONS=1` 运行 Umzug 迁移（对齐模型/脚本/存量库），而非依赖 `DB.sync()`。

---

## 📁 数据根与启动流程

### 两个目录锚点

| 名称 | 如何解析 | 装什么 |
|---|---|---|
| **包根** | 从模块所在目录向上找到 `name` 为 `lmo-data-visualization-server-application` 的 `package.json` 所在目录 | 随代码分发的东西：`views/`（pug）、`dist/`、`.bin/`（浏览器预置）、`tmp/`（wvc 中间产物） |
| **数据根** | 默认 `<包根>/_data`，可用 `DATA_DIR` 整体改指 | 运行期读写：`db/dv_data.db`、`log/`、`static/public/{templates,uploads,output,previewTemplate,scripts,styles}` |

解析入口只有一个：`lib/dataDir.ts`（`packageRoot` / `dataRoot` / `dataPath()` / `packagePath()` / `staticPublicRoot`）。
源码布局（`tsx` 直跑）与编译产物布局（`dist/`）都落到同一个包根，且写入不再跟 `process.cwd()` 走。
启动时 `CheckDirectory` 会打印一行 `数据根: … （包根: …）`，排查目录问题先看它。

> 历史缺陷（已修，两类锚点曾并存）：读取/服务侧用 `__dirname` 相对层级，写入侧用 `./_data` 相对 cwd。
> 开发时两者恰好相等，一旦跑 `dist/main.js`（Docker 里 pm2 正是这么跑的）`__dirname` 那套就多钻一层 `dist/`：
> 实测为 `/static/**` 全 404、pug 预览 500（找不到 `dist/views`）、日志与上传写进不是挂载卷的 `dist/_data`（数据不落卷）、
> 模板编译 `spawnSync` 报 ENOENT（其实是 `cwd` 指向了不存在的目录）。

> `DATA_DIR` 也是集成测试的隔离开关：`server/test/contract.smoke.test.ts` 把它指向 `mkdtemp` 临时目录，
> 所以测试既不读也不写仓库里的 `server/_data`（那里有真实的 sqlite 库、上传件与自建模板）。

### 启动流程（`main.ts`）

1. `lib/nodeUtilCompat.js` — 补齐 web-video-creator 依赖的遗留 `util.*` 判定函数，必须最先。
2. `fastify-augmentation.js` — 把 `request.t` 的类型增强纳入编译图。
3. `lib/processGuard.js` — 注册进程级兜底（未捕获异常 / 拒绝 / 信号）。
4. `lib/CheckDirectory.js` — 在数据根下建目录骨架并打印数据根；内含预览产物过期清理定时器（已 `unref`，不撑事件循环）。
5. `conf/env.ts`（被上面间接引入）— Zod 一次性校验环境变量，非法即可读报错 + 非 0 退出。
6. `bin/Process.js` — `new HttpServer()` 装配 Fastify（HTTP + WS + static + multipart + pug）并 `listen`；同时注册关闭钩子（先关库再退出）。
7. `bin/TaskScheduler.js` — 合成队列（并发位 1）。
8. `lib/TSC.js` — 子进程 `tsc` 编译 `<数据根>/static/public` 下的模板脚本，失败即抛、不带病启动。
9. `process.chdir(packageRoot)` — 把工作目录钉到包根：web-video-creator 的中间目录是 `path.resolve("tmp/…")` 硬编码且不接受 config 覆盖。
10. `bootstrapDatabase()` — 连库；`DATA_BASE_MIGRATIONS=1` 走 Umzug 迁移，否则开发期 `DB.sync()`；成功后向 PM2 发 `ready`。

### browser:install / browser:check 到底是什么、什么时候跑

- `browser:install`（`scripts/prepare-browser.ts`）——**下载并解包** Chrome for Testing 到 `<包根>/.bin`（或 `BROWSER_CACHE_DIR`），
  自己完成「下载 → 尺寸下限 → ZIP 中央目录可解析 → 解包 → 补执行位 → `--version` 实跑」，任一环不过就失败退出。
- `browser:check`（`scripts/check-browser.ts`）——**只读自检**，不下载：打印生效的版本/缓存目录/下载基址与 URL、ffmpeg/ffprobe 探测结果，
  并真跑一次 `--version`。改完环境变量或怀疑二进制残缺就先跑它。

| 场景 | 时机 |
|---|---|
| 本地开发（WSL2 / Linux / macOS） | 拉代码后手动跑一次 `browser:install`（Chrome 不进 git）；`browser:check` 随时可跑 |
| Docker 构建 | `Dockerfile` 在 `pnpm build` 之前 `RUN pnpm browser:install`，自检不过直接构建失败——不会产出「跑不了合成」的镜像 |
| 运行期 | **两者都不跑**。每个合成任务前由 `preflight()` 解析路径并 `--version` 实测，失败就让该任务报可读错误；绝不进运行期下载（旧链路会静默截断二进制并让 Promise 永不 settle，从而焊死并发位为 1 的调度器） |

---

## 🎬 合成环境（浏览器与 ffmpeg）

合成需要两个「靠下载获得」的外部二进制：Chrome for Testing（由 web-video-creator 使用）与 ffmpeg。
两者都必须**完整且可执行**，否则任务不会报错而是无限挂起，并占住并发位为 1 的调度器——
表现为“Resources 有记录、但没有一个真正出片”。

### 首次拉取代码后（本地开发：WSL2 / Linux / macOS）

```bash
pnpm --filter lmo-data-visualization-server-application browser:install   # 预置 Chrome（约 165MB 下载 + 500MB 解包）
pnpm --filter lmo-data-visualization-server-application browser:check    # 打印生效配置并真跑一次 --version / -version
```

Linux 还需要 Chromium 的运行时依赖（容器镜像已内置，清单见 `Dockerfile`）：

```bash
sudo apt-get update && sudo apt-get install -y --no-install-recommends \
    libnss3 libglib2.0-0 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 \
    libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 \
    libasound2t64 fonts-wqy-microhei && sudo fc-cache -f -v
```

### 为什么不用 web-video-creator 自带的浏览器下载器

它的解包链 `extract-zip → yauzl → fd-slicer`（2020 年的 legacy stream 写法）在 Node 26 上会在解压大 entry 时
静默终止读循环：控制变量实测同一份压缩包，Node 24.22.2 为 2.8s / 140 个文件 / 字节精确，
Node 26.13.0 为永久挂起 / 仅 7 个文件。残缺的 Chrome 主程序执行即 `SIGSEGV`，而 `install()` 的 Promise 永不 settle。

本项目因此自备预置（`bin/synthesis/browser.ts`，用 `adm-zip` 解包 + 补执行位 + `--version` 校验），
并在运行时以 `browserExecutablePath` 直接指路，不再进入那段链路。`pnpm browser:install` 已在 Dockerfile 构建期执行。

### 网络受限 / 国内环境：换下载源

浏览器压缩包默认从 `https://storage.googleapis.com/chrome-for-testing-public` 拉（约 157MB）。
国内环境下这一步往往慢到不可用或直接失败，而且**预置走的是全局 `fetch`，它不读 `HTTP_PROXY` / `HTTPS_PROXY`**——
给构建机挂代理环境变量是无效的，只能换源：

```bash
# 本地开发
CHROME_MIRROR_BASE=https://cdn.npmmirror.com/binaries/chrome-for-testing pnpm --filter lmo-data-visualization-server-application browser:install

# 容器构建
docker build -f server/Dockerfile --build-arg CHROME_MIRROR_BASE=https://cdn.npmmirror.com/binaries/chrome-for-testing -t lmo-server:node24 .

# 或经 compose（已透传该构建参数）
LMO_APP_CHROME_MIRROR_BASE=https://cdn.npmmirror.com/binaries/chrome-for-testing docker compose build server_app
```

实测同一份 `131.0.6778.85/linux64`（157.6MB，两边 `content-length` 一致）：

| 下载源 | 吞吐 | 预计耗时 |
|--------|------|----------|
| 官方 `storage.googleapis.com` | 0.17 MB/s | ~930s |
| `https://cdn.npmmirror.com/binaries/chrome-for-testing` | 8.47 MB/s | ~19s |
| `https://registry.npmmirror.com/-/binary/chrome-for-testing` | 6.56 MB/s | ~24s |

要求与保障措施：

- 镜像必须保持官方目录结构：`<base>/<构建号>/<平台>/chrome-<平台>.zip`。`browser:install` 会把实际拼出的 URL 打出来，`browser:check` 也会预先打印「本次会拉取的 URL」，不对就能立刻看出来。
- 换错源不会产出半成品：尺寸下限、EOCD（中央目录）解析、解包后 `--version` 实跑三道都会拦；下载先写 `.part` 再 `rename`，中断不会污染规范路径上的缓存。
- 代码默认仍是官方 CDN。把默认值改成第三方镜像属于供应链决策，需您自己拍定。

### 浏览器版本窗口（为何默认 131）

- **下限 119.0.6018.0**：wvc 用 `VideoDecoder` 解码 H264，低版本不可用（见 `web-video-creator/lib/install-browser.js` 注释）。
- **上限 131**：wvc 依赖旧 headless 的 `HeadlessExperimental.beginFrame`，该方法自 Chrome 132 起被移除。
  本项目在非 macOS 平台已开 `compatibleRenderingMode`（走 `Page.screenshot`），因此高于 131 仍可工作，只是效率下降。
- **GPU 默认关闭**：wvc 的 GPU 参数段会追加一个不带值的裸 `--use-angle`，且 `config()` 无法修正参数表。
  实测该参数段在 119 全部可用，在 131 会直接打死 target（`Target.createTarget: Target closed`）或永久挂起；
  因此 `CHROME_VERSION > 131` 时无论 `BROWSER_USE_GPU` 如何设都强制关闭。

### ffmpeg

`bin/synthesis/mediaTools.ts` 按「`FFMPEG_PATH` → 包内置 ffmpeg-static → PATH 上的系统 ffmpeg」顺序探测，
判据是**实际执行 `-version`**（只看文件存在会漏掉截断的二进制）。全部不可用时报错并终止本次任务，不占用并发位。

### 常见症状对照

| 现象 | 原因 | 处理 |
|------|------|------|
| 任务永不结束、无日志 | 浏览器被截断且 `install()` 永不 settle | `pnpm browser:install`（会先拒用 EOCD 解析失败的缓存包） |
| `--version` 无输出 / `SIGSEGV` | Chrome 或 ffmpeg 二进制残缺 | 同上；ffmpeg 可 `apt-get install ffmpeg` 后由 `FFMPEG_PATH` 指路（不设也会自动降级） |
| `spawn ... EACCES` | 解包未保留执行位 | `browser:install` 已 `chmod 0755`；手动解包需自己补 |
| `Running as root without --no-sandbox` | 手动直跑 Chrome | 由 wvc/puppeteer 启动（默认参数已含 `--no-sandbox`），不要绕过 |
| `Target.createTarget: Target closed` | Chrome ≥ 131 撞上 wvc 的 GPU 参数段 | 保持 `BROWSER_USE_GPU=0`（默认） |
| 缺动态库 | Linux 运行时依赖未装 | `browser:check` 会列出缺失库名，按上文 apt 清单补齐 |

---

## 🔒 安全与风险边界（鉴权缺失声明）

**本项目定位为局域网 / 内网可视化工具，全部 `/api` 写接口（创建/删除任务、上传、模板与分类增删改等）默认不做身份认证与授权校验。** 这是有意的存量设计，仅在此明确风险边界，请部署方自行承担网络侧防护：

- 请勿将服务直接暴露于公网。仅在可信内网或经反向代理附加认证（如 mTLS / OIDC / BasicAuth）后方可对外。
- `NODE_ENV=live-server` 时启用「live 服务器保护」：拦截 PUT/DELETE 与受保护路由、静态文件黑名单（`.ts`/`.bin`/`config.json` 等），命中返回契约 `{code:500, errorCode:'ext00el'}`。这是**功能阉割保护**，**不是安全边界**。
- 上传接口已加 `maxFileSize`、mimetype 白名单与扩展名一致性校验以防资源型 DoS，但仍不校验调用方身份。
- mssql 非 dev 环境使用 `sa` 账号会在启动时被拒绝（`bootstrap` 校验），请改用最小权限账号。
