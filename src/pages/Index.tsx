import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import HomeScreen from "@/components/HomeScreen";
import BibleReader from "@/components/BibleReader";
import PrayerWall from "@/components/PrayerWall";
import CommunityChat from "@/components/CommunityChat";
import PrayerJournal from "@/components/PrayerJournal";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeScreen onNavigate={setActiveSection} />;
      case "bible":
        return <BibleReader />;
      case "prayers":
        return <PrayerWall />;
      case "chat":
        return <CommunityChat />;
      case "journal":
        return <PrayerJournal />;
      default:
        return <HomeScreen onNavigate={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
