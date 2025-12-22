import type { Schedule, CategoryType } from '../types/schedule';

interface FilterOptions {
  memberCodes?: string[];
  categories?: CategoryType[];
}

export function filterSchedules(
  schedules: Schedule[],
  options: FilterOptions
): Schedule[] {
  const { memberCodes = [], categories = [] } = options;

  return schedules.filter((schedule) => {
    // Member filter: schedule must include at least one selected member
    // OR have no member information (show schedules without member data)
    if (memberCodes.length > 0) {
      const hasNoMemberInfo = schedule.memberCodes.length === 0;
      const hasMatchingMember = schedule.memberCodes.some((code) =>
        memberCodes.includes(code)
      );
      if (!hasNoMemberInfo && !hasMatchingMember) {
        return false;
      }
    }

    // Category filter: schedule must match one of selected categories
    if (categories.length > 0) {
      if (!categories.includes(schedule.category)) {
        return false;
      }
    }

    return true;
  });
}
