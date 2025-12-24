import { useState, useEffect, useCallback, useRef } from 'react';
import type { Schedule } from '../types/schedule';
import { fetchSchedules, getCachedSchedules, forceRefreshSchedules } from '../services/scheduleService';
import { formatYearMonth } from '../utils/date';

interface UseSchedulesResult {
  schedules: Schedule[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  lastUpdated: Date | null;
}

// 最後にAPIを呼んだ時刻を保持（月ごと）
const lastFetchTime = new Map<string, number>();
const MIN_FETCH_INTERVAL = 5 * 60 * 1000; // 5分間は再取得しない

export function useSchedules(currentMonth: Date): UseSchedulesResult {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const isMounted = useRef(true);

  const yearMonth = formatYearMonth(currentMonth);

  // キャッシュから即座にデータを取得
  const loadFromCache = useCallback(() => {
    const cached = getCachedSchedules(yearMonth);
    if (cached) {
      setSchedules(cached);
      setIsLoading(false);
      return true;
    }
    return false;
  }, [yearMonth]);

  // APIからデータを取得（バックグラウンド更新可能）
  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();
    const lastFetch = lastFetchTime.get(yearMonth) || 0;

    // 強制更新でない場合、最小間隔をチェック
    if (!force && now - lastFetch < MIN_FETCH_INTERVAL) {
      return;
    }

    // キャッシュがない場合のみローディング表示
    const hasCached = getCachedSchedules(yearMonth) !== null;
    if (!hasCached) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = force
        ? await forceRefreshSchedules(yearMonth)
        : await fetchSchedules(yearMonth);

      if (isMounted.current) {
        setSchedules(data);
        lastFetchTime.set(yearMonth, Date.now());
        setLastUpdated(new Date());
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('Failed to fetch schedules'));
        // キャッシュをフォールバックとして使用
        const cached = getCachedSchedules(yearMonth);
        if (cached) {
          setSchedules(cached);
        }
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [yearMonth]);

  // 初回マウント時・月変更時
  useEffect(() => {
    isMounted.current = true;

    // まずキャッシュから表示
    const hasCached = loadFromCache();

    // バックグラウンドで更新
    fetchData();

    // キャッシュがない場合のみローディング
    if (!hasCached) {
      setIsLoading(true);
    }

    return () => {
      isMounted.current = false;
    };
  }, [yearMonth, loadFromCache, fetchData]);

  // フォアグラウンド復帰時に更新
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchData]);

  // 手動更新（強制）
  const refetch = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  return { schedules, isLoading, error, refetch, lastUpdated };
}
