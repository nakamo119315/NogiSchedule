import { describe, it, expect } from 'vitest';
import {
  formatMonth,
  formatYearMonth,
  formatDateSlash,
  isToday,
  getDaysInMonth,
  getMonthStartPadding,
  getNextMonth,
  getPrevMonth,
} from './date';

describe('date utils', () => {
  describe('formatMonth', () => {
    it('formats date to Japanese style', () => {
      expect(formatMonth(new Date(2024, 0, 15))).toBe('2024年1月');
      expect(formatMonth(new Date(2024, 11, 1))).toBe('2024年12月');
    });
  });

  describe('formatYearMonth', () => {
    it('formats date to YYYYMM', () => {
      expect(formatYearMonth(new Date(2024, 0, 15))).toBe('202401');
      expect(formatYearMonth(new Date(2024, 11, 1))).toBe('202412');
    });
  });

  describe('formatDateSlash', () => {
    it('formats date to YYYY/MM/DD', () => {
      expect(formatDateSlash(new Date(2024, 0, 5))).toBe('2024/01/05');
      expect(formatDateSlash(new Date(2024, 11, 25))).toBe('2024/12/25');
    });
  });

  describe('isToday', () => {
    it('returns true for today', () => {
      expect(isToday(new Date())).toBe(true);
    });

    it('returns false for other days', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });

  describe('getDaysInMonth', () => {
    it('returns array of days for January', () => {
      const days = getDaysInMonth(new Date(2024, 0, 1));
      expect(days).toHaveLength(31);
    });

    it('returns array of days for February (leap year)', () => {
      const days = getDaysInMonth(new Date(2024, 1, 1));
      expect(days).toHaveLength(29);
    });

    it('returns array of days for February (non-leap)', () => {
      const days = getDaysInMonth(new Date(2023, 1, 1));
      expect(days).toHaveLength(28);
    });
  });

  describe('getMonthStartPadding', () => {
    it('returns correct padding for Sunday start', () => {
      // September 2024 starts on Sunday (0)
      expect(getMonthStartPadding(new Date(2024, 8, 1))).toBe(0);
    });

    it('returns correct padding for Monday start', () => {
      // January 2024 starts on Monday (1)
      expect(getMonthStartPadding(new Date(2024, 0, 1))).toBe(1);
    });
  });

  describe('getNextMonth', () => {
    it('returns next month', () => {
      const current = new Date(2024, 0, 15);
      const next = getNextMonth(current);
      expect(next.getMonth()).toBe(1);
    });

    it('handles year rollover', () => {
      const december = new Date(2024, 11, 15);
      const next = getNextMonth(december);
      expect(next.getMonth()).toBe(0);
      expect(next.getFullYear()).toBe(2025);
    });
  });

  describe('getPrevMonth', () => {
    it('returns previous month', () => {
      const current = new Date(2024, 5, 15);
      const prev = getPrevMonth(current);
      expect(prev.getMonth()).toBe(4);
    });

    it('handles year rollback', () => {
      const january = new Date(2024, 0, 15);
      const prev = getPrevMonth(january);
      expect(prev.getMonth()).toBe(11);
      expect(prev.getFullYear()).toBe(2023);
    });
  });
});
