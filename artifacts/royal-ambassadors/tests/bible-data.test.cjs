const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
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
