import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function ToolsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { studyNotes } = useApp();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 92;

  const tools = [
    {
      title: "Bible",
      description: "Read and search Scripture in three editions.",
      icon: "book-open" as const,
      comingSoon: false,
    },
    {
      title: "Reading Plan",
      description: "Build a steady rhythm of reading.",
      icon: "calendar" as const,
      comingSoon: true,
    },
    {
      title: "Notes",
      description:
        studyNotes.length > 0
          ? `${studyNotes.length} saved ${studyNotes.length === 1 ? "note" : "notes"}`
          : "Save reflections, questions, and study takeaways.",
      icon: "edit-3" as const,
      comingSoon: false,
    },
  ];

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
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Tools</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.intro}>
          <Text style={[styles.eyebrow, { color: colors.primary }]}>
            YOUR STUDY SPACE
          </Text>
          <Text style={[styles.title, { color: colors.navy }]}>
            Grow in the Word
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Resources for reading, learning, and keeping what matters close.
          </Text>
        </View>

        <View style={styles.toolList}>
          {tools.map((tool) => (
            <Pressable
              key={tool.title}
              style={({ pressed }) => [
                styles.toolCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed && !tool.comingSoon ? 0.82 : 1,
                },
              ]}
              disabled={tool.comingSoon}
              onPress={() =>
                router.push(tool.title === "Bible" ? "/bible" : "/notes")
              }
              accessibilityRole="button"
              accessibilityState={{ disabled: tool.comingSoon }}
              accessibilityLabel={
                tool.comingSoon
                  ? `${tool.title}, coming soon`
                  : `Open ${tool.title}`
              }
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: `${colors.primary}18` },
                ]}
              >
                <Feather name={tool.icon} size={22} color={colors.primary} />
              </View>

              <View style={styles.toolText}>
                <Text style={[styles.toolTitle, { color: colors.navy }]}>
                  {tool.title}
                </Text>
                <Text style={[styles.toolDescription, { color: colors.mutedForeground }]}>
                  {tool.description}
                </Text>
              </View>

              {tool.comingSoon ? (
                <View
                  style={[
                    styles.comingSoonBadge,
                    { backgroundColor: colors.secondary },
                  ]}
                >
                  <Text style={[styles.badgeText, { color: colors.primary }]}>
                    Coming soon
                  </Text>
                </View>
              ) : (
                <Feather
                  name="chevron-right"
                  size={20}
                  color={colors.mutedForeground}
                />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  intro: { marginBottom: 24 },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  title: {
    fontSize: 25,
    lineHeight: 32,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Inter_400Regular",
    maxWidth: 340,
  },
  toolList: { gap: 12 },
  toolCard: {
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    borderRadius: 18,
    gap: 13,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  toolText: { flex: 1 },
  toolTitle: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 4 },
  toolDescription: { fontSize: 12, lineHeight: 17, fontFamily: "Inter_400Regular" },
  comingSoonBadge: {
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
});
