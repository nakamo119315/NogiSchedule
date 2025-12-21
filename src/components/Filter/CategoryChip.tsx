import type { CategoryInfo } from '../../types/category';
import styles from './Filter.module.css';

interface CategoryChipProps {
  category: CategoryInfo;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function CategoryChip({ category, isSelected, onToggle }: CategoryChipProps) {
  const handleClick = () => {
    onToggle(category.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(category.id);
    }
  };

  const chipStyle = isSelected
    ? { backgroundColor: category.color, borderColor: category.color }
    : { backgroundColor: 'transparent', borderColor: category.color };

  return (
    <button
      className={`${styles.categoryChip} ${isSelected ? styles.categoryChipSelected : ''}`}
      style={chipStyle}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      type="button"
      aria-pressed={isSelected}
    >
      <span
        className={styles.categoryDot}
        style={{ backgroundColor: isSelected ? 'white' : category.color }}
      />
      {category.name}
    </button>
  );
}
