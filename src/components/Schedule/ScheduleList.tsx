import type { Schedule } from '../../types/schedule';
import { ScheduleItem } from './ScheduleItem';
import styles from './Schedule.module.css';

interface ScheduleListProps {
  schedules: Schedule[];
  onScheduleClick?: (schedule: Schedule) => void;
}

interface GroupedSchedules {
  [date: string]: Schedule[];
}

export function ScheduleList({ schedules, onScheduleClick }: ScheduleListProps) {
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

  const formatDateHeader = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日(${weekday})`;
  };

  if (schedules.length === 0) {
    return (
      <div className={styles.listEmpty}>
        スケジュールがありません
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {sortedDates.map((date) => (
        <div key={date} className={styles.listDateGroup}>
          <h3 className={styles.listDateHeader}>{formatDateHeader(date)}</h3>
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
  );
}
