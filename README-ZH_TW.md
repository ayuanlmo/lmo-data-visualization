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

[簡體中文](./README.md) | [繁體中文](./README-ZH_TW.md)

## 介绍

lmo-DataVisualization，一款開源可視化數據製作工具。根據提供的範本，將各種業務數據轉換為視頻動畫，使數據更加形象、生動。

## 内置功能

1. 數據相關
    - 支援手動編輯數據
    - 支援上傳本地檔
    - 支援可匯出範本示例檔
2. 文字 / 主題相關
    - 支援配置標題訊息、顏色
    - 支援圖表主題顏色
    - 背景顏色
    - 標題動畫
    - 背景圖片
3. 音訊 / 時間相關
    - 背景音樂
    - 設定音量大小
4. 合成相關
    - 視訊帧率設定
    - 視訊清晰度設定(最高支援4K)
    - 視訊時間配置

PS：不同的範本配置項可能有些差別，這是根據範本內部提供給編輯器的選項進行的。

*注 ：由於合成服務無法類比Animate.css提供的動畫，後續將會採用純JavaScript進行對Animate.css動畫的類比。

## 範本製作

我們為開發者提供了一些API，以簡單、快速開發出適用的範本。 請參閱 [开发模板.md](./doc/开发模板.md)

## 在线体验

- 演示伺服器關閉了合成、檔上傳

[演示位址](https://dv.ayuanlmo.cn)

## 演示圖

<table>
    <tr>
        <td>範本页</td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo4.png"/></td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo7.png"/></td>
    </tr>
    <tr>
        <td>設計器</td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo3.png"/></td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo8.png"/></td>
    </tr>
    <tr>
        <td>播放器</td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo1.png"/></td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo2.png"/></td>
    </tr>
	<tr>
        <td>檔案庫 / 日誌</td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo10.png"/></td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo5.png"/></td>
    </tr>	 
    <tr>
        <td>預覽 / 媒體檔案選擇</td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo9.png"/></td>
        <td><img src="https://cdn.ayuanlmo.cn/lmo-public/Visualization/lmo11.png"/></td>
    </tr>
</table>

## 開發

專案伺服器檔在/server下。 合成需要ffmpeg支援，[點擊這裡下載](https://ffmpeg.org/download.html)</a>
（請確保 ffmpeg 支援H.264視訊壓縮標準）

```bash
git clone https://github.com/ayuanlmo/lmo-data-visualization

yarn

yarn serve

cd serve/

yarn

yarn start-server
```

## 發佈

```bash
yarn build
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

## 開源相關

本專案所有原始程式碼基於 [Apache-2.0](https://gitee.com/ayuanlmo/lmo-data-visualization/blob/master/LICENSE)協定開源。

本專案所使用的第三方庫，請遵循該庫的開源協定。

[GitHub](https://github.com/ayuanlmo/lmo-data-visualization)

![Github Star](https://img.shields.io/github/stars/ayuanlmo/lmo-data-visualization?logo=github)
![Github Star](https://img.shields.io/github/forks/ayuanlmo/lmo-data-visualization?logo=github)

---

## 有問題嗎？

可透過[YouTrack](https://ayuanlmo.youtrack.cloud/)向我們提出問題，或者發送issues

## 感谢為此專案貢獻

- 糖兮兮
- 游游
- YC SEMI
- Yc Core

---

## 特别感谢

感谢 [JetBrains](https://www.jetbrains.com/) 為此專案提供了免費的 [開發許可證](https://www.jetbrains.com/community/opensource/)

![JetBrainsLogo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)
![DataGrip logo](https://resources.jetbrains.com.cn/storage/products/company/brand/logos/DataGrip_icon.svg)
![WebStorm logo](https://resources.jetbrains.com.cn/storage/products/company/brand/logos/WebStorm_icon.svg)
![YouTrack logo](https://resources.jetbrains.com.cn/storage/products/company/brand/logos/YouTrack_icon.svg)
---

本文檔遵循[知識共用許可協定CC 4.0](https://creativecommons.org/licenses/by/4.0/) (http://creativecommons.org/Licenses/by/4.0/)。
