import NC = require('node-cache');

class MemoryCache {
    private Cache: NC;

    constructor() {
        this.Cache = new NC();
    }

    public set<T>(key: string, value: T, ttl: number = 0): boolean {
        return this.Cache.set(key, value, ttl);
    }

    public get<T>(key: string): T | undefined {
        return this.Cache.get(key);
    }

    public remove(key: string): number {
        return this.Cache.del(key);
    }

    public clear(): void {
        this.Cache.flushAll();
    }
}

export default new MemoryCache();
