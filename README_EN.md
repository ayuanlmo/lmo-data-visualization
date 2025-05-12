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

[[简体中文](./README.md)] [[繁體中文](./README_TW.md)]

## Introduction

`lmo-DataVisualization` (hereinafter referred to as `“lmo-dv”` or `“dv”`), is an open-source data visualization tool
that transforms various business data into video animations using built-in templates, making the data more vivid and
engaging. It also provides an SDK for developing different templates according to specific needs.

This is the 3rd major version of lmo-dv, which has been completely redesigned and rebuilt, and therefore is not
compatible with previous versions.

## Schematic Diagram of Operation

![](https://cdn.ayuanlmo.cn/img/uploads/public/1f948867-05eb-454b-ae0c-1cea5b2979f9.png!/fw/520)

### What's Different from Previous Versions?

- Based on `React.js` + `TypeScript`
- Built-in `ffmpeg`
- Built-in `sqlite` database
- Interactive designer
- Redesigned interface, templates, material library, and resource library (the previous version was very
  user-unfriendly)
- CSS animation recording support
- GIF recording support
- New template SDK

## Built-in Features

- Data-related
    - Data editing: Provides spreadsheet functionality similar to Excel, supports data import
- Theme-related
    - Highly customizable templates
    - Text animation
    - Background images
- Audio and Video-related
    - Custom audio (supports full-length audio)
    - Volume control
    - High-bitrate video
    - Up to 4K resolution
- Templates
    - Template "SDK": Offers a template development API for customizing templates based on business requirements
    - Create custom templates

## Deployment Methods

### Source Code Deployment

#### Clone the Code

```bash
# clone code
git clone https://github.com/ayuanlmo/lmo-data-visualization.git
```

#### Main Server Program

```bash
cd /lmo-data-visualization
# 
cd /server
# Install dependencies
yarn
# Compile main server-side code
yarn prod
# Start the main server
pm2 start ./dist/main.js
```

#### Synthesis Server

```bash
# 
cd /service
# Install dependencies
yarn
# Compile synthesis server-side code
yarn c
# Start the synthesis service
pm2 start ./dist/main.js
```

#### Frontend

```bash
# 
cd /web_app
# Install dependencies
yarn
# Compile frontend code
yarn build
# 
cd /dist
# (Copy or move all files and folders under the dist directory to your HTTP server (e.g., nginx) directory)
```

#### Nginx Configuration File Reference

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

#### Notes

1. It is not recommended to expose the synthesis server port externally.
2. The main service and synthesis server must run on the same server.
3. Do not manually delete the files generated during use.

## Database Configuration

The server program supports two types of databases: `sqlite` and `Microsoft SQL Server®` (hereafter referred to as
`mssql`).

`sqlite` is used by default as the program's default database. If you want to use mssql, please configure the following
startup parameters:

- -dbType mssql
- -dbHost {your host}
- -dbPort {your port}
- -dbName lmo-dv
- -dbUserName {your userName}
- -dbPassWord {your password}

To use mssql, you need to initialize the database first. Please set the database name to `lmo-dv`, or use the SQL file
in the `/server/sql` directory for initialization. It is recommended to use `SQL Server Management Studio®` (SSMS) to
run the SQL file.

## Version Management

### Overview

The version number of lmo-dv consists of `major version number.minor version number.patch number`, for example: `3.0.0`.
To maintain historical records, new branches are created in the same repository, and new versions are developed based on
these branches. The `1.*` and `2.*` series have ceased maintenance. The current latest iteration version is `3.*`.

### Branch Structure

- main

The `main` branch is the latest iteration version, merged from `newVer` or `dev-v*` branches.

- v2

The `v2` branch is a "backup" of the `2.0` version related code.

- v1

The `v1` branch is a "backup" of the `1.0` version related code.

### Tags

Each tag represents a version, such as `v3.0.0`. The tag will have corresponding release notes at the time of
publication.

## Open Source Information

All source code of this project is open-sourced under
the [Apache-2.0](https://github.com/ayuanlmo/lmo-data-visualization/blob/master/LICENSE) license.

Please follow the respective licenses for any other libraries used in this project.

[GitHub](https://github.com/ayuanlmo/lmo-data-visualization)
[Github Stars](https://img.shields.io/github/stars/ayuanlmo/lmo-data-visualization?logo=github)
[Github Forks](https://img.shields.io/github/forks/ayuanlmo/lmo-data-visualization?logo=github)

## Special Thanks

We would like to extend our sincere gratitude to the [JetBrains](https://www.jetbrains.com/) team for providing
free [development licenses](https://www.jetbrains.com/community/opensource/) for this project.

[JetBrains Logo](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)
