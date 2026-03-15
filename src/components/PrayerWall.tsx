import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, X, User, EyeOff } from "lucide-react";

interface PrayerRequest {
  id: number;
  author: string;
  anonymous: boolean;
  text: string;
  prayerCount: number;
  hasPrayed: boolean;
  timeAgo: string;
  category: string;
}

const initialPrayers: PrayerRequest[] = [
  { id: 1, author: "Sarah M.", anonymous: false, text: "Please pray for my mother's recovery from surgery. She's been in the hospital for a week and we're trusting God for healing.", prayerCount: 24, hasPrayed: false, timeAgo: "2h ago", category: "Health" },
  { id: 2, author: "Anonymous", anonymous: true, text: "Struggling with anxiety and doubt. Pray that I find peace and strength in God's word.", prayerCount: 31, hasPrayed: false, timeAgo: "4h ago", category: "Personal" },
  { id: 3, author: "David K.", anonymous: false, text: "Our youth group is starting a new outreach program. Pray for wisdom and open doors in our community.", prayerCount: 15, hasPrayed: false, timeAgo: "6h ago", category: "Ministry" },
  { id: 4, author: "Anonymous", anonymous: true, text: "Praying for restoration in my marriage. We need God's grace and guidance.", prayerCount: 42, hasPrayed: false, timeAgo: "8h ago", category: "Family" },
  { id: 5, author: "Grace L.", anonymous: false, text: "Thank God! My son got accepted into college. Pray for his transition and that he stays strong in faith.", prayerCount: 18, hasPrayed: false, timeAgo: "12h ago", category: "Gratitude" },
  { id: 6, author: "Michael R.", anonymous: false, text: "Starting a new job next week. Pray for favor and that I can be a light in my workplace.", prayerCount: 9, hasPrayed: false, timeAgo: "1d ago", category: "Work" },
];

const PrayerWall = () => {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [showForm, setShowForm] = useState(false);
  const [newPrayer, setNewPrayer] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handlePray = (id: number) => {
    setPrayers(prayers.map((p) =>
      p.id === id
        ? { ...p, hasPrayed: !p.hasPrayed, prayerCount: p.hasPrayed ? p.prayerCount - 1 : p.prayerCount + 1 }
        : p
    ));
  };

  const handleSubmit = () => {
    if (!newPrayer.trim()) return;
    const prayer: PrayerRequest = {
      id: Date.now(),
      author: isAnonymous ? "Anonymous" : "John",
      anonymous: isAnonymous,
      text: newPrayer,
      prayerCount: 0,
      hasPrayed: false,
      timeAgo: "Just now",
      category: "Personal",
    };
    setPrayers([prayer, ...prayers]);
    setNewPrayer("");
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="section-header">Prayer Wall</h2>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Lift each other up in prayer
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="gold-button flex items-center gap-2">
          <Plus size={16} />
          Share Request
        </button>
      </div>

      {/* New Prayer Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="prayer-card mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">New Prayer Request</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
          <textarea
            value={newPrayer}
            onChange={(e) => setNewPrayer(e.target.value)}
            placeholder="Share what's on your heart..."
            className="w-full bg-background border border-border rounded-lg p-3 text-sm font-body resize-none h-24 focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`flex items-center gap-2 text-sm font-body px-3 py-1.5 rounded-lg transition-colors ${
                isAnonymous ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              }`}
            >
              {isAnonymous ? <EyeOff size={14} /> : <User size={14} />}
              {isAnonymous ? "Anonymous" : "Show Name"}
            </button>
            <button onClick={handleSubmit} className="gold-button text-sm">
              Submit Prayer
            </button>
          </div>
        </motion.div>
      )}

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {prayers.map((prayer, i) => (
          <motion.div
            key={prayer.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="prayer-card break-inside-avoid"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                {prayer.anonymous ? (
                  <EyeOff size={12} className="text-muted-foreground" />
                ) : (
                  <span className="text-xs font-body font-medium text-foreground">
                    {prayer.author[0]}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <span className="text-sm font-body font-medium">{prayer.author}</span>
                <span className="text-xs text-muted-foreground ml-2">{prayer.timeAgo}</span>
              </div>
              <span className="text-[10px] font-body uppercase tracking-wider text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full">
                {prayer.category}
              </span>
            </div>
            <p className="text-sm font-body leading-relaxed text-foreground/85 mb-4">
              {prayer.text}
            </p>
            <button
              onClick={() => handlePray(prayer.id)}
              className={`flex items-center gap-2 text-sm font-body transition-all duration-200 ${
                prayer.hasPrayed
                  ? "text-accent font-medium"
                  : "text-muted-foreground hover:text-accent"
              }`}
            >
              <Heart size={16} className={prayer.hasPrayed ? "fill-accent" : ""} />
              <span>{prayer.prayerCount} praying</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PrayerWall;
