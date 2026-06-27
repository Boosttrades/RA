import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
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
import { RANKS, Rank, getCurrentRankIndex } from "@/data/ranks";
import { useColors } from "@/hooks/useColors";

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
        {
          backgroundColor: bgColor,
          borderColor,
          borderWidth: isCurrent ? 2 : 1,
        },
      ]}
    >
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
                  {
                    color: isCurrent
                      ? "#FFFFFF"
                      : isAchieved
                      ? "#FFFFFF"
                      : colors.primary,
                  },
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
                  {
                    color: isLocked ? colors.mutedForeground : colors.navy,
                  },
                ]}
              >
                {rank.name}
              </Text>
              {isCurrent && (
                <View
                  style={[
                    styles.currentBadge,
                    { backgroundColor: colors.goldLight },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="crown"
                    size={11}
                    color={colors.gold}
                  />
                  <Text style={[styles.currentBadgeText, { color: colors.gold }]}>
                    {" "}Current
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.rankDesc,
                {
                  color: isLocked
                    ? colors.mutedForeground
                    : colors.mutedForeground,
                },
              ]}
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
        <View
          style={[styles.requirementsWrapper, { borderTopColor: colors.border }]}
        >
          <Text
            style={[styles.requirementsTitle, { color: colors.navy }]}
          >
            Requirements
          </Text>
          {rank.requirements.map((req, i) => (
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
              <Text
                style={[styles.reqText, { color: colors.foreground }]}
              >
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

export default function RanksScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { currentRankId, setCurrentRankId } = useApp();

  const currentIndex = getCurrentRankIndex(currentRankId);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 80;

  const handleAdvance = (rankId: string, level: number) => {
    const nextRank = RANKS.find((r) => r.level === level + 1);
    if (nextRank) {
      setCurrentRankId(nextRank.id);
    }
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
          Rank Progression
        </Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Level {currentIndex + 1} of {RANKS.length}
        </Text>
      </View>

      <View style={[styles.progressBar, { backgroundColor: colors.muted }]}>
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: colors.primary,
              width: `${((currentIndex + 1) / RANKS.length) * 100}%`,
            },
          ]}
        />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
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
  progressBar: {
    height: 4,
    width: "100%",
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  rankCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  rankHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  rankLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  levelBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  levelNum: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  rankNameCol: {
    flex: 1,
  },
  rankTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 3,
    flexWrap: "wrap",
  },
  rankName: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  currentBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  rankDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  requirementsWrapper: {
    padding: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  requirementsTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reqRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
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
  reqText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    flex: 1,
  },
  advanceBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  advanceBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
});
