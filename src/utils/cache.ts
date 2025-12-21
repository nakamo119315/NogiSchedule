interface CacheEntry<T> {
  data: T;
  cachedAt: number;
  expiresAt: number;
}

const SCHEDULE_TTL = 30 * 60 * 1000; // 30 minutes
const MEMBER_TTL = 24 * 60 * 60 * 1000; // 24 hours

export const CACHE_KEYS = {
  schedules: (yearMonth: string) => `nogi_schedule_${yearMonth}`,
  members: () => 'nogi_members',
};

export function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry: CacheEntry<T> = JSON.parse(cached);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedData<T>(key: string, data: T, isSchedule = true): void {
  try {
    const ttl = isSchedule ? SCHEDULE_TTL : MEMBER_TTL;
    const entry: CacheEntry<T> = {
      data,
      cachedAt: Date.now(),
      expiresAt: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Storage might be full, silently fail
    console.warn('Failed to cache data');
  }
}

export function getCacheTimestamp(key: string): number | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const entry = JSON.parse(cached);
    return entry.cachedAt || null;
  } catch {
    return null;
  }
}

export function clearCache(): void {
  const keys = Object.keys(localStorage).filter((key) => key.startsWith('nogi_'));
  keys.forEach((key) => localStorage.removeItem(key));
}
