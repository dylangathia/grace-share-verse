import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface AudioVerse {
  number: number;
  text: string;
}

interface AudioContextValue {
  isPlaying: boolean;
  isPaused: boolean;
  reference: string | null;
  currentVerse: number | null;
  totalVerses: number;
  rate: number;
  play: (book: string, chapter: number, verses: AudioVerse[], startAt?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  setRate: (r: number) => void;
}

const Ctx = createContext<AudioContextValue | null>(null);

export const AudioBibleProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<number | null>(null);
  const [rate, setRateState] = useState(1);

  const versesRef = useRef<AudioVerse[]>([]);
  const indexRef = useRef(0);
  const bookRef = useRef("");
  const chapterRef = useRef(0);
  const rateRef = useRef(1);

  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const speakIndex = useCallback((i: number) => {
    if (!supported) return;
    const verses = versesRef.current;
    if (i < 0 || i >= verses.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentVerse(null);
      return;
    }
    indexRef.current = i;
    setCurrentVerse(verses[i].number);

    const utter = new SpeechSynthesisUtterance(verses[i].text);
    utter.rate = rateRef.current;
    utter.pitch = 1;
    utter.onend = () => {
      // auto advance if still in playing state and not paused
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        speakIndex(indexRef.current + 1);
      }
    };
    utter.onerror = () => {
      // Stop quietly on error
    };
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [supported]);

  const play = useCallback((book: string, chapter: number, verses: AudioVerse[], startAt = 0) => {
    if (!supported || verses.length === 0) return;
    versesRef.current = verses;
    bookRef.current = book;
    chapterRef.current = chapter;
    setReference(`${book} ${chapter}`);
    setIsPlaying(true);
    setIsPaused(false);
    speakIndex(startAt);
  }, [supported, speakIndex]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentVerse(null);
    setReference(null);
  }, [supported]);

  const next = useCallback(() => {
    if (indexRef.current < versesRef.current.length - 1) {
      speakIndex(indexRef.current + 1);
      setIsPaused(false);
    }
  }, [speakIndex]);

  const prev = useCallback(() => {
    if (indexRef.current > 0) {
      speakIndex(indexRef.current - 1);
      setIsPaused(false);
    }
  }, [speakIndex]);

  const setRate = useCallback((r: number) => {
    rateRef.current = r;
    setRateState(r);
    // Re-speak current to apply new rate
    if (isPlaying && !isPaused) {
      speakIndex(indexRef.current);
    }
  }, [isPlaying, isPaused, speakIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return (
    <Ctx.Provider
      value={{
        isPlaying,
        isPaused,
        reference,
        currentVerse,
        totalVerses: versesRef.current.length,
        rate,
        play,
        pause,
        resume,
        stop,
        next,
        prev,
        setRate,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useAudioBible = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudioBible must be used within AudioBibleProvider");
  return ctx;
};
