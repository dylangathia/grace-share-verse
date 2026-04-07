import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Heart, Send, Lock, ArrowLeft, Clock, BookOpen, Flame } from "lucide-react";
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
  messages: PartnerMessage[];
}

const partners: PrayerPartner[] = [
  {
    id: 1,
    name: "Pastor David K.",
    role: "Senior Pastor",
    initials: "DK",
    available: true,
    bio: "30+ years in ministry. Always here to listen and pray with you.",
    prayerFocus: ["Healing", "Guidance", "Family"],
    streak: 42,
    lastActive: "Online now",
    messages: [
      { id: 1, author: "Pastor David K.", text: "Welcome! I'm honored to pray alongside you. What's on your heart today?", isOwn: false, time: "Today" },
    ],
  },
  {
    id: 2,
    name: "Sister Grace L.",
    role: "Women's Ministry Lead",
    initials: "GL",
    available: true,
    bio: "Passionate about walking with women through every season of life.",
    prayerFocus: ["Women's Health", "Relationships", "Purpose"],
    streak: 28,
    lastActive: "5 min ago",
    messages: [
      { id: 1, author: "Sister Grace L.", text: "Hi there! I'd love to pray with you. Feel free to share whatever is on your mind 💛", isOwn: false, time: "Today" },
    ],
  },
  {
    id: 3,
    name: "Elder James M.",
    role: "Church Elder",
    initials: "JM",
    available: true,
    bio: "Retired teacher. Believes in the power of consistent, faithful prayer.",
    prayerFocus: ["Wisdom", "Peace", "Finances"],
    streak: 65,
    lastActive: "1 hr ago",
    messages: [
      { id: 1, author: "Elder James M.", text: "God bless you for reaching out. Let's bring your needs before the Lord together.", isOwn: false, time: "Today" },
    ],
  },
  {
    id: 4,
    name: "Deacon Ruth A.",
    role: "Deacon",
    initials: "RA",
    available: false,
    bio: "Serving faithfully for 12 years. Prayer is her greatest joy.",
    prayerFocus: ["Children", "Church Growth", "Missions"],
    streak: 19,
    lastActive: "Yesterday",
    messages: [
      { id: 1, author: "Deacon Ruth A.", text: "Hello! I'm not available right now but leave your prayer request and I'll lift it up.", isOwn: false, time: "Yesterday" },
    ],
  },
  {
    id: 5,
    name: "Brother Marcus T.",
    role: "Youth Pastor",
    initials: "MT",
    available: true,
    bio: "Heart for young people and anyone navigating life's tough transitions.",
    prayerFocus: ["Youth", "Identity", "Anxiety"],
    streak: 33,
    lastActive: "Online now",
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
    const updated = {
      ...allMessages,
      [activePartner.id]: [
        ...(allMessages[activePartner.id] || []),
        { id: Date.now(), author: "You", text: newMessage, isOwn: true, time: "Now" },
      ],
    };
    setAllMessages(updated);
    setNewMessage("");
  };

  if (activePartner) {
    const msgs = allMessages[activePartner.id] || [];
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setActivePartner(null)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} className="text-muted-foreground" />
          </button>
          <Avatar className="h-10 w-10 bg-accent/20">
            <AvatarFallback className="bg-accent/20 text-accent font-body text-sm font-semibold">
              {activePartner.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-body font-semibold">{activePartner.name}</p>
            <p className="text-xs text-muted-foreground font-body">{activePartner.role}</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
            <Lock size={10} /> Private
          </div>
        </div>

        {/* Partner card */}
        <div className="prayer-card mb-4">
          <p className="text-xs text-muted-foreground font-body mb-2">{activePartner.bio}</p>
          <div className="flex flex-wrap gap-1.5">
            {activePartner.prayerFocus.map((f) => (
              <Badge key={f} variant="secondary" className="text-[10px] font-body">
                {f}
              </Badge>
            ))}
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
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button onClick={handleSend} className="gold-button p-2.5">
            <Send size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="section-header">Prayer Partners</h2>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Church leaders and volunteers ready to pray with you
        </p>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {partners.map((partner, i) => (
            <motion.button
              key={partner.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActivePartner(partner)}
              className="prayer-card w-full text-left flex items-start gap-3 hover:border-accent/30 transition-colors cursor-pointer"
            >
              <div className="relative">
                <Avatar className="h-11 w-11 bg-accent/20">
                  <AvatarFallback className="bg-accent/20 text-accent font-body text-sm font-semibold">
                    {partner.initials}
                  </AvatarFallback>
                </Avatar>
                {partner.available && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-sm font-body font-semibold truncate">{partner.name}</p>
                  <span className="text-[10px] text-muted-foreground font-body flex items-center gap-1 shrink-0">
                    <Clock size={10} /> {partner.lastActive}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-body mb-1.5">{partner.role}</p>
                <div className="flex items-center gap-2">
                  <div className="flex flex-wrap gap-1">
                    {partner.prayerFocus.slice(0, 2).map((f) => (
                      <Badge key={f} variant="secondary" className="text-[10px] font-body py-0">
                        {f}
                      </Badge>
                    ))}
                    {partner.prayerFocus.length > 2 && (
                      <span className="text-[10px] text-muted-foreground font-body">
                        +{partner.prayerFocus.length - 2}
                      </span>
                    )}
                  </div>
                  <span className="ml-auto text-[10px] text-accent font-body flex items-center gap-0.5 shrink-0">
                    <Flame size={10} /> {partner.streak}d streak
                  </span>
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
