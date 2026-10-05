import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { SettingsDrawer } from "@/components/SettingsDrawer";
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentRank = useMemo(
    () => RANKS.find((r) => r.id === currentRankId) ?? RANKS[0],
    [currentRankId]
  );
  const dailyVerse = useMemo(() => getDailyVerse(), []);
  const isBookmarked = bookmarkedVerseIds.includes(dailyVerse.id);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 90;

  const handleBookmark = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleBookmark(dailyVerse.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header — gold in light, navy in dark */}
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
        <Pressable style={styles.headerBtn} hitSlop={10} onPress={() => setDrawerOpen(true)}>
          <Feather name="menu" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>
          RA Guide
        </Text>
        <Pressable style={styles.headerBtn} hitSlop={10}>
          <View>
            <Feather name="bell" size={22} color={colors.primary} />
            <View style={[styles.notifDot, { backgroundColor: colors.primary }]} />
          </View>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        {/* Greeting section */}
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
            Amb. {userName}!
          </Text>
          <View style={styles.taglineRow}>
            <MaterialCommunityIcons name="crown" size={15} color={colors.goldText} />
            <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
              {"  "}Keep growing. Keep serving.
            </Text>
          </View>
        </View>

        <View style={styles.cardsWrapper}>
          {/* ── Rank card — gold bg (light) / navy bg (dark), primary text ── */}
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
              <Text style={[styles.rankName, { color: colors.cardForeground }]}>
                {currentRank.name}
              </Text>
            </View>
            {/* Action button — always inverted from card (navy on gold / gold on navy) */}
            <Pressable
              style={[styles.cardAction, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/ranks")}
              hitSlop={6}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={colors.primaryForeground}
              />
            </Pressable>
          </View>

          {/* ── Verse card — same alternating card colour ── */}
          <View
            style={[
              styles.card,
              styles.verseCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.bookIconWrapper, { backgroundColor: colors.primary }]}>
              <Ionicons name="book" size={24} color={colors.primaryForeground} />
            </View>
            <View style={styles.verseContent}>
              <Text style={[styles.verseLabel, { color: colors.primary }]}>
                Memory Verse of the Day
              </Text>
              <Text style={[styles.verseText, { color: colors.cardForeground }]}>
                {`"${dailyVerse.text}"`}
              </Text>
              <Text style={[styles.verseRef, { color: colors.cardForeground }]}>
                {dailyVerse.reference}
              </Text>
            </View>
            <Pressable
              style={[styles.cardAction, { backgroundColor: colors.primary }]}
              onPress={handleBookmark}
              hitSlop={8}
            >
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={18}
                color={
                  isBookmarked
                    ? colors.primaryAccentForeground
                    : colors.primaryForeground
                }
              />
            </Pressable>
          </View>

          {/* ── Study card — always the OPPOSITE colour to the cards above ──
              Light: cards=gold → study=navy  |  Dark: cards=navy → study=gold  */}
          <Pressable
            style={[
              styles.card,
              styles.studyCard,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => router.push("/manual")}
          >
            <View
              style={[
                styles.studyIconWrapper,
                { backgroundColor: "rgba(255,255,255,0.15)" },
              ]}
            >
              <Ionicons name="document-text-outline" size={24} color={colors.primaryForeground} />
            </View>
            <View style={styles.studyContent}>
              <Text style={[styles.studyTitle, { color: colors.primaryForeground }]}>
                Continue Studying
              </Text>
              <Text style={[styles.studySubtitle, { color: colors.primaryMutedForeground }]}>
                Pick up where you left off in your rank requirements.
              </Text>
            </View>
            <Feather name="chevron-right" size={22} color={colors.primaryMutedForeground} />
          </Pressable>
        </View>
      </ScrollView>

      <SettingsDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
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
  globeWatermark: { position: "absolute", right: -40, top: -20 },
  greetingSmall: { fontSize: 16, fontFamily: "Inter_400Regular", marginBottom: 2 },
  greetingName: { fontSize: 34, fontFamily: "Inter_700Bold", marginBottom: 10 },
  taglineRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  tagline: { fontSize: 14, fontFamily: "Inter_400Regular" },
  cardsWrapper: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },

  card: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  verseCard: { alignItems: "flex-start" },
  studyCard: { borderWidth: 0 },

  rankBadge: { width: 54, height: 54, borderRadius: 27 },
  rankInfo: { flex: 1, paddingLeft: 14 },
  rankLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  rankName: { fontSize: 22, fontFamily: "Inter_700Bold" },

  cardAction: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  bookIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  verseContent: { flex: 1, paddingLeft: 14, paddingRight: 8 },
  verseLabel: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  verseText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    fontStyle: "italic",
    marginBottom: 6,
  },
  verseRef: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  studyIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  studyContent: { flex: 1, paddingLeft: 14, paddingRight: 8 },
  studyTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 4 },
  studySubtitle: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
});
