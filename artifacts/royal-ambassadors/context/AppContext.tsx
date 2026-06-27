import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "@ra_app_state_v1";

interface StoredState {
  userName: string;
  currentRankId: string;
  bookmarkedVerseIds: string[];
  completedSectionIds: string[];
  quizScores: Record<string, number>;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserNameState] = useState("Ambassador");
  const [currentRankId, setCurrentRankIdState] = useState("intern");
  const [bookmarkedVerseIds, setBookmarkedVerseIds] = useState<string[]>([]);
  const [completedSectionIds, setCompletedSectionIds] = useState<string[]>([]);
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

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
      }
    } catch (_) {}
  };

  const persist = async (updates: Partial<StoredState>) => {
    try {
      const current: StoredState = {
        userName,
        currentRankId,
        bookmarkedVerseIds,
        completedSectionIds,
        quizScores,
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
