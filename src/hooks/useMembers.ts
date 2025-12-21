import { useState, useEffect, useCallback } from 'react';
import type { Member } from '../types/member';
import { fetchMembers, getCachedMembers, buildMemberMap } from '../services/memberService';

interface UseMembersResult {
  members: Member[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useMembers(): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMembers();
      setMembers(data);
      buildMemberMap(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch members'));
      // Try to use cached data as fallback
      const cached = getCachedMembers();
      if (cached) {
        setMembers(cached);
        buildMemberMap(cached);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { members, isLoading, error, refetch };
}
