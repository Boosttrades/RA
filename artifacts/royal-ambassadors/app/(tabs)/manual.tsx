import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
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

// ─── Highlighted text renderer ───────────────────────────────────────────────
// Wraps occurrences of `term` in a gold highlight span, returns <Text> children.

function HighlightedText({
  text,
  term,
  baseStyle,
  highlightBg,
}: {
  text: string;
  term: string;
  baseStyle: object;
  highlightBg: string;
}) {
  if (!term) return <Text style={baseStyle}>{text}</Text>;
  const lower = text.toLowerCase();
  const termLower = term.toLowerCase();
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let idx = lower.indexOf(termLower);
  while (idx !== -1) {
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(
      <Text
        key={`h${idx}`}
        style={[baseStyle, { backgroundColor: highlightBg, borderRadius: 3 }]}
      >
        {text.slice(idx, idx + term.length)}
      </Text>
    );
    cursor = idx + term.length;
    idx = lower.indexOf(termLower, cursor);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <Text style={baseStyle}>{parts}</Text>;
}

// ─── Text Action Sheet ────────────────────────────────────────────────────────

function TextActionSheet({
  visible,
  text,
  sectionId,
  sectionTitle,
  onClose,
  colors,
}: {
  visible: boolean;
  text: string;
  sectionId: string;
  sectionTitle: string;
  onClose: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  const { toggleHighlight, isHighlighted, savePassage } = useApp();
  const highlighted = isHighlighted(sectionId, text);

  const handleCopy = async () => {
    try {
      await Share.share({ message: text });
    } catch (_) {}
    onClose();
  };

  const handleHighlight = () => {
    toggleHighlight(sectionId, text);
    onClose();
  };

  const handleSave = () => {
    savePassage({ sectionId, sectionTitle, text });
    onClose();
    Alert.alert("Saved!", "Passage saved to your library.", [{ text: "OK" }]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={actionStyles.overlay}
        onPress={onClose}
      >
        <View
          style={[
            actionStyles.sheet,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {/* Preview of selected text */}
          <View style={[actionStyles.preview, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <Text
              style={[actionStyles.previewText, { color: colors.navy }]}
              numberOfLines={3}
            >
              {`"${text}"`}
            </Text>
          </View>

          <View style={actionStyles.actions}>
            {/* Copy / Share */}
            <Pressable
              style={[actionStyles.actionBtn, { backgroundColor: colors.secondary }]}
              onPress={handleCopy}
            >
              <Ionicons name="share-outline" size={22} color={colors.primary} />
              <Text style={[actionStyles.actionLabel, { color: colors.primary }]}>
                Copy
              </Text>
            </Pressable>

            {/* Highlight */}
            <Pressable
              style={[
                actionStyles.actionBtn,
                { backgroundColor: highlighted ? "#FFF3CD" : colors.secondary },
              ]}
              onPress={handleHighlight}
            >
              <Ionicons
                name={highlighted ? "checkmark-circle" : "color-wand-outline"}
                size={22}
                color={highlighted ? "#B8860B" : colors.primary}
              />
              <Text
                style={[
                  actionStyles.actionLabel,
                  { color: highlighted ? "#B8860B" : colors.primary },
                ]}
              >
                {highlighted ? "Remove" : "Highlight"}
              </Text>
            </Pressable>

            {/* Save */}
            <Pressable
              style={[actionStyles.actionBtn, { backgroundColor: colors.secondary }]}
              onPress={handleSave}
            >
              <Ionicons name="bookmark-outline" size={22} color={colors.primary} />
              <Text style={[actionStyles.actionLabel, { color: colors.primary }]}>
                Save
              </Text>
            </Pressable>
          </View>

          <Pressable
            style={[actionStyles.cancelBtn, { backgroundColor: colors.muted }]}
            onPress={onClose}
          >
            <Text style={[actionStyles.cancelText, { color: colors.mutedForeground }]}>
              Cancel
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const actionStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    padding: 20,
    gap: 14,
  },
  preview: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  previewText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 14,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});

// ─── Section Content ──────────────────────────────────────────────────────────

function SectionContent({
  content,
  colors,
  sectionId,
  sectionTitle,
  searchTerm,
}: {
  content: string;
  colors: ReturnType<typeof useColors>;
  sectionId: string;
  sectionTitle: string;
  searchTerm?: string;
}) {
  const { isHighlighted } = useApp();
  const [actionSheet, setActionSheet] = useState<{ text: string } | null>(null);
  const lines = content.split("\n");

  const handleLongPress = (text: string) => {
    if (text.trim().length < 4) return;
    setActionSheet({ text: text.trim() });
  };

  const renderLine = (line: string, idx: number) => {
    const trimmed = line.trim();
    if (trimmed === "") return <View key={idx} style={contentStyles.spacer} />;

    if (trimmed.startsWith("━")) {
      return (
        <View key={idx} style={[contentStyles.divider, { borderColor: colors.border }]} />
      );
    }

    const highlighted = isHighlighted(sectionId, trimmed);
    const highlightBg = "#FFF3CD";
    const term = searchTerm ?? "";

    const isRankTitle =
      /^\d+\.\s+(THE |ASSISTANT|INTERN|SENIOR|ENVOY|SPECIAL|DEAN|AMBASSADOR)/.test(trimmed);
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

    const wrapperStyle = highlighted ? { backgroundColor: highlightBg, borderRadius: 4 } : undefined;

    if (isRankTitle) {
      return (
        <Pressable key={idx} onLongPress={() => handleLongPress(trimmed)}>
          <Text
            style={[
              contentStyles.rankTitle,
              { color: colors.primary, backgroundColor: highlighted ? highlightBg : colors.secondary },
            ]}
          >
            {term ? (
              <HighlightedText
                text={trimmed}
                term={term}
                baseStyle={{ color: colors.primary }}
                highlightBg="#F59E0B"
              />
            ) : trimmed}
          </Text>
        </Pressable>
      );
    }

    if (isHeading) {
      return (
        <Pressable key={idx} onLongPress={() => handleLongPress(trimmed)} style={wrapperStyle}>
          {term ? (
            <HighlightedText
              text={trimmed}
              term={term}
              baseStyle={[contentStyles.heading, { color: colors.navy }] as any}
              highlightBg="#F59E0B"
            />
          ) : (
            <Text style={[contentStyles.heading, { color: colors.navy }]}>{trimmed}</Text>
          )}
        </Pressable>
      );
    }

    if (isBullet) {
      return (
        <Pressable
          key={idx}
          style={[contentStyles.bulletRow, wrapperStyle]}
          onLongPress={() => handleLongPress(trimmed.slice(1).trim())}
        >
          <Text style={[contentStyles.bulletDot, { color: colors.primary }]}>•</Text>
          {term ? (
            <HighlightedText
              text={trimmed.slice(1).trim()}
              term={term}
              baseStyle={[contentStyles.bulletText, { color: colors.foreground, flex: 1 }] as any}
              highlightBg="#F59E0B"
            />
          ) : (
            <Text style={[contentStyles.bulletText, { color: colors.foreground, flex: 1 }]}>
              {trimmed.slice(1).trim()}
            </Text>
          )}
        </Pressable>
      );
    }

    if (isSubItem) {
      return (
        <Pressable
          key={idx}
          style={[contentStyles.subItemRow, wrapperStyle]}
          onLongPress={() => handleLongPress(trimmed)}
        >
          {term ? (
            <HighlightedText
              text={trimmed}
              term={term}
              baseStyle={[contentStyles.subItemText, { color: colors.foreground }] as any}
              highlightBg="#F59E0B"
            />
          ) : (
            <Text style={[contentStyles.subItemText, { color: colors.foreground }]}>{trimmed}</Text>
          )}
        </Pressable>
      );
    }

    if (isIndented) {
      return (
        <Pressable
          key={idx}
          style={wrapperStyle}
          onLongPress={() => handleLongPress(trimmed)}
        >
          {term ? (
            <HighlightedText
              text={trimmed}
              term={term}
              baseStyle={[contentStyles.indented, { color: colors.foreground }] as any}
              highlightBg="#F59E0B"
            />
          ) : (
            <Text style={[contentStyles.indented, { color: colors.foreground }]}>{trimmed}</Text>
          )}
        </Pressable>
      );
    }

    return (
      <Pressable
        key={idx}
        style={wrapperStyle}
        onLongPress={() => handleLongPress(trimmed)}
      >
        {term ? (
          <HighlightedText
            text={trimmed}
            term={term}
            baseStyle={[contentStyles.body, { color: colors.foreground }] as any}
            highlightBg="#F59E0B"
          />
        ) : (
          <Text style={[contentStyles.body, { color: colors.foreground }]}>{trimmed}</Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={contentStyles.wrapper}>
      {lines.map(renderLine)}
      {actionSheet && (
        <TextActionSheet
          visible
          text={actionSheet.text}
          sectionId={sectionId}
          sectionTitle={sectionTitle}
          onClose={() => setActionSheet(null)}
          colors={colors}
        />
      )}
    </View>
  );
}

const contentStyles = StyleSheet.create({
  wrapper: { paddingTop: 4 },
  spacer: { height: 10 },
  divider: { borderTopWidth: 1, marginVertical: 14 },
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
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  subItemRow: { paddingLeft: 16, marginBottom: 4 },
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

// ─── TOC View ─────────────────────────────────────────────────────────────────

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
      style={[styles.tocItem, { backgroundColor: colors.card, borderColor: colors.border }]}
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
          color={isFront ? colors.goldText : colors.primary}
        />
      </View>
      <View style={styles.tocItemBody}>
        <Text style={[styles.tocTitle, { color: colors.navy }]}>{section.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
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
  // Bold the matched phrase inside the snippet
  const snippet = result.snippet;
  const phrase = result.matchedPhrase;
  const phraseLower = phrase.toLowerCase();
  const snippetLower = snippet.toLowerCase();
  const matchStart = snippetLower.indexOf(phraseLower);

  return (
    <Pressable
      style={[styles.tocItem, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <View
        style={[
          styles.tocBadge,
          { backgroundColor: result.phraseMatch ? colors.goldLight : colors.secondary },
        ]}
      >
        <Ionicons
          name="search"
          size={14}
          color={result.phraseMatch ? colors.goldText : colors.primary}
        />
      </View>
      <View style={styles.tocItemBody}>
        <Text style={[styles.tocTitle, { color: colors.navy }]}>
          {result.section.title}
        </Text>
        {matchStart !== -1 ? (
          <Text style={[styles.tocSnippet, { color: colors.mutedForeground }]} numberOfLines={2}>
            {snippet.slice(0, matchStart)}
            <Text style={{ fontFamily: "Inter_700Bold", color: colors.navy }}>
              {snippet.slice(matchStart, matchStart + phrase.length)}
            </Text>
            {snippet.slice(matchStart + phrase.length)}
          </Text>
        ) : (
          <Text style={[styles.tocSnippet, { color: colors.mutedForeground }]} numberOfLines={2}>
            {snippet}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
    </Pressable>
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
      <View style={[styles.sectionGroupLine, { backgroundColor: colors.border }]} />
      <Text style={[styles.sectionGroupText, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[styles.sectionGroupLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

function TocView({
  onOpenSection,
  topPadding,
  bottomPadding,
}: {
  onOpenSection: (section: ManualSection, searchQuery?: string) => void;
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
        onPress={() => onOpenSection(item.section, item.matchedPhrase)}
        colors={colors}
      />
    ),
    [colors, onOpenSection]
  );

  const renderTocItem = useCallback(
    ({ item }: { item: ManualSection }) => (
      <TocSectionItem section={item} onPress={() => onOpenSection(item)} colors={colors} />
    ),
    [colors, onOpenSection]
  );

  const TocHeader = useMemo(
    () => (
      <View>
        <View style={[styles.coverCard, { backgroundColor: colors.navy }]}>
          <Image source={COVER} style={styles.coverImage} contentFit="cover" transition={300} />
          <View style={styles.coverOverlay}>
            <Text style={styles.coverTitle}>Royal Ambassadors of Nigeria</Text>
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
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Study Manual</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          Royal Ambassadors of Nigeria
        </Text>
      </View>

      <View
        style={[
          styles.searchWrapper,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
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
            placeholder='Search topics, phrases, ranks…  Try "baptism" or "pledge"'
            placeholderTextColor={colors.mutedForeground}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={10}>
              <Ionicons name="close-circle" size={18} color={colors.mutedForeground} />
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
              <Text style={[styles.searchResultCount, { color: colors.mutedForeground }]}>
                {results.length} section{results.length !== 1 ? "s" : ""} found
                {results.some((r) => r.phraseMatch) ? " · exact phrases shown first" : ""}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyWrapper}>
              <Ionicons name="search-outline" size={44} color={colors.mutedForeground} />
              <Text style={[styles.emptyTitle, { color: colors.navy }]}>No results found</Text>
              <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
                Try words like "pledge", "emblem", "dean", "counselor" or "baptism"
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

// ─── Reader View ──────────────────────────────────────────────────────────────

function ReaderView({
  initialSection,
  onBack,
  topPadding,
  bottomPadding,
  initialSearchQuery,
}: {
  initialSection: ManualSection;
  onBack: () => void;
  topPadding: number;
  bottomPadding: number;
  initialSearchQuery?: string;
}) {
  const colors = useColors();
  const scrollRef = useRef<ScrollView>(null);
  const [showToc, setShowToc] = useState(false);
  const [activeSection, setActiveSection] = useState(initialSection);
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery ?? "");

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
    setSearchTerm("");
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
                fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
              },
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
          {isActive && <Ionicons name="checkmark" size={16} color={colors.primary} />}
        </Pressable>
      );
    },
    [activeSection.id, colors, navigate]
  );

  // Count search matches in current section
  const matchCount = useMemo(() => {
    if (!searchTerm) return 0;
    const lower = activeSection.content.toLowerCase();
    const term = searchTerm.toLowerCase();
    let count = 0;
    let pos = 0;
    while ((pos = lower.indexOf(term, pos)) !== -1) { count++; pos += term.length; }
    return count;
  }, [activeSection.content, searchTerm]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.readerHeader,
          { paddingTop: topPadding + 10, backgroundColor: colors.primary },
        ]}
      >
        <Pressable style={styles.readerBackBtn} onPress={onBack} hitSlop={10}>
          <Ionicons name="arrow-back" size={20} color={colors.primaryForeground} />
          <Text style={[styles.readerBackText, { color: colors.primaryForeground }]}>
            Contents
          </Text>
        </Pressable>
        <Pressable style={styles.readerTocBtn} onPress={() => setShowToc(true)} hitSlop={10}>
          <Ionicons name="list-outline" size={20} color={colors.primaryForeground} />
          <Text style={[styles.readerTocBtnText, { color: colors.primaryForeground }]}>
            Sections
          </Text>
        </Pressable>
      </View>

      {/* Search match banner */}
      {searchTerm !== "" && (
        <View
          style={[
            styles.searchBanner,
            { backgroundColor: "#FFF8E1", borderBottomColor: "#D4A217" },
          ]}
        >
          <Ionicons name="search" size={14} color="#B8860B" />
          <Text style={styles.searchBannerText}>
            {matchCount > 0
              ? `${matchCount} match${matchCount !== 1 ? "es" : ""} for "${searchTerm}" highlighted`
              : `No matches for "${searchTerm}" in this section`}
          </Text>
          <Pressable onPress={() => setSearchTerm("")} hitSlop={8}>
            <Ionicons name="close" size={16} color="#B8860B" />
          </Pressable>
        </View>
      )}

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
          <Text style={[styles.sectionHint, { color: colors.mutedForeground }]}>
            Long-press any paragraph to highlight, copy, or save
          </Text>
        </View>

        <View style={{ paddingHorizontal: 18, paddingTop: 8 }}>
          <SectionContent
            content={activeSection.content}
            colors={colors}
            sectionId={activeSection.id}
            sectionTitle={activeSection.title}
            searchTerm={searchTerm}
          />
        </View>

        <View style={[styles.navRow, { borderTopColor: colors.border }]}>
          {activePrev ? (
            <Pressable
              style={[styles.navBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigate(activePrev)}
            >
              <Ionicons name="arrow-back" size={16} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.navLabel, { color: colors.mutedForeground }]}>Previous</Text>
                <Text style={[styles.navSectionTitle, { color: colors.primary }]} numberOfLines={1}>
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
                <Text style={[styles.navLabel, { color: colors.mutedForeground }]}>Next</Text>
                <Text style={[styles.navSectionTitle, { color: colors.primary }]} numberOfLines={1}>
                  {activeNext.title}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </Pressable>
          ) : (
            <View style={{ flex: 1 }} />
          )}
        </View>
      </ScrollView>

      {showToc && (
        <View style={[StyleSheet.absoluteFillObject, styles.tocOverlay]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={() => setShowToc(false)} />
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
              style={[styles.tocOverlayHeader, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.tocOverlayTitle, { color: colors.navy }]}>Jump to Section</Text>
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

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function ManualScreen() {
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<ManualSection | null>(null);
  const [openSearchQuery, setOpenSearchQuery] = useState<string | undefined>(undefined);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 80;

  const handleOpenSection = (section: ManualSection, query?: string) => {
    setActiveSection(section);
    setOpenSearchQuery(query);
  };

  if (activeSection) {
    return (
      <ReaderView
        initialSection={activeSection}
        onBack={() => { setActiveSection(null); setOpenSearchQuery(undefined); }}
        topPadding={topPadding}
        bottomPadding={bottomPadding}
        initialSearchQuery={openSearchQuery}
      />
    );
  }

  return (
    <TocView
      onOpenSection={handleOpenSection}
      topPadding={topPadding}
      bottomPadding={bottomPadding}
    />
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontFamily: "Inter_700Bold", marginBottom: 2 },
  headerSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
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
  coverImage: { width: "100%", height: "100%" },
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
  sectionGroupLine: { flex: 1, height: 1 },
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
  tocItemBody: { flex: 1 },
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
  emptyTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
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
  readerBackBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  readerBackText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  readerTocBtn: { flexDirection: "row", alignItems: "center", gap: 5 },
  readerTocBtnText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  searchBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchBannerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#B8860B",
  },
  sectionTitleBar: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
    gap: 4,
  },
  sectionTitleText: { fontSize: 20, fontFamily: "Inter_700Bold", lineHeight: 28 },
  sectionHint: { fontSize: 11, fontFamily: "Inter_400Regular" },
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
  navBtnRight: { justifyContent: "flex-end" },
  navLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginBottom: 2 },
  navSectionTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  tocOverlay: { zIndex: 100, backgroundColor: "rgba(0,0,0,0.55)" },
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
  tocOverlayTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  tocOverlayItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderBottomWidth: 1,
    gap: 12,
  },
  tocOverlayItemTitle: { fontSize: 14, lineHeight: 20, flex: 1 },
});
