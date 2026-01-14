// Cache utility for API responses

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    // Check if cache expired
    if (Date.now() - item.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new SimpleCache();
