import type { Schedule } from '../../types/schedule';
import type { Member } from '../../types/member';
import { getCategoryInfo } from '../../types/category';
import { createSafeHtmlProps } from '../../utils/sanitize';
import { formatFullDateWithWeekday } from '../../utils/date';
import { MemberList } from './MemberList';
import styles from './Schedule.module.css';

interface ScheduleDetailProps {
  schedule: Schedule;
  members: Member[];
  onMemberClick?: (code: string) => void;
  onClose: () => void;
}

export function ScheduleDetail({
  schedule,
  members,
  onMemberClick,
  onClose,
}: ScheduleDetailProps) {
  const categoryInfo = getCategoryInfo(schedule.category);

  const handleMemberClick = (code: string) => {
    onMemberClick?.(code);
    onClose();
  };

  return (
    <div className={styles.detail}>
      <div
        className={styles.detailCategory}
        style={{ backgroundColor: categoryInfo.color }}
      >
        {categoryInfo.name}
      </div>

      <h3 className={styles.detailTitle}>{schedule.title}</h3>

      <div className={styles.detailMeta}>
        <div className={styles.detailMetaItem}>
          <span className={styles.detailLabel}>日付</span>
          <span className={styles.detailValue}>{formatFullDateWithWeekday(schedule.date)}</span>
        </div>

        {(schedule.startTime || schedule.endTime) && (
          <div className={styles.detailMetaItem}>
            <span className={styles.detailLabel}>時間</span>
            <span className={styles.detailValue}>
              {schedule.startTime}
              {schedule.endTime && ` - ${schedule.endTime}`}
            </span>
          </div>
        )}
      </div>

      {schedule.description && (
        <div className={styles.detailDescription}>
          <h4 className={styles.detailSectionTitle}>詳細</h4>
          <div
            className={styles.detailText}
            {...createSafeHtmlProps(schedule.description)}
          />
        </div>
      )}

      <MemberList
        memberCodes={schedule.memberCodes}
        members={members}
        onMemberClick={handleMemberClick}
      />

      {schedule.link && (
        <a
          href={schedule.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.externalLink}
        >
          公式サイトで詳細を見る
        </a>
      )}
    </div>
  );
}
