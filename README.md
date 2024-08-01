<center>
    <img width="200px" src="web_app/public/logo.svg">
</center>

<center>
<h1>lmo-DataVisualization</h1>
</center>

## 介绍

`lmo-DataVisualization`（以下简称`“lmo-dv”` 或 `“dv”`），一款开源可视化数据制作工具。 使用内置模板，将各种业务数据转换为视频动画，使数据更加形象、生动。
同时提供了sdk，可以根据需求编写不同的模板以满足业务需求。

这是lmo-dv的第3个大版本，该版本完全重新设计、重做。因此与旧版本不兼容。

### 相比之前的版本，有什么区别？

- 基于`React.js` + `TypeScript`
- 内置`ffmpeg`
- 内置`sqlite`数据库
- 交互式的设计器
- 重新设计的界面、模板、素材库、资源库。（之前版本交互非常不友好）
- css动画录制支持
- gif录制支持
- 新的模板sdk

## 内置功能

- 数据相关
    - 数据编编辑：提供类似Excel的表格功能，支持导入数据
- 主题相关
    - 模板高度定制化
    - 文字动画
    - 背景图
- 音频、视频相关
    - 自定义音频（支持完整音频）
    - 音量控制
    - 高码率视频
    - 最高4K清晰度
- 模板
    - 模板“sdk”：提供模板开发接口，可以根据业务自定义模板
    - 创建自定义模板

## 部署方式

### 源码部署

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

#### 前端

```bash
# 
cd /web_app
# 安装依赖
yarn
# 编译前端代码
yarn build
# 
cd /dist
# (将dist目录下所有文件及文件夹拷贝或移动到你的http服务器(例如：nginx)目录)
```    

#### nginx配置文件参考

```config

location /api/{
    proxy_pass http://127.0.0.1:3000/;
}

location /connect{
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

#### 注意事项

1. 不建议对外暴露合成服务器端口
2. 主服务和合成服务器必须运行在同一台服务器上
3. 使用期间产生的文件，请不要手动删除

## 开源相关

本项目所有源代码基于 [Apache-2.0](https://github.com/ayuanlmo/lmo-data-visualization/blob/master/LICENSE)协议开源。

本项目使用的其他库，请遵循其协议。

[GitHub](https://github.com/ayuanlmo/lmo-data-visualization)
![Github Star](https://img.shields.io/github/stars/ayuanlmo/lmo-data-visualization?logo=github)
![Github Star](https://img.shields.io/github/forks/ayuanlmo/lmo-data-visualization?logo=github)

## 特别感谢

由衷的感谢 [JetBrains](https://www.jetbrains.com/)
团队为此项目提供了免费的 [开发许可证](https://www.jetbrains.com/community/opensource/)。

![JetBrainsLogo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)
