<div align="center">
    <img width="200px" src="web_app/public/logo.svg">
</div>

<div align="center">
<h1>lmo-DataVisualization</h1>


</div>

<p align="center">
    <img src="https://img.shields.io/badge/Node.js -blue.svg?logo=node.js" alt="TypeScript">
    <img src="https://img.shields.io/badge/TypeScript-4.9.5 -blue.svg?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/craco-7.1.0 -blue.svg?" alt="craco">
    <img src="https://img.shields.io/badge/React-18.2.0 -blue.svg?logo=react" alt="React">
    <img src="https://img.shields.io/badge/React_Redux-18.2.0 -blue.svg?logo=redux" alt="React-Redux">
    <img src="https://img.shields.io/badge/SASS-1.71.0 -blue.svg?logo=sass" alt="sass">
    <img src="https://img.shields.io/badge/axios-1.6.7 -blue.svg?logo=axios" alt="axios">
    <img src="https://img.shields.io/badge/Hi_UI-4.3.3 -blue.svg?logo=xiaomi" alt="Hi-UI">
    <img src="https://img.shields.io/badge/nodemon-3.1.0 -blue.svg?logo=nodemon" alt="nodemon">
    <img src="https://img.shields.io/badge/ts_node-10.9.2 -blue.svg?logo=ts-node" alt="ts-node">
    <img src="https://img.shields.io/badge/Express-4.3.3 -blue.svg?logo=express" alt="Express">
    <img src="https://img.shields.io/badge/Gulp-4.0.2 -blue.svg?logo=gulp" alt="gulp">
    <img src="https://img.shields.io/badge/Pug-3.0.3 -blue.svg?logo=pug" alt="Express">
    <img src="https://img.shields.io/badge/uuid-9.0.1 -blue.svg?" alt="uuid">
    <img src="https://img.shields.io/badge/sqlite3-5.1.7 -blue.svg?logo=sqlite" alt="sqlite3">
    <img src="https://shields.io/badge/Microsoft_SQL_Server-inactive?logo=sqlserver" alt="Microsoft SQL Server"/>
    <img src="https://img.shields.io/badge/sequelize-6.37.1 -blue.svg?logo=sequelize" alt="sequelize">
    <img src="https://img.shields.io/badge/ffmpeg_static-5.2.0 -blue.svg?logo=ffmpeg" alt="ffmpeg-static">
    <img src="https://img.shields.io/badge/fluent_ffmpeg-2.1.3 -blue.svg?logo=ffmpeg" alt="fluent-ffmpeg">
    <img src="https://img.shields.io/badge/web_video_creator-0.0.34 -blue.svg" alt="web-video-creator">

</p>

## 👋 介绍

✨`lmo-DataVisualization`（以下简称`“lmo-dv”` 或 `“dv”`），一款开源可视化数据制作工具。 使用内置模板，将各种业务数据转换为视频动画，使数据更加形象、生动。
同时提供了sdk，可以根据需求编写不同的模板以满足业务需求。

这是lmo-dv的第3个大版本，该版本完全重新设计、重做。因此与旧版本不兼容。

---

### 👍 相比之前的版本，有什么区别？

- 基于`React.js` + `TypeScript`
- 内置`ffmpeg`
- 内置`sqlite`数据库
- 交互式的设计器
- 重新设计的界面、模板、素材库、资源库
- css动画录制支持
- gif录制支持
- 新的模板sdk
- 容器支持

## 🤩 内置功能

- 数据相关
    - 数据编编辑：提供类似Excel的表格功能，支持导入数据
- 主题相关
    - 模板高度定制化
    - 文字动画
    - 背景图
- 音频、视频相关
    - 自定义音频
    - 音量控制
    - 高码率视频
    - 最高4K清晰度
- 模板
    - 模板“sdk”：提供模板开发接口，可以根据业务自定义模板
    - 创建自定义模板

## 🤩 在线体验一下？

演示服务器仅提供基础功能演示，由于服务器性能原因，一些功能受到限制。
[点击打开](https://dv.ayuanlmo.cn/)

---

## 🤤 部署指南

### 👍 使用Docker Compose部署

本项目提供了一个 `docker-compose.yml` 文件来简化服务的启动过程。首先，请确保已准备好以下基础镜像：

- `nginx:alpine`
- `node:20-alpine`
- `node:18`

然后执行以下命令拉取所需镜像：

```bash
docker pull nginx:alpine
docker pull node:20-alpine
docker pull node:18

```

在编排开始之前，您还需要构建一下`web_app`。由于考虑此容器的大小，所以这是必须的。

```bash
cd /web_app
yarn
yarn build
```

---

#### 📄 Docker Compose 环境变量配置文档

##### 🚦 服务端口相关

| 变量名                    | 默认值     | 说明                     | 是否必须 |
|------------------------|---------|------------------------|------|
| `LMO_APP_MAIN_PORT`    | `80`    | Web 应用对外暴露的端口          | 否    |
| `LMO_APP_SERVICE_PORT` | `30003` | Service (合成)服务映射到主机的端口 | 否    |
| `LMO_APP_SERVER_PORT`  | `30000` | Server 服务映射到主机的端口      | 否    |

---

##### 💾 数据库配置（Database）

| 变量名                           | 默认值             | 说明                       | 是否敏感 | mssql必选项 |
|-------------------------------|-----------------|--------------------------|------|----------|
| `LMO_APP_DATA_BASE_TYPE`      | `sqlite`        | 数据库类型（可选 sqlite, mssql ） | ❌    | ❌        |
| `LMO_APP_DATA_BASE_NAME`      | `lmo-dv`        | 数据库名称（适用于mssql）          | ❌    | ✅        |
| `LMO_APP_DATA_BASE_USER_NAME` | `your_username` | 数据库用户名（适用于mssql）         | 	⚠️  | ✅        |
| `LMO_APP_DATA_BASE_PASSWORD`  | `your_password` | 数据库密码（适用于mssql）          | 	⚠️  | ✅        |
| `LMO_APP_DATA_BASE_HOST`      | `localhost`     | 数据库主机地址（适用于mssql）        | ⚠️   | ✅        |

---

##### 📁 数据卷挂载路径

| 变量名            | 默认值         | 说明                   | 是否必须 |
|----------------|-------------|----------------------|------|
| `LMO_APP_DATA` | `/lmo-data` | 宿主机上的数据挂载目录（用于持久化存储） | 	✅   |

---

##### 🔐 其他服务环境变量（硬编码在 compose 中）

这些变量虽然未通过环境变量注入，但作为补充信息列出：

| 变量名                    | 默认值           | 说明               |
|------------------------|---------------|------------------|
| `NODE_ENV`             | `prod`        | Node.js 环境模式     |
| `SERVER_HOST`          | `server_app`  | Server 服务的容器主机名  |
| `SERVICE_HOST`         | `service_app` | Service 服务的容器主机名 |
| `SERVICE_PORT`         | `3002`        | Service 内部监听端口   |
| `PORT`                 | `3000`        | Server 内部监听端口    |
| `ALLOW_UNSAFE_CONTEXT` | `1`           | 允许非安全上下文访问       |

---

#### 🧠 容器部署建议

- 所有带 **“⚠️”** 标记的变量建议在生产环境中由用户手动设置，不要使用默认值。
- 推荐使用 `.env` 文件管理这些变量。

---

##### 📝 示例 `.env` 文件内容

```env

LMO_APP_MAIN_PORT=80 # web_app服务端口
LMO_APP_SERVICE_PORT=30003 # 合成服务端口
LMO_APP_SERVER_PORT=30000 # 服务器端口

# 数据库配置
LMO_APP_DATA_BASE_TYPE=sqlite # 数据库类型 可选 sqlite、mssql

# （如果您不使用mssql数据库，以下可以省略）
LMO_APP_DATA_BASE_NAME=lmo-dv  # 数据库名称
LMO_APP_DATA_BASE_USER_NAME=root # 数据库用户名
LMO_APP_DATA_BASE_PASSWORD=your_password # 数据库密码
LMO_APP_DATA_BASE_HOST=localhost # 数据库地址

LMO_APP_DATA=/lmo-data # 数据挂载路径

```

##### 🙌 一切都准备好了？

```bash
cd /lmo-data-visualization

docker-compose up -d --build

```

---

<details>
<summary>以源代码方式部署</summary>

### 以源代码方式部署

#### 克隆代码

```bash
# clone code
git clone https://github.com/ayuanlmo/lmo-data-visualization.git
```

#### 服务器主程序

```bash
cd /lmo-data-visualization
# 
cd /server
# 安装依赖
yarn
# 编译主服务端代码
yarn prod
# 启动主服务端
pm2 start ./dist/main.js
```

---

#### 数据库配置

服务器程序支持两种数据库，分别是：`sqlite` 、`Microsoft SQL Server®` (以下简称`mssql`)

默认使用`sqlite`,作为程序默认数据库，如果您想使用mssql，请写入如下环境变量：

```env
LMO_APP_DATA_BASE_TYPE=mssql # 使用mssql
LMO_APP_DATA_BASE_NAME=lmo-dv  # 数据库名称
LMO_APP_DATA_BASE_USER_NAME=sa # 数据库用户名（不建议要用sa
LMO_APP_DATA_BASE_PASSWORD=your_db_password # 数据库密码
LMO_APP_DATA_BASE_HOST=your_db_host # 数据库地址

```

使用mssql数据库，您需要先初始化数据库，请将库名称设置为：`lmo-dv`，或者使用`/server/sql`目录下的sql文件进行初始化，建议您使用
`SQL Server Management Studio®` (`SSMS`)运行sql文件。

---

#### 合成服务器

```bash
# 
cd /service
# 安装依赖
yarn
# 编译合成服务端代码
yarn c
# 启动合成服务
pm2 start ./dist/main.js
```

#### 合成服务器环境变量

```env
SERVER_HOST=localhost  # 服务器地址(可选，默认值localhost)
ALLOW_UNSAFE_CONTEXT=1 # 允许非安全上下文访问(可选 默认值0)
SERVICE_PORT=3002      # 合成服务端口(可选 默认值3002)
```

> `ALLOW_UNSAFE_CONTEXT` 默认值为 0，表示不允许在非安全上下文中访问。但在容器等特定运行环境中，建议将其设置为
> 1，以让合成服务器能访问到模板资源。
>
> 即便启用了非安全上下文访问，合成服务器也会在每个任务初始化前对 `SERVER_HOST` 的合法性进行校验。

#### web_app

```bash
# 
cd /web_app
# 安装依赖
yarn
# 编译web_app代码
yarn build
# 
cd /dist
# (将dist目录下所有文件及文件夹拷贝或移动到你的http服务器(例如：nginx)目录)
```    

#### nginx配置文件参考

```nginx.conf

server {
    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        client_max_body_size 100M;
        proxy_pass http://server_app:3000/;

    }

    location /connect {
        proxy_pass http://server_app:3000/connect/;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

```

</details>

---

#### 😓 Linux 下字体缺失导致无法正常渲染的问题？

在一些 Linux 系统中，可能缺失一些字体，导致无法渲染，出现乱码或者方框乱码。

##### 中文显示问题

如果您的操作系统缺少中文字体，建议使用 **文泉驿微米黑（WenQuanYi Micro Hei）**。这是由文泉驿项目发布的开源中文字体套件，适用于大多数中文界面的渲染需求。

- 如果您使用容器，它会在容器构建时自动安装，用作为中文文字渲染。
- 对于其他 Linux 系统环境，可通过安装 `fonts-wqy-microhei` 软件包来解决中文字体缺失问题。

```bash
# Debian/Ubuntu：
sudo apt install fonts-wqy-microhei
```

##### 韩文显示问题

若您的操作系统缺少韩文字体，可安装 **`fonts-unfonts-core`**。该字体套件由大韩民国政府发布，是免费的基础韩文字体集，可用于解决韩语显示异常的问题。

```bash
# Debian/Ubuntu：
sudo apt install fonts-unfonts-core
```

目前以上语言已验证可用，其他语言尚未进行全面测试。如果您在使用过程中遇到其他语言的字符无法正常渲染的问题，建议尝试安装相应的语言字体包。

---

#### 项目合成服务依赖`Puppeteer`、`Chrome`等组件，如果您遇到了以下错误，请参考解决方案⬇️。

<details>
<summary>libnss3.so</summary>

###### 核心问题：

`error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libnss3 # Ubuntu / Debian
```

</details>

---

<details>
<summary>libgobject-2.0.so.0</summary>

###### 核心问题：

`error while loading shared libraries: libgobject-2.0.so.0: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libglib2.0-0 # Ubuntu / Debian
sudo yum install nss # CentOS / Red Hat
```

</details>

---

<details>
<summary>libatk-1.0.so.0</summary>

###### 核心问题：

`error while loading shared libraries: libatk-1.0.so.0: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libatk1.0-0 # Ubuntu / Debian

sudo yum install atk # CentOS / Red Hat
```

</details>

---

<details>
<summary>libatk-bridge-2.0.so.0</summary>

###### 核心问题：

`error while loading shared libraries: libatk-bridge-2.0.so.0: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libatk-bridge2.0-0 # Ubuntu / Debian

sudo yum install at-spi2-atk # CentOS / Red Hat
```

</details>

---

<details>
<summary>libcups.so.2</summary>

###### 核心问题：

`error while loading shared libraries: libcups.so.2: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libcups2 # Ubuntu / Debian

sudo yum install cups-libs # CentOS / Red Hat
```

</details>

---

<details>
<summary>libdrm.so.2</summary>

###### 核心问题：

`error while loading shared libraries: libdrm.so.2: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libdrm2 # Ubuntu / Debian

sudo yum install libdrm # CentOS / Red Hat
```

</details>

---

<details>
<summary>libxkbcommon.so.0</summary>

###### 核心问题：

`error while loading shared libraries: libxkbcommon.so.0: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libxkbcommon0 # Ubuntu / Debian

sudo yum install libxkbcommonm # CentOS / Red Hat
```

</details>

---

<details>
<summary>libXcomposite.so.1</summary>

###### 核心问题：

`error while loading shared libraries: libXcomposite.so.1: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libxcomposite1 # Ubuntu / Debian

sudo yum install libXcomposite # CentOS / Red Hat
```

</details>

---

<details>
<summary>libXdamage.so.1</summary>

###### 核心问题：

`error while loading shared libraries: libXdamage.so.1: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libxdamage1 # Ubuntu / Debian

sudo yum install libXdamage # CentOS / Red Hat
```

</details>

---

<details>
<summary>libXfixes.so.3</summary>

###### 核心问题：

`error while loading shared libraries: libXfixes.so.3: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libxfixes3 # Ubuntu / Debian

sudo yum install libXfixes # CentOS / Red Hat
```

</details>

---

<details>
<summary>libXrandr.so.2</summary>

###### 核心问题：

`error while loading shared libraries: libXrandr.so.2: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libxrandr2 # Ubuntu / Debian

sudo yum install libXrandr # CentOS / Red Hat
```

</details>

---

<details>
<summary>libgbm.so.1</summary>

###### 核心问题：

`error while loading shared libraries: libgbm.so.1: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libgbm1 # Ubuntu / Debian

sudo yum install mesa-libgbm # CentOS / Red Hat
```

</details>

---

<details>
<summary>libpango-1.0.so.0</summary>

###### 核心问题：

`error while loading shared libraries: libpango-1.0.so.0: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libpango-1.0-0 # Ubuntu / Debian

sudo yum install pango # CentOS / Red Hat
```

</details>

---

<details>
<summary>libcairo.so.2</summary>

###### 核心问题：

`error while loading shared libraries: libcairo.so.2: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libcairo2 # Ubuntu / Debian

sudo yum install cairo # CentOS / Red Hat
```

</details>

---

<details>
<summary>libasound.so.2</summary>

###### 核心问题：

`error while loading shared libraries: libasound.so.2: cannot open shared object file: No such file or directory`

###### 解决方式

```bash
sudo apt install libasound2 # Ubuntu / Debian

sudo yum install alsa-lib # CentOS / Red Hat
```

</details>

---

## 😱 注意事项

1. 不建议对外暴露合成服务器端口
2. 主服务和合成服务器必须运行在同一台服务器上
3. 使用期间产生的文件，请不要手动删除

---

## 🤣 版本管理

### 概述

lmo-dv的版本号由`主版本号.小版本号.修订号`组成，例如：`3.0.0`。项目为了保持历史记录，而在同一个仓库创建新的分支，并在此分支基础上进行新版本的开发。
其中`1.*`、`2.*`已经停止维护。目前最新迭代版本为`3.*`。

### 分支结构

- main

`main`分支为最新迭代版本，由`newVer` 或者 `dev-v*`分支合并而来。

- v2

`v2`分支为`2.0`版本相关代码“备份”。

- v1

`v1`分支为`1.0`版本相关代码“备份”。

### tags

每一个tag代表一个版本，例如：`v3.0.0`。并且该tag在发布时会有对应的说明。

---

## 😉 开源相关

本项目所有源代码基于 [Apache-2.0](https://github.com/ayuanlmo/lmo-data-visualization/blob/master/LICENSE)
许可证发布。您可以在[GitHub](https://github.com/ayuanlmo/lmo-data-visualization)查看此项目。

![Github Star](https://img.shields.io/github/stars/ayuanlmo/lmo-data-visualization?logo=github)
![Github Star](https://img.shields.io/github/forks/ayuanlmo/lmo-data-visualization?logo=github)

---

## 🫡 特别感谢

由衷的感谢 [JetBrains](https://www.jetbrains.com/)
团队为此项目提供了免费的 [开发许可证](https://www.jetbrains.com/community/opensource/)。

![JetBrainsLogo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)
