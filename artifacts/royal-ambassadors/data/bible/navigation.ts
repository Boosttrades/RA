import type { BibleBook } from "./catalog";

export type ChapterDirection = "previous" | "next";

export interface BibleChapterLocation {
  bookIndex: number;
  chapterIndex: number;
}

export function getAdjacentBibleChapter(
  books: BibleBook[],
  bookIndex: number,
  chapterIndex: number,
  direction: ChapterDirection,
): BibleChapterLocation | null {
  const book = books[bookIndex];
  if (
    !book ||
    chapterIndex < 0 ||
    chapterIndex >= book.chapters.length
  ) {
    return null;
  }

  if (direction === "previous") {
    if (chapterIndex > 0) {
      return { bookIndex, chapterIndex: chapterIndex - 1 };
    }

    const previousBook = books[bookIndex - 1];
    if (!previousBook?.chapters.length) return null;
    return {
      bookIndex: bookIndex - 1,
      chapterIndex: previousBook.chapters.length - 1,
    };
  }

  if (chapterIndex < book.chapters.length - 1) {
    return { bookIndex, chapterIndex: chapterIndex + 1 };
  }

  const nextBook = books[bookIndex + 1];
  if (!nextBook?.chapters.length) return null;
  return { bookIndex: bookIndex + 1, chapterIndex: 0 };
}
