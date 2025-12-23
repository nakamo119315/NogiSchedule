import { Modal } from '../common/Modal';
import type { Theme } from '../../hooks/useTheme';
import type { Member } from '../../types/member';
import styles from './Settings.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  members: Member[];
  favoriteMembers: string[];
  autoApplyFilter: boolean;
  onToggleFavorite: (code: string) => void;
  onAutoApplyFilterChange: (value: boolean) => void;
  onApplyFavoritesToFilter: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  members,
  favoriteMembers,
  autoApplyFilter,
  onToggleFavorite,
  onAutoApplyFilterChange,
  onApplyFavoritesToFilter,
}: SettingsModalProps) {
  const sortedMembers = [...members]
    .filter((m) => !m.isGraduated)
    .sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  const handleApplyAndClose = () => {
    onApplyFavoritesToFilter();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="設定">
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>テーマ</h3>
        <div className={styles.themeToggle}>
          <button
            className={`${styles.themeOption} ${theme === 'light' ? styles.themeOptionActive : ''}`}
            onClick={() => onThemeChange('light')}
            type="button"
            aria-pressed={theme === 'light'}
          >
            <span className={styles.themeIcon}>☀️</span>
            <span>ライト</span>
          </button>
          <button
            className={`${styles.themeOption} ${theme === 'dark' ? styles.themeOptionActive : ''}`}
            onClick={() => onThemeChange('dark')}
            type="button"
            aria-pressed={theme === 'dark'}
          >
            <span className={styles.themeIcon}>🌙</span>
            <span>ダーク</span>
          </button>
          <button
            className={`${styles.themeOption} ${theme === 'system' ? styles.themeOptionActive : ''}`}
            onClick={() => onThemeChange('system')}
            type="button"
            aria-pressed={theme === 'system'}
          >
            <span className={styles.themeIcon}>💻</span>
            <span>システム</span>
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>推しメン設定</h3>
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={autoApplyFilter}
            onChange={(e) => onAutoApplyFilterChange(e.target.checked)}
          />
          <span className={styles.checkboxLabel}>
            起動時に推しメンで自動フィルタ
          </span>
        </label>

        <p className={styles.favoriteCount}>
          {favoriteMembers.length > 0
            ? `${favoriteMembers.length}人選択中`
            : 'メンバーをタップして推しメンに追加'}
        </p>

        <div className={styles.memberGrid}>
          {sortedMembers.map((member) => {
            const isFavorite = favoriteMembers.includes(member.code);
            return (
              <button
                key={member.code}
                className={`${styles.memberChip} ${isFavorite ? styles.memberChipSelected : ''}`}
                onClick={() => onToggleFavorite(member.code)}
                type="button"
                aria-pressed={isFavorite}
              >
                <span className={styles.starIcon}>{isFavorite ? '★' : '☆'}</span>
                <span>{member.name}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
            onClick={handleApplyAndClose}
            type="button"
          >
            フィルタに適用
          </button>
          <button
            className={`${styles.actionButton} ${styles.actionButtonSecondary}`}
            onClick={onClose}
            type="button"
          >
            閉じる
          </button>
        </div>
      </div>
    </Modal>
  );
}
