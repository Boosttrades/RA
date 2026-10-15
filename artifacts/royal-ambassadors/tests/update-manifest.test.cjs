const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const ts = require("typescript");

function loadTypeScriptModule(filePath, mocks = {}) {
  const source = fs.readFileSync(filePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const loaded = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: loaded.exports,
    module: loaded,
    require: (name) => {
      if (Object.hasOwn(mocks, name)) return mocks[name];
      throw new Error(`Unexpected module import in test: ${name}`);
    },
  });
  return loaded.exports;
}

const versionUtils = loadTypeScriptModule(
  path.join(__dirname, "../services/update/versionUtils.ts")
);
const checker = loadTypeScriptModule(
  path.join(__dirname, "../services/update/updateChecker.ts"),
  {
    "./logger": { updateLogger: { info() {}, error() {} } },
    "./versionUtils": versionUtils,
  }
);

const manifest = {
  versionCode: 1,
  versionName: "1.0.0",
  apkUrl: "https://github.com/Boosttrades/Apps/releases/download/V1.0.0/RA.apk",
  mandatory: true,
  releaseNotes: "Initial release",
};

test("accepts the Android APK update.json release format", () => {
  const result = checker.validateUpdateManifest(manifest);
  assert.equal(result.versionCode, 1);
  assert.equal(result.versionName, "1.0.0");
  assert.equal(result.apkUrl, manifest.apkUrl);
  assert.equal(result.mandatory, true);
  assert.equal(result.releaseNotes, "Initial release");
});

test("rejects unsafe or unusable release metadata", () => {
  assert.throws(
    () => checker.validateUpdateManifest({ ...manifest, versionCode: 1.5 }),
    /invalid versionCode/
  );
  assert.throws(
    () => checker.validateUpdateManifest({ ...manifest, apkUrl: "http://example.com/app.apk" }),
    /must use HTTPS/
  );
  assert.throws(
    () => checker.validateUpdateManifest({ ...manifest, mandatory: "true" }),
    /mandatory must be true or false/
  );
});

test("uses Android versionCode ordering and rejects downgrades as updates", () => {
  assert.equal(versionUtils.isNewerBuildCode(4, 5), true);
  assert.equal(versionUtils.isNewerBuildCode(5, 5), false);
  assert.equal(versionUtils.isNewerBuildCode(6, 5), false);
});
