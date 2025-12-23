import { useState, useCallback, useEffect } from 'react';

const FAVORITES_KEY = 'nogi_favorite_members';
const AUTO_APPLY_KEY = 'nogi_favorite_auto_apply';

function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    console.warn('Failed to parse stored favorites');
  }
  return [];
}

function getStoredAutoApply(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(AUTO_APPLY_KEY);
    return stored === 'true';
  } catch {
    return false;
  }
}

export interface UseFavoritesResult {
  favoriteMembers: string[];
  autoApplyFilter: boolean;
  isFavorite: (code: string) => boolean;
  toggleFavorite: (code: string) => void;
  setFavorites: (codes: string[]) => void;
  clearFavorites: () => void;
  setAutoApplyFilter: (value: boolean) => void;
}

export function useFavorites(): UseFavoritesResult {
  const [favoriteMembers, setFavoriteMembersState] = useState<string[]>(getStoredFavorites);
  const [autoApplyFilter, setAutoApplyFilterState] = useState<boolean>(getStoredAutoApply);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteMembers));
    } catch {
      console.warn('Failed to save favorites');
    }
  }, [favoriteMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTO_APPLY_KEY, String(autoApplyFilter));
    } catch {
      console.warn('Failed to save auto apply setting');
    }
  }, [autoApplyFilter]);

  const isFavorite = useCallback(
    (code: string) => {
      return favoriteMembers.includes(code);
    },
    [favoriteMembers]
  );

  const toggleFavorite = useCallback((code: string) => {
    setFavoriteMembersState((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }, []);

  const setFavorites = useCallback((codes: string[]) => {
    setFavoriteMembersState(codes);
  }, []);

  const clearFavorites = useCallback(() => {
    setFavoriteMembersState([]);
  }, []);

  const setAutoApplyFilter = useCallback((value: boolean) => {
    setAutoApplyFilterState(value);
  }, []);

  return {
    favoriteMembers,
    autoApplyFilter,
    isFavorite,
    toggleFavorite,
    setFavorites,
    clearFavorites,
    setAutoApplyFilter,
  };
}

export function getInitialFavoritesForFilter(): string[] {
  if (getStoredAutoApply()) {
    return getStoredFavorites();
  }
  return [];
}
