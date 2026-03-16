import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Heart, MessageCircle, PenLine, Sunrise, Music, Star, Users, Flame, MessageSquare } from "lucide-react";

interface HomeScreenProps {
  onNavigate: (section: string) => void;
}

interface Reaction {
  id: number;
  author: string;
  text: string;
  timeAgo: string;
}

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const todayVerse = {
    reference: "Lamentations 3:22-23",
    text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
  };

  const [reactions, setReactions] = useState<Reaction[]>([
    { id: 1, author: "Sarah M.", text: "This is exactly what I needed today. His faithfulness is unmatched.", timeAgo: "1h ago" },
    { id: 2, author: "David K.", text: "'New every morning' — what a comfort when yesterday was hard.", timeAgo: "2h ago" },
    { id: 3, author: "Grace L.", text: "Great is thy faithfulness! 🙌", timeAgo: "3h ago" },
  ]);
  const [newReaction, setNewReaction] = useState("");
  const [spokeToMe, setSpokeToMe] = useState(false);
  const [spokeCount, setSpokeCount] = useState(47);

  const handleReaction = () => {
    if (!newReaction.trim()) return;
    setReactions([
      { id: Date.now(), author: "John", text: newReaction, timeAgo: "Just now" },
      ...reactions,
    ]);
    setNewReaction("");
  };

  const quickActions = [
    { id: "bible", icon: BookOpen, label: "Read Bible", desc: "Continue Genesis 1" },
    { id: "prayers", icon: Heart, label: "Prayer Wall", desc: "12 new requests" },
    { id: "live-prayer", icon: Flame, label: "Live Prayer", desc: "5 praying now" },
    { id: "reading-plans", icon: BookOpen, label: "Reading Plans", desc: "Day 12 of Psalms" },
    { id: "worship", icon: Music, label: "Worship", desc: "3 new shares" },
    { id: "milestones", icon: Star, label: "Faith Journey", desc: "5 milestones" },
    { id: "partners", icon: Users, label: "Prayer Partner", desc: "Grace L." },
    { id: "chat", icon: MessageCircle, label: "Community", desc: "5 unread" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-10">
        <div className="flex items-center gap-2 text-accent mb-2">
          <Sunrise size={18} />
          <span className="text-sm font-body font-medium">Good morning</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
          Welcome back, John
        </h1>
      </motion.div>

      {/* Verse of the Day with Reactions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-primary text-primary-foreground rounded-2xl p-5 sm:p-8 mb-4"
      >
        <p className="text-xs uppercase tracking-widest font-body opacity-60 mb-4">Verse of the Day</p>
        <p className="font-display text-lg sm:text-xl leading-relaxed italic mb-4">
          "{todayVerse.text}"
        </p>
        <p className="text-sm font-body font-semibold opacity-80">— {todayVerse.reference}</p>
      </motion.div>

      {/* Verse reactions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="prayer-card mb-6 sm:mb-8"
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => { setSpokeToMe(!spokeToMe); setSpokeCount(spokeToMe ? spokeCount - 1 : spokeCount + 1); }}
            className={`flex items-center gap-2 text-sm font-body transition-colors ${
              spokeToMe ? "text-accent font-medium" : "text-muted-foreground hover:text-accent"
            }`}
          >
            <Heart size={16} className={spokeToMe ? "fill-accent" : ""} />
            <span>{spokeCount} — This spoke to me</span>
          </button>
          <span className="text-xs text-muted-foreground font-body flex items-center gap-1">
            <MessageSquare size={10} /> {reactions.length}
          </span>
        </div>

        {/* Mini reflections */}
        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
          {reactions.slice(0, 3).map((r) => (
            <div key={r.id} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[9px] font-body font-medium">{r.author[0]}</span>
              </div>
              <div>
                <p className="text-xs font-body">
                  <span className="font-medium">{r.author}</span>{" "}
                  <span className="text-muted-foreground">{r.text}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={newReaction}
            onChange={(e) => setNewReaction(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleReaction()}
            placeholder="Share a reflection..."
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-xs font-body focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button onClick={handleReaction} className="text-xs font-body text-accent font-medium hover:text-accent/80">
            Post
          </button>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.03 }}
            onClick={() => onNavigate(action.id)}
            className="prayer-card text-left group hover:border-accent/30 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mb-2 group-hover:bg-accent/20 transition-colors">
              <action.icon size={18} className="text-accent" />
            </div>
            <h3 className="font-body font-semibold text-xs sm:text-sm">{action.label}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-body mt-0.5">{action.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
