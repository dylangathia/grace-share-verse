import { BookOpen, Heart, MessageCircle, PenLine, Home } from "lucide-react";

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "bible", label: "Bible", icon: BookOpen },
  { id: "prayers", label: "Prayers", icon: Heart },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "journal", label: "Journal", icon: PenLine },
];

const MobileBottomNav = ({ activeSection, onNavigate }: MobileBottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
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
      </div>
    </nav>
  );
};

export default MobileBottomNav;
