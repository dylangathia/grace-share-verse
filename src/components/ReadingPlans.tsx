import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Users, MessageSquare, Check, ChevronRight, ArrowLeft } from "lucide-react";

interface Reflection {
  id: number;
  author: string;
  text: string;
  timeAgo: string;
}

interface DayReading {
  day: number;
  passage: string;
  completed: boolean;
  reflections: Reflection[];
}

interface Plan {
  id: string;
  title: string;
  group: string;
  progress: number;
  totalDays: number;
  members: number;
  readings: DayReading[];
}

const plans: Plan[] = [
  {
    id: "psalms",
    title: "30 Days of Psalms",
    group: "Grace Community",
    progress: 12,
    totalDays: 30,
    members: 18,
    readings: [
      { day: 12, passage: "Psalm 23 — The Lord is My Shepherd", completed: true, reflections: [
        { id: 1, author: "Sarah M.", text: "Verse 4 really spoke to me today. Even in dark times, His presence is enough.", timeAgo: "3h ago" },
        { id: 2, author: "David K.", text: "I love how the psalm moves from 'He' to 'You' — it becomes personal in the valley.", timeAgo: "5h ago" },
        { id: 3, author: "Grace L.", text: "'My cup overflows' — what a beautiful picture of God's abundance.", timeAgo: "8h ago" },
      ]},
      { day: 13, passage: "Psalm 27 — The Lord is My Light", completed: false, reflections: [] },
      { day: 14, passage: "Psalm 34 — Taste and See", completed: false, reflections: [] },
    ],
  },
  {
    id: "gospel-john",
    title: "Gospel of John",
    group: "Youth Ministry",
    progress: 5,
    totalDays: 21,
    members: 12,
    readings: [
      { day: 5, passage: "John 4 — The Woman at the Well", completed: true, reflections: [
        { id: 1, author: "Rachel T.", text: "Jesus meets us where we are, not where we should be. So powerful.", timeAgo: "1h ago" },
      ]},
      { day: 6, passage: "John 5 — Healing at the Pool", completed: false, reflections: [] },
    ],
  },
];

const ReadingPlans = () => {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [activeDay, setActiveDay] = useState<DayReading | null>(null);
  const [newReflection, setNewReflection] = useState("");
  const [localPlans, setLocalPlans] = useState(plans);

  const handleAddReflection = () => {
    if (!newReflection.trim() || !activePlan || !activeDay) return;
    const reflection: Reflection = {
      id: Date.now(),
      author: "John",
      text: newReflection,
      timeAgo: "Just now",
    };
    setLocalPlans((prev) =>
      prev.map((p) =>
        p.id === activePlan.id
          ? {
              ...p,
              readings: p.readings.map((r) =>
                r.day === activeDay.day
                  ? { ...r, reflections: [...r.reflections, reflection] }
                  : r
              ),
            }
          : p
      )
    );
    setActiveDay((prev) => prev ? { ...prev, reflections: [...prev.reflections, reflection] } : prev);
    setNewReflection("");
  };

  // Day detail view
  if (activeDay && activePlan) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <button
          onClick={() => setActiveDay(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back to {activePlan.title}
        </button>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-accent font-body font-semibold mb-2">Day {activeDay.day}</p>
          <h2 className="section-header">{activeDay.passage}</h2>
        </div>

        <div className="prayer-card mb-6 bg-primary/5">
          <p className="font-display italic text-sm leading-relaxed text-foreground/80">
            "The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."
          </p>
          <p className="text-xs text-accent font-body font-semibold mt-3">— Psalm 23:1-3</p>
        </div>

        {/* Reflections */}
        <div className="mb-6">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-semibold mb-4 flex items-center gap-2">
            <MessageSquare size={12} /> Group Reflections ({activeDay.reflections.length})
          </h3>
          <div className="space-y-3">
            {activeDay.reflections.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="prayer-card"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-[10px] font-body font-medium">{r.author[0]}</span>
                  </div>
                  <span className="text-sm font-body font-medium">{r.author}</span>
                  <span className="text-xs text-muted-foreground">{r.timeAgo}</span>
                </div>
                <p className="text-sm font-body leading-relaxed text-foreground/85">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add reflection */}
        <div className="flex gap-2">
          <input
            value={newReflection}
            onChange={(e) => setNewReflection(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddReflection()}
            placeholder="Share your reflection..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button onClick={handleAddReflection} className="gold-button text-sm">Share</button>
        </div>
      </div>
    );
  }

  // Plan detail view
  if (activePlan) {
    const plan = localPlans.find((p) => p.id === activePlan.id) || activePlan;
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <button
          onClick={() => setActivePlan(null)}
          className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-6 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> All Plans
        </button>

        <div className="mb-6">
          <h2 className="section-header">{plan.title}</h2>
          <p className="text-sm text-muted-foreground font-body mt-1 flex items-center gap-2">
            <Users size={14} /> {plan.group} · {plan.members} members
          </p>
        </div>

        {/* Progress */}
        <div className="prayer-card mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-body text-muted-foreground">Progress</span>
            <span className="text-xs font-body font-semibold text-accent">{plan.progress}/{plan.totalDays} days</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(plan.progress / plan.totalDays) * 100}%` }}
              className="h-full bg-accent rounded-full"
            />
          </div>
        </div>

        {/* Readings */}
        <div className="space-y-2">
          {plan.readings.map((reading) => (
            <motion.button
              key={reading.day}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setActiveDay(reading)}
              className="prayer-card w-full text-left flex items-center gap-4 hover:border-accent/30"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                reading.completed ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"
              }`}>
                {reading.completed ? <Check size={14} /> : <span className="text-xs font-body">{reading.day}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium truncate">{reading.passage}</p>
                {reading.reflections.length > 0 && (
                  <p className="text-xs text-muted-foreground font-body mt-0.5 flex items-center gap-1">
                    <MessageSquare size={10} /> {reading.reflections.length} reflections
                  </p>
                )}
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  // Plans list
  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="section-header">Reading Plans</h2>
        <p className="text-sm text-muted-foreground font-body mt-1">Read together, grow together</p>
      </div>

      <div className="space-y-4">
        {localPlans.map((plan, i) => (
          <motion.button
            key={plan.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActivePlan(plan)}
            className="prayer-card w-full text-left hover:border-accent/30 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold text-base">{plan.title}</h3>
                <p className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-1">
                  <Users size={12} /> {plan.group} · {plan.members} members
                </p>
              </div>
              <BookOpen size={20} className="text-accent shrink-0" />
            </div>
            <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all"
                style={{ width: `${(plan.progress / plan.totalDays) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground font-body mt-2">Day {plan.progress} of {plan.totalDays}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ReadingPlans;
