import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
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
import { RANKS } from "@/data/ranks";
import { getDailyVerse } from "@/data/verses";
import { useColors } from "@/hooks/useColors";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { userName, currentRankId, bookmarkedVerseIds, toggleBookmark } = useApp();
  const router = useRouter();

  const currentRank = useMemo(
    () => RANKS.find((r) => r.id === currentRankId) ?? RANKS[0],
    [currentRankId]
  );
  const dailyVerse = useMemo(() => getDailyVerse(), []);
  const isBookmarked = bookmarkedVerseIds.includes(dailyVerse.id);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 80;

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(dailyVerse.id);
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
        <Pressable style={styles.headerBtn} hitSlop={10}>
          <Feather name="menu" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          Royal Ambassadors
        </Text>
        <Pressable style={styles.headerBtn} hitSlop={10}>
          <View>
            <Feather name="bell" size={22} color={colors.primary} />
            <View
              style={[styles.notifDot, { backgroundColor: colors.gold }]}
            />
          </View>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        <View style={styles.greetingSection}>
          <View style={styles.globeWatermark} pointerEvents="none">
            <Ionicons
              name="globe-outline"
              size={200}
              color={colors.primary}
              style={{ opacity: 0.05 }}
            />
          </View>
          <Text style={[styles.greetingSmall, { color: colors.mutedForeground }]}>
            {getGreeting()},
          </Text>
          <Text style={[styles.greetingName, { color: colors.navy }]}>
            {userName}!
          </Text>
          <View style={styles.taglineRow}>
            <MaterialCommunityIcons
              name="crown"
              size={16}
              color={colors.gold}
            />
            <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
              {"  "}Keep growing. Keep serving.
            </Text>
          </View>
        </View>

        <View style={styles.cardsWrapper}>
          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Image
              source={require("@/assets/images/rank-badge.png")}
              style={styles.rankBadge}
              contentFit="contain"
            />
            <View style={styles.rankInfo}>
              <Text style={[styles.rankLabel, { color: colors.primary }]}>
                CURRENT RANK
              </Text>
              <Text style={[styles.rankName, { color: colors.navy }]}>
                {currentRank.name}
              </Text>
            </View>
            <Pressable
              style={[
                styles.rankButton,
                { backgroundColor: colors.secondary },
              ]}
              onPress={() => router.push("/ranks")}
              hitSlop={6}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={colors.primary}
              />
            </Pressable>
          </View>

          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View
              style={[styles.bookIconWrapper, { backgroundColor: colors.primary }]}
            >
              <Ionicons name="book" size={28} color="#FFFFFF" />
            </View>
            <View style={styles.verseContent}>
              <Text style={[styles.verseLabel, { color: colors.primary }]}>
                Memory Verse of the Day
              </Text>
              <Text style={[styles.verseText, { color: colors.navy }]}>
                {`"${dailyVerse.text}"`}
              </Text>
              <Text style={[styles.verseRef, { color: colors.primary }]}>
                {dailyVerse.reference}
              </Text>
            </View>
            <Pressable
              style={[
                styles.bookmarkBtn,
                { backgroundColor: colors.secondary },
              ]}
              onPress={handleBookmark}
              hitSlop={8}
            >
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isBookmarked ? colors.primary : colors.mutedForeground}
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.card, styles.studyCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/manual")}
          >
            <View style={styles.studyIconWrapper}>
              <Ionicons name="document-text-outline" size={26} color={colors.primary} />
            </View>
            <View style={styles.studyContent}>
              <Text style={styles.studyTitle}>Continue Studying</Text>
              <Text style={styles.studySubtitle}>
                Pick up where you left off in your rank requirements.
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color="#FFFFFF" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  notifDot: {
    position: "absolute",
    top: -1,
    right: -1,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  greetingSection: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
    overflow: "hidden",
  },
  globeWatermark: {
    position: "absolute",
    right: -40,
    top: -20,
  },
  greetingSmall: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  greetingName: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    marginBottom: 10,
  },
  taglineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  cardsWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  rankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  rankInfo: {
    flex: 1,
    paddingLeft: 14,
  },
  rankLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  rankName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  rankButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  bookIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  verseContent: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 8,
  },
  verseLabel: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  verseText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    fontStyle: "italic",
    marginBottom: 6,
  },
  verseRef: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  bookmarkBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  studyCard: {
    borderWidth: 0,
  },
  studyIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  studyContent: {
    flex: 1,
    paddingLeft: 14,
    paddingRight: 8,
  },
  studyTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  studySubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
    lineHeight: 18,
  },
});
