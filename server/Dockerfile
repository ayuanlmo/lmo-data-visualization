# 合成（headless Chromium + ffmpeg）在 API 进程内运行，
# 因此基础镜像使用 Debian 版 node:24（glibc 供 Chromium/ffmpeg-static 使用，alpine 的 musl 不兼容），
# 并包含 Chromium 运行时依赖。构建上下文为仓库根（pnpm workspace）。
FROM node:24

LABEL maintainer="ayuanlmo@outlook.com"

WORKDIR /lmo-app

# 统一包管理器：corepack 启用 pnpm（版本由根 package.json packageManager 锁定）
RUN corepack enable

# 先装入 workspace 元数据 + 依赖缓存层（利用 Docker 分层）
# web_app 的清单也必须复制：web_app 已加入 workspace，--frozen-lockfile 会校验全部 importer
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY server/package.json ./server/
COPY web_app/package.json ./web_app/
RUN pnpm install --frozen-lockfile --filter lmo-data-visualization-server-application

# Chromium 运行时依赖 + 中文字体
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libnss3 \
        libglib2.0-0 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
        libgbm1 \
        libpango-1.0-0 \
        libcairo2 \
        libasound2t64 \
        fonts-wqy-microhei && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    fc-cache -f -v

# 拷贝源码并构建
COPY server ./server

WORKDIR /lmo-app/server

# 合成依赖的坐标写死在镜像里，保证构建期预置与运行期解析不会因 cwd / 默认值漂移而不一致。
# 需要换版本时同时覆盖二者即可（CHROME_VERSION 下限 119.0.6018.0，高于 131 会失去旧 headless）。
ENV CHROME_VERSION=131.0.6778.85 \
    BROWSER_CACHE_DIR=/lmo-app/server/.bin

# 构建期预置合成用浏览器（Chrome for Testing）。
# 不让 web-video-creator 在首次合成时自己下载：其解包依赖链（extract-zip → yauzl → fd-slicer）
# 在新版 Node 上会静默截断 Chrome 主程序并让 Promise 永不 settle，并发位为 1 的调度器会被首个任务焊死。
# 版本可用 CHROME_VERSION 覆盖；校验（--version）不通过则构建立即失败，不会产出「跑不了合成」的镜像。
#
# 国内 / 网络受限环境请传 CHROME_MIRROR_BASE 换源（预置用的是全局 fetch，不读 HTTP_PROXY/HTTPS_PROXY，挂代理无效）：
#   docker build -f server/Dockerfile \
#     --build-arg CHROME_MIRROR_BASE=https://cdn.npmmirror.com/binaries/chrome-for-testing .
# 实测（131.0.6778.85/linux64，157.6MB）：官方 0.17MB/s 约 930s，npmmirror 8.47MB/s 约 19s。
# 镜像必须保持官方目录结构：<base>/<构建号>/<平台>/chrome-<平台>.zip；尺寸或 EOCD 对不上会直接构建失败。
ARG CHROME_MIRROR_BASE=
ENV CHROME_MIRROR_BASE=$CHROME_MIRROR_BASE
RUN pnpm browser:install

# ffmpeg 同样是“构建期下载”的产物，用一道真实执行拦住被截断的二进制（SIGSEGV/EACCES）。
# 注意不能接 | head：管道会把退出码换成 head 的 0，段错误就溜过去了。
# 不通过时的逃生口：apt-get install ffmpeg 并设 FFMPEG_PATH / FFPROBE_PATH 指向系统份。
RUN FF="$(node --input-type=commonjs -p 'require("ffmpeg-static")')" \
    && test -s "$FF" \
    && "$FF" -version > /dev/null \
    && echo "ffmpeg-static OK: $FF"

RUN pnpm build

# PM2 作为进程守护的「最后防线」（首选是应用自身的进程兜底 + 优雅关闭）
RUN npm i -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "start", "/lmo-app/server/dist/main.js", "--interpreter", "node"]
