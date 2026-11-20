// A cast member wired for acting: talk from the voice timeline, automatic blinks, idle life, and the per-frame
// transforms (lift, squash, roll). Use it for every character in every scene.
import React from "react";
import type { V3 } from "../inkbeat/types";
import { CAST } from "../flat/cast";
import { Flat } from "../flat/Flat";
import type { FrontOpts, Outfit, SideOpts } from "../flat/toon";
import { INK } from "../flat/toon";
import { idle } from "./act";
import { talk } from "./time";

export const TINT: Record<string, string> = { golden: "#fff1dc", day: "#ffffff", lamp: "#f6dcb8", night: "#a8b4e8", dusk: "#f4dcd0", cold: "#e4eef8" };
export const blinkAt = (t: number, seed = 0) => ((t + seed * 1.7) % 3.7) < 0.12;
export const EXECUTIONER: Outfit = { jacket: "#2e2632", pants: "#1e1a22", boots: INK, hat: "bonnet", cap: "#1c1820", build: "stout", buttons: "none", skin: "#f0c8a0" };

export type WhoProps = {
  id: keyof typeof CAST | Outfit; sp?: string; t: number; p: V3; cam: V3; mood: string;
  f?: FrontOpts; side?: SideOpts; view?: "front" | "side"; dir?: 1 | -1;
  res?: number; seed?: number; s?: number; lie?: number;
  dy?: number; sy?: number; roll?: number; life?: number; shadow?: boolean;
};
export const Who: React.FC<WhoProps> = ({ id, sp, t, p, cam, mood, f = {}, side = {}, view = "front", dir = 1, res = 1.3, seed = 0, s, lie, dy = 0, sy = 1, roll = 0, life = 1, shadow = true }) => {
  const o = typeof id === "string" ? CAST[id] : id;
  const L = idle(t, seed, life);
  const tk = sp ? talk(sp, t) : 0;
  const bl = f.expr === "shock" || f.expr === "dazed" ? false : blinkAt(t, seed);
  return (
    <Flat o={o} p={p} cam={cam} tint={TINT[mood]} res={res} lie={lie} s={s ?? (o.build === "stout" ? 1.02 : 1)} view={view} dir={dir} shadow={shadow}
      dy={dy} sy={sy * L.sy} roll={roll + (L.tilt * Math.PI) / 180 * 0.35}
      front={{ mode: "stand", seed: seed + 3, light: Math.PI * 1.15, blink: bl, talk: tk, ...f, headTilt: (f.headTilt ?? 0) + L.headTilt }}
      side={{ mode: "stand", seed: seed + 3, talk: tk, blink: bl, ...side }} />
  );
};
