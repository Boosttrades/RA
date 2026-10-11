import { Asset } from "expo-asset";
import { File } from "expo-file-system";

import { BIBLE_BOOK_NAMES } from "./bookNames";
import { decodeBibleData } from "./decode";

export { BIBLE_BOOK_NAMES } from "./bookNames";

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
