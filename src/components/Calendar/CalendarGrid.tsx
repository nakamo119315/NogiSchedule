import type { Schedule } from '../../types/schedule';
import { CalendarDay } from './CalendarDay';
import {
  getDaysInMonth,
  getMonthStartPadding,
  getMonthEndPadding,
  WEEKDAYS,
  isSameMonthAs,
} from '../../utils/date';
import { subDays, addDays } from 'date-fns';
import styles from './Calendar.module.css';

interface CalendarGridProps {
  currentMonth: Date;
  schedules: Schedule[];
  onScheduleClick?: (schedule: Schedule) => void;
}

export function CalendarGrid({
  currentMonth,
  schedules,
  onScheduleClick,
}: CalendarGridProps) {
  const days = getDaysInMonth(currentMonth);
  const startPadding = getMonthStartPadding(currentMonth);
  const endPadding = getMonthEndPadding(currentMonth);

  // Get padding days from previous month
  const paddingBefore = Array.from({ length: startPadding }, (_, i) =>
    subDays(days[0], startPadding - i)
  );

  // Get padding days from next month
  const paddingAfter = Array.from({ length: endPadding }, (_, i) =>
    addDays(days[days.length - 1], i + 1)
  );

  const allDays = [...paddingBefore, ...days, ...paddingAfter];

  return (
    <div className={styles.grid}>
      {/* Weekday headers */}
      {WEEKDAYS.map((day, index) => (
        <div
          key={day}
          className={`${styles.weekday} ${index === 0 ? styles.weekdaySunday : ''} ${index === 6 ? styles.weekdaySaturday : ''}`}
        >
          {day}
        </div>
      ))}

      {/* Calendar days */}
      {allDays.map((date) => (
        <CalendarDay
          key={date.toISOString()}
          date={date}
          schedules={schedules}
          isCurrentMonth={isSameMonthAs(date, currentMonth)}
          onScheduleClick={onScheduleClick}
        />
      ))}
    </div>
  );
}
