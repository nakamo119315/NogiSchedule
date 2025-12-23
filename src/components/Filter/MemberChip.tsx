import type { Member } from '../../types/member';
import styles from './Filter.module.css';

interface MemberChipProps {
  member: Member;
  isSelected: boolean;
  isFavorite?: boolean;
  onToggle: (code: string) => void;
}

export function MemberChip({
  member,
  isSelected,
  isFavorite = false,
  onToggle,
}: MemberChipProps) {
  const handleClick = () => {
    onToggle(member.code);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(member.code);
    }
  };

  return (
    <button
      className={`${styles.chip} ${isSelected ? styles.chipSelected : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
      aria-pressed={isSelected}
    >
      {isFavorite && <span className={styles.favoriteIcon}>★</span>}
      {member.name}
    </button>
  );
}
