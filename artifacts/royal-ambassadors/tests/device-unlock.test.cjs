const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

const source = fs.readFileSync(
  path.join(__dirname, "../services/deviceUnlock.ts"),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const stateModule = { exports: {} };
vm.runInNewContext(compiled, {
  exports: stateModule.exports,
  module: stateModule,
});
const { createDeviceUnlockState, isUnlockedForDevice } = stateModule.exports;

test("an unlock state only applies to the device that created it", () => {
  const unlockState = createDeviceUnlockState("android:device-one");

  assert.equal(isUnlockedForDevice(unlockState, "android:device-one"), true);
  assert.equal(isUnlockedForDevice(unlockState, "android:device-two"), false);
});

test("legacy or invalid unlock records do not bypass the device check", () => {
  assert.equal(isUnlockedForDevice("true", "android:device-one"), false);
  assert.equal(isUnlockedForDevice("not-json", "android:device-one"), false);
  assert.equal(isUnlockedForDevice(null, "android:device-one"), false);
});
