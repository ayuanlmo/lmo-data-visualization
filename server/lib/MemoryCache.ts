/**
 * 零依赖内存缓存。
 * 语义：set/get/remove(ttl)/clear，ttl 单位为秒（0 表示不过期）。
 * 现仅存少量查询缓存（如 Color 列表），无需第三方缓存库。
 */
interface ICacheEntry {
    value: unknown;
    /** 绝对过期时间戳（毫秒）；0 表示永不过期 */
    expireAt: number;
}

class MemoryCache {
    private readonly store: Map<string, ICacheEntry> = new Map();

    public set<T>(key: string, value: T, ttl: number = 0): boolean {
        const expireAt: number = ttl > 0 ? Date.now() + ttl * 1000 : 0;

        this.store.set(key, {value, expireAt});
        return true;
    }

    public get<T>(key: string): T | undefined {
        const entry: ICacheEntry | undefined = this.store.get(key);

        if (!entry)
            return undefined;

        if (entry.expireAt !== 0 && entry.expireAt <= Date.now()) {
            this.store.delete(key);
            return undefined;
        }

        return entry.value as T;
    }

    public remove(key: string): number {
        return this.store.delete(key) ? 1 : 0;
    }

    public clear(): void {
        this.store.clear();
    }
}

export default new MemoryCache();
