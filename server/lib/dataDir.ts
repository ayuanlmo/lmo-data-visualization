import { fileURLToPath as __urlToPath } from 'node:url';
import { dirname as __dirName, join as __join, resolve as __resolve } from 'node:path';
import { existsSync as __exists, readFileSync as __read } from 'node:fs';
import { env } from '../conf/env.js';

/**
 * 数据根目录（`_data`）与包内静态资源目录的唯一解析入口。
 *
 * 为什么必须有它：原先两套根并存——
 *  - 写入侧用 `path.resolve('./_data/...')`，跟着 `process.cwd()` 走；
 *  - 读取/服务侧用 `path.resolve(__dirname, '../_data/...')`，跟着模块所在目录走。
 * 源码布局下两者恰好都等于 `<server>/_data`（dev 用 tsx 直接跑源码），所以长期没人发现问题；
 * 一旦跑编译产物（`dist/main.js`，Docker 镜像里 pm2 正是这么跑的），`__dirname` 那一套就多钻了一层
 * `dist/`，实测后果是：`/static/**` 全 404、pug 预览 500（`dist/views` 不存在）、
 * 日志与上传写进 `<server>/dist/_data`（容器里那不是挂载卷，数据不落卷）、
 * 模板编译 `spawnSync` 报 ENOENT（其实是 `cwd` 指向了不存在的目录）。
 *
 * 因此这里沿目录向上定位「本包根」（认 package.json 的 name），源码与 dist 两种布局都落到 `<server>`，
 * 不再依赖 cwd，也不受编译产物层级影响。可用 `DATA_DIR` 覆盖——集成测试正是把它指向
 * `mkdtemp` 临时目录，从而完全不接触真实 `_data`。
 */
const PACKAGE_NAME: string = 'lmo-data-visualization-server-application';

/** 从模块目录向上查找包根：该层 package.json 的 name 为本包名称。 */
function findPackageRoot(startDir: string): string {
    let dir: string = startDir;
    for (;; ) {
        const manifest: string = __join(dir, 'package.json');
        if (__exists(manifest)) {
            try {
                if ((JSON.parse(__read(manifest, 'utf8')) as {name?: string}).name === PACKAGE_NAME) return dir;
            } catch {
                /* 读不到或不是合法 JSON 就继续向上找，最坏情况由下方兜底抛出 */
            }
        }
        const parent: string = __dirName(dir);
        if (parent === dir) break;
        dir = parent;
    }
    throw new Error(`未能定位包根目录（从 ${startDir} 向上找不到 name=${PACKAGE_NAME} 的 package.json）`);
}

const PACKAGE_ROOT: string = findPackageRoot(__dirName(__urlToPath(import.meta.url)));

/** 生效的数据根：`DATA_DIR` 优先，否则 `<包根>/_data`。 */
export const dataRoot: string = env.DATA_DIR !== '' ? __resolve(env.DATA_DIR) : __join(PACKAGE_ROOT, '_data');

/** 拼接数据根下的子路径（不解析、不创建目录）。 */
export const dataPath = (...segments: Array<string>): string => __join(dataRoot, ...segments);

/** 拼接包根下的非数据目录（如 views、migrations 等随代码一起分发的资源）。 */
export const packagePath = (...segments: Array<string>): string => __join(PACKAGE_ROOT, ...segments);

/**
 * 静态资源对外服务的根（`<数据根>/static/public`）。
 * DB 里存的是 `/static/...` 形式的相对 URL，各控制器统一用本模块把它拼回磁盘路径，
 * 因此这里只能用 join（拼接）语义：段首多出的 `/` 会被当作相对处理。
 * 历史写法里混用的 path.resolve 在「基址 + 以 / 开头的相对段」时会直接丢弃基址，不得改用。
 */
export const staticPublicRoot: string = dataPath('static', 'public');

/** 包根绝对路径，供诊断输出使用。 */
export const packageRoot: string = PACKAGE_ROOT;
