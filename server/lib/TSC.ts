import Cli from "./Cli";
import {dirname as pathDirname, join as pathJoin, relative as pathRelative, resolve as pathResolve} from "node:path";
import {
    CompilerHost,
    createCompilerHost,
    createProgram,
    Diagnostic,
    EmitResult,
    formatDiagnosticsWithColorAndContext,
    getPreEmitDiagnostics,
    ParsedCommandLine,
    parseJsonConfigFileContent,
    Program,
    readConfigFile,
    SourceFile,
    sys as tsSys
} from "typescript";

interface ITSConfig {
    config?: any;
    error?: Diagnostic;
}

namespace TSC {
    export function compileTemplate(): void {
        const cli_color: any = require('cli-color');
        const originDir: string = pathResolve(__dirname, "../_data/static/public/");
        const tsConfigFile: string = pathResolve(originDir, 'tsconfig.json');
        const configJson: ITSConfig = readConfigFile(tsConfigFile, tsSys.readFile);
        const compilerOptions: ParsedCommandLine = parseJsonConfigFileContent(configJson.config, tsSys, pathDirname(tsConfigFile));
        const compilerHost: CompilerHost = createCompilerHost(compilerOptions.options);
        const program: Program = createProgram(compilerOptions.fileNames, compilerOptions.options, compilerHost);
        const emitResult: EmitResult = program.emit();
        const diagnostics: Diagnostic[] = getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
        const outDir: string = compilerOptions.options.outDir ?? '';

        Cli.log('Template compilation start .');

        if (diagnostics.length > 0)
            throw new Error(`${formatDiagnosticsWithColorAndContext(diagnostics, compilerHost)}`);

        program.getSourceFiles().forEach((sourceFile: SourceFile): void => {
            if (!sourceFile.isDeclarationFile) {
                const relativePath: string = pathRelative(process.cwd(), sourceFile.fileName);
                const outputPath: string = pathJoin(outDir, relativePath);

                Cli.log(`Compiled ${cli_color.blue(`"${sourceFile.fileName}"`)} to ${`"${cli_color.yellow(outputPath)}`}"`);
            }
        });

        Cli.log('Template compilation succeeded .');
    }
}

TSC.compileTemplate();

export default TSC;
