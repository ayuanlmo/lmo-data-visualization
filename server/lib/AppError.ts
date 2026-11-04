/**
 * 统一错误模型。
 *
 * 设计约束——API 契约冻结：
 *  - 对外响应结构仍为 `{code, message, success, data, _t, _app}`（可选 `errorCode`），HTTP 恒 200；
 *  - 内部用语义化 `ErrorCode` 枚举替代散落的 `request.t('errors.*')` 硬编码；
 *  - 出口 `errorHandler`（见 HttpServer）按 i18nKey 翻译 + 映射为冻结契约。
 *
 * 每个 ErrorCode 与现有 `errors.*` i18n key 一一映射；`contractCode` 为该分支输出的业务码
 * （错误分支统一为 500）；live-server 拒绝携带 `errorCode:'ext00el'`。
 */

export enum ErrorCode {
    INVALID_ID = 'INVALID_ID',
    FILE_MISSING = 'FILE_MISSING',
    FILE_UNSUPPORTED_TYPE = 'FILE_UNSUPPORTED_TYPE',
    FILE_NOT_FOUND = 'FILE_NOT_FOUND',
    TEMPLATE_NOT_FOUND = 'TEMPLATE_NOT_FOUND',
    TEMPLATE_NOT_EDITABLE = 'TEMPLATE_NOT_EDITABLE',
    TEMPLATE_READ_FAILED = 'TEMPLATE_READ_FAILED',
    TEMPLATE_NOT_ZIP = 'TEMPLATE_NOT_ZIP',
    TEMPLATE_COVER_NOT_BASE64 = 'TEMPLATE_COVER_NOT_BASE64',
    UPDATE_FAILED = 'UPDATE_FAILED',
    DATABASE_ERROR = 'DATABASE_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    /** 合成服务不可达：当前同进程架构不再产生，保留枚举以兼容历史契约映射 */
    SYNTHESIS_UNREACHABLE = 'SYNTHESIS_UNREACHABLE',
    LIVE_SERVER_FORBIDDEN = 'LIVE_SERVER_FORBIDDEN',
    NOT_FOUND = 'NOT_FOUND'
}

interface IErrorMeta {
    /** 对应现有 errors.* i18n key（一一映射，出口翻译） */
    i18nKey: string;
    /** 冻结契约响应体 code 字段 */
    contractCode: number;
    /** 冻结契约可选透传字段（仅 live-server = 'ext00el'） */
    errorCode?: string;
}

const META: Record<ErrorCode, IErrorMeta> = {
    [ErrorCode.INVALID_ID]: {i18nKey: 'errors.invalidId', contractCode: 500},
    [ErrorCode.FILE_MISSING]: {i18nKey: 'errors.fileMissing', contractCode: 500},
    [ErrorCode.FILE_UNSUPPORTED_TYPE]: {i18nKey: 'errors.fileUnsupportedType', contractCode: 500},
    [ErrorCode.FILE_NOT_FOUND]: {i18nKey: 'errors.fileNotFoundById', contractCode: 500},
    [ErrorCode.TEMPLATE_NOT_FOUND]: {i18nKey: 'errors.templateNotFound', contractCode: 500},
    [ErrorCode.TEMPLATE_NOT_EDITABLE]: {i18nKey: 'errors.templateNotEditable', contractCode: 500},
    [ErrorCode.TEMPLATE_READ_FAILED]: {i18nKey: 'errors.templateReadFailed', contractCode: 500},
    [ErrorCode.TEMPLATE_NOT_ZIP]: {i18nKey: 'errors.templateNotZip', contractCode: 500},
    [ErrorCode.TEMPLATE_COVER_NOT_BASE64]: {i18nKey: 'errors.templateCoverNotBase64', contractCode: 500},
    [ErrorCode.UPDATE_FAILED]: {i18nKey: 'errors.updateFailed', contractCode: 500},
    [ErrorCode.DATABASE_ERROR]: {i18nKey: 'errors.databaseError', contractCode: 500},
    [ErrorCode.SERVER_ERROR]: {i18nKey: 'errors.serverError', contractCode: 500},
    [ErrorCode.SYNTHESIS_UNREACHABLE]: {i18nKey: 'errors.synthesisServerUnreachable', contractCode: 500},
    [ErrorCode.LIVE_SERVER_FORBIDDEN]: {i18nKey: 'errors.liveServerForbidden', contractCode: 500, errorCode: 'ext00el'},
    // notFound / 静态黑名单出口输出字面量 message:'404'（非 i18n key），在边界处理器保留原样
    [ErrorCode.NOT_FOUND]: {i18nKey: '404', contractCode: 404}
};

/**
 * 业务异常：控制器抛出，由 Fastify setErrorHandler 统一映射为冻结契约。
 * `message` 暂存 i18nKey，出口用 `request.t(i18nKey)` 翻译（保持 i18n 上下文一致）。
 */
export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly i18nKey: string;
    public readonly contractCode: number;
    public readonly errorCode?: string;

    constructor(code: ErrorCode) {
        const meta: IErrorMeta = META[code];
        super(meta.i18nKey);

        this.name = 'AppError';
        this.code = code;
        this.i18nKey = meta.i18nKey;
        this.contractCode = meta.contractCode;
        this.errorCode = meta.errorCode;
    }
}

export const appError = (code: ErrorCode): AppError => new AppError(code);

export const isAppError = (e: unknown): e is AppError => e instanceof AppError;

/**
 * catch 中「不要吞掉控制流 AppError」的守卫：
 * 若捕获到 AppError（业务分支主动抛出）则原样再抛，交由出口映射；否则视为意外异常。
 */
export const rethrowAppError = (e: unknown): void => {
    if (isAppError(e)) throw e;
};
