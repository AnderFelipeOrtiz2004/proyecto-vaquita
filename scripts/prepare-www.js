const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dest = path.join(root, "www");
const files = [
  "index.html",
  "share.html",
  "manifest.webmanifest",
  "sw.js",
  "css",
  "js",
  "fonts",
  "icons",
  "sprites",
];

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });

for (const name of files) {
  const from = path.join(root, name);
  if (!fs.existsSync(from)) {
    continue;
  }
  fs.cpSync(from, path.join(dest, name), { recursive: true });
}

console.log("www listo");
