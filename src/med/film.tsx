// The film: shots in order, each anchored to a word (time.ts). A shot is a pure function of the film time.
// Long-form grammar (inkbeat): holds 3–6 s, classic coverage, a slow eased push on ~1 framing in 3, held frames
// perfectly still, no burned captions. Transitions: a cut, a dip to black (time / place jumps) or a white flash.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useFonts } from "../inkbeat/core/frame";
import type { MoodPreset } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import type { Cam } from "../inkbeat/core/View";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { clamp01, FPS, ramp } from "./time";

export type ShotOut = {
  mood: string | MoodPreset;
  cam: Cam;
  focus?: V3;
  blur?: number;
  sky?: boolean;
  exposure?: number;
  node: React.ReactNode;
  /** 2D overlay drawn over the picture (inserts, titles) */
  over?: React.ReactNode;
};
export type Shot = {
  id: string;
  from: number;
  /** how this shot comes in: a cut (default), a dip through black, a white flash; `d` = total seconds */
  enter?: { kind: "black" | "white"; d: number };
  render: (t: number, k: number, dur: number) => ShotOut;
};

/** a camera that eases from A to B across the shot (a push / pull); still when A = B */
export const move = (a: [V3, V3, number], b: [V3, V3, number] | null, k: number, face = 0.5): Cam => {
  if (!b) return aim(a[0], a[1], a[2], face);
  const e = k * k * (3 - 2 * k);
  const L = (x: V3, y: V3): V3 => [x[0] + (y[0] - x[0]) * e, x[1] + (y[1] - x[1]) * e, x[2] + (y[2] - x[2]) * e];
  return aim(L(a[0], b[0]), L(a[1], b[1]), a[2] + (b[2] - a[2]) * e, face);
};

/** HUD: the day and the battery from S03 on */
export type Hud = { day: number; pct: number } | null;
const HudPill: React.FC<{ h: NonNullable<Hud>; a: number }> = ({ h, a }) => {
  const col = h.pct <= 5 ? "#ff5b50" : h.pct <= 20 ? "#ffcc00" : "#7be07b";
  return (
    <div style={{ position: "absolute", left: 48, top: 40, opacity: a, display: "flex", alignItems: "center", gap: 18, padding: "12px 26px",
      background: "rgba(20,14,24,0.72)", borderRadius: 40, border: "3px solid rgba(255,240,220,0.85)", fontFamily: "Poppins", fontWeight: 800, fontSize: 40, color: "#fff7ea", letterSpacing: 1 }}>
      <span>DAY {h.day}</span>
      <span style={{ width: 3, height: 34, background: "rgba(255,240,220,0.6)" }} />
      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ position: "relative", width: 56, height: 28, border: "4px solid #fff7ea", borderRadius: 6, boxSizing: "border-box" }}>
          <span style={{ position: "absolute", left: 3, top: 3, bottom: 3, width: `${Math.max(4, (h.pct / 100) * 42)}px`, background: col, borderRadius: 2 }} />
          <span style={{ position: "absolute", right: -10, top: 6, width: 6, height: 10, background: "#fff7ea", borderRadius: 2 }} />
        </span>
        <span style={{ color: col }}>{h.pct}%</span>
      </span>
    </div>
  );
};

export const FilmCut: React.FC<{ shots: Shot[]; hud: (t: number) => Hud; offset?: number; end?: number; at?: (f: number) => number }> = ({ shots, hud, offset = 0, end = Infinity, at }) => {
  const f = useCurrentFrame();
  const ready = useFonts();
  const t = at ? at(f) : offset + f / FPS;
  let i = 0;
  while (i + 1 < shots.length && shots[i + 1].from <= t) i++;
  const sh = shots[i];
  const to = i + 1 < shots.length ? shots[i + 1].from : end;
  const dur = Math.max(0.1, to - sh.from);
  const k = clamp01((t - sh.from) / dur);
  const o = sh.render(t, k, dur);
  // transitions: this shot's own entry, and the next shot's entry pulling this one's tail
  let black = 0, white = 0;
  if (sh.enter) {
    const a = 1 - ramp(t, sh.from, sh.from + sh.enter.d / 2);
    if (sh.enter.kind === "black") black = Math.max(black, a); else white = Math.max(white, a);
  }
  const nx = shots[i + 1];
  if (nx && nx.enter) {
    const a = ramp(t, nx.from - nx.enter.d / 2, nx.from);
    if (nx.enter.kind === "black") black = Math.max(black, a); else white = Math.max(white, a);
  }
  const h = hud(t);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {ready ? (
        <View mood={o.mood} cam={o.cam} t={t} focus={o.focus} blur={o.blur ?? 1.0} sky={o.sky ?? false} exposure={o.exposure ?? 0} width={1920} height={1080}>
          {o.node}
        </View>
      ) : null}
      {o.over}
      {h && ready ? <HudPill h={h} a={1} /> : null}
      {black > 0 ? <AbsoluteFill style={{ background: "#000", opacity: black }} /> : null}
      {white > 0 ? <AbsoluteFill style={{ background: "#fffaf0", opacity: white }} /> : null}
    </AbsoluteFill>
  );
};

/** a title card over black (Poppins, one highlighted word) */
export const Title: React.FC<{ a: number; pre: string; hi: string; post?: string }> = ({ a, pre, hi, post = "" }) => (
  <AbsoluteFill style={{ background: "#0c0a10", opacity: a, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 120, color: "#f4ece0", letterSpacing: 4, textShadow: "0 0 40px rgba(255,170,80,0.35)" }}>
      {pre} <span style={{ color: "#f2b24e" }}>{hi}</span> {post}
    </div>
  </AbsoluteFill>
);
