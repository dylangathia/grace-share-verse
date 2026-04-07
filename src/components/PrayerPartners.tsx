import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, Send, Lock, ArrowLeft, Clock, BookOpen, Flame, MessageCircle, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PartnerMessage {
  id: number;
  author: string;
  text: string;
  isOwn: boolean;
  time: string;
}

interface PrayerPartner {
  id: number;
  name: string;
  role: string;
  initials: string;
  available: boolean;
  bio: string;
  prayerFocus: string[];
  streak: number;
  lastActive: string;
  verse: string;
  verseRef: string;
  messages: PartnerMessage[];
}

const partners: PrayerPartner[] = [
  {
    id: 1, name: "Pastor David K.", role: "Senior Pastor", initials: "DK", available: true,
    bio: "30+ years in ministry. Always here to listen and pray with you.",
    prayerFocus: ["Healing", "Guidance", "Family"], streak: 42, lastActive: "Online now",
    verse: "The Lord is near to all who call on him.", verseRef: "Psalm 145:18",
    messages: [
      { id: 1, author: "Pastor David K.", text: "Welcome! I'm honored to pray alongside you. What's on your heart today?", isOwn: false, time: "Today" },
    ],
  },
  {
    id: 2, name: "Sister Grace L.", role: "Women's Ministry Lead", initials: "GL", available: true,
    bio: "Passionate about walking with women through every season of life.",
    prayerFocus: ["Women's Health", "Relationships", "Purpose"], streak: 28, lastActive: "5 min ago",
    verse: "She is clothed with strength and dignity.", verseRef: "Proverbs 31:25",
    messages: [
      { id: 1, author: "Sister Grace L.", text: "Hi there! I'd love to pray with you. Feel free to share whatever is on your mind 💛", isOwn: false, time: "Today" },
    ],
  },
  {
    id: 3, name: "Elder James M.", role: "Church Elder", initials: "JM", available: true,
    bio: "Retired teacher. Believes in the power of consistent, faithful prayer.",
    prayerFocus: ["Wisdom", "Peace", "Finances"], streak: 65, lastActive: "1 hr ago",
    verse: "If any of you lacks wisdom, let him ask God.", verseRef: "James 1:5",
    messages: [
      { id: 1, author: "Elder James M.", text: "God bless you for reaching out. Let's bring your needs before the Lord together.", isOwn: false, time: "Today" },
    ],
  },
  {
    id: 4, name: "Deacon Ruth A.", role: "Deacon", initials: "RA", available: false,
    bio: "Serving faithfully for 12 years. Prayer is her greatest joy.",
    prayerFocus: ["Children", "Church Growth", "Missions"], streak: 19, lastActive: "Yesterday",
    verse: "Train up a child in the way he should go.", verseRef: "Proverbs 22:6",
    messages: [
      { id: 1, author: "Deacon Ruth A.", text: "Hello! I'm not available right now but leave your prayer request and I'll lift it up.", isOwn: false, time: "Yesterday" },
    ],
  },
  {
    id: 5, name: "Brother Marcus T.", role: "Youth Pastor", initials: "MT", available: true,
    bio: "Heart for young people and anyone navigating life's tough transitions.",
    prayerFocus: ["Youth", "Identity", "Anxiety"], streak: 33, lastActive: "Online now",
    verse: "Cast all your anxiety on him because he cares for you.", verseRef: "1 Peter 5:7",
    messages: [
      { id: 1, author: "Brother Marcus T.", text: "Hey! No matter what you're going through, you're not alone. Let's pray 🙏", isOwn: false, time: "Today" },
    ],
  },
];

const PrayerPartners = () => {
  const [activePartner, setActivePartner] = useState<PrayerPartner | null>(null);
  const [allMessages, setAllMessages] = useState<Record<number, PartnerMessage[]>>(
    Object.fromEntries(partners.map((p) => [p.id, p.messages]))
  );
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim() || !activePartner) return;
    setAllMessages({
      ...allMessages,
      [activePartner.id]: [
        ...(allMessages[activePartner.id] || []),
        { id: Date.now(), author: "You", text: newMessage, isOwn: true, time: "Now" },
      ],
    });
    setNewMessage("");
  };

  // ── Chat View ──
  if (activePartner) {
    const msgs = allMessages[activePartner.id] || [];
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
        {/* Header bar */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActivePartner(null)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft size={18} className="text-muted-foreground" />
          </button>
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-accent/20 text-accent font-body text-sm font-semibold">
                {activePartner.initials}
              </AvatarFallback>
            </Avatar>
            {activePartner.available && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-semibold truncate">{activePartner.name}</p>
            <p className="text-[11px] text-muted-foreground font-body">{activePartner.lastActive}</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-body bg-muted/60 px-2 py-1 rounded-full">
            <Lock size={9} /> Private
          </div>
        </div>

        {/* Verse banner */}
        <div className="verse-card-inline mb-4 flex items-start gap-2">
          <BookOpen size={14} className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-display italic text-foreground/80">"{activePartner.verse}"</p>
            <p className="text-[10px] font-body text-muted-foreground mt-0.5">— {activePartner.verseRef}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
          {msgs.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className={`chat-bubble ${msg.isOwn ? "chat-bubble-own" : "chat-bubble-other"}`}>
                <p className="text-sm font-body">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.isOwn ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Share a prayer or encouragement..."
            className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
          />
          <button onClick={handleSend} className="gold-button p-2.5 rounded-xl">
            <Send size={16} />
          </button>
        </div>
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Hero header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-lg bg-accent/10">
            <Users size={20} className="text-accent" />
          </div>
          <h2 className="section-header">Prayer Partners</h2>
        </div>
        <p className="text-sm text-muted-foreground font-body mt-2 ml-[2.75rem]">
          Church leaders and volunteers selected to pray with you
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Available Now", value: partners.filter((p) => p.available).length.toString(), icon: Sparkles },
          { label: "Prayer Partners", value: partners.length.toString(), icon: Heart },
          { label: "Community Prayers", value: "248", icon: MessageCircle },
        ].map((stat) => (
          <div key={stat.label} className="prayer-card text-center py-3 px-2">
            <stat.icon size={16} className="text-accent mx-auto mb-1.5" />
            <p className="text-lg font-display font-semibold">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-body">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Partner list */}
      <div className="space-y-3">
        <AnimatePresence>
          {partners.map((partner, i) => (
            <motion.button
              key={partner.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => setActivePartner(partner)}
              className="prayer-card w-full text-left group relative overflow-hidden"
            >
              {/* Subtle accent gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500 rounded-xl" />

              <div className="relative flex items-start gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar className="h-12 w-12 ring-2 ring-border group-hover:ring-accent/30 transition-all">
                    <AvatarFallback className="bg-accent/15 text-accent font-body text-sm font-semibold">
                      {partner.initials}
                    </AvatarFallback>
                  </Avatar>
                  {partner.available && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-card" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-body font-semibold truncate group-hover:text-accent transition-colors">
                      {partner.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground font-body flex items-center gap-1 shrink-0 ml-2">
                      <Clock size={10} /> {partner.lastActive}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-body mb-2">{partner.role}</p>

                  {/* Verse preview */}
                  <p className="text-[11px] font-display italic text-foreground/50 mb-2 truncate">
                    "{partner.verse}" — {partner.verseRef}
                  </p>

                  {/* Footer: tags + streak */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {partner.prayerFocus.map((f) => (
                        <Badge key={f} variant="secondary" className="text-[10px] font-body py-0 px-1.5">
                          {f}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-[10px] text-accent font-body font-medium flex items-center gap-0.5 shrink-0">
                      <Flame size={11} /> {partner.streak}d
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PrayerPartners;
