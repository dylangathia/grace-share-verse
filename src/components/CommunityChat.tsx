import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, BookOpen, Search, X, ArrowLeft, Users, Hash, Lock } from "lucide-react";

interface Message {
  id: number;
  author: string;
  text: string;
  isOwn: boolean;
  time: string;
  verse?: { reference: string; text: string };
}

interface GroupChat {
  id: string;
  name: string;
  icon: "hash" | "lock";
  lastMessage: string;
  lastAuthor: string;
  unread: number;
  members: number;
  time: string;
}

const verseDatabase = [
  { reference: "John 3:16", text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." },
  { reference: "Philippians 4:13", text: "I can do all this through him who gives me strength." },
  { reference: "Psalm 23:1", text: "The Lord is my shepherd, I lack nothing." },
  { reference: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
  { reference: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future." },
  { reference: "Proverbs 3:5", text: "Trust in the Lord with all your heart and lean not on your own understanding." },
  { reference: "Isaiah 40:31", text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." },
];

const groupChats: GroupChat[] = [
  { id: "general", name: "General", icon: "hash", lastMessage: "Good morning everyone! The sermon today was so powerful.", lastAuthor: "Sarah", unread: 3, members: 124, time: "9:30 AM" },
  { id: "youth", name: "Youth Ministry", icon: "hash", lastMessage: "Camp registration is open! 🏕️", lastAuthor: "Pastor Mike", unread: 0, members: 45, time: "Yesterday" },
  { id: "worship", name: "Worship Team", icon: "lock", lastMessage: "Practice moved to Thursday this week", lastAuthor: "Grace", unread: 1, members: 18, time: "10:15 AM" },
  { id: "bible-study", name: "Bible Study", icon: "hash", lastMessage: "Starting Romans next week, chapters 1-3", lastAuthor: "David", unread: 5, members: 32, time: "8:00 AM" },
  { id: "mens-group", name: "Men's Fellowship", icon: "lock", lastMessage: "Breakfast meetup Saturday at 7am", lastAuthor: "James", unread: 0, members: 28, time: "Mon" },
  { id: "prayer-team", name: "Prayer Team", icon: "lock", lastMessage: "Please keep the Johnson family in prayer", lastAuthor: "Elder Ruth", unread: 2, members: 15, time: "11:00 AM" },
];

const chatMessages: Record<string, Message[]> = {
  general: [
    { id: 1, author: "Sarah", text: "Good morning everyone! The sermon today was so powerful.", isOwn: false, time: "9:30 AM" },
    { id: 2, author: "You", text: "It really was! The part about grace really spoke to me.", isOwn: true, time: "9:32 AM" },
    { id: 3, author: "David", text: "This verse kept coming to mind during worship:", isOwn: false, time: "9:35 AM", verse: { reference: "Isaiah 40:31", text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." } },
    { id: 4, author: "Grace", text: "Amen! 🙏 That's beautiful.", isOwn: false, time: "9:36 AM" },
    { id: 5, author: "You", text: "Does anyone want to start a reading plan for Romans this week?", isOwn: true, time: "9:40 AM" },
  ],
  "bible-study": [
    { id: 1, author: "David", text: "Starting Romans next week, chapters 1-3. Please read ahead!", isOwn: false, time: "8:00 AM" },
    { id: 2, author: "You", text: "Looking forward to it! Romans is one of my favorites.", isOwn: true, time: "8:05 AM" },
  ],
};

const CommunityChat = () => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showVerseTool, setShowVerseTool] = useState(false);
  const [verseSearch, setVerseSearch] = useState("");
  const [selectedVerse, setSelectedVerse] = useState<{ reference: string; text: string } | null>(null);

  const filteredVerses = verseDatabase.filter(
    (v) =>
      v.reference.toLowerCase().includes(verseSearch.toLowerCase()) ||
      v.text.toLowerCase().includes(verseSearch.toLowerCase())
  );

  const openGroup = (groupId: string) => {
    setActiveGroup(groupId);
    setMessages(chatMessages[groupId] || []);
  };

  const handleSend = () => {
    if (!input.trim() && !selectedVerse) return;
    const msg: Message = {
      id: Date.now(),
      author: "You",
      text: input,
      isOwn: true,
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      verse: selectedVerse || undefined,
    };
    setMessages([...messages, msg]);
    setInput("");
    setSelectedVerse(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentGroup = groupChats.find((g) => g.id === activeGroup);

  // Group list view
  if (!activeGroup) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 sm:p-6 border-b border-border">
          <h2 className="section-header">Community</h2>
          <p className="text-sm text-muted-foreground font-body mt-1">Grace Community Church</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body font-semibold px-3 mb-2">
              Group Chats
            </p>
            <div className="space-y-0.5">
              {groupChats.map((group, i) => (
                <motion.button
                  key={group.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => openGroup(group.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                    {group.icon === "lock" ? <Lock size={16} /> : <Hash size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-body font-medium text-foreground">{group.name}</span>
                      <span className="text-[10px] text-muted-foreground font-body">{group.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-muted-foreground font-body truncate pr-2">
                        <span className="font-medium">{group.lastAuthor}:</span> {group.lastMessage}
                      </p>
                      {group.unread > 0 && (
                        <span className="shrink-0 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-body font-bold flex items-center justify-center">
                          {group.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveGroup(null)}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <h2 className="section-header text-lg">{currentGroup?.name}</h2>
            <p className="text-xs text-muted-foreground font-body mt-0.5 flex items-center gap-1">
              <Users size={12} />
              {currentGroup?.members} members
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div className={`${msg.isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}>
              {!msg.isOwn && (
                <span className="text-xs font-body font-medium text-muted-foreground px-1">
                  {msg.author}
                </span>
              )}
              <div className={`chat-bubble ${msg.isOwn ? "chat-bubble-own" : "chat-bubble-other"}`}>
                {msg.text && <p>{msg.text}</p>}
                {msg.verse && (
                  <div className={`mt-2 border-l-4 border-accent rounded-r-lg p-3 ${msg.isOwn ? "bg-primary-foreground/10" : "bg-background"}`}>
                    <p className="font-display text-sm italic leading-relaxed">"{msg.verse.text}"</p>
                    <p className="text-xs font-body font-semibold text-accent mt-1">— {msg.verse.reference}</p>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground font-body px-1">{msg.time}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verse Tool Popover */}
      <AnimatePresence>
        {showVerseTool && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mx-6 mb-2 bg-card border border-border rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-body font-semibold">Insert Scripture</span>
              <button onClick={() => { setShowVerseTool(false); setVerseSearch(""); }} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={verseSearch}
                onChange={(e) => setVerseSearch(e.target.value)}
                placeholder="Search verses..."
                className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredVerses.map((verse) => (
                <button
                  key={verse.reference}
                  onClick={() => {
                    setSelectedVerse(verse);
                    setShowVerseTool(false);
                    setVerseSearch("");
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <p className="text-xs font-body font-semibold text-accent">{verse.reference}</p>
                  <p className="text-xs font-body text-muted-foreground line-clamp-2 mt-0.5">{verse.text}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Verse Preview */}
      {selectedVerse && (
        <div className="mx-6 mb-2 bg-accent/10 border border-accent/20 rounded-lg p-3 flex items-start justify-between">
          <div>
            <p className="text-xs font-body font-semibold text-accent">{selectedVerse.reference}</p>
            <p className="text-xs font-body text-foreground/70 line-clamp-1">{selectedVerse.text}</p>
          </div>
          <button onClick={() => setSelectedVerse(null)} className="text-muted-foreground hover:text-foreground ml-2 mt-0.5">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowVerseTool(!showVerseTool)}
            className={`p-2.5 rounded-lg transition-colors ${showVerseTool ? "bg-accent text-accent-foreground" : "hover:bg-secondary text-muted-foreground"}`}
          >
            <BookOpen size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-secondary border-none rounded-lg px-4 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            onClick={handleSend}
            className="gold-button p-2.5"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;