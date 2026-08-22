const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const { execSync, execFileSync } = require("child_process");

const watch = process.argv.includes("--watch");

const QJSC_PATH = path.resolve(
  __dirname,
  "../../fuickjs_engine/src/main/jni/quickjs/build/qjsc",
);

async function build() {
  const isProd = !watch;
  const reactPath = isProd
    ? "node_modules/react/cjs/react.production.js"
    : "node_modules/react/cjs/react.development.js";
  const reconcilerPath = isProd
    ? "node_modules/react-reconciler/cjs/react-reconciler.production.js"
    : "node_modules/react-reconciler/cjs/react-reconciler.development.js";
  const schedulerPath = isProd
    ? "node_modules/scheduler/cjs/scheduler.production.js"
    : "node_modules/scheduler/cjs/scheduler.development.js";

  const options = {
    bundle: true,
    platform: "browser",
    format: "esm",
    target: "es2020",
    minify: true,
    sourcemap: !isProd,
    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
    },
    conditions: ["browser"],
    mainFields: ["browser", "module", "main"],
    define: {
      "process.env.NODE_ENV": isProd ? '"production"' : '"development"',
      global: "globalThis",
    },
    alias: {
      react: path.resolve(__dirname, reactPath),
      "react-reconciler": path.resolve(__dirname, reconcilerPath),
      scheduler: path.resolve(__dirname, schedulerPath),
      fuickjs: path.resolve(
        __dirname,
        "../../fuickjs_framework/fuickjs/src/index.ts",
      ),
      ethers: path.resolve(__dirname, "node_modules/ethers/dist/ethers.js"),
      "@solana/web3.js": path.resolve(
        __dirname,
        "node_modules/@solana/web3.js/lib/index.browser.esm.js",
      ),
      stream: path.resolve(
        __dirname,
        "node_modules/stream-browserify/index.js",
      ),
      events: path.resolve(__dirname, "node_modules/events/events.js"),
      buffer: path.resolve(__dirname, "node_modules/buffer"),
      "crypto-js": path.resolve(__dirname, "node_modules/crypto-js"),
    },
  };

  const destDir = path.resolve(__dirname, "../app/assets/js");
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  console.log("Building bundle...");
  await esbuild.build({
    ...options,
    entryPoints: ["src/index.ts"],
    outfile: "dist/bundle.js",
  });

  const src = path.resolve(__dirname, "dist/bundle.js");
  const dest = path.join(destDir, "bundle.js");
  const destBin = path.join(destDir, "bundle.qjc");

  fs.copyFileSync(src, dest);
  console.log(`Copied bundle to ${dest}`);

  if (fs.existsSync(QJSC_PATH)) {
    console.log(`Compiling bundle to QuickJS bytecode...`);
    execSync(`${QJSC_PATH} -b -o ${destBin} ${src}`);
    console.log(`Compiled to ${destBin}`);
  }

  const demoDestDir = path.resolve(
    __dirname,
    "../../fuickjs_demo/app/assets/js",
  );
  if (fs.existsSync(demoDestDir)) {
    const demoDest = path.join(demoDestDir, "wallet_bundle.js");
    const demoDestBin = path.join(demoDestDir, "wallet_bundle.qjc");
    fs.copyFileSync(src, demoDest);
    console.log(`Copied bundle to ${demoDest}`);
    if (fs.existsSync(destBin)) {
      fs.copyFileSync(destBin, demoDestBin);
      console.log(`Copied bytecode to ${demoDestBin}`);
    }

    // 重新打包 demo 的所有内置 bundle（含 wallet_bundle），生成 wallet_bundle.zip + bundles.json。
    // demo 运行时按 bundles.json 加载的是签名后的 wallet_bundle.zip，
    // 若只复制裸 .js/.qjc 而不重跑 pack，demo 加载的仍是旧 zip，本工程改动不会生效。
    const packAllScript = path.resolve(
      __dirname,
      "../../fuickjs_demo/js/tools/bundle/pack-all.js",
    );
    if (fs.existsSync(packAllScript)) {
      console.log("Repacking demo bundles (zip + bundles.json)...");
      try {
        execFileSync(process.execPath, [packAllScript], { stdio: "inherit" });
        console.log("Demo bundles repacked.");
      } catch (e) {
        console.error(
          "Repack 失败（demo 可能尚未 build 过，缺少其他 bundle 的 js/qjc）：",
          e.message,
        );
      }
    }
  }

  if (watch) {
    console.log("Watching...");
  } else {
    console.log("Build complete.");
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
