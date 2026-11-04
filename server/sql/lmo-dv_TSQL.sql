/**
	@author ayuanlmo
	@date 2024/10
**/

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'lmo-dv')
	BEGIN
		CREATE DATABASE [lmo-dv];
	END;

USE [lmo-dv];
GO

-- lmo_Color表
SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[lmo_Colors]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[lmo_Colors](
			[id] [nvarchar](36) NOT NULL,
			[value] [nvarchar](255) NULL,
			[cssCode] [nvarchar](255) NULL,
			[type] [nvarchar](255) NULL,
		PRIMARY KEY CLUSTERED ([id] ASC)
		WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY])
		ON [PRIMARY]
	END;
GO

-- lmo_Resources表
SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[lmo_Resources]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[lmo_Resources](
			[id] [nvarchar](36) NOT NULL,
			[name] [nvarchar](255) NULL,
			[template] [nvarchar](255) NULL,
			[filePath] [nvarchar](255) NULL,
			-- createTime 数值化，避免按字典序排序（'9' > '10'）
			[createTime] [bigint] NULL,
			[templatePath] [nvarchar](255) NULL,
			[url] [nvarchar](255) NULL,
			[gifPath] [nvarchar](255) NULL,
			[videoCover] [nvarchar](255) NULL,
			[clarity] [nvarchar](255) NULL,
			[status] [nvarchar](255) NULL,
			-- taskConfig 为大 JSON，NVARCHAR(255) 会截断/报错 → NVARCHAR(MAX)（对齐模型 TEXT）
			[taskConfig] [nvarchar](MAX) NULL,
			PRIMARY KEY CLUSTERED ([id]ASC)
			WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF)
			ON[PRIMARY]) ON [PRIMARY];
	END;
GO

-- lmo_Templates表
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[lmo_Templates]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[lmo_Templates](
			[id] [nvarchar](36) NOT NULL,
			[name] [nvarchar](255) NULL,
			[description] [nvarchar](255) NULL,
			[path] [nvarchar](255) NULL,
			[cover] [nvarchar](255) NULL,
			[gifCover] [nvarchar](255) NULL,
			-- createTime 数值化
			[createTime] [bigint] NULL,
			[type] [int] NULL,
			[index] [int] NULL,
			[dsp] [int] NOT NULL,
			PRIMARY KEY CLUSTERED ([id] ASC)
			WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY])
			ON [PRIMARY]
	END;
GO

-- lmo_UpLoadFiles表
SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[lmo_UpLoadFiles]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[lmo_UpLoadFiles](
			[id] [nvarchar](36) NOT NULL,
			[name] [nvarchar](255) NULL,
			[path] [nvarchar](255) NULL,
			[cover] [nvarchar](255) NULL,
			-- createTime 数值化
			[createTime] [bigint] NULL,
			[type] [nvarchar](255) NULL,
			[hash] [nvarchar](255) NULL,
			[categoryId] [nvarchar](36) NULL,
			PRIMARY KEY CLUSTERED ([id] ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY])
			ON [PRIMARY]
	END;
GO

-- lmo_UpLoadFilesCategories表
SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[lmo_UpLoadFilesCategories]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[lmo_UpLoadFilesCategories](
			[id] [nvarchar](36) NOT NULL,
			[name] [nvarchar](255) NULL,
			[parentId] [nvarchar](36) NULL,
			PRIMARY KEY CLUSTERED ([id] ASC)
			WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY])
			ON [PRIMARY]
	END;
GO

-- 键

ALTER TABLE [dbo].[lmo_Templates] ADD  DEFAULT ((0)) FOR [index]
GO

ALTER TABLE [dbo].[lmo_Templates] ADD  DEFAULT ((1)) FOR [dsp]
GO

ALTER TABLE [dbo].[lmo_UpLoadFiles]  WITH CHECK ADD FOREIGN KEY([categoryId])
REFERENCES [dbo].[lmo_UpLoadFilesCategories] ([id])
ON DELETE SET NULL
GO
ALTER TABLE [dbo].[lmo_UpLoadFilesCategories]  WITH CHECK ADD FOREIGN KEY([parentId])
REFERENCES [dbo].[lmo_UpLoadFilesCategories] ([id])
GO

-- 高频过滤/排序列索引（对齐 Sequelize 模型 define 的 indexes）
CREATE NONCLUSTERED INDEX [IX_lmo_Templates_name] ON [dbo].[lmo_Templates] ([name]);
GO
CREATE NONCLUSTERED INDEX [IX_lmo_Templates_type] ON [dbo].[lmo_Templates] ([type]);
GO
CREATE NONCLUSTERED INDEX [IX_lmo_Templates_createTime] ON [dbo].[lmo_Templates] ([createTime]);
GO
CREATE NONCLUSTERED INDEX [IX_lmo_Resources_status] ON [dbo].[lmo_Resources] ([status]);
GO
CREATE NONCLUSTERED INDEX [IX_lmo_Resources_createTime] ON [dbo].[lmo_Resources] ([createTime]);
GO
CREATE UNIQUE NONCLUSTERED INDEX [UX_lmo_UpLoadFiles_hash] ON [dbo].[lmo_UpLoadFiles] ([hash]);
GO
CREATE NONCLUSTERED INDEX [IX_lmo_UpLoadFiles_createTime] ON [dbo].[lmo_UpLoadFiles] ([createTime]);
GO
