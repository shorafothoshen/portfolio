import type { ContributionDay } from "./types";

export type Cell = ContributionDay | null;

/** Day গুলোকে GitHub এর মতো Sunday-শুরু week column এ ভাগ করে (শুরু/শেষের ফাঁকা ঘর null)। */
export function buildWeeks(days: ContributionDay[]): Cell[][] {
  if (days.length === 0) return [];
  const weeks: Cell[][] = [];
  let current: Cell[] = [];

  const firstWeekday = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  for (let i = 0; i < firstWeekday; i++) current.push(null);

  for (const day of days) {
    current.push(day);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }
  if (current.length > 0) {
    while (current.length < 7) current.push(null);
    weeks.push(current);
  }
  return weeks;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** মাসের নাম কোন column এ বসবে। খুব কাছাকাছি label বাদ দেয়। */
export function monthLabels(weeks: Cell[][]): { col: number; label: string }[] {
  const labels: { col: number; label: string; month: number }[] = [];
  let prevMonth = -1;

  weeks.forEach((week, col) => {
    const first = week.find((c): c is ContributionDay => c !== null);
    if (!first) return;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (month !== prevMonth) {
      labels.push({ col, label: MONTHS[month], month });
      prevMonth = month;
    }
  });

  // শুরুর partial মাসের জন্য জায়গা না থাকলে সেটা বাদ
  if (labels.length > 1 && labels[1].col - labels[0].col < 3) labels.shift();

  return labels.map(({ col, label }) => ({ col, label }));
}

export function formatDay(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
