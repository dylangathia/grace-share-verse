import { BookOpen, Heart, MessageCircle, PenLine, Home, Users, Flame, Music, Star, Sun, Moon, HeartPulse } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface AppSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

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
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 h-screen bg-sidebar flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="font-display text-xl font-semibold text-sidebar-foreground tracking-tight">
          Sanctuary
        </h1>
        <p className="text-xs text-sidebar-foreground/50 font-body mt-1">Grace Community Church</p>
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
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sm font-body font-medium text-sidebar-foreground">
              J
            </div>
            <div>
              <p className="text-sm text-sidebar-foreground font-medium font-body">John</p>
              <p className="text-[10px] text-sidebar-foreground/50 font-body">Member</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
