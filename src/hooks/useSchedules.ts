import { useState, useEffect, useCallback } from 'react';
import type { Schedule } from '../types/schedule';
import { fetchSchedules, getCachedSchedules } from '../services/scheduleService';
import { formatYearMonth } from '../utils/date';

interface UseSchedulesResult {
  schedules: Schedule[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useSchedules(currentMonth: Date): UseSchedulesResult {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const yearMonth = formatYearMonth(currentMonth);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchSchedules(yearMonth);
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch schedules'));
      // Try to use cached data as fallback
      const cached = getCachedSchedules(yearMonth);
      if (cached) {
        setSchedules(cached);
      }
    } finally {
      setIsLoading(false);
    }
  }, [yearMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { schedules, isLoading, error, refetch };
}
