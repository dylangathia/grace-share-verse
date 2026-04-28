import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sanctuary-bookmarks";

export interface Bookmark {
  id: string; // `${book}-${chapter}-${verse}`
  book: string;
  chapter: number;
  verse: number;
  text: string;
  note: string;
  createdAt: number;
}

const load = (): Bookmark[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const save = (list: Bookmark[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("sanctuary-bookmarks-changed"));
  } catch {}
};

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(load);

  useEffect(() => {
    const handler = () => setBookmarks(load());
    window.addEventListener("sanctuary-bookmarks-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("sanctuary-bookmarks-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const isBookmarked = useCallback(
    (book: string, chapter: number, verse: number) =>
      bookmarks.some((b) => b.id === `${book}-${chapter}-${verse}`),
    [bookmarks]
  );

  const getBookmark = useCallback(
    (book: string, chapter: number, verse: number) =>
      bookmarks.find((b) => b.id === `${book}-${chapter}-${verse}`),
    [bookmarks]
  );

  const addBookmark = useCallback(
    (b: Omit<Bookmark, "id" | "createdAt"> & { createdAt?: number }) => {
      const id = `${b.book}-${b.chapter}-${b.verse}`;
      const next = [
        { ...b, id, createdAt: b.createdAt ?? Date.now() },
        ...load().filter((x) => x.id !== id),
      ];
      save(next);
      setBookmarks(next);
    },
    []
  );

  const updateNote = useCallback((id: string, note: string) => {
    const next = load().map((b) => (b.id === id ? { ...b, note } : b));
    save(next);
    setBookmarks(next);
  }, []);

  const removeBookmark = useCallback((id: string) => {
    const next = load().filter((b) => b.id !== id);
    save(next);
    setBookmarks(next);
  }, []);

  return { bookmarks, isBookmarked, getBookmark, addBookmark, updateNote, removeBookmark };
};
