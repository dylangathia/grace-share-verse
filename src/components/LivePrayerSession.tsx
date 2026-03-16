import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Users, Hand, Heart, Clock, Circle } from "lucide-react";

interface Participant {
  id: number;
  name: string;
  isPraying: boolean;
  joinedAgo: string;
}

interface SessionRequest {
  id: number;
  text: string;
  author: string;
  prayingNow: number;
}

const mockParticipants: Participant[] = [
  { id: 1, name: "Sarah M.", isPraying: true, joinedAgo: "12m" },
  { id: 2, name: "David K.", isPraying: false, joinedAgo: "8m" },
  { id: 3, name: "Grace L.", isPraying: true, joinedAgo: "5m" },
  { id: 4, name: "Michael R.", isPraying: false, joinedAgo: "3m" },
  { id: 5, name: "Rachel T.", isPraying: true, joinedAgo: "1m" },
];

const sessionRequests: SessionRequest[] = [
  { id: 1, text: "Pray for healing in our community — several members are dealing with illness.", author: "Pastor James", prayingNow: 4 },
  { id: 2, text: "Lift up the upcoming mission trip team as they prepare to serve.", author: "Sarah M.", prayingNow: 3 },
  { id: 3, text: "Guidance and wisdom for our church leadership during this season of growth.", author: "David K.", prayingNow: 2 },
];

const LivePrayerSession = () => {
  const [hasJoined, setHasJoined] = useState(false);
  const [isPraying, setIsPraying] = useState(false);
  const [participants, setParticipants] = useState(mockParticipants);
  const [activeRequest, setActiveRequest] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!hasJoined) return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [hasJoined]);

  // Simulate participants joining/leaving
  useEffect(() => {
    if (!hasJoined) return;
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => ({ ...p, isPraying: Math.random() > 0.4 }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [hasJoined]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const prayingCount = participants.filter((p) => p.isPraying).length + (isPraying ? 1 : 0);

  if (!hasJoined) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="section-header">Live Prayer Room</h2>
          <p className="text-sm text-muted-foreground font-body mt-1">Join the prayer circle</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary text-primary-foreground rounded-2xl p-6 sm:p-10 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6"
          >
            <Flame size={32} className="text-accent" />
          </motion.div>
          <h3 className="font-display text-xl font-semibold mb-2">Evening Prayer Session</h3>
          <p className="text-sm font-body opacity-70 mb-1">Grace Community Church</p>
          <p className="text-sm font-body opacity-70 mb-6 flex items-center justify-center gap-2">
            <Users size={14} />
            {mockParticipants.length} members praying now
          </p>
          <button
            onClick={() => setHasJoined(true)}
            className="gold-button text-base px-8 py-3"
          >
            Join Prayer Room
          </button>
        </motion.div>

        {/* Upcoming sessions */}
        <div className="mt-8">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-body font-semibold mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {[
              { name: "Morning Devotion", time: "Tomorrow 6:00 AM", members: 8 },
              { name: "Youth Prayer Night", time: "Friday 7:00 PM", members: 12 },
            ].map((s) => (
              <div key={s.name} className="prayer-card flex items-center justify-between">
                <div>
                  <p className="text-sm font-body font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground font-body flex items-center gap-1 mt-1">
                    <Clock size={10} /> {s.time}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground font-body">{s.members} joined</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="section-header flex items-center gap-2">
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Circle size={10} className="fill-destructive text-destructive" />
            </motion.span>
            Live Prayer
          </h2>
          <p className="text-xs text-muted-foreground font-body mt-1 flex items-center gap-2">
            <Clock size={10} /> {formatTime(elapsed)} · {prayingCount} praying now
          </p>
        </div>
        <button onClick={() => { setHasJoined(false); setElapsed(0); setIsPraying(false); }} className="text-sm font-body text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg bg-secondary">
          Leave
        </button>
      </div>

      {/* Participants Circle */}
      <div className="flex items-center gap-1 mb-6 flex-wrap">
        {participants.map((p) => (
          <motion.div
            key={p.id}
            animate={p.isPraying ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2, delay: p.id * 0.3 }}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-body font-medium transition-colors ${
              p.isPraying
                ? "bg-accent/20 text-accent ring-2 ring-accent/30"
                : "bg-secondary text-muted-foreground"
            }`}
            title={p.name}
          >
            {p.name[0]}
          </motion.div>
        ))}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-body font-medium transition-colors ${
          isPraying
            ? "bg-accent/20 text-accent ring-2 ring-accent/30"
            : "bg-secondary text-muted-foreground"
        }`}>
          J
        </div>
      </div>

      {/* Current Prayer Focus */}
      <div className="space-y-3 mb-6">
        {sessionRequests.map((req, i) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveRequest(i)}
            className={`prayer-card cursor-pointer transition-all ${
              activeRequest === i ? "ring-2 ring-accent/40 border-accent/30" : ""
            }`}
          >
            <p className="text-sm font-body leading-relaxed mb-2">{req.text}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-body">— {req.author}</span>
              <span className="text-xs text-accent font-body flex items-center gap-1">
                <Hand size={10} /> {req.prayingNow} praying
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pray Button */}
      <motion.button
        onClick={() => setIsPraying(!isPraying)}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-4 rounded-xl font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
          isPraying
            ? "bg-accent text-accent-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isPraying ? (
          <>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Heart size={18} className="fill-accent-foreground" />
            </motion.div>
            Praying...
          </>
        ) : (
          <>
            <Hand size={18} />
            I'm Praying
          </>
        )}
      </motion.button>
    </div>
  );
};

export default LivePrayerSession;
