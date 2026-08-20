import * as timeUtils from '../utils/time.js';

export class CacheService<T> {
  private readonly store = new Map<string, T>();
  private readonly expirations = new Map<string, number>();
  private readonly maxSize = 100;
  private readonly defaultTtlMs = timeUtils.hours(2);

  get(key: string): T | undefined {
    if (!this.store.has(key)) {
      return undefined;
    };

    if (this.isExpired(key)) {
      this.delete(key);
      return undefined;
    }

    const value = this.store.get(key);
    if (value === undefined) {
      this.store.delete(key);
      return undefined;
    }

    this.store.delete(key);
    this.store.set(key, value);

    return value;
  }

  set(key: string, value: T, ttlMs = this.defaultTtlMs): void {
    if (!key || !value) {
      return undefined;
    };

    if (this.isExpired(key)) {
      this.delete(key);
    }

    if (this.store.has(key)) {
      this.store.delete(key);
    }

    if (this.store.size >= this.maxSize) {
      const oldestKey = this.removeExpiredEntries();
      if (oldestKey) {
        this.delete(oldestKey);
      }
    }

    this.store.set(key, value);

    setTimeout(() => this.delete(key), ttlMs).unref?.();
  }

  delete(key: string): boolean {
    this.expirations.delete(key);
    return this.store.delete(key);
  }

  keys(): string[] {
    return [...this.store.keys()];
  }

  private removeExpiredEntries(): string | undefined {
    for (const key of this.store.keys()) {
      if (this.isExpired(key))
        this.delete(key);
    }

    return this.store.keys().next().value;
  }

  private isExpired(key: string): boolean {
    const expiresAt = this.expirations.get(key);
    return expiresAt !== undefined && Date.now() >= expiresAt;
  }
}
