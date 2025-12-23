import { useState, useCallback, useEffect } from 'react';
import { getItem, setItem, getItemSync } from '../utils/storage';

const FAVORITES_KEY = 'nogi_favorite_members';
const AUTO_APPLY_KEY = 'nogi_favorite_auto_apply';

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
  const [favoriteMembers, setFavoriteMembersState] = useState<string[]>(() =>
    getItemSync<string[]>(FAVORITES_KEY, [])
  );
  const [autoApplyFilter, setAutoApplyFilterState] = useState<boolean>(() =>
    getItemSync<boolean>(AUTO_APPLY_KEY, false)
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadFromDB = async () => {
      const storedFavorites = await getItem<string[]>(FAVORITES_KEY);
      const storedAutoApply = await getItem<boolean>(AUTO_APPLY_KEY);

      if (storedFavorites !== null) {
        setFavoriteMembersState(storedFavorites);
      }
      if (storedAutoApply !== null) {
        setAutoApplyFilterState(storedAutoApply);
      }
      setIsInitialized(true);
    };

    loadFromDB();
  }, []);

  // Save to IndexedDB and localStorage when favorites change
  useEffect(() => {
    if (!isInitialized) return;

    setItem(FAVORITES_KEY, favoriteMembers);
    // Also save to localStorage as cache for initial load
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteMembers));
    } catch {
      // ignore
    }
  }, [favoriteMembers, isInitialized]);

  // Save to IndexedDB and localStorage when autoApply changes
  useEffect(() => {
    if (!isInitialized) return;

    setItem(AUTO_APPLY_KEY, autoApplyFilter);
    try {
      localStorage.setItem(AUTO_APPLY_KEY, JSON.stringify(autoApplyFilter));
    } catch {
      // ignore
    }
  }, [autoApplyFilter, isInitialized]);

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
  const autoApply = getItemSync<boolean>(AUTO_APPLY_KEY, false);
  if (autoApply) {
    return getItemSync<string[]>(FAVORITES_KEY, []);
  }
  return [];
}
