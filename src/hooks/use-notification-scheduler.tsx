import { useEffect, useRef } from "react";

const SETTINGS_KEY = "sanctuary-notif-settings";
const LAST_FIRED_KEY = "sanctuary-notif-last-fired";

export interface NotifSettings {
  enabled: boolean;
  time: string; // "HH:MM"
}

export const defaultSettings: NotifSettings = { enabled: false, time: "07:00" };

export const loadNotifSettings = (): NotifSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export const saveNotifSettings = (s: NotifSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  window.dispatchEvent(new CustomEvent("sanctuary-notif-changed"));
};

const todayKey = () => new Date().toISOString().split("T")[0];

/**
 * Background scheduler. Mounted once (in Index.tsx). Polls every minute and
 * fires a Notification when the user-chosen time arrives, once per day.
 */
export const useNotificationScheduler = () => {
  const settingsRef = useRef<NotifSettings>(loadNotifSettings());

  useEffect(() => {
    const refresh = () => {
      settingsRef.current = loadNotifSettings();
    };
    window.addEventListener("sanctuary-notif-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("sanctuary-notif-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const s = settingsRef.current;
      if (!s.enabled) return;
      if (typeof window === "undefined" || !("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      const now = new Date();
      const [h, m] = s.time.split(":").map(Number);
      if (now.getHours() !== h || now.getMinutes() !== m) return;

      const last = localStorage.getItem(LAST_FIRED_KEY);
      const today = todayKey();
      if (last === today) return;

      try {
        new Notification("Sanctuary — Verse of the Day", {
          body: "Your daily scripture is ready. Open Sanctuary to read and reflect.",
          icon: "/favicon.ico",
          tag: "sanctuary-daily-verse",
        });
        localStorage.setItem(LAST_FIRED_KEY, today);
      } catch {}
    };

    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
};
