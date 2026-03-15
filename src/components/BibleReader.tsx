import { useState } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const sampleVerses = [
  { number: 1, text: "In the beginning God created the heavens and the earth." },
  { number: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
  { number: 3, text: "And God said, \"Let there be light,\" and there was light." },
  { number: 4, text: "God saw that the light was good, and he separated the light from the darkness." },
  { number: 5, text: "God called the light \"day,\" and the darkness he called \"night.\" And there was evening, and there was morning—the first day." },
  { number: 6, text: "And God said, \"Let there be a vault between the waters to separate water from water.\"" },
  { number: 7, text: "So God made the vault and separated the water under the vault from the water above it. And it was so." },
  { number: 8, text: "God called the vault \"sky.\" And there was evening, and there was morning—the second day." },
  { number: 9, text: "And God said, \"Let the water under the sky be gathered to one place, and let dry ground appear.\" And it was so." },
  { number: 10, text: "God called the dry ground \"land,\" and the gathered waters he called \"seas.\" And God saw that it was good." },
];

const BibleReader = () => {
  const [zenMode, setZenMode] = useState(false);
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);

  const content = (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        {!zenMode && (
          <div>
            <h2 className="section-header">Bible</h2>
            <p className="text-sm text-muted-foreground font-body mt-1">Read, reflect, and meditate</p>
          </div>
        )}
        <button
          onClick={() => setZenMode(!zenMode)}
          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
        >
          {zenMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
      </div>

      {/* Book/Chapter selector */}
      <div className="flex items-center gap-4 mb-8">
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
          <ChevronLeft size={18} />
        </button>
        <div className="flex items-center gap-2 text-center">
          <BookOpen size={16} className="text-accent" />
          <span className="font-display text-lg font-semibold">Genesis</span>
          <span className="text-muted-foreground font-body">Chapter 1</span>
        </div>
        <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Verses */}
      <div className="space-y-1">
        {sampleVerses.map((verse, i) => (
          <motion.span
            key={verse.number}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => setHighlightedVerse(highlightedVerse === verse.number ? null : verse.number)}
            className={`scripture-text cursor-pointer inline transition-colors duration-200 ${
              highlightedVerse === verse.number
                ? "bg-accent/20 rounded px-1 -mx-1"
                : "hover:bg-secondary/50 rounded px-1 -mx-1"
            }`}
          >
            <sup className="verse-number">{verse.number}</sup>
            {verse.text}{" "}
          </motion.span>
        ))}
      </div>
    </div>
  );

  if (zenMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="zen-mode"
      >
        {content}
      </motion.div>
    );
  }

  return <div className="p-8">{content}</div>;
};

export default BibleReader;
