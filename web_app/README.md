<div align="center">
    <img width="200px" src="./public/logo.svg">
</div>

<div align="center">
    <h1>lmo-DataVisualization</h1>
</div>

## 👋 介绍

这是 `🌐lmo-DataVisualization`的前端实现，它使用 React + TypeScript 构建，采用hi-ui作为界面组件库。

构建工具链为 **Vite**（已从 CRA + craco 迁移），并作为仓库根 pnpm workspace 的一个包（与 `server` 同级）参与依赖解析。

> 💡 Hi-UI 是一个由小米公司 (mi.com)开发的现代化的 React 组件库，提供丰富的 UI
> 组件与设计系统支持。如您需要了解更多关于它的使用方法，请访问其官方文档。 https://xiaomi.github.io/hiui/

---

## 🚀 快速开始

### 环境要求

| 工具    | 版本要求 | 备注                                                   |
|---------|----------|--------------------------------------------------------|
| Node.js | `>= 24`  | 推荐使用 `nvm` 或 `n` 进行版本管理                     |
| pnpm    | `10`     | 由仓库根 `packageManager` 锁定，`corepack enable` 即可 |

> ⚠️ 依赖安装在 **仓库根目录**执行，`web_app` 不再单独维护 lockfile。
> 
> Windows 用户请通过 WSL 等 Linux 文件系统内的路径执行 pnpm（UNC 路径下 pnpm 存在已知缺陷）。

---

### 安装步骤

#### 1. 克隆仓库

```bash
git clone https://github.com/ayuanlmo/lmo-data-visualization.git

cd lmo-data-visualization
```

#### 2. 安装依赖

```bash
corepack enable
pnpm install
```

#### 3. 启动开发服务器

```bash
# 在仓库根执行
pnpm --filter lmo-data-visualization_web_app dev
# 或先进入本目录
cd web_app && pnpm dev
```

默认监听 `http://localhost:8081`（不会自动打开浏览器）。

可用环境变量：

| 变量名                     | 默认值  | 说明                                  |
|----------------------------|---------|---------------------------------------|
| `LMO_WEB_APP_DEV_PORT`     | `8081`  | dev server 监听端口                   |
| `LMO_SERRVER_APP_DEV_PORT` | `49237` | `/api`、`/connect` 代理指向的后端端口 |

> 🔧 开发服务器行为（端口、代理、产物命名等）统一在 `vite.config.ts` 中配置；
> 后端需以 `PORT=49237 pnpm --filter lmo-data-visualization-server-application dev` 启动，
> 代理规则与线上 nginx 一致（`/api` 前缀在转发时被剥离，`/connect` 为 WebSocket）。

---

## 🛠️ 脚本与构建

| 命令             | 说明                                                                     |
|------------------|--------------------------------------------------------------------------|
| `pnpm dev`       | Vite 开发服务器（HMR）                                                   |
| `pnpm build`     | 先执行类型检查（`tsconfig.json` + `tsconfig.node.json`），再产出静态资源 |
| `pnpm preview`   | 本地预览 `build/` 产物，用于部署前冒烟                                   |
| `pnpm typecheck` | 仅类型检查                                                               |
| `pnpm lint`      | ESLint 9（flat config，见 `eslint.config.mjs`）                          |

构建完成后，静态资源将输出至 `build/` 目录中，产物命名沿用迁移前的约定（`script/_t_script_[hash].t.js`、
`css/_t_style_[hash].t.css`、`static/_t_static_[hash].t.[ext]`），以便与现网 nginx 缓存策略保持一致。

`index.html` 中原先由 `HtmlWebpackPlugin` 注入的构建时间与名称，现由 `vite.config.ts` 内的
`transformIndexHtml` 插件完成，页面文案保持不变。

---

## 📦 项目结构概览

```
lmo-data-visualization/web_app
├── public/                  # 静态资源目录（不参与打包哈希）
├── src/                     # 源码目录
│   ├── bin/                 # 主要实现了一些hooks
│   ├── components/          # 组件
│   ├── config/              # 配置文件
│   ├── const/               # 常量文件
│   ├── i18n/                # 国际化相关配置
│   ├── lib/                 # 一些库
│   ├── pages/               # 页面级组件
│   ├── style/               # 公共样式文件
│   ├── svg/                 # svg图标
│   ├── types/               # typescript类型
│   ├── utils/               # 工具函数、公共方法
│   ├── global.d.ts          # 全局类型声明文件
│   └── index.tsx            # 入口文件
├── index.html               # Vite 入口 HTML（原 public/index.html）
├── vite.config.ts           # 构建/开发服务器配置
├── eslint.config.mjs        # ESLint 9 flat config
├── tsconfig.json            # 源码类型检查配置
├── tsconfig.node.json       # vite.config.ts 的类型检查配置
├── Dockerfile               # 容器配置文件（多阶段构建 → nginx）
├── nginx.conf               # nginx配置文件
├── package.json
└── README.md
```
