import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalendar } from './useCalendar';

describe('useCalendar', () => {
  it('initializes with current month', () => {
    const { result } = renderHook(() => useCalendar());
    const now = new Date();

    expect(result.current.currentMonth.getFullYear()).toBe(now.getFullYear());
    expect(result.current.currentMonth.getMonth()).toBe(now.getMonth());
  });

  describe('goToNextMonth', () => {
    it('advances to next month', () => {
      const { result } = renderHook(() => useCalendar());
      const initialMonth = result.current.currentMonth.getMonth();

      act(() => {
        result.current.goToNextMonth();
      });

      const expectedMonth = (initialMonth + 1) % 12;
      expect(result.current.currentMonth.getMonth()).toBe(expectedMonth);
    });

    it('handles year rollover', () => {
      const { result } = renderHook(() => useCalendar());

      // Go to December
      while (result.current.currentMonth.getMonth() !== 11) {
        act(() => {
          result.current.goToNextMonth();
        });
      }

      const currentYear = result.current.currentMonth.getFullYear();

      act(() => {
        result.current.goToNextMonth();
      });

      expect(result.current.currentMonth.getMonth()).toBe(0); // January
      expect(result.current.currentMonth.getFullYear()).toBe(currentYear + 1);
    });
  });

  describe('goToPrevMonth', () => {
    it('goes to previous month', () => {
      const { result } = renderHook(() => useCalendar());
      const initialMonth = result.current.currentMonth.getMonth();

      act(() => {
        result.current.goToPrevMonth();
      });

      const expectedMonth = initialMonth === 0 ? 11 : initialMonth - 1;
      expect(result.current.currentMonth.getMonth()).toBe(expectedMonth);
    });

    it('handles year rollback', () => {
      const { result } = renderHook(() => useCalendar());

      // Go to January
      while (result.current.currentMonth.getMonth() !== 0) {
        act(() => {
          result.current.goToPrevMonth();
        });
      }

      const currentYear = result.current.currentMonth.getFullYear();

      act(() => {
        result.current.goToPrevMonth();
      });

      expect(result.current.currentMonth.getMonth()).toBe(11); // December
      expect(result.current.currentMonth.getFullYear()).toBe(currentYear - 1);
    });
  });

  describe('goToToday', () => {
    it('returns to current month', () => {
      const { result } = renderHook(() => useCalendar());

      // Navigate away from current month
      act(() => {
        result.current.goToNextMonth();
        result.current.goToNextMonth();
      });

      act(() => {
        result.current.goToToday();
      });

      const now = new Date();
      expect(result.current.currentMonth.getFullYear()).toBe(now.getFullYear());
      expect(result.current.currentMonth.getMonth()).toBe(now.getMonth());
    });
  });
});
