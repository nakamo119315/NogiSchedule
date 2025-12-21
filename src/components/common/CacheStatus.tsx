import { useOffline } from '../../hooks/useOffline';
import styles from './CacheStatus.module.css';

interface CacheStatusProps {
  lastUpdated?: Date | null;
}

export function CacheStatus({ lastUpdated }: CacheStatusProps) {
  const isOffline = useOffline();

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isOffline) {
    return (
      <div className={`${styles.status} ${styles.offline}`}>
        <span className={styles.dot} />
        オフライン - キャッシュからデータを表示中
      </div>
    );
  }

  if (lastUpdated) {
    return (
      <div className={styles.status}>
        <span className={styles.dot} />
        最終更新: {formatTime(lastUpdated)}
      </div>
    );
  }

  return null;
}
