import type { Schedule } from '../../types/schedule';
import { downloadICalFile } from '../../utils/icalExport';
import styles from './ExportButton.module.css';

interface ExportButtonProps {
  schedules: Schedule[];
  disabled?: boolean;
}

export function ExportButton({ schedules, disabled = false }: ExportButtonProps) {
  const handleExport = () => {
    if (schedules.length === 0) {
      return;
    }
    downloadICalFile(schedules);
  };

  return (
    <button
      className={styles.exportButton}
      onClick={handleExport}
      disabled={disabled || schedules.length === 0}
      type="button"
      aria-label="カレンダーをエクスポート"
      title={schedules.length === 0 ? 'エクスポートするスケジュールがありません' : `${schedules.length}件のスケジュールをエクスポート`}
    >
      <span className={styles.icon}>📅</span>
      <span>エクスポート</span>
    </button>
  );
}
