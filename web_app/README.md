<div align="center">
    <img width="200px" src="./public/logo.svg">
</div>

<div align="center">
    <h1>lmo-DataVisualization</h1>
</div>

## 👋 介绍

这是 `🌐lmo-DataVisualization`的前端实现，它使用 React + TypeScript 构建，采用hi-ui作为界面组件库。

本项目开发环境运行在 **Node.js v18.20.4+** 版本之上，使用 **WSL (Windows Subsystem for Linux)** 开发。

> 💡 Hi-UI 是一个由小米公司(mi.com)开发的现代化的 React 组件库，提供丰富的 UI
> 组件与设计系统支持。如您需要了解更多关于它的使用方法，请访问其官方文档。 https://xiaomi.github.io/hiui/

---

## 🚀 快速开始

在开始开发或部署之前，请确保您的开发环境已正确配置。

### 环境要求

| 工具                | 版本要求      | 备注                      |
|-------------------|-----------|-------------------------|
| Node.js           | `>= 18.x` | 推荐使用 `nvm` 或 `n` 进行版本管理 |
| npm / yarn / pnpm | -         | 推荐使用 `yarn` 包管理器        |

---

### 安装步骤

#### 1. 克隆仓库

```bash
git clone https://github.com/ayuanlmo/lmo-data-visualization.git

cd lmo-data-visualization/web_app
```

#### 2. 安装依赖

推荐使用 `yarn` 作为包管理器

```bash
yarn install
```

> ✅ 如果你首次使用 `yarn`，可以通过 `npm install -g yarn` 安装。

#### 3. 启动开发服务器

```bash
yarn start
```

启动后，默认会打开浏览器

> 🔧 如需自定义开发服务器行为（如代理设置、端口号等），请修改 `craco.config.js` 中的 `devServer` 配置项。

---

## 🛠️ 构建与部署

### 构建生产版本

使用以下命令构建用于部署的生产环境代码：

```bash
yarn build
```

构建完成后，静态资源将输出至 `build/` 目录中。

---

## 📦 项目结构概览

```
lmo-data-visualization/web_app
├── public/                  # 静态资源目录
├── src/                     # 源码目录
│   ├── bin/                 # 主要实现了一些hooks
│   ├── components/          # 组件
│   ├── config/              # 配置文件
│   ├── const/               # 常量文件
│   ├── i8n/                 # 国际化相关配置
│   ├── lib/                 # 一些库
│   ├── pages/               # 页面级组件
│   ├── styles/              # 公共样式文件
│   ├── svg/                 # svg图标
│   ├── types/               # typescript类型
│   ├── utils/               # 工具函数、公共方法
│   ├── global.d.ts          # 全局类型声明文件
│   └── index.tsx            # 入口文件
│   Dockerfile               # 容器配置文件
│   nginx.conf               # nginx配置文件
├── craco.config.js
├── tsconfig.json
├── package.json
└── README.md
```
