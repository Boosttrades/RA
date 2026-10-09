export type BibleVersionId = "KJV" | "ASV" | "WEB";

export interface BibleBook {
  abbrev: string;
  name: string;
  chapters: string[][];
}

export const BIBLE_VERSIONS: {
  id: BibleVersionId;
  name: string;
  fileCode: string;
}[] = [
  { id: "KJV", name: "King James Version", fileCode: "en_kjv" },
  { id: "ASV", name: "American Standard Version", fileCode: "en_asv" },
  { id: "WEB", name: "World English Bible", fileCode: "en_web" },
];

export const BIBLE_BOOK_NAMES = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
] as const;

export async function loadBibleBooks(
  versionId: BibleVersionId
): Promise<BibleBook[]> {
  const module =
    versionId === "KJV"
      ? await import("./en_kjv.json")
      : versionId === "ASV"
        ? await import("./en_asv.json")
        : await import("./en_web.json");

  const books = module.default as unknown as BibleBook[];
  if (books.length !== BIBLE_BOOK_NAMES.length) {
    throw new Error(`The ${versionId} data does not contain all 66 books.`);
  }

  return books.map((book, index) => ({
    ...book,
    name: BIBLE_BOOK_NAMES[index],
  }));
}
