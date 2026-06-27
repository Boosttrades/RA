import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { MANUAL_CHAPTERS } from "@/data/manual";
import { RANKS, getCurrentRankIndex } from "@/data/ranks";
import { MEMORY_VERSES } from "@/data/verses";
import { QUIZ_QUESTIONS } from "@/data/quizzes";
import { useColors } from "@/hooks/useColors";

function StatCard({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: string;
}) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.statIconWrapper, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon as never} size={20} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.navy }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    userName,
    setUserName,
    currentRankId,
    bookmarkedVerseIds,
    completedSectionIds,
    bestQuizScore,
    totalQuizzesTaken,
  } = useApp();

  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  const currentRank = RANKS.find((r) => r.id === currentRankId) ?? RANKS[0];
  const currentIndex = getCurrentRankIndex(currentRankId);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 80;

  const totalSections = MANUAL_CHAPTERS.reduce(
    (acc, ch) => acc + ch.sections.length,
    0
  );
  const completedSections = completedSectionIds.length;
  const initials = userName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCancelEdit = () => {
    setNameInput(userName);
    setEditing(false);
  };

  const bestScorePercent =
    QUIZ_QUESTIONS.length > 0
      ? Math.round((bestQuizScore / QUIZ_QUESTIONS.length) * 100)
      : 0;

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
          My Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.profileCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View
            style={[
              styles.avatarWrapper,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarInitials}>{initials}</Text>
          </View>

          {editing ? (
            <View style={styles.editRow}>
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    borderColor: colors.primary,
                    backgroundColor: colors.secondary,
                    color: colors.navy,
                  },
                ]}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
                maxLength={30}
                onSubmitEditing={handleSaveName}
                returnKeyType="done"
                placeholder="Enter your name"
                placeholderTextColor={colors.mutedForeground}
              />
              <View style={styles.editActions}>
                <Pressable
                  style={[styles.editBtn, { backgroundColor: colors.primary }]}
                  onPress={handleSaveName}
                >
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </Pressable>
                <Pressable
                  style={[
                    styles.editBtn,
                    {
                      backgroundColor: colors.muted,
                      borderColor: colors.border,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={handleCancelEdit}
                >
                  <Ionicons name="close" size={18} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              style={styles.nameRow}
              onPress={() => {
                setNameInput(userName);
                setEditing(true);
              }}
            >
              <Text style={[styles.userName, { color: colors.navy }]}>
                {userName}
              </Text>
              <Feather name="edit-2" size={14} color={colors.mutedForeground} />
            </Pressable>
          )}

          <View style={styles.rankRow}>
            <Image
              source={require("@/assets/images/rank-badge.png")}
              style={styles.rankBadgeSmall}
              contentFit="contain"
            />
            <View
              style={[
                styles.rankPill,
                { backgroundColor: colors.secondary },
              ]}
            >
              <MaterialCommunityIcons
                name="crown"
                size={13}
                color={colors.gold}
              />
              <Text style={[styles.rankPillText, { color: colors.primary }]}>
                {"  "}{currentRank.name} — Level {currentRank.level}
              </Text>
            </View>
          </View>

          <View
            style={[styles.rankProgressBar, { backgroundColor: colors.muted }]}
          >
            <View
              style={[
                styles.rankProgressFill,
                {
                  backgroundColor: colors.gold,
                  width: `${((currentIndex + 1) / RANKS.length) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.rankProgressLabel, { color: colors.mutedForeground }]}>
            {currentIndex + 1} of {RANKS.length} ranks achieved
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          PROGRESS
        </Text>

        <View style={styles.statsGrid}>
          <StatCard
            icon="book-outline"
            value={`${completedSections}/${totalSections}`}
            label="Sections Read"
            color={colors.primary}
          />
          <StatCard
            icon="bookmark-outline"
            value={`${bookmarkedVerseIds.length}/${MEMORY_VERSES.length}`}
            label="Verses Saved"
            color={colors.gold}
          />
          <StatCard
            icon="trophy-outline"
            value={totalQuizzesTaken > 0 ? `${bestScorePercent}%` : "—"}
            label="Best Quiz Score"
            color="#10B981"
          />
          <StatCard
            icon="refresh-outline"
            value={`${totalQuizzesTaken}`}
            label="Quizzes Taken"
            color="#8B5CF6"
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          NEXT RANK
        </Text>

        {currentIndex < RANKS.length - 1 ? (
          <View
            style={[
              styles.nextRankCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[
                styles.nextRankIcon,
                { backgroundColor: RANKS[currentIndex + 1].color + "18" },
              ]}
            >
              <Text
                style={[
                  styles.nextRankLevel,
                  { color: RANKS[currentIndex + 1].color },
                ]}
              >
                {RANKS[currentIndex + 1].level}
              </Text>
            </View>
            <View style={styles.nextRankInfo}>
              <Text style={[styles.nextRankName, { color: colors.navy }]}>
                {RANKS[currentIndex + 1].name}
              </Text>
              <Text
                style={[styles.nextRankDesc, { color: colors.mutedForeground }]}
                numberOfLines={2}
              >
                {RANKS[currentIndex + 1].description}
              </Text>
            </View>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.mutedForeground}
            />
          </View>
        ) : (
          <View
            style={[
              styles.nextRankCard,
              {
                backgroundColor: colors.goldLight,
                borderColor: colors.gold,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="crown"
              size={28}
              color={colors.gold}
            />
            <Text style={[styles.nextRankName, { color: colors.navy }]}>
              You have reached the highest rank!
            </Text>
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
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  userName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  editRow: {
    width: "100%",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  nameInput: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
  },
  editBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  rankBadgeSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  rankPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rankPillText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  rankProgressBar: {
    height: 6,
    borderRadius: 3,
    width: "100%",
    overflow: "hidden",
  },
  rankProgressFill: {
    height: 6,
    borderRadius: 3,
  },
  rankProgressLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginTop: 4,
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: "44%",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    alignItems: "center",
    gap: 6,
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  nextRankCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  nextRankIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  nextRankLevel: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  nextRankInfo: {
    flex: 1,
  },
  nextRankName: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 3,
  },
  nextRankDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
});
