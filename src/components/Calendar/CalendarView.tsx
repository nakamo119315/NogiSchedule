import type { Schedule } from '../../types/schedule';
import { CalendarGrid } from './CalendarGrid';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import styles from './Calendar.module.css';

interface CalendarViewProps {
  currentMonth: Date;
  schedules: Schedule[];
  isLoading: boolean;
  error: Error | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onRetry: () => void;
  onScheduleClick?: (schedule: Schedule) => void;
  onSwitchToList?: () => void;
  emptyMessage?: string;
}

function formatMonthTitle(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}年${month}月`;
}

export function CalendarView({
  currentMonth,
  schedules,
  isLoading,
  error,
  onPrevMonth,
  onNextMonth,
  onToday,
  onRetry,
  onScheduleClick,
  onSwitchToList,
  emptyMessage = 'この月のスケジュールはありません',
}: CalendarViewProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.monthTitle}>{formatMonthTitle(currentMonth)}</h2>

      {isLoading && <Loading message="スケジュールを読み込み中..." />}

      {error && !isLoading && (
        <ErrorMessage
          message="スケジュールの取得に失敗しました"
          onRetry={onRetry}
        />
      )}

      {!isLoading && !error && (
        <>
          <CalendarGrid
            currentMonth={currentMonth}
            schedules={schedules}
            onScheduleClick={onScheduleClick}
          />
          {schedules.length === 0 && (
            <p className={styles.emptyMessage}>{emptyMessage}</p>
          )}
        </>
      )}

      <div className={styles.floatingNav}>
        <button
          className={styles.floatingButton}
          onClick={onPrevMonth}
          type="button"
          aria-label="前月"
        >
          ◀
        </button>
        <button
          className={styles.floatingButton}
          onClick={onToday}
          type="button"
          aria-label="今日"
        >
          今日
        </button>
        <button
          className={styles.floatingButton}
          onClick={onNextMonth}
          type="button"
          aria-label="次月"
        >
          ▶
        </button>
      </div>

      {onSwitchToList && (
        <button
          className={styles.floatingViewToggle}
          onClick={onSwitchToList}
          type="button"
          aria-label="リスト表示に切り替え"
        >
          📋
        </button>
      )}
    </div>
  );
}
