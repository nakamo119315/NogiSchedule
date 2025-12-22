import { useMemo, useState } from 'react';
import { useCalendar } from './hooks/useCalendar';
import { useSchedules } from './hooks/useSchedules';
import { useMembers } from './hooks/useMembers';
import { useFilter } from './hooks/useFilter';
import { CalendarView } from './components/Calendar/CalendarView';
import { MemberFilter } from './components/Filter/MemberFilter';
import { CategoryFilter } from './components/Filter/CategoryFilter';
import { ActiveFilters } from './components/Filter/ActiveFilters';
import { Modal } from './components/common/Modal';
import { ViewToggle, type ViewMode } from './components/common/ViewToggle';
import { ScheduleDetail } from './components/Schedule/ScheduleDetail';
import { ScheduleList } from './components/Schedule/ScheduleList';
import { Loading } from './components/common/Loading';
import { ErrorMessage } from './components/common/ErrorMessage';
import { filterSchedules } from './utils/filterSchedules';
import type { Schedule } from './types/schedule';

function App() {
  const { currentMonth, goToNextMonth, goToPrevMonth, goToToday } = useCalendar();
  const { schedules, isLoading, error, refetch } = useSchedules(currentMonth);
  const { members, isLoading: isMembersLoading } = useMembers();
  const {
    selectedMembers,
    selectedCategories,
    showGraduatedMembers,
    toggleMember,
    toggleCategory,
    toggleShowGraduatedMembers,
    clearMemberFilter,
    clearCategoryFilter,
    clearAllFilters,
    hasActiveFilters,
  } = useFilter();

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  const filteredSchedules = useMemo(() => {
    return filterSchedules(schedules, {
      memberCodes: selectedMembers,
      categories: selectedCategories,
    });
  }, [schedules, selectedMembers, selectedCategories]);

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleCloseDetail = () => {
    setSelectedSchedule(null);
  };

  const handleMemberClickFromDetail = (code: string) => {
    toggleMember(code);
  };

  const emptyMessage = hasActiveFilters
    ? '選択したフィルターに一致するスケジュールはありません'
    : 'この月のスケジュールはありません';

  return (
    <div className="app">
      <header className="app-header">
        <h1>乃木坂46 スケジュールビューアー</h1>
      </header>

      <main>
        <MemberFilter
          members={members}
          selectedMembers={selectedMembers}
          showGraduatedMembers={showGraduatedMembers}
          onToggleMember={toggleMember}
          onToggleShowGraduated={toggleShowGraduatedMembers}
          onClear={clearMemberFilter}
        />

        <CategoryFilter
          selectedCategories={selectedCategories}
          onToggleCategory={toggleCategory}
          onClear={clearCategoryFilter}
        />

        <ActiveFilters
          selectedMembers={selectedMembers}
          selectedCategories={selectedCategories}
          members={members}
          onRemoveMember={toggleMember}
          onRemoveCategory={toggleCategory}
          onClearAll={clearAllFilters}
        />

        <div className="view-controls">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
        </div>

        {viewMode === 'calendar' ? (
          <CalendarView
            currentMonth={currentMonth}
            schedules={filteredSchedules}
            isLoading={isLoading || isMembersLoading}
            error={error}
            onPrevMonth={goToPrevMonth}
            onNextMonth={goToNextMonth}
            onToday={goToToday}
            onRetry={refetch}
            onScheduleClick={handleScheduleClick}
            emptyMessage={emptyMessage}
          />
        ) : (
          <>
            {(isLoading || isMembersLoading) && <Loading message="スケジュールを読み込み中..." />}
            {error && !isLoading && (
              <ErrorMessage
                message="スケジュールの取得に失敗しました"
                onRetry={refetch}
              />
            )}
            {!isLoading && !error && (
              <ScheduleList
                schedules={filteredSchedules}
                onScheduleClick={handleScheduleClick}
                onSwitchToCalendar={() => setViewMode('calendar')}
              />
            )}
          </>
        )}
      </main>

      <Modal
        isOpen={selectedSchedule !== null}
        onClose={handleCloseDetail}
        title="スケジュール詳細"
      >
        {selectedSchedule && (
          <ScheduleDetail
            schedule={selectedSchedule}
            members={members}
            onMemberClick={handleMemberClickFromDetail}
            onClose={handleCloseDetail}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;
