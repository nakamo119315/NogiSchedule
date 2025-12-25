import { useMemo } from 'react';
import type { Member } from '../../types/member';
import styles from './Schedule.module.css';

interface MemberListProps {
  memberCodes: string[];
  members: Member[];
  onMemberClick?: (code: string) => void;
}

export function MemberList({ memberCodes, members, onMemberClick }: MemberListProps) {
  // O(1)でメンバーを取得できるようにMapを作成
  const memberMap = useMemo(() => {
    return new Map(members.map((m) => [m.code, m]));
  }, [members]);

  if (memberCodes.length === 0) {
    return null;
  }

  const handleMemberClick = (code: string) => {
    onMemberClick?.(code);
  };

  const handleKeyDown = (e: React.KeyboardEvent, code: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onMemberClick?.(code);
    }
  };

  return (
    <div className={styles.memberList}>
      <h4 className={styles.memberListTitle}>出演メンバー</h4>
      <div className={styles.memberChips}>
        {memberCodes.map((code) => {
          const member = memberMap.get(code);
          if (!member) return null;

          return (
            <button
              key={code}
              className={styles.memberChip}
              onClick={() => handleMemberClick(code)}
              onKeyDown={(e) => handleKeyDown(e, code)}
              type="button"
            >
              {member.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
