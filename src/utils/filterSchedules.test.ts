import { describe, it, expect } from 'vitest';
import { filterSchedules } from './filterSchedules';
import type { Schedule } from '../types/schedule';

const mockSchedules: Schedule[] = [
  {
    code: '1',
    title: 'TV番組A',
    date: '2024/01/15',
    category: 'tv',
    memberCodes: ['member1', 'member2'],
  },
  {
    code: '2',
    title: 'ラジオ番組B',
    date: '2024/01/16',
    category: 'radio',
    memberCodes: ['member2', 'member3'],
  },
  {
    code: '3',
    title: 'ライブC',
    date: '2024/01/17',
    category: 'live',
    memberCodes: ['member1'],
  },
  {
    code: '4',
    title: 'CD発売',
    date: '2024/01/18',
    category: 'cd',
    memberCodes: [],
  },
];

describe('filterSchedules', () => {
  it('returns all schedules when no filters applied', () => {
    const result = filterSchedules(mockSchedules, {});
    expect(result).toHaveLength(4);
  });

  it('filters by member codes (includes schedules without member info)', () => {
    const result = filterSchedules(mockSchedules, {
      memberCodes: ['member1'],
    });
    // Includes member1 schedules + schedule without member info (code '4')
    expect(result).toHaveLength(3);
    expect(result.map((s) => s.code)).toEqual(['1', '3', '4']);
  });

  it('filters by multiple member codes (OR logic, includes schedules without member info)', () => {
    const result = filterSchedules(mockSchedules, {
      memberCodes: ['member1', 'member3'],
    });
    // Includes member1/member3 schedules + schedule without member info
    expect(result).toHaveLength(4);
    expect(result.map((s) => s.code)).toEqual(['1', '2', '3', '4']);
  });

  it('filters by category', () => {
    const result = filterSchedules(mockSchedules, {
      categories: ['tv'],
    });
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('1');
  });

  it('filters by multiple categories', () => {
    const result = filterSchedules(mockSchedules, {
      categories: ['tv', 'radio'],
    });
    expect(result).toHaveLength(2);
    expect(result.map((s) => s.code)).toEqual(['1', '2']);
  });

  it('combines member and category filters (AND logic)', () => {
    const result = filterSchedules(mockSchedules, {
      memberCodes: ['member2'],
      categories: ['tv'],
    });
    // Only TV schedule with member2 (code '1'), no empty member schedule matches TV category
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('1');
  });

  it('combines member and category filters with empty member schedule', () => {
    const result = filterSchedules(mockSchedules, {
      memberCodes: ['member1'],
      categories: ['cd'],
    });
    // CD schedule has no member info, so it should be included
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('4');
  });

  it('returns schedules without member info when filter is active', () => {
    const result = filterSchedules(mockSchedules, {
      memberCodes: ['nonexistent'],
    });
    // Should include schedule '4' which has no member codes
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('4');
  });

  it('includes schedules without member info along with matching schedules', () => {
    const result = filterSchedules(mockSchedules, {
      memberCodes: ['member1'],
    });
    // Should include schedules with member1 AND schedule without member info
    expect(result).toHaveLength(3);
    expect(result.map((s) => s.code)).toEqual(['1', '3', '4']);
  });

  it('handles empty member codes array', () => {
    const result = filterSchedules(mockSchedules, {
      memberCodes: [],
    });
    expect(result).toHaveLength(4);
  });

  it('handles empty categories array', () => {
    const result = filterSchedules(mockSchedules, {
      categories: [],
    });
    expect(result).toHaveLength(4);
  });
});
