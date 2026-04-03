import { getItem, setItem } from "./storage";

interface StreakData {
  lastDate: string; // YYYY-MM-DD
  current: number;
  longest: number;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function getStreak(): StreakData {
  return getItem<StreakData>("streak", { lastDate: "", current: 0, longest: 0 });
}

export function recordTrainingDay(): StreakData {
  const streak = getStreak();
  const today = todayStr();

  if (streak.lastDate === today) return streak; // already recorded today

  let current: number;
  if (streak.lastDate === yesterdayStr()) {
    current = streak.current + 1; // consecutive
  } else {
    current = 1; // reset
  }

  const longest = Math.max(current, streak.longest);
  const updated = { lastDate: today, current, longest };
  setItem("streak", updated);
  return updated;
}
