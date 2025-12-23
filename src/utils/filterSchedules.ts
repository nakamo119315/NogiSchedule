import type { Schedule, CategoryType } from '../types/schedule';

interface FilterOptions {
  memberCodes?: string[];
  categories?: CategoryType[];
  keyword?: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

export function filterSchedules(
  schedules: Schedule[],
  options: FilterOptions
): Schedule[] {
  const { memberCodes = [], categories = [], keyword = '' } = options;

  return schedules.filter((schedule) => {
    // Keyword filter: title or description must contain the search term
    if (keyword.trim()) {
      const searchTerm = keyword.toLowerCase().trim();
      const titleMatch = schedule.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = schedule.description
        ? stripHtml(schedule.description).toLowerCase().includes(searchTerm)
        : false;

      if (!titleMatch && !descriptionMatch) {
        return false;
      }
    }

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
