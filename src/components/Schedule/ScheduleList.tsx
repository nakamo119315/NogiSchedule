import { useEffect, useRef, useCallback } from 'react';
import type { Schedule } from '../../types/schedule';
import { ScheduleItem } from './ScheduleItem';
import styles from './Schedule.module.css';

interface ScheduleListProps {
  schedules: Schedule[];
  onScheduleClick?: (schedule: Schedule) => void;
  onSwitchToCalendar?: () => void;
}

interface GroupedSchedules {
  [date: string]: Schedule[];
}

function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

export function ScheduleList({ schedules, onScheduleClick, onSwitchToCalendar }: ScheduleListProps) {
  const todayRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const todayString = getTodayString();

  // Group schedules by date
  const groupedSchedules = schedules.reduce<GroupedSchedules>((acc, schedule) => {
    const date = schedule.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(schedule);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedSchedules).sort();

  // Find the closest date to today (today or first future date)
  const findClosestDate = useCallback((): string | null => {
    if (sortedDates.includes(todayString)) {
      return todayString;
    }
    // Find first date >= today
    const futureDate = sortedDates.find((date) => date >= todayString);
    if (futureDate) {
      return futureDate;
    }
    // If no future dates, return last date
    return sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : null;
  }, [sortedDates, todayString]);

  const scrollToToday = useCallback(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Auto-scroll to today on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (todayRef.current) {
        todayRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [schedules]);

  const formatDateHeader = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日(${weekday})`;
  };

  const closestDate = findClosestDate();

  if (schedules.length === 0) {
    return (
      <div className={styles.listEmpty}>
        スケジュールがありません
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      <div className={styles.floatingButtons}>
        <button
          className={styles.floatingButton}
          onClick={scrollToToday}
          type="button"
          aria-label="今日へジャンプ"
        >
          今日
        </button>
        {onSwitchToCalendar && (
          <button
            className={styles.floatingButton}
            onClick={onSwitchToCalendar}
            type="button"
            aria-label="カレンダー表示に切り替え"
          >
            📅
          </button>
        )}
      </div>
      <div className={styles.list} ref={listRef}>
        {sortedDates.map((date) => (
          <div
            key={date}
            className={`${styles.listDateGroup} ${date === todayString ? styles.listDateGroupToday : ''}`}
            ref={date === closestDate ? todayRef : undefined}
          >
            <h3 className={styles.listDateHeader}>
              {formatDateHeader(date)}
              {date === todayString && <span className={styles.todayBadge}>今日</span>}
            </h3>
            <div className={styles.listItems}>
              {groupedSchedules[date].map((schedule) => (
                <ScheduleItem
                  key={schedule.code}
                  schedule={schedule}
                  onClick={onScheduleClick}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
