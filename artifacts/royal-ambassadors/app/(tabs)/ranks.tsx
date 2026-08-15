import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { APP_UNLOCK_PASSWORD } from "@/constants/access";
import { useApp } from "@/context/AppContext";
import { RANKS, Rank, getCurrentRankIndex } from "@/data/ranks";
import { MEMORY_VERSES, MemoryVerse } from "@/data/verses";
import { useColors } from "@/hooks/useColors";

// ─── Rank Card ────────────────────────────────────────────────────────────────

function RankCard({
  rank,
  isCurrent,
  isAchieved,
  isLocked,
  onSelect,
}: {
  rank: Rank;
  isCurrent: boolean;
  isAchieved: boolean;
  isLocked: boolean;
  onSelect: () => void;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(isCurrent);

  const toggle = () => {
    if (!isLocked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setExpanded((v) => !v);
    }
  };

  const borderColor = isCurrent
    ? colors.gold
    : isAchieved
    ? colors.primary
    : colors.border;

  const bgColor = isLocked ? colors.muted : colors.card;

  return (
    <View
      style={[
        styles.rankCard,
        { backgroundColor: bgColor, borderColor, borderWidth: isCurrent ? 2 : 1 },
      ]}
    >
      {/* Gold accent bar for current rank */}
      {isCurrent && (
        <View style={[styles.rankAccentBar, { backgroundColor: colors.gold }]} />
      )}

      <Pressable style={styles.rankHeader} onPress={toggle}>
        <View style={styles.rankLeft}>
          <View
            style={[
              styles.levelBadge,
              {
                backgroundColor: isLocked
                  ? colors.muted
                  : isCurrent
                  ? colors.gold
                  : isAchieved
                  ? colors.primary
                  : colors.secondary,
              },
            ]}
          >
            {isLocked ? (
              <Ionicons name="lock-closed" size={16} color={colors.mutedForeground} />
            ) : isAchieved && !isCurrent ? (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            ) : (
              <Text
                style={[
                  styles.levelNum,
                  { color: isCurrent ? "#FFFFFF" : isAchieved ? "#FFFFFF" : colors.primary },
                ]}
              >
                {rank.level}
              </Text>
            )}
          </View>

          <View style={styles.rankNameCol}>
            <View style={styles.rankTitleRow}>
              <Text
                style={[
                  styles.rankName,
                  { color: isLocked ? colors.mutedForeground : colors.navy },
                ]}
              >
                {rank.name}
              </Text>
              {isCurrent && (
                <View
                  style={[styles.currentBadge, { backgroundColor: colors.goldLight }]}
                >
                  <MaterialCommunityIcons name="crown" size={11} color={colors.gold} />
                  <Text style={[styles.currentBadgeText, { color: colors.gold }]}>
                    {" "}Current
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.ageGroup,
                { color: isLocked ? colors.mutedForeground : colors.primary },
              ]}
            >
              {rank.ageGroup}
            </Text>
            <Text
              style={[styles.rankDesc, { color: colors.mutedForeground }]}
              numberOfLines={2}
            >
              {rank.description}
            </Text>
          </View>
        </View>
        {!isLocked && (
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.mutedForeground}
          />
        )}
      </Pressable>

      {expanded && !isLocked && (
        <View style={[styles.requirementsWrapper, { borderTopColor: colors.border }]}>
          <Text style={[styles.requirementsTitle, { color: colors.navy }]}>
            Requirements
          </Text>
          {rank.requirements.map((req) => (
            <View key={req.id} style={styles.reqRow}>
              <View
                style={[
                  styles.reqDot,
                  {
                    backgroundColor: isAchieved ? colors.primary : colors.muted,
                    borderColor: isAchieved ? colors.primary : colors.border,
                  },
                ]}
              >
                {isAchieved && (
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                )}
              </View>
              <Text style={[styles.reqText, { color: colors.foreground }]}>
                {req.text}
              </Text>
            </View>
          ))}
          {isCurrent && (
            <Pressable
              style={[styles.advanceBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                onSelect();
              }}
            >
              <Text style={styles.advanceBtnText}>Mark Rank Complete</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

// ─── Memory Verse Card ────────────────────────────────────────────────────────

function VerseCard({ verse, index }: { verse: MemoryVerse; index: number }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);

  return (
    <Pressable
      style={[
        styles.verseCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setExpanded((v) => !v);
      }}
    >
      {/* Number badge */}
      <View style={[styles.verseNumBadge, { backgroundColor: colors.secondary }]}>
        <Text style={[styles.verseNum, { color: colors.navy }]}>{index + 1}</Text>
      </View>

      <View style={styles.verseBody}>
        <Text style={[styles.verseReference, { color: colors.navy }]}>
          {verse.reference}
        </Text>

        <View style={[styles.topicPill, { backgroundColor: colors.goldLight }]}>
          <Text style={[styles.topicText, { color: colors.gold }]}>
            {verse.topic}
          </Text>
        </View>

        {expanded && (
          <Text style={[styles.verseFullText, { color: colors.foreground }]}>
            {`"${verse.text}"`}
          </Text>
        )}

        {!expanded && (
          <Text
            style={[styles.versePreview, { color: colors.mutedForeground }]}
            numberOfLines={1}
          >
            {verse.text}
          </Text>
        )}
      </View>

      <Ionicons
        name={expanded ? "chevron-up" : "chevron-down"}
        size={16}
        color={colors.mutedForeground}
      />
    </Pressable>
  );
}

// ─── Section Switcher ─────────────────────────────────────────────────────────

type Section = "ranks" | "verses";

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function RanksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    currentRankId,
    setCurrentRankId,
    ranksUnlocked,
    rankUnlockPromptVisible,
    recordRankTabTap,
    unlockRanks,
  } = useApp();
  const [section, setSection] = useState<Section>("ranks");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  React.useEffect(() => {
    // The first visit counts as the first tap; subsequent tab presses are
    // captured even when this tab is already selected.
    recordRankTabTap();
    const tabNavigation = navigation as unknown as {
      addListener: (event: "tabPress", listener: () => void) => () => void;
    };
    return tabNavigation.addListener("tabPress", recordRankTabTap);
  }, [navigation, recordRankTabTap]);

  if (!ranksUnlocked && section === "ranks") {
    const topPadding = Platform.OS === "web" ? 67 : insets.top;
    const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

    const handleUnlock = () => {
      if (password === APP_UNLOCK_PASSWORD) {
        Keyboard.dismiss();
        setPasswordError("");
        unlockRanks();
        return;
      }

      setPassword("");
      setPasswordError("Incorrect password. Please try again.");
    };

    return (
      <View
        style={[
          styles.container,
          styles.rankLockContainer,
          {
            backgroundColor: colors.background,
            paddingTop: topPadding,
            paddingBottom: bottomPadding,
          },
        ]}
      >
        <View style={styles.rankLockContent}>
          <View style={[styles.rankLockIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="shield-outline" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.rankLockTitle, { color: colors.navy }]}>
            Ranks temporarily locked
          </Text>
          <Text style={[styles.rankLockMessage, { color: colors.mutedForeground }]}>
            This section needs a separate unlock. Tap the Ranks tab three times
            quickly to show the password field.
          </Text>

          {rankUnlockPromptVisible && (
            <View style={styles.rankUnlockForm}>
              <Text style={[styles.rankUnlockLabel, { color: colors.foreground }]}>
                Enter rank tab password
              </Text>
              <View
                style={[
                  styles.rankInputWrapper,
                  {
                    backgroundColor: colors.card,
                    borderColor: passwordError ? colors.destructive : colors.border,
                  },
                ]}
              >
                <Ionicons name="key-outline" size={20} color={colors.primary} />
                <TextInput
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    if (passwordError) setPasswordError("");
                  }}
                  onSubmitEditing={handleUnlock}
                  placeholder="Password"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  style={[styles.rankInput, { color: colors.cardForeground }]}
                  accessibilityLabel="Rank tab unlock password"
                  testID="rank-unlock-password-input"
                />
              </View>
              {passwordError ? (
                <Text style={[styles.rankPasswordError, { color: colors.destructive }]}>
                  {passwordError}
                </Text>
              ) : null}
              <Pressable
                onPress={handleUnlock}
                style={[styles.rankUnlockButton, { backgroundColor: colors.primary }]}
                accessibilityRole="button"
                accessibilityLabel="Unlock rank tab"
                testID="rank-unlock-button"
              >
                <Text style={[styles.rankUnlockButtonText, { color: colors.primaryForeground }]}>
                  Unlock Ranks
                </Text>
                <Ionicons name="arrow-forward" size={18} color={colors.primaryForeground} />
              </Pressable>
            </View>
          )}

          <Pressable
            onPress={() => setSection("verses")}
            style={[styles.memoryVersesButton, { borderColor: colors.border }]}
            accessibilityRole="button"
            accessibilityLabel="Open memory verses"
            testID="open-memory-verses-button"
          >
            <Ionicons name="book-outline" size={19} color={colors.primary} />
            <Text style={[styles.memoryVersesButtonText, { color: colors.primary }]}>
              Open Memory Verses
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const currentIndex = getCurrentRankIndex(currentRankId);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 80;

  const handleAdvance = (rankId: string, level: number) => {
    const nextRank = RANKS.find((r) => r.level === level + 1);
    if (nextRank) setCurrentRankId(nextRank.id);
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
          {section === "ranks" ? "Rank Progression" : "Memory Verses"}
        </Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {section === "ranks"
            ? `Level ${currentIndex + 1} of ${RANKS.length}`
            : `${MEMORY_VERSES.length} verses to memorise`}
        </Text>
      </View>

      {/* Segmented switcher */}
      <View
        style={[
          styles.switcher,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <View style={[styles.switcherTrack, { backgroundColor: colors.muted }]}>
          <Pressable
            style={[
              styles.switcherTab,
              section === "ranks" && {
                backgroundColor: colors.navy,
                shadowColor: colors.navy,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 6,
                elevation: 4,
              },
            ]}
            onPress={() => setSection("ranks")}
          >
            <MaterialCommunityIcons
              name="shield-crown-outline"
              size={16}
              color={section === "ranks" ? "#FFFFFF" : colors.mutedForeground}
            />
            <Text
              style={[
                styles.switcherLabel,
                { color: section === "ranks" ? "#FFFFFF" : colors.mutedForeground },
                section === "ranks" && { fontFamily: "Inter_700Bold" },
              ]}
            >
              Ranks
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.switcherTab,
              section === "verses" && {
                backgroundColor: colors.navy,
                shadowColor: colors.navy,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 6,
                elevation: 4,
              },
            ]}
            onPress={() => setSection("verses")}
          >
            <Ionicons
              name="book-outline"
              size={16}
              color={section === "verses" ? "#FFFFFF" : colors.mutedForeground}
            />
            <Text
              style={[
                styles.switcherLabel,
                { color: section === "verses" ? "#FFFFFF" : colors.mutedForeground },
                section === "verses" && { fontFamily: "Inter_700Bold" },
              ]}
            >
              Memory Verses
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Ranks section */}
      {section === "ranks" && (
        <>
          <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.gold,
                  width: `${((currentIndex + 1) / RANKS.length) * 100}%`,
                },
              ]}
            />
          </View>

          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
            showsVerticalScrollIndicator={false}
          >
            {RANKS.map((rank, index) => (
              <RankCard
                key={rank.id}
                rank={rank}
                isCurrent={rank.id === currentRankId}
                isAchieved={index <= currentIndex}
                isLocked={index > currentIndex}
                onSelect={() => handleAdvance(rank.id, rank.level)}
              />
            ))}
          </ScrollView>
        </>
      )}

      {/* Memory Verses section */}
      {section === "verses" && (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.verseIntro,
              { backgroundColor: colors.goldLight, borderColor: colors.gold },
            ]}
          >
            <MaterialCommunityIcons name="crown" size={18} color={colors.gold} />
            <Text style={[styles.verseIntroText, { color: colors.navy }]}>
              Tap a verse to reveal the full text
            </Text>
          </View>

          {MEMORY_VERSES.map((verse, i) => (
            <VerseCard key={verse.id} verse={verse} index={i} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 2 },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular" },

  switcher: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  switcherTrack: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  switcherTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 10,
    borderRadius: 10,
  },
  switcherLabel: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },

  progressBar: { height: 3, width: "100%" },
  progressFill: { height: 3 },

  scrollContent: { padding: 16, gap: 12 },

  // Rank cards
  rankCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rankLockContainer: {
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  rankLockContent: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "center",
  },
  rankLockIcon: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  rankLockTitle: {
    fontSize: 25,
    lineHeight: 32,
    textAlign: "center",
    fontFamily: "Inter_700Bold",
  },
  rankLockMessage: {
    maxWidth: 350,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    marginTop: 14,
  },
  rankUnlockForm: {
    width: "100%",
    marginTop: 30,
  },
  rankUnlockLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 8,
  },
  rankInputWrapper: {
    minHeight: 54,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
  },
  rankInput: {
    flex: 1,
    minHeight: 52,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  rankPasswordError: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 7,
  },
  rankUnlockButton: {
    minHeight: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 18,
  },
  rankUnlockButtonText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  memoryVersesButton: {
    width: "100%",
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 22,
  },
  memoryVersesButtonText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  rankAccentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  rankHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingLeft: 20,
    justifyContent: "space-between",
  },
  rankLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: 12 },
  levelBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  levelNum: { fontSize: 18, fontFamily: "Inter_700Bold" },
  rankNameCol: { flex: 1 },
  rankTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
    flexWrap: "wrap",
  },
  rankName: { fontSize: 17, fontFamily: "Inter_700Bold" },
  currentBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  currentBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  ageGroup: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  rankDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  requirementsWrapper: { padding: 16, paddingTop: 12, borderTopWidth: 1, paddingLeft: 20 },
  requirementsTitle: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reqRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  reqDot: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  reqText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, flex: 1 },
  advanceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  advanceBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold", color: "#FFFFFF" },

  // Verse cards
  verseIntro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 4,
  },
  verseIntroText: { fontSize: 13, fontFamily: "Inter_500Medium", flex: 1 },
  verseCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  verseNumBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  verseNum: { fontSize: 13, fontFamily: "Inter_700Bold" },
  verseBody: { flex: 1, gap: 6 },
  verseReference: { fontSize: 15, fontFamily: "Inter_700Bold", lineHeight: 21 },
  topicPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  topicText: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  versePreview: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 19,
  },
  verseFullText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    fontStyle: "italic",
  },
});
