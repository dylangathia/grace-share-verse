import { motion } from "framer-motion";
import { Loader2, ArrowDown } from "lucide-react";

interface Props {
  pullDistance: number;
  refreshing: boolean;
  threshold?: number;
}

const PullToRefreshIndicator = ({ pullDistance, refreshing, threshold = 80 }: Props) => {
  if (pullDistance === 0 && !refreshing) return null;

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <motion.div
      className="flex items-center justify-center overflow-hidden"
      style={{ height: refreshing ? 48 : pullDistance }}
      animate={refreshing ? { height: 48 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {refreshing ? (
        <Loader2 size={20} className="animate-spin text-accent" />
      ) : (
        <motion.div
          style={{ rotate: progress * 180, opacity: Math.max(0.3, progress) }}
        >
          <ArrowDown size={20} className="text-muted-foreground" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default PullToRefreshIndicator;
