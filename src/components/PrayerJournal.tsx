import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check, Clock, X, PenLine } from "lucide-react";

interface JournalEntry {
  id: number;
  text: string;
  date: string;
  answered: boolean;
}

const initialEntries: JournalEntry[] = [
  { id: 1, text: "Pray for guidance in my career decision — should I take the new role?", date: "Mar 12, 2026", answered: false },
  { id: 2, text: "Healing for my grandmother's health.", date: "Mar 8, 2026", answered: false },
  { id: 3, text: "Asked God for peace during a difficult season. He provided through community and His word.", date: "Feb 28, 2026", answered: true },
  { id: 4, text: "Prayed for a friend who was lost. They came back to church last Sunday!", date: "Feb 15, 2026", answered: true },
];

const PrayerJournal = () => {
  const [entries, setEntries] = useState(initialEntries);
  const [showForm, setShowForm] = useState(false);
  const [newEntry, setNewEntry] = useState("");

  const handleAdd = () => {
    if (!newEntry.trim()) return;
    setEntries([
      {
        id: Date.now(),
        text: newEntry,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        answered: false,
      },
      ...entries,
    ]);
    setNewEntry("");
    setShowForm(false);
  };

  const toggleAnswered = (id: number) => {
    setEntries(entries.map((e) => (e.id === id ? { ...e, answered: !e.answered } : e)));
  };

  const active = entries.filter((e) => !e.answered);
  const answered = entries.filter((e) => e.answered);

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="section-header">Prayer Journal</h2>
          <p className="text-sm text-muted-foreground font-body mt-1">Your private space with God</p>
        </div>
        <button onClick={() => setShowForm(true)} className="gold-button flex items-center gap-2">
          <Plus size={16} />
          New Entry
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="prayer-card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <PenLine size={16} className="text-accent" /> New Prayer
            </h3>
            <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="What's on your heart today?"
            className="w-full bg-background border border-border rounded-lg p-3 text-sm font-body resize-none h-24 focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="flex justify-end mt-3">
            <button onClick={handleAdd} className="gold-button text-sm">Save</button>
          </div>
        </motion.div>
      )}

      {/* Active Prayers */}
      {active.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-semibold mb-4 flex items-center gap-2">
            <Clock size={12} /> Active Prayers
          </h3>
          <div className="space-y-3">
            {active.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="prayer-card flex items-start gap-4"
              >
                <button
                  onClick={() => toggleAnswered(entry.id)}
                  className="mt-0.5 w-5 h-5 rounded-full border-2 border-border hover:border-accent transition-colors shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-body leading-relaxed">{entry.text}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-body">{entry.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Answered Prayers */}
      {answered.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-semibold mb-4 flex items-center gap-2">
            <Check size={12} className="text-accent" /> Answered Prayers
          </h3>
          <div className="space-y-3">
            {answered.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="prayer-card flex items-start gap-4 opacity-75"
              >
                <button
                  onClick={() => toggleAnswered(entry.id)}
                  className="mt-0.5 w-5 h-5 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center shrink-0"
                >
                  <Check size={10} className="text-accent" />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-body leading-relaxed line-through text-muted-foreground">{entry.text}</p>
                  <p className="text-xs text-muted-foreground mt-2 font-body">{entry.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerJournal;
