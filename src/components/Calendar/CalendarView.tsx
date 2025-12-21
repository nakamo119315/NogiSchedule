import type { Schedule } from '../../types/schedule';
import { CalendarHeader } from './CalendarHeader';
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
  emptyMessage?: string;
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
  emptyMessage = 'この月のスケジュールはありません',
}: CalendarViewProps) {
  return (
    <div className={styles.container}>
      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onToday={onToday}
      />

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
    </div>
  );
}
