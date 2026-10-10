import { Asset } from "expo-asset";
import { File } from "expo-file-system";

import { decodeBibleData } from "./decode";

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

const BIBLE_ARCHIVE_MODULES = {
  KJV: require("./en_kjv.json.gz") as number,
  ASV: require("./en_asv.json.gz") as number,
  WEB: require("./en_web.json.gz") as number,
} satisfies Record<BibleVersionId, number>;

const loadedBibleBooks = new Map<BibleVersionId, Promise<BibleBook[]>>();

export async function loadBibleBooks(
  versionId: BibleVersionId
): Promise<BibleBook[]> {
  const cached = loadedBibleBooks.get(versionId);
  if (cached) return cached;

  const loadPromise = (async () => {
    const asset = await Asset.fromModule(
      BIBLE_ARCHIVE_MODULES[versionId]
    ).downloadAsync();

    if (!asset.localUri) {
      throw new Error(`The bundled ${versionId} Bible data is unavailable.`);
    }

    const books = decodeBibleData(await new File(asset.localUri).bytes());
    if (!Array.isArray(books)) {
      throw new Error(`The ${versionId} Bible data is not a book list.`);
    }

    const bibleBooks = books as unknown as BibleBook[];
    if (bibleBooks.length !== BIBLE_BOOK_NAMES.length) {
      throw new Error(`The ${versionId} data does not contain all 66 books.`);
    }

    return bibleBooks.map((book, index) => ({
      ...book,
      name: BIBLE_BOOK_NAMES[index],
    }));
  })();

  loadedBibleBooks.set(versionId, loadPromise);
  try {
    return await loadPromise;
  } catch (error) {
    loadedBibleBooks.delete(versionId);
    throw error;
  }
}
