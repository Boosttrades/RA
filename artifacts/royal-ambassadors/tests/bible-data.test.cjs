const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const { gunzipSync } = require("node:zlib");
const ts = require("typescript");

const dataDirectory = path.join(__dirname, "../data/bible");
const versionFiles = ["en_kjv.json", "en_asv.json", "en_web.json"];
const versions = Object.fromEntries(
  versionFiles.map((file) => [
    file,
    JSON.parse(fs.readFileSync(path.join(dataDirectory, file), "utf8")),
  ]),
);

const compiledSearch = ts.transpileModule(
  fs.readFileSync(path.join(dataDirectory, "search.ts"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const searchModule = { exports: {} };
vm.runInNewContext(compiledSearch, {
  exports: searchModule.exports,
  module: searchModule,
});
const { searchBible } = searchModule.exports;

const compiledNavigation = ts.transpileModule(
  fs.readFileSync(path.join(dataDirectory, "navigation.ts"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const navigationModule = { exports: {} };
vm.runInNewContext(compiledNavigation, {
  exports: navigationModule.exports,
  module: navigationModule,
});
const { getAdjacentBibleChapter } = navigationModule.exports;

const compiledDecoder = ts.transpileModule(
  fs.readFileSync(path.join(dataDirectory, "decode.ts"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const decoderModule = { exports: {} };
vm.runInNewContext(compiledDecoder, {
  exports: decoderModule.exports,
  module: decoderModule,
  require,
});
const { decodeBibleData } = decoderModule.exports;

const compiledReferences = ts.transpileModule(
  fs.readFileSync(path.join(dataDirectory, "references.ts"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const referencesModule = { exports: {} };
vm.runInNewContext(compiledReferences, {
  exports: referencesModule.exports,
  module: referencesModule,
});
const { getBibleReferenceText, parseBibleReference } = referencesModule.exports;

const compiledBookNames = ts.transpileModule(
  fs.readFileSync(path.join(dataDirectory, "bookNames.ts"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const bookNamesModule = { exports: {} };
vm.runInNewContext(compiledBookNames, {
  exports: bookNamesModule.exports,
  module: bookNamesModule,
});

const compiledMemoryVerses = ts.transpileModule(
  fs.readFileSync(path.join(__dirname, "../data/verses.ts"), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const memoryVersesModule = { exports: {} };
vm.runInNewContext(compiledMemoryVerses, {
  exports: memoryVersesModule.exports,
  module: memoryVersesModule,
});
const { MEMORY_VERSES } = memoryVersesModule.exports;
const { BIBLE_BOOK_NAMES: bibleBookNames } = bookNamesModule.exports;

test("bundled English Bible editions contain 66 complete book structures", () => {
  const editions = Object.values(versions);

  for (const books of editions) {
    assert.equal(books.length, 66);
    assert.equal(books[0].chapters.length, 50);
    assert.equal(books[1].chapters.length, 40);
    assert.equal(books[65].chapters.length, 22);
    assert.ok(
      books.every(
        (book) =>
          Array.isArray(book.chapters) &&
          book.chapters.every(
            (chapter) =>
              Array.isArray(chapter) &&
              chapter.length > 0 &&
              chapter.every((verse) => typeof verse === "string"),
          ),
      ),
    );
  }
});

test("compressed offline Bible editions match the source and decode at runtime", () => {
  for (const filename of versionFiles) {
    const source = fs.readFileSync(path.join(dataDirectory, filename));
    const archive = fs.readFileSync(path.join(dataDirectory, `${filename}.gz`));
    const edition = JSON.parse(source.toString("utf8"));
    const decoded = decodeBibleData(new Uint8Array(archive));

    assert.ok(archive.length < source.length);
    assert.deepEqual(JSON.parse(JSON.stringify(decoded)), edition);
    assert.deepEqual(JSON.parse(gunzipSync(archive).toString("utf8")), edition);
  }
});

test("bundled editions use the same book and chapter order", () => {
  const [kjv, asv, web] = Object.values(versions);
  const chapterCounts = (books) =>
    books.map((book) => book.chapters.length);

  assert.deepEqual(chapterCounts(asv), chapterCounts(kjv));
  assert.deepEqual(chapterCounts(web), chapterCounts(kjv));
});

test("phrase search finds a verse and returns its book, chapter, and verse indexes", () => {
  const kjv = versions["en_kjv.json"];
  const results = searchBible(kjv, "in the beginning God", null, null);

  assert.ok(results.length > 0);
  assert.equal(results[0].bookIndex, 0);
  assert.equal(results[0].chapterIndex, 0);
  assert.equal(results[0].verseIndex, 0);
  assert.match(results[0].text.toLowerCase(), /in the beginning god/);
});

test("book and chapter filters constrain phrase search", () => {
  const kjv = versions["en_kjv.json"];
  const results = searchBible(kjv, "the", 0, 0, 3);

  assert.ok(results.length > 0);
  assert.ok(results.length <= 3);
  assert.ok(
    results.every(
      (result) => result.bookIndex === 0 && result.chapterIndex === 0,
    ),
  );
});

test("chapter navigation moves between chapters and across book boundaries", () => {
  const kjv = versions["en_kjv.json"];

  const genesisTwo = getAdjacentBibleChapter(kjv, 0, 0, "next");
  assert.equal(genesisTwo.bookIndex, 0);
  assert.equal(genesisTwo.chapterIndex, 1);

  const exodusOne = getAdjacentBibleChapter(kjv, 0, 49, "next");
  assert.equal(exodusOne.bookIndex, 1);
  assert.equal(exodusOne.chapterIndex, 0);

  const genesisFifty = getAdjacentBibleChapter(kjv, 1, 0, "previous");
  assert.equal(genesisFifty.bookIndex, 0);
  assert.equal(genesisFifty.chapterIndex, 49);

  assert.equal(getAdjacentBibleChapter(kjv, 0, 0, "previous"), null);
  assert.equal(getAdjacentBibleChapter(kjv, 65, 21, "next"), null);
});

test("every memory verse resolves to bundled text in all supported editions", () => {
  for (const verse of MEMORY_VERSES) {
    assert.ok(parseBibleReference(verse.reference, bibleBookNames), verse.reference);
    for (const books of Object.values(versions)) {
      assert.ok(
        getBibleReferenceText(books, verse.reference, bibleBookNames),
        `${verse.reference} should exist in each bundled edition`,
      );
    }
  }
});

test("memory verse references handle Psalm aliases and verse ranges", () => {
  const psalm = parseBibleReference("Psalm 119:105", bibleBookNames);
  assert.equal(psalm.bookIndex, 18);
  assert.equal(psalm.chapterIndex, 118);
  assert.equal(psalm.startVerseNumber, 105);

  const range = parseBibleReference("Matthew 5:14-16", bibleBookNames);
  assert.equal(range.startVerseNumber, 14);
  assert.equal(range.endVerseNumber, 16);

  const kjvText = getBibleReferenceText(
    versions["en_kjv.json"],
    "Matthew 5:14-16",
    bibleBookNames,
  );
  const webText = getBibleReferenceText(
    versions["en_web.json"],
    "Matthew 5:14-16",
    bibleBookNames,
  );
  assert.equal(
    kjvText,
    versions["en_kjv.json"][39].chapters[4].slice(13, 16).join(" "),
  );
  assert.notEqual(kjvText, webText);
});

test("Bible reference lookup rejects unknown or out-of-range locations", () => {
  assert.equal(parseBibleReference("Missing Book 1:1", bibleBookNames), null);
  assert.equal(getBibleReferenceText(versions["en_kjv.json"], "Genesis 999:1", bibleBookNames), null);
});
