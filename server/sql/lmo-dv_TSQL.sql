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
			[type] [char](255) NULL,
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
			[createTime] [nvarchar](255) NULL,
			[templatePath] [nvarchar](255) NULL,
			[url] [nvarchar](255) NULL,
			[gifPath] [nvarchar](255) NULL,
			[videoCover] [nvarchar](255) NULL,
			[clarity] [nvarchar](255) NULL,
			[status] [nvarchar](255) NULL,
			[taskConfig] [nvarchar](255) NULL,
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
			[createTime] [nvarchar](255) NULL,
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
			[createTime] [nvarchar](255) NULL,
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
