import { useState } from "react";
import { BookOpen, Heart, MessageCircle, Church, PenLine, Home, ChevronDown, Users, Flame, Music, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AppSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const churches = [
  { id: "grace", name: "Grace Community", groups: ["Youth Ministry", "Bible Study", "Worship Team"] },
  { id: "hope", name: "Hope Fellowship", groups: ["Men's Group", "Women's Circle", "Outreach"] },
];

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "bible", label: "Bible", icon: BookOpen },
  
  { id: "prayers", label: "Prayer Wall", icon: Heart },
  { id: "live-prayer", label: "Live Prayer", icon: Flame },
  { id: "partners", label: "Prayer Partners", icon: Users },
  { id: "worship", label: "Worship", icon: Music },
  { id: "milestones", label: "Faith Journey", icon: Star },
  { id: "chat", label: "Community", icon: MessageCircle },
  { id: "journal", label: "Journal", icon: PenLine },
];

const AppSidebar = ({ activeSection, onNavigate }: AppSidebarProps) => {
  const [expandedChurch, setExpandedChurch] = useState<string | null>("grace");

  return (
    <aside className="w-64 h-screen bg-sidebar flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="font-display text-xl font-semibold text-sidebar-foreground tracking-tight">
          Sanctuary
        </h1>
        <p className="text-xs text-sidebar-foreground/50 font-body mt-1">A place for faith</p>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item w-full text-left text-sm ${
              activeSection === item.id ? "nav-item-active" : ""
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}

        {/* Churches */}
        <div className="pt-6 pb-2 px-4">
          <span className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-body font-semibold">
            My Churches
          </span>
        </div>

        {churches.map((church) => (
          <div key={church.id}>
            <button
              onClick={() => setExpandedChurch(expandedChurch === church.id ? null : church.id)}
              className="nav-item w-full text-left text-sm justify-between"
            >
              <span className="flex items-center gap-3">
                <Church size={18} />
                {church.name}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  expandedChurch === church.id ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedChurch === church.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {church.groups.map((group) => (
                    <button
                      key={group}
                      onClick={() => onNavigate("chat")}
                      className="w-full text-left text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground pl-12 pr-4 py-2 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Users size={12} />
                        {group}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-body font-medium text-sidebar-foreground">
            J
          </div>
          <div>
            <p className="text-sm text-sidebar-foreground font-medium font-body">John</p>
            <p className="text-[10px] text-sidebar-foreground/50 font-body">Grace Community</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
