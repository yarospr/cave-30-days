// S05 time + marks + the cricket · S06 blind fish, the hoodie net, the cut palm · S07 nothing dries, the dry chamber,
// the prisoner's cinema · S08 the backpack, the diary, the rope: "Not today."  Light: foxfire (green) throughout.
import type { V3 } from "../../inkbeat/types";
import { boxG, coreMat, cylG, M } from "../../inkbeat/core/kit";
import { hop, keys, lookAround, n1, tremble } from "../../med/act";
import { Cricket, Fish } from "../creatures";
import { Clipping, Diary, Drip, Echo, Tag } from "../fx";
import { move, shake } from "../film";
import type { Hud, Shot } from "../film";
import { Backpack, D, Den, Hall, LOG, Marks, PACK, Rock, ROPE, STREAM_X } from "../sets";
import { line, ramp, W } from "../time";
import { you } from "./c1";
import * as THREE from "three";

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const CAMP: V3 = add(LOG, [-0.85, 0, 0.55]);
const MR: V3 = [-0.9, 0.85, 4.55];
const MARK_P: V3 = [-0.9, 1.0, 4.06];
const MARK_STAND: V3 = [-0.9, 0, 3.45];
/** the hall at foxfire time: the log glowing, the marks rock */
const hall = (t: number, cam: V3, marks = 3, o: { water?: number; pack?: boolean } = {}) => (
  <><Hall t={t} waterLit={o.water ?? 0.7} log={0.85} cam={cam} pack={o.pack ?? true} />
    <Rock p={MR} s={[1.25, 1.05, 0.42]} seed={51} amp={0.06} c="#8a7c6e" r={[0, 0, 0]} />
    {marks > 0 ? <Marks p={MARK_P} n={marks} yaw={Math.PI} /> : null}</>
);
/** a glowing chunk light near the hero's hands */
const chunk = (p: V3, k = 2.4) => <pointLight position={add(p, [0.15, 1.0, 0.35])} color="#5affb8" intensity={k} distance={5} decay={1.6} />;

// ================================================================== S05
const L05 = line("S05", 0), L15 = line("S05", 1), L25 = line("S05", 2), L35 = line("S05", 3), L45 = line("S05", 4), L55 = line("S05", 5);
const SCR = W("S05", 2, "scratch");
const P8 = W("S05", 2, "problem eight");
const s05: Shot[] = [
  {
    id: "s05a", from: L05.start - 0.3,
    render: (t, k) => {
      const cam = move([add(CAMP, [0.9, 0.8, 1.9]), add(CAMP, [0, 0.9, 0]), 38], [add(CAMP, [0.75, 0.75, 1.6]), add(CAMP, [0, 1.0, 0]), 38], k);
      return { mood: "fox", cam, focus: add(CAMP, [0, 0.9, 0]), blur: 1.4, node: <>{hall(t, cam.pos)}{you(t, CAMP, cam.pos, "fox", { mode: "sit", expr: "nervous", headTilt: -14, look: 0.3, prop: "shroom" })}{chunk(CAMP)}</> };
    },
  },
  {
    id: "s05b", from: W("S05", 0, "you sleep") - 0.1,
    render: (t, k) => {
      const wake = W("S05", 0, "wake up");
      const cam = move([add(CAMP, [0.1, 1.9, 0.6]), add(CAMP, [0, 0, 0]), 46], [add(CAMP, [0.1, 1.7, 0.5]), add(CAMP, [0, 0, 0]), 46], k);
      const up = t > wake;
      return { mood: "fox", cam, focus: CAMP, blur: 1.0, node: <>{hall(t, cam.pos)}
        {up ? you(t, CAMP, cam.pos, "fox", { mode: "sit", expr: "dazed" }) : you(t, CAMP, cam.pos, "fox", { expr: "neutral", blink: true }, { lie: 0.4 })}{chunk(CAMP, 1.6)}</> };
    },
  },
  {
    id: "s05c", from: W("S05", 0, "no idea") - 0.1,
    render: (t, k) => {
      const cam = move([add(CAMP, [0.15, 1.0, 0.95]), add(CAMP, [0, 0.95, 0]), 32], [add(CAMP, [0.12, 1.0, 0.8]), add(CAMP, [0, 0.96, 0]), 30], k);
      const la = lookAround(t, 1, 1.2);
      return { mood: "fox", cam, focus: add(CAMP, [0, 0.95, 0]), blur: 2.2, node: <>{hall(t, cam.pos)}{you(t, CAMP, cam.pos, "fox", { mode: "sit", expr: "nervous", facing: la.facing, look: la.look, prop: "shroom" }, { res: 1.8 })}{chunk(CAMP, 1.6)}</>,
        over: <Tag a={ramp(t, W("S05", 0, "two hours") - 0.1, W("S05", 0, "two hours") + 0.15)} text="2 HOURS? 20?" x={1420} y={210} col="#7affc8" /> };
    },
  },
  {
    id: "s05d", from: L15.start - 0.1,
    render: (t, k) => {
      const cam = move([add(CAMP, [1.4, 1.2, 2.4]), add(CAMP, [0, 0.8, 0]), 40], null, k);
      return { mood: "fox", cam, focus: CAMP, blur: 3, exposure: -0.4, node: <>{hall(t, cam.pos)}{you(t, CAMP, cam.pos, "fox", { mode: "sit", expr: "neutral", prop: "shroom" })}</>,
        over: <Clipping a={ramp(t, L15.start - 0.1, L15.start + 0.25)} k={k} /> };
    },
  },
  {
    id: "s05d2", from: W("S05", 1, "when they came") - 0.1,
    render: (t, k) => {
      const cam = move([add(CAMP, [0.2, 1.0, 1.15]), add(CAMP, [0, 0.9, 0]), 34], [add(CAMP, [0.15, 1.0, 0.95]), add(CAMP, [0, 0.92, 0]), 32], k);
      const cnt = Math.floor((t - W("S05", 1, "when they came")) * 2.2) % 2;
      return { mood: "fox", cam, focus: add(CAMP, [0, 0.9, 0]), blur: 2.2, node: <>{hall(t, cam.pos)}{you(t, CAMP, cam.pos, "fox", { mode: "sit", expr: t > W("S05", 1, "almost a month") ? "shock" : "nervous", armR: [110 + 12 * cnt, 70], frontR: true, look: 0.4 })}{chunk(CAMP, 1.8)}</>,
        over: <Tag a={ramp(t, W("S05", 1, "almost a month") - 0.1, W("S05", 1, "almost a month") + 0.15)} text="OFF BY A WHOLE MONTH" x={1380} y={210} col="#ffd23a" size={68} /> };
    },
  },
  {
    id: "s05e", from: L25.start - 0.1,
    render: (t, k) => {
      const cam = move([[0.5, 1.35, 2.3], add(MARK_P, [-0.1, -0.15, 0]), 40], [[0.4, 1.33, 2.45], add(MARK_P, [-0.1, -0.12, 0]), 38], k);
      const scr = t > SCR - 0.2 && t < P8 - 0.3 ? Math.sin(t * 9) : 0;
      return { mood: "fox", cam, focus: MARK_P, blur: 1.6, node: <>{hall(t, cam.pos, t > SCR + 0.4 ? 4 : 3)}
        {you(t, MARK_STAND, cam.pos, "fox", { back: true, armR: [120 + 12 * scr, 30], frontR: true })}{chunk(MARK_STAND, 1.8)}</> };
    },
  },
  {
    id: "s05f", from: P8 - 0.1,
    render: (t, k) => {
      const cam = move([add(MARK_STAND, [0.5, 1.45, -1.25]), add(MARK_STAND, [0, 1.45, 0]), 34], null, k);
      const cr = lerp3(add(MR, [0.5, 0.6, -0.4]), add(MARK_STAND, [0.02, 1.48, -0.18]), ramp(t, P8 + 0.3, L35.start));
      return { mood: "fox", cam, focus: add(MARK_STAND, [0, 1.45, 0]), blur: 1.8, node: <>{hall(t, cam.pos, 4)}
        {you(t, MARK_STAND, cam.pos, "fox", { expr: t > L35.start - 0.15 ? "shock" : "neutral", facing: 0 })}<Cricket p={cr} cam={cam.pos} s={2.2} kick={ramp(t, P8 + 0.3, P8 + 0.5)} />{chunk(MARK_STAND, 1.8)}</> };
    },
  },
  {
    id: "s05g", from: L35.start - 0.05,
    render: (t, k) => {
      const c0 = move([add(MARK_STAND, [0.35, 1.45, -1.6]), add(MARK_STAND, [0, 1.3, 0]), 36], null, k);
      const cam = shake(c0, t, L35.start, 0.04, 0.5);
      const flail = Math.sin(t * 11);
      const h = hop(t, L35.start, 0.12, 0.35);
      const off = ramp(t, W("S05", 3, "my face") - 0.1, L35.end + 0.1);
      const cr = lerp3(add(MARK_STAND, [0.02, 1.5, -0.2]), add(MARK_STAND, [1.0, 0.1, -0.6]), off);
      return { mood: "fox", cam, focus: add(MARK_STAND, [0, 1.3, 0]), blur: 1.4, node: <>{hall(t, cam.pos, 4)}
        {you(t, MARK_STAND, cam.pos, "fox", { expr: "shock", armL: [150 + 20 * flail, 60], armR: [150 - 20 * flail, 60], frontL: true, frontR: true }, { dy: h.dy, sy: h.sy })}
        <Cricket p={cr} cam={cam.pos} s={2.2} kick={0.5 + 0.5 * flail} />{chunk(MARK_STAND, 1.8)}</> };
    },
  },
  {
    id: "s05h", from: L45.start - 0.1,
    render: (t, k) => {
      const cp = add(MARK_STAND, [1.0, 0, -0.6]);
      const cam = move([add(cp, [0.35, 0.12, 0.35]), add(cp, [0, 0.06, 0]), 34], [add(cp, [0.3, 0.1, 0.3]), add(cp, [0, 0.06, 0]), 32], k);
      return { mood: "fox", cam, focus: cp, blur: 3, exposure: 0.1, node: <>{hall(t, cam.pos, 4)}<Cricket p={cp} cam={cam.pos} s={2.4} kick={Math.max(0, Math.sin(t * 3)) ** 8} />{chunk(add(cp, [0, -0.6, 0]), 1.6)}</>,
        over: <Tag a={ramp(t, W("S05", 4, "cave cricket"), W("S05", 4, "cave cricket") + 0.2)} text="CAVE CRICKET" x={1400} y={210} col="#7affc8" /> };
    },
  },
  {
    id: "s05i", from: W("S05", 4, "which is a") - 0.1,
    render: (t, k) => {
      const cam = move([add(CAMP, [0.25, 1.4, 1.5]), add(CAMP, [0, 1.35, 0]), 32], [add(CAMP, [0.2, 1.4, 1.2]), add(CAMP, [0, 1.38, 0]), 30], k);
      return { mood: "fox", cam, focus: add(CAMP, [0, 1.35, 0]), blur: 2.2, node: <>{hall(t, cam.pos, 4)}{you(t, CAMP, cam.pos, "fox", { expr: "nervous", prop: "cricket", armR: [100, 40], frontR: true, look: 0.5, facing: 1 })}{chunk(CAMP)}</> };
    },
  },
  {
    id: "s05j", from: L55.start - 0.1,
    render: (t, k) => {
      const cam = move([add(CAMP, [0.12, 1.5, 0.95]), add(CAMP, [0, 1.45, 0]), 30], [add(CAMP, [0.1, 1.5, 0.82]), add(CAMP, [0, 1.46, 0]), 29], k);
      const bite = W("S05", 5, "crunchy");
      const ex = t < bite - 0.3 ? "nervous" : t < W("S05", 5, "fine", 2) ? "pained" : "grin";
      return { mood: "fox", cam, focus: add(CAMP, [0, 1.45, 0]), blur: 2.4, node: <>{hall(t, cam.pos, 4)}
        {you(t, CAMP, cam.pos, "fox", { expr: ex, ...(t < bite ? { prop: "cricket" as const, armR: [150, 140] as [number, number], frontR: true } : {}), headTilt: t > bite ? 6 * Math.sin(t * 12) : 0 }, { res: 1.8 })}{chunk(CAMP)}</> };
    },
  },
];

// ================================================================== S06
const L06 = line("S06", 0), L16 = line("S06", 1), L26 = line("S06", 2), L36 = line("S06", 3), L46 = line("S06", 4), L56 = line("S06", 5);
const BK: V3 = [STREAM_X - 1.0, 0, 1.4];
const NET: V3 = [STREAM_X, -0.08, 0.6];
const fishes = (t: number, cam: V3, n = 6, scatter = 0) => Array.from({ length: n }, (_, i) => {
  const z = -2 + ((t * (0.25 + 0.08 * i) + i * 0.9) % 5) + scatter * (i % 2 ? 1 : -1) * 1.2;
  return <Fish key={i} p={[STREAM_X - 0.6 + (i % 4) * 0.4 + 0.1 * Math.sin(t + i), -0.16, z]} cam={cam} s={1.4} wig={Math.sin(t * 6 + i)} dir={-1} />;
});
const hall6 = (t: number, cam: V3, o: { net?: boolean; fish?: number; scatter?: number } = {}) => (
  <>{hall(t, cam, 4, { water: 0.9 })}{fishes(t, cam, o.fish ?? 6, o.scatter ?? 0)}
    {o.net ? <><Rock p={add(NET, [-0.55, 0, 0])} s={[0.25, 0.3, 0.25]} seed={61} c="#8a8a88" /><Rock p={add(NET, [0.55, 0, 0])} s={[0.25, 0.3, 0.25]} seed={62} c="#8a8a88" />
      <M g={boxG(1.0, 0.36, 0.012)} p={add(NET, [0, 0.02, 0])} r={[0.25, 0, 0]} c="#8e95a3" tex="fabric" side={THREE.DoubleSide} /></> : null}</>
);
const lunge = (t: number, t0: number) => ramp(t, t0, t0 + 0.2) * (1 - ramp(t, t0 + 0.5, t0 + 0.9));
const s06: Shot[] = [
  {
    id: "s06a", from: L06.start - 0.3, enter: { kind: "black", d: 0.6 },
    render: (t, k) => {
      const cam = move([add(BK, [-1.4, 1.0, 1.6]), add(BK, [0.8, 0.3, -0.3]), 40], [add(BK, [-1.2, 0.95, 1.4]), add(BK, [0.8, 0.3, -0.3]), 38], k);
      return { mood: "fox", cam, focus: add(BK, [0.5, 0.4, 0]), blur: 1.2, node: <>{hall6(t, cam.pos)}{you(t, BK, cam.pos, "fox", { mode: "sit", facing: 1, expr: "nervous", look: 0.6, prop: "shroom" })}{chunk(BK)}</> };
    },
  },
  {
    id: "s06b", from: W("S06", 0, "white blind") - 0.1,
    render: (t, k) => {
      const cam = move([[STREAM_X - 0.3, 0.45, 1.2], [STREAM_X, -0.2, -0.4], 36], [[STREAM_X - 0.25, 0.4, 1.0], [STREAM_X, -0.2, -0.5], 34], k);
      return { mood: "fox", cam, focus: [STREAM_X, -0.16, -0.2], blur: 2.0, exposure: 0.15, node: <>{hall6(t, cam.pos)}{chunk([STREAM_X, -0.8, 0.2], 2)}</>,
        over: <Tag a={ramp(t, W("S06", 0, "blind"), W("S06", 0, "blind") + 0.2)} text="NO EYES" x={1440} y={210} col="#f2eef2" /> };
    },
  },
  {
    id: "s06c", from: L16.start - 0.1,
    render: (t, k) => {
      const m1 = W("S06", 1, "you miss"), m2 = W("S06", 1, "miss again"), fall = W("S06", 1, "fall in");
      const c0 = move([add(BK, [0.3, 0.9, 2.0]), add(BK, [0.7, 0.45, 0]), 38], null, k);
      const cam = shake(c0, t, fall + 0.2, 0.05, 0.5);
      const l = Math.max(lunge(t, m1 - 0.2), lunge(t, m2 - 0.2));
      const f = ramp(t, fall, fall + 0.3);
      const p = lerp3(add(BK, [0.25, 0, -0.1]), [STREAM_X - 0.3, -0.3, BK[2] - 0.2], f);
      return { mood: "fox", cam, focus: add(BK, [0.5, 0.5, 0]), blur: 1.2, node: <>{hall6(t, cam.pos, { scatter: l })}
        {you(t, p, cam.pos, "fox", { mode: f > 0.4 ? "sit" : "stand", facing: 1, expr: f > 0.2 ? "shock" : l > 0.3 ? "stern" : "nervous", armL: [60 + 60 * l, 20], armR: [60 + 60 * l, 20], frontL: true, frontR: true }, { roll: -0.6 * l - 1.0 * f * (1 - f) * 2, sy: 1 - 0.1 * l })}
        <Echo p={[STREAM_X - 0.3, -0.16, BK[2] - 0.2]} t={t} t0={fall + 0.25} r={1.0} n={3} flat col="#d8fff0" />{chunk(p, 1.6)}</> };
    },
  },
  {
    id: "s06d", from: L26.start - 0.1,
    render: (t, k) => {
      const net = t > W("S06", 2, "stretch");
      const p = add(NET, [-0.45, 0.08, 0.75]);
      const cam = move([add(NET, [-0.9, 1.1, 2.4]), add(NET, [0, 0.4, 0]), 40], [add(NET, [-0.8, 1.05, 2.1]), add(NET, [0, 0.4, 0]), 38], k);
      const pull = ramp(t, W("S06", 2, "take off"), W("S06", 2, "hoodie") + 0.3);
      return { mood: "fox", cam, focus: add(NET, [0, 0.4, 0]), blur: 1.2, node: <>{hall6(t, cam.pos, { net })}
        {you(t, [p[0], 0, p[2]], cam.pos, "fox", { expr: "stern", armL: [150 * (1 - pull) + 40 * pull, 60], armR: [150 * (1 - pull) + 40 * pull, 60], frontL: true, frontR: true }, { id: pull > 0.5 ? "youTee" : "you" })}{chunk(p, 1.6)}</> };
    },
  },
  {
    id: "s06e", from: W("S06", 2, "and wait") - 0.1,
    render: (t, k) => {
      const p: V3 = [NET[0] - 1.0, 0, NET[2] + 0.5];
      const cam = move([add(p, [-0.2, 0.75, 1.9]), add(p, [0.6, 0.55, -0.3]), 40], [add(p, [-0.15, 0.75, 1.75]), add(p, [0.6, 0.55, -0.3]), 40], k);
      return { mood: "fox", cam, focus: add(p, [0.4, 0.5, 0]), blur: 1.2, node: <>{hall6(t, cam.pos, { net: true })}
        {you(t, p, cam.pos, "fox", { mode: "sit", facing: 1, expr: "neutral", look: 0.6, armR: [20, 150], frontR: true }, { id: "youTee" })}{chunk(p, 1.6)}</> };
    },
  },
  {
    id: "s06f", from: L36.start - 0.1,
    render: (t, k) => {
      const p = add(NET, [-0.3, 0.08, 0.55]);
      const cam = move([add(p, [0.35, 1.2, 2.1]), add(p, [0, 1.3, 0]), 38], [add(p, [0.3, 1.2, 1.8]), add(p, [0, 1.35, 0]), 37], k);
      const h = hop(t, L36.start, 0.18, 0.45);
      const sorry = t > W("S06", 3, "so sorry") - 0.1;
      return { mood: "fox", cam, focus: add(p, [0, 1.3, 0]), blur: 1.5, node: <>{hall6(t, cam.pos, { net: true, fish: 4 })}
        {you(t, [p[0], 0, p[2]], cam.pos, "fox", { expr: sorry ? (t > W("S06", 3, "breakfast") - 0.2 ? "grin" : "nervous") : "laugh", prop: "fish", ...(sorry ? {} : { armR: [160, 10] as [number, number], frontR: true }) }, { id: "youTee", dy: h.dy, sy: h.sy })}{chunk(p, 1.8)}</> };
    },
  },
  {
    id: "s06g", from: L46.start - 0.1,
    render: (t, k) => {
      const cut = W("S06", 4, "slice");
      const p: V3 = [STREAM_X - 0.75, 0, -1.2];
      const cam = shake(move([[STREAM_X - 0.2, 0.55, -0.4], [STREAM_X - 0.1, -0.1, -1.4], 36], [[STREAM_X - 0.25, 0.5, -0.5], [STREAM_X - 0.1, -0.1, -1.4], 34], k), t, cut, 0.03, 0.4);
      return { mood: "fox", cam, focus: [STREAM_X, -0.1, -1.4], blur: 1.8, node: <>{hall6(t, cam.pos, { fish: 3 })}
        {[0, 1, 2, 3, 4].map((i) => <Rock key={i} p={[STREAM_X - 0.3 + i * 0.16, -0.12, -1.45 + 0.12 * Math.sin(i * 2)]} s={[0.08, 0.07, 0.07]} seed={70 + i} amp={0.5} c="#a8a49e" />)}
        {you(t, p, cam.pos, "fox", { mode: "sit", facing: 1, expr: t > cut ? "pained" : "nervous", armR: [70, 30], frontR: true }, { id: "youTee" })}{chunk(p, 1.6)}</>,
        over: <Tag a={ramp(t, W("S06", 4, "broken glass") - 0.1, W("S06", 4, "broken glass") + 0.15) * (1 - ramp(t, cut - 0.2, cut))} text="SHARP AS GLASS" x={1400} y={210} col="#ff7a6a" /> };
    },
  },
  {
    id: "s06h", from: W("S06", 4, "tear a strip") - 0.1,
    render: (t, k) => {
      const p: V3 = [STREAM_X - 0.95, 0, -0.9];
      const cam = move([add(p, [0.3, 0.95, 1.2]), add(p, [0, 0.8, 0]), 34], [add(p, [0.25, 0.92, 1.05]), add(p, [0, 0.8, 0]), 33], k);
      const tear = ramp(t, W("S06", 4, "tear"), W("S06", 4, "strip") + 0.2);
      const rinse = t > W("S06", 4, "rinse") - 0.1 && t < W("S06", 4, "and hope") - 0.1;
      return { mood: "fox", cam, focus: add(p, [0, 0.8, 0]), blur: 1.8, node: <>{hall6(t, cam.pos, { fish: 2 })}
        {you(t, p, cam.pos, "fox", { mode: "sit", facing: rinse ? 1 : 0, expr: t > W("S06", 4, "and hope") - 0.1 ? "nervous" : "stern", armL: rinse ? [70, 30] : [60 + 50 * tear, 70], armR: rinse ? [80, 30] : [60 + 50 * tear, 70], frontL: true, frontR: true }, { id: "youTee" })}{chunk(p, 1.6)}</> };
    },
  },
  {
    id: "s06i", from: L56.start - 0.1,
    render: (t, k) => {
      const p: V3 = [STREAM_X - 0.95, 0, -0.9];
      const cam = move([add(p, [0.12, 0.98, 0.85]), add(p, [0, 0.95, 0]), 30], [add(p, [0.1, 0.98, 0.75]), add(p, [0, 0.96, 0]), 29], k);
      const shakeH = t < W("S06", 5, "thats fine") ? Math.sin(t * 16) : 0;
      return { mood: "fox", cam, focus: add(p, [0, 0.95, 0]), blur: 2.4, node: <>{hall6(t, cam.pos, { fish: 0 })}
        {you(t, p, cam.pos, "fox", { mode: "sit", expr: t < W("S06", 5, "thats fine") ? "pained" : "grin", armR: [130 + 15 * shakeH, 50], frontR: true }, { id: "youTee", res: 1.8 })}{chunk(p, 1.6)}</> };
    },
  },
];

// ================================================================== S07
const L07 = line("S07", 0), L17 = line("S07", 1), L27 = line("S07", 2), L37 = line("S07", 3);
const DOOR: V3 = add(D, [-1.2, 0, 3.3]);
const BED0: V3 = add(D, [-1.0, 0, 0.8]);
const den0 = (t: number, cam: V3) => <><Den t={t} cam={cam} pool={false} />{chunk(add(BED0, [0.4, 0, 0.2]), 2.2)}</>;
const blobs = (t: number, t0: number, faces: boolean) => Array.from({ length: 18 }, (_, i) => {
  const a = ramp(t, t0 + i * 0.12, t0 + i * 0.12 + 0.6);
  if (a <= 0) return null;
  const cols = ["#ff6a9a", "#6ad8ff", "#ffd24a", "#9a7aff", "#7affc8"];
  const c: V3 = add(BED0, [-1.5 + (i % 6) * 0.6 + 0.2 * Math.sin(t * 0.7 + i), 1.2 + Math.floor(i / 6) * 0.45 + 0.15 * Math.sin(t + i * 2), -1.2 + 0.3 * Math.sin(i * 3)]);
  const pul = 0.8 + 0.2 * Math.sin(t * 2 + i);
  return (
    <group key={i} position={c}>
      <mesh scale={0.09 * pul} material={coreMat(cols[i % 5], 0.9, 0.7 * a)} userData={{ outline: false }}><sphereGeometry args={[1, 12, 8]} /></mesh>
      {faces && i % 3 === 0 ? <>
        <mesh position={[-0.12, 0.08, 0]} scale={0.035} material={coreMat("#ffffff", 0.9, 0.8 * a)} userData={{ outline: false }}><sphereGeometry args={[1, 8, 6]} /></mesh>
        <mesh position={[0.12, 0.08, 0]} scale={0.035} material={coreMat("#ffffff", 0.9, 0.8 * a)} userData={{ outline: false }}><sphereGeometry args={[1, 8, 6]} /></mesh>
        <mesh position={[0, -0.1, 0]} rotation={[0, 0, Math.PI]} material={coreMat("#ffffff", 0.9, 0.7 * a)} userData={{ outline: false }}><ringGeometry args={[0.08, 0.11, 16, 1, 0, Math.PI]} /></mesh>
      </> : null}
    </group>
  );
});
const s07: Shot[] = [
  {
    id: "s07a", from: L07.start - 0.3,
    render: (t, k) => {
      const p = add(CAMP, [0.6, 0, -0.4]);
      const cam = move([add(p, [0.7, 1.2, 1.7]), add(p, [0, 1.1, 0]), 36], [add(p, [0.6, 1.2, 1.5]), add(p, [0, 1.12, 0]), 35], k);
      const wring = Math.sin(t * 4);
      return { mood: "fox", cam, focus: add(p, [0, 1.1, 0]), blur: 1.6, node: <>{hall(t, cam.pos, 6)}
        {you(t, add(p, tremble(t, 0.006)), cam.pos, "fox", { expr: "nervous", armL: [60, 90 + 10 * wring], armR: [60, 90 - 10 * wring], frontL: true, frontR: true }, { tint: "#98d8d0" })}
        {[0, 1, 2].map((i) => <Drip key={i} p={add(p, [-0.12 + i * 0.12, 0.85, 0.25])} t={t} h={0.85} seed={i * 3} col="#c8fff0" />)}{chunk(p, 1.8)}</>,
        over: <Tag a={ramp(t, W("S07", 0, "one hundred percent") - 0.1, W("S07", 0, "one hundred percent") + 0.15) * (1 - ramp(t, W("S07", 0, "wet plus") - 0.4, W("S07", 0, "wet plus") - 0.1))} text="~100% HUMIDITY" x={1420} y={210} col="#9ad8ff" /> };
    },
  },
  {
    id: "s07b", from: W("S07", 0, "wet plus") - 0.1,
    render: (t, k) => {
      const p = add(CAMP, [0.6, 0, -0.4]);
      const cam = move([add(p, [0.1, 0.98, 0.9]), add(p, [0, 0.95, 0]), 32], [add(p, [0.08, 0.98, 0.78]), add(p, [0, 0.96, 0]), 30], k);
      return { mood: "fox", cam, focus: add(p, [0, 0.95, 0]), blur: 2.4, node: <>{hall(t, cam.pos, 6)}
        {you(t, add(p, tremble(t, 0.012)), cam.pos, "fox", { mode: "sit", expr: "pained", armL: [25, 140], armR: [25, 140], frontL: true, frontR: true }, { tint: "#98d8d0", res: 1.8 })}{chunk(p, 1.4)}</>,
        over: <Tag a={ramp(t, W("S07", 0, "people die") - 0.1, W("S07", 0, "people die") + 0.15)} text="WET + COLD = DANGER" x={1400} y={210} col="#ff7a6a" size={68} /> };
    },
  },
  {
    id: "s07c", from: L17.start - 0.1,
    render: (t, k) => {
      const p: V3 = [-3.2, 0, 3.4];
      const cam = move([add(p, [1.6, 1.2, 1.2]), add(p, [-0.3, 1.5, -0.4]), 38], [add(p, [1.4, 1.2, 1.0]), add(p, [-0.3, 1.55, -0.4]), 37], k);
      return { mood: "fox", cam, focus: add(p, [0, 1.5, 0]), blur: 1.4, node: <>{hall(t, cam.pos, 6)}
        {you(t, p, cam.pos, "fox", { expr: "neutral", facing: -1, armL: [165, 10], frontL: true, prop: "shroom", look: -0.6 })}{chunk(p, 2)}
        {Array.from({ length: 16 }, (_, i) => { const u = (t * 0.35 + i / 16) % 1; return <mesh key={i} position={[p[0] + 1.6 - 2.6 * u, 1.0 + 1.2 * ((i * 7) % 16) / 16 + 0.6 * u, p[2] - 0.6 + 0.4 * Math.sin(i)]} scale={0.012} material={coreMat("#c8ffe8", 0.9, 0.7)} userData={{ outline: false }}><sphereGeometry args={[1, 6, 4]} /></mesh>; })}</> };
    },
  },
  {
    id: "s07d", from: W("S07", 1, "higher up") - 0.1, enter: { kind: "black", d: 0.4 },
    render: (t, k) => {
      const p = lerp3(add(DOOR, [0, 0, 0.6]), BED0, ramp(t, W("S07", 1, "higher up"), W("S07", 1, "your first") - 0.3));
      const cam = move([add(D, [2.6, 1.6, 2.6]), add(D, [-1.0, 0.9, 0.6]), 46], [add(D, [2.3, 1.55, 2.3]), add(D, [-1.0, 0.9, 0.6]), 46], k);
      return { mood: "fox", cam, focus: p, blur: 0.8, exposure: -0.1, node: <><Den t={t} cam={cam.pos} pool={false} />{you(t, p, cam.pos, "fox", { mode: "stroll", phase: t, expr: "relief", prop: "shroom" })}{chunk(p, 2.4)}</> };
    },
  },
  {
    id: "s07e", from: W("S07", 1, "your first") - 0.1,
    render: (t, k) => {
      const cam = move([add(BED0, [0.1, 0.9, 2.4]), add(BED0, [-0.1, 0.3, 0]), 44], [add(BED0, [0.05, 0.85, 2.2]), add(BED0, [-0.1, 0.32, 0]), 44], k);
      return { mood: "fox", cam, focus: BED0, blur: 1.0, node: <>{den0(t, cam.pos)}{you(t, add(BED0, [0.95, 0.1, 0.3]), cam.pos, "fox", { expr: "relief", blink: true }, { roll: 1.45, s: 0.92 })}</> };
    },
  },
  {
    id: "s07f", from: L27.start - 0.1,
    render: (t, k) => {
      const cam = move([add(BED0, [0.3, 1.25, 2.5]), add(BED0, [-0.1, 0.75, -0.4]), 50], [add(BED0, [0.25, 1.2, 2.3]), add(BED0, [-0.1, 0.78, -0.4]), 50], k);
      return { mood: "fox", cam, focus: add(BED0, [0, 1.2, -1.2]), blur: 1.0, exposure: -0.35, node: <><Den t={t} cam={cam.pos} pool={false} />{chunk(add(BED0, [0.4, 0, 0.2]), 0.8)}
        {you(t, add(BED0, [0.95, 0.1, 0.3]), cam.pos, "fox", { expr: "nervous" }, { roll: 1.45, s: 0.92 })}{blobs(t, W("S07", 2, "colors"), t > W("S07", 2, "faces") - 0.1)}
        {t > W("S07", 2, "whispers") ? [0, 1, 2].map((i) => <Echo key={i} p={add(BED0, [-0.8 + i * 0.8, 1.4, -1])} t={t} t0={W("S07", 2, "whispers") + i * 0.4} r={0.5} n={2} col="#ff9ad0" />) : null}</>,
        over: <Tag a={ramp(t, W("S07", 2, "prisoners cinema") - 0.1, W("S07", 2, "prisoners cinema") + 0.15)} text="THE PRISONER'S CINEMA" x={1340} y={210} col="#ff9ad0" size={64} /> };
    },
  },
  {
    id: "s07g", from: L37.start - 0.1,
    render: (t, k) => {
      const p = add(BED0, [0.2, 0, 0.1]);
      const cam = shake(move([add(p, [0.3, 1.25, 1.9]), add(p, [0, 1.1, 0]), 38], null, k), t, L37.start, 0.03, 0.4);
      const h = hop(t, L37.start, 0.15, 0.4);
      const la = lookAround(t, 3, 1.6);
      const calm = t > W("S07", 3, "nobodys there", 1) - 0.2;
      return { mood: "fox", cam, focus: add(p, [0, 1.1, 0]), blur: 1.4, exposure: -0.2, node: <>{den0(t, cam.pos)}
        {you(t, p, cam.pos, "fox", { expr: calm ? "nervous" : "shock", facing: calm ? 0 : la.facing, look: calm ? 0 : la.look, armL: [50, 30], armR: [50, 30] }, { dy: h.dy, sy: h.sy })}{t < W("S07", 3, "nobodys") ? blobs(t, L37.start - 2, true).slice(0, 6) : null}</> };
    },
  },
];

// ================================================================== S08
const L08 = line("S08", 0), L18 = line("S08", 1), L28 = line("S08", 2), L38 = line("S08", 3);
const PK: V3 = add(PACK, [0.75, 0, -0.45]);
const s08: Shot[] = [
  {
    id: "s08a", from: L08.start - 0.4, enter: { kind: "black", d: 0.6 },
    render: (t, k) => {
      const cam = move([add(PACK, [1.8, 1.2, -1.6]), add(PACK, [0, 0.4, 0]), 40], [add(PACK, [1.6, 1.1, -1.4]), add(PACK, [0, 0.4, 0]), 38], k);
      const pull = ramp(t, W("S08", 0, "backpack") - 0.2, W("S08", 0, "somebody"));
      return { mood: "fox", cam, focus: PACK, blur: 1.2, node: <><Hall t={t} waterLit={0.7} log={0.85} cam={cam.pos} pack={false} /><group position={[0, 0.1 * pull, 0]}><Backpack p={PACK} /></group>
        {you(t, PK, cam.pos, "fox", { mode: "sit", facing: -1, expr: pull > 0.5 ? "shock" : "nervous", armL: [70 + 30 * pull, 20], armR: [60, 20], frontL: true, frontR: true }, { id: "youDirty" })}{chunk(PK, 2)}</> };
    },
  },
  {
    id: "s08b", from: L18.start - 0.1,
    render: (t, k) => {
      const c = add(PACK, [0.35, 0.02, -0.55]);
      const cam = move([add(c, [0.35, 0.45, -0.55]), add(c, [0, 0.05, 0]), 34], [add(c, [0.3, 0.4, -0.45]), add(c, [0, 0.05, 0]), 32], k);
      const cup = t > W("S08", 1, "tin cup") - 0.2, pen = t > W("S08", 1, "pencil") - 0.2;
      return { mood: "fox", cam, focus: c, blur: 2.4, node: <><Hall t={t} waterLit={0.7} log={0.85} cam={cam.pos} pack={false} /><Backpack p={PACK} open />
        {cup ? <M g={cylG(0.045, 0.04, 0.1, 14, true)} p={add(c, [-0.08, 0.05, 0])} c="#9a9ea8" tex="metal" side={THREE.DoubleSide} /> : null}
        {pen ? <M g={cylG(0.006, 0.006, 0.12, 6)} p={add(c, [0.1, 0.008, 0.05])} r={[Math.PI / 2, 0.6, 0]} c="#e8c44a" /> : null}{chunk(add(c, [0, -0.8, 0]), 1.6)}</> };
    },
  },
  {
    id: "s08c", from: W("S08", 1, "and a diary") - 0.1,
    render: (t, k) => {
      const n = t > W("S08", 1, "day nine") - 0.1 ? 3 : t > W("S08", 1, "day five") - 0.1 ? 2 : t > W("S08", 1, "day one") - 0.1 ? 1 : 0;
      const cam = move([add(PK, [-0.25, 0.95, -1.0]), add(PK, [0, 0.85, 0]), 34], null, k);
      return { mood: "fox", cam, focus: add(PK, [0, 0.85, 0]), blur: 2.4, exposure: n ? -0.35 : 0, node: <><Hall t={t} waterLit={0.7} log={0.85} cam={cam.pos} pack={false} /><Backpack p={PACK} open />
        {you(t, PK, cam.pos, "fox", { mode: "sit", expr: n === 3 ? "nervous" : "neutral", prop: "diary", look: -0.2 }, { id: "youDirty" })}{chunk(PK, 2)}</>,
        over: <Diary a={ramp(t, W("S08", 1, "day one") - 0.25, W("S08", 1, "day one") + 0.05)} n={Math.max(1, n)} /> };
    },
  },
  {
    id: "s08d", from: L28.start - 0.3, enter: { kind: "black", d: 0.5 },
    render: (t, k) => {
      const p = add(ROPE, [0.32, 0, 0.12]);
      const cam = move([add(ROPE, [2.4, 1.3, 3.0]), add(ROPE, [0, 1.6, 0]), 40], [add(ROPE, [2.1, 1.3, 2.6]), add(ROPE, [0, 1.6, 0]), 38], k);
      return { mood: "fox", cam, focus: p, blur: 1.0, exposure: -0.15, node: <><Hall t={t} waterLit={0.5} log={0.85} cam={cam.pos} rope={0.2} />{you(t, p, cam.pos, "fox", { expr: "neutral", facing: -1, armL: [165, 0], frontL: true, look: -0.3 }, { id: "youDirty" })}{chunk(p, 1.8)}</> };
    },
  },
  {
    id: "s08e", from: W("S08", 2, "for a long") - 0.1,
    render: (t, k) => {
      const p = add(ROPE, [0.32, 0, 0.12]);
      const cam = move([add(p, [0.45, 1.75, 0.95]), add(p, [-0.15, 1.7, 0]), 30], [add(p, [0.38, 1.72, 0.82]), add(p, [-0.15, 1.7, 0]), 29], k);
      return { mood: "fox", cam, focus: add(p, [-0.1, 1.7, 0]), blur: 2.4, node: <><Hall t={t} waterLit={0.5} log={0.85} cam={cam.pos} rope={0.2 + 0.1 * n1(t, 2)} />{you(t, p, cam.pos, "fox", { expr: "stern", facing: -1, armL: [165, 0], frontL: true, headTilt: -10 }, { id: "youDirty", res: 1.8 })}{chunk(p, 1.8)}</> };
    },
  },
  {
    id: "s08f", from: L38.start - 0.15,
    render: (t, k) => {
      const p = add(ROPE, [0.32, 0, 0.12]);
      const cam = move([add(p, [0.3, 1.5, 1.6]), add(p, [0, 1.4, 0]), 34], null, k);
      const drop = ramp(t, L38.end, L38.end + 0.35);
      const walk = ramp(t, L38.end + 0.5, L38.end + 1.6);
      const pp = lerp3(p, add(p, [0.55, 0, 0.45]), walk);
      return { mood: "fox", cam, focus: add(p, [0, 1.4, 0]), blur: 1.8, node: <><Hall t={t} waterLit={0.5} log={0.85} cam={cam.pos} rope={0.3 * (1 - drop)} />
        {you(t, pp, cam.pos, "fox", { expr: "cool", facing: walk > 0 ? 1 : 0, mode: walk > 0 && walk < 1 ? "stroll" : "stand", phase: t, armL: [165 - 160 * drop, 0], frontL: drop < 0.5 }, { id: "youDirty" })}{chunk(pp, 1.8)}</> };
    },
  },
];

export const C2_SHOTS: Shot[] = [...s05, ...s06, ...s07, ...s08];
export const hud2 = (t: number): Hud => {
  if (t < L05.start - 0.3 || t >= L38.end + 2.0) return null;
  const P: [number, number][] = [[7, W("S05", 0, "problem seven")], [8, P8], [9, W("S06", 1, "problem nine")], [10, W("S06", 4, "problem ten")], [11, W("S07", 0, "problem eleven")], [12, W("S07", 2, "problem twelve")]];
  let prob: [number, number] | undefined;
  for (const p of P) if (t >= p[1] - 0.05) prob = p;
  const day = t < L06.start - 0.3 ? 4 : t < L07.start - 0.3 ? 5 : t < L08.start - 0.4 ? 6 : t < L28.start - 0.3 ? 8 : 9;
  const marks = t < SCR + 0.4 ? 3 : day;
  return { day: String(day), marks, prob };
};
void keys;
