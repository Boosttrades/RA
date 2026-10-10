import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BIBLE_BOOK_NAMES,
  BIBLE_VERSIONS,
  BibleBook,
  BibleVersionId,
  loadBibleBooks,
} from "@/data/bible/catalog";
import {
  BibleSearchResult,
  MAX_BIBLE_SEARCH_RESULTS,
  searchBible,
} from "@/data/bible/search";
import {
  ChapterDirection,
  getAdjacentBibleChapter,
} from "@/data/bible/navigation";
import { useColors } from "@/hooks/useColors";

type BibleMode = "read" | "search";
type PickerTarget = "read" | "search";
type BiblePicker =
  | { kind: "version" }
  | { kind: "book"; target: PickerTarget }
  | { kind: "chapter"; target: PickerTarget }
  | null;

interface VerseItem {
  number: number;
  text: string;
}

function cleanVerseText(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
}

export default function BibleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 118 : insets.bottom + 92;

  const [versionId, setVersionId] = useState<BibleVersionId>("KJV");
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [loadStatus, setLoadStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [retryCount, setRetryCount] = useState(0);
  const [mode, setMode] = useState<BibleMode>("read");
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);
  const [searchBookIndex, setSearchBookIndex] = useState<number | null>(null);
  const [searchChapterIndex, setSearchChapterIndex] = useState<number | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [picker, setPicker] = useState<BiblePicker>(null);
  const [bookPickerQuery, setBookPickerQuery] = useState("");

  useEffect(() => {
    let active = true;
    setLoadStatus("loading");

    loadBibleBooks(versionId)
      .then((loadedBooks) => {
        if (!active) return;
        setBooks(loadedBooks);
        setLoadStatus("ready");
      })
      .catch(() => {
        if (active) setLoadStatus("error");
      });

    return () => {
      active = false;
    };
  }, [versionId, retryCount]);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearchText(searchText.trim()),
      250
    );
    return () => clearTimeout(timer);
  }, [searchText]);

  const selectedBook = books[selectedBookIndex];
  const selectedChapter = selectedBook?.chapters[selectedChapterIndex] ?? [];
  const verseItems = useMemo<VerseItem[]>(
    () => selectedChapter.map((text, index) => ({ number: index + 1, text })),
    [selectedChapter]
  );

  const searchResults = useMemo(
    () =>
      searchBible(
        books,
        debouncedSearchText,
        searchBookIndex,
        searchChapterIndex
      ),
    [books, debouncedSearchText, searchBookIndex, searchChapterIndex]
  );

  const filteredBookNames = useMemo(() => {
    const query = bookPickerQuery.trim().toLocaleLowerCase();
    return BIBLE_BOOK_NAMES.map((name, index) => ({ name, index })).filter(
      (book) => !query || book.name.toLocaleLowerCase().includes(query)
    );
  }, [bookPickerQuery]);

  const currentPickerBookIndex =
    picker?.kind === "chapter"
      ? picker.target === "read"
        ? selectedBookIndex
        : searchBookIndex ?? selectedBookIndex
      : selectedBookIndex;
  const currentPickerBook = books[currentPickerBookIndex];
  const currentVersion = BIBLE_VERSIONS.find(
    (version) => version.id === versionId
  );
  const searchIsReady = debouncedSearchText.length >= 2;
  const previousChapter = useMemo(
    () =>
      getAdjacentBibleChapter(
        books,
        selectedBookIndex,
        selectedChapterIndex,
        "previous"
      ),
    [books, selectedBookIndex, selectedChapterIndex]
  );
  const nextChapter = useMemo(
    () =>
      getAdjacentBibleChapter(
        books,
        selectedBookIndex,
        selectedChapterIndex,
        "next"
      ),
    [books, selectedBookIndex, selectedChapterIndex]
  );

  const navigateChapter = useCallback(
    (direction: ChapterDirection) => {
      const location = getAdjacentBibleChapter(
        books,
        selectedBookIndex,
        selectedChapterIndex,
        direction
      );
      if (!location) return;
      setSelectedBookIndex(location.bookIndex);
      setSelectedChapterIndex(location.chapterIndex);
    },
    [books, selectedBookIndex, selectedChapterIndex]
  );

  const chapterSwipeResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gesture) =>
          Math.abs(gesture.dx) > 30 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy) * 1.25,
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -55 || gesture.vx < -0.55) {
            navigateChapter("next");
          } else if (gesture.dx > 55 || gesture.vx > 0.55) {
            navigateChapter("previous");
          }
        },
        onPanResponderTerminationRequest: () => false,
      }),
    [navigateChapter]
  );

  const openPicker = (nextPicker: BiblePicker) => {
    Keyboard.dismiss();
    setBookPickerQuery("");
    setPicker(nextPicker);
  };

  const chooseBook = (index: number | null) => {
    if (picker?.kind !== "book") return;
    if (picker.target === "read") {
      if (index !== null) {
        setSelectedBookIndex(index);
        setSelectedChapterIndex(0);
      }
    } else {
      setSearchBookIndex(index);
      setSearchChapterIndex(null);
    }
    setPicker(null);
  };

  const chooseChapter = (index: number | null) => {
    if (picker?.kind !== "chapter") return;
    if (picker.target === "read") {
      if (index !== null) setSelectedChapterIndex(index);
    } else {
      setSearchChapterIndex(index);
    }
    setPicker(null);
  };

  const openSearchResult = (result: BibleSearchResult) => {
    Keyboard.dismiss();
    setSelectedBookIndex(result.bookIndex);
    setSelectedChapterIndex(result.chapterIndex);
    setMode("read");
  };

  const renderVerse = ({ item }: { item: VerseItem }) => (
    <View style={styles.verseRow}>
      <Text style={[styles.verseNumber, { color: colors.primary }]}>
        {item.number}
      </Text>
      <Text style={[styles.verseText, { color: colors.text }]}>
        {cleanVerseText(item.text)}
      </Text>
    </View>
  );

  const renderSearchResult = ({ item }: { item: BibleSearchResult }) => (
    <Pressable
      onPress={() => openSearchResult(item)}
      style={({ pressed }) => [
        styles.resultCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.82 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Open ${item.bookName} chapter ${item.chapterIndex + 1}, verse ${item.verseIndex + 1}`}
    >
      <View style={styles.resultHeading}>
        <Text style={[styles.resultReference, { color: colors.primary }]}>
          {item.bookName} {item.chapterIndex + 1}:{item.verseIndex + 1}
        </Text>
        <Feather
          name="arrow-up-right"
          size={15}
          color={colors.mutedForeground}
        />
      </View>
      <Text
        style={[styles.resultVerse, { color: colors.text }]}
        numberOfLines={4}
      >
        {cleanVerseText(item.text)}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: topPadding + 11,
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back to tools"
          testID="bible-back-button"
        >
          <Feather name="arrow-left" size={21} color={colors.navy} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.navy }]}>Bible</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.topControls}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
          TRANSLATION
        </Text>
        <Pressable
          onPress={() => openPicker({ kind: "version" })}
          style={[
            styles.versionButton,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Choose translation. Current: ${currentVersion?.name ?? versionId}`}
          testID="bible-version-picker"
        >
          <View style={styles.versionText}>
            <Text style={[styles.versionCode, { color: colors.primary }]}>
              {versionId}
            </Text>
            <Text
              style={[styles.versionName, { color: colors.navy }]}
              numberOfLines={1}
            >
              {currentVersion?.name}
            </Text>
          </View>
          <Feather name="chevron-down" size={18} color={colors.mutedForeground} />
        </Pressable>

        <View
          style={[
            styles.modeSwitch,
            { backgroundColor: colors.secondary, borderColor: colors.border },
          ]}
        >
          {(["read", "search"] as const).map((tab) => {
            const active = mode === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setMode(tab)}
                style={[
                  styles.modeButton,
                  active && { backgroundColor: colors.card },
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
                accessibilityLabel={tab === "read" ? "Read Bible" : "Search Bible"}
                testID={`bible-mode-${tab}`}
              >
                <Feather
                  name={tab === "read" ? "book-open" : "search"}
                  size={15}
                  color={active ? colors.primary : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.modeButtonText,
                    { color: active ? colors.navy : colors.mutedForeground },
                  ]}
                >
                  {tab === "read" ? "Read" : "Search"}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {loadStatus === "loading" ? (
        <View style={styles.statusState}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
            Loading {versionId}…
          </Text>
        </View>
      ) : loadStatus === "error" ? (
        <View style={styles.statusState}>
          <Feather name="alert-circle" size={28} color={colors.destructive} />
          <Text style={[styles.statusTitle, { color: colors.navy }]}>
            Couldn’t load this edition
          </Text>
          <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
            The bundled Bible data could not be opened.
          </Text>
          <Pressable
            onPress={() => setRetryCount((current) => current + 1)}
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            accessibilityRole="button"
            testID="bible-retry-button"
          >
            <Text style={[styles.retryText, { color: colors.primaryForeground }]}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : mode === "read" ? (
        <View style={styles.flex}>
          <View style={styles.readControls}>
            <Pressable
              onPress={() => navigateChapter("previous")}
              disabled={previousChapter === null}
              style={[
                styles.chapterArrow,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: previousChapter === null ? 0.45 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Previous chapter"
              accessibilityState={{ disabled: previousChapter === null }}
              testID="bible-previous-chapter"
            >
              <Feather name="chevron-left" size={21} color={colors.primary} />
            </Pressable>
            <Pressable
              onPress={() => openPicker({ kind: "book", target: "read" })}
              style={[
                styles.locationButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Choose book. Current: ${selectedBook?.name}`}
              testID="bible-book-picker"
            >
              <Feather name="book" size={16} color={colors.primary} />
              <Text
                style={[styles.locationButtonText, { color: colors.navy }]}
                numberOfLines={1}
              >
                {selectedBook?.name ?? "Choose book"}
              </Text>
              <Feather
                name="chevron-down"
                size={16}
                color={colors.mutedForeground}
              />
            </Pressable>
            <Pressable
              onPress={() => openPicker({ kind: "chapter", target: "read" })}
              style={[
                styles.chapterButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Choose chapter. Current chapter ${selectedChapterIndex + 1}`}
              testID="bible-chapter-picker"
            >
              <Text style={[styles.chapterButtonText, { color: colors.navy }]}>
                {selectedChapterIndex + 1}
              </Text>
              <Feather
                name="chevron-down"
                size={15}
                color={colors.mutedForeground}
              />
            </Pressable>
            <Pressable
              onPress={() => navigateChapter("next")}
              disabled={nextChapter === null}
              style={[
                styles.chapterArrow,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: nextChapter === null ? 0.45 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Next chapter"
              accessibilityState={{ disabled: nextChapter === null }}
              testID="bible-next-chapter"
            >
              <Feather name="chevron-right" size={21} color={colors.primary} />
            </Pressable>
          </View>

          <View
            style={styles.flex}
            {...chapterSwipeResponder.panHandlers}
            testID="bible-chapter-swipe-area"
          >
            <FlatList
              key={`${selectedBookIndex}-${selectedChapterIndex}`}
              data={verseItems}
              keyExtractor={(item) => String(item.number)}
              renderItem={renderVerse}
              contentContainerStyle={[
                styles.verseList,
                { paddingBottom: bottomPadding },
              ]}
              showsVerticalScrollIndicator={false}
              initialNumToRender={24}
              windowSize={9}
              ListHeaderComponent={
                <View style={styles.chapterHeading}>
                  <Text style={[styles.chapterEyebrow, { color: colors.primary }]}>
                    {versionId} · {currentVersion?.name}
                  </Text>
                  <Text style={[styles.chapterTitle, { color: colors.navy }]}>
                    {selectedBook?.name} {selectedChapterIndex + 1}
                  </Text>
                  <Text
                    style={[
                      styles.chapterSwipeHint,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    Swipe left or right to change chapter
                  </Text>
                </View>
              }
              ListEmptyComponent={
                <Text style={[styles.statusText, { color: colors.mutedForeground }]}>
                  No verses are available for this chapter.
                </Text>
              }
            />
          </View>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior="padding"
          keyboardVerticalOffset={0}
        >
          <View style={styles.searchArea}>
            <View
              style={[
                styles.searchInputWrap,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="search" size={19} color={colors.mutedForeground} />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search a word or phrase"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.searchInput, { color: colors.navy }]}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                accessibilityLabel="Search Bible phrases"
                testID="bible-search-input"
              />
              {searchText.length > 0 ? (
                <Pressable
                  onPress={() => {
                    setSearchText("");
                    setDebouncedSearchText("");
                  }}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                >
                  <Feather
                    name="x-circle"
                    size={18}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.filterRow}>
              <Pressable
                onPress={() =>
                  openPicker({ kind: "book", target: "search" })
                }
                style={[
                  styles.filterButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                accessibilityRole="button"
                accessibilityLabel={
                  searchBookIndex === null
                    ? "Filter by any book"
                    : `Filter by ${BIBLE_BOOK_NAMES[searchBookIndex]}`
                }
                testID="bible-search-book-filter"
              >
                <Feather name="book" size={14} color={colors.primary} />
                <Text
                  style={[styles.filterButtonText, { color: colors.navy }]}
                  numberOfLines={1}
                >
                  {searchBookIndex === null
                    ? "All books"
                    : BIBLE_BOOK_NAMES[searchBookIndex]}
                </Text>
                <Feather
                  name="chevron-down"
                  size={14}
                  color={colors.mutedForeground}
                />
              </Pressable>

              <Pressable
                onPress={() =>
                  searchBookIndex !== null &&
                  openPicker({ kind: "chapter", target: "search" })
                }
                disabled={searchBookIndex === null}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    opacity: searchBookIndex === null ? 0.55 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ disabled: searchBookIndex === null }}
                accessibilityLabel={
                  searchChapterIndex === null
                    ? "Filter by any chapter"
                    : `Filter by chapter ${searchChapterIndex + 1}`
                }
                testID="bible-search-chapter-filter"
              >
                <Feather name="hash" size={14} color={colors.primary} />
                <Text style={[styles.filterButtonText, { color: colors.navy }]}>
                  {searchChapterIndex === null
                    ? "Any chapter"
                    : `Chapter ${searchChapterIndex + 1}`}
                </Text>
                <Feather
                  name="chevron-down"
                  size={14}
                  color={colors.mutedForeground}
                />
              </Pressable>
            </View>
          </View>

          {searchIsReady ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) =>
                `${item.bookIndex}-${item.chapterIndex}-${item.verseIndex}`
              }
              renderItem={renderSearchResult}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={[
                styles.searchResults,
                { paddingBottom: bottomPadding },
              ]}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={
                <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
                  {searchResults.length === 0
                    ? "No matching verses"
                    : searchResults.length === MAX_BIBLE_SEARCH_RESULTS
                      ? `Showing the first ${MAX_BIBLE_SEARCH_RESULTS} matches`
                      : `${searchResults.length} ${searchResults.length === 1 ? "match" : "matches"}`}
                </Text>
              }
              ListEmptyComponent={
                <View style={styles.noResults}>
                  <Feather
                    name="search"
                    size={24}
                    color={colors.mutedForeground}
                  />
                  <Text style={[styles.noResultsTitle, { color: colors.navy }]}>
                    Try another phrase
                  </Text>
                  <Text
                    style={[styles.noResultsText, { color: colors.mutedForeground }]}
                  >
                    Check the spelling or clear a book or chapter filter.
                  </Text>
                </View>
              }
            />
          ) : (
            <View style={styles.searchPrompt}>
              <View
                style={[
                  styles.searchPromptIcon,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Feather name="search" size={23} color={colors.primary} />
              </View>
              <Text style={[styles.searchPromptTitle, { color: colors.navy }]}>
                Search Scripture
              </Text>
              <Text
                style={[styles.searchPromptText, { color: colors.mutedForeground }]}
              >
                Enter a word or phrase. Narrow results by book and chapter.
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      )}

      <Modal
        visible={picker !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPicker(null)}
      >
        <View style={styles.modalLayer}>
          <Pressable
            onPress={() => setPicker(null)}
            style={[styles.modalBackdrop, { backgroundColor: colors.navy }]}
            accessibilityRole="button"
            accessibilityLabel="Close picker"
          />
          <View
            style={[
              styles.pickerSheet,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            <View style={styles.pickerHeader}>
              <View
                style={[
                  styles.pickerHandle,
                  { backgroundColor: colors.border },
                ]}
              />
              <View style={styles.pickerTitleRow}>
                <Text style={[styles.pickerTitle, { color: colors.navy }]}>
                  {picker?.kind === "version"
                    ? "Choose a translation"
                    : picker?.kind === "book"
                      ? "Choose a book"
                      : "Choose a chapter"}
                </Text>
                <Pressable
                  onPress={() => setPicker(null)}
                  hitSlop={9}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <Feather name="x" size={21} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </View>

            {picker?.kind === "version" ? (
              <ScrollView
                style={styles.pickerList}
                contentContainerStyle={styles.versionOptions}
                showsVerticalScrollIndicator={false}
              >
                {BIBLE_VERSIONS.map((version) => {
                  const active = version.id === versionId;
                  return (
                    <Pressable
                      key={version.id}
                      onPress={() => {
                        setVersionId(version.id);
                        setPicker(null);
                      }}
                      style={[
                        styles.versionOption,
                        {
                          backgroundColor: active
                            ? colors.secondary
                            : colors.background,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                    >
                      <View style={styles.versionOptionCopy}>
                        <Text
                          style={[styles.versionOptionCode, { color: colors.primary }]}
                        >
                          {version.id}
                        </Text>
                        <Text
                          style={[styles.versionOptionName, { color: colors.navy }]}
                        >
                          {version.name}
                        </Text>
                      </View>
                      {active ? (
                        <Feather
                          name="check"
                          size={19}
                          color={colors.primary}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
                <Text
                  style={[
                    styles.sourceAttribution,
                    { color: colors.mutedForeground },
                  ]}
                >
                  Text source: thiagobodruk/bible
                </Text>
              </ScrollView>
            ) : picker?.kind === "book" ? (
              <KeyboardAvoidingView
                style={styles.pickerBody}
                behavior="padding"
                keyboardVerticalOffset={0}
              >
                <View
                  style={[
                    styles.bookSearchWrap,
                    { backgroundColor: colors.background, borderColor: colors.border },
                  ]}
                >
                  <Feather
                    name="search"
                    size={17}
                    color={colors.mutedForeground}
                  />
                  <TextInput
                    value={bookPickerQuery}
                    onChangeText={setBookPickerQuery}
                    placeholder="Search books"
                    placeholderTextColor={colors.mutedForeground}
                    style={[styles.bookSearchInput, { color: colors.navy }]}
                    autoCapitalize="words"
                    autoCorrect={false}
                    accessibilityLabel="Search Bible books"
                    testID="bible-book-search-input"
                  />
                </View>
                <ScrollView
                  style={styles.pickerList}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {picker.target === "search" ? (
                    <Pressable
                      onPress={() => chooseBook(null)}
                      style={[
                        styles.bookOption,
                        { borderBottomColor: colors.border },
                      ]}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.bookOptionText,
                          { color: colors.mutedForeground },
                        ]}
                      >
                        All books
                      </Text>
                      {searchBookIndex === null ? (
                        <Feather
                          name="check"
                          size={18}
                          color={colors.primary}
                        />
                      ) : null}
                    </Pressable>
                  ) : null}
                  {filteredBookNames.map((book) => {
                    const active =
                      picker.target === "read"
                        ? book.index === selectedBookIndex
                        : book.index === searchBookIndex;
                    return (
                      <Pressable
                        key={book.name}
                        onPress={() => chooseBook(book.index)}
                        style={[
                          styles.bookOption,
                          { borderBottomColor: colors.border },
                        ]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                      >
                        <Text
                          style={[
                            styles.bookOptionText,
                            { color: active ? colors.primary : colors.navy },
                          ]}
                        >
                          {book.name}
                        </Text>
                        {active ? (
                          <Feather
                            name="check"
                            size={18}
                            color={colors.primary}
                          />
                        ) : null}
                      </Pressable>
                    );
                  })}
                  {filteredBookNames.length === 0 ? (
                    <Text
                      style={[
                        styles.pickerEmptyText,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      No books match that search.
                    </Text>
                  ) : null}
                </ScrollView>
              </KeyboardAvoidingView>
            ) : picker?.kind === "chapter" ? (
              <ScrollView
                style={styles.pickerList}
                contentContainerStyle={styles.chapterOptions}
                showsVerticalScrollIndicator={false}
              >
                {picker.target === "search" ? (
                  <Pressable
                    onPress={() => chooseChapter(null)}
                    style={[
                      styles.anyChapterOption,
                      {
                        backgroundColor:
                          searchChapterIndex === null
                            ? colors.secondary
                            : colors.background,
                        borderColor:
                          searchChapterIndex === null
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: searchChapterIndex === null }}
                  >
                    <Text
                      style={[
                        styles.chapterOptionText,
                        {
                          color:
                            searchChapterIndex === null
                              ? colors.primary
                              : colors.navy,
                        },
                      ]}
                    >
                      Any chapter
                    </Text>
                  </Pressable>
                ) : null}
                <View style={styles.chapterGrid}>
                  {Array.from(
                    { length: currentPickerBook?.chapters.length ?? 0 },
                    (_, index) => index
                  ).map((chapterIndex) => {
                    const active =
                      picker.target === "read"
                        ? chapterIndex === selectedChapterIndex
                        : chapterIndex === searchChapterIndex;
                    return (
                      <Pressable
                        key={chapterIndex}
                        onPress={() => chooseChapter(chapterIndex)}
                        style={[
                          styles.chapterOption,
                          {
                            backgroundColor: active
                              ? colors.primary
                              : colors.background,
                            borderColor: active ? colors.primary : colors.border,
                          },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={`Chapter ${chapterIndex + 1}`}
                        accessibilityState={{ selected: active }}
                      >
                        <Text
                          style={[
                            styles.chapterOptionText,
                            {
                              color: active
                                ? colors.primaryForeground
                                : colors.navy,
                            },
                          ]}
                        >
                          {chapterIndex + 1}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 38,
    height: 34,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  headerSpacer: { width: 38 },
  topControls: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 12 },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 1.3,
    fontFamily: "Inter_700Bold",
    marginBottom: 7,
  },
  versionButton: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 13,
    marginBottom: 13,
  },
  versionText: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  versionCode: { fontSize: 12, fontFamily: "Inter_700Bold" },
  versionName: { fontSize: 13, fontFamily: "Inter_500Medium", flexShrink: 1 },
  modeSwitch: {
    height: 42,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 10,
  },
  modeButtonText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  statusState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 10,
  },
  statusTitle: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  statusText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  retryButton: {
    borderRadius: 13,
    paddingHorizontal: 18,
    paddingVertical: 11,
    marginTop: 6,
  },
  retryText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  readControls: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 12,
  },
  chapterArrow: {
    width: 36,
    minHeight: 45,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 13,
  },
  locationButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 11,
  },
  locationButtonText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  chapterButton: {
    minWidth: 78,
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 12,
  },
  chapterButtonText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  verseList: { paddingHorizontal: 23, paddingTop: 11 },
  chapterHeading: { marginBottom: 15 },
  chapterEyebrow: {
    fontSize: 10,
    letterSpacing: 1.1,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  chapterTitle: { fontSize: 25, fontFamily: "Inter_700Bold" },
  chapterSwipeHint: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 3,
  },
  verseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },
  verseNumber: {
    width: 27,
    fontSize: 12,
    lineHeight: 28,
    fontFamily: "Inter_700Bold",
  },
  verseText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 27,
    fontFamily: "Inter_400Regular",
  },
  searchArea: { paddingHorizontal: 20, paddingTop: 6, paddingBottom: 7 },
  searchInputWrap: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 13,
  },
  searchInput: { flex: 1, minHeight: 44, fontSize: 14, fontFamily: "Inter_400Regular" },
  filterRow: { flexDirection: "row", gap: 8, marginTop: 10 },
  filterButton: {
    flex: 1,
    minWidth: 0,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  filterButtonText: { flex: 1, fontSize: 11, fontFamily: "Inter_600SemiBold" },
  searchResults: { paddingHorizontal: 20, paddingTop: 4 },
  resultCount: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    marginBottom: 10,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 14,
    marginBottom: 10,
  },
  resultHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  resultReference: { fontSize: 12, fontFamily: "Inter_700Bold" },
  resultVerse: { fontSize: 13, lineHeight: 20, fontFamily: "Inter_400Regular" },
  noResults: { alignItems: "center", paddingHorizontal: 24, paddingTop: 60 },
  noResultsTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginTop: 12,
    marginBottom: 5,
  },
  noResultsText: {
    fontSize: 12,
    lineHeight: 19,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  searchPrompt: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 34,
    paddingBottom: 30,
  },
  searchPromptIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  searchPromptTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 6 },
  searchPromptText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
  modalLayer: { flex: 1, justifyContent: "flex-end" },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, opacity: 0.48 },
  pickerSheet: {
    maxHeight: "84%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pickerHeader: { marginBottom: 11 },
  pickerHandle: {
    width: 38,
    height: 4,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  pickerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  pickerList: { flexShrink: 1 },
  versionOptions: { gap: 9, paddingBottom: 10 },
  sourceAttribution: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    marginTop: 4,
  },
  versionOption: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  versionOptionCopy: { gap: 3 },
  versionOptionCode: { fontSize: 12, fontFamily: "Inter_700Bold" },
  versionOptionName: { fontSize: 13, fontFamily: "Inter_500Medium" },
  pickerBody: { flexShrink: 1 },
  bookSearchWrap: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  bookSearchInput: { flex: 1, minHeight: 42, fontSize: 14, fontFamily: "Inter_400Regular" },
  bookOption: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 5,
  },
  bookOptionText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  pickerEmptyText: { fontSize: 13, textAlign: "center", padding: 24 },
  chapterOptions: { paddingBottom: 12 },
  anyChapterOption: {
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 11,
    marginBottom: 13,
  },
  chapterGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  chapterOption: {
    width: 46,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
  },
  chapterOptionText: { fontSize: 13, fontFamily: "Inter_700Bold" },
});
