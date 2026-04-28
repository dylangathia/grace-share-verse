import { useState, useRef, useMemo } from "react";
import AppSidebar from "@/components/AppSidebar";
import MobileBottomNav from "@/components/MobileBottomNav";
import HomeScreen from "@/components/HomeScreen";
import BibleReader from "@/components/BibleReader";
import PrayerWall from "@/components/PrayerWall";
import CommunityChat from "@/components/CommunityChat";
import PrayerJournal from "@/components/PrayerJournal";
import LivePrayerSession from "@/components/LivePrayerSession";
import WorshipShare from "@/components/WorshipShare";
import FaithMilestones from "@/components/FaithMilestones";
import PrayerPartners from "@/components/PrayerPartners";
import SoulCheck from "@/components/SoulCheck";
import Bookmarks from "@/components/Bookmarks";
import Settings from "@/components/Settings";
import OnboardingTour from "@/components/OnboardingTour";
import AudioMiniPlayer from "@/components/AudioMiniPlayer";
import { AudioBibleProvider } from "@/hooks/use-audio-bible";
import { useNotificationScheduler } from "@/hooks/use-notification-scheduler";
import { AnimatePresence, motion } from "framer-motion";

const sectionOrder = [
  "home", "bible", "prayers", "live-prayer", "partners",
  "soul-check", "worship", "milestones", "chat", "journal",
  "bookmarks", "settings",
];

const IndexInner = () => {
  const [activeSection, setActiveSection] = useState("home");
  const prevSection = useRef("home");

  useNotificationScheduler();

  const direction = useMemo(() => {
    const prevIdx = sectionOrder.indexOf(prevSection.current);
    const nextIdx = sectionOrder.indexOf(activeSection);
    return nextIdx >= prevIdx ? 1 : -1;
  }, [activeSection]);

  const handleNavigate = (section: string) => {
    prevSection.current = activeSection;
    setActiveSection(section);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home": return <HomeScreen onNavigate={handleNavigate} />;
      case "bible": return <BibleReader />;
      case "prayers": return <PrayerWall />;
      case "chat": return <CommunityChat />;
      case "journal": return <PrayerJournal />;
      case "live-prayer": return <LivePrayerSession />;
      case "worship": return <WorshipShare />;
      case "milestones": return <FaithMilestones />;
      case "partners": return <PrayerPartners />;
      case "soul-check": return <SoulCheck />;
      case "bookmarks": return <Bookmarks />;
      case "settings": return <Settings />;
      default: return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -60, opacity: 0 }),
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:block">
        <AppSidebar activeSection={activeSection} onNavigate={handleNavigate} />
      </div>
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeSection}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
            className="h-full"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
      <MobileBottomNav activeSection={activeSection} onNavigate={handleNavigate} />
      <AudioMiniPlayer />
      <OnboardingTour />
    </div>
  );
};

const Index = () => (
  <AudioBibleProvider>
    <IndexInner />
  </AudioBibleProvider>
);

export default Index;
