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
import { useColors } from "@/hooks/useColors";

type QuizPhase = "intro" | "question" | "results";

export default function QuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { saveQuizScore, bestQuizScore } = useApp();

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
      const finalScore = score + (isCorrect ? 0 : 0);
      saveQuizScore(attemptKey.current, score);
      setPhase("results");
    }
  };

  const handleRetry = () => {
    setPhase("intro");
  };

  const getOptionStyle = (optIndex: number) => {
    if (!answered) {
      return {
        backgroundColor: colors.card,
        borderColor: colors.border,
      };
    }
    if (optIndex === question.correctIndex) {
      return {
        backgroundColor: "#ECFDF5",
        borderColor: "#10B981",
      };
    }
    if (optIndex === selectedOption && optIndex !== question.correctIndex) {
      return {
        backgroundColor: "#FEF2F2",
        borderColor: "#EF4444",
      };
    }
    return {
      backgroundColor: colors.card,
      borderColor: colors.border,
    };
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
          Bible Quiz
        </Text>
        {phase === "question" && (
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Question {currentIndex + 1} of {totalQuestions}
          </Text>
        )}
        {phase === "intro" && bestQuizScore > 0 && (
          <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
            Best score: {bestQuizScore}/{totalQuestions}
          </Text>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {phase === "intro" && (
          <View style={styles.introWrapper}>
            <View
              style={[styles.introIconWrapper, { backgroundColor: colors.secondary }]}
            >
              <Ionicons name="trophy" size={48} color={colors.primary} />
            </View>
            <Text style={[styles.introTitle, { color: colors.navy }]}>
              Test Your Knowledge
            </Text>
            <Text style={[styles.introDesc, { color: colors.mutedForeground }]}>
              {totalQuestions} questions on Bible memory verses, the Royal
              Ambassador Promise, and Christian living. Take your time and do
              your best.
            </Text>

            {bestQuizScore > 0 && (
              <View
                style={[styles.bestScoreCard, { backgroundColor: colors.secondary }]}
              >
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
            <View
              style={[styles.progressTrack, { backgroundColor: colors.muted }]}
            >
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

            <View
              style={[
                styles.questionCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
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
                  style={[
                    styles.optionBtn,
                    getOptionStyle(i),
                    { borderColor: getOptionStyle(i).borderColor },
                  ]}
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
                            : answered &&
                              i === selectedOption &&
                              i !== question.correctIndex
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
                              (i === selectedOption &&
                                i !== question.correctIndex))
                              ? "#FFFFFF"
                              : colors.primary,
                        },
                      ]}
                    >
                      {String.fromCharCode(65 + i)}
                    </Text>
                  </View>
                  <Text
                    style={[styles.optionText, { color: getOptionTextColor(i) }]}
                  >
                    {opt}
                  </Text>
                  {answered && i === question.correctIndex && (
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  )}
                  {answered &&
                    i === selectedOption &&
                    i !== question.correctIndex && (
                      <Ionicons name="close-circle" size={20} color="#EF4444" />
                    )}
                </Pressable>
              ))}
            </View>

            {answered && (
              <View
                style={[
                  styles.explanationCard,
                  {
                    backgroundColor: isCorrect ? "#ECFDF5" : "#FEF2F2",
                    borderColor: isCorrect ? "#10B981" : "#EF4444",
                  },
                ]}
              >
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "information-circle"}
                  size={20}
                  color={isCorrect ? "#10B981" : "#EF4444"}
                />
                <Text
                  style={[
                    styles.explanationText,
                    { color: isCorrect ? "#065F46" : "#991B1B" },
                  ]}
                >
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
                  {currentIndex + 1 < totalQuestions
                    ? "Next Question"
                    : "See Results"}
                </Text>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </Pressable>
            )}
          </View>
        )}

        {phase === "results" && (
          <View style={styles.resultsWrapper}>
            <View
              style={[
                styles.scoreCircle,
                { borderColor: getScoreColor() },
              ]}
            >
              <Text
                style={[styles.scoreNum, { color: getScoreColor() }]}
              >
                {score}
              </Text>
              <Text style={[styles.scoreDenom, { color: colors.mutedForeground }]}>
                / {totalQuestions}
              </Text>
            </View>
            <Text style={[styles.scorePercent, { color: getScoreColor() }]}>
              {scorePercent}%
            </Text>
            <Text style={[styles.scoreMsg, { color: colors.navy }]}>
              {getScoreMessage()}
            </Text>
            <Text style={[styles.scoreDesc, { color: colors.mutedForeground }]}>
              You answered {score} out of {totalQuestions} questions correctly.
              {scorePercent < 80
                ? " Review the Manual to strengthen your knowledge."
                : " Keep up the excellent work!"}
            </Text>

            <View style={styles.resultsActions}>
              <Pressable
                style={[
                  styles.retryBtn,
                  {
                    backgroundColor: colors.secondary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={handleRetry}
              >
                <Ionicons name="refresh" size={18} color={colors.primary} />
                <Text style={[styles.retryBtnText, { color: colors.primary }]}>
                  Try Again
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  scrollContent: {
    padding: 16,
  },
  introWrapper: {
    alignItems: "center",
    paddingTop: 20,
    gap: 16,
  },
  introIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  introTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
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
  bestScoreText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
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
  startBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  questionWrapper: {
    gap: 14,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
  },
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
  questionText: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 26,
  },
  optionsWrapper: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionLetter: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionLetterText: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  optionText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    flex: 1,
    lineHeight: 20,
  },
  explanationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
  },
  explanationText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    flex: 1,
    lineHeight: 20,
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 14,
  },
  nextBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  resultsWrapper: {
    alignItems: "center",
    paddingTop: 24,
    gap: 12,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
    marginBottom: 4,
  },
  scoreNum: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
  },
  scoreDenom: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
    marginTop: 12,
  },
  scorePercent: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
  },
  scoreMsg: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  scoreDesc: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 23,
    paddingHorizontal: 16,
  },
  resultsActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  retryBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
