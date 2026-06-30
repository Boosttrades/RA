import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import {
  FRONT_MATTER,
  MANUAL_SECTIONS,
  ManualSection,
  SearchResult,
  TOC_SECTIONS,
  searchManual,
} from "@/data/manualContent";

const COVER = require("@/assets/cover.jpg");

function SectionContent({
  content,
  colors,
}: {
  content: string;
  colors: ReturnType<typeof useColors>;
}) {
  const lines = content.split("\n");

  return (
    <View style={contentStyles.wrapper}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        if (trimmed === "") {
          return <View key={idx} style={contentStyles.spacer} />;
        }

        if (trimmed.startsWith("━")) {
          return (
            <View
              key={idx}
              style={[contentStyles.divider, { borderColor: colors.border }]}
            />
          );
        }

        const isRankTitle =
          /^\d+\.\s+(THE |ASSISTANT|INTERN|SENIOR|ENVOY|SPECIAL|DEAN|AMBASSADOR)/.test(
            trimmed
          );

        const isHeading =
          !isRankTitle &&
          trimmed.length >= 3 &&
          trimmed === trimmed.toUpperCase() &&
          !/^[A-Z]\.\s/.test(trimmed) &&
          !/^[ivxIVX]+\)/.test(trimmed) &&
          !trimmed.startsWith("•") &&
          !/^\d+\./.test(trimmed);

        const isBullet = trimmed.startsWith("•");

        const isSubItem =
          !isBullet &&
          !isHeading &&
          !isRankTitle &&
          (/^[A-Z]\.\s/.test(trimmed) ||
            /^[ivxIVX]+\)\s/.test(trimmed) ||
            /^\d+\.\s/.test(trimmed) ||
            /^[a-z]\.\s/.test(trimmed));

        const isIndented = !isSubItem && line.startsWith("   ");

        if (isRankTitle) {
          return (
            <Text
              key={idx}
              style={[
                contentStyles.rankTitle,
                { color: colors.primary, backgroundColor: colors.secondary },
              ]}
            >
              {trimmed}
            </Text>
          );
        }

        if (isHeading) {
          return (
            <Text
              key={idx}
              style={[contentStyles.heading, { color: colors.navy }]}
            >
              {trimmed}
            </Text>
          );
        }

        if (isBullet) {
          return (
            <View key={idx} style={contentStyles.bulletRow}>
              <Text
                style={[contentStyles.bulletDot, { color: colors.primary }]}
              >
                •
              </Text>
              <Text
                style={[
                  contentStyles.bulletText,
                  { color: colors.foreground },
                ]}
              >
                {trimmed.slice(1).trim()}
              </Text>
            </View>
          );
        }

        if (isSubItem) {
          return (
            <View key={idx} style={contentStyles.subItemRow}>
              <Text
                style={[
                  contentStyles.subItemText,
                  { color: colors.foreground },
                ]}
              >
                {trimmed}
              </Text>
            </View>
          );
        }

        if (isIndented) {
          return (
            <Text
              key={idx}
              style={[contentStyles.indented, { color: colors.foreground }]}
            >
              {trimmed}
            </Text>
          );
        }

        return (
          <Text
            key={idx}
            style={[contentStyles.body, { color: colors.foreground }]}
          >
            {trimmed}
          </Text>
        );
      })}
    </View>
  );
}

function TocSectionItem({
  section,
  onPress,
  colors,
}: {
  section: ManualSection;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  const isFront = section.group === "front";
  return (
    <Pressable
      style={[
        styles.tocItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.tocBadge,
          { backgroundColor: isFront ? colors.goldLight : colors.secondary },
        ]}
      >
        <Ionicons
          name={isFront ? "document-text-outline" : "bookmark-outline"}
          size={15}
          color={isFront ? colors.gold : colors.primary}
        />
      </View>
      <View style={styles.tocItemBody}>
        <Text style={[styles.tocTitle, { color: colors.navy }]}>
          {section.title}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.mutedForeground}
      />
    </Pressable>
  );
}

function SearchResultItem({
  result,
  onPress,
  colors,
}: {
  result: SearchResult;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      style={[
        styles.tocItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
      onPress={onPress}
    >
      <View style={[styles.tocBadge, { backgroundColor: colors.secondary }]}>
        <Ionicons name="search" size={14} color={colors.primary} />
      </View>
      <View style={styles.tocItemBody}>
        <Text style={[styles.tocTitle, { color: colors.navy }]}>
          {result.section.title}
        </Text>
        <Text
          style={[styles.tocSnippet, { color: colors.mutedForeground }]}
          numberOfLines={2}
        >
          {result.snippet}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

function TocView({
  onOpenSection,
  topPadding,
  bottomPadding,
}: {
  onOpenSection: (section: ManualSection) => void;
  topPadding: number;
  bottomPadding: number;
}) {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const results: SearchResult[] = useMemo(
    () => searchManual(searchQuery),
    [searchQuery]
  );
  const hasQuery = searchQuery.trim().length > 0;

  const renderSearchItem = useCallback(
    ({ item }: { item: SearchResult }) => (
      <SearchResultItem
        result={item}
        onPress={() => onOpenSection(item.section)}
        colors={colors}
      />
    ),
    [colors, onOpenSection]
  );

  const renderTocItem = useCallback(
    ({ item }: { item: ManualSection }) => (
      <TocSectionItem
        section={item}
        onPress={() => onOpenSection(item)}
        colors={colors}
      />
    ),
    [colors, onOpenSection]
  );

  const TocHeader = useMemo(
    () => (
      <View>
        <View style={[styles.coverCard, { backgroundColor: colors.navy }]}>
          <Image
            source={COVER}
            style={styles.coverImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.coverOverlay}>
            <Text style={styles.coverTitle}>
              Royal Ambassadors of Nigeria
            </Text>
            <Text style={styles.coverSubtitle}>
              "We are ambassadors for Christ" — 2 Corinthians 5:20
            </Text>
          </View>
        </View>

        <SectionGroupDivider label="FRONT MATTER" colors={colors} />

        {FRONT_MATTER.map((section) => (
          <TocSectionItem
            key={section.id}
            section={section}
            onPress={() => onOpenSection(section)}
            colors={colors}
          />
        ))}

        <View style={{ height: 10 }} />
        <SectionGroupDivider label="TABLE OF CONTENTS" colors={colors} />
      </View>
    ),
    [colors, onOpenSection]
  );

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
          Royal Ambassadors of Nigeria
        </Text>
      </View>

      <View
        style={[
          styles.searchWrapper,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.muted, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.navy }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search topics, verses, ranks..."
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={10}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.mutedForeground}
              />
            </Pressable>
          )}
        </View>
      </View>

      {hasQuery ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.section.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 12,
            paddingHorizontal: 16,
            paddingBottom: bottomPadding,
            gap: 10,
          }}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text
                style={[
                  styles.searchResultCount,
                  { color: colors.mutedForeground },
                ]}
              >
                {results.length} section{results.length !== 1 ? "s" : ""} found
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Ionicons
                name="search-outline"
                size={44}
                color={colors.mutedForeground}
              />
              <Text style={[styles.emptyTitle, { color: colors.navy }]}>
                No results found
              </Text>
              <Text
                style={[styles.emptyDesc, { color: colors.mutedForeground }]}
              >
                Try words like "pledge", "emblem", "dean", "counselor" or
                "baptism"
              </Text>
            </View>
          }
          renderItem={renderSearchItem}
        />
      ) : (
        <FlatList
          data={TOC_SECTIONS}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 12,
            paddingHorizontal: 16,
            paddingBottom: bottomPadding,
            gap: 10,
          }}
          ListHeaderComponent={TocHeader}
          renderItem={renderTocItem}
        />
      )}
    </View>
  );
}

function SectionGroupDivider({
  label,
  colors,
}: {
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.sectionGroupLabel}>
      <View
        style={[styles.sectionGroupLine, { backgroundColor: colors.border }]}
      />
      <Text
        style={[styles.sectionGroupText, { color: colors.mutedForeground }]}
      >
        {label}
      </Text>
      <View
        style={[styles.sectionGroupLine, { backgroundColor: colors.border }]}
      />
    </View>
  );
}

function ReaderView({
  initialSection,
  onBack,
  topPadding,
  bottomPadding,
}: {
  initialSection: ManualSection;
  onBack: () => void;
  topPadding: number;
  bottomPadding: number;
}) {
  const colors = useColors();
  const scrollRef = useRef<ScrollView>(null);
  const [showToc, setShowToc] = useState(false);
  const [activeSection, setActiveSection] = useState(initialSection);

  const activePrev = useMemo(() => {
    const idx = MANUAL_SECTIONS.findIndex((s) => s.id === activeSection.id);
    return idx > 0 ? MANUAL_SECTIONS[idx - 1] : null;
  }, [activeSection.id]);

  const activeNext = useMemo(() => {
    const idx = MANUAL_SECTIONS.findIndex((s) => s.id === activeSection.id);
    return idx < MANUAL_SECTIONS.length - 1 ? MANUAL_SECTIONS[idx + 1] : null;
  }, [activeSection.id]);

  const navigate = useCallback((target: ManualSection) => {
    setActiveSection(target);
    setShowToc(false);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  const renderTocOverlayItem = useCallback(
    ({ item }: { item: ManualSection }) => {
      const isActive = item.id === activeSection.id;
      return (
        <Pressable
          style={[
            styles.tocOverlayItem,
            {
              backgroundColor: isActive ? colors.secondary : "transparent",
              borderBottomColor: colors.border,
            },
          ]}
          onPress={() => navigate(item)}
        >
          <Text
            style={[
              styles.tocOverlayItemTitle,
              {
                color: isActive ? colors.primary : colors.navy,
                fontFamily: isActive
                  ? "Inter_600SemiBold"
                  : "Inter_400Regular",
              },
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {isActive && (
            <Ionicons name="checkmark" size={16} color={colors.primary} />
          )}
        </Pressable>
      );
    },
    [activeSection.id, colors, navigate]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.readerHeader,
          {
            paddingTop: topPadding + 10,
            backgroundColor: colors.navy,
          },
        ]}
      >
        <Pressable style={styles.readerBackBtn} onPress={onBack} hitSlop={10}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.readerBackText}>Contents</Text>
        </Pressable>

        <Pressable
          style={styles.readerTocBtn}
          onPress={() => setShowToc(true)}
          hitSlop={10}
        >
          <Ionicons name="list-outline" size={20} color="#FFFFFF" />
          <Text style={styles.readerTocBtnText}>Sections</Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomPadding + 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.sectionTitleBar,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitleText, { color: colors.navy }]}>
            {activeSection.title}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 18, paddingTop: 8 }}>
          <SectionContent content={activeSection.content} colors={colors} />
        </View>

        <View style={[styles.navRow, { borderTopColor: colors.border }]}>
          {activePrev ? (
            <Pressable
              style={[
                styles.navBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => navigate(activePrev)}
            >
              <Ionicons name="arrow-back" size={16} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.navLabel, { color: colors.mutedForeground }]}
                >
                  Previous
                </Text>
                <Text
                  style={[
                    styles.navSectionTitle,
                    { color: colors.primary },
                  ]}
                  numberOfLines={1}
                >
                  {activePrev.title}
                </Text>
              </View>
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}

          {activeNext ? (
            <Pressable
              style={[
                styles.navBtn,
                styles.navBtnRight,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => navigate(activeNext)}
            >
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Text
                  style={[styles.navLabel, { color: colors.mutedForeground }]}
                >
                  Next
                </Text>
                <Text
                  style={[
                    styles.navSectionTitle,
                    { color: colors.primary },
                  ]}
                  numberOfLines={1}
                >
                  {activeNext.title}
                </Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.primary}
              />
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      </ScrollView>

      {showToc && (
        <View style={[StyleSheet.absoluteFillObject, styles.tocOverlay]}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setShowToc(false)}
          />
          <View
            style={[
              styles.tocOverlayCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                top: topPadding + 56,
              },
            ]}
          >
            <View
              style={[
                styles.tocOverlayHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.tocOverlayTitle, { color: colors.navy }]}>
                Jump to Section
              </Text>
              <Pressable onPress={() => setShowToc(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color={colors.navy} />
              </Pressable>
            </View>
            <FlatList
              data={MANUAL_SECTIONS}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 6 }}
              renderItem={renderTocOverlayItem}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default function ManualScreen() {
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<ManualSection | null>(
    null
  );

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 80;

  if (activeSection) {
    return (
      <ReaderView
        initialSection={activeSection}
        onBack={() => setActiveSection(null)}
        topPadding={topPadding}
        bottomPadding={bottomPadding}
      />
    );
  }

  return (
    <TocView
      onOpenSection={setActiveSection}
      topPadding={topPadding}
      bottomPadding={bottomPadding}
    />
  );
}

const contentStyles = StyleSheet.create({
  wrapper: {
    paddingTop: 4,
  },
  spacer: {
    height: 10,
  },
  divider: {
    borderTopWidth: 1,
    marginVertical: 14,
  },
  heading: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.4,
    marginTop: 20,
    marginBottom: 6,
    lineHeight: 22,
  },
  rankTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    marginTop: 18,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  body: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
    marginBottom: 2,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 4,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  subItemRow: {
    paddingLeft: 16,
    marginBottom: 4,
  },
  subItemText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  indented: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    paddingLeft: 24,
    marginBottom: 2,
  },
});

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
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  coverCard: {
    borderRadius: 16,
    overflow: "hidden",
    height: 200,
    marginBottom: 16,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(11,27,94,0.75)",
  },
  coverTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  coverSubtitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    fontStyle: "italic",
  },
  sectionGroupLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  sectionGroupLine: {
    flex: 1,
    height: 1,
  },
  sectionGroupText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.8,
  },
  tocItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    shadowColor: "#1A3BAE",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  tocBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tocItemBody: {
    flex: 1,
  },
  tocTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  tocSnippet: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 3,
    lineHeight: 17,
  },
  searchResultCount: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  emptyWrapper: {
    alignItems: "center",
    paddingTop: 48,
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  emptyDesc: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 21,
  },
  readerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  readerBackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readerBackText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#FFFFFF",
  },
  readerTocBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  readerTocBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: "#FFFFFF",
  },
  sectionTitleBar: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    lineHeight: 28,
  },
  navRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 20,
    marginTop: 12,
    borderTopWidth: 1,
  },
  navBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  navBtnRight: {
    justifyContent: "flex-end",
  },
  navLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginBottom: 2,
  },
  navSectionTitle: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 18,
  },
  tocOverlay: {
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  tocOverlayCard: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: "72%",
    overflow: "hidden",
    zIndex: 101,
  },
  tocOverlayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  tocOverlayTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  tocOverlayItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
    gap: 12,
  },
  tocOverlayItemTitle: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
