import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sun, Users, Compass, Shield, ChevronRight, Check, TrendingUp, TrendingDown, Minus, BookOpen, BarChart3 } from "lucide-react";

type Dimension = {
  id: string;
  label: string;
  icon: typeof Heart;
  color: string;
  description: string;
  scripture: { reference: string; text: string };
};

const dimensions: Dimension[] = [
  {
    id: "peace",
    label: "Peace",
    icon: Shield,
    color: "text-blue-500 dark:text-blue-400",
    description: "Inner calm and trust in God's sovereignty",
    scripture: { reference: "Philippians 4:7", text: "And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus." },
  },
  {
    id: "joy",
    label: "Joy",
    icon: Sun,
    color: "text-amber-500 dark:text-amber-400",
    description: "Delight and gratitude in God's presence",
    scripture: { reference: "Nehemiah 8:10", text: "Do not grieve, for the joy of the Lord is your strength." },
  },
  {
    id: "faith",
    label: "Faith",
    icon: Heart,
    color: "text-rose-500 dark:text-rose-400",
    description: "Confidence in God's promises and plan",
    scripture: { reference: "Hebrews 11:1", text: "Now faith is confidence in what we hope for and assurance about what we do not see." },
  },
  {
    id: "connection",
    label: "Connection",
    icon: Users,
    color: "text-emerald-500 dark:text-emerald-400",
    description: "Fellowship with your church community",
    scripture: { reference: "Hebrews 10:25", text: "Not giving up meeting together, as some are in the habit of doing, but encouraging one another." },
  },
  {
    id: "purpose",
    label: "Purpose",
    icon: Compass,
    color: "text-violet-500 dark:text-violet-400",
    description: "Clarity in God's calling for your life",
    scripture: { reference: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." },
  },
];

const levelLabels = ["Struggling", "Low", "Okay", "Good", "Thriving"];

// Dummy historical data
const weeklyHistory = [
  { week: "Mar 3", peace: 3, joy: 4, faith: 4, connection: 2, purpose: 3 },
  { week: "Mar 10", peace: 3, joy: 3, faith: 3, connection: 3, purpose: 3 },
  { week: "Mar 17", peace: 4, joy: 4, faith: 4, connection: 3, purpose: 4 },
  { week: "Mar 24", peace: 4, joy: 5, faith: 4, connection: 4, purpose: 3 },
];

// Dummy congregation pulse
const congregationPulse = {
  totalCheckins: 87,
  totalMembers: 124,
  averages: { peace: 3.4, joy: 3.8, faith: 4.1, connection: 3.0, purpose: 3.5 },
  trends: { peace: "up" as const, joy: "up" as const, faith: "stable" as const, connection: "down" as const, purpose: "up" as const },
  needsPrayer: { connection: 32, peace: 18, purpose: 15 },
};

type Tab = "checkin" | "personal" | "pulse";

const SoulCheck = () => {
  const [tab, setTab] = useState<Tab>("checkin");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [activeDimension, setActiveDimension] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const allRated = dimensions.every((d) => ratings[d.id] !== undefined);
  const currentDim = dimensions.find((d) => d.id === activeDimension);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setTab("personal"), 1500);
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    if (trend === "up") return <TrendingUp size={14} className="text-emerald-500" />;
    if (trend === "down") return <TrendingDown size={14} className="text-rose-500" />;
    return <Minus size={14} className="text-muted-foreground" />;
  };

  const renderCheckin = () => {
    if (submitted) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4"
          >
            <Check size={32} className="text-accent" />
          </motion.div>
          <h3 className="font-display text-xl font-semibold text-foreground">Check-in Complete</h3>
          <p className="text-sm text-muted-foreground font-body mt-2 max-w-sm">
            Thank you for sharing. Your response helps your church community grow stronger together.
          </p>
        </motion.div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground font-body mb-6">
            How are you doing this week? Your responses are anonymous to your church leaders.
          </p>

          <div className="space-y-3">
            {dimensions.map((dim, i) => (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  onClick={() => setActiveDimension(activeDimension === dim.id ? null : dim.id)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all text-left"
                >
                  <div className={`${dim.color}`}>
                    <dim.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-body font-medium text-foreground">{dim.label}</span>
                    <p className="text-[11px] text-muted-foreground font-body">{dim.description}</p>
                  </div>
                  {ratings[dim.id] !== undefined ? (
                    <span className="text-xs font-body font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                      {levelLabels[ratings[dim.id]]}
                    </span>
                  ) : (
                    <ChevronRight size={16} className="text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {activeDimension === dim.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-1 px-1">
                        {/* Rating buttons */}
                        <div className="flex gap-2 mb-3">
                          {levelLabels.map((label, lvl) => (
                            <button
                              key={lvl}
                              onClick={() => {
                                setRatings({ ...ratings, [dim.id]: lvl });
                                // Auto-advance to next unrated
                                const nextUnrated = dimensions.find((d, idx) => idx > i && ratings[d.id] === undefined);
                                setTimeout(() => setActiveDimension(nextUnrated?.id || null), 300);
                              }}
                              className={`flex-1 py-2 rounded-lg text-[11px] font-body font-medium transition-all ${
                                ratings[dim.id] === lvl
                                  ? "bg-accent text-accent-foreground shadow-sm"
                                  : "bg-secondary text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* Scripture suggestion for low ratings */}
                        {ratings[dim.id] !== undefined && ratings[dim.id] <= 1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border-l-4 border-accent rounded-r-lg p-3 bg-accent/5 mb-2"
                          >
                            <div className="flex items-center gap-1.5 mb-1">
                              <BookOpen size={12} className="text-accent" />
                              <span className="text-[10px] font-body font-semibold text-accent uppercase tracking-wide">A word for you</span>
                            </div>
                            <p className="text-xs font-display italic text-foreground/80 leading-relaxed">"{dim.scripture.text}"</p>
                            <p className="text-[10px] font-body font-semibold text-accent mt-1">— {dim.scripture.reference}</p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {allRated && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleSubmit}
              className="gold-button w-full mt-6 py-3 text-sm font-body font-semibold"
            >
              Submit Check-in
            </motion.button>
          )}
        </div>
      </div>
    );
  };

  const renderPersonal = () => {
    const latest = weeklyHistory[weeklyHistory.length - 1];
    const prev = weeklyHistory[weeklyHistory.length - 2];

    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Current snapshot */}
          <div>
            <h3 className="text-sm font-body font-semibold text-foreground mb-3">This Week</h3>
            <div className="grid grid-cols-5 gap-2">
              {dimensions.map((dim) => {
                const val = latest[dim.id as keyof typeof latest] as number;
                const prevVal = prev[dim.id as keyof typeof prev] as number;
                const trend = val > prevVal ? "up" : val < prevVal ? "down" : "stable";
                return (
                  <div key={dim.id} className="bg-card border border-border rounded-xl p-3 text-center">
                    <div className={`${dim.color} mx-auto mb-1`}>
                      <dim.icon size={18} />
                    </div>
                    <p className="text-lg font-display font-bold text-foreground">{val}</p>
                    <p className="text-[10px] font-body text-muted-foreground">{dim.label}</p>
                    <div className="flex justify-center mt-1">{getTrendIcon(trend)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly history */}
          <div>
            <h3 className="text-sm font-body font-semibold text-foreground mb-3">4-Week Journey</h3>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="space-y-3">
                {weeklyHistory.map((week, wi) => (
                  <div key={week.week} className="flex items-center gap-3">
                    <span className="text-xs font-body text-muted-foreground w-14 shrink-0">{week.week}</span>
                    <div className="flex-1 flex gap-1.5">
                      {dimensions.map((dim) => {
                        const val = week[dim.id as keyof typeof week] as number;
                        return (
                          <div key={dim.id} className="flex-1">
                            <div className="h-6 bg-secondary rounded-md overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(val / 5) * 100}%` }}
                                transition={{ delay: wi * 0.1, duration: 0.5 }}
                                className={`h-full rounded-md ${
                                  dim.id === "peace" ? "bg-blue-400/70" :
                                  dim.id === "joy" ? "bg-amber-400/70" :
                                  dim.id === "faith" ? "bg-rose-400/70" :
                                  dim.id === "connection" ? "bg-emerald-400/70" :
                                  "bg-violet-400/70"
                                }`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 mt-3 pl-[68px]">
                {dimensions.map((dim) => (
                  <div key={dim.id} className="flex-1 flex items-center justify-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      dim.id === "peace" ? "bg-blue-400/70" :
                      dim.id === "joy" ? "bg-amber-400/70" :
                      dim.id === "faith" ? "bg-rose-400/70" :
                      dim.id === "connection" ? "bg-emerald-400/70" :
                      "bg-violet-400/70"
                    }`} />
                    <span className="text-[9px] font-body text-muted-foreground">{dim.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personalized insight */}
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-accent" />
              <span className="text-xs font-body font-semibold text-accent">Personal Insight</span>
            </div>
            <p className="text-sm font-body text-foreground/80 leading-relaxed">
              Your <span className="font-semibold text-foreground">joy</span> has been rising steadily — praise God! 
              Consider reaching out to someone in the community this week to strengthen your <span className="font-semibold text-foreground">connection</span>.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderPulse = () => (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Participation */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-body font-semibold text-foreground">This Week's Pulse</h3>
            <span className="text-xs font-body text-muted-foreground">
              {congregationPulse.totalCheckins}/{congregationPulse.totalMembers} checked in
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mb-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(congregationPulse.totalCheckins / congregationPulse.totalMembers) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="h-full bg-accent rounded-full"
            />
          </div>
          <p className="text-[10px] font-body text-muted-foreground">{Math.round((congregationPulse.totalCheckins / congregationPulse.totalMembers) * 100)}% participation</p>
        </div>

        {/* Congregation averages */}
        <div>
          <h3 className="text-sm font-body font-semibold text-foreground mb-3">Congregation Averages</h3>
          <div className="space-y-2">
            {dimensions.map((dim, i) => {
              const avg = congregationPulse.averages[dim.id as keyof typeof congregationPulse.averages];
              const trend = congregationPulse.trends[dim.id as keyof typeof congregationPulse.trends];
              return (
                <motion.div
                  key={dim.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 bg-card border border-border rounded-xl p-3"
                >
                  <div className={dim.color}>
                    <dim.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-body font-medium text-foreground">{dim.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-display font-bold text-foreground">{avg.toFixed(1)}</span>
                        {getTrendIcon(trend)}
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(avg / 5) * 100}%` }}
                        transition={{ delay: i * 0.08, duration: 0.6 }}
                        className={`h-full rounded-full ${
                          dim.id === "peace" ? "bg-blue-400/70" :
                          dim.id === "joy" ? "bg-amber-400/70" :
                          dim.id === "faith" ? "bg-rose-400/70" :
                          dim.id === "connection" ? "bg-emerald-400/70" :
                          "bg-violet-400/70"
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Areas needing prayer */}
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={14} className="text-accent" />
            <span className="text-xs font-body font-semibold text-accent">Areas Needing Prayer</span>
          </div>
          <div className="space-y-2">
            {Object.entries(congregationPulse.needsPrayer)
              .sort(([, a], [, b]) => b - a)
              .map(([key, count]) => {
                const dim = dimensions.find((d) => d.id === key)!;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <dim.icon size={14} className={dim.color} />
                      <span className="text-sm font-body text-foreground">{dim.label}</span>
                    </div>
                    <span className="text-xs font-body text-muted-foreground">
                      {count}% reporting struggle
                    </span>
                  </div>
                );
              })}
          </div>
          <p className="text-xs font-body text-foreground/60 mt-3 italic">
            All data is anonymized. Individual responses are never visible to leaders.
          </p>
        </div>
      </div>
    </div>
  );

  const tabs: { id: Tab; label: string; icon: typeof Heart }[] = [
    { id: "checkin", label: "Check In", icon: Heart },
    { id: "personal", label: "My Journey", icon: TrendingUp },
    { id: "pulse", label: "Church Pulse", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border">
        <h2 className="section-header">Soul Check</h2>
        <p className="text-sm text-muted-foreground font-body mt-1">Weekly spiritual wellness</p>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 pt-4 flex gap-1 bg-background">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-body font-medium transition-colors ${
              tab === t.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15 }}
          className="flex-1 overflow-hidden flex flex-col"
        >
          {tab === "checkin" && renderCheckin()}
          {tab === "personal" && renderPersonal()}
          {tab === "pulse" && renderPulse()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SoulCheck;