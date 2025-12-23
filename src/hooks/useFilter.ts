import { useState, useCallback } from 'react';
import type { CategoryType } from '../types/schedule';
import { getInitialFavoritesForFilter } from './useFavorites';

interface FilterState {
  selectedMembers: string[];
  selectedCategories: CategoryType[];
  showGraduatedMembers: boolean;
  searchKeyword: string;
}

interface UseFilterResult extends FilterState {
  toggleMember: (code: string) => void;
  toggleCategory: (category: CategoryType) => void;
  toggleShowGraduatedMembers: () => void;
  clearMemberFilter: () => void;
  clearCategoryFilter: () => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  setSearchKeyword: (keyword: string) => void;
  clearSearchKeyword: () => void;
  setSelectedMembers: (members: string[]) => void;
}

export function useFilter(): UseFilterResult {
  const [selectedMembers, setSelectedMembers] = useState<string[]>(() => {
    return getInitialFavoritesForFilter();
  });
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [showGraduatedMembers, setShowGraduatedMembers] = useState(false);
  const [searchKeyword, setSearchKeywordState] = useState('');

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
    setSearchKeywordState('');
  }, []);

  const setSearchKeyword = useCallback((keyword: string) => {
    setSearchKeywordState(keyword);
  }, []);

  const clearSearchKeyword = useCallback(() => {
    setSearchKeywordState('');
  }, []);

  const hasActiveFilters =
    selectedMembers.length > 0 ||
    selectedCategories.length > 0 ||
    searchKeyword.trim() !== '';

  return {
    selectedMembers,
    selectedCategories,
    showGraduatedMembers,
    searchKeyword,
    toggleMember,
    toggleCategory,
    toggleShowGraduatedMembers,
    clearMemberFilter,
    clearCategoryFilter,
    clearAllFilters,
    hasActiveFilters,
    setSearchKeyword,
    clearSearchKeyword,
    setSelectedMembers,
  };
}
