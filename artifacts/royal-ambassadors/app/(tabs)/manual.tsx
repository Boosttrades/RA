import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import {
  MANUAL_PAGE_IMAGES,
  TABLE_OF_CONTENTS,
  TocEntry,
  searchToc,
} from "@/data/manualPages";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PAGE_HEIGHT = Math.round(SCREEN_WIDTH * 1.38);

function TocView({
  onOpenReader,
  topPadding,
  bottomPadding,
}: {
  onOpenReader: (pageIndex: number) => void;
  topPadding: number;
  bottomPadding: number;
}) {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const results = searchToc(searchQuery);
  const hasQuery = searchQuery.trim().length > 0;

  const getMatchedKeywords = (entry: TocEntry) => {
    if (!hasQuery) return null;
    const lower = searchQuery.toLowerCase();
    const matched = entry.keywords.filter((k) => k.toLowerCase().includes(lower));
    const titleMatch = entry.title.toLowerCase().includes(lower);
    if (titleMatch && matched.length === 0) return null;
    return matched.slice(0, 4).join(" · ");
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
            {
              backgroundColor: colors.muted,
              borderColor: colors.border,
            },
          ]}
        >
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.navy }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search sections, topics, keywords..."
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

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingHorizontal: 16,
          paddingBottom: bottomPadding,
          gap: 10,
        }}
        ListHeaderComponent={
          !hasQuery ? (
            <Pressable
              style={[styles.readFromStartBtn, { backgroundColor: colors.primary }]}
              onPress={() => onOpenReader(0)}
            >
              <Ionicons name="book-outline" size={20} color="#FFFFFF" />
              <Text style={styles.readFromStartText}>Read from Beginning</Text>
              <Feather name="chevron-right" size={18} color="rgba(255,255,255,0.8)" />
            </Pressable>
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
            <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
              Try different keywords like "pledge", "ranks", "emblem", or "meetings"
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const matchedKw = getMatchedKeywords(item);
          return (
            <Pressable
              style={[
                styles.tocItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => onOpenReader(item.pageIndex)}
            >
              <View
                style={[
                  styles.tocPageBadge,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text style={[styles.tocPageText, { color: colors.primary }]}>
                  pg.{item.bookPage}
                </Text>
              </View>
              <View style={styles.tocItemBody}>
                <Text style={[styles.tocTitle, { color: colors.navy }]}>
                  {item.title}
                </Text>
                {matchedKw && (
                  <Text
                    style={[styles.tocMatch, { color: colors.mutedForeground }]}
                    numberOfLines={1}
                  >
                    {matchedKw}
                  </Text>
                )}
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.mutedForeground}
              />
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function ReaderView({
  startIndex,
  onBack,
  topPadding,
  bottomPadding,
}: {
  startIndex: number;
  onBack: () => void;
  topPadding: number;
  bottomPadding: number;
}) {
  const colors = useColors();
  const [currentPage, setCurrentPage] = useState(startIndex);
  const flatListRef = useRef<FlatList>(null);
  const [showTocOverlay, setShowTocOverlay] = useState(false);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: PAGE_HEIGHT,
      offset: PAGE_HEIGHT * index,
      index,
    }),
    []
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = e.nativeEvent.contentOffset.y;
      const page = Math.round(y / PAGE_HEIGHT);
      setCurrentPage(
        Math.max(0, Math.min(page, MANUAL_PAGE_IMAGES.length - 1))
      );
    },
    []
  );

  const jumpToPage = useCallback((pageIndex: number) => {
    setShowTocOverlay(false);
    setCurrentPage(pageIndex);
    flatListRef.current?.scrollToIndex({ index: pageIndex, animated: false });
  }, []);

  const renderPage = useCallback(
    ({ item, index }: { item: (typeof MANUAL_PAGE_IMAGES)[number]; index: number }) => (
      <View style={styles.pageWrapper}>
        <Image
          source={item}
          style={styles.pageImage}
          contentFit="contain"
          priority="normal"
          recyclingKey={String(index)}
        />
      </View>
    ),
    []
  );

  return (
    <View style={[styles.container, { backgroundColor: "#111111" }]}>
      <View
        style={[
          styles.readerHeader,
          { paddingTop: topPadding + 10, backgroundColor: colors.navy },
        ]}
      >
        <Pressable
          style={styles.readerBackBtn}
          onPress={onBack}
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.readerBackText}>Contents</Text>
        </Pressable>

        <Text style={styles.readerPageCounter}>
          {currentPage + 1} / {MANUAL_PAGE_IMAGES.length}
        </Text>

        <Pressable
          style={styles.readerTocBtn}
          onPress={() => setShowTocOverlay(true)}
          hitSlop={10}
        >
          <Ionicons name="list-outline" size={20} color="#FFFFFF" />
          <Text style={styles.readerTocBtnText}>Sections</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={MANUAL_PAGE_IMAGES}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderPage}
        getItemLayout={getItemLayout}
        initialScrollIndex={startIndex}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      />

      {showTocOverlay && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.tocOverlay,
            { paddingTop: topPadding + 56 },
          ]}
        >
          <View
            style={[
              styles.tocOverlayCard,
              { backgroundColor: colors.card, borderColor: colors.border },
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
              <Pressable onPress={() => setShowTocOverlay(false)} hitSlop={10}>
                <Ionicons name="close" size={22} color={colors.navy} />
              </Pressable>
            </View>
            <FlatList
              data={TABLE_OF_CONTENTS}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 6 }}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.tocOverlayItem,
                    {
                      backgroundColor:
                        currentPage >= item.pageIndex &&
                        (() => {
                          const next = TABLE_OF_CONTENTS.find(
                            (e) => e.pageIndex > item.pageIndex
                          );
                          return !next || currentPage < next.pageIndex;
                        })()
                          ? colors.secondary
                          : "transparent",
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() => jumpToPage(item.pageIndex)}
                >
                  <Text
                    style={[
                      styles.tocOverlayItemTitle,
                      { color: colors.navy },
                    ]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.tocOverlayPageNum,
                      { color: colors.primary },
                    ]}
                  >
                    pg.{item.bookPage}
                  </Text>
                </Pressable>
              )}
            />
          </View>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowTocOverlay(false)}
          />
        </View>
      )}
    </View>
  );
}

export default function ManualScreen() {
  const insets = useSafeAreaInsets();
  const [readerPage, setReaderPage] = useState<number | null>(null);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 80;

  if (readerPage !== null) {
    return (
      <ReaderView
        startIndex={readerPage}
        onBack={() => setReaderPage(null)}
        topPadding={topPadding}
        bottomPadding={bottomPadding}
      />
    );
  }

  return (
    <TocView
      onOpenReader={(page) => setReaderPage(page)}
      topPadding={topPadding}
      bottomPadding={bottomPadding}
    />
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
  readFromStartBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 4,
    justifyContent: "space-between",
  },
  readFromStartText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
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
  tocPageBadge: {
    minWidth: 44,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tocPageText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.3,
  },
  tocItemBody: {
    flex: 1,
  },
  tocTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  tocMatch: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 3,
    lineHeight: 16,
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
  readerPageCounter: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.6)",
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
  pageWrapper: {
    width: SCREEN_WIDTH,
    height: PAGE_HEIGHT,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  pageImage: {
    width: SCREEN_WIDTH,
    height: PAGE_HEIGHT,
  },
  tocOverlay: {
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  tocOverlayCard: {
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: "75%",
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  tocOverlayItemTitle: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    flex: 1,
    paddingRight: 12,
  },
  tocOverlayPageNum: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
});
