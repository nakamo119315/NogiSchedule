import type { Schedule } from '../../types/schedule';
import { getCategoryInfo } from '../../types/category';
import styles from './Schedule.module.css';

interface ScheduleItemProps {
  schedule: Schedule;
  compact?: boolean;
  onClick?: (schedule: Schedule) => void;
}

export function ScheduleItem({ schedule, compact = false, onClick }: ScheduleItemProps) {
  const categoryInfo = getCategoryInfo(schedule.category);

  const handleClick = () => {
    onClick?.(schedule);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(schedule);
    }
  };

  if (compact) {
    return (
      <div
        className={styles.itemCompact}
        style={{ backgroundColor: categoryInfo.color }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        title={schedule.title}
        aria-label={`${schedule.title} - ${categoryInfo.name}`}
      >
        <span className={styles.itemCompactTitle}>{schedule.title}</span>
      </div>
    );
  }

  return (
    <div
      className={styles.item}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div
        className={styles.categoryBadge}
        style={{ backgroundColor: categoryInfo.color }}
      >
        {categoryInfo.name}
      </div>
      <div className={styles.itemContent}>
        <h4 className={styles.itemTitle}>{schedule.title}</h4>
        {schedule.startTime && (
          <span className={styles.itemTime}>
            {schedule.startTime}
            {schedule.endTime && ` - ${schedule.endTime}`}
          </span>
        )}
      </div>
    </div>
  );
}
