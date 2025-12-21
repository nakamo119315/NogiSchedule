import { useState, useCallback } from 'react';
import type { CategoryType } from '../types/schedule';

interface FilterState {
  selectedMembers: string[];
  selectedCategories: CategoryType[];
  showGraduatedMembers: boolean;
}

interface UseFilterResult extends FilterState {
  toggleMember: (code: string) => void;
  toggleCategory: (category: CategoryType) => void;
  toggleShowGraduatedMembers: () => void;
  clearMemberFilter: () => void;
  clearCategoryFilter: () => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

export function useFilter(): UseFilterResult {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [showGraduatedMembers, setShowGraduatedMembers] = useState(false);

  const toggleMember = useCallback((code: string) => {
    setSelectedMembers((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code]
    );
  }, []);

  const toggleCategory = useCallback((category: CategoryType) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }, []);

  const toggleShowGraduatedMembers = useCallback(() => {
    setShowGraduatedMembers((prev) => !prev);
  }, []);

  const clearMemberFilter = useCallback(() => {
    setSelectedMembers([]);
  }, []);

  const clearCategoryFilter = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedMembers([]);
    setSelectedCategories([]);
  }, []);

  const hasActiveFilters = selectedMembers.length > 0 || selectedCategories.length > 0;

  return {
    selectedMembers,
    selectedCategories,
    showGraduatedMembers,
    toggleMember,
    toggleCategory,
    toggleShowGraduatedMembers,
    clearMemberFilter,
    clearCategoryFilter,
    clearAllFilters,
    hasActiveFilters,
  };
}
