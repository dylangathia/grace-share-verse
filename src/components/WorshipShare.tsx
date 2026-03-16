import { useState } from "react";
import { motion } from "framer-motion";
import { Music, Plus, X, Heart, ExternalLink, Play, Pause } from "lucide-react";

interface WorshipItem {
  id: number;
  author: string;
  title: string;
  artist: string;
  type: "song" | "hymn" | "spoken-word";
  note: string;
  likes: number;
  hasLiked: boolean;
  timeAgo: string;
  url?: string;
}

const initialItems: WorshipItem[] = [
  { id: 1, author: "Sarah M.", title: "Goodness of God", artist: "Bethel Music", type: "song", note: "This song has been my anthem this week. His goodness never fails.", likes: 14, hasLiked: false, timeAgo: "1h ago", url: "https://open.spotify.com" },
  { id: 2, author: "David K.", title: "It Is Well With My Soul", artist: "Horatio Spafford", type: "hymn", note: "A classic that grounds me when life gets turbulent. The story behind it makes it even more powerful.", likes: 22, hasLiked: false, timeAgo: "3h ago" },
  { id: 3, author: "Grace L.", title: "Firm Foundation", artist: "Cody Carnes", type: "song", note: "Been on repeat during my morning prayers. 'I won't be shaken' 🙌", likes: 8, hasLiked: false, timeAgo: "5h ago", url: "https://open.spotify.com" },
  { id: 4, author: "Michael R.", title: "Great Is Thy Faithfulness", artist: "Thomas Chisholm", type: "hymn", note: "Morning by morning new mercies I see. Every word is true.", likes: 31, hasLiked: false, timeAgo: "8h ago" },
  { id: 5, author: "Rachel T.", title: "Surrounded (Fight My Battles)", artist: "UPPERROOM", type: "song", note: "Powerful worship moment when this played at service last Sunday.", likes: 16, hasLiked: false, timeAgo: "1d ago", url: "https://open.spotify.com" },
];

const typeColors: Record<string, string> = {
  song: "bg-accent/10 text-accent",
  hymn: "bg-primary/10 text-primary",
  "spoken-word": "bg-destructive/10 text-destructive",
};

const WorshipShare = () => {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", artist: "", note: "", type: "song" as WorshipItem["type"] });
  const [playing, setPlaying] = useState<number | null>(null);

  const handleLike = (id: number) => {
    setItems(items.map((item) =>
      item.id === id
        ? { ...item, hasLiked: !item.hasLiked, likes: item.hasLiked ? item.likes - 1 : item.likes + 1 }
        : item
    ));
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.artist.trim()) return;
    const newItem: WorshipItem = {
      id: Date.now(),
      author: "John",
      title: form.title,
      artist: form.artist,
      type: form.type,
      note: form.note,
      likes: 0,
      hasLiked: false,
      timeAgo: "Just now",
    };
    setItems([newItem, ...items]);
    setForm({ title: "", artist: "", note: "", type: "song" });
    setShowForm(false);
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="section-header">What's Ministering to Me</h2>
          <p className="text-sm text-muted-foreground font-body mt-1">Share what's blessing your soul</p>
        </div>
        <button onClick={() => setShowForm(true)} className="gold-button flex items-center gap-2">
          <Plus size={16} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* New Item Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="prayer-card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold">Share Something</h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Song or hymn title"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <input
              value={form.artist}
              onChange={(e) => setForm({ ...form, artist: e.target.value })}
              placeholder="Artist or author"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <div className="flex gap-2">
              {(["song", "hymn", "spoken-word"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setForm({ ...form, type: t })}
                  className={`text-xs font-body px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    form.type === t ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Why is this ministering to you?"
              className="w-full bg-background border border-border rounded-lg p-3 text-sm font-body resize-none h-20 focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <div className="flex justify-end">
              <button onClick={handleSubmit} className="gold-button text-sm">Share</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="prayer-card"
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => setPlaying(playing === item.id ? null : item.id)}
                className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 hover:bg-accent/20 transition-colors"
              >
                {playing === item.id ? (
                  <Pause size={16} className="text-accent" />
                ) : (
                  <Play size={16} className="text-accent ml-0.5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-body font-semibold text-sm">{item.title}</h4>
                  <span className={`text-[10px] font-body uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-body">{item.artist}</p>
                <p className="text-sm font-body leading-relaxed text-foreground/85 mt-2">{item.note}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1.5 text-xs font-body transition-colors ${
                      item.hasLiked ? "text-accent font-medium" : "text-muted-foreground hover:text-accent"
                    }`}
                  >
                    <Heart size={14} className={item.hasLiked ? "fill-accent" : ""} />
                    {item.likes}
                  </button>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent font-body transition-colors">
                      <ExternalLink size={12} /> Listen
                    </a>
                  )}
                  <span className="text-xs text-muted-foreground font-body ml-auto">
                    {item.author} · {item.timeAgo}
                  </span>
                </div>
              </div>
            </div>

            {/* Playing animation */}
            {playing === item.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 pt-3 border-t border-border"
              >
                <div className="flex items-center gap-1 justify-center">
                  {[...Array(20)].map((_, j) => (
                    <motion.div
                      key={j}
                      animate={{ height: [4, Math.random() * 16 + 4, 4] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: j * 0.05 }}
                      className="w-1 bg-accent/60 rounded-full"
                      style={{ height: 4 }}
                    />
                  ))}
                </div>
                <p className="text-center text-[10px] text-muted-foreground font-body mt-2">Now playing</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorshipShare;
