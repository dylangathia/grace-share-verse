import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sanctuary-reading-streak";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null; // YYYY-MM-DD
  totalDaysRead: number;
}

const defaultData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastReadDate: null,
  totalDaysRead: 0,
};

const todayStr = () => new Date().toISOString().split("T")[0];

const daysBetween = (a: string, b: string) => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
};

export const useReadingStreak = () => {
  const [data, setData] = useState<StreakData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...defaultData, ...JSON.parse(raw) };
    } catch {}
    return defaultData;
  });

  // Adjust streak on load if a day was missed
  useEffect(() => {
    if (!data.lastReadDate) return;
    const diff = daysBetween(data.lastReadDate, todayStr());
    if (diff > 1 && data.currentStreak !== 0) {
      const updated = { ...data, currentStreak: 0 };
      setData(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markRead = useCallback(() => {
    const today = todayStr();
    if (data.lastReadDate === today) return false; // already counted

    const diff = data.lastReadDate ? daysBetween(data.lastReadDate, today) : null;
    const newStreak = diff === 1 ? data.currentStreak + 1 : 1;
    const updated: StreakData = {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, data.longestStreak),
      lastReadDate: today,
      totalDaysRead: data.totalDaysRead + 1,
    };
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true; // newly marked
  }, [data]);

  const readToday = data.lastReadDate === todayStr();

  return { ...data, readToday, markRead };
};
