import type { CategoryType } from './schedule';

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'tv', name: 'TV', color: 'var(--color-tv)' },
  { id: 'radio', name: 'ラジオ', color: 'var(--color-radio)' },
  { id: 'live', name: 'ライブ', color: 'var(--color-live)' },
  { id: 'cd', name: 'CD/音楽', color: 'var(--color-cd)' },
  { id: 'other', name: 'その他', color: 'var(--color-other)' },
];

export const getCategoryInfo = (categoryId: CategoryType): CategoryInfo => {
  return CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[4]; // default to 'other'
};
