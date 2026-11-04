# 构建阶段：以仓库根为上下文，在 pnpm workspace 内一键构建（不再依赖宿主机手动 build）
# 基础镜像与 server/Dockerfile 一致使用 Debian 版 node:24（避免 musl 下 rollup/esbuild 原生绑定的兼容性问题）
FROM node:24 AS builder

RUN corepack enable

WORKDIR /lmo-app

# 先只装入 workspace 元数据与各包清单，利用依赖层缓存
# 两个包的清单都要复制：--frozen-lockfile 会校验 lockfile 中全部 importer
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY server/package.json ./server/
COPY web_app/package.json ./web_app/

RUN pnpm install --frozen-lockfile --filter lmo-data-visualization_web_app

# 拷贝源码并构建（node_modules 由根 .dockerignore 排除，不会覆盖上一行结果）
COPY web_app ./web_app

RUN pnpm --filter lmo-data-visualization_web_app build

# 运行阶段：nginx 托管静态产物
FROM nginx:alpine

LABEL maintainer="ayuanlmo@outlook.com"

RUN rm /etc/nginx/conf.d/default.conf

COPY web_app/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /lmo-app/web_app/build /usr/share/nginx/html

EXPOSE 80
