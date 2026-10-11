import type { BibleBook } from "./catalog";

export interface ParsedBibleReference {
  bookIndex: number;
  chapterIndex: number;
  startVerseIndex: number;
  endVerseIndex: number;
  startVerseNumber: number;
  endVerseNumber: number;
}

export function parseBibleReference(
  reference: string,
  bookNames: readonly string[],
): ParsedBibleReference | null {
  const match = reference
    .trim()
    .match(/^(.+?)\s+(\d+)\s*:\s*(\d+)(?:\s*[-–—]\s*(\d+))?$/);
  if (!match) return null;

  let requestedBook = match[1].trim();
  if (requestedBook.toLocaleLowerCase() === "psalm") {
    requestedBook = "Psalms";
  }

  const bookIndex = bookNames.findIndex(
    (bookName) => bookName.toLocaleLowerCase() === requestedBook.toLocaleLowerCase(),
  );
  const chapterNumber = Number(match[2]);
  const startVerseNumber = Number(match[3]);
  const endVerseNumber = Number(match[4] ?? match[3]);

  if (
    bookIndex < 0 ||
    chapterNumber < 1 ||
    startVerseNumber < 1 ||
    endVerseNumber < startVerseNumber
  ) {
    return null;
  }

  return {
    bookIndex,
    chapterIndex: chapterNumber - 1,
    startVerseIndex: startVerseNumber - 1,
    endVerseIndex: endVerseNumber - 1,
    startVerseNumber,
    endVerseNumber,
  };
}

export function getBibleReferenceText(
  books: BibleBook[],
  reference: string,
  bookNames: readonly string[],
): string | null {
  const location = parseBibleReference(reference, bookNames);
  if (!location) return null;

  const chapter = books[location.bookIndex]?.chapters[location.chapterIndex];
  if (!chapter || location.endVerseIndex >= chapter.length) return null;

  return chapter
    .slice(location.startVerseIndex, location.endVerseIndex + 1)
    .join(" ");
}
