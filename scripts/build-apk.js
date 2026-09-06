const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const env = {
  ...process.env,
  JAVA_HOME: "C:\\Program Files\\Android\\Android Studio\\jbr",
  ANDROID_HOME: path.join(process.env.LOCALAPPDATA, "Android", "Sdk"),
  ANDROID_SDK_ROOT: path.join(process.env.LOCALAPPDATA, "Android", "Sdk"),
};
env.Path = `${env.JAVA_HOME}\\bin;${env.ANDROID_HOME}\\platform-tools;${env.Path}`;

const gradle = path.join(root, "android", "gradlew.bat");
const result = spawnSync(gradle, ["assembleDebug"], {
  cwd: path.join(root, "android"),
  env,
  stdio: "inherit",
  shell: true,
});

if (result.status !== 0) {
  process.exit(result.status || 1);
}

const built = path.join(
  root,
  "android",
  "app",
  "build",
  "outputs",
  "apk",
  "debug",
  "app-debug.apk",
);
const dest = path.join(root, "vani.apk");
fs.copyFileSync(built, dest);
console.log("APK listo:", dest);
