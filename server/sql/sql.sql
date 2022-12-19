/*
 Source Server         : Local
 Source Server Type    : MySQL
 Source Server Version : 100425
 Source Host           : localhost:3306
 Source Schema         : lmo-dv

 Target Server Type    : MySQL
 Target Server Version : 100425
 File Encoding         : 65001

 This script was created using JetBrains 'DataGrip' by ayuanlmo in 2022

 Date: 04/12/2022 19:24:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for y_log
-- ----------------------------
DROP TABLE IF EXISTS `y_log`;
CREATE TABLE `y_log`  (
  `id` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ID',
  `file_path` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '日志文件路径',
  `log_temp_file_path` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL COMMENT '临时文件路径'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for y_resource
-- ----------------------------
DROP TABLE IF EXISTS `y_resource`;
CREATE TABLE `y_resource`  (
  `name` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '名称',
  `path` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '路径',
  `create_at` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '创建时间',
  `status` varchar(28) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '状态',
  `id` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for y_template
-- ----------------------------
DROP TABLE IF EXISTS `y_template`;
CREATE TABLE `y_template`  (
  `name` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '模板名称',
  `id` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '模板ID',
  `title` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '模板名称',
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '模板介绍',
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '路径',
  `type` varchar(28) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '类型'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
