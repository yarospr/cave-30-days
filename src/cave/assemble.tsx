// The cave film: all sequences in order + QA comps (one frame per shot at its middle / its quarter points).
import React from "react";
import { FilmCut } from "./film";
import type { Hud, Shot } from "./film";
import { C1_SHOTS, hud1 } from "./seq/c1";
import { C2_SHOTS, hud2 } from "./seq/c2";
import { C3_SHOTS, hud3 } from "./seq/c3";
import { C4_SHOTS, hud4 } from "./seq/c4";
import { DURATION, FPS } from "./time";

const PARTS: Record<string, Shot[]> = { c1: C1_SHOTS, c2: C2_SHOTS, c3: C3_SHOTS, c4: C4_SHOTS };
export const ALL_SHOTS: Shot[] = Object.values(PARTS).flat().sort((a, b) => a.from - b.from);
const HUDS: ((t: number) => Hud)[] = [hud1, hud2, hud3, hud4];
const hudAt = (t: number): Hud => {
  let h: Hud = null;
  for (const f of HUDS) { const x = f(t); if (x) h = x; }
  return h;
};
export const FILM_FRAMES = Math.ceil(DURATION * FPS);
export const FullFilm: React.FC = () => <FilmCut shots={ALL_SHOTS} hud={hudAt} end={DURATION} />;
const endOf = (sh: Shot[], i: number) => (i + 1 < sh.length ? sh[i + 1].from : DURATION);
/** QA: `at` = 0.5 (middle of each shot) or [0.15, 0.85] pairs */
const qaTimes = (part: string, pts: number[]) => {
  const sh = PARTS[part];
  const out: number[] = [];
  sh.forEach((s) => { const i = ALL_SHOTS.indexOf(s); const e = endOf(ALL_SHOTS, i); for (const k of pts) out.push(s.from + (e - s.from) * k); });
  return out;
};
export const midCount = (part: string, n = 1) => (PARTS[part]?.length ?? 0) * n;
export const PartMids: React.FC<{ part: string; pts?: number[] }> = ({ part, pts = [0.5] }) => {
  const ts = qaTimes(part, pts);
  return <FilmCut shots={ALL_SHOTS} hud={hudAt} end={DURATION} at={(f) => ts[Math.min(ts.length - 1, f)]} />;
};
