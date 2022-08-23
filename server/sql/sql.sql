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
    T_Resource_ID        TEXT(128) NOT NULL, --资源ID
    T_Log_File_Path      TEXT(256), --日志文件路径
    T_Log_Temp_File_Path TEXT(256)  --日志临时文件路径
);

-- ----------------------------
-- 资源表
-- ----------------------------
DROP TABLE IF EXISTS "Resource";
create table Resource
(
    T_Name      TEXT(128) NOT NULL, --名称
    T_Path      TEXT(128) NOT NULL, --路径
    T_Create_At TEXT(128) NOT NULL, --创建时间
    T_Status    TEXT(30),  --状态
    T_ID TEXT(128) NOT NULL
);

-- ----------------------------
-- 模板表
-- ----------------------------
DROP TABLE IF EXISTS "Template";
create table Template
(
    T_Name        TEXT(128) NOT NULL,   --名称
    T_Id          TEXT(128) NOT NULL,   --模板ID
    T_Title       TEXT(128) NOT NULL,   --模板标题
    T_Description TEXT(255) NOT NULL,   --模板介绍
    T_Path        TEXT(255) NOT NULL,   --模板路径
    T_Type        TEXT(12)  NOT NULL    --模板类型
);