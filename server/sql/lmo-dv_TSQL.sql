/**
	@author ayuanlmo
	@date 2024/10
**/

DECLARE @DataBaseName CHAR(10);
SET @DataBaseName = 'lmo-dv';

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = @DataBaseName)
	BEGIN
		CREATE DATABASE [lmo-dv];
	END;

USE [lmo-dv];
GO

-- Color表
SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Colors]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[Colors](
			[id][nvarchar](255)NOT NULL,
			[value][nvarchar](255)NULL,
			[cssCode][nvarchar](255)NULL,
			[type][char](255)NULL,
			PRIMARY KEY CLUSTERED ([id]ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF)ON[PRIMARY]
		)ON[PRIMARY];
	END;
GO

-- Resources表
SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Resources]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[Resources](
			[id][nvarchar](255)NOT NULL,
			[name][nvarchar](255)NULL,
			[template][nvarchar](255)NULL,
			[filePath][nvarchar](255)NULL,
			[createTime][nvarchar](255)NULL,
			[templatePath][nvarchar](255)NULL,
			[url][nvarchar](255)NULL,
			[gifPath][nvarchar](255)NULL,
			[videoCover][nvarchar](255)NULL,
			[clarity][nvarchar](255)NULL,
			[status][nvarchar](255)NULL,
			[taskConfig][nvarchar](255)NULL,
			PRIMARY KEY CLUSTERED ([id]ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF)ON[PRIMARY]
		) ON [PRIMARY];
	END;
GO

-- Templates表
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Templates]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[Templates](
			[id][nvarchar](255)NOT NULL,
			[name][nvarchar](255)NULL,
			[description][nvarchar](255)NULL,
			[path][nvarchar](255)NULL,
			[cover][nvarchar](255)NULL,
			[gifCover][nvarchar](255)NULL,
			[createTime][nvarchar](255)NULL,
			[type][int]NULL,
			PRIMARY KEY CLUSTERED ([id]ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF)ON[PRIMARY]
		) ON [PRIMARY];
	END;
GO

-- UpLoadFiles表
SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UpLoadFiles]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[UpLoadFiles](
			[id][nvarchar](255)NOT NULL,
			[name][nvarchar](255)NULL,
			[path][nvarchar](255)NULL,
			[cover][nvarchar](255)NULL,
			[createTime][nvarchar](255)NULL,
			[type][nvarchar](255)NULL,
			[hash][nvarchar](255)NULL,
			[categoryId][nvarchar](255)NULL,
			PRIMARY KEY CLUSTERED ([id]ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF)ON[PRIMARY]
		) ON [PRIMARY];
	END;
GO

-- UpLoadFilesCategories表
SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO

IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UpLoadFilesCategories]')AND type in (N'U'))
	BEGIN
		CREATE TABLE[dbo].[UpLoadFilesCategories](
			[id][nvarchar](255)NOT NULL,
			[name][nvarchar](255)NULL,
			[parentId][nvarchar](255)NULL,
			PRIMARY KEY CLUSTERED ([id]ASC)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF)ON[PRIMARY]
		) ON [PRIMARY];
	END;
GO

-- 键

ALTER TABLE [dbo].[UpLoadFiles]  WITH CHECK ADD FOREIGN KEY([categoryId])
REFERENCES [dbo].[UpLoadFilesCategories] ([id])
ON DELETE NO ACTION;
GO

ALTER TABLE [dbo].[UpLoadFilesCategories]  WITH CHECK ADD FOREIGN KEY([parentId])
REFERENCES [dbo].[UpLoadFilesCategories] ([id])
ON DELETE NO ACTION;
GO
