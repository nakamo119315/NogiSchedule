import { formatMonth } from '../../utils/date';
import styles from './Calendar.module.css';

interface CalendarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <header className={styles.header}>
      <button
        className={styles.navButton}
        onClick={onPrevMonth}
        aria-label="前月"
        type="button"
      >
        ◀
      </button>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>{formatMonth(currentMonth)}</h2>
        <button
          className={styles.todayButton}
          onClick={onToday}
          type="button"
        >
          今日
        </button>
      </div>
      <button
        className={styles.navButton}
        onClick={onNextMonth}
        aria-label="次月"
        type="button"
      >
        ▶
      </button>
    </header>
  );
}
