import { useMemo, useState } from 'react';
import { useCalendar } from './hooks/useCalendar';
import { useSchedules } from './hooks/useSchedules';
import { useMembers } from './hooks/useMembers';
import { useFilter } from './hooks/useFilter';
import { useTheme } from './hooks/useTheme';
import { useFavorites } from './hooks/useFavorites';
import { CalendarView } from './components/Calendar/CalendarView';
import { MemberFilter } from './components/Filter/MemberFilter';
import { CategoryFilter } from './components/Filter/CategoryFilter';
import { ActiveFilters } from './components/Filter/ActiveFilters';
import { SearchInput } from './components/Filter/SearchInput';
import { Modal } from './components/common/Modal';
import { ViewToggle, type ViewMode } from './components/common/ViewToggle';
import { ExportButton } from './components/common/ExportButton';
import { ScheduleDetail } from './components/Schedule/ScheduleDetail';
import { ScheduleList } from './components/Schedule/ScheduleList';
import { Loading } from './components/common/Loading';
import { ErrorMessage } from './components/common/ErrorMessage';
import { SettingsModal } from './components/Settings/SettingsModal';
import { filterSchedules } from './utils/filterSchedules';
import type { Schedule } from './types/schedule';

function App() {
  const { currentMonth, goToNextMonth, goToPrevMonth, goToToday } = useCalendar();
  const { schedules, isLoading, error, refetch, lastUpdated } = useSchedules(currentMonth);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };
  const { members, isLoading: isMembersLoading } = useMembers();
  const { theme, setTheme } = useTheme();
  const {
    favoriteMembers,
    autoApplyFilter,
    toggleFavorite,
    setAutoApplyFilter,
  } = useFavorites();
  const {
    selectedMembers,
    selectedCategories,
    showGraduatedMembers,
    searchKeyword,
    toggleMember,
    toggleCategory,
    toggleShowGraduatedMembers,
    clearMemberFilter,
    clearCategoryFilter,
    clearAllFilters,
    hasActiveFilters,
    setSearchKeyword,
    clearSearchKeyword,
    setSelectedMembers,
  } = useFilter();

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const filteredSchedules = useMemo(() => {
    return filterSchedules(schedules, {
      memberCodes: selectedMembers,
      categories: selectedCategories,
      keyword: searchKeyword,
    });
  }, [schedules, selectedMembers, selectedCategories, searchKeyword]);

  const handleScheduleClick = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleCloseDetail = () => {
    setSelectedSchedule(null);
  };

  const handleMemberClickFromDetail = (code: string) => {
    toggleMember(code);
  };

  const handleApplyFavoritesToFilter = () => {
    setSelectedMembers(favoriteMembers);
  };

  const emptyMessage = hasActiveFilters
    ? '選択したフィルターに一致するスケジュールはありません'
    : 'この月のスケジュールはありません';

  return (
    <div className="app">
      <header className="app-header">
        <h1>乃木坂46 スケジュールビューアー</h1>
        <div className="header-buttons">
          <button
            className="refresh-button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            type="button"
            aria-label="更新"
            title={lastUpdated ? `最終更新: ${lastUpdated.toLocaleTimeString()}` : '更新'}
          >
            <span className={isRefreshing ? 'spinning' : ''} aria-hidden="true">🔄</span>
          </button>
          <button
            className="settings-button"
            onClick={() => setIsSettingsOpen(true)}
            type="button"
            aria-label="設定"
          >
            <span aria-hidden="true">⚙️</span>
          </button>
        </div>
      </header>

      <main>
        <SearchInput
          value={searchKeyword}
          onChange={setSearchKeyword}
          onClear={clearSearchKeyword}
        />

        <MemberFilter
          members={members}
          selectedMembers={selectedMembers}
          showGraduatedMembers={showGraduatedMembers}
          favoriteMembers={favoriteMembers}
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
          <ExportButton schedules={filteredSchedules} />
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
            onSwitchToList={() => setViewMode('list')}
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
                currentMonth={currentMonth}
                onScheduleClick={handleScheduleClick}
                onSwitchToCalendar={() => setViewMode('calendar')}
                onPrevMonth={goToPrevMonth}
                onNextMonth={goToNextMonth}
                onToday={goToToday}
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

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        members={members}
        favoriteMembers={favoriteMembers}
        autoApplyFilter={autoApplyFilter}
        onToggleFavorite={toggleFavorite}
        onAutoApplyFilterChange={setAutoApplyFilter}
        onApplyFavoritesToFilter={handleApplyFavoritesToFilter}
      />
    </div>
  );
}

export default App;
