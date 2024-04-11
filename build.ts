import Bun, { BuildConfig } from "bun";
import fs from "fs";
import path from "path";

fs.rmSync("./dist", { recursive: true, force: true });

const defaultBunConfiguration: BuildConfig = {
  entrypoints: [],
  outdir: "./dist",
  format: "esm",
  splitting: false,
  minify: true
};

await Bun.build({
  ...defaultBunConfiguration,
  entrypoints: ["./src/core/cs"],
  naming: "cs.js"
});

await Bun.build({
  ...defaultBunConfiguration,
  entrypoints: ["./src/core/sw"],
  naming: "sw.js"
});

fs.copyFileSync(
  path.join(__dirname, "manifest.json"),
  path.join(__dirname, "dist/manifest.json")
);

await Bun.build({
  ...defaultBunConfiguration,
  entrypoints: ["./src/core/client/popup/popup.ts"],
  naming: "popup.js"
});

const buildOutput = await Bun.build({
  ...defaultBunConfiguration,
  entrypoints: ["./src/core/client/popup/index.html"],
  naming: "popup.html"
});

const compiledHTML = buildOutput.outputs.find(
  currentFile => currentFile.kind === "asset"
);

if (compiledHTML) {
  const HTMLFilePath = compiledHTML.path;
  const distDirectory = HTMLFilePath.substring(
    0,
    HTMLFilePath.lastIndexOf("/") + 1
  );
  const newHTMLFilePath = distDirectory + "popup.html";
  const indexJSFilePath = distDirectory + "index.js";

  fs.rename(HTMLFilePath, newHTMLFilePath, () => {});
  fs.unlink(indexJSFilePath, () => {});
}
