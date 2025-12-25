export type CategoryType = 'tv' | 'radio' | 'live' | 'cd' | 'other';

export interface Schedule {
  code: string;
  title: string;
  date: string; // YYYY/MM/DD
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  category: CategoryType;
  description?: string;
  link?: string;
  memberCodes: string[];
}
