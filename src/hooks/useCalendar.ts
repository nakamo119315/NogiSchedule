import { useState, useCallback } from 'react';
import { getNextMonth, getPrevMonth } from '../utils/date';

interface UseCalendarResult {
  currentMonth: Date;
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToToday: () => void;
}

export function useCalendar(): UseCalendarResult {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const goToNextMonth = useCallback(() => {
    setCurrentMonth((prev) => getNextMonth(prev));
  }, []);

  const goToPrevMonth = useCallback(() => {
    setCurrentMonth((prev) => getPrevMonth(prev));
  }, []);

  const goToToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  return {
    currentMonth,
    goToNextMonth,
    goToPrevMonth,
    goToToday,
  };
}
