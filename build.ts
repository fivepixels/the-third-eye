import Bun, { BuildConfig } from "bun";
import fs from "fs";
import path from "path";

// remove pre-exisiting dist folder
fs.rmSync("./dist", { recursive: true, force: true });

// set default bun build configuration
const defaultBunConfiguration: BuildConfig = {
  entrypoints: [],
  outdir: "./dist",
  format: "esm",
  splitting: false,
  minify: false
};

// compile cs.js
await Bun.build({
  ...defaultBunConfiguration,
  entrypoints: ["./src/core/cs"],
  naming: "cs.js"
});

// compile sw.js
await Bun.build({
  ...defaultBunConfiguration,
  entrypoints: ["./src/core/sw"],
  naming: "sw.js"
});

// copy manifest.json
fs.copyFileSync(
  path.join(__dirname, "manifest.json"),
  path.join(__dirname, "dist/manifest.json")
);

// compile popup.js
await Bun.build({
  ...defaultBunConfiguration,
  entrypoints: ["./src/core/client/popup/popup.ts"],
  naming: "popup.js"
});

// compile popup.html
const buildOutput = await Bun.build({
  ...defaultBunConfiguration,
  entrypoints: ["./src/core/client/popup/index.html"],
  naming: "popup.html"
});

// remove extra javascript file following along with the popup.html
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

function copyFileSync(source: string, target: string) {
  let targetFile = target;

  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source: string, target: string) {
  const targetFolder = path.join(target, path.basename(source));

  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder, { recursive: true });
  }

  const files = fs.readdirSync(source);

  files.map(currentFile => {
    const curSource = path.join(source, currentFile);
    if (fs.lstatSync(curSource).isFile()) {
      copyFileSync(curSource, targetFolder);
    }
  });
}

copyFolderRecursiveSync("images", "dist");
