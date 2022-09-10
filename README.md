<p align="center">
	<img alt="logo" src="https://cdn.ayuanlmo.cn/lmo_loso_r.png">
</p>
<p align="center">
	Hi, there👋
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;color:#409fee;">lmo-DataVisualization</h1>
<p align="center">
    <img src="https://img.shields.io/badge/License-Apache2.0 -blue.svg" alt="TypeScript">
</p>
<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-4.7.4 -blue.svg" alt="TypeScript">
    <img src="https://img.shields.io/badge/ApacheEcharts-5.0 -blue.svg" alt="ApacheEcharts">
    <img src="https://img.shields.io/badge/timecut-0.3.3 -blue.svg" alt="timecut">
    <img src="https://img.shields.io/badge/fluent_ffmpeg-2.1.2 -blue.svg" alt="fluent-ffmpeg">
    <img src="https://img.shields.io/badge/fs_extra-10.1.0 -blue.svg" alt="fs-extra">
    <img src="https://img.shields.io/badge/net-1.0.2 -blue.svg" alt="net">
    <img src="https://img.shields.io/badge/sqlite3-5.0.8 -blue.svg" alt="sqlite3">
    <img src="https://img.shields.io/badge/Express-4.18.1 -blue.svg" alt="express">
    <img src="https://img.shields.io/badge/Express_ws-5.0.2 -blue.svg" alt="express_ws">
    <img src="https://img.shields.io/badge/D3.js-5.16.0 -blue.svg" alt="D3.js">
    <img src="https://img.shields.io/badge/Animate.css-3.5.1 -green.svg" alt="Animate.css">
    <img src="https://img.shields.io/badge/Nprogress-0.2.0 -green.svg" alt="Nprogress">
    <img src="https://img.shields.io/badge/vue_json_views-1.3.0 -green.svg" alt="vue_json_views">
    <img src="https://img.shields.io/badge/Vue-2.6.11 -green.svg" alt="Vue">
    <img src="https://img.shields.io/badge/axios-0.25.0 -green.svg" alt="axios">
    <img src="https://img.shields.io/badge/Vue_Router-3.2.0 -green.svg" alt="vue_router">
    <img src="https://img.shields.io/badge/Vuex-3.4.0 -green.svg" alt="Vuex">
    <img src="https://img.shields.io/badge/lmo_storage-1.0.3 -green.svg" alt="lmo_storage">
</p>

---

[简体中文](./README.md) | [繁體中文](./README-ZH_TW.md)

## 介绍

lmo-DataVisualization，一款开源可视化数据制作工具。 根据提供的模板，将各种业务数据转换为视频动画，使数据更加形象、生动。

## 内置功能

1. 数据相关
    - 支持手动编辑数据
    - 上传本地数据
    - 可导出模板示例数据
2. 文字 / 主题相关
    - 支持配置标题信息、颜色
    - 配置图表主题颜色
    - 背景颜色
    - 标题动画
    - 背景图片
3. 音频 / 时间相关
    - 背景音乐
    - 设置音量大小
4. 合成相关
    - 合成帧率设置
    - 视频清晰度配置(最高支持4K)
    - 动画时间配置
5. 其他
    - 保存为自定义模板

PS：不同的模板配置项可能有些差别，这是根据模板内部提供给编辑器的选项进行的。

*注 ： 由于合成服务无法模拟Animate.css提供的动画，后续将会采用纯JavaScript进行对Animate.css动画的模拟。

## 模板制作

我们为开发者提供了一些API，以简单、快速开发出适用的模板。请参阅 [开发模板.md](./doc/开发模板.md)

## 在线体验

- 演示服务器关闭了合成服务、文件上传服务

[演示地址](https://dv.ayuanlmo.cn)

## 开发

项目服务端文件在/server目录下。 合成需要ffmpeg支持，[点击这里下载](https://ffmpeg.org/download.html)</a>
(请确保 ffmpeg 支持H.264视频压缩标准)

```bash
#clone
git clone https://github.com/ayuanlmo/lmo-data-visualization
#安装模块
yarn
#启动项目
yarn serve
#进入服务端目录
cd server/
#安装服务端模块
yarn
#运行服务端
yarn start-server
```

## 发布

```bash
#打包前端
yarn build
#注意部署后 请配置前端的WebSocket 和 API接口的反向代理
#WebSocket默认为：/connectSocket
#API接口默认为：/server
#如果你需要修改以上配置 请到/config/DevProxy.js修改配置
```

## nginx配置參考

```text
location /server/{
    proxy_pass http://127.0.0.1:3000/;
}

location /connectSocket{
    proxy_pass http://127.0.0.1:3000/ws/connect/;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection $connection_upgrade;
}
```

## 其他

```bash
  yarn lint
```

## 开源相关

本项目所有源代码基于 [Apache-2.0](https://gitee.com/ayuanlmo/lmo-data-visualization/blob/master/LICENSE)协议开源。

本项目所使用的第三方库，请遵循该库的开源协议标准。

[GitHub](https://github.com/ayuanlmo/lmo-data-visualization)

![Github Star](https://img.shields.io/github/stars/ayuanlmo/lmo-data-visualization?logo=github)
![Github Star](https://img.shields.io/github/forks/ayuanlmo/lmo-data-visualization?logo=github)

---

## 有问题吗？

可通过[YouTrack](https://ayuanlmo.youtrack.cloud/)向我们提问，或者您可以发送issues

## 感谢贡献

- 糖兮兮
- 游游
- YC SEMI
- Yc Core

---

## 特别感谢

感谢 [JetBrains](https://www.jetbrains.com/)
为此项目提供了免费的 [开发许可证](https://www.jetbrains.com/community/opensource/)

![JetBrainsLogo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)
![DataGrip logo](https://resources.jetbrains.com.cn/storage/products/company/brand/logos/DataGrip_icon.svg)
![WebStorm logo](https://resources.jetbrains.com.cn/storage/products/company/brand/logos/WebStorm_icon.svg)
![YouTrack logo](https://resources.jetbrains.com.cn/storage/products/company/brand/logos/YouTrack_icon.svg)
---

本文档遵循[知识共享许可协议CC 4.0](https://creativecommons.org/licenses/by/4.0/) (http://creativecommons.org/Licenses/by/4.0/)
。
