import { motion } from "framer-motion";
import { BookOpen, Heart, MessageCircle, PenLine, Sunrise } from "lucide-react";

interface HomeScreenProps {
  onNavigate: (section: string) => void;
}

const HomeScreen = ({ onNavigate }: HomeScreenProps) => {
  const todayVerse = {
    reference: "Lamentations 3:22-23",
    text: "Because of the Lord's great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.",
  };

  const quickActions = [
    { id: "bible", icon: BookOpen, label: "Read Bible", desc: "Continue Genesis 1" },
    { id: "prayers", icon: Heart, label: "Prayer Wall", desc: "12 new requests" },
    { id: "chat", icon: MessageCircle, label: "Community", desc: "5 unread messages" },
    { id: "journal", icon: PenLine, label: "Journal", desc: "2 active prayers" },
  ];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-2 text-accent mb-2">
          <Sunrise size={18} />
          <span className="text-sm font-body font-medium">Good morning</span>
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          Welcome back, John
        </h1>
      </motion.div>

      {/* Verse of the Day */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-primary text-primary-foreground rounded-2xl p-8 mb-8"
      >
        <p className="text-xs uppercase tracking-widest font-body opacity-60 mb-4">Verse of the Day</p>
        <p className="font-display text-xl leading-relaxed italic mb-4">
          "{todayVerse.text}"
        </p>
        <p className="text-sm font-body font-semibold opacity-80">— {todayVerse.reference}</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            onClick={() => onNavigate(action.id)}
            className="prayer-card text-left group hover:border-accent/30 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
              <action.icon size={20} className="text-accent" />
            </div>
            <h3 className="font-body font-semibold text-sm">{action.label}</h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5">{action.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
