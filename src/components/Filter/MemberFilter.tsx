import { useState, useMemo } from 'react';
import type { Member, Generation } from '../../types/member';
import { MemberGroup } from './MemberGroup';
import styles from './Filter.module.css';

interface MemberFilterProps {
  members: Member[];
  selectedMembers: string[];
  showGraduatedMembers: boolean;
  onToggleMember: (code: string) => void;
  onToggleShowGraduated: () => void;
  onClear: () => void;
}

const GENERATIONS: Generation[] = ['6期生', '5期生', '4期生', '3期生', '2期生', '1期生'];

export function MemberFilter({
  members,
  selectedMembers,
  showGraduatedMembers,
  onToggleMember,
  onToggleShowGraduated,
  onClear,
}: MemberFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredMembers = useMemo(() => {
    return showGraduatedMembers
      ? members
      : members.filter((m) => !m.isGraduated);
  }, [members, showGraduatedMembers]);

  const membersByGeneration = useMemo(() => {
    const grouped: Record<string, Member[]> = {};
    GENERATIONS.forEach((gen) => {
      grouped[gen] = filteredMembers
        .filter((m) => m.generation === gen)
        .sort((a, b) => a.kana?.localeCompare(b.kana || '') || 0);
    });
    return grouped;
  }, [filteredMembers]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterHeader}>
        <button
          className={styles.filterToggle}
          onClick={toggleExpanded}
          type="button"
          aria-expanded={isExpanded}
        >
          <span>メンバー</span>
          {selectedMembers.length > 0 && (
            <span className={styles.badge}>{selectedMembers.length}</span>
          )}
          <span className={styles.arrow}>{isExpanded ? '▲' : '▼'}</span>
        </button>
        {selectedMembers.length > 0 && (
          <button
            className={styles.clearButton}
            onClick={onClear}
            type="button"
          >
            クリア
          </button>
        )}
      </div>

      {isExpanded && (
        <div className={styles.filterContent}>
          <label className={styles.toggleLabel}>
            <input
              type="checkbox"
              checked={showGraduatedMembers}
              onChange={onToggleShowGraduated}
            />
            卒業メンバーも表示
          </label>

          <div className={styles.groups}>
            {GENERATIONS.map((generation) => (
              <MemberGroup
                key={generation}
                generation={generation}
                members={membersByGeneration[generation] || []}
                selectedMembers={selectedMembers}
                onToggleMember={onToggleMember}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
