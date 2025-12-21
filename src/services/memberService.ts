import type { Member, Generation } from '../types/member';
import type { MemberApiResponse, MemberApiItem } from '../types/api';
import { getCachedData, setCachedData, CACHE_KEYS } from '../utils/cache';
import { fetchJsonp } from '../utils/jsonp';

const MEMBER_API_URL = 'https://www.nogizaka46.com/s/n46/api/list/member';

const VALID_GENERATIONS: Generation[] = ['1期生', '2期生', '3期生', '4期生', '5期生', '6期生'];

function mapMember(api: MemberApiItem): Member {
  const generation = VALID_GENERATIONS.includes(api.cate as Generation)
    ? (api.cate as Generation)
    : '6期生'; // fallback

  return {
    code: api.code,
    name: api.name,
    englishName: api.english_name || undefined,
    kana: api.kana || undefined,
    generation,
    imageUrl: api.img || undefined,
    isGraduated: api.graduation === 'YES',
    profileLink: api.link || undefined,
  };
}

export async function fetchMembers(): Promise<Member[]> {
  // Check cache first
  const cacheKey = CACHE_KEYS.members();
  const cached = getCachedData<Member[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await fetchJsonp<MemberApiResponse>(
      MEMBER_API_URL,
      'callback',
      20000
    );

    if (!data.data || !Array.isArray(data.data)) {
      return [];
    }

    const members = data.data.map(mapMember);

    // Cache the result
    setCachedData(cacheKey, members, false);

    return members;
  } catch (error) {
    console.error('Failed to fetch members:', error);

    // Try to return cached data even if expired
    const expiredCache = getCachedData<Member[]>(cacheKey);
    if (expiredCache) {
      return expiredCache;
    }

    throw error;
  }
}

export function getCachedMembers(): Member[] | null {
  const cacheKey = CACHE_KEYS.members();
  return getCachedData<Member[]>(cacheKey);
}

// Create a member lookup map for efficient name resolution
let memberMap: Map<string, Member> | null = null;

export function buildMemberMap(members: Member[]): void {
  memberMap = new Map(members.map((m) => [m.code, m]));
}

export function getMemberByCode(code: string): Member | undefined {
  return memberMap?.get(code);
}

export function getMemberName(code: string): string {
  const member = memberMap?.get(code);
  return member?.name || '不明';
}
