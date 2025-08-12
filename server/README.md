<div align="center">
    <img width="200px" src="../web_app/public/logo.svg">
</div>

<div align="center">
    <h1>lmo-DataVisualization</h1>
</div>

## 👋 介绍

这是 `🌐lmo-DataVisualization`的服务器实现，它主要使用 Express + sqlite3 构建。

本项目开发环境运行在 **Node.js v18.20.4+** 版本之上，使用 **WSL (Windows Subsystem for Linux)** 开发。

---

## 🚀 快速开始

在开始开发或部署之前，请确保您的开发环境已正确配置。参考web_app下的[README](../web_app/README.md)。

#### 2. 安装依赖

```bash
yarn install
```

#### 3. 启动开发服务器

```bash
yarn start
```

---

## 📄 环境变量一览

| 变量名称                           | 描述                    | 默认值         |
|--------------------------------|-----------------------|-------------|
| `PORT`                         | 服务器端口                 | 3000        |
| `DATA_BASE_TYPE`               | 数据库类型(sqlite、mssql可选) | sqlite      |
| `DATA_BASE_NAME`               | 数据库名称                 | *           |
| `DATA_BASE_USER_NAME`          | 数据库用户名                | *           |
| `DATA_BASE_PASSWORD`           | 数据库密码                 | *           |
| `DATA_BASE_HOST`               | 数据库地址                 | *           |
| `SERVICE_PORT`                 | 合成服务器地址               | /           |
| `SERVER_HOST`                  | 服务器地址                 | /           |
| `NODE_ENV`                     | 环境                    | development |
| `USE_PATCH_CAPTURE_SQL_ERRORS` | 使用补丁捕获SQL错误           | 0           |

> 📌 注：您可以不写任何的环境变量，程序将使用默认值

> 如果您使用mssql数据库，请必须配置`DATA_BASE_TYPE=mssql`，以及`DATA_BASE_`其他相关变量。

> `SERVER_HOST`是服务器程序的地址，在开发环境它默认`localhost`，如果您在容器环境运行，您需要指定它的地址，以确保合成服务能访问到它。

> `SERVICE_PORT`是合成服务器的地址，在开发环境它默认`localhost`，如果您在容器环境运行，您需要指定它的地址，以确保服务器程序能访问到他。

> `USE_PATCH_CAPTURE_SQL_ERRORS` 默认为0不开启，设置为1时开启，将使用补丁捕获SQL错误，并记录到日志中。
>
> 注意，它是一个"猴子补丁"方案，如果遇到程序异常，请关闭它。

