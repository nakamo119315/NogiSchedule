import { useState } from 'react';
import type { CategoryType } from '../../types/schedule';
import { CATEGORIES } from '../../types/category';
import { CategoryChip } from './CategoryChip';
import styles from './Filter.module.css';

interface CategoryFilterProps {
  selectedCategories: CategoryType[];
  onToggleCategory: (category: CategoryType) => void;
  onClear: () => void;
}

export function CategoryFilter({
  selectedCategories,
  onToggleCategory,
  onClear,
}: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <button
          className={styles.filterToggle}
          onClick={toggleExpanded}
          type="button"
          aria-expanded={isExpanded}
        >
          <span>カテゴリ</span>
          {selectedCategories.length > 0 && (
            <span className={styles.badge}>{selectedCategories.length}</span>
          )}
          <span className={styles.arrow}>{isExpanded ? '▲' : '▼'}</span>
        </button>
        {selectedCategories.length > 0 && (
          <button
            className={styles.clearButton}
            onClick={onClear}
            type="button"
          >
            クリア
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={styles.filterContent}>
          <div className={styles.groupMembers}>
            {CATEGORIES.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                isSelected={selectedCategories.includes(category.id)}
                onToggle={(id) => onToggleCategory(id as CategoryType)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
