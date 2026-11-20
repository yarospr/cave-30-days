// QA stills from one bundle: node tools/stills.mjs <out.jpg> <columns> <frames: a,b,c | a:b> [tileW] [Comp]
// Renders single frames to out/qa/ (3 at a time on the GPU) and tiles them with ffmpeg.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [out, colsArg, spec, wArg, compArg] = process.argv.slice(2);
const comp = compArg || "PilotMids";
const cols = +colsArg || 4, tileW = +wArg || 480;
const frames = spec.includes(":") ? (() => { const [a, b] = spec.split(":").map(Number); return Array.from({ length: b - a + 1 }, (_, i) => a + i); })() : spec.split(",").map(Number);
const dir = path.resolve("out/qa"); fs.mkdirSync(dir, { recursive: true });
for (const f of fs.readdirSync(dir)) fs.rmSync(path.join(dir, f));
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), outDir: path.resolve("out/qa_bundle"), publicDir: path.resolve("public") });
const browser = await openBrowser("chrome", { chromiumOptions: { gl: "angle" } });
const composition = await selectComposition({ serveUrl, id: comp, inputProps: {}, puppeteerInstance: browser });
let next = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (next < frames.length) {
    const i = next++;
    await renderStill({ composition, serveUrl, frame: frames[i], output: path.join(dir, `f${String(i).padStart(4, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 88, puppeteerInstance: browser, inputProps: {}, timeoutInMilliseconds: 240000 });
  }
}));
await browser.close({ silent: true });
const rows = Math.ceil(frames.length / cols);
execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", "1", "-i", path.join(dir, "f%04d.jpg"), "-vf", `scale=${tileW}:-1,tile=${cols}x${rows}:padding=4`, "-frames:v", "1", "-q:v", "3", out]);
console.log("wrote", out, frames.length, "frames");
