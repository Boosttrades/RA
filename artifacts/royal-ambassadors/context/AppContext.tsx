import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";

export interface SavedPassage {
  id: string;
  sectionId: string;
  sectionTitle: string;
  text: string;
  savedAt: number;
}

interface AppContextType {
  userName: string;
  setUserName: (name: string) => void;
  currentRankId: string;
  setCurrentRankId: (id: string) => void;
  bookmarkedVerseIds: string[];
  toggleBookmark: (id: string) => void;
  completedSectionIds: string[];
  completeSection: (id: string) => void;
  quizScores: Record<string, number>;
  saveQuizScore: (attempt: string, score: number) => void;
  totalQuizzesTaken: number;
  bestQuizScore: number;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  // Saved passages (manual)
  savedPassages: SavedPassage[];
  savePassage: (passage: Omit<SavedPassage, "id" | "savedAt">) => void;
  removePassage: (id: string) => void;
  // Highlights (manual) — sectionId → set of highlighted text strings
  highlights: Record<string, string[]>;
  toggleHighlight: (sectionId: string, text: string) => void;
  isHighlighted: (sectionId: string, text: string) => boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "@ra_app_state_v2";

interface StoredState {
  userName: string;
  currentRankId: string;
  bookmarkedVerseIds: string[];
  completedSectionIds: string[];
  quizScores: Record<string, number>;
  themePreference?: ThemePreference;
  savedPassages?: SavedPassage[];
  highlights?: Record<string, string[]>;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserNameState] = useState("Ambassador");
  const [currentRankId, setCurrentRankIdState] = useState("candidate");
  const [bookmarkedVerseIds, setBookmarkedVerseIds] = useState<string[]>([]);
  const [completedSectionIds, setCompletedSectionIds] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>("system");
  const [savedPassages, setSavedPassages] = useState<SavedPassage[]>([]);
  const [highlights, setHighlights] = useState<Record<string, string[]>>({});

  useEffect(() => {
    loadState();
  }, []);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredState = JSON.parse(stored);
        if (data.userName) setUserNameState(data.userName);
        if (data.currentRankId) setCurrentRankIdState(data.currentRankId);
        if (data.bookmarkedVerseIds) setBookmarkedVerseIds(data.bookmarkedVerseIds);
        if (data.completedSectionIds) setCompletedSectionIds(data.completedSectionIds);
        if (data.quizScores) setQuizScores(data.quizScores);
        if (data.themePreference) setThemePreferenceState(data.themePreference);
        if (data.savedPassages) setSavedPassages(data.savedPassages);
        if (data.highlights) setHighlights(data.highlights);
      }
    } catch (_) {}
  };

  const setThemePreference = (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    persist({ themePreference: pref });
  };

  const persist = async (updates: Partial<StoredState>) => {
    try {
      const current: StoredState = {
        userName,
        currentRankId,
        bookmarkedVerseIds,
        completedSectionIds,
        quizScores,
        themePreference,
        savedPassages,
        highlights,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...updates }));
    } catch (_) {}
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    persist({ userName: name });
  };

  const setCurrentRankId = (id: string) => {
    setCurrentRankIdState(id);
    persist({ currentRankId: id });
  };

  const toggleBookmark = (id: string) => {
    const next = bookmarkedVerseIds.includes(id)
      ? bookmarkedVerseIds.filter((v) => v !== id)
      : [...bookmarkedVerseIds, id];
    setBookmarkedVerseIds(next);
    persist({ bookmarkedVerseIds: next });
  };

  const completeSection = (id: string) => {
    if (!completedSectionIds.includes(id)) {
      const next = [...completedSectionIds, id];
      setCompletedSectionIds(next);
      persist({ completedSectionIds: next });
    }
  };

  const saveQuizScore = (attempt: string, score: number) => {
    const next = { ...quizScores, [attempt]: Math.max(score, quizScores[attempt] ?? 0) };
    setQuizScores(next);
    persist({ quizScores: next });
  };

  const savePassage = (passage: Omit<SavedPassage, "id" | "savedAt">) => {
    const next: SavedPassage = {
      ...passage,
      id: Date.now().toString(),
      savedAt: Date.now(),
    };
    const updated = [next, ...savedPassages];
    setSavedPassages(updated);
    persist({ savedPassages: updated });
  };

  const removePassage = (id: string) => {
    const updated = savedPassages.filter((p) => p.id !== id);
    setSavedPassages(updated);
    persist({ savedPassages: updated });
  };

  const toggleHighlight = (sectionId: string, text: string) => {
    const current = highlights[sectionId] ?? [];
    const next = current.includes(text)
      ? current.filter((t) => t !== text)
      : [...current, text];
    const updated = { ...highlights, [sectionId]: next };
    setHighlights(updated);
    persist({ highlights: updated });
  };

  const isHighlighted = (sectionId: string, text: string) =>
    (highlights[sectionId] ?? []).includes(text);

  const totalQuizzesTaken = Object.keys(quizScores).length;
  const bestQuizScore = Object.values(quizScores).reduce((max, s) => Math.max(max, s), 0);

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
        currentRankId,
        setCurrentRankId,
        bookmarkedVerseIds,
        toggleBookmark,
        completedSectionIds,
        completeSection,
        quizScores,
        saveQuizScore,
        totalQuizzesTaken,
        bestQuizScore,
        themePreference,
        setThemePreference,
        savedPassages,
        savePassage,
        removePassage,
        highlights,
        toggleHighlight,
        isHighlighted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
