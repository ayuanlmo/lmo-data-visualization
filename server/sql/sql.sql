/*
 Source Server         : lmo-DV
 Source Server Type    : SQLite
 Source Server Version : 3021000
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3021000
 File Encoding         : 65001

 Date: 13/06/2022 21:21:50
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for Resource
-- ----------------------------
DROP TABLE IF EXISTS "Resource";
CREATE TABLE "Resource" (
  "T_Nane" TEXT(128) NOT NULL,
  "T_Path" TEXT(128) NOT NULL,
  "T_Create_Time" text(128) NOT NULL,
  "T_Conf" TEXT(256) NOT NULL
);

-- ----------------------------
-- Table structure for Template
-- ----------------------------
DROP TABLE IF EXISTS "Template";
CREATE TABLE "Template" (
  "T_Name" text(128) NOT NULL,
  "T_Id" text(128) NOT NULL,
  "T_Title" TEXT(128) NOT NULL,
  "T_Description" TEXT(255) NOT NULL,
  "T_Path" TEXT(255) NOT NULL,
  "T_Type" TEXT(12) NOT NULL
);

-- ----------------------------
-- Table structure for sqlite_sequence
-- ----------------------------
DROP TABLE IF EXISTS "sqlite_sequence";
CREATE TABLE "sqlite_sequence" (
  "name",
  "seq"
);

PRAGMA foreign_keys = true;
