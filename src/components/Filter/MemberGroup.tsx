import type { Member, Generation } from '../../types/member';
import { MemberChip } from './MemberChip';
import styles from './Filter.module.css';

interface MemberGroupProps {
  generation: Generation;
  members: Member[];
  selectedMembers: string[];
  onToggleMember: (code: string) => void;
}

export function MemberGroup({
  generation,
  members,
  selectedMembers,
  onToggleMember,
}: MemberGroupProps) {
  if (members.length === 0) {
    return null;
  }

  return (
    <div className={styles.group}>
      <h4 className={styles.groupTitle}>{generation}</h4>
      <div className={styles.groupMembers}>
        {members.map((member) => (
          <MemberChip
            key={member.code}
            member={member}
            isSelected={selectedMembers.includes(member.code)}
            onToggle={onToggleMember}
          />
        ))}
      </div>
    </div>
  );
}
