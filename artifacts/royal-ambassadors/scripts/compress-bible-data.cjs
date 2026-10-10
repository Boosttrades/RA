const fs = require("node:fs");
const path = require("node:path");
const { gzipSync } = require("node:zlib");

const bibleDirectory = path.join(__dirname, "../data/bible");
const editions = ["en_kjv.json", "en_asv.json", "en_web.json"];

for (const filename of editions) {
  const source = fs.readFileSync(path.join(bibleDirectory, filename));
  const compressed = gzipSync(source, { level: 9, mtime: 0 });
  const outputPath = path.join(bibleDirectory, `${filename}.gz`);
  fs.writeFileSync(outputPath, compressed);
  console.log(
    `${filename}: ${source.length} → ${compressed.length} bytes (${(
      (compressed.length / source.length) *
      100
    ).toFixed(1)}%)`
  );
}
