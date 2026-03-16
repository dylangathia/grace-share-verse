import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, Send, Lock, RefreshCw } from "lucide-react";

interface PartnerMessage {
  id: number;
  author: string;
  text: string;
  isOwn: boolean;
  time: string;
}

interface Partner {
  id: number;
  name: string;
  matchedSince: string;
  duration: string;
  messages: PartnerMessage[];
}

const mockPartner: Partner = {
  id: 1,
  name: "Grace L.",
  matchedSince: "Mar 3, 2026",
  duration: "2 weeks remaining",
  messages: [
    { id: 1, author: "Grace L.", text: "Hi John! Glad we got matched as prayer partners this month. How can I pray for you?", isOwn: false, time: "Mar 3" },
    { id: 2, author: "John", text: "Hey Grace! I've been dealing with a big decision at work. Praying for clarity and peace about it.", isOwn: true, time: "Mar 3" },
    { id: 3, author: "Grace L.", text: "Absolutely lifting that up. Proverbs 3:5-6 has been my anchor for decisions like that. Trust He's guiding you! 🙏", isOwn: false, time: "Mar 4" },
    { id: 4, author: "John", text: "Thank you so much. How about you — anything I can pray for?", isOwn: true, time: "Mar 4" },
    { id: 5, author: "Grace L.", text: "My mom's health has been a concern. She's doing better but still needs prayer for her recovery.", isOwn: false, time: "Mar 5" },
    { id: 6, author: "John", text: "Praying for her healing and strength for your family. God is faithful! 💛", isOwn: true, time: "Mar 5" },
  ],
};

const PrayerPartners = () => {
  const [partner] = useState<Partner | null>(mockPartner);
  const [hasPartner, setHasPartner] = useState(true);
  const [messages, setMessages] = useState(mockPartner.messages);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        author: "John",
        text: newMessage,
        isOwn: true,
        time: "Now",
      },
    ]);
    setNewMessage("");
  };

  if (!hasPartner) {
    return (
      <div className="p-4 sm:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="section-header">Prayer Partners</h2>
          <p className="text-sm text-muted-foreground font-body mt-1">Walk together in prayer</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="prayer-card text-center py-10"
        >
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-accent" />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">Find a Prayer Partner</h3>
          <p className="text-sm font-body text-muted-foreground mb-6 max-w-sm mx-auto">
            Get matched with a fellow believer for a season of intentional, private prayer support.
          </p>
          <button onClick={() => setHasPartner(true)} className="gold-button">
            <span className="flex items-center gap-2">
              <RefreshCw size={16} /> Match Me
            </span>
          </button>
          <p className="text-xs text-muted-foreground font-body mt-4 flex items-center justify-center gap-1">
            <Lock size={10} /> Conversations are completely private
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="mb-4">
        <h2 className="section-header">Prayer Partners</h2>
        <p className="text-sm text-muted-foreground font-body mt-1">Walk together in prayer</p>
      </div>

      {/* Partner Info */}
      {partner && (
        <div className="prayer-card mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-sm font-body font-semibold text-accent">{partner.name[0]}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-semibold">{partner.name}</p>
            <p className="text-xs text-muted-foreground font-body">
              Matched {partner.matchedSince} · {partner.duration}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
            <Lock size={10} /> Private
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
        {messages.map((msg, i) => (
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
};

export default PrayerPartners;
