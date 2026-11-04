// util 兼容补丁：必须在业务模块之前加载
import "./lib/nodeUtilCompat.js";
// Fastify 类型增强（request.t）需在业务模块之前纳入编译图
import "./fastify-augmentation.js";
// 进程级兜底必须最先注册，早于任何业务模块加载
import "./lib/processGuard.js";
// 目录必须先于数据库初始化创建（sqlite 需 _data/db 存在）
import "./lib/CheckDirectory.js";
// models 为纯定义（无 import 副作用），数据库连接/sync/初始化由下方显式 bootstrap
import "./bin/dataBase/index.js";
import { bootstrapDatabase } from "./bin/dataBase/bootstrap.js";
import "./bin/Process.js";
import "./bin/TaskScheduler.js";
import "./lib/TSC.js";
import { packageRoot } from "./lib/dataDir.js";

// 把工作目录钉到包根：本项目内部已全部改用绝对路径（见 lib/dataDir.ts），
// 但 web-video-creator 把中间目录硬编码成 cwd 相对且不接受 config 覆盖：
//   core/Synthesizer.js    → path.resolve("tmp/synthesizer/")
//   lib/cleaner.js         → emptyDir("tmp/synthesizer")
//   entity/{Audio,Font}.js → path.resolve("tmp/{preprocessor,local_font}/")
// 从任意目录启动（systemd / pm2 / k8s entrypoint）时，这些中间文件会散到别处，
// 甚至误碰该目录下同名的 tmp/。钉到包根后与 Dockerfile 的 WORKDIR 和 `pnpm dev` 的默认目录一致。
// ESM 的 import 先于模块体执行，本行晚于上方模块的初始化；但那些模块只算绝对路径，不受影响。
process.chdir(packageRoot);

// 显式初始化数据库：连接失败以非 0 退出，成功后向 PM2 发 ready。
await bootstrapDatabase();
