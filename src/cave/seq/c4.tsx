// S11 the home montage (days 18–29) · S12 day 30: the bell, the stranger's flashlight, "Can I stay one more week?"
// · S13 the question.  Light: home (warm lamps + teal mushroom stars).
import React from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import type { V3 } from "../../inkbeat/types";
import { coreMat, cylG, M, sphG } from "../../inkbeat/core/kit";
import { hop, keys } from "../../med/act";
import { Fish, Olm } from "../creatures";
import { Echo, Tag } from "../fx";
import { move, shake } from "../film";
import type { Hud, Shot } from "../film";
import { D, DEN, Den, denCeil, Hall, hallCeil, MarkWall, OilLamp, ROPE, SH, Shaft, STREAM_X, XYLO } from "../sets";
import type { DenOpts } from "../sets";
import { line, ramp, W } from "../time";
import { Who } from "../who";
import { you } from "./c1";

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const L011 = line("S11", 0), L111 = line("S11", 1), L211 = line("S11", 2), L311 = line("S11", 3), L411 = line("S11", 4), L511 = line("S11", 5), L611 = line("S11", 6), L711 = line("S11", 7);
const L012 = line("S12", 0), L112 = line("S12", 1), L212 = line("S12", 2), L312 = line("S12", 3), L412 = line("S12", 4), L512 = line("S12", 5), L013 = line("S13", 0);
const ME = "youDirty";

/** the den's dressing grows with the montage */
const homeAt = (t: number): DenOpts => ({
  t,
  paint: ramp(t, L111.start, L111.end),
  marks: Math.round(18 + 6 * ramp(t, L011.start, L611.start)),
  table: t > W("S11", 2, "table") - 0.2,
  shelf: true,
  bed: t > W("S11", 2, "a bed") - 0.3 ? 1 : 0.3,
  stars: t > L311.start ? Math.max(0.15, ramp(t, L311.start, W("S11", 3, "now you have"))) : 0,
  fire: 0.7, smoke: "chimney", lamps: t > L211.start ? 3 : 2,
  xylo: t > L511.start - 0.2, trap: t > W("S11", 4, "now dinner") - 0.2, pool: true, dishes: t > L511.start,
});
const home = (t: number, cam: V3, o: Partial<DenOpts> = {}) => <><Den {...homeAt(t)} {...o} cam={cam} /><MarkWall /></>;
const BED = DEN.bed;
const steve = (t: number, cam: V3, p: V3 = add(DEN.pool, [0.1, 0.02, 0.05]), s = 1.5) => <Olm p={p} cam={cam} s={s} wig={Math.sin(t * 1.6)} smile={0.8} dir={-1} />;
/** a light beam (flashlight): a translucent cone from `a` to `b` + a pool of light where it lands */
const beamMat = new THREE.MeshBasicMaterial({ color: "#fff6d8", transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide });
const Beam: React.FC<{ a: V3; b: V3; k?: number }> = ({ a, b, k = 1 }) => {
  const d = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const L = d.length();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize());
  const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
  return (
    <>
      <mesh position={mid} quaternion={q} material={beamMat} userData={{ outline: false }}><cylinderGeometry args={[0.45 * k, 0.03, L, 24, 1, true]} /></mesh>
      <pointLight position={lerp3(a, b, 0.85)} color="#fff4d8" intensity={5 * k} distance={4} decay={1.4} />
    </>
  );
};

// ================================================================== S11: home
const s11: Shot[] = [
  {
    id: "s11a", from: L011.start - 0.6, enter: { kind: "black", d: 0.6 },
    render: (t, k) => {
      const p = add(D, [0.2, 0, 0.9]);
      const cam = move([add(D, [2.8, 1.8, 3.3]), add(D, [-0.4, 1.0, -0.6]), 50], [add(D, [2.5, 1.7, 2.9]), add(D, [-0.4, 1.05, -0.6]), 48], k);
      const st = ramp(t, W("S11", 0, "start living") - 0.4, W("S11", 0, "start living") + 0.3);
      return { mood: "home", cam, focus: p, blur: 0.6, node: <>{home(t, cam.pos)}{you(t, p, cam.pos, "home", { expr: st > 0.5 ? "relief" : "neutral", armL: [40 + 125 * st, 10], armR: [40 + 125 * st, 10] }, { id: ME })}{steve(t, cam.pos)}</> };
    },
  },
  {
    id: "s11b", from: L111.start - 0.1,
    render: (t, k) => {
      const P = DEN.paint;
      const x = keys(t, [[L111.start, -1.2], [W("S11", 1, "a sun"), -0.93], [W("S11", 1, "apartment") - 0.2, -0.08], [W("S11", 1, "steve") - 0.2, 0.9]], 0.5);
      const cam = move([add(P, [x + 0.2, 0.15, 2.7]), add(P, [x, -0.1, 0]), 40], null, k);
      const hp = add(P, [Math.min(1.3, x + 0.95), -P[1], 0.7]);
      return { mood: "home", cam, focus: add(P, [x, 0, 0]), blur: 1.2, node: <>{home(t, cam.pos)}{you(t, hp, cam.pos, "home", { back: true, armL: [120 + 10 * Math.sin(t * 6), 30], frontL: true }, { id: ME })}</> };
    },
  },
  {
    id: "s11c", from: L211.start - 0.1,
    render: (t, k) => {
      const tb = DEN.table;
      const place = ramp(t, L211.start, W("S11", 2, "flat stone"));
      const cam = move([add(tb, [-0.4, 1.3, 2.0]), add(tb, [0.4, 0.6, 0]), 42], [add(tb, [-0.3, 1.25, 1.8]), add(tb, [0.4, 0.6, 0]), 41], k);
      return { mood: "home", cam, focus: tb, blur: 1.0, node: <>{home(t, cam.pos, { table: place > 0.95 })}
        {place < 0.95 ? <M g={sphG(0.5, 16)} p={add(tb, [-0.2 + 0.2 * place, 0.95 - 0.27 * place, 0.35 * (1 - place)])} s={[1.5, 0.14, 0.84]} c="#8a7c70" tex="rock" /> : null}
        {you(t, add(tb, [-0.95, 0, 0.45]), cam.pos, "home", { expr: place > 0.95 ? "grin" : "stern", facing: 1, armL: [80, 30], armR: [80, 30], frontL: true, frontR: true }, { id: ME })}</> };
    },
  },
  {
    id: "s11d", from: W("S11", 2, "a shelf") - 0.1,
    render: (t, k) => {
      const sp = DEN.shelf;
      const cam = move([add(D, [-0.3, 1.5, 2.8]), add(sp, [-0.3, -0.2, 0]), 40], [add(D, [-0.1, 1.45, 2.6]), add(sp, [-0.3, -0.2, 0]), 39], k);
      return { mood: "home", cam, focus: sp, blur: 1.6, node: <>{home(t, cam.pos)}{you(t, add(sp, [-0.75, -sp[1], 0.45]), cam.pos, "home", { facing: 1, expr: "smile", armR: [110, 20], frontR: true }, { id: ME })}</> };
    },
  },
  {
    id: "s11e", from: W("S11", 2, "a bed") - 0.1,
    render: (t, k) => {
      const flop = W("S11", 2, "dry roots");
      const cam = move([add(BED, [0.7, 1.1, 2.0]), add(BED, [-0.5, 0.45, 0]), 48], [add(BED, [0.6, 1.05, 1.85]), add(BED, [-0.5, 0.47, 0]), 48], k);
      const h = hop(t, flop, 0.06, 0.35);
      return { mood: "home", cam, focus: BED, blur: 1.2, node: <>{home(t, cam.pos)}
        {t < flop ? you(t, add(BED, [0.8, 0, 0.5]), cam.pos, "home", { expr: "smile", facing: -1 }, { id: ME }) : you(t, add(BED, [0.95, 0.42 + h.dy, 0.3]), cam.pos, "home", { expr: t > W("S11", 2, "honestly") ? "relief" : "smile", armL: [160, 150], armR: [160, 150] }, { id: ME, roll: 1.45, s: 0.92 })}</>,
        over: <Tag a={ramp(t, W("S11", 2, "mattress") - 0.3, W("S11", 2, "mattress"))} text="BETTER THAN MY MATTRESS" x={1360} y={210} col="#ffd23a" size={62} /> };
    },
  },
  {
    id: "s11f", from: L311.start - 0.1,
    render: (t, k) => {
      const p = add(BED, [0.3, 0, -0.5]);
      const cam = move([add(p, [0.9, 1.1, 1.8]), add(p, [0, 2.1, -0.2]), 44], [add(p, [0.8, 1.15, 1.6]), add(p, [0, 2.2, -0.2]), 44], k);
      const reach = 0.5 + 0.5 * Math.sin(t * 2.4);
      return { mood: "home", cam, focus: add(p, [0, 2.0, 0]), blur: 1.0, node: <>{home(t, cam.pos)}{you(t, p, cam.pos, "home", { expr: "grin", armR: [160 + 10 * reach, 10], frontR: true, prop: "shroom", headTilt: -12 }, { id: ME, dy: 0.04 * reach })}</> };
    },
  },
  {
    id: "s11g", from: W("S11", 3, "now you have") - 0.1,
    render: (t, k) => {
      const c = add(BED, [0.1, 0.45, 0.1]);
      const cam = move([c, add(BED, [0.5, denCeil(BED[0] - D[0], BED[2] - D[2]), -0.6]), 64], [c, add(BED, [0.6, denCeil(BED[0] - D[0], BED[2] - D[2]), -0.9]), 60], k);
      return { mood: "home", cam, focus: add(c, [0, 2.4, 0]), blur: 0.4, exposure: -0.15, node: home(t, cam.pos),
        over: <Tag a={ramp(t, W("S11", 3, "stars") - 0.1, W("S11", 3, "stars") + 0.15)} text="STARS" x={1460} y={210} col="#7affc8" size={90} /> };
    },
  },
  {
    id: "s11h", from: L411.start - 0.1,
    render: (t, k) => {
      const lp = add(DEN.table, [0.3, 0.72, -0.1]);
      const cam = move([add(lp, [-1.0, 0.25, 0.8]), add(lp, [0, 0.08, 0]), 34], [add(lp, [-0.9, 0.22, 0.7]), add(lp, [0, 0.08, 0]), 32], k);
      const dim = 1 - 0.7 * ramp(t, W("S11", 4, "burn") - 0.2, W("S11", 4, "catch fish"));
      return { mood: "home", cam, focus: lp, blur: 2.6, exposure: -0.6 - 0.3 * (1 - dim), node: <>{home(t, cam.pos, { lamps: 0 })}<OilLamp p={lp} t={t} light={dim} />
        <Fish p={add(lp, [0.0, 0.0, 0.18])} cam={cam.pos} s={0.9} roll={1.5} /></> };
    },
  },
  {
    id: "s11i", from: W("S11", 4, "so you weave") - 0.1,
    render: (t, k) => {
      const p = add(D, [1.2, 0, 2.3]);
      const cam = move([add(p, [0.3, 0.95, 1.3]), add(p, [0, 0.7, 0]), 36], [add(p, [0.25, 0.92, 1.15]), add(p, [0, 0.72, 0]), 35], k);
      const w = Math.sin(t * 5);
      return { mood: "home", cam, focus: add(p, [0, 0.7, 0]), blur: 1.8, node: <>{home(t, cam.pos)}
        {you(t, p, cam.pos, "home", { mode: "sit", expr: "stern", armL: [60 + 10 * w, 60], armR: [60 - 10 * w, 60], frontL: true, frontR: true, look: -0.2 }, { id: ME })}
        <M g={cylG(0.1, 0.16, 0.42, 10, true)} p={add(p, [0, 0.52, 0.25])} r={[0, 0, Math.PI / 2]} c="#a8844e" tex="fabric" side={THREE.DoubleSide} /></> };
    },
  },
  {
    id: "s11j", from: W("S11", 4, "and leave it") - 0.1,
    render: (t, k) => {
      const tp: V3 = [STREAM_X, -0.12, 1.4];
      const cam = move([add(tp, [-0.9, 0.55, 1.0]), tp, 36], [add(tp, [-0.8, 0.5, 0.85]), tp, 34], k);
      const caught = ramp(t, W("S11", 4, "now dinner"), L411.end);
      return { mood: "home", cam, focus: tp, blur: 2.0, exposure: -0.1, node: <><Hall t={t} waterLit={0.9} log={-1} cam={cam.pos} /><OilLamp p={[STREAM_X - 1.1, 0, 1.9]} t={t} />
        <M g={cylG(0.14, 0.22, 0.6, 10, true)} p={tp} r={[Math.PI / 2, 0, 0]} c="#a8844e" tex="fabric" side={THREE.DoubleSide} />
        {[0, 1, 2].map((i) => <Fish key={i} p={[STREAM_X - 0.05 + 0.05 * i, -0.13, tp[2] + 1.4 - 1.4 * Math.min(1, caught * 1.4 - i * 0.2) - 0.1 * i]} cam={cam.pos} s={1.1} wig={Math.sin(t * 7 + i)} dir={-1} />)}</>,
        over: <Tag a={ramp(t, W("S11", 4, "catches itself") - 0.1, W("S11", 4, "catches itself") + 0.15)} text="DINNER CATCHES ITSELF" x={1380} y={210} col="#ffd23a" size={64} /> };
    },
  },
  {
    id: "s11k", from: L511.start - 0.1,
    render: (t, k) => {
      const tb = DEN.table;
      const bowl = add(tb, [-0.25, 0.72, 0.05]);
      const cam = move([add(bowl, [-0.35, 0.35, 0.65]), bowl, 34], [add(bowl, [-0.3, 0.32, 0.55]), bowl, 32], k);
      const drops = [W("S11", 5, "dropping") - 0.1, W("S11", 5, "hot stones"), W("S11", 5, "into water")];
      return { mood: "home", cam, focus: bowl, blur: 2.4, node: <>{home(t, cam.pos)}
        <M g={sphG(0.075, 12)} p={add(bowl, [0, 0.03, 0])} s={[1, 0.12, 1]} c="#8ab8b0" e="#5a8a80" ei={0.2} />
        {drops.map((d, i) => { const f = ramp(t, d - 0.3, d); return f < 1 ? <mesh key={i} position={add(bowl, [0.03 * i - 0.03, 0.35 * (1 - f) + 0.04, 0.02])} material={coreMat("#ff7a2a", 1.0)} userData={{ outline: false }}><sphereGeometry args={[0.022, 8, 6]} /></mesh> : null; })}
        {[0, 1, 2, 3, 4].map((i) => { const u = (t * 0.5 + i / 5) % 1; return t > drops[0] ? <mesh key={`s${i}`} position={add(bowl, [0.02 * Math.sin(i * 3 + t), 0.05 + 0.4 * u, 0])} scale={0.03 + 0.06 * u} userData={{ outline: false }}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#f4ece4" transparent opacity={0.5 * (1 - u)} depthWrite={false} /></mesh> : null; })}</> };
    },
  },
  {
    id: "s11l", from: W("S11", 5, "you tap") - 0.1,
    render: (t, k) => {
      const xp = DEN.xylo;
      const p = add(xp, [0.1, 0, 0.75]);
      const cam = move([add(xp, [0.3, 1.5, 2.3]), add(xp, [0, 1.75, 0]), 40], [add(xp, [0.25, 1.5, 2.05]), add(xp, [0, 1.78, 0]), 39], k);
      const t0 = W("S11", 5, "tap");
      const note = Math.floor((t - t0) / 0.42);
      const ni = ((note % XYLO.length) + XYLO.length) % XYLO.length;
      const nx = xp[0] - 0.75 + ni * 0.25;
      const tip: V3 = [nx, denCeil(nx - D[0], xp[2] - D[2]) - XYLO[ni] - (denCeil(nx - D[0], xp[2] - D[2]) - 2.6) + 0.1, xp[2]];
      const cols = ["#ff6a6a", "#ffb04a", "#ffe04a", "#7aff8a", "#6ad8ff", "#8a7aff", "#ff7ad8"];
      return { mood: "home", cam, focus: add(xp, [0, 1.7, 0]), blur: 1.2, node: <>{home(t, cam.pos)}
        {you(t, p, cam.pos, "home", { back: true, prop: "stick", armR: [150 + 8 * Math.sin((t - t0) * 15), 20], frontR: true }, { id: ME })}
        {t > t0 ? <Echo p={tip} t={t} t0={t0 + note * 0.42} r={0.45} n={2} d={0.6} col={cols[ni]} /> : null}</> };
    },
  },
  {
    id: "s11m", from: L611.start - 0.1,
    render: (t, k) => {
      const m = DEN.marks;
      const cam = move([add(m, [1.3, 0.05, 0.25]), add(m, [0, -0.02, 0]), 40], [add(m, [1.15, 0.05, 0.2]), add(m, [0, -0.02, 0]), 38], k);
      return { mood: "home", cam, focus: m, blur: 1.8, node: <>{home(t, cam.pos, { marks: 24 })}<OilLamp p={add(m, [0.5, -0.9, 0.5])} t={t} /></>,
        over: <Tag a={ramp(t, W("S11", 6, "twenty four") - 0.1, W("S11", 6, "twenty four") + 0.15)} text="24 MARKS" x={1440} y={210} col="#ffd23a" size={84} /> };
    },
  },
  {
    id: "s11n", from: W("S11", 6, "and for the first") - 0.1,
    render: (t, k) => {
      const cam = move([add(BED, [0.3, 1.0, 2.3]), add(BED, [-0.2, 0.5, 0]), 40], [add(BED, [0.15, 0.95, 2.0]), add(BED, [-0.25, 0.5, 0]), 38], k);
      return { mood: "home", cam, focus: BED, blur: 1.2, node: <>{home(t, cam.pos, { marks: 24 })}
        {you(t, add(BED, [0.95, 0.42, 0.3]), cam.pos, "home", { expr: "relief", armL: [160, 150], armR: [160, 150] }, { id: ME, roll: 1.45, s: 0.92 })}{steve(t, cam.pos, add(BED, [-0.1, 0.33, 0.55]), 1.0)}</> };
    },
  },
  {
    id: "s11o", from: L711.start - 0.4,
    render: (t, k) => {
      const c = add(BED, [-0.45, 0.9, 1.45]);
      const cam = move([c, add(BED, [-0.75, 0.55, 0.3]), 36], [add(c, [-0.03, -0.03, -0.12]), add(BED, [-0.75, 0.55, 0.3]), 34], k);
      const sleep = t > L711.end + 0.2;
      return { mood: "home", cam, focus: add(BED, [0.95, 0.42, 0.3]), blur: 1.8, exposure: -0.5 * ramp(t, L711.end + 0.2, L711.end + 1.2), node: <>{home(t, cam.pos, { marks: 24, lamps: 1 })}
        {you(t, add(BED, [0.95, 0.42, 0.3]), cam.pos, "home", { expr: sleep ? "relief" : "smile", blink: sleep, armL: [160, 150], armR: [160, 150] }, { id: ME, roll: 1.45, s: 0.92 })}{steve(t, cam.pos, add(BED, [-0.1, 0.33, 0.55]), 1.0)}</> };
    },
  },
];

// ================================================================== S12: day 30
const RING = W("S12", 0, "the bell rings");
const STR: V3 = add(D, [-0.9, 0, 2.6]);
const HERO12: V3 = add(D, [0.4, 0, 1.5]);
const stranger = (t: number, p: V3, cam: V3, f: object = {}) => <Who id="stranger" sp="stranger" t={t} p={p} cam={cam} mood="home" res={1.3} seed={5} f={{ facing: 1, ...f }} />;
const s12: Shot[] = [
  {
    id: "s12a", from: L012.start - 0.6, enter: { kind: "black", d: 0.6 },
    render: (t, k) => {
      const cam = move([add(BED, [1.1, 0.9, 1.4]), add(BED, [0, 0.3, 0]), 40], null, k);
      const up = ramp(t, RING + 0.1, RING + 0.5);
      return { mood: "home", cam, focus: BED, blur: 1.4, exposure: -0.3, node: <>{home(t, cam.pos, { marks: 24, lamps: 1 })}
        {up < 0.5 ? you(t, add(BED, [0.95, 0.42, 0.3]), cam.pos, "home", { expr: "relief", blink: true }, { id: ME, roll: 1.45, s: 0.92 }) : you(t, add(BED, [0.2, 0.15, 0.2]), cam.pos, "home", { mode: "sit", expr: "shock" }, { id: ME })}
        {steve(t, cam.pos, add(BED, [-0.1, 0.33, 0.55]), 1.0)}</> };
    },
  },
  {
    id: "s12b", from: W("S12", 0, "from above") - 0.15,
    render: (t, k) => {
      const t0 = W("S12", 0, "from above") - 0.15;
      const cam = move([add(SH, [0.4, 11.2, 1.1]), add(SH, [0, 15.6, 0]), 42], [add(SH, [0.4, 11.5, 1.0]), add(SH, [0, 15.7, 0]), 40], k);
      const sw = 0.4 * Math.sin((t - t0) * 6);
      return { mood: "fox", cam, focus: add(SH, [0, 15.6, 0]), blur: 0.6, exposure: 0.3, node: <><Shaft t={t} swing={sw} /><Echo p={add(SH, [0, 15.4, 0])} t={t} t0={t0 + 0.2} r={1.4} n={3} flat d={1.2} col="#ffe8b0" /></> };
    },
  },
  {
    id: "s12c", from: L112.start - 0.5,
    render: (t, k) => {
      const t0 = L112.start - 0.5;
      const top = hallCeil(ROPE[0], ROPE[2]);
      const y = Math.max(0, (top - 1.8) * (1 - ramp(t, t0, t0 + 0.9)));
      const sp = add(ROPE, [0.08, y, 0.06]);
      const cam = move([add(ROPE, [2.4, 1.0, 2.8]), add(ROPE, [0, 1.6, 0]), 44], null, k);
      return { mood: "fire", cam, focus: add(ROPE, [0, 1.4, 0]), blur: 0.8, exposure: 0.15, node: <><Hall t={t} waterLit={0.6} log={-1} cam={cam.pos} rope={0.6} /><Beam a={add(ROPE, [0, top - 0.1, 0])} b={add(ROPE, [0.3, 0, 0.3])} k={1.4} />
        {stranger(t, sp, cam.pos, { armL: [170, 0], armR: y > 0.05 ? [170, 0] : [70, 20], frontR: true, prop: y > 0.05 ? null : "torchLight", facing: 0 })}
        {y > 0.05 ? null : <Beam a={add(sp, [0.35, 1.25, 0.1])} b={add(sp, [3.0, 0.2, 2.0])} />}</> };
    },
  },
  {
    id: "s12d", from: W("S12", 1, "nobody has") - 0.1,
    render: (t, k) => {
      const sweep = ramp(t, W("S12", 1, "nobody has"), L112.end + 0.2);
      const tgt = lerp3(add(DEN.paint, [-1.2, -0.3, 0.2]), add(D, [-1.2, denCeil(-1.2, 0.8) - 0.1, 0.8]), sweep);
      const cam = move([add(D, [1.8, 1.4, 2.6]), add(D, [-1.2, 1.5, -1.6]), 48], [add(D, [1.6, 1.35, 2.4]), add(D, [-1.4, 2.0, -0.6]), 50], k);
      return { mood: "home", cam, focus: tgt, blur: 0.7, exposure: -0.2, node: <>{home(t, cam.pos, { marks: 24, lamps: 1 })}{stranger(t, STR, cam.pos, { armR: [80, 10], frontR: true, prop: "torchLight", back: true })}
        <Beam a={add(STR, [0.3, 1.35, -0.1])} b={tgt} /></> };
    },
  },
  {
    id: "s12e", from: L212.start - 0.1,
    render: (t, k) => {
      const cam = move([add(HERO12, [-0.3, 1.5, 1.4]), add(HERO12, [0, 1.42, 0]), 32], [add(HERO12, [-0.25, 1.5, 1.2]), add(HERO12, [0, 1.44, 0]), 30], k);
      return { mood: "home", cam, focus: add(HERO12, [0, 1.42, 0]), blur: 2.2, node: <>{home(t, cam.pos, { marks: 24 })}{you(t, HERO12, cam.pos, "home", { expr: "shock", facing: -1, headTilt: 8 }, { id: ME, res: 1.8 })}</> };
    },
  },
  {
    id: "s12f", from: L312.start - 0.1,
    render: (t, k) => {
      const cam = move([add(STR, [0.9, 1.2, 1.4]), add(STR, [0, 1.5, 0]), 34], [add(STR, [0.8, 1.2, 1.2]), add(STR, [0, 1.52, 0]), 33], k);
      return { mood: "home", cam, focus: add(STR, [0, 1.5, 0]), blur: 1.8, node: <>{home(t, cam.pos, { marks: 24 })}{stranger(t, STR, cam.pos, { armL: [40, 40], armR: [60, 30], frontR: true, prop: "case", facing: 1 })}</> };
    },
  },
  {
    id: "s12g", from: W("S12", 3, "your million") - 0.15,
    render: (t, k) => {
      const tb = DEN.table;
      const put = ramp(t, W("S12", 3, "your million"), L312.end + 0.2);
      const sp = lerp3(STR, add(tb, [-0.75, 0, 0.35]), ramp(t, W("S12", 3, "your million") - 0.15, W("S12", 3, "million")));
      const cam = move([add(tb, [-0.2, 1.4, 2.4]), add(tb, [-0.3, 0.9, 0]), 40], null, k);
      return { mood: "home", cam, focus: add(tb, [0, 0.8, 0]), blur: 1.2, node: <>{home(t, cam.pos, { marks: 24, caseOn: put > 0.9 })}
        {stranger(t, sp, cam.pos, { facing: 1, armR: [60 + 30 * put, 20], frontR: true, prop: put > 0.9 ? null : "case" })}{you(t, add(tb, [0.9, 0, 0.6]), cam.pos, "home", { expr: "nervous", facing: -1 }, { id: ME })}</> };
    },
  },
  {
    id: "s12h", from: L412.start - 0.1,
    render: (t, k) => {
      const tb = DEN.table;
      const ins = W("S12", 4, "then at your table"), st = W("S12", 4, "your stars"), sv = W("S12", 4, "steve");
      const which = t < W("S12", 4, "you look at") ? 0 : t < ins - 0.1 ? 1 : t < st - 0.1 ? 2 : t < sv - 0.1 ? 3 : 4;
      const cams: [V3, V3, number][] = [
        [add(tb, [0.7, 1.4, 1.6]), add(tb, [0.05, 0.84, 0]), 34],
        [add(tb, [0.55, 1.3, 1.3]), add(tb, [0.05, 0.86, 0]), 32],
        [add(tb, [-0.6, 1.2, 1.3]), add(tb, [0, 0.7, 0]), 38],
        [add(BED, [0.1, 0.5, 0.1]), add(BED, [0.6, denCeil(BED[0] - D[0], BED[2] - D[2]), -0.9]), 60],
        [add(DEN.pool, [0.25, 0.22, 0.6]), add(DEN.pool, [0.15, 0.06, 0]), 32],
      ];
      const cam = move(cams[which], null, k);
      return { mood: "home", cam, focus: cams[which][1], blur: which === 3 ? 0.4 : 2.0, node: <>{home(t, cam.pos, { marks: 24, caseOn: true })}{which === 4 ? steve(t, cam.pos) : null}</>,
        over: which <= 1 ? <Tag a={ramp(t, L412.start, L412.start + 0.2)} text="$1,000,000" x={1440} y={210} col="#7aff8a" size={84} /> : undefined };
    },
  },
  {
    id: "s12i", from: L512.start - 0.15,
    render: (t, k) => {
      const cam = move([add(HERO12, [0.3, 1.45, 1.35]), add(HERO12, [0, 1.38, 0]), 32], [add(HERO12, [0.26, 1.45, 1.15]), add(HERO12, [0, 1.4, 0]), 30], k);
      return { mood: "home", cam, focus: add(HERO12, [0, 1.38, 0]), blur: 2.2, node: <>{home(t, cam.pos, { marks: 24, caseOn: true })}{you(t, HERO12, cam.pos, "home", { expr: t > L512.end ? "grin" : "smile", prop: "steve", headTilt: 10 }, { id: ME, res: 1.8 })}</> };
    },
  },
];

// ================================================================== S13: the question
const s13: Shot[] = [
  {
    id: "s13a", from: L013.start - 0.75,
    render: (t, k) => {
      const top = hallCeil(ROPE[0], ROPE[2]);
      const y = (top - 1.7) * ramp(t, L013.start - 0.75, L013.start + 3.2);
      const cam = move([add(ROPE, [2.0, 0.9, 3.0]), add(ROPE, [0, 1.8, 0]), 46], [add(ROPE, [1.9, 1.0, 2.8]), add(ROPE, [0, 2.6, 0]), 48], k);
      const hp = add(ROPE, [1.1, 0, 0.9]);
      return { mood: "fire", cam, focus: add(ROPE, [0, 2, 0]), blur: 0.6, node: <><Hall t={t} waterLit={0.6} log={-1} cam={cam.pos} rope={0.5} />
        {stranger(t, add(ROPE, [0.08, y, 0.06]), cam.pos, { armL: [170, 0], armR: [170, 0], back: true })}
        {you(t, hp, cam.pos, "fire", { expr: "grin", armL: [150 + 20 * Math.sin(t * 7), 30], prop: "steve", facing: -1 }, { id: ME })}<OilLamp p={add(hp, [0.4, 0, 0.3])} t={t} /></> };
    },
  },
  {
    id: "s13b", from: W("S13", 0, "and whats the") - 0.2,
    render: (t, k) => {
      const cam = move([add(SH, [0.05, 13.5, 0.05]), add(SH, [0, 0, 0]), 44], [add(SH, [0.05, 12.0, 0.05]), add(SH, [0, 0, 0]), 40], k);
      const q = ramp(t, W("S13", 0, "tell me") - 0.3, W("S13", 0, "tell me"));
      return { mood: "fox", cam, focus: SH, blur: 0.5, exposure: 0.1, node: <Shaft t={t} glow={1} rope={false} />,
        over: <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30, background: `rgba(6,4,10,${0.35 * q})` }}>
          <div style={{ opacity: ramp(t, W("S13", 0, "and whats the") - 0.2, W("S13", 0, "and whats the") + 0.2), fontFamily: "Poppins", fontWeight: 800, fontSize: 92, color: "#f4ece0", textShadow: "0 6px 0 #14101a, 0 0 30px rgba(0,0,0,0.6)" }}>WOULD YOU LAST <span style={{ color: "#ffd23a" }}>30 DAYS</span>?</div>
          <div style={{ opacity: q, fontFamily: "Poppins", fontWeight: 800, fontSize: 60, color: "#7affc8", textShadow: "0 5px 0 #14101a" }}>WHAT WOULD YOU BUILD FIRST? 👇</div>
        </AbsoluteFill> };
    },
  },
];

export const C4_SHOTS: Shot[] = [...s11, ...s12, ...s13];
export const hud4 = (t: number): Hud => {
  if (t < L011.start - 0.6 || t > L512.end + 0.5) return null;
  const P: [number, number][] = [[15, W("S11", 4, "the last real problem")]];
  let prob: [number, number] | undefined;
  for (const p of P) if (t >= p[1] - 0.05) prob = p;
  if (t >= W("S12", 1, "thirty days") - 0.05) return { day: "30", marks: 24 };
  const day = Math.round(19 + 5 * ramp(t, L011.start, L611.start));
  return { day: String(day), marks: day, prob };
};
void shake;
