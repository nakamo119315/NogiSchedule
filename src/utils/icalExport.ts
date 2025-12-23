import type { Schedule } from '../types/schedule';

function formatICalDate(dateStr: string, timeStr?: string): string {
  const [year, month, day] = dateStr.split('/');
  if (timeStr) {
    const [hour, minute] = timeStr.split(':');
    return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}T${hour.padStart(2, '0')}${minute.padStart(2, '0')}00`;
  }
  return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
}

function generateUID(schedule: Schedule): string {
  return `${schedule.code}@nogizaka46-schedule`;
}

function getCurrentTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hour}${minute}${second}`;
}

function foldLine(line: string): string {
  const maxLength = 75;
  if (line.length <= maxLength) {
    return line;
  }

  const lines: string[] = [];
  let remaining = line;

  while (remaining.length > 0) {
    if (lines.length === 0) {
      lines.push(remaining.substring(0, maxLength));
      remaining = remaining.substring(maxLength);
    } else {
      lines.push(' ' + remaining.substring(0, maxLength - 1));
      remaining = remaining.substring(maxLength - 1);
    }
  }

  return lines.join('\r\n');
}

export function generateICalContent(schedules: Schedule[]): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nogizaka46 Schedule Viewer//NONSGML v1.0//JP',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:乃木坂46 スケジュール',
    'X-WR-TIMEZONE:Asia/Tokyo',
  ];

  const timestamp = getCurrentTimestamp();

  for (const schedule of schedules) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${generateUID(schedule)}`);
    lines.push(`DTSTAMP:${timestamp}`);

    if (schedule.startTime) {
      lines.push(`DTSTART;TZID=Asia/Tokyo:${formatICalDate(schedule.date, schedule.startTime)}`);
      if (schedule.endTime) {
        lines.push(`DTEND;TZID=Asia/Tokyo:${formatICalDate(schedule.date, schedule.endTime)}`);
      }
    } else {
      lines.push(`DTSTART;VALUE=DATE:${formatICalDate(schedule.date)}`);
    }

    lines.push(foldLine(`SUMMARY:${escapeICalText(schedule.title)}`));

    if (schedule.description) {
      lines.push(foldLine(`DESCRIPTION:${escapeICalText(schedule.description)}`));
    }

    if (schedule.link) {
      lines.push(`URL:${schedule.link}`);
    }

    const categoryLabel = getCategoryLabel(schedule.category);
    if (categoryLabel) {
      lines.push(`CATEGORIES:${categoryLabel}`);
    }

    lines.push('END:VEVENT');
  }

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    tv: 'TV',
    radio: 'ラジオ',
    live: 'ライブ',
    cd: 'CD/音楽',
    other: 'その他',
  };
  return labels[category] || category;
}

export function downloadICalFile(schedules: Schedule[], filename?: string): void {
  const content = generateICalContent(schedules);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().split('T')[0];
  const defaultFilename = `nogizaka46-schedule-${today}.ics`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
