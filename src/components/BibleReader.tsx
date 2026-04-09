import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, ChevronLeft, ChevronRight, BookOpen, Loader2, Grid3X3, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Verse {
  number: number;
  text: string;
}

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
  const [highlightedVerse, setHighlightedVerse] = useState<number | null>(null);
  const [bookIndex, setBookIndex] = useState(0);
  const [chapter, setChapter] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChapterGrid, setShowChapterGrid] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentBook = bibleBooks[bookIndex];

  const fetchChapter = useCallback(async (book: string, ch: number) => {
    setLoading(true);
    setError(null);
    setHighlightedVerse(null);
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
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-accent" />
          <span className="ml-3 text-sm text-muted-foreground font-body">Loading chapter...</span>
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
          <div className="space-y-1">
            {verses.map((verse, i) => (
              <motion.span
                key={`${currentBook.name}-${chapter}-${verse.number}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.015 }}
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
