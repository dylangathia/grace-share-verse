import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2, ChevronLeft, ChevronRight, BookOpen, Grid3X3, ArrowRight, ArrowLeft, X, Highlighter, Bookmark as BookmarkIcon, Headphones, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReadingStreak } from "@/hooks/use-reading-streak";
import ReadingStreakBadge from "@/components/ReadingStreakBadge";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useAudioBible } from "@/hooks/use-audio-bible";
import ShareVerseDialog from "@/components/ShareVerseDialog";
import { toast } from "sonner";

interface Verse {
  number: number;
  text: string;
}

type HighlightColor = "yellow" | "green" | "blue" | "pink";

interface HighlightMap {
  // key: `${book}-${chapter}-${verseNumber}` => color
  [key: string]: HighlightColor;
}

const HIGHLIGHTS_KEY = "sanctuary-bible-highlights";

const colorStyles: Record<HighlightColor, string> = {
  yellow: "bg-[hsl(48_95%_70%/0.35)] dark:bg-[hsl(48_70%_50%/0.3)]",
  green: "bg-[hsl(142_60%_60%/0.3)] dark:bg-[hsl(142_50%_45%/0.3)]",
  blue: "bg-[hsl(210_80%_70%/0.3)] dark:bg-[hsl(210_60%_50%/0.3)]",
  pink: "bg-[hsl(340_80%_75%/0.3)] dark:bg-[hsl(340_60%_55%/0.3)]",
};

const colorSwatches: Record<HighlightColor, string> = {
  yellow: "bg-[hsl(48_95%_60%)]",
  green: "bg-[hsl(142_60%_50%)]",
  blue: "bg-[hsl(210_80%_60%)]",
  pink: "bg-[hsl(340_80%_65%)]",
};

const bibleBooks = [
  { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 }, { name: "Leviticus", chapters: 27 },
  { name: "Numbers", chapters: 36 }, { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
  { name: "2 Samuel", chapters: 24 }, { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 }, { name: "Ezra", chapters: 10 },
  { name: "Nehemiah", chapters: 13 }, { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 }, { name: "Ecclesiastes", chapters: 12 },
  { name: "Song of Solomon", chapters: 8 }, { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
  { name: "Hosea", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 }, { name: "Micah", chapters: 7 },
  { name: "Nahum", chapters: 3 }, { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 }, { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 }, { name: "Luke", chapters: 24 },
  { name: "John", chapters: 21 }, { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 }, { name: "Galatians", chapters: 6 },
  { name: "Ephesians", chapters: 6 }, { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 }, { name: "1 Timothy", chapters: 6 },
  { name: "2 Timothy", chapters: 4 }, { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 }, { name: "1 Peter", chapters: 5 },
  { name: "2 Peter", chapters: 3 }, { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 }, { name: "Revelation", chapters: 22 },
];

const BibleReader = () => {
  const [zenMode, setZenMode] = useState(false);
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [bookIndex, setBookIndex] = useState(0);
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChapterGrid, setShowChapterGrid] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const streakMarkedRef = useRef<string | null>(null);

  const [highlights, setHighlights] = useState<HighlightMap>(() => {
    try {
      const raw = localStorage.getItem(HIGHLIGHTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const { currentStreak, readToday, markRead } = useReadingStreak();
  const { isBookmarked, getBookmark, addBookmark, removeBookmark } = useBookmarks();
  const audio = useAudioBible();
  const [shareTarget, setShareTarget] = useState<{ reference: string; text: string } | null>(null);

  const currentBook = bibleBooks[bookIndex];

  const persistHighlights = (next: HighlightMap) => {
    setHighlights(next);
    try {
      localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(next));
    } catch {}
  };

  const verseKey = (verseNumber: number) =>
    `${currentBook.name}-${chapter}-${verseNumber}`;

  const setHighlight = (verseNumber: number, color: HighlightColor | null) => {
    const key = verseKey(verseNumber);
    const next = { ...highlights };
    if (color === null) {
      delete next[key];
    } else {
      next[key] = color;
    }
    persistHighlights(next);
    setActiveVerse(null);
  };

  useEffect(() => {
    const container = zenMode ? scrollRef.current : window;
    if (!container) return;

    const handleScroll = () => {
      if (zenMode && scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const progress = scrollHeight - clientHeight > 0 ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
        setScrollProgress(Math.min(100, progress));
      } else {
        const { scrollY } = window;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        setScrollProgress(Math.min(100, progress));
      }

      // Mark reading streak after 30% scroll on a chapter (once per chapter view)
      const sigKey = `${currentBook.name}-${chapter}`;
      if (scrollProgress > 30 && streakMarkedRef.current !== sigKey) {
        streakMarkedRef.current = sigKey;
        const newlyMarked = markRead();
        if (newlyMarked) {
          toast("🔥 Reading streak updated!", {
            description: "Great job showing up in the Word today.",
          });
        }
      }
    };

    (container as any).addEventListener("scroll", handleScroll, { passive: true });
    return () => (container as any).removeEventListener("scroll", handleScroll);
  }, [zenMode, scrollProgress, currentBook.name, chapter, markRead]);

  const fetchChapter = useCallback(async (book: string, ch: number) => {
    setLoading(true);
    setError(null);
    setActiveVerse(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("get-bible-chapter", {
        body: { book, chapter: ch, translation: "kjv" },
      });
      if (fnError) throw fnError;
      if (data?.verses) {
        setVerses(data.verses);
      } else {
        throw new Error("No verses returned");
      }
    } catch (e: unknown) {
      console.error("Failed to fetch chapter:", e);
      setError("Could not load this chapter. Please try again.");
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChapter(currentBook.name, chapter);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setShowChapterGrid(false);
    setScrollProgress(0);
    streakMarkedRef.current = null;
  }, [currentBook.name, chapter, fetchChapter]);

  const goNext = () => {
    if (chapter < currentBook.chapters) {
      setChapter(chapter + 1);
    } else if (bookIndex < bibleBooks.length - 1) {
      setBookIndex(bookIndex + 1);
      setChapter(1);
    }
  };

  const goPrev = () => {
    if (chapter > 1) {
      setChapter(chapter - 1);
    } else if (bookIndex > 0) {
      const prevBook = bibleBooks[bookIndex - 1];
      setBookIndex(bookIndex - 1);
      setChapter(prevBook.chapters);
    }
  };

  const getNextLabel = () => {
    if (chapter < currentBook.chapters) return `Chapter ${chapter + 1}`;
    if (bookIndex < bibleBooks.length - 1) return bibleBooks[bookIndex + 1].name;
    return null;
  };

  const getPrevLabel = () => {
    if (chapter > 1) return `Chapter ${chapter - 1}`;
    if (bookIndex > 0) return bibleBooks[bookIndex - 1].name;
    return null;
  };

  const content = (
    <div className="max-w-2xl mx-auto">
      {/* Reading progress bar */}
      <div className="sticky top-0 z-10 -mx-4 sm:-mx-8 px-4 sm:px-8 pt-2 pb-1 bg-background/80 backdrop-blur-sm">
        <Progress value={scrollProgress} className="h-1 bg-muted/40" />
      </div>

      <div className="flex items-center justify-between mb-8 mt-4 gap-3">
        {!zenMode && (
          <div className="flex-1 min-w-0">
            <h2 className="section-header">Bible</h2>
            <p className="text-sm text-muted-foreground font-body mt-1">Read, reflect, and meditate</p>
          </div>
        )}
        <div className="flex items-center gap-2 shrink-0">
          {!zenMode && (
            <ReadingStreakBadge streak={currentStreak} readToday={readToday} size="sm" />
          )}
          <button
            onClick={() => setZenMode(!zenMode)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
            aria-label={zenMode ? "Exit zen mode" : "Enter zen mode"}
          >
            {zenMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>

      {/* Book/Chapter selector */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button onClick={goPrev} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-center flex-wrap">
          <BookOpen size={16} className="text-accent shrink-0" />

          <Select
            value={bookIndex.toString()}
            onValueChange={(val) => {
              setBookIndex(parseInt(val));
              setChapter(1);
            }}
          >
            <SelectTrigger className="w-auto min-w-[140px] font-display text-base font-semibold border-none shadow-none bg-transparent h-auto py-1 px-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {bibleBooks.map((b, i) => (
                <SelectItem key={b.name} value={i.toString()} className="font-body text-sm">
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={chapter.toString()} onValueChange={(val) => setChapter(parseInt(val))}>
            <SelectTrigger className="w-auto min-w-[80px] font-body text-muted-foreground border-none shadow-none bg-transparent h-auto py-1 px-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {Array.from({ length: currentBook.chapters }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()} className="font-body text-sm">
                  Chapter {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button onClick={goNext} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Chapter grid toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowChapterGrid(!showChapterGrid)}
          className="flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-muted/50 hover:bg-muted"
        >
          <Grid3X3 size={12} />
          {showChapterGrid ? "Hide chapters" : `All ${currentBook.chapters} chapters`}
        </button>
      </div>

      {/* Chapter grid */}
      {showChapterGrid && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 prayer-card"
        >
          <p className="text-xs font-body text-muted-foreground mb-3">{currentBook.name} — select a chapter</p>
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
            {Array.from({ length: currentBook.chapters }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setChapter(i + 1)}
                className={`w-full aspect-square rounded-lg text-xs font-body font-medium transition-all ${
                  chapter === i + 1
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted/60 text-foreground hover:bg-accent/20"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Verses */}
      {loading ? (
        <div className="space-y-3 py-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className="h-5 bg-muted/60 rounded animate-pulse"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-sm text-destructive font-body mb-3">{error}</p>
          <button onClick={() => fetchChapter(currentBook.name, chapter)} className="gold-button text-sm">
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-1 leading-loose">
            {verses.map((verse, i) => {
              const key = verseKey(verse.number);
              const highlight = highlights[key];
              const isActive = activeVerse === verse.number;
              return (
                <span key={`${currentBook.name}-${chapter}-${verse.number}`} className="relative">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.015 }}
                    onClick={() => setActiveVerse(isActive ? null : verse.number)}
                    className={`scripture-text cursor-pointer inline transition-colors duration-200 rounded px-1 -mx-1 ${
                      highlight
                        ? colorStyles[highlight]
                        : isActive
                        ? "bg-accent/15"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    <sup className="verse-number">{verse.number}</sup>
                    {verse.text}{" "}
                  </motion.span>

                  {/* Highlight color picker popover */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, y: -4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="inline-flex items-center gap-1.5 align-middle ml-1 px-2 py-1 bg-card border border-border rounded-full shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Highlighter size={10} className="text-muted-foreground" />
                        {(Object.keys(colorSwatches) as HighlightColor[]).map((c) => (
                          <button
                            key={c}
                            onClick={() => setHighlight(verse.number, c)}
                            className={`w-4 h-4 rounded-full ${colorSwatches[c]} ${
                              highlight === c ? "ring-2 ring-foreground/40 ring-offset-1 ring-offset-card" : ""
                            } hover:scale-110 transition-transform`}
                            aria-label={`Highlight ${c}`}
                          />
                        ))}
                        {highlight && (
                          <button
                            onClick={() => setHighlight(verse.number, null)}
                            className="w-4 h-4 rounded-full bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center"
                            aria-label="Remove highlight"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              );
            })}
          </div>

          {/* Bottom navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            {getPrevLabel() ? (
              <button
                onClick={goPrev}
                className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground">Previous</p>
                  <p className="font-medium">{getPrevLabel()}</p>
                </div>
              </button>
            ) : <div />}

            {getNextLabel() ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Continue reading</p>
                  <p className="font-medium">{getNextLabel()}</p>
                </div>
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : <div />}
          </div>
        </>
      )}
    </div>
  );

  if (zenMode) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="zen-mode" ref={scrollRef}>
        {content}
      </motion.div>
    );
  }

  return <div className="p-4 sm:p-8" ref={scrollRef}>{content}</div>;
};

export default BibleReader;
