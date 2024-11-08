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

[[English](./README_EN.md)] [[简体中文](./README.md)]

## 介紹

`lmo-DataVisualization`（以下簡稱`“lmo-dv”` 或 `“dv”`），是一款開源可視化數據製作工具。使用內建模板，將各種業務數據轉換為視頻動畫，使數據更加形象、生動。
同時提供了SDK，可以根據需求編寫不同的模板以滿足業務需求。

這是lmo-dv的第3個大版本，該版本完全重新設計、重做。因此與舊版本不相容。

## 執行示意圖

![](https://cdn.ayuanlmo.cn/img/uploads/public/1f948867-05eb-454b-ae0c-1cea5b2979f9.png!/fw/520)

### 相比之前的版本，有什麼區別？

- 基於`React.js` + `TypeScript`
- 內置`ffmpeg`
- 內置`sqlite`數據庫
- 交互式的設計器
- 重新設計的界面、模板、素材庫、資源庫。（之前版本交互非常不友好）
- CSS動畫錄製支持
- GIF錄製支持
- 新的模板SDK

## 內置功能

- 數據相關
    - 數據編輯：提供類似Excel的表格功能，支持導入數據
- 主題相關
    - 模板高度定制化
    - 文字動畫
    - 背景圖
- 音頻、視頻相關
    - 自定義音頻（支持完整音頻）
    - 音量控制
    - 高碼率視頻
    - 最高4K清晰度
- 模板
    - 模板“SDK”：提供模板開發接口，可以根據業務自定義模板
    - 創建自定義模板

## 部署方式

### 源碼部署

#### 克隆代碼

```bash
# 克隆代碼
git clone https://github.com/ayuanlmo/lmo-data-visualization.git
```

#### 服務器主程序

```bash
cd /lmo-data-visualization
# 
cd /server
# 安裝依賴
yarn
# 編譯主服務端代碼
yarn prod
# 啟動主服務端
pm2 start ./dist/main.js
```

#### 合成服務器

```bash
# 
cd /service
# 安裝依賴
yarn
# 編譯合成服務端代碼
yarn c
# 啟動合成服務
pm2 start ./dist/main.js
```

#### 前端

```bash
# 
cd /web_app
# 安裝依賴
yarn
# 編譯前端代碼
yarn build
# 
cd /dist
# （將dist目錄下所有文件及文件夾拷貝或移動到你的HTTP服務器（例如：Nginx）目錄）
```    

#### Nginx配置文件參考

```config

location /api/ {
    proxy_pass http://127.0.0.1:3000/;
}

location /connect {
    proxy_pass http://127.0.0.1:3000/connect/;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
}
```

#### 注意事項

1. 不建議對外暴露合成服務器端口
2. 主服務和合成服務器必須運行在同一台服務器上
3. 使用期間產生的文件，請不要手動刪除

## 數據庫配置

服務器程序支持兩種數據庫，分別是：`sqlite` 、`Microsoft SQL Server®`（以下簡稱`mssql`）

默認使用`sqlite`作為程序默認數據庫，如果您想使用mssql，請配置如下啟動參數：

- -dbType mssql
- -dbHost {您的主機}
- -dbPort {您的端口}
- -dbName lmo-dv
- -dbUserName {您的用戶名}
- -dbPassWord {您的密碼}

使用mssql，您需要先初始化數據庫，請將數據庫名稱設置為：`lmo-dv`，或者使用`/server/sql`目錄下的SQL文件進行初始化，建議您使用
`SQL Server Management Studio®`（`SSMS`）運行SQL文件。

## 版本管理

### 概述

lmo-dv的版本號由`主版本號.次版本號.修訂號`組成，例如：`3.0.0`。項目為了保持歷史記錄，而在同一個倉庫創建新的分支，並在此分支基礎上進行新版本的開發。
其中`1.*`、`2.*`已經停止維護。目前最新迭代版本為`3.*`。

### 分支結構

- main

`main`分支為最新迭代版本，由`newVer` 或者 `dev-v*`分支合併而來。

- v2

`v2`分支為`2.0`版本相關代碼“備份”。

- v1

`v1`分支為`1.0`版本相關代碼“備份”。

### tags

每一個tag代表一個版本，例如：`v3.0.0`。並且該tag在發布時會有對應的說明。

## 開源相關

本項目所有源代碼基於 [Apache-2.0](https://github.com/ayuanlmo/lmo-data-visualization/blob/master/LICENSE) 協議開源。

本項目使用的其他庫，請遵循其協議。

[GitHub](https://github.com/ayuanlmo/lmo-data-visualization)
[Github Star](https://img.shields.io/github/stars/ayuanlmo/lmo-data-visualization?logo=github)
[Github Fork](https://img.shields.io/github/forks/ayuanlmo/lmo-data-visualization?logo=github)

## 特別感謝

衷心感謝 [JetBrains](https://www.jetbrains.com/)
團隊為此項目提供了免費的 [開發許可證](https://www.jetbrains.com/community/opensource/)。
