import styles from './ViewToggle.module.css';

export type ViewMode = 'calendar' | 'list';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.button} ${currentView === 'calendar' ? styles.active : ''}`}
        onClick={() => onViewChange('calendar')}
        type="button"
        aria-pressed={currentView === 'calendar'}
      >
        カレンダー
      </button>
      <button
        className={`${styles.button} ${currentView === 'list' ? styles.active : ''}`}
        onClick={() => onViewChange('list')}
        type="button"
        aria-pressed={currentView === 'list'}
      >
        リスト
      </button>
    </div>
  );
}
