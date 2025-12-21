import fetchJsonp from 'fetch-jsonp';
import type { Schedule, CategoryType } from '../types/schedule';
import type { ScheduleApiResponse, ScheduleApiItem } from '../types/api';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';

const SCHEDULE_API_BASE = 'https://www.nogizaka46.com/s/n46/api/list/schedule';

function mapCategory(cate: string): CategoryType {
  const validCategories: CategoryType[] = ['tv', 'radio', 'live', 'cd'];
  if (validCategories.includes(cate as CategoryType)) {
    return cate as CategoryType;
  }
  return 'other';
}

function flattenMemberCodes(codes: string[][]): string[] {
  if (!Array.isArray(codes)) return [];
  return codes.flat().filter(Boolean);
}

function mapSchedule(api: ScheduleApiItem): Schedule {
  return {
    code: api.code,
    title: api.title,
    date: api.date,
    startTime: api.start_time || undefined,
    endTime: api.end_time || undefined,
    category: mapCategory(api.cate),
    description: api.text || undefined,
    link: api.link || undefined,
    memberCodes: flattenMemberCodes(api.arti_code),
  };
}

export async function fetchSchedules(yearMonth: string): Promise<Schedule[]> {
  // Check cache first
  const cacheKey = CACHE_KEYS.schedules(yearMonth);
  const cached = getCachedData<Schedule[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetchJsonp(`${SCHEDULE_API_BASE}?dy=${yearMonth}`, {
      jsonpCallbackFunction: 'res',
      timeout: 10000,
    });

    const data = (await response.json()) as ScheduleApiResponse;

    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    const schedules = data.data.map(mapSchedule);

    // Cache the result
    setCachedData(cacheKey, schedules, true);

    return schedules;
  } catch (error) {
    console.error('Failed to fetch schedules:', error);

    // Try to return cached data even if expired
    const expiredCache = getCachedData<Schedule[]>(cacheKey);
    if (expiredCache) {
      return expiredCache;
    }

    throw error;
  }
}

export function getCachedSchedules(yearMonth: string): Schedule[] | null {
  const cacheKey = CACHE_KEYS.schedules(yearMonth);
  return getCachedData<Schedule[]>(cacheKey);
}
