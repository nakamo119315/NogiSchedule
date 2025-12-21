import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilter } from './useFilter';

describe('useFilter', () => {
  it('initializes with empty filters', () => {
    const { result } = renderHook(() => useFilter());

    expect(result.current.selectedMembers).toEqual([]);
    expect(result.current.selectedCategories).toEqual([]);
    expect(result.current.showGraduatedMembers).toBe(false);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  describe('toggleMember', () => {
    it('adds member to selection', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleMember('member1');
      });

      expect(result.current.selectedMembers).toEqual(['member1']);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('removes member from selection', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleMember('member1');
      });
      act(() => {
        result.current.toggleMember('member1');
      });

      expect(result.current.selectedMembers).toEqual([]);
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('handles multiple members', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleMember('member1');
      });
      act(() => {
        result.current.toggleMember('member2');
      });

      expect(result.current.selectedMembers).toEqual(['member1', 'member2']);
    });
  });

  describe('toggleCategory', () => {
    it('adds category to selection', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleCategory('tv');
      });

      expect(result.current.selectedCategories).toEqual(['tv']);
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('removes category from selection', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleCategory('tv');
      });
      act(() => {
        result.current.toggleCategory('tv');
      });

      expect(result.current.selectedCategories).toEqual([]);
    });
  });

  describe('toggleShowGraduatedMembers', () => {
    it('toggles graduated members visibility', () => {
      const { result } = renderHook(() => useFilter());

      expect(result.current.showGraduatedMembers).toBe(false);

      act(() => {
        result.current.toggleShowGraduatedMembers();
      });

      expect(result.current.showGraduatedMembers).toBe(true);

      act(() => {
        result.current.toggleShowGraduatedMembers();
      });

      expect(result.current.showGraduatedMembers).toBe(false);
    });
  });

  describe('clearMemberFilter', () => {
    it('clears all selected members', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleMember('member1');
        result.current.toggleMember('member2');
      });
      act(() => {
        result.current.clearMemberFilter();
      });

      expect(result.current.selectedMembers).toEqual([]);
    });
  });

  describe('clearCategoryFilter', () => {
    it('clears all selected categories', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleCategory('tv');
        result.current.toggleCategory('radio');
      });
      act(() => {
        result.current.clearCategoryFilter();
      });

      expect(result.current.selectedCategories).toEqual([]);
    });
  });

  describe('clearAllFilters', () => {
    it('clears both members and categories', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleMember('member1');
        result.current.toggleCategory('tv');
      });
      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.selectedMembers).toEqual([]);
      expect(result.current.selectedCategories).toEqual([]);
      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe('hasActiveFilters', () => {
    it('is true when members are selected', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleMember('member1');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('is true when categories are selected', () => {
      const { result } = renderHook(() => useFilter());

      act(() => {
        result.current.toggleCategory('tv');
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });

    it('is false when no filters are active', () => {
      const { result } = renderHook(() => useFilter());

      expect(result.current.hasActiveFilters).toBe(false);
    });
  });
});
