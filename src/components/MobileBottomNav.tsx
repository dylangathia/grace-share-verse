import { useState } from "react";
import { BookOpen, Heart, Home, Flame, LayoutGrid, X, Music, Star, Users, MessageCircle, PenLine, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const primaryNav = [
  { id: "home", label: "Home", icon: Home },
  { id: "bible", label: "Bible", icon: BookOpen },
  { id: "prayers", label: "Prayers", icon: Heart },
  { id: "live-prayer", label: "Live", icon: Flame },
];

const moreItems = [
  { id: "worship", label: "Worship", icon: Music },
  { id: "milestones", label: "Faith Journey", icon: Star },
  { id: "partners", label: "Prayer Partners", icon: Users },
  { id: "chat", label: "Community", icon: MessageCircle },
  { id: "journal", label: "Journal", icon: PenLine },
];

const MobileBottomNav = ({ activeSection, onNavigate }: MobileBottomNavProps) => {
  const [showMore, setShowMore] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isMoreActive = moreItems.some((item) => item.id === activeSection);

  return (
    <>
      {/* More Menu Overlay */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-foreground/40 md:hidden"
            onClick={() => setShowMore(false)}
          />
        )}
      </AnimatePresence>

      {/* More Menu Panel */}
      <AnimatePresence>
        {showMore && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-16 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border rounded-t-2xl p-4 md:hidden"
          >
            <div className="grid grid-cols-3 gap-3">
              {moreItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onNavigate(item.id); setShowMore(false); }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors ${
                    activeSection === item.id
                      ? "bg-sidebar-accent text-accent"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-[10px] font-body font-medium">{item.label}</span>
                </button>
              ))}
              <button
                onClick={toggleTheme}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                <span className="text-[10px] font-body font-medium">{theme === "light" ? "Dark" : "Light"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {primaryNav.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setShowMore(false); }}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeSection === item.id
                  ? "text-accent"
                  : "text-sidebar-foreground/60"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-body font-medium">{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isMoreActive || showMore
                ? "text-accent"
                : "text-sidebar-foreground/60"
            }`}
          >
            {showMore ? <X size={20} /> : <LayoutGrid size={20} />}
            <span className="text-[10px] font-body font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default MobileBottomNav;
