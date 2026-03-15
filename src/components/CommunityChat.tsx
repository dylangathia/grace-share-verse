import { useState } from "react";
import { motion } from "framer-motion";
import { Send, BookOpen, Search, X } from "lucide-react";

interface Message {
  id: number;
  author: string;
  text: string;
  isOwn: boolean;
  time: string;
  verse?: { reference: string; text: string };
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

const initialMessages: Message[] = [
  { id: 1, author: "Sarah", text: "Good morning everyone! The sermon today was so powerful.", isOwn: false, time: "9:30 AM" },
  { id: 2, author: "You", text: "It really was! The part about grace really spoke to me.", isOwn: true, time: "9:32 AM" },
  { id: 3, author: "David", text: "This verse kept coming to mind during worship:", isOwn: false, time: "9:35 AM", verse: { reference: "Isaiah 40:31", text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint." } },
  { id: 4, author: "Grace", text: "Amen! 🙏 That's beautiful.", isOwn: false, time: "9:36 AM" },
  { id: 5, author: "You", text: "Does anyone want to start a reading plan for Romans this week?", isOwn: true, time: "9:40 AM" },
];

const CommunityChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [showVerseTool, setShowVerseTool] = useState(false);
  const [verseSearch, setVerseSearch] = useState("");
  const [selectedVerse, setSelectedVerse] = useState<{ reference: string; text: string } | null>(null);

  const filteredVerses = verseDatabase.filter(
    (v) =>
      v.reference.toLowerCase().includes(verseSearch.toLowerCase()) ||
      v.text.toLowerCase().includes(verseSearch.toLowerCase())
  );

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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="section-header">Community</h2>
        <p className="text-sm text-muted-foreground font-body mt-1">Grace Community · General</p>
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
      {showVerseTool && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
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
