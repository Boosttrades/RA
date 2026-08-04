import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { QUIZ_QUESTIONS } from "@/data/quizzes";
import { MEMORY_VERSES, MemoryVerse } from "@/data/verses";
import { useColors } from "@/hooks/useColors";

type QuizPhase = "intro" | "question" | "results";
type QuizMode = "trivia" | "verses";

// ─── Memory Verse Flashcard ──────────────────────────────────────────────────

function VerseFlashcard({
  verse,
  index,
  total,
  onKnow,
  onPractice,
}: {
  verse: MemoryVerse;
  index: number;
  total: number;
  onKnow: () => void;
  onPractice: () => void;
}) {
  const colors = useColors();
  const [revealed, setRevealed] = useState(false);

  return (
    <View style={fcStyles.wrapper}>
      {/* Progress */}
      <View style={[fcStyles.progressTrack, { backgroundColor: colors.muted }]}>
        <View
          style={[
            fcStyles.progressFill,
            {
              backgroundColor: colors.gold,
              width: `${((index + 1) / total) * 100}%`,
            },
          ]}
        />
      </View>
      <Text style={[fcStyles.counter, { color: colors.mutedForeground }]}>
        {index + 1} / {total}
      </Text>

      {/* Card */}
      <View
        style={[
          fcStyles.card,
          { backgroundColor: colors.card, borderColor: colors.gold },
        ]}
      >
        <View
          style={[fcStyles.topicBadge, { backgroundColor: colors.primary }]}
        >
          <Text style={fcStyles.topicText}>{verse.topic}</Text>
        </View>
        <Text style={[fcStyles.reference, { color: colors.navy }]}>
          {verse.reference}
        </Text>

        {!revealed ? (
          <Pressable
            style={[fcStyles.revealBtn, { borderColor: colors.gold, borderWidth: 1.5 }]}
            onPress={() => setRevealed(true)}
          >
            <Ionicons name="eye-outline" size={20} color={colors.gold} />
            <Text style={[fcStyles.revealText, { color: colors.gold }]}>
              Tap to reveal verse
            </Text>
          </Pressable>
        ) : (
          <Text style={[fcStyles.verseText, { color: colors.navy }]}>
            {`"${verse.text}"`}
          </Text>
        )}
      </View>

      {/* Action buttons — only show once revealed */}
      {revealed && (
        <View style={fcStyles.actions}>
          <Pressable
            style={[fcStyles.practiceBtn, { backgroundColor: colors.secondary, borderColor: colors.border }]}
            onPress={() => { setRevealed(false); onPractice(); }}
          >
            <Ionicons name="refresh" size={18} color={colors.navy} />
            <Text style={[fcStyles.practiceBtnText, { color: colors.navy }]}>
              Still learning
            </Text>
          </Pressable>
          <Pressable
            style={[fcStyles.knowBtn, { backgroundColor: "#10B981" }]}
            onPress={() => { setRevealed(false); onKnow(); }}
          >
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            <Text style={fcStyles.knowBtnText}>Got it!</Text>
          </Pressable>
        </View>
      )}

      {!revealed && (
        <Text style={[fcStyles.hint, { color: colors.mutedForeground }]}>
          Try to recall the verse before revealing it
        </Text>
      )}
    </View>
  );
}

const fcStyles = StyleSheet.create({
  wrapper: { gap: 14, paddingTop: 8 },
  progressTrack: { height: 5, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 5, borderRadius: 3 },
  counter: { fontSize: 13, fontFamily: "Inter_500Medium", textAlign: "center" },
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 200,
  },
  topicBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  topicText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  reference: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    lineHeight: 34,
  },
  revealBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 14,
  },
  revealText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  verseText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    fontStyle: "italic",
  },
  actions: { flexDirection: "row", gap: 12 },
  practiceBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  practiceBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  knowBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  knowBtnText: { fontSize: 14, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  hint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    fontStyle: "italic",
  },
});

// ─── Memory Verse Screen ─────────────────────────────────────────────────────

function MemoryVerseScreen({ bottomPadding }: { bottomPadding: number }) {
  const colors = useColors();
  const [verseIndex, setVerseIndex] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const [practiceQueue, setPracticeQueue] = useState<MemoryVerse[]>([]);
  const [done, setDone] = useState(false);
  const [deck, setDeck] = useState<MemoryVerse[]>(MEMORY_VERSES);

  const currentVerse = deck[verseIndex];

  const advance = (knew: boolean) => {
    Haptics.impactAsync(
      knew ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
    );
    if (knew) setKnownCount((k) => k + 1);
    else setPracticeQueue((q) => [...q, currentVerse]);

    if (verseIndex + 1 < deck.length) {
      setVerseIndex((i) => i + 1);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setDeck(MEMORY_VERSES);
    setVerseIndex(0);
    setKnownCount(0);
    setPracticeQueue([]);
    setDone(false);
  };

  const practiceMissed = () => {
    setDeck(practiceQueue);
    setVerseIndex(0);
    setKnownCount(0);
    setPracticeQueue([]);
    setDone(false);
  };

  if (done) {
    const missed = practiceQueue.length;
    const pct = Math.round((knownCount / MEMORY_VERSES.length) * 100);
    return (
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsWrapper}>
          <View style={[fcStyles.card, { backgroundColor: colors.card, borderColor: colors.gold, gap: 12 }]}>
            <Ionicons name="star" size={48} color={colors.gold} style={{ alignSelf: "center" }} />
            <Text style={[styles.scoreMsg, { color: colors.navy }]}>
              {pct >= 80 ? "Excellent memory!" : pct >= 60 ? "Good progress!" : "Keep practising!"}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-around", paddingTop: 8 }}>
              <View style={{ alignItems: "center" }}>
                <Text style={[styles.scoreNum, { color: "#10B981" }]}>{knownCount}</Text>
                <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Got it</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={[styles.scoreNum, { color: colors.gold }]}>{missed}</Text>
                <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Practice</Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={[styles.scoreNum, { color: colors.navy }]}>{pct}%</Text>
                <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Score</Text>
              </View>
            </View>
          </View>

          <View style={styles.resultsActions}>
            {missed > 0 && (
              <Pressable
                style={[styles.retryBtn, { backgroundColor: colors.secondary, borderColor: colors.primary }]}
                onPress={practiceMissed}
              >
                <Ionicons name="refresh" size={18} color={colors.primary} />
                <Text style={[styles.retryBtnText, { color: colors.primary }]}>
                  Practice {missed} missed
                </Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.startBtn, { backgroundColor: colors.primary }]}
              onPress={restart}
            >
              <Ionicons name="refresh-circle" size={18} color="#FFFFFF" />
              <Text style={styles.startBtnText}>Start Over</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: bottomPadding },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <VerseFlashcard
        verse={currentVerse}
        index={verseIndex}
        total={deck.length}
        onKnow={() => advance(true)}
        onPractice={() => advance(false)}
      />
    </ScrollView>
  );
}

// ─── Main Quiz Screen ─────────────────────────────────────────────────────────

export default function QuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { saveQuizScore, bestQuizScore } = useApp();

  const [mode, setMode] = useState<QuizMode>("trivia");
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const attemptKey = useRef(
    `quiz_${Date.now().toString() + Math.random().toString(36).substring(2, 7)}`
  );

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 80;

  const question = QUIZ_QUESTIONS[currentIndex];
  const isCorrect = selectedOption === question?.correctIndex;
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleStart = () => {
    setPhase("question");
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    attemptKey.current = `quiz_${Date.now().toString() + Math.random().toString(36).substring(2, 7)}`;
  };

  const handleSelectOption = (index: number) => {
    if (answered) return;
    setSelectedOption(index);
    setAnswered(true);
    const correct = index === question.correctIndex;
    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setScore((s) => s + 1);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    } else {
      saveQuizScore(attemptKey.current, score);
      setPhase("results");
    }
  };

  const handleRetry = () => setPhase("intro");

  const getOptionStyle = (optIndex: number) => {
    if (!answered) return { backgroundColor: colors.card, borderColor: colors.border };
    if (optIndex === question.correctIndex) return { backgroundColor: "#ECFDF5", borderColor: "#10B981" };
    if (optIndex === selectedOption && optIndex !== question.correctIndex)
      return { backgroundColor: "#FEF2F2", borderColor: "#EF4444" };
    return { backgroundColor: colors.card, borderColor: colors.border };
  };

  const getOptionTextColor = (optIndex: number) => {
    if (!answered) return colors.navy;
    if (optIndex === question.correctIndex) return "#065F46";
    if (optIndex === selectedOption && optIndex !== question.correctIndex) return "#991B1B";
    return colors.mutedForeground;
  };

  const scorePercent = Math.round((score / totalQuestions) * 100);
  const getScoreMessage = () => {
    if (scorePercent >= 90) return "Outstanding work!";
    if (scorePercent >= 70) return "Well done!";
    if (scorePercent >= 50) return "Good effort!";
    return "Keep studying — you will improve!";
  };
  const getScoreColor = () => {
    if (scorePercent >= 90) return "#10B981";
    if (scorePercent >= 70) return colors.primary;
    if (scorePercent >= 50) return colors.gold;
    return "#EF4444";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 14,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.navy }]}>
          {mode === "trivia" ? "Bible Quiz" : "Memory Verses"}
        </Text>
        {mode === "trivia" && phase === "question" && (
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Question {currentIndex + 1} of {totalQuestions}
          </Text>
        )}
        {mode === "trivia" && phase === "intro" && bestQuizScore > 0 && (
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Best: {bestQuizScore}/{totalQuestions}
          </Text>
        )}
      </View>

      {/* Mode tab switcher */}
      <View
        style={[
          styles.modeSwitcher,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Pressable
          style={[
            styles.modeTab,
            mode === "trivia" && {
              backgroundColor: colors.primary,
              borderRadius: 10,
            },
          ]}
          onPress={() => { setMode("trivia"); setPhase("intro"); }}
        >
          <Ionicons
            name="trophy-outline"
            size={16}
            color={mode === "trivia" ? "#FFFFFF" : colors.mutedForeground}
          />
          <Text
            style={[
              styles.modeTabText,
              { color: mode === "trivia" ? "#FFFFFF" : colors.mutedForeground },
            ]}
          >
            Bible Quiz
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.modeTab,
            mode === "verses" && {
              backgroundColor: colors.primary,
              borderRadius: 10,
            },
          ]}
          onPress={() => setMode("verses")}
        >
          <Ionicons
            name="book-outline"
            size={16}
            color={mode === "verses" ? "#FFFFFF" : colors.mutedForeground}
          />
          <Text
            style={[
              styles.modeTabText,
              { color: mode === "verses" ? "#FFFFFF" : colors.mutedForeground },
            ]}
          >
            Memory Verses
          </Text>
        </Pressable>
      </View>

      {/* Memory Verse Mode */}
      {mode === "verses" && (
        <MemoryVerseScreen bottomPadding={bottomPadding} />
      )}

      {/* Trivia Mode */}
      {mode === "trivia" && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          {phase === "intro" && (
            <View style={styles.introWrapper}>
              <View style={[styles.introIconWrapper, { backgroundColor: colors.secondary }]}>
                <Ionicons name="trophy" size={48} color={colors.primary} />
              </View>
              <Text style={[styles.introTitle, { color: colors.navy }]}>
                Test Your Knowledge
              </Text>
              <Text style={[styles.introDesc, { color: colors.mutedForeground }]}>
                {totalQuestions} questions on Bible memory verses, the Royal
                Ambassador Promise, and Christian living.
              </Text>
              {bestQuizScore > 0 && (
                <View style={[styles.bestScoreCard, { backgroundColor: colors.secondary }]}>
                  <Ionicons name="star" size={20} color={colors.primary} />
                  <Text style={[styles.bestScoreText, { color: colors.primary }]}>
                    Personal best: {bestQuizScore}/{totalQuestions} (
                    {Math.round((bestQuizScore / totalQuestions) * 100)}%)
                  </Text>
                </View>
              )}
              <Pressable
                style={[styles.startBtn, { backgroundColor: colors.primary }]}
                onPress={handleStart}
              >
                <Text style={styles.startBtnText}>Start Quiz</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          )}

          {phase === "question" && (
            <View style={styles.questionWrapper}>
              <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: colors.primary,
                      width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={[styles.questionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.questionNum, { color: colors.mutedForeground }]}>
                  Q{currentIndex + 1}
                </Text>
                <Text style={[styles.questionText, { color: colors.navy }]}>
                  {question.question}
                </Text>
              </View>
              <View style={styles.optionsWrapper}>
                {question.options.map((opt, i) => (
                  <Pressable
                    key={i}
                    style={[styles.optionBtn, getOptionStyle(i)]}
                    onPress={() => handleSelectOption(i)}
                    disabled={answered}
                  >
                    <View
                      style={[
                        styles.optionLetter,
                        {
                          backgroundColor:
                            answered && i === question.correctIndex
                              ? "#10B981"
                              : answered && i === selectedOption && i !== question.correctIndex
                              ? "#EF4444"
                              : colors.secondary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionLetterText,
                          {
                            color:
                              answered &&
                              (i === question.correctIndex ||
                                (i === selectedOption && i !== question.correctIndex))
                                ? "#FFFFFF"
                                : colors.primary,
                          },
                        ]}
                      >
                        {String.fromCharCode(65 + i)}
                      </Text>
                    </View>
                    <Text style={[styles.optionText, { color: getOptionTextColor(i) }]}>
                      {opt}
                    </Text>
                    {answered && i === question.correctIndex && (
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    )}
                    {answered && i === selectedOption && i !== question.correctIndex && (
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    )}
                  </Pressable>
                ))}
              </View>
              {answered && (
                <View
                  style={[
                    styles.explanationCard,
                    { backgroundColor: isCorrect ? "#ECFDF5" : "#FEF2F2", borderColor: isCorrect ? "#10B981" : "#EF4444" },
                  ]}
                >
                  <Ionicons
                    name={isCorrect ? "checkmark-circle" : "information-circle"}
                    size={20}
                    color={isCorrect ? "#10B981" : "#EF4444"}
                  />
                  <Text style={[styles.explanationText, { color: isCorrect ? "#065F46" : "#991B1B" }]}>
                    {question.explanation}
                  </Text>
                </View>
              )}
              {answered && (
                <Pressable
                  style={[styles.nextBtn, { backgroundColor: colors.primary }]}
                  onPress={handleNext}
                >
                  <Text style={styles.nextBtnText}>
                    {currentIndex + 1 < totalQuestions ? "Next Question" : "See Results"}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>
              )}
            </View>
          )}

          {phase === "results" && (
            <View style={styles.resultsWrapper}>
              <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
                <Text style={[styles.scoreNum, { color: getScoreColor() }]}>{score}</Text>
                <Text style={[styles.scoreDenom, { color: colors.mutedForeground }]}>
                  / {totalQuestions}
                </Text>
              </View>
              <Text style={[styles.scorePercent, { color: getScoreColor() }]}>{scorePercent}%</Text>
              <Text style={[styles.scoreMsg, { color: colors.navy }]}>{getScoreMessage()}</Text>
              <Text style={[styles.scoreDesc, { color: colors.mutedForeground }]}>
                You answered {score} out of {totalQuestions} correctly.
                {scorePercent < 80
                  ? " Review the Manual to strengthen your knowledge."
                  : " Keep up the excellent work!"}
              </Text>
              <View style={styles.resultsActions}>
                <Pressable
                  style={[styles.retryBtn, { backgroundColor: colors.secondary, borderColor: colors.primary }]}
                  onPress={handleRetry}
                >
                  <Ionicons name="refresh" size={18} color={colors.primary} />
                  <Text style={[styles.retryBtnText, { color: colors.primary }]}>Try Again</Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 2 },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  modeSwitcher: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
  },
  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  modeTabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  scrollContent: { padding: 16 },
  introWrapper: { alignItems: "center", paddingTop: 20, gap: 16 },
  introIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  introTitle: { fontSize: 24, fontFamily: "Inter_700Bold", textAlign: "center" },
  introDesc: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 23,
    paddingHorizontal: 16,
  },
  bestScoreCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bestScoreText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 14,
    marginTop: 4,
  },
  startBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  questionWrapper: { gap: 14 },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },
  questionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  questionNum: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  questionText: { fontSize: 17, fontFamily: "Inter_600SemiBold", lineHeight: 26 },
  optionsWrapper: { gap: 10 },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionLetterText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  optionText: { fontSize: 14, fontFamily: "Inter_500Medium", flex: 1, lineHeight: 20 },
  explanationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  explanationText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 20 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 14,
  },
  nextBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  resultsWrapper: { alignItems: "center", paddingTop: 24, gap: 12 },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 4,
  },
  scoreNum: { fontSize: 40, fontFamily: "Inter_700Bold" },
  scoreDenom: { fontSize: 18, fontFamily: "Inter_400Regular", marginTop: 12 },
  scoreLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  scorePercent: { fontSize: 28, fontFamily: "Inter_700Bold" },
  scoreMsg: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center" },
  scoreDesc: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 23,
    paddingHorizontal: 16,
  },
  resultsActions: { flexDirection: "row", gap: 12, marginTop: 8, flexWrap: "wrap", justifyContent: "center" },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  retryBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
