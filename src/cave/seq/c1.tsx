// S01 the offer on the night street + the hit · title · S02 day 1, total darkness (echo look) · S03 cold, silence,
// direction, water, bats, hunger · S04 day 3, foxfire: the first light.

import type { V3 } from "../../inkbeat/types";
import type { FrontOpts } from "../../flat/toon";
import { hop, keys, lookAround, n1, tremble } from "../../med/act";
import { BatSwarm, Bat, Fish } from "../creatures";
import { Beat, Breath, CardInsert, DepthSection, Drip, Echo, Tag } from "../fx";
import { move, shake, Title } from "../film";
import type { Hud, Shot } from "../film";
import { hallCeil, Hall, LOG, Rock, ROPE, SH, Shaft, ST, Street, STREAM_X, WAKE } from "../sets";
import { line, ramp, W, WE } from "../time";
import { Who } from "../who";

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
type Mood = string;
/** the hero (talks on his own lines) */
export const you = (t: number, p: V3, cam: V3, mood: Mood, f: FrontOpts = {}, o: { s?: number; dy?: number; sy?: number; roll?: number; res?: number; id?: string; lie?: number; tint?: string } = {}) => (
  <Who id={o.id ?? "you"} sp="you" t={t} p={p} cam={cam} mood={mood} f={f} res={o.res ?? 1.4} dy={o.dy} sy={o.sy} roll={o.roll} lie={o.lie} s={o.s} tint={o.tint} />
);
/** crawling on all fours: a sitting card rolled forward toward `dir` (screen side), arms paddling */
export const crawl = (t: number, dir: 1 | -1, moving = true) => {
  const s = moving ? Math.sin(t * 5.5) : 0;
  return { f: { mode: "sit" as const, armL: [38 + 20 * s, 12] as [number, number], armR: [38 - 20 * s, 12] as [number, number], frontL: true, frontR: true, facing: dir }, roll: -dir * 0.38, dy: 0.01 * Math.abs(s) };
};

// ================================================================== S01: the offer
const H1 = add(ST, [-0.2, 0, 0.4]), X1 = add(ST, [1.0, 0, -0.1]), X2a = add(ST, [-3.4, 0, -0.9]), X2b = add(ST, [-0.75, 0, -0.35]);
const L11 = line("S01", 1), L21 = line("S01", 2), L31 = line("S01", 3);
const HIT = L31.end + 0.02;
const heroAt = (t: number) => (t < 1.6 ? lerp3(add(ST, [-2.6, 0, 0.6]), H1, Math.min(1, t / 1.6)) : H1);
const strAt = (t: number) => lerp3(add(ST, [3.4, 0, -1.7]), X1, ramp(t, 0.1, 1.5));
const stranger = (t: number, cam: V3, f: FrontOpts = {}, id = "stranger", p?: V3, sp = "stranger") => (
  <Who id={id} sp={sp} t={t} p={p ?? strAt(t)} cam={cam} mood="street" res={1.3} seed={5} f={{ facing: -1, mode: t < 1.5 && !p ? "stroll" : "stand", phase: t * 1.0, ...f }} />
);
const heroS = (t: number, cam: V3, f: FrontOpts = {}) => you(t, heroAt(t), cam, "street", { facing: 1, mode: t < 1.6 ? "stroll" : "stand", phase: t * 1.0, ...f });
/** the second hooded man sneaking up behind (from "deal") and swinging */
const second = (t: number, cam: V3) => {
  const t0 = W("S01", 3, "deal") - 0.3;
  if (t < t0) return null;
  const p = lerp3(X2a, X2b, ramp(t, t0, HIT - 0.5));
  const swing = ramp(t, HIT - 0.45, HIT - 0.05);
  return <Who id="stranger" t={t} p={p} cam={cam} mood="street" res={1.2} seed={8} f={{ facing: 1, mode: t < HIT - 0.5 ? "stroll" : "stand", phase: t, armR: [170 - 120 * swing, 10], frontR: true, prop: "stick" }} />;
};
const street = (t: number, cam: V3) => <Street t={t} cam={cam} />;
const s01: Shot[] = [
  {
    id: "s01a", from: 0,
    render: (t, k) => {
      const cam = move([add(ST, [-0.9, 1.6, 4.6]), add(ST, [-0.2, 1.2, -0.4]), 40], [add(ST, [-0.6, 1.6, 4.0]), add(ST, [0.2, 1.25, -0.4]), 38], k);
      return { mood: "street", cam, sky: true, focus: H1, blur: 0.8, node: <>{street(t, cam.pos)}{heroS(t, cam.pos, { expr: t > 0.5 ? "neutral" : "smile", look: t > 0.4 ? 0.6 : 0 })}{stranger(t, cam.pos)}</> };
    },
  },
  {
    id: "s01b", from: W("S01", 0, "thirty days"),
    render: (t, k) => {
      const cam = move([add(H1, [-0.6, 1.62, 1.0]), add(X1, [0, 1.45, 0]), 34], [add(H1, [-0.5, 1.6, 0.85]), add(X1, [0, 1.48, 0]), 32], k);
      const arm = ramp(t, W("S01", 0, "thirty days"), W("S01", 0, "cave"));
      return { mood: "street", cam, sky: true, focus: add(X1, [0, 1.4, 0]), blur: 2.0, node: <>{street(t, cam.pos)}{heroS(t, cam.pos, { back: true })}{stranger(t, cam.pos, { armR: [20 + 55 * arm, 25], frontR: true, prop: arm > 0.6 ? "card" : null })}</> };
    },
  },
  {
    id: "s01c", from: W("S01", 0, "one million") - 0.1,
    render: (t, k) => {
      const cam = move([add(H1, [-0.5, 1.6, 0.85]), add(X1, [0, 1.48, 0]), 32], null, k);
      return { mood: "street", cam, sky: true, focus: add(X1, [0, 1.4, 0]), blur: 3.0, exposure: -0.3, node: <>{street(t, cam.pos)}{heroS(t, cam.pos, { back: true })}{stranger(t, cam.pos, { armR: [75, 25], frontR: true, prop: "card" })}</>,
        over: <CardInsert a={ramp(t, W("S01", 0, "one million") - 0.1, W("S01", 0, "one million") + 0.15)} tilt={-4 + 2 * k} /> };
    },
  },
  {
    id: "s01d", from: L11.start - 0.1,
    render: (t, k) => {
      const cam = move([add(H1, [0.4, 1.52, 1.9]), add(H1, [0, 1.38, 0]), 30], [add(H1, [0.32, 1.52, 1.6]), add(H1, [0, 1.42, 0]), 30], k);
      const ha = t < W("S01", 1, "whats the catch");
      const h = hop(t, L11.start, 0.03, 0.3);
      return { mood: "street", cam, sky: true, focus: add(H1, [0, 1.4, 0]), blur: 2.2, node: <>{street(t, cam.pos)}{stranger(t, cam.pos, { armR: [40, 30] }, "stranger", X1)}
        {you(t, H1, cam.pos, "street", { facing: 1, expr: ha ? "laugh" : "smile", prop: "card", headTilt: ha ? -8 : 4 }, { dy: h.dy, sy: h.sy })}</> };
    },
  },
  {
    id: "s01e", from: L21.start - 0.1,
    render: (t, k) => {
      const cam = move([add(X1, [-0.8, 1.15, 1.6]), add(X1, [0, 1.55, 0]), 32], [add(X1, [-0.6, 1.2, 1.25]), add(X1, [0, 1.6, 0]), 30], k);
      const lift = keys(t, [[L21.start, 0], [W("S01", 2, "no phone"), 1], [W("S01", 2, "no light"), 0.4], [W("S01", 2, "no light") + 0.2, 1]]);
      return { mood: "street", cam, sky: true, focus: add(X1, [0, 1.6, 0]), blur: 2.0, node: <>{street(t, cam.pos)}{you(t, H1, cam.pos, "street", { back: true })}{stranger(t, cam.pos, { armR: [20 + 60 * lift, 40], frontR: true, prop: "point" }, "stranger", X1)}</> };
    },
  },
  {
    id: "s01f", from: W("S01", 2, "nothing but") - 0.1,
    render: (t, k) => {
      const cam = move([add(H1, [0.3, 1.3, 3.0]), add(H1, [0, 1.0, 0]), 34], [add(H1, [0.25, 1.35, 2.6]), add(H1, [0, 1.05, 0]), 34], k);
      return { mood: "street", cam, sky: true, focus: add(H1, [0, 1.0, 0]), blur: 1.4, node: <>{street(t, cam.pos)}{stranger(t, cam.pos, {}, "stranger", X1)}
        {you(t, H1, cam.pos, "street", { facing: 0, expr: "nervous", armL: [35, 30], armR: [35, 30], headTilt: 10, look: -0.2 })}</> };
    },
  },
  {
    id: "s01g", from: W("S01", 2, "if you want out"),
    render: (t, k) => {
      const cam = move([add(ST, [0.4, 1.5, 3.7]), add(ST, [0.4, 1.3, 0.1]), 38], [add(ST, [0.4, 1.45, 3.3]), add(ST, [0.4, 1.32, 0.1]), 37], k);
      const up = ramp(t, W("S01", 2, "ring the bell") - 0.2, W("S01", 2, "bell"));
      const tag = ramp(t, W("S01", 2, "you get nothing") - 0.1, W("S01", 2, "you get nothing") + 0.15);
      return { mood: "street", cam, sky: true, focus: add(ST, [0.4, 1.3, 0]), blur: 1.0, node: <>{street(t, cam.pos)}{you(t, H1, cam.pos, "street", { facing: 1, expr: "neutral", prop: "card" })}
        {stranger(t, cam.pos, { armR: [40 + 120 * up, 20 - 10 * up], frontR: true, prop: "point" }, "stranger", X1)}</>,
        over: <Tag a={tag} text="RING THE BELL = $0" x={1420} y={200} col="#ff5a4a" size={72} /> };
    },
  },
  {
    id: "s01h", from: L31.start - 0.1,
    render: (t, k) => {
      const cam = move([add(H1, [0.28, 1.56, 1.35]), add(H1, [0.05, 1.45, 0]), 30], [add(H1, [0.24, 1.55, 1.1]), add(H1, [0.05, 1.47, 0]), 28], k);
      return { mood: "street", cam, sky: true, focus: add(H1, [0, 1.45, 0]), blur: 2.6, node: <>{street(t, cam.pos)}{you(t, H1, cam.pos, "street", { facing: 0, expr: "shock", prop: "card", headTilt: 6 })}</> };
    },
  },
  {
    id: "s01i", from: W("S01", 3, "okay okay") - 0.1,
    render: (t, k) => {
      const c0 = move([add(H1, [0.9, 1.5, 3.3]), add(H1, [-0.4, 1.3, -0.4]), 36], [add(H1, [0.75, 1.5, 2.8]), add(H1, [-0.35, 1.32, -0.4]), 35], k);
      const cam = shake(c0, t, HIT - 0.05, 0.08, 0.2);
      const hand = ramp(t, W("S01", 3, "deal"), W("S01", 3, "deal") + 0.3);
      return { mood: "street", cam, sky: true, focus: add(H1, [0, 1.3, 0]), blur: 1.2, node: <>{street(t, cam.pos)}{stranger(t, cam.pos, { armR: [30 + 40 * hand, 20], frontR: true }, "stranger", X1)}
        {you(t, H1, cam.pos, "street", { facing: 1, expr: "grin", armR: [30 + 50 * hand, 10], frontR: true })}{second(t, cam.pos)}</> };
    },
  },
  {
    id: "s01j", from: HIT,
    render: (t) => {
      const cam = move([add(ST, [0, 1.6, 6]), add(ST, [0, 1.4, 0]), 40], null, 0);
      const a = ramp(t, HIT + 0.35, HIT + 0.75) * (1 - ramp(t, 19.0, 19.5));
      return { mood: "street", cam, node: null, over: <Title a={a} pre="30 DAYS IN THE" hi="DEEPEST" post="CAVE" /> };
    },
  },
];

// ================================================================== S02: day 1, total darkness
const L12 = line("S02", 1), L22 = line("S02", 2), L32 = line("S02", 3), L52 = line("S02", 5), L62 = line("S02", 6);
const hall0 = (t: number, cam: V3, o: { rope?: number } = {}) => <Hall t={t} waterLit={0} log={-1} cam={cam} rope={o.rope} />;
const BUMP = W("S02", 4, "ow");
const s02: Shot[] = [
  {
    id: "s02a", from: 19.52,
    render: (t, k) => {
      const cam = move([add(WAKE, [0.05, 1.25, 0.35]), WAKE, 52], [add(WAKE, [0.05, 1.15, 0.3]), WAKE, 48], k);
      const eyes = t < 21.3 ? "dazed" : t < W("S02", 0, "gone blind") ? "neutral" : "shock";
      return { mood: "void", cam, focus: WAKE, blur: 0.8, exposure: -2.5 * (1 - ramp(t, 19.6, 21.8)), node: <>{hall0(t, cam.pos)}{you(t, WAKE, cam.pos, "void", { expr: eyes, blink: t < 20.6 }, { lie: 0.25 })}</>, };
    },
  },
  {
    id: "s02b", from: L12.start - 0.35,
    render: (t, k) => {
      const cam = move([add(WAKE, [0.3, 0.8, 2.4]), add(WAKE, [0, 0.75, 0]), 38], [add(WAKE, [0.25, 0.8, 2.1]), add(WAKE, [0, 0.78, 0]), 38], k);
      const h1 = W("S02", 1, "hello"), h2 = W("S02", 1, "hello", 1);
      return { mood: "void", cam, focus: add(WAKE, [0, 0.8, 0]), blur: 1.0, node: <>{hall0(t, cam.pos)}
        {you(t, WAKE, cam.pos, "void", { mode: "sit", expr: t > h2 ? "shock" : "nervous", armL: [150, 120], armR: [150, 120], frontL: true, frontR: true, facing: t > h2 ? 1 : -1 })}
        <Echo p={add(WAKE, [0, 0.95, 0.15])} t={t} t0={h1} r={2.2} /><Echo p={add(WAKE, [0, 0.95, 0.15])} t={t} t0={h2} r={3.4} n={4} /></> };
    },
  },
  {
    id: "s02c", from: L22.start - 0.1,
    render: (t, k) => {
      const cam = move([add(WAKE, [0.08, 1.0, 1.2]), add(WAKE, [0, 0.95, 0]), 34], [add(WAKE, [0.06, 1.0, 1.0]), add(WAKE, [0, 0.97, 0]), 32], k);
      const wave = ramp(t, W("S02", 2, "wave"), W("S02", 2, "wave") + 0.3) * (1 - ramp(t, W("S02", 2, "nothing") + 0.3, W("S02", 2, "nothing") + 0.7));
      return { mood: "void", cam, focus: add(WAKE, [0, 0.95, 0]), blur: 2.0, node: <>{hall0(t, cam.pos)}
        {you(t, WAKE, cam.pos, "void", { mode: "sit", expr: "shock", armR: [120 + 35 * Math.sin(t * 9) * wave, 70], frontR: true, look: 0.4 * Math.sin(t * 2) })}</> };
    },
  },
  {
    id: "s02d", from: W("S02", 2, "your eyes") - 0.1,
    render: (t, k) => {
      const cam = move([add(WAKE, [0.04, 0.98, 0.75]), add(WAKE, [0, 0.98, 0]), 30], [add(WAKE, [0.03, 0.98, 0.55]), add(WAKE, [0, 0.98, 0]), 28], k);
      const lk = n1(t * 1.6, 3);
      return { mood: "void", cam, focus: add(WAKE, [0, 0.98, 0]), blur: 2.6, node: <>{hall0(t, cam.pos)}{you(t, WAKE, cam.pos, "void", { mode: "sit", expr: "shock", look: lk, facing: lk > 0.5 ? 1 : lk < -0.5 ? -1 : 0 }, { res: 2 })}</> };
    },
  },
  {
    id: "s02e", from: L32.start - 0.1,
    render: (t, k) => {
      const cam = shake(move([add(WAKE, [2.6, 1.25, 1.2]), add(WAKE, [0, 1.25, 0]), 40], [add(WAKE, [2.4, 1.25, 1.0]), add(WAKE, [0, 1.3, 0]), 40], k), t, BUMP, 0.05, 0.4);
      const up = ramp(t, W("S02", 3, "you dont know"), BUMP);
      const h = hop(t, BUMP, -0.12, 0.35);
      const sit = up < 0.35;
      return { mood: "void", cam, focus: add(WAKE, [0, 1.2, 0]), blur: 0.9, node: <>{hall0(t, cam.pos)}
        {you(t, WAKE, cam.pos, "void", { mode: sit ? "sit" : "stand", expr: t > BUMP ? "pained" : "nervous", facing: 1, ...(t > BUMP ? { armR: [165, 70] as [number, number], frontR: true } : {}) }, { sy: (sit ? 1 : 0.85 + 0.15 * up) * h.sy, dy: h.dy })}
        <Echo p={add(WAKE, [0, 1.62, 0])} t={t} t0={BUMP} r={2.6} n={4} flat col="#d0e2ff" /></> };
    },
  },
  {
    id: "s02f", from: W("S02", 4, "ceiling") - 0.1,
    render: (t, k) => {
      const cam = move([add(WAKE, [0.5, 1.2, 2.1]), add(WAKE, [0, 1.3, 0]), 36], [add(WAKE, [0.4, 1.2, 1.8]), add(WAKE, [0, 1.35, 0]), 36], k);
      const pat = Math.max(0, Math.sin(t * 7));
      return { mood: "void", cam, focus: add(WAKE, [0, 1.3, 0]), blur: 1.3, node: <>{hall0(t, cam.pos)}
        {you(t, WAKE, cam.pos, "void", { expr: t < W("S02", 4, "got it") ? "nervous" : "neutral", armL: [165 - 12 * pat, 5], frontL: false, armR: [150, 80], frontR: true }, { sy: 0.86 })}
        <Echo p={add(WAKE, [-0.25, 1.6, 0])} t={t} t0={W("S02", 4, "low ceiling")} r={1.2} flat /></> };
    },
  },
  {
    id: "s02g", from: L52.start - 0.1,
    render: (t, k) => {
      const cam = move([[-2.9, 0.7, 2.4], [-3.7, 0.35, -0.6], 40], [[-3.4, 0.7, 2.2], [-4.1, 0.35, -0.9], 40], k);
      const p = lerp3(add(WAKE, [-0.2, 0, -0.1]), add(ROPE, [0.6, 0, 0.5]), ramp(t, L52.start, W("S02", 5, "your hand finds")));
      const c = crawl(t, -1);
      return { mood: "void", cam, focus: p, blur: 1.0, node: <>{hall0(t, cam.pos)}{you(t, p, cam.pos, "void", { ...c.f, expr: "nervous" }, { roll: c.roll, dy: c.dy })}
        {[0, 1, 2, 3].map((i) => <Echo key={i} p={add(p, [0, 0.02, 0])} t={t} t0={L52.start + i * 0.8} r={0.7} n={1} flat d={0.9} />)}</> };
    },
  },
  {
    id: "s02h", from: W("S02", 5, "your hand finds") - 0.1,
    render: (t, k) => {
      const cam = move([add(ROPE, [0.9, 0.62, 1.25]), add(ROPE, [0.1, 0.5, 0]), 34], [add(ROPE, [0.75, 0.62, 1.05]), add(ROPE, [0.1, 0.52, 0]), 32], k);
      const reach = ramp(t, W("S02", 5, "your hand finds"), W("S02", 5, "rope"));
      return { mood: "void", cam, focus: add(ROPE, [0, 0.5, 0]), blur: 1.8, node: <>{hall0(t, cam.pos, { rope: reach })}
        {you(t, add(ROPE, [0.45, 0, 0.25]), cam.pos, "void", { mode: "sit", expr: reach > 0.9 ? "shock" : "nervous", facing: -1, armL: [60 + 70 * reach, 20], frontL: true })}
        <Echo p={add(ROPE, [0, 0.55, 0])} t={t} t0={W("S02", 5, "rope")} r={0.9} n={3} flat /></> };
    },
  },
  {
    id: "s02i", from: W("S02", 5, "hanging from"),
    render: (t, k) => {
      const top = hallCeil(ROPE[0], ROPE[2]);
      const cam = move([add(ROPE, [0.7, 0.9, 1.1]), add(ROPE, [0, 0.9, 0]), 40], [add(ROPE, [0.8, 0.9, 1.3]), add(ROPE, [0, top, 0]), 44], k);
      return { mood: "void", cam, focus: add(ROPE, [0, 2.5, 0]), blur: 0.6, exposure: 0.2, node: <>{hall0(t, cam.pos, { rope: 0.6 })}{you(t, add(ROPE, [0.45, 0, 0.25]), cam.pos, "void", { mode: "sit", expr: "shock", facing: -1, armL: [130, 20], frontL: true, headTilt: -10 })}
        <Echo p={add(ROPE, [0, top - 0.6, 0])} t={t} t0={W("S02", 5, "far above")} r={0.9} n={2} flat /></> };
    },
  },
  {
    id: "s02j", from: W("S02", 5, "when you pull") - 0.1,
    render: (t, k) => {
      const cam = move([add(ROPE, [0.5, 1.4, 1.8]), add(ROPE, [0.2, 1.4, 0]), 36], null, k);
      const pull = keys(t, [[W("S02", 5, "pull"), 0], [W("S02", 5, "pull") + 0.3, 1], [W("S02", 5, "a bell") + 0.2, 0.3]]);
      return { mood: "void", cam, focus: add(ROPE, [0, 1.4, 0]), blur: 1.4, node: <>{hall0(t, cam.pos, { rope: pull })}{you(t, add(ROPE, [0.32, 0, 0.12]), cam.pos, "void", { expr: "nervous", facing: -1, armL: [168, 0], frontL: true }, { dy: -0.04 * pull })}</> };
    },
  },
  {
    id: "s02k", from: W("S02", 5, "a bell rings"),
    render: (t, k) => {
      const t0 = W("S02", 5, "a bell rings");
      const cam = move([add(SH, [0.4, 11.2, 1.1]), add(SH, [0, 15.6, 0]), 42], [add(SH, [0.4, 11.6, 1.0]), add(SH, [0, 15.7, 0]), 40], k);
      const sw = 0.35 * Math.sin((t - t0) * 6) * Math.exp(-(t - t0) * 0.8);
      return { mood: "void", cam, focus: add(SH, [0, 15.6, 0]), blur: 0.6, exposure: 0.3, node: <><Shaft t={t} swing={sw} /><Echo p={add(SH, [0, 15.4, 0])} t={t} t0={t0 + 0.1} r={1.4} n={3} flat d={1.2} /></> };
    },
  },
  {
    id: "s02l", from: W("S02", 5, "the way out") - 0.1,
    render: (t, k) => {
      const cam = move([add(ROPE, [0.6, 1.5, 1.4]), add(ROPE, [0.25, 1.5, 0]), 32], [add(ROPE, [0.55, 1.5, 1.25]), add(ROPE, [0.25, 1.52, 0]), 31], k);
      const drop = ramp(t, W("S02", 5, "end of the million") - 0.1, W("S02", 5, "million") + 0.2);
      return { mood: "void", cam, focus: add(ROPE, [0.3, 1.5, 0]), blur: 2.0, node: <>{hall0(t, cam.pos, { rope: 0.4 * (1 - drop) })}
        {you(t, add(ROPE, [0.32, 0, 0.12]), cam.pos, "void", { expr: drop > 0.5 ? "stern" : "nervous", facing: drop > 0.5 ? 0 : -1, armL: [168 - 150 * drop, 0], frontL: true, headTilt: -8 * (1 - drop) })}</>,
        over: <Tag a={ramp(t, W("S02", 5, "the way out"), W("S02", 5, "the way out") + 0.2)} text="EXIT = NO MONEY" x={1420} y={200} col="#ff5a4a" size={66} /> };
    },
  },
  {
    id: "s02m", from: L62.start - 0.2,
    render: (t, k) => {
      const cam = move([add(WAKE, [0, 1, 3]), WAKE, 40], null, k);
      return { mood: "void", cam, node: null, over: <DepthSection a={ramp(t, L62.start - 0.2, L62.start + 0.1)} k={ramp(t, W("S02", 6, "goes down"), WE("S02", 6, "kilometers"))} /> };
    },
  },
];

// ================================================================== S03: cold, silence, direction, water, bats, hunger
const P3: V3 = [-1.4, 0, -1.6];
const L03 = line("S03", 0), L13 = line("S03", 1), L23 = line("S03", 2), L33 = line("S03", 3), L43 = line("S03", 4), L53 = line("S03", 5), L63 = line("S03", 6), L73 = line("S03", 7);
const BANK: V3 = [STREAM_X - 1.05, 0, 0.6];
const AAH = W("S03", 6, "aaah");
const bats = (t: number, cam: V3) => Array.from({ length: 14 }, (_, i) => {
  const x = 1.2 + (i % 7) * 0.55, z = -1.4 + Math.floor(i / 7) * 0.7 + 0.2 * Math.sin(i);
  return <Bat key={i} p={[x, hallCeil(x, z) - 0.08, z]} cam={cam} hang s={3.2} tint="#c8d6ff" />;
});
const loopPath = (u: number): V3 => [-1.4 + 1.9 * Math.sin(u * 5.2), 0, -0.4 + 1.5 * Math.cos(u * 5.2) - 1.0 * u];
const s03: Shot[] = [
  {
    id: "s03a", from: L03.start - 0.3,
    render: (t, k) => {
      const cam = move([add(P3, [0.35, 0.9, 2.3]), add(P3, [0, 0.75, 0]), 38], [add(P3, [0.3, 0.88, 2.0]), add(P3, [0, 0.76, 0]), 37], k);
      const tg = ramp(t, W("S03", 0, "ten degrees") - 0.1, W("S03", 0, "ten degrees") + 0.15) * (1 - ramp(t, W("S03", 0, "every day"), W("S03", 0, "every day") + 0.3));
      return { mood: "void", cam, focus: add(P3, [0, 0.8, 0]), blur: 1.2, exposure: 0.15, node: <>{hall0(t, cam.pos)}<Rock p={add(P3, [0, 0.55, -1.3])} s={[0.9, 0.8, 0.45]} seed={41} amp={0.1} />
        {you(t, add(P3, tremble(t, 0.012)), cam.pos, "void", { mode: "sit", expr: "nervous", armL: [25, 140], armR: [25, 140], frontL: true, frontR: true })}
        <Breath p={add(P3, [0.05, 0.98, 0.05])} t={t} /></>,
        over: <Tag a={tg} text="10°C · ALL YEAR" x={1400} y={210} col="#9ad8ff" /> };
    },
  },
  {
    id: "s03b", from: W("S03", 0, "every day") - 0.1,
    render: (t, k) => {
      const cam = move([add(P3, [0.1, 0.98, 0.95]), add(P3, [0, 0.95, 0]), 32], [add(P3, [0.08, 0.98, 0.8]), add(P3, [0, 0.96, 0]), 30], k);
      return { mood: "void", cam, focus: add(P3, [0, 0.95, 0]), blur: 2.2, exposure: 0.15, node: <>{hall0(t, cam.pos)}<Rock p={add(P3, [0, 0.55, -1.3])} s={[0.9, 0.8, 0.45]} seed={41} amp={0.1} />
        {you(t, add(P3, tremble(t, 0.014)), cam.pos, "void", { mode: "sit", expr: "pained", armL: [25, 140], armR: [25, 140], frontL: true, frontR: true }, { res: 1.8 })}<Breath p={add(P3, [0.05, 0.98, 0.05])} t={t} /></> };
    },
  },
  {
    id: "s03c", from: L13.start - 0.1,
    render: (t, k) => {
      const cam = move([add(P3, [0.05, 0.98, 0.62]), add(P3, [0, 0.96, 0]), 30], [add(P3, [0.04, 0.97, 0.52]), add(P3, [0, 0.96, 0]), 28], k);
      const lk = Math.sin(t * 1.3);
      return { mood: "void", cam, focus: add(P3, [0, 0.96, 0]), blur: 2.8, exposure: 0.15, node: <>{hall0(t, cam.pos)}
        {you(t, P3, cam.pos, "void", { mode: "sit", expr: "nervous", look: lk, armL: [25, 140], armR: [25, 140], frontL: true, frontR: true }, { res: 2 })}
        {t > W("S03", 1, "heartbeat") - 0.2 ? <Beat p={add(P3, [0.0, 0.62, 0.12])} t={t} /> : null}</> };
    },
  },
  {
    id: "s03d", from: W("S03", 1, "then a ringing") - 0.1,
    render: (t, k) => {
      const cam = move([add(P3, [0.2, 0.95, 1.4]), add(P3, [0, 0.9, 0]), 34], [add(P3, [0.15, 0.95, 1.2]), add(P3, [0, 0.92, 0]), 33], k);
      return { mood: "void", cam, focus: add(P3, [0, 0.9, 0]), blur: 1.8, exposure: 0.15, node: <>{hall0(t, cam.pos)}
        {you(t, add(P3, tremble(t, 0.006)), cam.pos, "void", { mode: "sit", expr: "pained", armL: [150, 140], armR: [150, 140], frontL: true, frontR: true })}
        {[0, 1, 2].map((i) => <Echo key={i} p={add(P3, [0, 1.0, 0.1])} t={t} t0={W("S03", 1, "ringing") + i * 0.7} r={0.5} n={2} d={0.7} col="#ffffff" />)}</> };
    },
  },
  {
    id: "s03e", from: L23.start - 0.1,
    render: (t, k) => {
      const cam = move([[1.6, 4.0, 4.2], [-1.4, 0, -0.8], 50], [[1.3, 4.2, 3.9], [-1.4, 0, -0.9], 50], k);
      const u = ramp(t, L23.start, W("S03", 2, "ten minutes")) * 0.95;
      const p = loopPath(u);
      return { mood: "void", cam, focus: p, blur: 0.5, exposure: 0.25, node: <>{hall0(t, cam.pos)}{you(t, p, cam.pos, "void", { mode: "stroll", phase: t * 1.0, expr: "nervous", armL: [70, 20], armR: [70, 20] })}
        {Array.from({ length: 40 }, (_, i) => { const uu = (i / 40) * u; const q = loopPath(uu); return <mesh key={i} position={[q[0], 0.02, q[2]]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.05, 10]} /><meshBasicMaterial color="#8ab0ff" toneMapped={false} /></mesh>; })}
        <mesh position={[WAKE[0], 0.02, WAKE[2]]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.25, 0.32, 24]} /><meshBasicMaterial color="#ffd23a" toneMapped={false} /></mesh></>,
        over: <Tag a={ramp(t, W("S03", 2, "straight line"), W("S03", 2, "straight line") + 0.2)} text="NOBODY WALKS STRAIGHT" x={1380} y={200} col="#9ad8ff" size={60} /> };
    },
  },
  {
    id: "s03f", from: W("S03", 2, "ten minutes") - 0.1,
    render: (t, k) => {
      const p = loopPath(0.95);
      const cam = move([add(p, [0.6, 1.4, 2.2]), add(p, [0, 1.2, 0]), 36], [add(p, [0.5, 1.4, 1.9]), add(p, [0, 1.25, 0]), 35], k);
      const la = lookAround(t, 2, 1.5);
      return { mood: "void", cam, focus: add(p, [0, 1.2, 0]), blur: 1.4, node: <>{hall0(t, cam.pos)}{you(t, p, cam.pos, "void", { expr: "nervous", facing: la.facing, look: la.look, headTilt: la.headTilt, armL: [40, 30], armR: [40, 30] })}</> };
    },
  },
  {
    id: "s03g", from: L33.start - 0.1,
    render: (t, k) => {
      const p: V3 = [0.4, 0, -1.6];
      const cam = move([add(p, [-0.4, 1.3, 2.0]), add(p, [0.6, 1.2, 0]), 38], [add(p, [-0.2, 1.3, 1.8]), add(p, [0.7, 1.2, 0]), 38], k);
      const tip: V3 = [STREAM_X - 1.2, hallCeil(STREAM_X - 1.2, -2.2) - 1.0, -2.2];
      return { mood: "void", cam, focus: add(p, [0, 1.2, 0]), blur: 1.0, node: <>{hall0(t, cam.pos)}{you(t, p, cam.pos, "void", { expr: "nervous", facing: 1, armR: [160, 150], frontR: true, headTilt: 10 })}
        <Drip p={tip} t={t} h={tip[1]} />{[0, 1, 2, 3, 4].map((i) => <Echo key={i} p={[tip[0], 0.03, tip[2]]} t={t} t0={L33.start + 0.55 - 0.37 * 0 + i * 1.3 - ((L33.start) % 1.3)} r={0.6} n={2} flat d={0.8} />)}</> };
    },
  },
  {
    id: "s03h", from: W("S03", 3, "slip in the mud") - 0.1,
    render: (t, k) => {
      const t1 = W("S03", 3, "slip"), t2 = W("S03", 3, "twice");
      const p: V3 = [STREAM_X - 1.6, 0, -0.8];
      const cam = shake(move([add(p, [-0.3, 0.9, 2.4]), add(p, [0, 0.7, 0]), 38], null, k), t, t1 + 0.2, 0.03, 0.3);
      const fall = Math.max(ramp(t, t1, t1 + 0.25) * (1 - ramp(t, t1 + 0.5, t2)), ramp(t, t2 + 0.1, t2 + 0.35));
      return { mood: "void", cam, focus: add(p, [0, 0.7, 0]), blur: 1.2, node: <>{hall0(t, cam.pos)}
        {you(t, p, cam.pos, "void", { mode: fall > 0.5 ? "sit" : "stand", expr: fall > 0.3 ? "shock" : "nervous", armL: [60 + 90 * fall, 20], armR: [60 + 90 * fall, 20] }, { roll: -0.9 * fall })}
        <Echo p={add(p, [0, 0.02, 0])} t={t} t0={t1 + 0.22} r={1} n={2} flat /><Echo p={add(p, [0, 0.02, 0])} t={t} t0={t2 + 0.3} r={1} n={2} flat /></> };
    },
  },
  {
    id: "s03i", from: W("S03", 3, "lick a wet rock") - 0.1,
    render: (t, k) => {
      const r: V3 = [-0.4, 0.75, -3.3], p: V3 = [-0.4, 0, -2.55];
      const cam = move([add(p, [1.5, 1.3, 0.6]), add(p, [-0.2, 1.35, -0.3]), 34], [add(p, [1.3, 1.32, 0.5]), add(p, [-0.2, 1.37, -0.3]), 33], k);
      return { mood: "void", cam, focus: add(p, [0, 1.35, 0]), blur: 1.8, node: <>{hall0(t, cam.pos)}<Rock p={r} s={[0.9, 1.0, 0.6]} seed={43} c="#8a8a88" />
        {you(t, p, cam.pos, "void", { expr: "lick", facing: -1, armL: [100, 20], frontL: false, headTilt: -12 })}
        <Echo p={add(p, [-0.25, 1.45, -0.25])} t={t} t0={W("S03", 3, "lick") + 0.2} r={0.6} n={2} yaw={0.6} /></> };
    },
  },
  {
    id: "s03j", from: L43.start - 0.1,
    render: (t, k) => {
      const cam = move([add(BANK, [-0.9, 0.8, 1.6]), add(BANK, [0.6, 0.35, -0.1]), 38], [add(BANK, [-0.75, 0.78, 1.4]), add(BANK, [0.6, 0.36, -0.1]), 37], k);
      const reach = ramp(t, W("S03", 4, "water"), W("S03", 4, "please"));
      return { mood: "void", cam, focus: add(BANK, [0.4, 0.4, 0]), blur: 1.4, exposure: 0.15, node: <><Hall t={t} waterLit={0.35} log={-1} cam={cam.pos} />
        {you(t, BANK, cam.pos, "void", { mode: "sit", expr: reach > 0.5 ? "relief" : "nervous", facing: 1, armR: [60 + 40 * reach, 20], frontR: true })}
        <Echo p={[STREAM_X - 0.55, -0.18, BANK[2]]} t={t} t0={W("S03", 4, "please") + 0.1} r={0.8} n={3} flat /></> };
    },
  },
  {
    id: "s03k", from: L53.start - 0.1,
    render: (t, k) => {
      const cam = move([add(BANK, [0.6, 0.95, 1.3]), add(BANK, [0, 0.95, 0]), 32], [add(BANK, [0.5, 0.95, 1.1]), add(BANK, [0, 0.96, 0]), 30], k);
      const sip = ramp(t, L53.start, L53.start + 0.4);
      return { mood: "void", cam, focus: add(BANK, [0, 0.95, 0]), blur: 2.2, exposure: 0.15, node: <><Hall t={t} waterLit={0.35} log={-1} cam={cam.pos} />
        {you(t, BANK, cam.pos, "void", { mode: "sit", expr: t > W("S03", 5, "hurts") - 0.2 ? "pained" : "relief", armL: [40 + 100 * sip, 150 * sip], armR: [40 + 100 * sip, 150 * sip], frontL: true, frontR: true })}</> };
    },
  },
  {
    id: "s03l", from: W("S03", 5, "and then the cave") - 0.1,
    render: (t, k) => {
      const cam = move([add(BANK, [-0.4, 0.5, 0.9]), [2.6, 4.6, -1.0], 22], [add(BANK, [-0.45, 0.5, 0.95]), [2.6, 4.7, -1.0], 26], k);
      const rustle = t > W("S03", 5, "answers") ? Math.sin(t * 30) * 0.08 : 0;
      return { mood: "void", cam, focus: [2.2, 4.4, -1], blur: 0.8, exposure: 0.25, node: <><Hall t={t} waterLit={0.35} log={-1} cam={cam.pos} />{you(t, BANK, cam.pos, "void", { mode: "sit", back: true })}
        {bats(t, cam.pos).map((b, i) => <group key={i} rotation={[0, 0, i % 3 === 0 ? rustle : 0]}>{b}</group>)}</> };
    },
  },
  {
    id: "s03m", from: L63.start - 0.1,
    render: (t, k) => {
      const c0 = move([add(BANK, [0.2, 0.85, 1.8]), add(BANK, [0, 0.8, 0]), 36], null, k);
      const cam = shake(c0, t, AAH, 0.06, 0.6);
      const la = lookAround(t, 4, 1.8);
      const fall = ramp(t, AAH + 0.05, AAH + 0.35);
      return { mood: "void", cam, focus: add(BANK, [0, 0.8, 0]), blur: 1.0, exposure: 0.15, node: <><Hall t={t} waterLit={0.35} log={-1} cam={cam.pos} />
        {you(t, add(BANK, [0.5 * fall, -0.15 * fall, 0]), cam.pos, "void", { mode: "sit", expr: t > AAH ? "shock" : "nervous", facing: t > AAH ? 0 : la.facing, look: la.look, armL: [100 + 60 * fall, 30], armR: [100 + 60 * fall, 30] }, { roll: -0.5 * fall })}
        <BatSwarm t={t} t0={AAH - 0.2} from={[2.6, 4.2, -1.5]} to={add(c0.pos, [0, 0.3, 1.5])} cam={cam.pos} n={50} tint="#c8d6ff" spread={0.8} /></> };
    },
  },
  {
    id: "s03n", from: L73.start - 0.15,
    render: (t, k) => {
      const cam = move([[-4.5, 1.0, 4.6], [1.5, 3.2, -2.0], 46], [[-4.3, 1.05, 4.3], [0.0, 3.6, -2.4], 46], k);
      return { mood: "void", cam, focus: [0, 3, -2], blur: 0.4, exposure: 0.3, node: <><Hall t={t} waterLit={0.35} log={-1} cam={cam.pos} />
        <BatSwarm loop t={t} t0={L73.start - 1.2} from={[2.6, 4.2, -1.5]} to={[ROPE[0], hallCeil(ROPE[0], ROPE[2]), ROPE[2]]} cam={cam.pos} n={120} tint="#c8d6ff" spread={1.6} /></>,
        over: <Tag a={ramp(t, W("S03", 7, "thousands"), W("S03", 7, "thousands") + 0.2) * (1 - ramp(t, W("S03", 7, "and problem six") - 0.3, W("S03", 7, "and problem six")))} text="THOUSANDS" x={1400} y={200} col="#9ad8ff" /> };
    },
  },
  {
    id: "s03o", from: W("S03", 7, "and problem six") - 0.1,
    render: (t, k) => {
      const p = add(BANK, [0.55, -0.15, 0.1]);
      const cam = move([add(p, [-0.2, 0.9, 1.6]), add(p, [0, 0.8, 0]), 34], [add(p, [-0.15, 0.88, 1.35]), add(p, [0, 0.8, 0]), 33], k);
      const growl = Math.max(0, Math.sin((t - W("S03", 7, "starving")) * 9)) * ramp(t, W("S03", 7, "starving"), W("S03", 7, "starving") + 0.1);
      return { mood: "void", cam, focus: add(p, [0, 0.8, 0]), blur: 1.8, exposure: 0.15, node: <><Hall t={t} waterLit={0.35} log={-1} cam={cam.pos} />
        {you(t, add(p, tremble(t, 0.008)), cam.pos, "void", { mode: "sit", expr: "nervous", armL: [20, 110], frontL: true, armR: [30, 20] }, { sy: 1 - 0.03 * growl })}
        <Echo p={add(p, [0, 0.55, 0.12])} t={t} t0={W("S03", 7, "starving") + 0.05} r={0.35} n={3} d={0.6} col="#ffd890" /></> };
    },
  },
];

// ================================================================== S04: day 3, foxfire
const L04 = line("S04", 0), L14 = line("S04", 1), L24 = line("S04", 2), L34 = line("S04", 3);
const P4: V3 = [-2.4, 0, -0.9];
const NEAR_LOG: V3 = add(LOG, [-0.85, 0, 0.55]);
const s04: Shot[] = [
  {
    id: "s04a", from: L04.start - 0.6, enter: { kind: "black", d: 0.8 },
    render: (t, k) => {
      const cam = move([[-2.9, 1.0, -2.4], add(LOG, [0, 0.3, 0]), 36], [[-2.8, 1.0, -2.2], add(LOG, [0, 0.3, 0]), 32], k);
      return { mood: "void", cam, focus: LOG, blur: 1.0, node: <><Hall t={t} waterLit={0.2} log={0.75} cam={cam.pos} />{you(t, P4, cam.pos, "void", { mode: "sit", back: true })}</> };
    },
  },
  {
    id: "s04b", from: W("S04", 0, "glowing") - 0.2,
    render: (t, k) => {
      const t0 = W("S04", 0, "glowing");
      const p = lerp3(P4, NEAR_LOG, ramp(t, t0 + 0.2, L14.start + 0.2));
      const cam = move([add(p, [1.5, 0.75, -0.7]), add(p, [0, 0.4, 0]), 40], null, 0);
      const c = crawl(t, 1);
      return { mood: "void", cam, focus: p, blur: 1.0, node: <><Hall t={t} waterLit={0.25} log={0.55} cam={cam.pos} />{you(t, p, cam.pos, "void", { ...c.f, expr: "shock" }, { roll: c.roll, dy: c.dy, tint: "#7a8ab0" })}</> };
    },
  },
  {
    id: "s04c", from: L14.start + 0.2,
    render: (t, k) => {
      const cam = move([add(LOG, [-0.4, 0.55, 1.25]), add(LOG, [0.1, 0.3, 0]), 34], [add(LOG, [-0.3, 0.5, 1.05]), add(LOG, [0.1, 0.3, 0]), 32], k);
      return { mood: "fox", cam, focus: add(LOG, [0, 0.3, 0]), blur: 2.0, exposure: -0.35, node: <><Hall t={t} waterLit={0.4} log={1} cam={cam.pos} />{you(t, NEAR_LOG, cam.pos, "fox", { mode: "sit", expr: "shock", facing: 1, armR: [70, 30], frontR: true })}</> };
    },
  },
  {
    id: "s04d", from: W("S04", 1, "people used to") - 0.1,
    render: (t, k) => {
      const cam = move([add(NEAR_LOG, [0.55, 0.85, 1.1]), add(NEAR_LOG, [0, 0.95, 0]), 32], [add(NEAR_LOG, [0.48, 0.85, 0.95]), add(NEAR_LOG, [0, 0.96, 0]), 30], k);
      return { mood: "fox", cam, focus: add(NEAR_LOG, [0, 0.95, 0]), blur: 2.4, exposure: -0.2, node: <><Hall t={t} waterLit={0.4} log={1} cam={cam.pos} />{you(t, NEAR_LOG, cam.pos, "fox", { mode: "sit", expr: "shock", facing: 1, look: 0.6 }, { res: 1.8 })}</>,
        over: <Tag a={ramp(t, W("S04", 1, "foxfire") - 0.1, W("S04", 1, "foxfire") + 0.15)} text="FOXFIRE" x={1380} y={220} col="#7affc8" size={96} /> };
    },
  },
  {
    id: "s04e", from: L24.start - 0.1,
    render: (t, k) => {
      const p = add(NEAR_LOG, [-0.2, 0, 0.3]);
      const cam = move([add(p, [0.3, 0.7, 2.6]), add(p, [0, 1.35, 0]), 40], [add(p, [0.25, 0.65, 2.3]), add(p, [0, 1.4, 0]), 40], k);
      const t1 = W("S04", 2, "light", 1);
      const h = hop(t, t1, 0.2, 0.45);
      const up = ramp(t, L24.start, t1);
      const hand = add(p, [0.32, 1.25 + 0.75 * up + h.dy, 0.1]);
      return { mood: "fox", cam, focus: add(p, [0, 1.3, 0]), blur: 1.2, exposure: -0.1, node: <><Hall t={t} waterLit={0.45} log={0.85} cam={cam.pos} />
        {you(t, p, cam.pos, "fox", { expr: t > t1 ? "laugh" : "grin", armR: [70 + 95 * up, 10], frontR: true, prop: "shroom" }, { dy: h.dy, sy: h.sy })}
        <pointLight position={hand} color="#5affb8" intensity={3} distance={6} decay={1.6} /></> };
    },
  },
  {
    id: "s04f", from: W("S04", 2, "i love you") - 0.1,
    render: (t, k) => {
      const p = add(NEAR_LOG, [-0.2, 0, 0.3]);
      const cam = move([add(p, [0.15, 1.45, 1.15]), add(p, [0, 1.35, 0]), 32], [add(p, [0.12, 1.45, 1.0]), add(p, [0, 1.37, 0]), 30], k);
      return { mood: "fox", cam, focus: add(p, [0, 1.35, 0]), blur: 2.4, node: <><Hall t={t} waterLit={0.45} log={0.85} cam={cam.pos} />
        {you(t, p, cam.pos, "fox", { expr: "relief", prop: "shroom", headTilt: 12 * Math.sin(t * 2.5) }, { res: 1.8 })}<pointLight position={add(p, [0.1, 1.1, 0.3])} color="#5affb8" intensity={2.5} distance={4} decay={1.6} /></> };
    },
  },
  {
    id: "s04g", from: L34.start - 0.1,
    render: (t, k) => {
      const p = add(NEAR_LOG, [-0.2, 0, 0.3]);
      const cam = move([add(p, [0.1, 1.15, 0.75]), add(p, [0.05, 1.0, 0]), 34], [add(p, [0.1, 1.2, 0.7]), add(p, [0.05, 1.05, 0]), 34], k);
      return { mood: "fox", cam, focus: add(p, [0.05, 1.0, 0]), blur: 2.6, exposure: -0.15, node: <><Hall t={t} waterLit={0.45} log={0.85} cam={cam.pos} />
        {you(t, p, cam.pos, "fox", { expr: "shock", prop: "shroom", headTilt: 14 }, { res: 2 })}<pointLight position={add(p, [0.1, 1.1, 0.3])} color="#5affb8" intensity={2.5} distance={4} decay={1.6} /></> };
    },
  },
  {
    id: "s04h", from: W("S04", 3, "for the first time") - 0.1,
    render: (t, k) => {
      const p = add(NEAR_LOG, [-0.2, 0, 0.3]);
      const cam = move([add(p, [0.6, 1.4, 1.6]), add(p, [0, 1.2, 0]), 40], [[-5.6, 3.6, 5.2], [1.5, 1.6, -1.5], 56], ramp(k, 0.05, 0.85));
      return { mood: "fox", cam, focus: p, blur: 0.5, exposure: 0.1 * k, node: <><Hall t={t} waterLit={0.6} log={0.85} cam={cam.pos} />
        {you(t, p, cam.pos, "fox", { expr: "shock", prop: "shroom", facing: 0, look: -0.4 })}<pointLight position={add(p, [0.1, 1.2, 0.3])} color="#5affb8" intensity={3} distance={6} decay={1.6} />
        <Fish p={[STREAM_X + 0.2, -0.16, 2.2]} cam={cam.pos} s={1.2} wig={Math.sin(t * 6)} /></> };
    },
  },
];

export const C1_SHOTS: Shot[] = [...s01, ...s02, ...s03, ...s04];
export const hud1 = (t: number): Hud => {
  if (t < 19.52 || t > L34.end + 0.8) return null;
  const P: [number, number][] = [[1, W("S02", 3, "problem number")], [2, W("S03", 0, "problem two")], [3, W("S03", 1, "problem three")], [4, W("S03", 2, "problem four")], [5, W("S03", 3, "problem five")], [6, W("S03", 7, "problem six")]];
  let prob: [number, number] | undefined;
  for (const p of P) if (t >= p[1] - 0.05) prob = p;
  return { day: t < L04.start - 0.6 ? "1" : "3", prob };
};
void WE;
