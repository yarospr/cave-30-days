// 3D props for inserts: the phone (a live screen), the chronicle (open book, handwritten pages, the margin drawing),
// the archive's translation note. Every texture is a pure function of its key (bounded cache in canvasTex).
import React from "react";
import * as THREE from "three";
import { boxG, canvasTex, coreMat, M } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";
import { CAST } from "../flat/cast";
import { bodyFront, Pen } from "../flat/toon";

const FONT = "'Poppins', 'Arial', sans-serif";
const HAND = "'Segoe Print', 'Bradley Hand', 'Comic Sans MS', cursive";

// ------------------------------------------------------------------ phone
export type Screen = { kind: "batt" | "nosig" | "off" | "rec" | "photo" | "flash" | "play" | "dead" | "torch"; pct?: number };
const drawBatt = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, pct: number) => {
  g.strokeStyle = "#ffffff"; g.lineWidth = h * 0.12; g.strokeRect(x, y, w, h);
  g.fillStyle = "#ffffff"; g.fillRect(x + w, y + h * 0.3, h * 0.18, h * 0.4);
  g.fillStyle = pct <= 5 ? "#ff3b30" : pct <= 20 ? "#ffcc00" : "#4cd964";
  g.fillRect(x + h * 0.14, y + h * 0.14, Math.max(h * 0.08, (w - h * 0.28) * pct / 100), h * 0.72);
};
export const screenTex = (s: Screen) =>
  canvasTex(`screen|${s.kind}|${s.pct ?? -1}`, 360, 760, (g, w, h) => {
    const pct = s.pct ?? 0;
    g.fillStyle = s.kind === "off" || s.kind === "dead" ? "#07080c" : s.kind === "torch" ? "#fffdf0" : "#14213d";
    g.fillRect(0, 0, w, h);
    if (s.kind === "off") return;
    if (s.kind === "dead") {
      drawBatt(g, w / 2 - 70, h / 2 - 34, 140, 68, 0);
      g.strokeStyle = "#ff3b30"; g.lineWidth = 10; g.beginPath(); g.moveTo(w / 2 - 90, h / 2 + 60); g.lineTo(w / 2 + 90, h / 2 - 60); g.stroke();
      return;
    }
    if (s.kind === "torch") return;
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#1d3b6e"); gr.addColorStop(1, "#0d1730");
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    // status bar
    g.fillStyle = "#ffffff"; g.font = `700 30px ${FONT}`; g.textBaseline = "middle";
    g.fillText(s.kind === "nosig" ? "No signal" : "", 26, 40);
    g.textAlign = "right"; g.fillText(`${pct}%`, w - 90, 40); g.textAlign = "left";
    drawBatt(g, w - 80, 26, 54, 28, pct);
    if (s.kind === "batt" || s.kind === "nosig") {
      g.textAlign = "center"; g.font = `800 150px ${FONT}`;
      g.fillStyle = pct <= 5 ? "#ff5b50" : "#ffffff";
      g.fillText(`${pct}%`, w / 2, h * 0.42);
      drawBatt(g, w / 2 - 90, h * 0.56, 180, 80, pct);
      if (s.kind === "nosig") { g.font = `700 40px ${FONT}`; g.fillStyle = "#ffb4ab"; g.fillText("NO SIGNAL", w / 2, h * 0.76); }
      g.textAlign = "left";
    } else if (s.kind === "rec" || s.kind === "play") {
      g.fillStyle = "#3a2a1c"; g.fillRect(0, 90, w, h - 180);
      g.fillStyle = "#ffcf7a"; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(60 + i * 64, 260 + (i % 2) * 40, 18, 0, 7); g.fill(); }
      if (s.kind === "rec") { g.fillStyle = "#ff3b30"; g.beginPath(); g.arc(w / 2 - 50, h - 50, 16, 0, 7); g.fill(); g.font = `800 36px ${FONT}`; g.fillText("REC", w / 2 - 22, h - 48); }
      else { g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.moveTo(w / 2 - 40, h / 2 - 60); g.lineTo(w / 2 + 60, h / 2); g.lineTo(w / 2 - 40, h / 2 + 60); g.fill(); g.fillStyle = "#ffffff"; g.fillRect(30, h - 70, (w - 60), 8); g.fillStyle = "#ff3b30"; g.fillRect(30, h - 70, (w - 60) * 0.3, 8); }
    } else if (s.kind === "photo") {
      g.drawImage(pageCanvas(true), 20, 120, w - 40, (w - 40) * 1.3);
    }
    if (s.kind === "flash") { g.fillStyle = "#ffffff"; g.fillRect(0, 0, w, h); }
  });

/** a phone lying in / held by the scene: body + emissive screen. size ~ 0.075 x 0.155 m */
export const Phone: React.FC<{ p: V3; r?: V3; s?: number; screen: Screen; glow?: number }> = ({ p, r = [0, 0, 0], s = 1, screen, glow = 1 }) => {
  const tex = screenTex(screen);
  const mat = React.useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  mat.map = tex; mat.color.setScalar(screen.kind === "off" ? 1 : glow); mat.needsUpdate = true;
  return (
    <group position={p} rotation={r} scale={s}>
      <M g={boxG(0.078, 0.158, 0.009)} c="#1c1b22" tex="metal" />
      <mesh geometry={screenG} material={mat} position={[0, 0, 0.0047]} userData={{ outline: false }} />
    </group>
  );
};
const screenG = new THREE.PlaneGeometry(0.07, 0.148);

// ------------------------------------------------------------------ the chronicle
/** the right-hand page: Latin-looking script lines, a red initial, the margin drawing of you; `photo` = the yellowed
 * 700-year-old version (for the phone photo); `line` = which last line is written (0 none, 1 "hanged", 2 "went home") */
const pageCache = new Map<string, HTMLCanvasElement>();
export const pageCanvas = (old: boolean, line = 1, drawing = true): HTMLCanvasElement => {
  const key = `${old}|${line}|${drawing}`;
  const hit = pageCache.get(key);
  if (hit) return hit;
  const c = document.createElement("canvas"); c.width = 900; c.height = 1200;
  const g = c.getContext("2d")!;
  g.fillStyle = old ? "#d9c08a" : "#efe2bf"; g.fillRect(0, 0, 900, 1200);
  // stains / age
  for (let i = 0; i < (old ? 26 : 8); i++) {
    const x = (i * 337) % 900, y = (i * 571) % 1200, r = 40 + (i * 53) % 120;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, old ? "rgba(140,96,40,0.18)" : "rgba(160,130,80,0.08)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  // script lines (pseudo-gothic strokes), leaving the margin on the left for the drawing
  g.strokeStyle = old ? "#4a2c1a" : "#2a1a14"; g.lineCap = "round";
  const x0 = drawing ? 330 : 90;
  for (let row = 0; row < 22; row++) {
    const y = 120 + row * 44;
    if (drawing && row > 13) break;
    let x = row === 0 ? x0 + 90 : x0;
    while (x < 820) {
      const wlen = 30 + ((row * 7 + x) % 70);
      g.lineWidth = 5;
      g.beginPath();
      for (let k = 0; k < wlen; k += 9) { g.moveTo(x + k, y - 12); g.lineTo(x + k + 3, y + 4); }
      g.stroke();
      x += wlen + 18;
    }
  }
  // red initial
  g.fillStyle = "#a8262a"; g.font = `900 120px Georgia, serif`; g.fillText("I", x0 - 10, 200);
  if (drawing) {
    // the margin drawing: you, hoodie, the glowing rectangle (drawn with the cast's own pen, in brown ink)
    const d = document.createElement("canvas"); d.width = 600; d.height = 1000;
    bodyFront(new Pen(d.getContext("2d")!), { ...CAST.you }, { mode: "stand", expr: "neutral", prop: "phoneHigh", seed: 4 });
    g.save(); g.globalAlpha = 0.92; g.filter = old ? "sepia(1) saturate(0.6) contrast(1.1)" : "sepia(0.9) saturate(0.7)";
    g.drawImage(d, 20, 140, 300, 500); g.restore();
    // the last line under everything (the fate)
    g.fillStyle = old ? "#4a2c1a" : "#2a1a14"; g.font = `italic 700 44px Georgia, serif`;
    if (line === 1) g.fillText("…septimo die suspensus est.", 90, 860);
    if (line === 2) g.fillText("…septimo die domum rediit.", 90, 860);
  }
  pageCache.set(key, c);
  return c;
};

export const Chronicle: React.FC<{ p: V3; r?: V3; s?: number; old?: boolean; line?: number; drawing?: boolean; wet?: number; flip?: number; reveal?: number }> = ({ p, r = [0, 0, 0], s = 1, old = true, line = 1, drawing = true, wet = 0, flip = -1, reveal = 1 }) => {
  const rv = Math.round(Math.max(0, Math.min(1, reveal)) * 20) / 20;
  const right = canvasTex(`page|${old}|${line}|${drawing}|${wet.toFixed(2)}|${rv}`, 900, 1200, (g) => {
    if (drawing && rv < 1) {
      // the drawing appears stroke by stroke (top to bottom), the last line only at the end
      g.drawImage(pageCanvas(old, 0, false), 0, 0);
      g.save(); g.beginPath(); g.rect(0, 0, 340, 140 + 520 * rv); g.clip();
      g.drawImage(pageCanvas(old, 0, true), 0, 0);
      g.restore();
    } else g.drawImage(pageCanvas(old, line, drawing), 0, 0);
    if (wet > 0) { // a wet glint on the fresh ink of the drawing
      const gr = g.createRadialGradient(170, 420, 0, 170, 420, 220);
      gr.addColorStop(0, `rgba(255,255,255,${0.55 * wet})`); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 140, 340, 520);
    }
  });
  const left = canvasTex(`pageL|${old}`, 900, 1200, (g) => g.drawImage(pageCanvas(old, 0, false), 0, 0));
  // the turning page: its front shows a plain script page, its back the next left page (never mirrored)
  const mF = React.useMemo(() => new THREE.MeshLambertMaterial(), []);
  const mFront = React.useMemo(() => new THREE.MeshLambertMaterial(), []);
  mF.map = left; mF.needsUpdate = true; mFront.map = left; mFront.needsUpdate = true;
  const mR = React.useMemo(() => new THREE.MeshLambertMaterial(), []);
  const mL = React.useMemo(() => new THREE.MeshLambertMaterial(), []);
  mR.map = right; mR.needsUpdate = true; mL.map = left; mL.needsUpdate = true;
  return (
    <group position={p} rotation={r} scale={s}>
      <M g={boxG(0.92, 0.05, 0.62)} c="#6a3a22" tex="fabric" p={[0, 0.025, 0]} />
      <M g={boxG(0.43, 0.03, 0.58)} c="#e8dcc0" tex="paper" p={[-0.222, 0.065, 0]} />
      <M g={boxG(0.43, 0.03, 0.58)} c="#e8dcc0" tex="paper" p={[0.222, 0.065, 0]} />
      <mesh geometry={pageG} material={mL} position={[-0.222, 0.084, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{ outline: false }} />
      <mesh geometry={pageG} material={mR} position={[0.222, 0.084, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{ outline: false }} />
      {flip >= 0 && flip < 1 ? (
        <group position={[0, 0.088, 0]} rotation={[0, 0, Math.PI * (flip * flip * (3 - 2 * flip))]}>
          <mesh geometry={pageG} material={mFront} position={[0.222, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} />
          <mesh geometry={pageG} material={mF} position={[0.222, -0.001, 0]} rotation={[Math.PI / 2, 0, Math.PI]} />
        </group>
      ) : null}
    </group>
  );
};
const pageG = new THREE.PlaneGeometry(0.42, 0.56);

/** the archive's index card with the pencilled translation */
export const NoteCard: React.FC<{ p: V3; r?: V3; s?: number; underline?: number; ending?: boolean }> = ({ p, r = [-Math.PI / 2, 0, 0], s = 1, underline = 0, ending = false }) => {
  const tex = canvasTex(`note|${underline.toFixed(2)}|${ending ? 1 : 0}`, 1000, 620, (g, w, h) => {
    g.fillStyle = "#f7f3e6"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#9fc3e6"; g.lineWidth = 3;
    for (let y = 120; y < h; y += 70) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = "#e48a8a"; g.beginPath(); g.moveTo(90, 0); g.lineTo(90, h); g.stroke();
    g.fillStyle = "#3a3a44"; g.font = `600 44px ${HAND}`;
    const L = ["Netherwick Priory chronicle, 1253 (transl.):", "\"In this year a stranger fell from the sky", "into our village. He spoke in strange tongues", "and carried a stone of light.", ending ? "On the seventh day, the stranger went home." : "On the seventh day, he was hanged.\""];
    if (ending) L.push("He left us his stone of light,", "which never spoke again.\"");
    L.forEach((t, i) => g.fillText(t, 110, 100 + i * 70));
    if (underline > 0) { g.strokeStyle = "#c0302a"; g.lineWidth = 7; g.beginPath(); g.moveTo(110, 404 + 14); g.lineTo(110 + (ending ? 850 : 720) * underline, 404 + 10); g.stroke(); }
  });
  const m = React.useMemo(() => new THREE.MeshLambertMaterial(), []);
  m.map = tex; m.needsUpdate = true;
  return <mesh geometry={noteG} material={m} position={p} rotation={r} scale={s} userData={{ outline: false }} />;
};
const noteG = new THREE.PlaneGeometry(0.2, 0.124);

/** a glowing lamp bulb / candle flame core */
export const Glow: React.FC<{ p: V3; r?: number; col?: string; k?: number }> = ({ p, r = 0.05, col = "#ffd890", k = 1.1 }) => (
  <mesh position={p} material={coreMat(col, k)} userData={{ outline: false }}>
    <sphereGeometry args={[r, 14, 10]} />
  </mesh>
);

/** the archive laptop's screen: the catalogue entry of the last scene */
export const catalogTex = () => canvasTex("catalog", 900, 560, (g, w, h) => {
  g.fillStyle = "#f4f6f8"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#2a4a7a"; g.fillRect(0, 0, w, 70);
  g.fillStyle = "#ffffff"; g.font = `700 34px ${FONT}`; g.fillText("ARCHIVE CATALOGUE", 28, 48);
  g.fillStyle = "#1a1a24"; g.font = `700 36px ${FONT}`; g.fillText("Netherwick Priory - item 0417", 28, 130);
  g.font = `500 30px ${FONT}`; g.fillStyle = "#3a3a44";
  ["Found: priory ruins, 1972", "Small black slab of glass.", "Purpose unknown."].forEach((t, i) => g.fillText(t, 28, 200 + i * 52));
  g.fillStyle = "#1d1b24"; g.fillRect(620, 150, 150, 300);
  g.fillStyle = "#2a2a34"; g.fillRect(632, 162, 126, 276);
  g.strokeStyle = "#9aa0aa"; g.lineWidth = 3; g.beginPath(); g.moveTo(640, 200); g.lineTo(700, 300); g.lineTo(690, 360); g.stroke();
});
