/**
	@author ayuanlmo
	@date 2024/10
**/

-- 插入模板项
CREATE PROCEDURE [dbo].[usp_InsertTemplateItem]
	@Id VARCHAR ( 36 ),
	@Name VARCHAR ( 255 ),
	@Description VARCHAR ( 255 ),
	@Path VARCHAR ( 255 ),
	@Cover VARCHAR ( 255 ),
	@GifCover VARCHAR ( 255 ),
	@CreateTime VARCHAR ( 255 ),
	@Type INT
	AS BEGIN
		INSERT INTO [Templates] ( [id], [name], [description], [path], [cover], [gifCover], [createTime], [type] )
		VALUES
			( @Id, @Name, @Description, @Path, @Cover, @GifCover, @CreateTime, @Type );
END;
GO

-- 查询模板由id
CREATE PROCEDURE [dbo].[usp_QueryTemplateById]
	@Id VARCHAR ( 36 )
	AS BEGIN
		SELECT * FROM [Templates]  WHERE [id] = @Id;
END;
GO

-- 更新模板由id
CREATE PROCEDURE [dbo].[usp_UpdateTemplateById]
	@Id VARCHAR ( 36 ),
	@Name VARCHAR ( 255 ),
	@Description VARCHAR ( 255 ),
	@Path VARCHAR ( 255 ),
	@Cover VARCHAR ( 255 ),
	@GifCover VARCHAR ( 255 ),
	@CreateTime VARCHAR ( 255 ),
	@Type INT
	AS BEGIN
		UPDATE [Templates]
		SET
			[name] = @Name,
			[description] = @Description,
			[path] = @Path,
			[cover] = @Cover,
			[gifCover] = @GifCover,
			createTime = @CreateTime,
			[type] = @Type
		WHERE
			[id] = @Id;
END;
GO

-- 删除模板由id
CREATE PROCEDURE [dbo].[usp_DeleteTemplateById]
	@Id VARCHAR ( 36 )
	AS BEGIN
		DELETE FROM [Templates]  WHERE [id] = @Id;
END;
GO

-- 插入颜色项目
CREATE PROCEDURE [dbo].[usp_InsertColorItem]
	@Id VARCHAR ( 36 )
	@value NVARCHAR ( 255 ),
	@cssCode NVARCHAR ( 255 ),
	@type CHAR ( 1 )
	AS BEGIN
		INSERT INTO [Colors] ( [id], [value], [cssCode], [type] )
		VALUES
			( @id, @value, @cssCode, @type );
END;
GO

-- 查询颜色项由id
CREATE PROCEDURE [dbo].[usp_QueryColorItemById]
	@id NVARCHAR ( 36 )
	AS BEGIN
		SELECT * FROM [Colors] WHERE[id] = @id;
END;
GO

-- 更新颜色项由id
CREATE PROCEDURE [dbo].[usp_UpdateColorItemById]
    @id NVARCHAR(36),
    @value NVARCHAR(255),
    @cssCode NVARCHAR(255),
    @type CHAR(1)
	AS BEGIN
		UPDATE [Colors]
		SET
			[value] = @value,
			[cssCode] = @cssCode,
			[type] = @type
		WHERE id = @id;
END;
GO

-- 删除颜色项由id
CREATE PROCEDURE [dbo].[usp_DeleteColorById]
	@id NVARCHAR ( 36 )
	AS BEGIN
		DELETE FROM [Colors] WHERE [id] = @id;
END;
GO

-- 分页获取颜色
CREATE PROCEDURE [dbo].[usp_QueryColorsPaginated]
	@PageNumber INT = 1,
	@PageSize INT = 10
	AS BEGIN
		SET NOCOUNT ON;
		SELECT * FROM [Colors]
		ORDER BY
		[type] OFFSET ( @PageNumber - 1 ) * @PageSize ROWS FETCH NEXT @PageSize ROWS ONLY;
END;
GO

-- 插入合成资源项
CREATE PROCEDURE [dbo].[usp_InsertResourceItem]
    @id NVARCHAR(36),
    @name NVARCHAR(255),
    @template NVARCHAR(255),
    @filePath NVARCHAR(255),
    @createTime NVARCHAR(255),
    @templatePath NVARCHAR(255),
    @url NVARCHAR(255),
    @gifPath NVARCHAR(255),
    @videoCover NVARCHAR(255),
    @clarity NVARCHAR(255),
    @status NVARCHAR(255),
    @taskConfig NVARCHAR(255)
	AS BEGIN
		INSERT INTO [Resources]
			([id], [name], [template], [filePath], [createTime], [templatePath], [url], [gifPath], [videoCover], [clarity], [status], [taskConfig])
		VALUES (@id, @name, @template, @filePath, @createTime, @templatePath, @url, @gifPath, @videoCover, @clarity, @status, @taskConfig)
END;
GO

-- 删除合成资源项由id
CREATE PROCEDURE [dbo].[usp_DeleteResourceItemByID]
    @id NVARCHAR(36)
	AS BEGIN
		DELETE FROM [Resources] WHERE [id] = @id;
END;
GO

-- 更新合成资源项由id
CREATE PROCEDURE [dbo].[usp_UpdateResourceItemById]
    @id NVARCHAR(36),
    @name NVARCHAR(255),
    @template NVARCHAR(255),
    @filePath NVARCHAR(255),
    @createTime NVARCHAR(255),
    @templatePath NVARCHAR(255),
    @url NVARCHAR(255),
    @gifPath NVARCHAR(255),
    @videoCover NVARCHAR(255),
    @clarity NVARCHAR(255),
    @status NVARCHAR(255),
    @taskConfig NVARCHAR(255)
	AS BEGIN
		UPDATE [Resources]
			SET
				[name] = @name,
				[template] = @template,
				[filePath] = @filePath,
				[createTime] = @createTime,
				[templatePath] = @templatePath,
				[url] = @url,
				[gifPath] = @gifPath,
				[videoCover] = @videoCover,
				[clarity] = @clarity,
				[status] = @status,
				[taskConfig] = @taskConfig
			WHERE [id] = @id;
END;
GO

-- 查询合成资源项由id
CREATE PROCEDURE [dbo].[usp_QueryResourceItemById]
    @id NVARCHAR(36)
	AS BEGIN
		SELECT * FROM [Resources] WHERE [id] = @id;
END;
GO

-- 分页查询合成资源项
CREATE PROCEDURE [dbo].[usp_QueryResourcesPaged]
    @PageNumber INT = 1,
	@PageSize INT = 10
	AS BEGIN
		WITH PagedResources AS
			(SELECT *, ROW_NUMBER() OVER (ORDER BY createTime DESC) AS RowNum FROM Resources)
		SELECT * FROM PagedResources
		WHERE RowNum BETWEEN ((@PageNumber - 1) * @PageSize + 1) AND (@PageNumber * @PageSize)
END;
GO

-- 插入上传文件项
CREATE PROCEDURE [dbo].[usp_InsertUpLoadFileItem]
    @id NVARCHAR(36),
    @name NVARCHAR(255),
    @path NVARCHAR(255),
    @cover NVARCHAR(255),
    @createTime NVARCHAR(255),
    @type NVARCHAR(255),
    @hash NVARCHAR(255)
	AS BEGIN
		INSERT INTO [UpLoadFiles] ([id],[name], [path], [cover], [createTime], [type], [hash])
		VALUES (@id, @name, @path, @cover, @createTime, @type, @hash);
END;
GO

-- 删除上传文件项由id
CREATE PROCEDURE [dbo].[usp_DeleteUpLoadFileById]
    @id NVARCHAR(36)
	AS BEGIN
		DELETE FROM [UpLoadFiles] WHERE [id] = @id;
END;
GO

-- 更新上传文件项由id
CREATE PROCEDURE [dbo].[usp_UpdateUpLoadFileById]
    @id NVARCHAR(36),
    @name NVARCHAR(255),
    @path NVARCHAR(255),
    @cover NVARCHAR(255),
    @createTime NVARCHAR(255),
    @type NVARCHAR(255),
    @hash NVARCHAR(255)
	AS BEGIN
		UPDATE [UpLoadFiles]
		SET
			[name] = @name,
			[path] = @path,
			[cover] = @cover,
			[createTime] = @createTime,
			[type] = @type,
			[hash] = @hash
		WHERE id = @id;
END;
GO

-- 查询上传文件项由id
CREATE PROCEDURE [dbo].[usp_QueryUpLoadFileItemById]
    @id NVARCHAR(36)
	AS BEGIN
		SELECT * FROM [UpLoadFiles] WHERE [id] = @id;
END;
GO

-- 分页查询上传文件
CREATE PROCEDURE [dbo].[usp_QueryUpLoadFilesPaged]
    @PageNumber INT = 1,
    @PageSize INT = 10
	AS BEGIN
		SET NOCOUNT ON;
		SELECT * FROM [UpLoadFiles]
		ORDER BY [createTime] DESC
		OFFSET (@PageNumber - 1) * @PageSize ROWS
		FETCH NEXT @PageSize ROWS ONLY;
END;
GO

--- 插入文件分类项
CREATE PROCEDURE [dbo].[usp_InsertFileCategory]
    @id NVARCHAR(36),
    @name NVARCHAR(255),
    @parentId NVARCHAR(255) = NULL
	AS BEGIN
		INSERT INTO [UpLoadFilesCategories] ([id], [name], [parentId])
		VALUES (@id, @name, @parentId);
END;
GO

-- 更新文件分类项由id
CREATE PROCEDURE [dbo].[usp_UpdateFileCategoryById]
    @id NVARCHAR(36),
    @name NVARCHAR(255),
    @parentId NVARCHAR(255) = NULL
	AS BEGIN
		UPDATE [UpLoadFilesCategories]
		SET
			[name] = @name,
			[parentId] = @parentId
		WHERE [id] = @id;
END;
GO

-- 删除文件分类项由id
CREATE PROCEDURE [dbo].[usp_DeleteFileCategoryById]
    @id NVARCHAR(36)
	AS BEGIN
		DELETE FROM [UpLoadFilesCategories]
		WHERE [id] = @id;
END;
GO

-- 查询文件分类
CREATE PROCEDURE [dbo].[usp_QueryAllFileCategories]
	AS BEGIN
		SELECT * FROM [UpLoadFilesCategories];
END;
GO
