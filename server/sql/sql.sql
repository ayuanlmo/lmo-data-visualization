/*
 Source Server         : lmo-DV
 Source Server Type    : SQLite
 Source Server Version : 3021000
 Source Schema         : main
 Target Server Type    : SQLite
 Target Server Version : 3021000
 File Encoding         : 65001

 This script was created using JetBrains 'DataGrip' by ayuanlmo in 2022

*/

-- ----------------------------
-- 日志表
-- ----------------------------
DROP TABLE IF EXISTS "Log";
create table Log
(
    T_Resource_ID        text(128) not null, --资源ID
    T_Log_File_Path      text(256), --日志文件路径
    T_Log_Temp_File_Path text(256)  --日志临时文件路径
);

-- ----------------------------
-- 资源表
-- ----------------------------
DROP TABLE IF EXISTS "Resource";
create table Resource
(
    T_Nane      TEXT(128) not null, --名称
    T_Path      TEXT(128) not null, --路径
    T_Create_At text(128) not null, --创建时间
    T_Status    int(2)  --状态
);

-- ----------------------------
-- 模板表
-- ----------------------------
DROP TABLE IF EXISTS "Template";
create table Template
(
    T_Name        text(128) not null,   --名称
    T_Id          text(128) not null,   --模板ID
    T_Title       text(128) not null,   --模板标题
    T_Description text(255) not null,   --模板介绍
    T_Path        text(255) not null,   --模板路径
    T_Type        text(12)  not null    --模板类型
);