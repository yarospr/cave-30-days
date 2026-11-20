// The cave film: shots in order, each anchored to a word (time.ts). Same grammar as the medieval film (holds split
// into framings with actions, never a static 6 s shot). HUD: a "DAY n" pill with tally marks, and a red
// "PROBLEM #n" stamp that slams in on the narrator's word (sound-off readability).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useFonts } from "../inkbeat/core/frame";
import type { MoodPreset } from "../inkbeat/core/moods";
import { aim } from "../inkbeat/core/rig";
import type { Cam } from "../inkbeat/core/View";
import { View } from "../inkbeat/core/View";
import type { V3 } from "../inkbeat/types";
import { clamp01, FPS, ramp } from "./time";
import "./moods";

export type ShotOut = {
  mood: string | MoodPreset;
  cam: Cam;
  focus?: V3;
  blur?: number;
  sky?: boolean;
  exposure?: number;
  node: React.ReactNode;
  over?: React.ReactNode;
};
export type Shot = {
  id: string;
  from: number;
  enter?: { kind: "black" | "white"; d: number };
  render: (t: number, k: number, dur: number) => ShotOut;
};

export const move = (a: [V3, V3, number], b: [V3, V3, number] | null, k: number, face = 0.5): Cam => {
  if (!b) return aim(a[0], a[1], a[2], face);
  const e = k * k * (3 - 2 * k);
  const L = (x: V3, y: V3): V3 => [x[0] + (y[0] - x[0]) * e, x[1] + (y[1] - x[1]) * e, x[2] + (y[2] - x[2]) * e];
  return aim(L(a[0], b[0]), L(a[1], b[1]), a[2] + (b[2] - a[2]) * e, face);
};
/** a small camera shake (impacts): offsets the position, deterministic */
export const shake = (c: Cam, t: number, t0: number, amt = 0.04, d = 0.5): Cam => {
  const k = (t - t0) / d;
  if (k < 0 || k > 1) return c;
  const a = amt * (1 - k) * (1 - k);
  const o: V3 = [a * Math.sin(t * 61), a * Math.sin(t * 47 + 1), a * Math.sin(t * 53 + 2)];
  return { ...c, pos: [c.pos[0] + o[0], c.pos[1] + o[1], c.pos[2] + o[2]], look: [c.look[0] + o[0], c.look[1] + o[1], c.look[2] + o[2]] };
};

export type Hud = { day: string; marks?: number; prob?: [number, number] } | null;
const Pill: React.FC<{ h: NonNullable<Hud> }> = ({ h }) => (
  <div style={{ position: "absolute", left: 48, top: 40, display: "flex", alignItems: "center", gap: 18, padding: "12px 26px",
    background: "rgba(14,12,18,0.74)", borderRadius: 40, border: "3px solid rgba(255,240,220,0.85)", fontFamily: "Poppins", fontWeight: 800, fontSize: 40, color: "#fff7ea", letterSpacing: 1 }}>
    <span>DAY {h.day}</span>
    {h.marks ? (
      <>
        <span style={{ width: 3, height: 34, background: "rgba(255,240,220,0.6)" }} />
        <svg width={Math.min(10, h.marks) * 11 + 8} height={34} viewBox={`0 0 ${Math.min(10, h.marks) * 11 + 8} 34`}>
          {Array.from({ length: Math.min(10, h.marks) }, (_, i) => (i % 5 === 4
            ? <line key={i} x1={(i - 4) * 11 + 2} y1={26} x2={i * 11 + 4} y2={8} stroke="#ffcf7a" strokeWidth={4} strokeLinecap="round" />
            : <line key={i} x1={i * 11 + 6} y1={4} x2={i * 11 + 6} y2={30} stroke="#fff7ea" strokeWidth={4} strokeLinecap="round" />))}
        </svg>
      </>
    ) : null}
  </div>
);
/** "PROBLEM #n" slams in (scale 1.5 -> 1) for ~2.4 s from its word */
const Stamp: React.FC<{ n: number; t: number; t0: number }> = ({ n, t, t0 }) => {
  const k = (t - t0) / 0.18, out = ramp(t, t0 + 2.1, t0 + 2.5);
  if (t < t0 || out >= 1) return null;
  const s = 1 + 0.5 * Math.max(0, 1 - k) ** 2;
  return (
    <div style={{ position: "absolute", right: 60, top: 46, opacity: 1 - out, transform: `rotate(4deg) scale(${s})`, transformOrigin: "center",
      padding: "6px 26px 2px", border: "7px solid #ff3b2f", borderRadius: 12, background: "rgba(20,8,8,0.55)", fontFamily: "Poppins", fontWeight: 900,
      fontSize: 62, color: "#ff4a3a", letterSpacing: 3, boxShadow: "0 0 30px rgba(255,60,40,0.35)" }}>
      PROBLEM #{n}
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
      {h && ready ? <Pill h={h} /> : null}
      {h && h.prob && ready ? <Stamp n={h.prob[0]} t={t} t0={h.prob[1]} /> : null}
      {black > 0 ? <AbsoluteFill style={{ background: "#000", opacity: black }} /> : null}
      {white > 0 ? <AbsoluteFill style={{ background: "#fffaf0", opacity: white }} /> : null}
    </AbsoluteFill>
  );
};

/** a title card over black (Poppins, one highlighted word) */
export const Title: React.FC<{ a: number; pre: string; hi: string; post?: string; sub?: string }> = ({ a, pre, hi, post = "", sub }) => (
  <AbsoluteFill style={{ background: "#07060a", opacity: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
    <div style={{ fontFamily: "Poppins", fontWeight: 800, fontSize: 108, color: "#f4ece0", letterSpacing: 4, textShadow: "0 0 40px rgba(120,255,200,0.25)" }}>
      {pre} <span style={{ color: "#7affc8" }}>{hi}</span> {post}
    </div>
    {sub ? <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 44, color: "#a8a0b0", letterSpacing: 6 }}>{sub}</div> : null}
  </AbsoluteFill>
);
