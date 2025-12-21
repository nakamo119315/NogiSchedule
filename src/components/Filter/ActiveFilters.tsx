import type { Member } from '../../types/member';
import type { CategoryType } from '../../types/schedule';
import { getCategoryInfo } from '../../types/category';
import styles from './Filter.module.css';

interface ActiveFiltersProps {
  selectedMembers: string[];
  selectedCategories: CategoryType[];
  members: Member[];
  onRemoveMember: (code: string) => void;
  onRemoveCategory: (category: CategoryType) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  selectedMembers,
  selectedCategories,
  members,
  onRemoveMember,
  onRemoveCategory,
  onClearAll,
}: ActiveFiltersProps) {
  const hasFilters = selectedMembers.length > 0 || selectedCategories.length > 0;

  if (!hasFilters) {
    return null;
  }

  const getMemberName = (code: string): string => {
    const member = members.find((m) => m.code === code);
    return member?.name || code;
  };

  return (
    <div className={styles.activeFilters}>
      {selectedMembers.map((code) => (
        <span key={code} className={styles.activeFilterTag}>
          {getMemberName(code)}
          <button
            onClick={() => onRemoveMember(code)}
            type="button"
            aria-label={`${getMemberName(code)}のフィルターを解除`}
          >
            ×
          </button>
        </span>
      ))}

      {selectedCategories.map((category) => {
        const categoryInfo = getCategoryInfo(category);
        return (
          <span
            key={category}
            className={styles.activeFilterTag}
            style={{ borderColor: categoryInfo.color }}
          >
            {categoryInfo.name}
            <button
              onClick={() => onRemoveCategory(category)}
              type="button"
              aria-label={`${categoryInfo.name}のフィルターを解除`}
            >
              ×
            </button>
          </span>
        );
      })}

      <button
        className={styles.clearButton}
        onClick={onClearAll}
        type="button"
      >
        すべてクリア
      </button>
    </div>
  );
}
