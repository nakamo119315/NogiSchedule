import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, getItemSync } from '../utils/storage';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'nogi_theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function isValidTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

export interface UseThemeResult {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

export function useTheme(): UseThemeResult {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = getItemSync<string>(STORAGE_KEY, 'system');
    return isValidTheme(stored) ? stored : 'system';
  });
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const stored = getItemSync<string>(STORAGE_KEY, 'system');
    if (isValidTheme(stored) && stored !== 'system') {
      return stored;
    }
    return getSystemTheme();
  });
  // Load from IndexedDB on mount
  useEffect(() => {
    const loadFromDB = async () => {
      const storedTheme = await getItem<string>(STORAGE_KEY);
      if (isValidTheme(storedTheme)) {
        setThemeState(storedTheme);
      }
    };

    loadFromDB();
  }, []);

  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(getSystemTheme());
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        setResolvedTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    setItem(STORAGE_KEY, newTheme);
    // Also save to localStorage as cache
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTheme));
    } catch {
      // ignore
    }
  }, []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    isDark: resolvedTheme === 'dark',
  };
}
