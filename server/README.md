<p align="center">
	<img alt="logo" src="https://cdn.ayuanlmo.cn/lmo_loso_r.png">
</p>
<p align="center">
	Hi, there👋
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;color:#409fee;">lmo-DataVisualization</h1>

<p align="center">
    <img src="https://shields.io/badge/Typescript-green?logo=typescript" alt="Typescript" />
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
</p>

## 介绍

这是与 <a href="https://github.com/ayuanlmo/lmo-data-visualization">lmo-Data-Visualization</a>配套的服务端。

## 开始

*合成需要ffmpeg支持，<a href="https://ffmpeg.org/download.html">点击这里下载</a>

服务端默认启动端口为：[3000] 如果该端口被占用，会进行自增操作，直到该端口未被占用。

```bash
#安装模块
yanr
#启动
yarn start-server
#Windows系统下,可以直接运行[start.bat]会自动安装模块并启动。
```

## API接口文档

| API               |        类型 |   请求方式    |  返回  |     备注      |
|:------------------|----------:|:---------:|:----:|:-----------:|
| /api/getMedia/    |       API |   POST    | JSON |   获取合成结果    |
| /api/getTemplate/ |       API |   POST    | JSON |   获取模板信息    |
| /ws/connect       | WebSocket | WebSocket |  -   | 创建合成任务、日志推送 |

## 返回示例

### 获取模板信息

```json
{
    "data": {
        "list": [
            {
                "id": "模板ID",
                "url": "模板路径",
                "cover": "模板预览图",
                "template": "模板路径名称",
                "title": "模板名称",
                "description": "模板介绍"
            }
        ]
    },
    "message": "success",
    "code": 200,
    "_t": 1653936463980
}
```

### 获取合成结果

```json
{
    "data": {
        "list": [
            {
                "name": "视频名称.mp4",
                "path": "视频路径"
            }
        ]
    },
    "message": "success",
    "code": 200,
    "_t": 1653936653266
}
```

### WebSocket

```javascript
/**
 * 心跳规则
 * 客户端发送：ping
 * 服务器返回 pong 完成一次心跳
 *
 * 如果需要调用服务端任务请求格式为
 * **/

//生成数据
const data = {
            cmd: '需要执行的命令',//例如合成: 'synthesis'
            data: {
                //该命令传递的数据
            }
        };
//推送给服务器
WebSocket.send(JSON.stringify(data));
```

- 糖兮兮
- YC SEMI
- Yc Core

---
本文档遵循[知识共享许可协议CC 4.0](https://creativecommons.org/licenses/by/4.0/) (http://creativecommons.org/Licenses/by/4.0/)。