// Cave sets (toon materials, painted rock, every surface a pure function of t):
//  HALL  (origin)      the great chamber: lumpy dome, stalactites, the stream channel, the low overhang where you wake,
//                      the bell rope into its shaft, the foxfire log, the old backpack.
//  DEN   (x = +30)     the small dry chamber with a chimney crack: empty at first, dressed into a home by day 30.
//  TUNNEL (x = -30)    a low crawl tube (bad air).
//  STREET (z = -80)    the night street of S01.
//  SHAFT (z = +60)     looking up the bell shaft (daylight, the bell) / down to the warm den glow.
import React from "react";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { boxG, canvasTex, coneG, coreMat, cylG, Flame, Label, M, sphG, torG } from "../inkbeat/core/kit";
import { toonMaterial } from "../inkbeat/mat/materials";
import type { V3 } from "../inkbeat/types";

export const D: V3 = [30, 0, 0];
export const T: V3 = [-30, 0, 0];
export const ST: V3 = [0, 0, -80];
export const SH: V3 = [0, 0, 60];
export const WAKE: V3 = [-2.6, 0, 0.6];
export const ROPE: V3 = [-4.6, 0, -2.2];
export const LOG: V3 = [1.3, 0, 3.0];
export const PACK: V3 = [-6.2, 0, 4.2];
export const STREAM_X = 3.3;

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const hsh = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const n3 = (x: number, y: number, z: number, s: number) =>
  0.55 * Math.sin(x * 1.9 + s) * Math.sin(y * 2.3 + s * 1.3) * Math.sin(z * 1.7 + s * 0.7) + 0.3 * Math.sin(x * 4.1 + y * 3.3 + z * 2.9 + s * 2.1) + 0.15 * Math.sin(x * 8.3 - y * 6.1 + z * 7.7 + s);

// ------------------------------------------------------------------ geometry (bounded caches)
const gcache = new Map<string, THREE.BufferGeometry>();
const gget = (k: string, make: () => THREE.BufferGeometry) => {
  let g = gcache.get(k);
  if (!g) { if (gcache.size > 400) gcache.clear(); g = make(); gcache.set(k, g); }
  return g;
};
/** a lumpy smooth rock (unit radius before scale) */
export const rockG = (seed: number, amp = 0.24, detail = 3) => gget(`r${seed}|${amp}|${detail}`, () => {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, detail);
  g.deleteAttribute("normal"); g.deleteAttribute("uv");
  g = mergeVertices(g);
  const P = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < P.count; i++) {
    const x = P.getX(i), y = P.getY(i), z = P.getZ(i);
    const k = 1 + amp * n3(x * 1.3, y * 1.3, z * 1.3, seed * 1.77);
    P.setXYZ(i, x * k, y * k, z * k);
  }
  g.computeVertexNormals();
  return g;
});
/** the inside of a lumpy dome (BackSide), unit sphere displaced inward/outward */
const domeG = (seed: number, amp: number) => gget(`d${seed}|${amp}`, () => {
  let g: THREE.BufferGeometry = new THREE.SphereGeometry(1, 96, 48);
  g.deleteAttribute("normal"); g.deleteAttribute("uv");
  g = mergeVertices(g);
  const P = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < P.count; i++) {
    const x = P.getX(i), y = P.getY(i), z = P.getZ(i);
    const k = 1 + amp * n3(x * 3, y * 3, z * 3, seed);
    P.setXYZ(i, x * k, y * k, z * k);
  }
  g.computeVertexNormals();
  return g;
});
/** a floor plane: flat inside the play ellipse (feet never sink), bumps toward the walls, an optional stream channel */
const floorG = (key: string, w: number, d: number, rx: number, rz: number, channel: [number, number] | null) => gget(`f${key}`, () => {
  const g = new THREE.PlaneGeometry(w, d, 120, 120);
  g.rotateX(-Math.PI / 2);
  const P = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < P.count; i++) {
    const x = P.getX(i), z = P.getZ(i);
    const r = Math.hypot(x / rx, z / rz);
    let y = 0.35 * Math.max(0, r - 0.8) ** 1.4 * (1 + 0.6 * n3(x * 0.6, 0, z * 0.6, 3)) + 0.025 * n3(x * 2, 1, z * 2, 7) * Math.min(1, Math.max(0, r - 0.5) * 2);
    if (channel) {
      const c = Math.max(0, 1 - Math.abs(x - channel[0]) / channel[1]);
      y -= 0.5 * Math.min(1, c * 1.8);
    }
    P.setY(i, y);
  }
  g.computeVertexNormals();
  return g;
});

const ROCK = "#6e625a", ROCK_D = "#564a44", FLOOR = "#5e524a", CLAY = "#7a5a44", WET = "#8a8a88";
const backMat = new Map<string, THREE.Material>();
const domeMat = (c: string) => {
  let m = backMat.get(c);
  if (!m) { m = toonMaterial({ color: c, tex: "rock", texScale: 0.6, side: THREE.BackSide }); backMat.set(c, m); }
  return m;
};

export const Rock: React.FC<{ p: V3; s: V3 | number; seed: number; c?: string; amp?: number; r?: V3 }> = ({ p, s, seed, c = ROCK, amp = 0.24, r }) => (
  <M g={rockG(seed, amp)} p={p} s={s} r={r ?? [hsh(seed) * 3, hsh(seed + 1) * 6, hsh(seed + 2) * 3]} c={c} tex="rock" ts={0.8} />
);
/** a stalactite hanging from `p` (its root), length h; tip glints wet */
export const Stalactite: React.FC<{ p: V3; h: number; r?: number; seed?: number }> = ({ p, h, r = 0.12, seed = 0 }) => (
  <group position={p} rotation={[Math.PI + 0.08 * (hsh(seed) - 0.5), 0, 0.1 * (hsh(seed + 3) - 0.5)]}>
    <M g={coneG(r, h, 10)} p={[0, h / 2 - 0.05, 0]} c="#8a7c6e" tex="rock" />
    <M g={sphG(r * 1.3, 10)} p={[0, -0.02, 0]} c="#7a6c60" />
  </group>
);
export const Stalagmite: React.FC<{ p: V3; h: number; r?: number }> = ({ p, h, r = 0.18 }) => (
  <group position={p}>
    <M g={coneG(r, h, 12)} p={[0, h / 2, 0]} c="#8e8070" tex="rock" />
    <M g={sphG(r * 1.4, 12)} p={[0, 0.02, 0]} s={[1, 0.4, 1]} c="#7a6c60" />
  </group>
);

/** flowing water: a dark teal surface + drifting glints (lit = how much it reflects the light around) */
export const Water: React.FC<{ p: V3; w: number; l: number; t: number; lit?: number; speed?: number; col?: string; glint?: string; level?: number }> = ({ p, w, l, t, lit = 1, speed = 0.6, col = "#1c5262", glint = "#a8f0ff", level = 0 }) => (
  <group position={[p[0], p[1] + level, p[2]]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={toonMaterial({ color: col, emissive: col, emissiveIntensity: 0.25 * lit })} userData={{ outline: false }}>
      <planeGeometry args={[w, l]} />
    </mesh>
    {lit > 0.05 ? Array.from({ length: Math.round(l * 3) }, (_, i) => {
      const z = (((hsh(i) * l + t * speed * (0.7 + 0.6 * hsh(i + 9))) % l) + l) % l - l / 2;
      return <mesh key={i} position={[(hsh(i + 4) - 0.5) * w * 0.8, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]} material={coreMat(glint, 0.55 * lit, 0.7)} userData={{ outline: false }}>
        <planeGeometry args={[0.03 + 0.04 * hsh(i + 5), 0.25 + 0.4 * hsh(i + 6)]} />
      </mesh>;
    }) : null}
  </group>
);

/** foxfire: a cluster of glowing mushroom caps (k = brightness 0..1); light = add a point light */
export const Shrooms: React.FC<{ p: V3; n?: number; k?: number; seed?: number; spread?: number; light?: number; s?: number; down?: boolean }> = ({ p, n = 9, k = 1, seed = 0, spread = 0.35, light = 0, s = 1, down = false }) => (
  <group position={p} scale={s} rotation={down ? [Math.PI, 0, 0] : [0, 0, 0]}>
    {Array.from({ length: n }, (_, i) => {
      const a = hsh(seed + i) * 6.28, r = spread * Math.sqrt(hsh(seed + i + 50)), sz = 0.03 + 0.05 * hsh(seed + i + 90);
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      return (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, sz * 0.8, 0]} material={coreMat("#bfffe0", 0.55 * k + 0.05)} userData={{ outline: false }}><cylinderGeometry args={[sz * 0.18, sz * 0.25, sz * 1.6, 6]} /></mesh>
          <mesh position={[0, sz * 1.6, 0]} scale={[1, 0.45, 1]} material={coreMat("#58ffb4", 0.95 * k + 0.05)} userData={{ outline: false }}><sphereGeometry args={[sz, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
        </group>
      );
    })}
    {light > 0 ? <pointLight position={[0, 0.4, 0]} color="#5affb8" intensity={light * k} distance={7} decay={1.6} /> : null}
  </group>
);

/** the rotten log of S04 */
export const Log: React.FC<{ p: V3; glow: number; yaw?: number; light?: number }> = ({ p, glow, yaw = 0.3, light = 4 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={cylG(0.17, 0.2, 1.7, 14)} p={[0, 0.17, 0]} r={[0, 0, Math.PI / 2]} c="#5a4030" tex="wood" />
    <M g={sphG(0.17, 12)} p={[0.85, 0.17, 0]} s={[0.3, 1, 1]} c="#7a5a40" />
    <M g={cylG(0.04, 0.05, 0.5, 6)} p={[-0.3, 0.32, 0.12]} r={[0.4, 0, 1.1]} c="#4a3426" />
    <Shrooms p={[0.1, 0.33, 0]} n={16} spread={0.55} k={glow} seed={3} light={light} />
    <Shrooms p={[-0.5, 0.3, 0.1]} n={5} spread={0.12} k={glow} seed={31} />
  </group>
);

/** the bell rope, hanging from its shaft; sway 0..1 (pulled) */
export const Rope: React.FC<{ p: V3; top: number; sway?: number; pull?: number }> = ({ p, top, sway = 0, pull = 0 }) => {
  const bot = 0.35 - pull * 0.25;
  const L = top - bot;
  return (
    <group position={p}>
      <group position={[0, top, 0]} rotation={[0, 0, 0.04 * sway]}>
        <M g={cylG(0.022, 0.022, L, 8)} p={[0, -L / 2, 0]} c="#b89060" tex="fabric" />
        <M g={sphG(0.045, 10)} p={[0, -L, 0]} s={[1, 1.4, 1]} c="#a07a4a" />
      </group>
    </group>
  );
};
/** the bell (bronze) */
export const Bell: React.FC<{ p: V3; swing?: number; s?: number }> = ({ p, swing = 0, s = 1 }) => (
  <group position={p} scale={s} rotation={[0, 0, swing]}>
    <M g={cylG(0.03, 0.03, 0.4, 8)} p={[0, 0.2, 0]} c="#3a3a40" />
    <M g={cylG(0.14, 0.3, 0.42, 20, true)} p={[0, -0.2, 0]} c="#c8963a" tex="metal" side={THREE.DoubleSide} />
    <M g={sphG(0.15, 16)} p={[0, 0.0, 0]} s={[1, 0.5, 1]} c="#c8963a" tex="metal" />
    <M g={torG(0.3, 0.035)} p={[0, -0.41, 0]} r={[Math.PI / 2, 0, 0]} c="#b0822e" />
    <M g={sphG(0.06, 10)} p={[0.06 * Math.sin(swing * 3), -0.42, 0]} c="#4a4a50" />
  </group>
);

// ------------------------------------------------------------------ the great hall
const HALL_R: V3 = [11, 5.6, 8.8];
/** ceiling height of the hall dome above (x, z) (before the lumps) */
export const hallCeil = (x: number, z: number) => HALL_R[1] * Math.sqrt(Math.max(0.02, 1 - (x / HALL_R[0]) ** 2 - (z / HALL_R[2]) ** 2));
const HALL_ROCKS = (() => {
  const out: { p: V3; s: V3; seed: number }[] = [];
  const n = 30;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.1 * hsh(i);
    const x = Math.cos(a) * 9.3, z = Math.sin(a) * 7.3;
    if (Math.abs(x - STREAM_X) < 1.5) continue;
    const sc = 1.6 + 1.3 * hsh(i + 7);
    out.push({ p: [x, 0.5 + 0.6 * hsh(i + 3), z], s: [sc, sc * (0.8 + 0.5 * hsh(i + 5)), sc], seed: 100 + i });
  }
  for (let i = 0; i < 14; i++) { // a second, higher ring: the vault's shoulders
    const a = (i / 14) * Math.PI * 2 + 0.2;
    const x = Math.cos(a) * 8.6, z = Math.sin(a) * 6.6;
    out.push({ p: [x, 3.0 + 0.6 * hsh(i + 40), z], s: [2.2, 1.6, 2.0], seed: 140 + i });
  }
  return out;
})();
const HALL_TITES = (() => {
  const out: { p: V3; h: number; r: number; seed: number }[] = [];
  for (let i = 0; i < 70; i++) {
    const x = (hsh(i + 200) - 0.5) * 17, z = (hsh(i + 300) - 0.5) * 13;
    if ((x / 8.6) ** 2 + (z / 6.8) ** 2 > 1) continue;
    if (Math.hypot(x - WAKE[0], z - WAKE[2]) < 1.6) continue;
    if (Math.hypot(x - ROPE[0], z - ROPE[2]) < 0.9) continue;
    const c = hallCeil(x, z);
    const h = 0.4 + 1.6 * hsh(i + 400) ** 2;
    out.push({ p: [x, c + 0.25, z], h: Math.min(h, c - 2.3), r: 0.08 + 0.12 * hsh(i + 500), seed: i });
  }
  return out;
})();
const PEBBLES = Array.from({ length: 70 }, (_, i) => {
  const x = (hsh(i + 600) - 0.5) * 15, z = (hsh(i + 700) - 0.5) * 12;
  return { p: [x, 0.02, z] as V3, s: 0.05 + 0.16 * hsh(i + 800) ** 2, seed: 600 + i };
}).filter((q) => Math.abs(q.p[0] - STREAM_X) > 1.2 && (q.p[0] / 8.6) ** 2 + (q.p[2] / 6.8) ** 2 < 1 && Math.hypot(q.p[0] - WAKE[0], q.p[2] - WAKE[2]) > 1.2);

export type HallOpts = {
  t: number;
  /** stream glints (0 in total darkness) */
  waterLit?: number;
  /** foxfire log brightness, -1 = log absent (gone with the flood / in the den) */
  log?: number;
  /** rope sway */
  rope?: number;
  pack?: boolean;
  /** stream level offset (flood) */
  flood?: number;
  /** hide pieces near the lens */
  cam?: V3;
};
export const Hall: React.FC<HallOpts> = ({ t, waterLit = 1, log = 0, rope = 0, pack = true, flood = 0, cam }) => {
  const far = (p: V3, r: number) => !cam || Math.hypot(p[0] - cam[0], p[1] - cam[1], p[2] - cam[2]) > r + 0.35;
  return (
    <group>
      <mesh geometry={floorG("hall", 30, 26, 9.5, 7.5, [STREAM_X, 1.0])} material={toonMaterial({ color: FLOOR, tex: "rock", texScale: 0.5 })} receiveShadow castShadow />
      <mesh geometry={domeG(5, 0.05)} material={domeMat(ROCK_D)} scale={HALL_R} receiveShadow />
      {HALL_ROCKS.map((r) => (far(r.p, r.s[0] * 1.2) ? <Rock key={r.seed} p={r.p} s={r.s} seed={r.seed} /> : null))}
      {HALL_TITES.map((s) => (far(s.p, s.h + 0.3) ? <Stalactite key={s.seed} p={s.p} h={s.h} r={s.r} seed={s.seed} /> : null))}
      {[[-6.5, -3.5, 1.2], [-5.2, 4.8, 0.8], [5.8, -4.2, 1.5], [6.6, 3.2, 1.0], [-1.0, -5.6, 0.9], [7.4, -0.6, 1.3], [-7.6, 0.8, 1.1]].map(([x, z, h], i) => <Stalagmite key={i} p={[x, 0, z]} h={h} r={0.16 + 0.04 * i % 0.1} />)}
      {PEBBLES.map((q) => (far(q.p, 0.3) ? <Rock key={q.seed} p={q.p} s={[q.s, q.s * 0.6, q.s]} seed={q.seed} c={ROCK_D} /> : null))}
      {/* the low overhang above the place you wake up */}
      <Rock p={[WAKE[0] - 0.1, 3.75, WAKE[2] - 0.2]} s={[2.1, 2.05, 1.8]} seed={11} amp={0.1} c={ROCK} />
      {/* stream: water + wet banks + sharp rocks */}
      <Water p={[STREAM_X, -0.2, 0]} w={1.9 + 6 * flood} l={22} t={t} lit={waterLit} level={flood} />
      {Array.from({ length: 16 }, (_, i) => {
        const z = -7.5 + i, side = i % 2 ? 1 : -1;
        const p: V3 = [STREAM_X + side * (0.98 + 0.1 * hsh(i)), -0.06, z + 0.4 * hsh(i + 3)];
        return far(p, 0.4) ? <Rock key={i} p={p} s={[0.28 + 0.18 * hsh(i + 1), 0.16, 0.3]} seed={900 + i} c={WET} amp={0.3} /> : null;
      })}
      {[[-0.2, 1.4], [0.35, -1.8], [-0.4, 4.1]].map(([dx, z], i) => <Rock key={`s${i}`} p={[STREAM_X + dx, -0.25, z]} s={[0.22, 0.2, 0.18]} seed={950 + i} c="#9a9894" amp={0.45} />)}
      {/* clay by the water: footprints */}
      <M g={boxG(1.6, 0.02, 6)} p={[STREAM_X - 1.35, 0.005, 2]} c={CLAY} tex="sand" cast={false} />
      {log >= 0 ? <Log p={LOG} glow={log} /> : null}
      {/* the rope into its shaft */}
      <M g={torG(0.55, 0.22)} p={[ROPE[0], hallCeil(ROPE[0], ROPE[2]) - 0.25, ROPE[2]]} r={[Math.PI / 2, 0, 0]} c={ROCK_D} tex="rock" />
      <mesh position={[ROPE[0], hallCeil(ROPE[0], ROPE[2]) - 0.2, ROPE[2]]} rotation={[Math.PI / 2, 0, 0]} material={coreMat("#000000", 1)} userData={{ outline: false }}><circleGeometry args={[0.5, 24]} /></mesh>
      <Rope p={ROPE} top={hallCeil(ROPE[0], ROPE[2]) + 0.2} sway={rope} />
      {pack ? <Backpack p={PACK} /> : null}
    </group>
  );
};

/** the old backpack, half sunk in silt */
export const Backpack: React.FC<{ p: V3; open?: boolean }> = ({ p, open = false }) => (
  <group position={p} rotation={[0.25, 0.6, 0.1]}>
    <M g={boxG(0.42, 0.52, 0.24)} p={[0, 0.2, 0]} c="#7a4a3a" tex="fabric" />
    <M g={boxG(0.34, 0.2, 0.08)} p={[0, 0.12, 0.15]} c="#6a3e30" tex="fabric" />
    <M g={boxG(0.44, open ? 0.06 : 0.16, 0.26)} p={[0, open ? 0.48 : 0.46, open ? -0.12 : 0]} r={[open ? -0.9 : 0, 0, 0]} c="#6a3e30" tex="fabric" />
    <M g={torG(0.12, 0.022)} p={[0, 0.5, -0.12]} c="#3a2a24" />
    <M g={boxG(0.9, 0.14, 0.7)} p={[0, -0.02, 0]} c={CLAY} tex="sand" />
  </group>
);

// ------------------------------------------------------------------ the den
const DEN_R: V3 = [5.2, 3.3, 4.6];
export const denCeil = (x: number, z: number) => DEN_R[1] * Math.sqrt(Math.max(0.02, 1 - (x / DEN_R[0]) ** 2 - (z / DEN_R[2]) ** 2));
export const DEN = {
  fire: add(D, [1.4, 0, -1.6]) as V3,
  bed: add(D, [-2.3, 0, 1.0]) as V3,
  table: add(D, [1.9, 0, 1.3]) as V3,
  shelf: add(D, [3.75, 1.05, 0.2]) as V3,
  pool: add(D, [-0.4, 0, 2.6]) as V3,
  xylo: add(D, [2.6, 0, -2.4]) as V3,
  paint: add(D, [-0.6, 1.35, -3.55]) as V3,
  marks: add(D, [-3.74, 1.3, -1.0]) as V3,
  door: add(D, [-1.2, 0, 4.1]) as V3,
  trap: add(D, [3.4, 0, 3.2]) as V3,
};
const DEN_ROCKS = (() => {
  const out: { p: V3; s: V3; seed: number }[] = [];
  const n = 18;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.15;
    const x = Math.cos(a) * 4.5, z = Math.sin(a) * 4.0;
    if (Math.abs(x - (DEN.door[0] - D[0])) < 1.0 && z > 2) continue; // the way in
    if (z < -3 && Math.abs(x + 0.6) < 2.2) continue; // the painted wall stays clear
    if (x < -3.4 && Math.abs(z + 1.0) < 1.5) continue; // the marks wall stays clear
    const sc = 0.9 + 0.7 * hsh(i + 70);
    out.push({ p: [D[0] + x, 0.35, D[2] + z], s: [sc, sc * 0.9, sc], seed: 300 + i });
  }
  return out;
})();
export type DenOpts = {
  t: number;
  paint?: number; // 0..1 how much of the wall art is drawn
  marks?: number; // tally marks on the wall
  table?: boolean; shelf?: boolean; bed?: number; // bed: 0 none, 0.5 a few roots, 1 full bed
  stars?: number; // 0..1 how many mushroom stars on the ceiling (glow)
  fire?: number; // 0..1 fire size under the chimney (smoke when > 0)
  smoke?: "room" | "chimney" | null;
  lamps?: number; // how many oil lamps are lit
  xylo?: boolean; trap?: boolean; pool?: boolean; dishes?: boolean;
  cam?: V3;
  /** case on the table (S12) */
  caseOn?: boolean;
};
export const Den: React.FC<DenOpts> = ({ t, paint = 0, marks = 0, table = false, shelf = false, bed = 0, stars = 0, fire = 0, smoke = null, lamps = 0, xylo = false, trap = false, pool = true, dishes = false, caseOn = false, cam }) => {
  const far = (p: V3, r: number) => !cam || Math.hypot(p[0] - cam[0], p[1] - cam[1], p[2] - cam[2]) > r + 0.35;
  const chim: V3 = [DEN.fire[0], denCeil(DEN.fire[0] - D[0], DEN.fire[2] - D[2]) - 0.05, DEN.fire[2]];
  return (
    <group>
      <mesh geometry={floorG("den", 14, 12, 4.4, 3.9, null)} material={toonMaterial({ color: "#6a5c50", tex: "rock", texScale: 0.5 })} position={D} receiveShadow castShadow />
      <mesh geometry={domeG(9, 0.06)} material={domeMat("#6a5a50")} position={D} scale={DEN_R} receiveShadow />
      {DEN_ROCKS.map((r) => (far(r.p, r.s[0]) ? <Rock key={r.seed} p={r.p} s={r.s} seed={r.seed} /> : null))}
      {/* the chimney crack */}
      <mesh position={chim} rotation={[Math.PI / 2, 0, 0.5]} material={coreMat("#000000", 1)} userData={{ outline: false }}><planeGeometry args={[0.2, 1.4]} /></mesh>
      {/* the painted wall: a flatter slab */}
      <Rock p={add(D, [-0.6, 1.4, -4.25])} s={[2.9, 1.9, 0.5]} seed={17} amp={0.06} c="#8a7a6a" r={[0, 0, 0]} />
      {paint > 0 ? <Mural p={DEN.paint} k={paint} /> : null}
      {marks > 0 ? <Marks p={DEN.marks} n={marks} /> : null}
      {table ? (
        <group position={DEN.table}>
          <Stalagmite p={[-0.45, 0, 0]} h={0.62} r={0.16} />
          <Stalagmite p={[0.45, 0, 0]} h={0.62} r={0.16} />
          <Rock p={[0, 0.66, 0]} s={[0.75, 0.07, 0.42]} seed={21} amp={0.08} c="#8a7c70" r={[0, 0.1, 0]} />
          {dishes ? <>
            <M g={cylG(0.12, 0.08, 0.07, 14)} p={[-0.25, 0.75, 0.05]} c="#9a8a7a" tex="rock" />
            <M g={cylG(0.06, 0.05, 0.12, 12)} p={[0.1, 0.78, -0.08]} c="#8a8a90" tex="metal" />
            <M g={boxG(0.12, 0.02, 0.06)} p={[0.32, 0.72, 0.1]} c="#e8dcc0" />
          </> : null}
          {caseOn ? <group position={[0.05, 0.84, 0]} rotation={[0, 0.2, 0]}>
            <M g={boxG(0.5, 0.36, 0.12)} c="#b8bcc4" tex="metal" />
            <M g={torG(0.06, 0.012, Math.PI)} p={[0, 0.18, 0]} c="#3a3c44" />
          </group> : null}
        </group>
      ) : null}
      {shelf ? (
        <group position={DEN.shelf}>
          <Rock p={[0, 0, 0]} s={[0.22, 0.05, 0.6]} seed={22} amp={0.06} c="#8a7c70" r={[0, 0, 0]} />
          <M g={cylG(0.05, 0.04, 0.09, 10)} p={[0.02, 0.08, -0.3]} c="#9a8a7a" tex="rock" />
          <M g={boxG(0.14, 0.04, 0.1)} p={[0.02, 0.06, 0.25]} c="#2a2a2e" />
        </group>
      ) : null}
      {bed > 0 ? <RootBed p={DEN.bed} k={bed} /> : null}
      {stars > 0 ? <Stars k={stars} /> : null}
      {fire > 0 ? <group position={DEN.fire}>
        {Array.from({ length: 9 }, (_, i) => <Rock key={i} p={[Math.cos(i * 0.7) * 0.32, 0.04, Math.sin(i * 0.7) * 0.32]} s={0.09} seed={40 + i} c="#4a4440" />)}
        <M g={cylG(0.03, 0.03, 0.5, 6)} p={[0, 0.05, 0]} r={[0, 0.5, Math.PI / 2]} c="#3a2a22" />
        <M g={cylG(0.03, 0.03, 0.5, 6)} p={[0, 0.06, 0]} r={[0, -0.6, Math.PI / 2]} c="#3a2a22" />
        <Flame p={[0, 0.02, 0]} s={0.36 * fire} t={t} seed={2} />
        {smoke === "chimney" ? <Puffs p={[0.05, 0.5, 0]} t={t} h={denCeil(DEN.fire[0] - D[0], DEN.fire[2] - D[2]) - 0.5} /> : null}
      </group> : null}
      {smoke === "room" ? <RoomSmoke t={t} /> : null}
      {Array.from({ length: lamps }, (_, i) => {
        const at: V3[] = [add(DEN.shelf, [0.02, 0.05, -0.05]), add(DEN.table, [0.3, 0.72, -0.1]), add(D, [-3.3, 0.25, -2.3]), add(D, [-1.4, 0.15, 3.0])];
        return <OilLamp key={i} p={at[i % 4]} t={t} seed={i} />;
      })}
      {xylo ? <Xylo p={DEN.xylo} /> : null}
      {trap ? <M g={cylG(0.14, 0.22, 0.6, 10, true)} p={DEN.trap} r={[0, 0, Math.PI / 2]} c="#a8844e" tex="fabric" side={THREE.DoubleSide} /> : null}
      {pool ? <group position={DEN.pool}>
        {Array.from({ length: 10 }, (_, i) => <Rock key={i} p={[Math.cos(i * 0.63) * 0.62, 0.0, Math.sin(i * 0.63) * 0.45]} s={[0.14, 0.09, 0.14]} seed={60 + i} c={WET} />)}
        <Water p={[0, 0.0, 0]} w={1.1} l={0.75} t={t} lit={0.6} speed={0.05} />
      </group> : null}
    </group>
  );
};

/** an oil lamp: stone bowl + steady flame + warm point light */
export const OilLamp: React.FC<{ p: V3; t: number; seed?: number; light?: number }> = ({ p, t, seed = 0, light = 1 }) => {
  const w = 1 + 0.06 * Math.sin(t * 7 + seed * 2) + 0.03 * Math.sin(t * 13 + seed);
  return (
    <group position={p}>
      <M g={cylG(0.1, 0.07, 0.07, 14)} p={[0, 0.035, 0]} c="#8a7e72" tex="rock" />
      <mesh position={[0, 0.11, 0]} scale={[1, 1.8 * w, 1]} material={coreMat("#ffa43a", 1.0)} userData={{ outline: false }}><sphereGeometry args={[0.025, 10, 8]} /></mesh>
      <mesh position={[0, 0.105, 0.005]} scale={[1, 1.6 * w, 1]} material={coreMat("#fff0b0", 1.0)} userData={{ outline: false }}><sphereGeometry args={[0.012, 8, 6]} /></mesh>
      <pointLight position={[0, 0.3, 0]} color="#ffa050" intensity={2.6 * w * light} distance={5} decay={1.6} />
    </group>
  );
};

const puffMats = new Map<number, THREE.MeshBasicMaterial>();
const puffMat = (o: number) => { const q = Math.round(o * 20) / 20; let m = puffMats.get(q); if (!m) { m = new THREE.MeshBasicMaterial({ color: "#7a7078", transparent: true, opacity: q, depthWrite: false }); puffMats.set(q, m); } return m; };
/** soft smoke puffs rising h metres into the chimney crack (no ink, translucent) */
export const Puffs: React.FC<{ p: V3; t: number; h: number; n?: number }> = ({ p, t, h, n = 8 }) => (
  <group position={p}>
    {Array.from({ length: n }, (_, i) => {
      const u = (t * 0.22 + i / n) % 1;
      return <mesh key={i} position={[0.12 * Math.sin(i * 2.1 + t * 0.6) * (1 - u), u * h, 0.1 * Math.cos(i * 1.7) * (1 - u)]} scale={0.1 + 0.22 * u * (1 - 0.6 * u)} material={puffMat(0.4 * (1 - u) * Math.min(1, u * 6))} userData={{ outline: false }}><sphereGeometry args={[1, 12, 8]} /></mesh>;
    })}
  </group>
);
/** smoke filling the den (S09, before the fire is moved) */
const RoomSmoke: React.FC<{ t: number }> = ({ t }) => (
  <>
    {Array.from({ length: 14 }, (_, i) => {
      const u = (t * 0.1 + hsh(i)) % 1;
      return <mesh key={i} position={[D[0] + (hsh(i + 1) - 0.5) * 6, 1.6 + 1.2 * hsh(i + 2) + u * 0.4, D[2] + (hsh(i + 3) - 0.5) * 5]} scale={0.6 + 0.6 * hsh(i + 4)} material={puffMat(0.5)} userData={{ outline: false }}><sphereGeometry args={[1, 14, 10]} /></mesh>;
    })}
  </>
);

/** the root bed: a stone base, a thick mattress of dry roots, a few loose strands, a clay pillow */
const RootBed: React.FC<{ p: V3; k: number }> = ({ p, k }) => (
  <group position={p}>
    <Rock p={[0, 0.05, 0]} s={[1.0, 0.14, 0.58]} seed={25} amp={0.08} c="#6a5a4a" r={[0, 0, 0]} />
    {k > 0.5 ? <M g={sphG(1, 20)} p={[0, 0.2, 0]} s={[0.95, 0.13, 0.5]} c="#b8925c" tex="fabric" ts={0.4} /> : null}
    {Array.from({ length: k > 0.5 ? 0 : Math.round(12 * k) }, (_, i) => (
      <M key={i} g={cylG(0.009, 0.009, 0.55 + 0.3 * hsh(i), 5)} p={[(hsh(i + 1) - 0.5) * 0.7, 0.3 + 0.02 * hsh(i + 7), (hsh(i + 2) - 0.5) * 0.4]} r={[0, 0.4 * (hsh(i + 4) - 0.5), Math.PI / 2]} c={i % 3 ? "#c8a06a" : "#9a7444"} />
    ))}
    {k > 0.8 ? <Rock p={[-0.75, 0.3, 0]} s={[0.2, 0.1, 0.3]} seed={26} amp={0.1} c="#9a8a6e" /> : null}
  </group>
);

/** mushroom "stars" on the den ceiling above the bed */
const Stars: React.FC<{ k: number }> = ({ k }) => (
  <>
    {Array.from({ length: Math.round(46 * k) }, (_, i) => {
      const x = (hsh(i + 1000) - 0.5) * 6.4, z = (hsh(i + 1100) - 0.5) * 5.4;
      if ((x / 4.6) ** 2 + (z / 4.0) ** 2 > 1) return null;
      const y = denCeil(x, z) - 0.04;
      const r = 0.025 + 0.035 * hsh(i + 1200);
      return <mesh key={i} position={[D[0] + x, y, D[2] + z]} material={coreMat(i % 5 ? "#58ffb4" : "#9affd8", 1.0)} userData={{ outline: false }}><sphereGeometry args={[r, 8, 6]} /></mesh>;
    })}
    <pointLight position={[D[0] - 1.6, 2.4, D[2] + 0.8]} color="#40ffb0" intensity={1.6 * k} distance={6} decay={1.6} />
  </>
);

/** stalactites of different lengths (the xylophone) */
export const XYLO = [0.55, 0.75, 0.9, 1.05, 1.2, 1.35, 1.5];
const Xylo: React.FC<{ p: V3 }> = ({ p }) => (
  <>
    {XYLO.map((h, i) => {
      const x = p[0] - 0.75 + i * 0.25, z = p[2] + 0.08 * Math.sin(i * 1.7);
      const c = denCeil(x - D[0], z - D[2]);
      return <Stalactite key={i} p={[x, c + 0.1, z]} h={h + (c - 2.6)} r={0.06 + 0.01 * i} seed={70 + i} />;
    })}
  </>
);

/** charcoal + clay wall art: a sun, an apartment block, Steve, hand prints (k reveals it left to right) */
const muralCanvas = (k: number) => canvasTex(`mural${k}`, 1400, 640, (g, w, h) => {
  g.clearRect(0, 0, w, h);
  g.save(); g.beginPath(); g.rect(0, 0, w * k, h); g.clip();
  g.lineCap = "round"; g.lineJoin = "round";
  const ch = "#1c1416", oc = "#b0502e", wh = "#efe4cc";
  const hand = (x: number, y: number, s: number, c: string) => { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, 34 * s, 40 * s, 0, 0, 6.3); g.fill(); for (let q = 0; q < 5; q++) { const a = -2.4 + q * 0.42; g.beginPath(); g.ellipse(x + Math.cos(a) * 58 * s, y + Math.sin(a) * 58 * s, 9 * s, 22 * s, a + 1.57, 0, 6.3); g.fill(); } };
  hand(110, 170, 1, oc); hand(1290, 480, 0.9, oc); hand(1230, 160, 0.8, ch);
  g.strokeStyle = oc; g.lineWidth = 16; g.beginPath(); g.arc(330, 190, 80, 0, 6.3); g.stroke();
  for (let q = 0; q < 10; q++) { const a = q * 0.628; g.beginPath(); g.moveTo(330 + Math.cos(a) * 110, 190 + Math.sin(a) * 110); g.lineTo(330 + Math.cos(a) * 150, 190 + Math.sin(a) * 150); g.stroke(); }
  g.strokeStyle = ch; g.lineWidth = 12; g.strokeRect(540, 160, 260, 400);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) g.strokeRect(570 + c * 78, 190 + r * 88, 48, 52);
  g.fillStyle = "#e0a040"; g.fillRect(648, 278, 48, 52);
  g.beginPath(); g.arc(880, 380, 26, 0, 6.3); g.stroke(); g.beginPath(); g.moveTo(880, 406); g.lineTo(880, 500); g.moveTo(880, 430); g.lineTo(840, 400); g.moveTo(880, 430); g.lineTo(925, 380); g.moveTo(880, 500); g.lineTo(850, 560); g.moveTo(880, 500); g.lineTo(910, 560); g.stroke();
  g.strokeStyle = "#e07a96"; g.lineWidth = 18;
  g.beginPath(); g.moveTo(980, 520); g.bezierCurveTo(1040, 470, 1110, 560, 1180, 500); g.stroke();
  g.lineWidth = 8; for (const d of [-18, 0, 18]) { g.beginPath(); g.moveTo(1180, 500); g.lineTo(1200, 480 + d); g.stroke(); }
  g.fillStyle = wh; g.font = "800 52px Poppins"; g.fillText("STEVE", 1010, 610);
  g.restore();
});
const muralMats = new Map<number, THREE.MeshBasicMaterial>();
const Mural: React.FC<{ p: V3; k: number }> = ({ p, k }) => {
  const q = Math.round(Math.min(1, k) * 20) / 20;
  let m = muralMats.get(q);
  if (!m) { m = new THREE.MeshBasicMaterial({ map: muralCanvas(q), transparent: true, alphaTest: 0.3, color: "#d8c8b4", polygonOffset: true, polygonOffsetFactor: -2 }); muralMats.set(q, m); }
  return (
    <mesh position={p} material={m} userData={{ outline: false }}>
      <planeGeometry args={[3.5, 1.6]} />
    </mesh>
  );
};

/** tally marks scratched into the wall: groups of five */
export const marksCanvas = (n: number) => canvasTex(`marks${n}`, 1200, 300, (g, w, h) => {
  g.clearRect(0, 0, w, h);
  g.strokeStyle = "#ece2cc"; g.lineWidth = 11; g.lineCap = "round";
  for (let i = 0; i < n; i++) {
    const grp = Math.floor(i / 5), k = i % 5, x0 = 40 + grp * 190;
    if (k < 4) { const x = x0 + k * 34 + 3 * Math.sin(i * 7); g.beginPath(); g.moveTo(x, 60 + 6 * Math.sin(i)); g.lineTo(x + 4 * Math.sin(i * 3), 240); g.stroke(); }
    else { g.beginPath(); g.moveTo(x0 - 16, 220); g.lineTo(x0 + 120, 80); g.stroke(); }
  }
});
export const Marks: React.FC<{ p: V3; n: number; yaw?: number }> = ({ p, n, yaw = Math.PI / 2 - 0.15 }) => (
  <mesh position={p} rotation={[0, yaw, 0]} userData={{ outline: false }}>
    <planeGeometry args={[2.0, 0.5]} />
    <meshBasicMaterial map={marksCanvas(Math.min(30, n))} transparent alphaTest={0.4} color="#d8ccb8" polygonOffset polygonOffsetFactor={-2} />
  </mesh>
);
/** the wall the marks are scratched into (a flat rock face) */
export const MarkWall: React.FC = () => <Rock p={add(D, [-4.25, 1.3, -1.0])} s={[0.5, 1.2, 1.6]} seed={18} amp={0.06} c="#8a7a6a" r={[0, -0.15, 0]} />;

// ------------------------------------------------------------------ the crawl tunnel
export const Tunnel: React.FC<{ cam?: V3 }> = ({ cam }) => {
  const far = (p: V3, r: number) => !cam || Math.hypot(p[0] - cam[0], p[1] - cam[1], p[2] - cam[2]) > r + 0.3;
  return (
    <group>
      <M g={boxG(3, 0.2, 16)} p={[T[0], -0.1, T[2] - 4]} c={FLOOR} tex="rock" />
      {Array.from({ length: 22 }, (_, i) => {
        const z = T[2] + 2 - i * 0.7, s = 0.7 + 0.25 * hsh(i);
        const L: V3 = [T[0] - 1.05 - 0.2 * hsh(i + 1), 0.5, z], R: V3 = [T[0] + 1.05 + 0.2 * hsh(i + 2), 0.5, z], C: V3 = [T[0] + 0.3 * (hsh(i + 3) - 0.5), 1.95 + 0.15 * hsh(i + 4), z];
        return <React.Fragment key={i}>
          {far(L, s) ? <Rock p={L} s={[s, 0.9, 0.6]} seed={1300 + i} /> : null}
          {far(R, s) ? <Rock p={R} s={[s, 0.9, 0.6]} seed={1400 + i} /> : null}
          {far(C, 1) ? <Rock p={C} s={[1.4, 0.75, 0.6]} seed={1500 + i} c={ROCK_D} /> : null}
        </React.Fragment>;
      })}
      <mesh position={[T[0], 0.7, T[2] - 13]} material={coreMat("#000000", 1)} userData={{ outline: false }}><planeGeometry args={[4, 3]} /></mesh>
    </group>
  );
};

// ------------------------------------------------------------------ the night street
const shopCanvas = () => canvasTex("shop", 1024, 512, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#fff4c8"); gr.addColorStop(1, "#ffd27a");
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = "#c86a3a"; for (let k = 0; k < 4; k++) g.fillRect(60 + k * 240, 300, 170, 14);
  g.fillStyle = "#8a5a9a"; for (let k = 0; k < 4; k++) for (let j = 0; j < 4; j++) g.fillRect(70 + k * 240 + j * 40, 240, 28, 58);
  g.fillStyle = "#3a8a6a"; for (let k = 0; k < 4; k++) for (let j = 0; j < 4; j++) g.fillRect(70 + k * 240 + j * 40, 380, 28, 70);
});
export const Street: React.FC<{ t: number; cam?: V3; rain?: boolean }> = ({ t, rain = true }) => {
  const S = ST;
  const winMat = (i: number) => coreMat(hsh(i) > 0.5 ? "#ffcf7a" : "#ffb060", 0.7 + 0.3 * hsh(i + 1));
  return (
    <group>
      <M g={boxG(60, 0.2, 14)} p={[S[0], -0.1, S[2] + 3]} c="#2e2c36" tex="stone" ts={0.5} />
      <M g={boxG(60, 0.16, 2.6)} p={[S[0], 0.08, S[2] - 2.0]} c="#4a4652" tex="stone" />
      {/* puddles reflecting the lamp */}
      {[[1.8, 0.6, 1.2], [-2.6, 1.6, 0.9], [4.5, 2.4, 1.4], [-6, 0.4, 1.0]].map(([x, z, r], i) => (
        <mesh key={i} position={[S[0] + x, 0.006, S[2] + z]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.55, 1]} material={coreMat("#ffb868", 0.22, 0.45)} userData={{ outline: false }}><circleGeometry args={[r, 28]} /></mesh>
      ))}
      {/* the buildings behind: brick, lit windows, a 24h shop */}
      {[-14, -4, 6, 16].map((x, b) => (
        <group key={b}>
          <M g={boxG(9.6, 14, 1)} p={[S[0] + x, 7, S[2] - 3.8]} c={["#7a3e34", "#5a4a5e", "#6a4034", "#4a4a5a"][b]} tex="brick" />
          {Array.from({ length: 12 }, (_, i) => {
            const cx = x - 3.2 + (i % 4) * 2.1, cy = 4.6 + Math.floor(i / 4) * 3;
            const on = hsh(i + b * 20) > 0.45;
            return <mesh key={i} position={[S[0] + cx, cy, S[2] - 3.28]} material={on ? winMat(i + b * 20) : coreMat("#1a1828", 1)} userData={{ outline: false }}><planeGeometry args={[1.0, 1.4]} /></mesh>;
          })}
        </group>
      ))}
      <mesh position={[S[0] - 4.5, 1.4, S[2] - 3.27]} userData={{ outline: false }}>
        <planeGeometry args={[4.4, 2.2]} />
        <meshBasicMaterial map={shopCanvas()} toneMapped={false} color="#ffffff" />
      </mesh>
      <M g={boxG(5, 0.25, 0.6)} p={[S[0] - 4.5, 2.75, S[2] - 3.0]} c="#2a6a5a" />
      <Label text="OPEN 24/7" p={[S[0] - 4.5, 2.75, S[2] - 2.69]} w={2.2} h={0.24} fg="#ff6a5a" bg="none" />
      <pointLight position={[S[0] - 4.5, 1.6, S[2] - 1.8]} color="#ffd890" intensity={6} distance={7} decay={1.6} />
      {/* the streetlamp */}
      <group position={[S[0] + 1.6, 0, S[2] - 1.5]}>
        <M g={cylG(0.07, 0.1, 4.6, 12)} p={[0, 2.3, 0]} c="#2a2c34" tex="metal" />
        <M g={boxG(0.9, 0.08, 0.1)} p={[0.35, 4.55, 0]} c="#2a2c34" />
        <M g={cylG(0.12, 0.3, 0.25, 14)} p={[0.75, 4.45, 0]} c="#2a2c34" />
        <mesh position={[0.75, 4.3, 0]} material={coreMat("#ffc070", 1.25)} userData={{ outline: false }}><sphereGeometry args={[0.16, 14, 10]} /></mesh>
        <pointLight position={[0.75, 4.0, 0.4]} color="#ffa850" intensity={18} distance={14} decay={1.5} />
      </group>
      <group position={[S[0] + 5.5, 0, S[2] - 2.6]}>
        <M g={boxG(1.9, 1.2, 1.0)} p={[0, 0.6, 0]} c="#2e5a46" tex="metal" />
        <M g={boxG(2.0, 0.1, 1.1)} p={[0, 1.24, 0]} c="#244a3a" />
      </group>
      <M g={boxG(0.5, 0.35, 0.35)} p={[S[0] + 4.3, 0.18, S[2] - 2.5]} c="#3a3a40" />
      {rain ? Array.from({ length: 140 }, (_, i) => {
        const u = ((t * 1.6 + hsh(i)) % 1);
        return <mesh key={i} position={[S[0] + (hsh(i + 1) - 0.5) * 16, 6 - u * 7, S[2] + (hsh(i + 2) - 0.2) * 8]} material={coreMat("#a8b8e8", 0.5, 0.5)} userData={{ outline: false }}><boxGeometry args={[0.008, 0.35, 0.008]} /></mesh>;
      }) : null}
    </group>
  );
};

// ------------------------------------------------------------------ the bell shaft
export const Shaft: React.FC<{ t: number; swing?: number; glow?: number; rope?: boolean }> = ({ t, swing = 0, glow = 0, rope = true }) => (
  <group>
    <mesh geometry={domeG(13, 0.08)} material={domeMat(ROCK_D)} position={[SH[0], 9, SH[2]]} scale={[1.6, 10, 1.6]} />
    <mesh position={[SH[0], 18.6, SH[2]]} rotation={[Math.PI / 2, 0, 0]} material={coreMat("#e8f0ff", 1.3)} userData={{ outline: false }}><circleGeometry args={[0.9, 32]} /></mesh>
    <pointLight position={[SH[0], 17.5, SH[2]]} color="#e0e8ff" intensity={14} distance={20} decay={1.2} />
    <M g={boxG(2.6, 0.12, 0.14)} p={[SH[0], 16.2, SH[2]]} c="#4a3a2a" tex="wood" />
    <Bell p={[SH[0], 15.8, SH[2]]} swing={swing} s={1.1} />
    {rope ? <group position={[SH[0], 15.35, SH[2]]} rotation={[0, 0, swing * 0.5]}>
      <M g={cylG(0.022, 0.022, 15, 8)} p={[0, -7.5, 0]} c="#b89060" tex="fabric" />
    </group> : null}
    <M g={boxG(5, 0.2, 5)} p={[SH[0], -0.1, SH[2]]} c={FLOOR} tex="rock" />
    {glow > 0 ? <>
      <Flame p={[SH[0] + 0.3, 0.02, SH[2] + 0.2]} s={0.18 * glow} t={t} seed={4} />
      <pointLight position={[SH[0], 0.8, SH[2]]} color="#ffa050" intensity={14 * glow} distance={10} decay={1.2} />
      <OilLamp p={[SH[0] - 0.5, 0, SH[2] + 0.4]} t={t} /><OilLamp p={[SH[0] + 0.6, 0, SH[2] - 0.3]} t={t} seed={2} />
      <Shrooms p={[SH[0] - 0.4, 0.02, SH[2] - 0.2]} n={8} k={glow} spread={0.4} />
    </> : null}
  </group>
);
