import { useState } from 'react';
import type { Schedule } from '../../types/schedule';
import { ScheduleItem } from '../Schedule/ScheduleItem';
import { isToday, formatDateSlash } from '../../utils/date';
import styles from './Calendar.module.css';

interface CalendarDayProps {
  date: Date;
  schedules: Schedule[];
  isCurrentMonth: boolean;
  onScheduleClick?: (schedule: Schedule) => void;
}

const MAX_VISIBLE_ITEMS = 3;

export function CalendarDay({
  date,
  schedules,
  isCurrentMonth,
  onScheduleClick,
}: CalendarDayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dateStr = formatDateSlash(date);
  const daySchedules = schedules.filter((s) => s.date === dateStr);
  const today = isToday(date);
  const hasMore = daySchedules.length > MAX_VISIBLE_ITEMS;
  const visibleSchedules = isExpanded ? daySchedules : daySchedules.slice(0, MAX_VISIBLE_ITEMS);

  const handleMoreClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`${styles.day} ${!isCurrentMonth ? styles.dayOtherMonth : ''} ${today ? styles.dayToday : ''} ${isExpanded ? styles.dayExpanded : ''}`}
    >
      <div className={styles.dayNumber}>{date.getDate()}</div>
      <div className={styles.daySchedules}>
        {visibleSchedules.map((schedule) => (
          <ScheduleItem
            key={schedule.code}
            schedule={schedule}
            compact
            onClick={onScheduleClick}
          />
        ))}
        {hasMore && (
          <button
            className={styles.moreCount}
            onClick={handleMoreClick}
            type="button"
          >
            {isExpanded ? '閉じる' : `+${daySchedules.length - MAX_VISIBLE_ITEMS}件`}
          </button>
        )}
      </div>
    </div>
  );
}
