// S09 flint + pyrite, fire, smoke, the chimney, the fish-oil lamp · S10 days 13–18: flood, bad air, the toilet,
// charcoal teeth + the icy bath, the falling rock, Steve the olm.  Light: fire / lamp (warm).
import React from "react";
import type { V3 } from "../../inkbeat/types";
import { coreMat, Flame, Label, M, sphG } from "../../inkbeat/core/kit";
import { hop, lookAround, tremble } from "../../med/act";
import { Fish, Olm } from "../creatures";
import { Echo, Tag } from "../fx";
import { move, shake } from "../film";
import type { Hud, Shot } from "../film";
import { D, DEN, Den, denCeil, Hall, OilLamp, Rock, STREAM_X, T, Tunnel } from "../sets";
import { line, ramp, W } from "../time";
import { you } from "./c1";

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const chunk = (p: V3, k = 2) => <pointLight position={add(p, [0.15, 1.0, 0.35])} color="#5affb8" intensity={k} distance={5} decay={1.6} />;
const warm = (p: V3, k = 2.5) => <pointLight position={add(p, [0.2, 1.1, 0.4])} color="#ffa050" intensity={k} distance={5} decay={1.6} />;
/** sparks: a burst of short streaks from p at each strike time */
const Sparks: React.FC<{ p: V3; t: number; hits: number[] }> = ({ p, t, hits }) => (
  <>
    {hits.flatMap((h, j) => {
      const k = (t - h) / 0.35;
      if (k < 0 || k > 1) return [];
      return Array.from({ length: 9 }, (_, i) => {
        const a = i * 0.7 + j, r = 0.05 + 0.35 * k;
        return <mesh key={`${j}-${i}`} position={[p[0] + Math.cos(a) * r, p[1] + Math.abs(Math.sin(a)) * r * 0.8 - 0.3 * k * k, p[2] + Math.sin(a * 1.3) * r * 0.5]} material={coreMat(i % 3 ? "#ffb030" : "#fff0a0", 1.2)} userData={{ outline: false }}><sphereGeometry args={[0.012 * (1 - k * 0.5), 6, 4]} /></mesh>;
      });
    })}
    {hits.some((h) => t > h && t < h + 0.12) ? <pointLight position={add(p, [0, 0.1, 0.1])} color="#ffb040" intensity={4} distance={3} decay={1.5} /> : null}
  </>
);
const PYR = "#d8b040";

// ================================================================== S09
const L09 = line("S09", 0), L19 = line("S09", 1), L29 = line("S09", 2), L39 = line("S09", 3), L49 = line("S09", 4), L59 = line("S09", 5);
const FIRE = W("S09", 2, "fire");
const KNEEL: V3 = add(D, [-0.4, 0, 0.6]);
const TINDER: V3 = add(D, [0.05, 0, 0.35]);
const den1 = (t: number, cam: V3, o: { fire?: number; smoke?: "room" | "chimney" | null; lamps?: number; shelf?: boolean; pool?: boolean } = {}) =>
  <Den t={t} cam={cam} pool={o.pool ?? false} fire={o.fire ?? 0} smoke={o.smoke ?? null} lamps={o.lamps ?? 0} shelf={o.shelf} />;
const tinder = (t: number, fire: number) => (
  <group position={TINDER}>
    {[0, 1, 2, 3, 4].map((i) => <M key={i} g={sphG(0.03, 6)} p={[Math.cos(i) * 0.06, 0.02, Math.sin(i * 2) * 0.05]} s={[2.4, 0.5, 0.6]} r={[0, i, 0]} c="#b08a58" />)}
    {fire > 0 ? <Flame p={[0, 0.0, 0]} s={0.3 * fire} t={t} seed={7} /> : null}
  </group>
);
const strikes = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => a + ((b - a) * i) / Math.max(1, n - 1));
const s09: Shot[] = [
  {
    id: "s09a", from: L09.start - 0.7, enter: { kind: "black", d: 0.6 },
    render: (t, k) => {
      const g = 1 - 0.75 * ramp(t, L09.start, W("S09", 0, "fading") + 0.3);
      const cam = move([add(KNEEL, [0.3, 1.0, 1.4]), add(KNEEL, [0, 0.9, 0]), 36], [add(KNEEL, [0.25, 1.0, 1.2]), add(KNEEL, [0, 0.92, 0]), 34], k);
      return { mood: "fox", cam, focus: add(KNEEL, [0, 0.9, 0]), blur: 2.0, exposure: -0.5 * (1 - g), node: <>{den1(t, cam.pos)}{you(t, KNEEL, cam.pos, "fox", { mode: "sit", expr: "nervous", prop: "shroom", look: 0.3 }, { id: "youDirty", tint: g < 0.5 ? "#7aa898" : undefined })}{chunk(KNEEL, 2.2 * g)}</> };
    },
  },
  {
    id: "s09b", from: L19.start - 0.1,
    render: (t, k) => {
      const p = add(D, [-0.6, 0, -2.9]);
      const cam = move([add(p, [1.2, 1.3, 1.4]), add(p, [-0.2, 1.1, -0.6]), 38], [add(p, [1.05, 1.3, 1.25]), add(p, [-0.2, 1.1, -0.6]), 37], k);
      const pick = ramp(t, W("S09", 1, "hides flint") - 0.3, W("S09", 1, "flint"));
      return { mood: "fox", cam, focus: add(p, [0, 1.1, -0.3]), blur: 1.6, exposure: -0.2, node: <>{den1(t, cam.pos)}
        <Rock p={add(p, [-0.05, 0.75, -0.62])} s={[0.12, 0.1, 0.1]} seed={81} c="#3a3e4a" amp={0.3} />
        {you(t, p, cam.pos, "fox", { back: true, armR: [100 + 40 * pick, 30], frontR: true, ...(pick > 0.9 ? { prop: "flint" as const } : {}) }, { id: "youDirty" })}{chunk(p, 1.6)}</>,
        over: <Tag a={ramp(t, W("S09", 1, "flint") - 0.1, W("S09", 1, "flint") + 0.15) * (1 - ramp(t, W("S09", 1, "strike") - 0.3, W("S09", 1, "strike")))} text="FLINT" x={1450} y={210} col="#c8d0e0" /> };
    },
  },
  {
    id: "s09c", from: W("S09", 1, "strike") - 0.1,
    render: (t, k) => {
      const p: V3 = [STREAM_X - 0.9, 0, -0.4];
      const cam = move([add(p, [0.1, 0.8, 1.5]), add(p, [0.6, 0.15, -0.2]), 36], [add(p, [0.15, 0.75, 1.3]), add(p, [0.6, 0.15, -0.2]), 34], k);
      const g = ramp(t, W("S09", 1, "golden") - 0.3, W("S09", 1, "in the stream"));
      return { mood: "fox", cam, focus: add(p, [0.6, 0, 0]), blur: 1.8, exposure: -0.25, node: <><Hall t={t} waterLit={0.6} log={0.3} cam={cam.pos} />
        <M g={sphG(0.07, 10)} p={add(p, [0.65 - 0.4 * g, -0.12 + 0.6 * g, -0.15])} s={[1.2, 0.8, 1]} c={PYR} tex="metal" e={PYR} ei={0.35} />
        {you(t, p, cam.pos, "fox", { mode: "sit", facing: 1, expr: g > 0.8 ? "grin" : "neutral", armR: [80 + 30 * g, 20], frontR: true }, { id: "youDirty" })}{chunk(p, 1.4)}</>,
        over: <Tag a={ramp(t, W("S09", 1, "in the stream") - 0.1, W("S09", 1, "in the stream") + 0.15)} text="PYRITE" x={1450} y={210} col="#ffd23a" /> };
    },
  },
  {
    id: "s09d", from: W("S09", 1, "and you get sparks") - 0.1,
    render: (t, k) => {
      const hp = add(TINDER, [0.0, 0.25, 0.05]);
      const hits = strikes(W("S09", 1, "sparks"), L19.end, 6);
      const cam = move([add(TINDER, [0.75, 0.7, 1.15]), add(TINDER, [-0.2, 0.4, 0]), 36], [add(TINDER, [0.68, 0.68, 1.02]), add(TINDER, [-0.2, 0.42, 0]), 35], k);
      return { mood: "fox", cam, focus: hp, blur: 2.6, exposure: -0.5, node: <>{den1(t, cam.pos)}{tinder(t, 0)}
        {you(t, KNEEL, cam.pos, "fox", { mode: "sit", expr: "stern", facing: 1, armL: [70, 40], armR: [60 + 25 * Math.max(0, Math.sin((t - hits[0]) * 9)), 50], frontL: true, frontR: true, prop: "flint" }, { id: "youDirty" })}
        <M g={sphG(0.05, 10)} p={add(TINDER, [-0.08, 0.22, 0.1])} s={[1.2, 0.8, 1]} c={PYR} tex="metal" e={PYR} ei={0.3} /><Sparks p={hp} t={t} hits={hits} /></>,
        over: <Tag a={ramp(t, W("S09", 1, "ten thousand") - 0.1, W("S09", 1, "ten thousand") + 0.15)} text="10,000 YEARS AGO" x={1420} y={210} col="#ffd23a" size={70} /> };
    },
  },
  {
    id: "s09e", from: L29.start - 0.1,
    render: (t, k) => {
      const hits = [...strikes(L29.start, W("S09", 2, "come on", 2), 5), FIRE - 0.15];
      const lit = ramp(t, FIRE - 0.15, FIRE + 0.6);
      const cam = move([add(KNEEL, [0.45, 0.85, 1.3]), add(KNEEL, [0.15, 0.75, 0]), 36], [add(KNEEL, [0.4, 0.85, 1.15]), add(KNEEL, [0.15, 0.76, 0]), 35], k);
      return { mood: lit > 0.3 ? "fire" : "fox", cam, focus: add(KNEEL, [0.15, 0.7, 0]), blur: 1.8, exposure: -0.45 + 0.35 * lit, node: <>{den1(t, cam.pos)}{tinder(t, lit)}
        {you(t, add(KNEEL, tremble(t, 0.004)), cam.pos, lit > 0.3 ? "fire" : "fox", { mode: "sit", expr: lit > 0.2 ? "shock" : "stern", facing: 1, armL: [70, 40], armR: [60 + 25 * Math.max(0, Math.sin(t * 12)) * (1 - lit), 50], frontL: true, frontR: true, prop: "flint" }, { id: "youDirty" })}
        <Sparks p={add(TINDER, [0, 0.25, 0.05])} t={t} hits={hits} /></> };
    },
  },
  {
    id: "s09f", from: W("S09", 2, "i made") - 0.15,
    render: (t, k) => {
      const cam = move([add(KNEEL, [0.4, 1.0, 2.6]), add(KNEEL, [0.2, 1.1, 0]), 40], [add(KNEEL, [0.35, 1.0, 2.3]), add(KNEEL, [0.2, 1.15, 0]), 40], k);
      const h = hop(t, W("S09", 2, "i made"), 0.3, 0.5);
      return { mood: "fire", cam, focus: add(KNEEL, [0.2, 1.0, 0]), blur: 1.2, node: <>{den1(t, cam.pos)}{tinder(t, 1)}
        {you(t, add(KNEEL, [-0.15, 0, -0.1]), cam.pos, "fire", { expr: "laugh", armL: [160, 10], armR: [160, 10], frontL: true, frontR: true }, { id: "youDirty", dy: h.dy, sy: h.sy })}</> };
    },
  },
  {
    id: "s09g", from: L39.start - 0.1,
    render: (t, k) => {
      const cam = move([add(D, [2.6, 1.6, 2.8]), add(D, [-0.2, 1.2, 0.2]), 46], [add(D, [2.4, 1.55, 2.5]), add(D, [-0.2, 1.3, 0.2]), 46], k);
      const sm = ramp(t, W("S09", 3, "smoke") - 0.3, W("S09", 3, "nowhere"));
      return { mood: "fire", cam, focus: KNEEL, blur: 0.8, exposure: -0.15, node: <>{den1(t, cam.pos, { smoke: sm > 0.2 ? "room" : null })}{tinder(t, 1)}
        {you(t, add(KNEEL, tremble(t, 0.008 * sm)), cam.pos, "fire", { mode: "sit", expr: sm > 0.5 ? "pained" : "grin", armR: [150 * sm, 150 * sm], frontR: true }, { id: "youDirty" })}</>,
        over: <Tag a={ramp(t, W("S09", 3, "four seconds") - 0.1, W("S09", 3, "four seconds") + 0.15) * (1 - ramp(t, W("S09", 3, "in a closed") - 0.3, W("S09", 3, "in a closed")))} text="4 SECONDS LATER" x={1420} y={210} col="#ffd23a" size={70} /> };
    },
  },
  {
    id: "s09h", from: W("S09", 3, "except into") - 0.1,
    render: (t, k) => {
      const cam = move([add(KNEEL, [0.15, 1.0, 0.95]), add(KNEEL, [0, 0.95, 0]), 32], [add(KNEEL, [0.12, 1.0, 0.82]), add(KNEEL, [0, 0.96, 0]), 30], k);
      return { mood: "fire", cam, focus: add(KNEEL, [0, 0.95, 0]), blur: 2.4, exposure: -0.2, node: <>{den1(t, cam.pos, { smoke: "room" })}{tinder(t, 1)}
        {you(t, add(KNEEL, tremble(t, 0.016)), cam.pos, "fire", { mode: "sit", expr: "pained", armR: [150, 150], frontR: true }, { id: "youDirty", res: 1.8 })}
        {[0, 1, 2].map((i) => <mesh key={i} position={add(KNEEL, [-0.3 + 0.3 * i + 0.1 * Math.sin(t + i), 1.0 + 0.1 * Math.sin(t * 0.7 + i), 0.35])} userData={{ outline: false }}><sphereGeometry args={[0.18, 12, 8]} /><meshBasicMaterial color="#7a7078" transparent opacity={0.45} depthWrite={false} /></mesh>)}</> };
    },
  },
  {
    id: "s09i", from: L49.start - 0.1,
    render: (t, k) => {
      const carry = ramp(t, L49.start, W("S09", 4, "and the cave") - 0.2);
      const p = lerp3(add(KNEEL, [0.2, 0, 0]), add(DEN.fire, [-0.55, 0, 0.35]), carry);
      const cam = move([add(D, [2.8, 1.3, 1.6]), add(D, [0.3, 0.9, -0.6]), 42], [add(D, [2.6, 1.3, 1.4]), add(D, [0.4, 0.9, -0.8]), 42], k);
      const placed = carry > 0.95;
      return { mood: "fire", cam, focus: p, blur: 1.0, node: <>{den1(t, cam.pos, { fire: placed ? 0.8 : 0, smoke: placed ? "chimney" : null })}
        {you(t, p, cam.pos, "fire", { mode: carry > 0 && carry < 1 ? "stroll" : "stand", phase: t, facing: 1, expr: "stern", ...(placed ? {} : { prop: "torch" as const }) }, { id: "youDirty" })}{placed ? null : warm(p, 3)}</> };
    },
  },
  {
    id: "s09j", from: W("S09", 4, "pulls the smoke") - 0.1,
    render: (t, k) => {
      const f = DEN.fire;
      const top = denCeil(f[0] - D[0], f[2] - D[2]);
      const cam = move([add(f, [1.2, 0.8, 1.6]), add(f, [0, 0.6, 0]), 42], [add(f, [1.1, 0.7, 1.4]), add(f, [0, top, 0]), 46], k);
      return { mood: "fire", cam, focus: add(f, [0, 1.5, 0]), blur: 0.8, node: <>{den1(t, cam.pos, { fire: 1, smoke: "chimney" })}
        {you(t, add(f, [-0.55, 0, 0.45]), cam.pos, "fire", { mode: "sit", facing: 1, expr: "relief", headTilt: -10 }, { id: "youDirty" })}</>,
        over: <Tag a={ramp(t, W("S09", 4, "chimney") - 0.1, W("S09", 4, "chimney") + 0.15)} text="A NATURAL CHIMNEY" x={1400} y={210} col="#ffd23a" size={70} /> };
    },
  },
  {
    id: "s09k", from: L59.start - 0.1,
    render: (t, k) => {
      const b = add(DEN.fire, [-0.45, 0, 0.55]);
      const cam = move([add(b, [0.2, 0.55, 0.65]), add(b, [0, 0.08, 0]), 34], [add(b, [0.18, 0.5, 0.56]), add(b, [0, 0.08, 0]), 32], k);
      const melt = ramp(t, W("S09", 5, "melted") - 0.3, W("S09", 5, "hollow"));
      return { mood: "fire", cam, focus: b, blur: 2.6, node: <>{den1(t, cam.pos, { fire: 1, smoke: "chimney" })}
        <M g={sphG(0.12, 14)} p={add(b, [0, 0.04, 0])} s={[1, 0.45, 1]} c="#8a7e72" tex="rock" />
        <M g={sphG(0.085, 12)} p={add(b, [0, 0.075, 0])} s={[1, 0.12, 1]} c="#e8c878" e="#e8a040" ei={0.3 * melt} />
        <Fish p={add(b, [0.18, 0.02, 0.05])} cam={cam.pos} s={1.1} roll={1.4} /></> };
    },
  },
  {
    id: "s09l", from: W("S09", 5, "the string") - 0.1,
    render: (t, k) => {
      const p = add(DEN.fire, [-0.55, 0, 0.75]);
      const cam = move([add(p, [0.15, 1.45, 0.95]), add(p, [0, 1.3, 0]), 32], [add(p, [0.12, 1.45, 0.82]), add(p, [0, 1.32, 0]), 30], k);
      const pull = ramp(t, W("S09", 5, "string") - 0.1, W("S09", 5, "wick"));
      return { mood: "fire", cam, focus: add(p, [0, 1.3, 0]), blur: 2.2, node: <>{den1(t, cam.pos, { fire: 1, smoke: "chimney" })}
        {you(t, p, cam.pos, "fire", { expr: "stern", armR: [150 - 70 * pull, 60 + 40 * pull], frontR: true, look: 0.3 }, { id: "youDirty", res: 1.8 })}
        <mesh position={add(p, [0.1 + 0.18 * pull, 1.55 - 0.35 * pull, 0.12])} rotation={[0, 0, 0.3 + pull]}><cylinderGeometry args={[0.006, 0.006, 0.3 + 0.2 * pull, 5]} /><meshBasicMaterial color="#e8e2d6" /></mesh></>,
        over: <Tag a={ramp(t, W("S09", 5, "wick") - 0.1, W("S09", 5, "wick") + 0.15)} text="HOODIE STRING = WICK" x={1380} y={210} col="#ffd23a" size={66} /> };
    },
  },
  {
    id: "s09m", from: W("S09", 5, "a lamp") - 0.1,
    render: (t, k) => {
      const p = add(DEN.fire, [-0.7, 0, 0.95]);
      const cam = move([add(p, [0.35, 1.3, 1.7]), add(p, [0, 1.2, 0]), 36], [add(p, [0.22, 1.3, 1.05]), add(p, [0, 1.25, 0]), 32], k);
      return { mood: "fire", cam, focus: add(p, [0, 1.2, 0]), blur: 2.0, exposure: 0.1, node: <>{den1(t, cam.pos, { fire: 0.6, smoke: "chimney" })}
        {you(t, p, cam.pos, "fire", { expr: "relief", prop: "lampStone", headTilt: 8 }, { id: "youDirty", res: 1.6 })}{warm(p, 3.2)}</> };
    },
  },
];

// ================================================================== S10
const L010 = line("S10", 0), L110 = line("S10", 1), L210 = line("S10", 2), L310 = line("S10", 3), L410 = line("S10", 4), L510 = line("S10", 5), L610 = line("S10", 6), L710 = line("S10", 7);
const BANKL: V3 = [STREAM_X - 1.35, 0, 1.0];
const SEAT: V3 = add(DEN.fire, [-0.75, 0, 0.6]);
const ROCKFALL = W("S10", 5, "falls");
const den2 = (t: number, cam: V3, o: { pool?: boolean; rock?: number } = {}) => (
  <><Den t={t} cam={cam} fire={0.8} smoke="chimney" lamps={1} shelf pool={o.pool ?? false} marks={14} />
    {o.rock !== undefined ? <Rock p={add(SEAT, [0, 0.25 + Math.max(0, 2.6 * (1 - o.rock)), 0])} s={[0.45, 0.3, 0.35]} seed={91} c="#7a6c60" /> : null}</>
);
const s10: Shot[] = [
  {
    id: "s10a", from: L010.start - 0.6, enter: { kind: "black", d: 0.6 },
    render: (t, k) => {
      const cam = move([add(D, [2.9, 1.7, 3.0]), add(D, [0, 0.9, -0.5]), 46], [add(D, [2.7, 1.65, 2.7]), add(D, [0, 0.95, -0.5]), 45], k);
      return { mood: "fire", cam, focus: SEAT, blur: 0.7, node: <>{den2(t, cam.pos)}{you(t, SEAT, cam.pos, "fire", { mode: "sit", expr: "smile", prop: "lampStone" }, { id: "youDirty" })}</> };
    },
  },
  {
    id: "s10b", from: L110.start - 0.3,
    render: (t, k) => {
      const fl = ramp(t, W("S10", 1, "the stream rises") - 0.3, W("S10", 1, "your lamp drowns") + 0.4);
      const cam = move([add(BANKL, [-1.9, 1.5, 2.7]), add(BANKL, [0.3, 0.65, -0.3]), 44], [add(BANKL, [-1.8, 1.45, 2.5]), add(BANKL, [0.3, 0.68, -0.3]), 44], k);
      const lampOn = fl < 0.75;
      return { mood: "fire", cam, focus: BANKL, blur: 1.0, exposure: -0.2 - 0.5 * fl, node: <><Hall t={t} waterLit={0.8} log={-1} cam={cam.pos} flood={0.42 * fl} />
        {lampOn ? <OilLamp p={add(BANKL, [0.3, 0, 0.1])} t={t} /> : null}
        {you(t, add(BANKL, [-0.3, 0, -0.5]), cam.pos, "fire", { expr: fl > 0.6 ? "shock" : "nervous", facing: 1, armL: [60, 20], armR: [60, 20] }, { id: "youDirty" })}
        {Array.from({ length: 40 }, (_, i) => { const u = (t * 1.4 + i / 40) % 1; return <mesh key={i} position={[STREAM_X - 2 + (i % 8) * 0.5, 4.2 - 4 * u, -2 + Math.floor(i / 8) * 0.9]} material={coreMat("#a8c8e8", 0.5, 0.5)} userData={{ outline: false }}><boxGeometry args={[0.008, 0.25, 0.008]} /></mesh>; })}</>,
        over: <Tag a={ramp(t, W("S10", 1, "a meter") - 0.1, W("S10", 1, "a meter") + 0.15)} text="+1 METER IN 1 HOUR" x={1400} y={210} col="#9ad8ff" size={70} /> };
    },
  },
  {
    id: "s10c", from: W("S10", 1, "your fish are gone") - 0.1,
    render: (t, k) => {
      const cam = move([[STREAM_X - 0.5, 0.6, 1.8], [STREAM_X, 0.1, 0.4], 36], [[STREAM_X - 0.45, 0.55, 1.6], [STREAM_X, 0.1, 0.4], 34], k);
      return { mood: "fire", cam, focus: [STREAM_X, 0.15, 0.4], blur: 1.8, exposure: -0.3, node: <><Hall t={t} waterLit={0.6} log={-1} cam={cam.pos} flood={0.42} />
        {[0, 1, 2].map((i) => <Fish key={i} p={[STREAM_X - 0.3 + i * 0.3, 0.2, 0.6 - ((t * 0.8 + i * 0.4) % 3)]} cam={cam.pos} s={1.3} wig={Math.sin(t * 7 + i)} dir={-1} />)}</> };
    },
  },
  {
    id: "s10d", from: W("S10", 1, "one whole day") - 0.1,
    render: (t, k) => {
      const ledge: V3 = [-2.8, 1.15, 4.4];
      const p: V3 = [-2.8, 0, 3.6];
      const cam = move([add(p, [1.2, 1.3, -1.6]), add(p, [-0.1, 1.0, 0.4]), 40], [add(p, [1.1, 1.25, -1.4]), add(p, [-0.1, 1.0, 0.4]), 40], k);
      const lift = 0.5 + 0.5 * Math.sin(t * 2.2);
      return { mood: "void", cam, focus: add(p, [0, 1.0, 0.3]), blur: 1.2, node: <><Hall t={t} waterLit={0.3} log={-1} cam={cam.pos} flood={0.3} />
        <Rock p={ledge} s={[0.9, 0.12, 0.45]} seed={93} amp={0.08} c="#7a6c60" /><Rock p={add(ledge, [0.2, 0.14, 0])} s={0.1} seed={94} />
        {you(t, p, cam.pos, "void", { back: true, armL: [100 + 40 * lift, 30], armR: [100 + 40 * lift, 30], frontL: true, frontR: true }, { id: "youDirty" })}</> };
    },
  },
  {
    id: "s10e", from: L210.start - 0.3, enter: { kind: "black", d: 0.5 },
    render: (t, k) => {
      const go = ramp(t, L210.start, W("S10", 2, "your flame") - 0.3);
      const p = lerp3(add(T, [0, 0, 1.6]), add(T, [0, 0, -1.4]), go);
      const cam = move([add(T, [0.3, 0.55, 3.0]), add(T, [0, 0.35, -1]), 46], [add(T, [0.25, 0.5, 2.6]), add(T, [0, 0.35, -1.2]), 44], k);
      return { mood: "fire", cam, focus: p, blur: 0.8, exposure: -0.2, node: <><Tunnel cam={cam.pos} />{you(t, p, cam.pos, "fire", { mode: "sit", back: true, armL: [40, 15], armR: [40, 15], frontL: true, frontR: true }, { id: "youDirty", roll: 0.15 * Math.sin(t * 5), s: 0.85 })}{warm(p, 3.2)}</> };
    },
  },
  {
    id: "s10f", from: W("S10", 2, "your flame") - 0.1,
    render: (t, k) => {
      const shrink = ramp(t, W("S10", 2, "shrinks") - 0.2, W("S10", 2, "blue dot"));
      const lp = add(T, [0.12, 0.6, -1.25]);
      const cam = move([add(lp, [0.05, 0.12, 0.55]), lp, 32], [add(lp, [0.04, 0.1, 0.4]), lp, 30], k);
      const fc = shrink > 0.6 ? "#4a8aff" : "#ffa43a";
      return { mood: "fire", cam, focus: lp, blur: 3.0, exposure: -0.6 * shrink, node: <><Tunnel cam={cam.pos} />
        <M g={sphG(0.09, 14)} p={lp} s={[1, 0.42, 1]} c="#8a7e72" tex="rock" />
        <mesh position={add(lp, [0, 0.06 + 0.05 * (1 - shrink), 0])} scale={[1, 1.8 * (1 - 0.7 * shrink), 1]} material={coreMat(fc, 1.0)} userData={{ outline: false }}><sphereGeometry args={[0.03 * (1 - 0.6 * shrink), 10, 8]} /></mesh>
        <pointLight position={add(lp, [0, 0.15, 0.1])} color={fc} intensity={3 * (1 - 0.8 * shrink)} distance={4} decay={1.6} /></>,
        over: <Tag a={ramp(t, W("S10", 2, "bad air") - 0.1, W("S10", 2, "bad air") + 0.15)} text="BAD AIR · CO₂" x={1420} y={210} col="#6aa8ff" /> };
    },
  },
  {
    id: "s10g", from: W("S10", 2, "you back out") - 0.1,
    render: (t, k) => {
      const back = ramp(t, W("S10", 2, "you back out"), L210.end + 0.3);
      const p = lerp3(add(T, [0, 0, -1.2]), add(T, [0, 0, 1.4]), back);
      const cam = move([add(T, [0.25, 0.55, 2.9]), add(T, [0, 0.4, -0.8]), 44], null, k);
      return { mood: "fire", cam, focus: p, blur: 0.8, exposure: -0.35, node: <><Tunnel cam={cam.pos} />{you(t, p, cam.pos, "fire", { mode: "sit", expr: "nervous", prop: "lampStone" }, { id: "youDirty", s: 0.85 })}<pointLight position={add(p, [0, 0.6, 0.2])} color="#6a8aff" intensity={1} distance={3} decay={1.6} /></> };
    },
  },
  {
    id: "s10h", from: L310.start - 0.3, enter: { kind: "black", d: 0.5 },
    render: (t, k) => {
      const wc: V3 = [STREAM_X - 1.6, 0.75, -6.3];
      const go = ramp(t, W("S10", 3, "downstream") - 0.2, L310.end + 0.4);
      const p = lerp3([STREAM_X - 1.3, 0, -2.0], [STREAM_X - 1.2, 0, -5.6], go);
      const cam = move([[STREAM_X - 1.9, 1.5, 0.6], [STREAM_X - 1.3, 1.0, -4.0], 40], [[STREAM_X - 1.9, 1.5, 0.2], [STREAM_X - 1.3, 1.0, -4.5], 40], k);
      return { mood: "fire", cam, focus: p, blur: 0.6, node: <><Hall t={t} waterLit={0.8} log={-1} cam={cam.pos} />
        <Rock p={add(wc, [0, -0.2, -0.25])} s={[0.7, 0.75, 0.35]} seed={95} amp={0.06} c="#9a8c7e" /><Label text="WC →" p={add(wc, [0, 0.05, 0.08])} w={0.8} h={0.3} fg="#14100e" bg="none" />
        {you(t, p, cam.pos, "fire", { mode: go > 0 && go < 1 ? "stroll" : "stand", phase: t, back: true, prop: "lampStone" }, { id: "youDirty" })}{warm(p, 2.6)}</> };
    },
  },
  {
    id: "s10i", from: L410.start - 0.3, enter: { kind: "black", d: 0.5 },
    render: (t, k) => {
      const cam = move([add(SEAT, [0.12, 1.0, 0.9]), add(SEAT, [0, 0.95, 0]), 32], [add(SEAT, [0.1, 1.0, 0.8]), add(SEAT, [0, 0.96, 0]), 31], k);
      const br = Math.sin(t * 11);
      const done = t > W("S10", 4, "and a finger") + 0.4;
      return { mood: "fire", cam, focus: add(SEAT, [0, 0.95, 0]), blur: 2.4, node: <>{den2(t, cam.pos)}
        {you(t, SEAT, cam.pos, "fire", { mode: "sit", expr: done ? "grin" : "neutral", ...(done ? {} : { prop: "charcoal" as const, armR: [150 + 6 * br, 150] as [number, number], frontR: true }) }, { id: "youDirty", res: 1.8 })}</>,
        over: done ? <Tag a={ramp(t, W("S10", 4, "and a finger") + 0.4, W("S10", 4, "and a finger") + 0.6)} text="CHARCOAL TOOTHPASTE" x={1400} y={210} col="#e8e2d6" size={64} /> : undefined };
    },
  },
  {
    id: "s10j", from: W("S10", 4, "finally take") - 0.1,
    render: (t, k) => {
      const jump = W("S10", 4, "bath");
      const p0: V3 = [STREAM_X - 1.1, 0, 2.2], p1: V3 = [STREAM_X - 0.1, -0.4, 2.2];
      const j = ramp(t, jump - 0.2, jump + 0.35);
      const p = lerp3(p0, p1, j);
      const c0 = move([[STREAM_X - 0.6, 0.9, 4.4], [STREAM_X - 0.5, 0.6, 2.2], 40], null, k);
      const scream = W("S10", 4, "the scream");
      const cam = shake(c0, t, scream, 0.05, 1.2);
      const h = hop(t, jump - 0.25, 0.45, 0.5);
      return { mood: "fire", cam, focus: p, blur: 1.0, node: <><Hall t={t} waterLit={0.8} log={-1} cam={cam.pos} /><OilLamp p={[STREAM_X - 1.6, 0, 2.9]} t={t} />
        {you(t, p, cam.pos, "fire", { expr: t > scream - 0.4 ? "shock" : t > jump ? "pained" : "grin", armL: [150, 20], armR: [150, 20], mode: j > 0.8 ? "sit" : "stand" }, { id: "youTee", dy: j < 1 ? h.dy : 0 })}
        <Echo p={[STREAM_X - 0.1, -0.15, 2.2]} t={t} t0={jump + 0.25} r={1.2} n={3} flat col="#d8f0ff" />
        {[0, 1, 2, 3, 4].map((i) => <Echo key={i} p={add(p, [0, 1.3, 0])} t={t} t0={scream + i * 0.45} r={4} n={2} d={1.6} col="#ffe0b0" />)}</>,
        over: <Tag a={ramp(t, W("S10", 4, "ten degree") - 0.1, W("S10", 4, "ten degree") + 0.15) * (1 - ramp(t, scream - 0.3, scream))} text="10°C WATER" x={1440} y={210} col="#9ad8ff" /> };
    },
  },
  {
    id: "s10k", from: L510.start - 0.3, enter: { kind: "black", d: 0.5 },
    render: (t, k) => {
      const up = W("S10", 5, "a rock") + 0.2;
      const walk = ramp(t, up, ROCKFALL - 0.2);
      const p = lerp3(SEAT, add(SEAT, [1.4, 0, 0.9]), walk);
      const fall = ramp(t, ROCKFALL - 0.2, ROCKFALL + 0.25);
      const c0 = move([add(SEAT, [0.7, 1.4, 3.2]), add(SEAT, [0.5, 1.0, 0]), 42], null, k);
      const cam = shake(c0, t, ROCKFALL + 0.25, 0.08, 0.6);
      return { mood: "fire", cam, focus: SEAT, blur: 0.9, node: <>{den2(t, cam.pos, { rock: fall })}
        {you(t, p, cam.pos, "fire", { mode: t < up ? "sit" : walk > 0 && walk < 1 ? "stroll" : "stand", phase: t, expr: t > ROCKFALL + 0.25 ? "shock" : "neutral", facing: t > ROCKFALL + 0.3 ? -1 : 1, prop: t < up ? "lampStone" : null }, { id: "youDirty" })}
        <Echo p={add(SEAT, [0, 0.03, 0])} t={t} t0={ROCKFALL + 0.25} r={1.2} n={3} flat col="#e8d8c0" /></>,
        over: <Tag a={ramp(t, W("S10", 5, "size of a") - 0.1, W("S10", 5, "size of a") + 0.15) * (1 - ramp(t, ROCKFALL - 0.3, ROCKFALL))} text="TV-SIZED ROCK" x={1440} y={210} col="#ffd23a" /> };
    },
  },
  {
    id: "s10l", from: W("S10", 5, "a second ago") - 0.1,
    render: (t, k) => {
      const p = add(SEAT, [1.4, 0, 0.9]);
      const cam = move([add(p, [0.6, 1.4, 1.3]), add(p, [-0.6, 1.2, -0.4]), 34], [add(p, [0.5, 1.4, 1.15]), add(p, [-0.6, 1.25, -0.4]), 33], k);
      return { mood: "fire", cam, focus: add(p, [0, 1.3, 0]), blur: 1.6, node: <>{den2(t, cam.pos, { rock: 1 })}{you(t, p, cam.pos, "fire", { expr: "shock", facing: -1, armL: [40, 30], armR: [40, 30] }, { id: "youDirty", res: 1.6 })}</> };
    },
  },
  {
    id: "s10m", from: L610.start - 0.3, enter: { kind: "black", d: 0.5 },
    render: (t, k) => {
      const pp = DEN.pool;
      const peek = ramp(t, W("S10", 6, "an olm") - 0.4, W("S10", 6, "an olm"));
      const kp = add(pp, [-0.75, 0, 0.55]);
      const cam = move([add(pp, [0.5, 0.7, 1.6]), add(pp, [-0.2, 0.3, 0]), 38], [add(pp, [0.45, 0.65, 1.4]), add(pp, [-0.2, 0.3, 0]), 37], k);
      return { mood: "fire", cam, focus: pp, blur: 1.4, node: <>{den2(t, cam.pos, { pool: true })}
        <Olm p={add(pp, [0.1, -0.08 + 0.1 * peek, 0.05])} cam={cam.pos} s={1.5} wig={Math.sin(t * 2)} smile={peek} dir={-1} />
        {you(t, kp, cam.pos, "fire", { mode: "sit", facing: 1, expr: peek > 0.5 ? "grin" : "neutral", armR: [80, 20], frontR: true }, { id: "youDirty" })}<OilLamp p={add(pp, [-0.5, 0, -0.5])} t={t} /></>,
        over: <Tag a={ramp(t, W("S10", 6, "an olm"), W("S10", 6, "an olm") + 0.2) * (1 - ramp(t, W("S10", 6, "a blind pink") - 0.2, W("S10", 6, "a blind pink")))} text="OLM" x={1460} y={210} col="#ffb0c4" size={96} /> };
    },
  },
  {
    id: "s10n", from: W("S10", 6, "a blind pink") - 0.1,
    render: (t, k) => {
      const pp = DEN.pool;
      const op = add(pp, [0.1, 0.02, 0.05]);
      const cam = move([add(op, [0.25, 0.22, 0.6]), add(op, [0.05, 0.05, 0]), 32], [add(op, [0.22, 0.2, 0.5]), add(op, [0.05, 0.05, 0]), 30], k);
      const t1 = W("S10", 6, "hundred years"), t2 = W("S10", 6, "without eating"), t3 = W("S10", 6, "baby dragons");
      const tag = t > t3 - 0.2 ? "BABY DRAGONS?" : t > t2 - 0.2 ? "10 YEARS WITHOUT FOOD" : t > t1 - 0.2 ? "LIVES 100 YEARS" : "";
      return { mood: "fire", cam, focus: op, blur: 2.6, node: <>{den2(t, cam.pos, { pool: true })}<Olm p={op} cam={cam.pos} s={1.5} wig={Math.sin(t * 2)} smile={0.8} dir={-1} /><OilLamp p={add(pp, [-0.5, 0, -0.5])} t={t} /></>,
        over: tag ? <Tag a={1} text={tag} x={1380} y={210} col="#ffb0c4" size={72} /> : undefined };
    },
  },
  {
    id: "s10o", from: L710.start - 0.15,
    render: (t, k) => {
      const kp = add(DEN.pool, [-0.75, 0, 0.55]);
      const cam = move([add(kp, [0.25, 0.95, 1.3]), add(kp, [0.1, 0.72, 0]), 36], [add(kp, [0.22, 0.95, 1.15]), add(kp, [0.1, 0.74, 0]), 35], k);
      return { mood: "fire", cam, focus: add(kp, [0, 0.9, 0]), blur: 2.0, node: <>{den2(t, cam.pos, { pool: true })}
        {you(t, kp, cam.pos, "fire", { mode: "sit", expr: "smile", prop: "steve" }, { id: "youDirty", res: 1.6 })}<OilLamp p={add(DEN.pool, [-0.5, 0, -0.5])} t={t} />
        <Label text="STEVE" p={add(DEN.pool, [0.1, 0.55, -0.6])} w={0.7} h={0.22} fg="#efe4cc" bg="none" /></> };
    },
  },
];

export const C3_SHOTS: Shot[] = [...s09, ...s10];
export const hud3 = (t: number): Hud => {
  if (t < L09.start - 0.7 || t > L710.end + 0.6) return null;
  const P: [number, number][] = [[13, W("S09", 0, "problem thirteen")], [14, W("S09", 3, "problem fourteen")]];
  let prob: [number, number] | undefined;
  for (const p of P) if (t >= p[1] - 0.05) prob = p;
  const days: [number, number][] = [[L09.start - 0.7, 10], [L010.start - 0.6, 12], [L110.start - 0.3, 13], [L210.start - 0.3, 14], [L310.start - 0.3, 15], [L410.start - 0.3, 16], [L510.start - 0.3, 17], [L610.start - 0.3, 18]];
  let day = 10;
  for (const [a, d] of days) if (t >= a) day = d;
  return { day: String(day), marks: day, prob };
};
void lookAround;
