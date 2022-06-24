<p align="center">
	<img alt="logo" src="https://cdn.ayuanlmo.cn/lmo_loso_r.png">
</p>
<p align="center">
	Hi, there👋
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;color:#409fee;">lmo-DataVisualization</h1>
<p align="center">
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

PS：不同的模板配置项可能有些差别，这是根据模板内部提供给编辑器的选项进行的。

## 主要功能完成情况

| 功能       |                 介绍 | 完成情况 |
|:---------|-------------------:|:----:|
| 合成视频     |         将模板动画转换为视频 |  完成  |
| 添加音频     |            视频动画的音频 |  完成  |
| 保存为自定义模板 |      将当前模板保存为自定义配置 | 进行中  |
| 部署文档     | 该应用程序在不同操作系统中的部署方式 | 进行中  |

## 开发

本项目服务端文件在/server目录下。 合成需要ffmpeg支持，[点击这里下载](https://ffmpeg.org/download.html)</a>
(为保证合成的视频能兼容H.264编码,建议使用GPL协议编译的ffmpeg)

Github、Gitee同步更新，如果您无法从和GitHub获取代码，请尝试从Gitee。

```bash
#clone
git clone https://github.com/ayuanlmo/lmo-data-visualization
#安装模块
yarn
#启动项目
yarn serve
#进入服务端目录
cd serve/
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
#服务端可直接cp代码 然后通过脚本运行
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

[Gitee](https://gitee.com/ayuanlmo/lmo-data-visualization)

[![Gitee Star](https://gitee.com/ayuanlmo/lmo-data-visualization/badge/star.svg?theme=dark)](https://gitee.com/ayuanlmo/lmo-data-visualization/stargazers)
[![Gitee Fork](https://gitee.com/ayuanlmo/lmo-data-visualization/badge/fork.svg?theme=dark)](https://gitee.com/ayuanlmo/lmo-data-visualization/members)

---

## 特别感谢
感谢 [JetBrains](https://www.jetbrains.com/) 为此项目提供了免费的开源[许可证](https://www.jetbrains.com/community/opensource/)

![JetBrainsLogo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)

---

## 有问题吗？
可通过[YouTrack](https://ayuanlmo.youtrack.cloud/)向我们提问，或者您可以发送issues

![YouTrack logo](https://resources.jetbrains.com.cn/storage/products/company/brand/logos/YouTrack_icon.svg)
## 感谢贡献

- 糖兮兮
- 游游
- YC SEMI
- Yc Core

---
本文档遵循[知识共享许可协议CC 4.0](https://creativecommons.org/licenses/by/4.0/) (http://creativecommons.org/Licenses/by/4.0/)。
