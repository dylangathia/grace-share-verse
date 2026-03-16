import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, X, User, EyeOff, BookOpen, Search } from "lucide-react";

interface PrayerRequest {
  id: number;
  author: string;
  anonymous: boolean;
  text: string;
  prayerCount: number;
  hasPrayed: boolean;
  timeAgo: string;
  category: string;
  verse?: { reference: string; text: string };
}

const verseDatabase = [
  { reference: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want." },
  { reference: "Philippians 4:13", text: "I can do all things through Christ who strengthens me." },
  { reference: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord." },
  { reference: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him." },
  { reference: "Isaiah 41:10", text: "So do not fear, for I am with you; do not be dismayed, for I am your God." },
  { reference: "Psalm 46:1", text: "God is our refuge and strength, an ever-present help in trouble." },
  { reference: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart and lean not on your own understanding." },
  { reference: "Matthew 11:28", text: "Come to me, all you who are weary and burdened, and I will give you rest." },
];

const initialPrayers: PrayerRequest[] = [
  { id: 1, author: "Sarah M.", anonymous: false, text: "Please pray for my mother's recovery from surgery. She's been in the hospital for a week and we're trusting God for healing.", prayerCount: 24, hasPrayed: false, timeAgo: "2h ago", category: "Health", verse: { reference: "Psalm 46:1", text: "God is our refuge and strength, an ever-present help in trouble." } },
  { id: 2, author: "Anonymous", anonymous: true, text: "Struggling with anxiety and doubt. Pray that I find peace and strength in God's word.", prayerCount: 31, hasPrayed: false, timeAgo: "4h ago", category: "Personal", verse: { reference: "Matthew 11:28", text: "Come to me, all you who are weary and burdened, and I will give you rest." } },
  { id: 3, author: "David K.", anonymous: false, text: "Our youth group is starting a new outreach program. Pray for wisdom and open doors in our community.", prayerCount: 15, hasPrayed: false, timeAgo: "6h ago", category: "Ministry" },
  { id: 4, author: "Anonymous", anonymous: true, text: "Praying for restoration in my marriage. We need God's grace and guidance.", prayerCount: 42, hasPrayed: false, timeAgo: "8h ago", category: "Family", verse: { reference: "Proverbs 3:5-6", text: "Trust in the Lord with all your heart and lean not on your own understanding." } },
  { id: 5, author: "Grace L.", anonymous: false, text: "Thank God! My son got accepted into college. Pray for his transition and that he stays strong in faith.", prayerCount: 18, hasPrayed: false, timeAgo: "12h ago", category: "Gratitude" },
  { id: 6, author: "Michael R.", anonymous: false, text: "Starting a new job next week. Pray for favor and that I can be a light in my workplace.", prayerCount: 9, hasPrayed: false, timeAgo: "1d ago", category: "Work", verse: { reference: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord." } },
];

const PrayerWall = () => {
  const [prayers, setPrayers] = useState(initialPrayers);
  const [showForm, setShowForm] = useState(false);
  const [newPrayer, setNewPrayer] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<{ reference: string; text: string } | null>(null);
  const [verseSearch, setVerseSearch] = useState("");
  const [showVerseSearch, setShowVerseSearch] = useState(false);

  const filteredVerses = verseDatabase.filter(
    (v) =>
      v.reference.toLowerCase().includes(verseSearch.toLowerCase()) ||
      v.text.toLowerCase().includes(verseSearch.toLowerCase())
  );

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
      verse: selectedVerse || undefined,
    };
    setPrayers([prayer, ...prayers]);
    setNewPrayer("");
    setSelectedVerse(null);
    setShowForm(false);
    setShowVerseSearch(false);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="section-header">Prayer Wall</h2>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Lift each other up in prayer
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="gold-button flex items-center gap-2">
          <Plus size={16} />
          <span className="hidden sm:inline">Share Request</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* New Prayer Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="prayer-card mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">New Prayer Request</h3>
              <button onClick={() => { setShowForm(false); setShowVerseSearch(false); setSelectedVerse(null); }} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <textarea
              value={newPrayer}
              onChange={(e) => setNewPrayer(e.target.value)}
              placeholder="Share what's on your heart..."
              className="w-full bg-background border border-border rounded-lg p-3 text-sm font-body resize-none h-24 focus:outline-none focus:ring-2 focus:ring-accent/30"
            />

            {/* Verse Attachment */}
            {selectedVerse && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="verse-card-inline mt-3 flex items-start gap-2">
                <BookOpen size={14} className="text-accent shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-body font-semibold text-accent not-italic">{selectedVerse.reference}</p>
                  <p className="text-xs">{selectedVerse.text}</p>
                </div>
                <button onClick={() => setSelectedVerse(null)} className="text-muted-foreground hover:text-foreground shrink-0">
                  <X size={14} />
                </button>
              </motion.div>
            )}

            {/* Verse Search */}
            <AnimatePresence>
              {showVerseSearch && !selectedVerse && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-3 border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                      <Search size={14} className="text-muted-foreground" />
                      <input
                        value={verseSearch}
                        onChange={(e) => setVerseSearch(e.target.value)}
                        placeholder="Search verses..."
                        className="flex-1 bg-transparent text-sm font-body focus:outline-none"
                      />
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                      {filteredVerses.map((v) => (
                        <button
                          key={v.reference}
                          onClick={() => { setSelectedVerse(v); setShowVerseSearch(false); setVerseSearch(""); }}
                          className="w-full text-left px-3 py-2 text-xs font-body hover:bg-secondary transition-colors"
                        >
                          <span className="font-semibold text-accent">{v.reference}</span>
                          <span className="text-muted-foreground ml-2">{v.text.slice(0, 50)}...</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  className={`flex items-center gap-2 text-xs font-body px-3 py-1.5 rounded-lg transition-colors ${
                    isAnonymous ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {isAnonymous ? <EyeOff size={12} /> : <User size={12} />}
                  {isAnonymous ? "Anonymous" : "Show Name"}
                </button>
                <button
                  onClick={() => setShowVerseSearch(!showVerseSearch)}
                  className={`flex items-center gap-2 text-xs font-body px-3 py-1.5 rounded-lg transition-colors ${
                    showVerseSearch || selectedVerse ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <BookOpen size={12} />
                  Attach Verse
                </button>
              </div>
              <button onClick={handleSubmit} className="gold-button text-sm">
                Submit Prayer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="flex-1 min-w-0">
                <span className="text-sm font-body font-medium">{prayer.author}</span>
                <span className="text-xs text-muted-foreground ml-2">{prayer.timeAgo}</span>
              </div>
              <span className="text-[10px] font-body uppercase tracking-wider text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full shrink-0">
                {prayer.category}
              </span>
            </div>
            <p className="text-sm font-body leading-relaxed text-foreground/85 mb-3">
              {prayer.text}
            </p>

            {/* Scripture Link */}
            {prayer.verse && (
              <div className="verse-card-inline mb-3 flex items-start gap-2">
                <BookOpen size={12} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-body font-semibold text-accent not-italic">{prayer.verse.reference}</p>
                  <p className="text-xs leading-relaxed">{prayer.verse.text}</p>
                </div>
              </div>
            )}

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
