import { Ionicons } from "@expo/vector-icons";
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
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { MANUAL_CHAPTERS, ManualChapter, ManualSection } from "@/data/manual";
import { useColors } from "@/hooks/useColors";

function SectionItem({
  section,
  isCompleted,
  onComplete,
}: {
  section: ManualSection;
  isCompleted: boolean;
  onComplete: () => void;
}) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  const toggle = () => {
    if (!expanded) {
      height.value = withTiming(1, { duration: 250 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      height.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 150 });
    }
    setExpanded((v) => !v);
  };

  const contentStyle = useAnimatedStyle(() => ({
    maxHeight: height.value === 0 ? 0 : 2000,
    opacity: opacity.value,
    overflow: "hidden",
  }));

  return (
    <View
      style={[
        styles.sectionItem,
        { borderBottomColor: colors.border },
      ]}
    >
      <Pressable style={styles.sectionHeader} onPress={toggle} hitSlop={4}>
        <View style={styles.sectionTitleRow}>
          <Pressable
            style={[
              styles.sectionCheckbox,
              {
                borderColor: isCompleted ? colors.primary : colors.border,
                backgroundColor: isCompleted ? colors.primary : "transparent",
              },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onComplete();
            }}
            hitSlop={6}
          >
            {isCompleted && (
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            )}
          </Pressable>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: isCompleted ? colors.mutedForeground : colors.navy,
                textDecorationLine: isCompleted ? "line-through" : "none",
              },
            ]}
          >
            {section.title}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.mutedForeground}
        />
      </Pressable>
      <Animated.View style={contentStyle}>
        <Text
          style={[styles.sectionContent, { color: colors.foreground }]}
        >
          {section.content}
        </Text>
        {!isCompleted && (
          <Pressable
            style={[
              styles.markDoneBtn,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onComplete();
            }}
          >
            <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
            <Text style={styles.markDoneText}>Mark as Complete</Text>
          </Pressable>
        )}
      </Animated.View>
    </View>
  );
}

function ChapterCard({ chapter }: { chapter: ManualChapter }) {
  const colors = useColors();
  const { completedSectionIds, completeSection } = useApp();
  const [expanded, setExpanded] = useState(false);

  const completedCount = chapter.sections.filter((s) =>
    completedSectionIds.includes(s.id)
  ).length;
  const total = chapter.sections.length;
  const progress = total > 0 ? completedCount / total : 0;
  const isDone = completedCount === total;

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpanded((v) => !v);
  };

  return (
    <View
      style={[
        styles.chapterCard,
        {
          backgroundColor: colors.card,
          borderColor: isDone ? colors.primary : colors.border,
        },
      ]}
    >
      <Pressable style={styles.chapterHeader} onPress={toggle}>
        <View
          style={[
            styles.chapterIconWrapper,
            {
              backgroundColor: isDone ? colors.primary : colors.secondary,
            },
          ]}
        >
          <Ionicons
            name={chapter.iconName as never}
            size={22}
            color={isDone ? "#FFFFFF" : colors.primary}
          />
        </View>
        <View style={styles.chapterInfo}>
          <Text style={[styles.chapterTitle, { color: colors.navy }]}>
            {chapter.title}
          </Text>
          <Text
            style={[styles.chapterDesc, { color: colors.mutedForeground }]}
          >
            {chapter.description}
          </Text>
          <View style={styles.progressRow}>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: colors.muted },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: isDone ? colors.primary : colors.primary,
                    width: `${progress * 100}%`,
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.progressText, { color: colors.mutedForeground }]}
            >
              {completedCount}/{total}
            </Text>
          </View>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.mutedForeground}
        />
      </Pressable>

      {expanded && (
        <View
          style={[styles.sectionsWrapper, { borderTopColor: colors.border }]}
        >
          {chapter.sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              isCompleted={completedSectionIds.includes(section.id)}
              onComplete={() => completeSection(section.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export default function ManualScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completedSectionIds } = useApp();

  const totalSections = MANUAL_CHAPTERS.reduce(
    (acc, ch) => acc + ch.sections.length,
    0
  );
  const completedTotal = MANUAL_CHAPTERS.reduce(
    (acc, ch) =>
      acc + ch.sections.filter((s) => completedSectionIds.includes(s.id)).length,
    0
  );

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 80;

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
          Study Manual
        </Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {completedTotal} of {totalSections} sections complete
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {MANUAL_CHAPTERS.map((chapter) => (
          <ChapterCard key={chapter.id} chapter={chapter} />
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
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  chapterCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  chapterIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    marginBottom: 3,
  },
  chapterDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
    lineHeight: 17,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
  },
  sectionsWrapper: {
    borderTopWidth: 1,
  },
  sectionItem: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  sectionCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    paddingBottom: 16,
  },
  markDoneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  markDoneText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
});
