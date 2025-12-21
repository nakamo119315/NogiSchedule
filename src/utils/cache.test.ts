import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCachedData, setCachedData, clearCache, CACHE_KEYS } from './cache';

describe('cache utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CACHE_KEYS', () => {
    it('generates correct schedule key', () => {
      expect(CACHE_KEYS.schedules('202401')).toBe('nogi_schedule_202401');
    });

    it('generates correct members key', () => {
      expect(CACHE_KEYS.members()).toBe('nogi_members');
    });
  });

  describe('setCachedData and getCachedData', () => {
    it('stores data with setItem', () => {
      const testData = { foo: 'bar' };
      const key = 'test_key';

      setCachedData(key, testData, false);

      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('returns null for non-existent key', () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);

      const result = getCachedData('nonexistent');
      expect(result).toBeNull();
    });

    it('returns null for expired cache', () => {
      const expiredCache = {
        data: { foo: 'bar' },
        cachedAt: Date.now() - 1000 * 60 * 60,
        expiresAt: Date.now() - 1000, // expired 1 second ago
      };
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        JSON.stringify(expiredCache)
      );

      const result = getCachedData('test_key');
      expect(result).toBeNull();
    });

    it('returns data for valid cache', () => {
      const validCache = {
        data: { foo: 'bar' },
        cachedAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60, // expires in 1 hour
      };
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        JSON.stringify(validCache)
      );

      const result = getCachedData<{ foo: string }>('test_key');
      expect(result).toEqual({ foo: 'bar' });
    });
  });

  describe('clearCache', () => {
    it('removes nogi_ prefixed items', () => {
      // Mock Object.keys to return some keys
      const mockKeys = ['nogi_schedule_202401', 'nogi_members', 'other_key'];
      vi.spyOn(Object, 'keys').mockReturnValue(mockKeys);

      clearCache();

      expect(localStorage.removeItem).toHaveBeenCalledWith('nogi_schedule_202401');
      expect(localStorage.removeItem).toHaveBeenCalledWith('nogi_members');
      expect(localStorage.removeItem).not.toHaveBeenCalledWith('other_key');
    });
  });
});
