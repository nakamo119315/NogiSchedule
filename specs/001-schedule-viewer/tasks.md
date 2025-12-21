# Tasks: 乃木坂46スケジュールビューアー

**Input**: Design documents from `/specs/001-schedule-viewer/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: テストは明示的に要求されていないため、オプションとして記載。必要に応じて追加可能。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths follow plan.md structure

---

## Phase 1: Setup (Project Initialization)

**Purpose**: React + Vite + TypeScript プロジェクトの初期化

- [x] T001 Create Vite React TypeScript project with `npm create vite@latest . -- --template react-ts`
- [x] T002 Install dependencies: `npm install fetch-jsonp date-fns` in package.json
- [x] T003 [P] Configure Vite base path for GitHub Pages in vite.config.ts
- [x] T004 [P] Setup ESLint and Prettier configuration in .eslintrc.cjs and .prettierrc
- [x] T005 [P] Create 404.html for SPA routing fallback in public/404.html
- [x] T006 [P] Setup CSS variables for category colors in src/index.css

**Checkpoint**: Project builds and runs with `npm run dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 全ユーザーストーリーで共有する型定義・サービス・ユーティリティ

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 [P] Create Schedule type definition in src/types/schedule.ts
- [x] T008 [P] Create Member type definition in src/types/member.ts
- [x] T009 [P] Create Category type and constants in src/types/category.ts
- [x] T010 [P] Create API response types in src/types/api.ts
- [x] T011 Create cache utility functions (get/set/clear) in src/utils/cache.ts
- [x] T012 Create date utility functions (formatMonth, getDaysInMonth, etc.) in src/utils/date.ts
- [x] T013 Implement ScheduleService with JSONP fetch and caching in src/services/scheduleService.ts
- [x] T014 Implement MemberService with JSONP fetch and caching in src/services/memberService.ts
- [x] T015 Create useSchedules custom hook in src/hooks/useSchedules.ts
- [x] T016 Create useMembers custom hook in src/hooks/useMembers.ts
- [x] T017 [P] Create Loading component in src/components/common/Loading.tsx
- [x] T018 [P] Create ErrorMessage component with retry button in src/components/common/ErrorMessage.tsx

**Checkpoint**: Foundation ready - services fetch and cache data correctly

---

## Phase 3: User Story 1 - スケジュール一覧の閲覧 (Priority: P1) 🎯 MVP

**Goal**: 月間カレンダー形式でスケジュールを表示し、日付ごとにイベントがカテゴリ別色分けで確認できる

**Independent Test**: アプリを開くと当月のスケジュールがカレンダー形式で表示され、各イベントの日時・タイトルが確認できる

### Implementation for User Story 1

- [x] T019 [US1] Create CalendarHeader component (month title, prev/next buttons) in src/components/Calendar/CalendarHeader.tsx
- [x] T020 [US1] Create CalendarGrid component (7-column CSS Grid layout) in src/components/Calendar/CalendarGrid.tsx
- [x] T021 [US1] Create CalendarDay component (single day cell with schedule items) in src/components/Calendar/CalendarDay.tsx
- [x] T022 [US1] Create ScheduleItem component (compact schedule display with category color) in src/components/Schedule/ScheduleItem.tsx
- [x] T023 [US1] Create CalendarView container component combining header and grid in src/components/Calendar/CalendarView.tsx
- [x] T024 [US1] Create useCalendar hook for month navigation state in src/hooks/useCalendar.ts
- [x] T025 [US1] Implement calendar styles with CSS Modules in src/components/Calendar/Calendar.module.css
- [x] T026 [US1] Integrate CalendarView into App.tsx with data fetching in src/App.tsx
- [x] T027 [US1] Add empty state message for months with no schedules in src/components/Calendar/CalendarView.tsx

**Checkpoint**: User Story 1 complete - カレンダーでスケジュール一覧を閲覧でき、月切り替えが動作する

---

## Phase 4: User Story 2 - メンバーでフィルタリング (Priority: P2)

**Goal**: 推しメンバーを選択してスケジュールをフィルタリングできる

**Independent Test**: メンバーを選択すると、そのメンバーが出演するスケジュールのみ表示される

### Implementation for User Story 2

- [x] T028 [US2] Create MemberChip component (selectable member badge) in src/components/Filter/MemberChip.tsx
- [x] T029 [US2] Create MemberGroup component (generation-grouped member list) in src/components/Filter/MemberGroup.tsx
- [x] T030 [US2] Create MemberFilter component (filter panel with toggle for graduated members) in src/components/Filter/MemberFilter.tsx
- [x] T031 [US2] Create useFilter hook for filter state management in src/hooks/useFilter.ts
- [x] T032 [US2] Implement member filter styles in src/components/Filter/Filter.module.css
- [x] T033 [US2] Add filter logic to schedules (filter by selected member codes) in src/utils/filterSchedules.ts
- [x] T034 [US2] Integrate MemberFilter into App.tsx and connect to CalendarView in src/App.tsx
- [x] T035 [US2] Add "No matching schedules" message when filter yields empty results in src/components/Calendar/CalendarView.tsx

**Checkpoint**: User Story 2 complete - メンバーフィルタリングが動作し、複数選択も可能

---

## Phase 5: User Story 3 - カテゴリでフィルタリング (Priority: P3)

**Goal**: カテゴリ（TV、ラジオ、ライブ等）でスケジュールをフィルタリングできる

**Independent Test**: カテゴリを選択すると、そのカテゴリのスケジュールのみ表示される

### Implementation for User Story 3

- [x] T036 [US3] Create CategoryChip component (color-coded category badge) in src/components/Filter/CategoryChip.tsx
- [x] T037 [US3] Create CategoryFilter component (category selection panel) in src/components/Filter/CategoryFilter.tsx
- [x] T038 [US3] Extend useFilter hook to include category filter state in src/hooks/useFilter.ts
- [x] T039 [US3] Add category filter logic to filterSchedules utility in src/utils/filterSchedules.ts
- [x] T040 [US3] Integrate CategoryFilter into App.tsx alongside MemberFilter in src/App.tsx
- [x] T041 [US3] Add combined filter badge/indicator showing active filters in src/components/Filter/ActiveFilters.tsx

**Checkpoint**: User Story 3 complete - カテゴリフィルタリングが動作し、メンバーフィルタと組み合わせ可能

---

## Phase 6: User Story 4 - スケジュール詳細の確認 (Priority: P4)

**Goal**: スケジュール項目をタップして詳細情報（時間、出演メンバー一覧、説明等）を確認できる

**Independent Test**: スケジュール項目をタップすると詳細画面が表示される

### Implementation for User Story 4

- [x] T042 [US4] Create ScheduleDetail component (full schedule information display) in src/components/Schedule/ScheduleDetail.tsx
- [x] T043 [US4] Create Modal component (overlay container for detail view) in src/components/common/Modal.tsx
- [x] T044 [US4] Create MemberList component (list of appearing members with links) in src/components/Schedule/MemberList.tsx
- [x] T045 [US4] Implement modal styles in src/components/common/Modal.module.css
- [x] T046 [US4] Add detail view state management to App.tsx (selected schedule) in src/App.tsx
- [x] T047 [US4] Connect ScheduleItem click to open detail modal in src/components/Schedule/ScheduleItem.tsx
- [x] T048 [US4] Add member name click handler to apply filter and close modal in src/components/Schedule/MemberList.tsx
- [x] T049 [US4] Add external link button to official site in ScheduleDetail in src/components/Schedule/ScheduleDetail.tsx

**Checkpoint**: User Story 4 complete - スケジュール詳細が確認でき、メンバー名クリックでフィルタ適用

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: レスポンシブ対応、オフライン対応、パフォーマンス最適化

- [x] T050 [P] Add responsive styles for mobile (320px+) in src/index.css
- [x] T051 [P] Implement offline detection and cache-first fallback in src/hooks/useOffline.ts
- [x] T052 [P] Add last updated timestamp display for cached data in src/components/common/CacheStatus.tsx
- [x] T053 [P] Create GitHub Actions workflow for deployment in .github/workflows/deploy.yml
- [x] T054 Performance optimization: lazy load schedule details on demand
- [x] T055 Add keyboard navigation support for calendar in src/components/Calendar/CalendarGrid.tsx
- [x] T056 Final build verification: `npm run build` and test in preview mode

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - US1 (P1): Can start after Foundational
  - US2 (P2): Can start after US1 (uses CalendarView)
  - US3 (P3): Can start after US2 (extends useFilter)
  - US4 (P4): Can start after US1 (uses ScheduleItem)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3)
                          ↓
                    Phase 6 (US4)
                          ↓
                    Phase 7 (Polish)
```

### Parallel Opportunities

**Phase 1 Setup**:
```bash
# These can run in parallel:
T003 (vite.config.ts) | T004 (.eslintrc) | T005 (404.html) | T006 (index.css)
```

**Phase 2 Foundational**:
```bash
# Type definitions can run in parallel:
T007 (schedule.ts) | T008 (member.ts) | T009 (category.ts) | T010 (api.ts)

# Common components can run in parallel:
T017 (Loading.tsx) | T018 (ErrorMessage.tsx)
```

**Phase 7 Polish**:
```bash
# These can run in parallel:
T050 (responsive) | T051 (offline) | T052 (cache status) | T053 (deploy workflow)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: カレンダーでスケジュール一覧が表示されることを確認
5. Deploy/demo if ready - これだけでも価値を提供できる

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. User Story 1 → Test independently → Deploy/Demo (MVP!)
3. User Story 2 → Test independently → Deploy/Demo (メンバーフィルタ追加)
4. User Story 3 → Test independently → Deploy/Demo (カテゴリフィルタ追加)
5. User Story 4 → Test independently → Deploy/Demo (詳細表示追加)
6. Polish → Final release

### Task Count Summary

| Phase | Tasks | Parallel Opportunities |
|-------|-------|------------------------|
| Setup | 6 | 4 |
| Foundational | 12 | 6 |
| US1 (P1) | 9 | 0 (sequential) |
| US2 (P2) | 8 | 0 (sequential) |
| US3 (P3) | 6 | 0 (sequential) |
| US4 (P4) | 8 | 0 (sequential) |
| Polish | 7 | 4 |
| **Total** | **56** | **14** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
