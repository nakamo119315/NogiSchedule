import type { Member } from '../../types/member';
import styles from './Filter.module.css';

interface MemberChipProps {
  member: Member;
  isSelected: boolean;
  onToggle: (code: string) => void;
}

export function MemberChip({ member, isSelected, onToggle }: MemberChipProps) {
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
      {member.name}
    </button>
  );
}
