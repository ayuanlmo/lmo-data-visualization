<div align="center">
    <img width="200px" src="../../web_app/public/logo.svg">
</div>

<div align="center">
    <h1>lmo-DataVisualization</h1>
</div>

---

### 🧱 使用 MSSQL 作为 LMO-DV 数据库的配置说明

当使用 Microsoft SQL Server（MSSQL）作为 `lmo-dv` 应用程序的数据库系统时，您需要首先在数据库服务器中创建一个名为 **`lmo-dv`
** 的数据库。

#### 🛠️ 创建数据库

您可以使用以下 T-SQL 脚本来创建数据库。

```tsql
DECLARE @DataBaseName sysname;
SET @DataBaseName = 'lmo-dv';

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = @DataBaseName)
BEGIN
    CREATE DATABASE [lmo-dv];
END;
```

> ✅ **提示**：数据库中的表结构将在应用程序首次连接数据库时自动创建。

#### 👤 创建数据库用户并分配权限

为保证系统安全，**请勿在应用程序中使用 `sa` 用户连接数据库**🔐。建议您创建一个专用的数据库用户，并为其分配最小必要权限。

##### 📌 步骤 1：创建登录账户

首先，在 MSSQL Server 中创建一个新的登录账户（请将 `your_username` 和 `your_password` 替换为实际使用的用户名和密码）：

```tsql
USE master;
GO
CREATE LOGIN [your_username] WITH PASSWORD = 'your_password';
GO
```

##### 📊 步骤 2：为用户分配数据库权限

接下来，将该登录账户添加到 `lmo-dv` 数据库中，并为其分配读写权限：

```tsql
USE [lmo-dv];
GO

-- 将登录账户添加为数据库用户
CREATE USER [your_username] FOR LOGIN [your_username];
GO

-- 授予数据库读取和写入权限
EXEC sp_addrolemember 'db_datareader', [your_username];
EXEC sp_addrolemember 'db_datawriter', [your_username];
GO
```

> 📝 **建议**：如果需要更精细的权限控制，建议根据实际业务需求自定义权限，请至少保留lmo-dv库下面表的读写权限。

---
