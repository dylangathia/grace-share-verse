import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, BellOff, Clock, Sun, Moon, Sunrise, Check } from "lucide-react";
import { toast } from "sonner";
import { loadNotifSettings, saveNotifSettings, NotifSettings } from "@/hooks/use-notification-scheduler";
import { useTheme } from "@/hooks/use-theme";

const presets = [
  { label: "Dawn", time: "06:00", icon: Sunrise },
  { label: "Morning", time: "07:30", icon: Sun },
  { label: "Noon", time: "12:00", icon: Sun },
  { label: "Evening", time: "20:00", icon: Moon },
];

const Settings = () => {
  const [settings, setSettings] = useState<NotifSettings>(loadNotifSettings);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    saveNotifSettings(settings);
  }, [settings]);

  const supported = typeof window !== "undefined" && "Notification" in window;

  const requestPermission = async () => {
    if (!supported) {
      toast.error("Notifications are not supported on this device");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      toast.success("Notifications enabled");
      setSettings((s) => ({ ...s, enabled: true }));
    } else {
      toast("Notification permission was not granted", {
        description: "You can enable it in your browser settings.",
      });
    }
  };

  const toggleEnabled = async () => {
    if (!settings.enabled) {
      if (permission !== "granted") {
        await requestPermission();
        return;
      }
      setSettings((s) => ({ ...s, enabled: true }));
      toast(`Daily verse set for ${formatTime(settings.time)}`);
    } else {
      setSettings((s) => ({ ...s, enabled: false }));
      toast("Daily verse notifications turned off");
    }
  };

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="section-header">Settings</h2>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Personalize your Sanctuary experience
        </p>
      </div>

      {/* Daily Verse Notification */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="prayer-card mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
              {settings.enabled ? <Bell size={18} className="text-accent" /> : <BellOff size={18} className="text-muted-foreground" />}
            </div>
            <div>
              <h3 className="font-display font-semibold text-base">Daily Verse</h3>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                Get a gentle reminder to open the Word
              </p>
            </div>
          </div>
          <button
            onClick={toggleEnabled}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              settings.enabled ? "bg-accent" : "bg-muted"
            }`}
            aria-label={settings.enabled ? "Disable" : "Enable"}
          >
            <motion.span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-background rounded-full shadow"
              animate={{ x: settings.enabled ? 20 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Time picker */}
        <div className={`transition-opacity ${settings.enabled ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
          <p className="text-[10px] uppercase tracking-widest font-body font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Clock size={10} /> Reminder time
          </p>

          <div className="flex items-center gap-3 mb-3">
            <input
              type="time"
              value={settings.time}
              onChange={(e) => setSettings({ ...settings, time: e.target.value })}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm font-body font-medium focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <span className="text-sm text-muted-foreground font-body">
              {formatTime(settings.time)}
            </span>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-4 gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setSettings({ ...settings, time: p.time })}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg border transition-colors ${
                  settings.time === p.time
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                <p.icon size={14} />
                <span className="text-[10px] font-body font-medium">{p.label}</span>
                <span className="text-[9px] font-body opacity-70">{formatTime(p.time)}</span>
              </button>
            ))}
          </div>

          {permission === "denied" && (
            <p className="mt-3 text-[11px] font-body text-destructive">
              Browser notifications are blocked. Enable them in your browser settings to receive reminders.
            </p>
          )}
        </div>
      </motion.div>

      {/* Theme */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="prayer-card mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
              {theme === "light" ? <Sun size={18} className="text-accent" /> : <Moon size={18} className="text-accent" />}
            </div>
            <div>
              <h3 className="font-display font-semibold text-base">Appearance</h3>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                {theme === "light" ? "Parchment (light)" : "Deep Sanctuary (dark)"}
              </p>
            </div>
          </div>
          <button onClick={toggleTheme} className="text-xs font-body font-medium text-accent hover:underline">
            Switch to {theme === "light" ? "dark" : "light"}
          </button>
        </div>
      </motion.div>

      {/* About */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="prayer-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Check size={18} className="text-accent" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base">Sanctuary</h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Grace Community Church · v1.0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
