import type { BibleBook } from "./catalog";

export interface BibleSearchResult {
  bookIndex: number;
  chapterIndex: number;
  verseIndex: number;
  bookName: string;
  text: string;
}

export const MAX_BIBLE_SEARCH_RESULTS = 100;

export function normalizeBibleSearchText(value: string): string {
  return value
    .toLocaleLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[.,;:!?]/g, "")
    .replace(/["“”]/g, "")
    .replace(/[-—–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchBible(
  books: BibleBook[],
  phrase: string,
  bookIndex: number | null,
  chapterIndex: number | null,
  limit = MAX_BIBLE_SEARCH_RESULTS
): BibleSearchResult[] {
  const normalizedPhrase = normalizeBibleSearchText(phrase);
  if (normalizedPhrase.length < 2 || limit < 1) return [];

  const results: BibleSearchResult[] = [];
  const firstBook = bookIndex ?? 0;
  const lastBook = bookIndex ?? books.length - 1;

  for (let currentBook = firstBook; currentBook <= lastBook; currentBook += 1) {
    const book = books[currentBook];
    if (!book) continue;

    const firstChapter = chapterIndex ?? 0;
    const lastChapter = chapterIndex ?? book.chapters.length - 1;

    for (
      let currentChapter = firstChapter;
      currentChapter <= lastChapter;
      currentChapter += 1
    ) {
      const verses = book.chapters[currentChapter] ?? [];
      for (let currentVerse = 0; currentVerse < verses.length; currentVerse += 1) {
        const text = verses[currentVerse];
        if (normalizeBibleSearchText(text).includes(normalizedPhrase)) {
          results.push({
            bookIndex: currentBook,
            chapterIndex: currentChapter,
            verseIndex: currentVerse,
            bookName: book.name,
            text,
          });
          if (results.length >= limit) return results;
        }
      }
    }
  }

  return results;
}
