import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
} from 'date-fns';
import { ja } from 'date-fns/locale';

export function formatMonth(date: Date): string {
  return format(date, 'yyyy年M月', { locale: ja });
}

export function formatYearMonth(date: Date): string {
  return format(date, 'yyyyMM');
}

export function formatDateSlash(date: Date): string {
  return format(date, 'yyyy/MM/dd');
}

export function formatTime(time?: string): string {
  if (!time) return '';
  return time;
}

export function getDaysInMonth(date: Date): Date[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
}

export function getMonthStartPadding(date: Date): number {
  const firstDay = startOfMonth(date);
  return getDay(firstDay); // 0 = Sunday
}

export function getMonthEndPadding(date: Date): number {
  const lastDay = endOfMonth(date);
  return 6 - getDay(lastDay); // Fill remaining days to Saturday
}

export function getNextMonth(date: Date): Date {
  return addMonths(date, 1);
}

export function getPrevMonth(date: Date): Date {
  return subMonths(date, 1);
}

export function isSameMonthAs(date1: Date, date2: Date): boolean {
  return isSameMonth(date1, date2);
}

export function isSameDayAs(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2);
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function parseScheduleDate(dateString: string): Date {
  // Handle "YYYY/MM/DD" format
  const normalized = dateString.replace(/\//g, '-');
  return parseISO(normalized);
}

export const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];
