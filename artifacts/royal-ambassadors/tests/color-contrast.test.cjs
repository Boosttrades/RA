const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const palettePath = path.join(__dirname, "../constants/colors.ts");
const paletteSource = fs.readFileSync(palettePath, "utf8");
const compiledPalette = ts.transpileModule(paletteSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const paletteModule = { exports: {} };

vm.runInNewContext(compiledPalette, {
  exports: paletteModule.exports,
  module: paletteModule,
});

const palettes = paletteModule.exports.default;
const minimumContrast = 4.5;
const pairs = [
  {
    name: "primary foreground on primary",
    foreground: "primaryForeground",
    background: "primary",
  },
  {
    name: "gold text on gold-light surface",
    foreground: "goldText",
    background: "goldLight",
  },
  {
    name: "text on gold",
    foreground: "onGold",
    background: "gold",
  },
  {
    name: "success feedback",
    foreground: "successFeedback",
    background: "successFeedbackBackground",
  },
  {
    name: "error feedback",
    foreground: "destructiveFeedback",
    background: "destructiveFeedbackBackground",
  },
];

function relativeLuminance(hexColor) {
  const match = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hexColor);
  assert.ok(match, `Expected a six-digit hex color, received ${hexColor}`);

  const channels = match.slice(1).map((channel) => parseInt(channel, 16) / 255);
  const linearChannels = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return (
    0.2126 * linearChannels[0] +
    0.7152 * linearChannels[1] +
    0.0722 * linearChannels[2]
  );
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

for (const theme of ["light", "dark"]) {
  const palette = palettes[theme];
  for (const pair of pairs) {
    test(`${theme}: ${pair.name} meets ${minimumContrast}:1`, () => {
      const ratio = contrastRatio(
        palette[pair.foreground],
        palette[pair.background],
      );

      assert.ok(
        ratio >= minimumContrast,
        `${pair.foreground} on ${pair.background} is ${ratio.toFixed(2)}:1 in ${theme} mode`,
      );
    });
  }
}
