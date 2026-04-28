import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface ReadingStreakBadgeProps {
  streak: number;
  readToday: boolean;
  size?: "sm" | "md";
}

const ReadingStreakBadge = ({ streak, readToday, size = "md" }: ReadingStreakBadgeProps) => {
  const isActive = streak > 0;
  const isSmall = size === "sm";

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-body font-semibold transition-colors ${
        isSmall ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      } ${
        isActive
          ? readToday
            ? "bg-accent/15 text-accent"
            : "bg-muted text-muted-foreground"
          : "bg-muted text-muted-foreground"
      }`}
      title={
        isActive
          ? readToday
            ? `${streak}-day reading streak — keep it going!`
            : `${streak}-day streak — read today to keep it alive`
          : "Start a reading streak today"
      }
    >
      <motion.span
        animate={isActive && readToday ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.6, repeat: Infinity }}
      >
        <Flame
          size={isSmall ? 12 : 14}
          className={isActive && readToday ? "fill-accent text-accent" : ""}
        />
      </motion.span>
      <span>{streak} {isSmall ? "" : streak === 1 ? "day" : "days"}</span>
    </motion.div>
  );
};

export default ReadingStreakBadge;
