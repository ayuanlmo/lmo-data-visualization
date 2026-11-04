import { fileURLToPath as __urlToPath } from "node:url";
import { dirname as __dirName, join as pathJoin, resolve as pathResolve } from "node:path";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import Cli from "./Cli.js";
import {staticPublicRoot} from "./dataDir.js";

const __dirname: string = __dirName(__urlToPath(import.meta.url));

/**
 * 定位 typescript 包的 CLI 入口（bin/tsc）。
 * TS7 包的 "exports" 未导出 "./bin/tsc" 子路径，require.resolve 会抛
 * ERR_PACKAGE_PATH_NOT_EXPORTED，故改为沿目录向上查找真实文件。
 */
function findTscBin(): string | null {
    let dir: string = __dirname;
    for (;; ) {
        const candidate: string = pathJoin(dir, 'node_modules', 'typescript', 'bin', 'tsc');
        if (existsSync(candidate)) return candidate;
        const parent: string = __dirName(dir);
        if (parent === dir) return null;
        dir = parent;
    }
}

namespace TSC {
    /**
     * 模板编译。
     *
     * TS7（原生 tsgo 编译器）已从 `typescript` 包中移除旧版 JS 编译器 API
     * （createProgram / createCompilerHost / sys 等），因此不能在本进程内直接调用编译器。
     * 这里改为在独立子进程调用 TypeScript CLI 编译模板 tsconfig（失败即抛出、阻止带病启动）。
     */
    export function compileTemplate(): void {
        const originDir: string = staticPublicRoot;
        const tsConfigFile: string = pathResolve(originDir, "tsconfig.json");
        const tscBin: string | null = findTscBin();

        Cli.log('Template compilation start .');

        if (tscBin === null)
            throw new Error('TypeScript CLI (node_modules/typescript/bin/tsc) not found for template compilation');

        const result = spawnSync(process.execPath, [tscBin, "-p", tsConfigFile], {
            encoding: "utf8",
            cwd: originDir
        });

        if (result.error)
            throw new Error(`Template compilation failed to launch: ${result.error.message}`);

        if (result.status !== 0) {
            const output: string = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
            Cli.warn(output);
            throw new Error(`Template compilation failed with exit code ${result.status}`);
        }

        Cli.log('Template compilation succeeded .');
    }
}

TSC.compileTemplate();

export default TSC;
