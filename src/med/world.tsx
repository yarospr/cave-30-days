// Netherwick, 1253: one consistent world for every outdoor scene.
//   wake field (S03)  WAKE = [4, 0, 46]  · strip fields south of the village
//   the green (S01/S11 gallows)  GREEN = [0, 0, -12]
//   main street from the south edge (z ≈ +14) to the green; lanes east/west; the manor east of the green
//   the priory on its hill to the north; a river to the west; forest + hills ring the valley.
// Static geometry is memoized (no per-frame React work); only smoke / animals take `t`.
import React from "react";
import { boxG, coneG, coreMat, cylG, M, sphG, torG } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";

export const WAKE: V3 = [4, 0, 66];
export const GREEN: V3 = [0, 0, -12];
export const MANOR: V3 = [27, 0, -14];
export const PRIORY: V3 = [8, 7.6, -78];

const rng = (seed: number) => { let x = seed * 9301 + 49297; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };

const BEAM = "#4a3222";
const WALLS = ["#eadcbc", "#e6d2b0", "#e2d6c0", "#efe4cc", "#d8c8a8", "#e8d8c0"];
const THATCH = ["#c9a053", "#b88d44", "#d4ad62", "#a8843e"];

// ------------------------------------------------------------------ buildings
/** the timber frame on one wall face of width w, height h, the face plane at local z = 0 (beams stand 1.6 cm proud) */
const Face: React.FC<{ w: number; h: number; y0?: number; win?: boolean; seed?: number }> = ({ w, h, y0 = 0, win = true, seed = 0 }) => {
  const n = Math.max(2, Math.round(w / 1.6));
  return (
    <group position={[0, y0, 0.016]}>
      <M g={boxG(w + 0.04, 0.15, 0.05)} c={BEAM} tex="wood" p={[0, 0.08, 0]} />
      <M g={boxG(w + 0.04, 0.15, 0.05)} c={BEAM} tex="wood" p={[0, h - 0.08, 0]} />
      <M g={boxG(w + 0.04, 0.11, 0.05)} c={BEAM} tex="wood" p={[0, h * 0.52, -0.004]} />
      {Array.from({ length: n + 1 }, (_, i) => <M key={i} g={boxG(0.13, h - 0.3, 0.05)} c={BEAM} tex="wood" p={[-w / 2 + 0.07 + (i * (w - 0.14)) / n, h / 2, 0.004]} />)}
      <M g={boxG(0.09, h * 0.55, 0.04)} c={BEAM} tex="wood" p={[(seed % 2 ? 1 : -1) * w * 0.3, h * 0.27, -0.006]} r={[0, 0, seed % 2 ? -0.65 : 0.65]} />
      {win ? <M g={boxG(0.55, 0.5, 0.03)} c="#2a2438" p={[(seed % 2 ? -1 : 1) * w * 0.2, h * 0.72, -0.012]} /> : null}
    </group>
  );
};
type HouseOpts = { p: V3; yaw?: number; w: number; d: number; h: number; two?: boolean; wall?: string; roof?: string; seed?: number; chimney?: boolean; box?: boolean };
/** a timber-framed house: one storey (thatched) or two with a jettied upper floor; beams, shutters, door, chimney */
export const House: React.FC<HouseOpts> = ({ p, yaw = 0, w, d, h, two = false, wall = "#eadcbc", roof = "#c9a053", seed = 1, chimney = true, box = false }) => {
  const r = rng(seed);
  const H2 = two ? h * 0.95 : 0, jet = two ? 0.35 : 0, top = h + H2;
  const roofH = 0.55 * d + 0.5, slope = Math.atan2(roofH, d / 2 + jet), len = Math.hypot(roofH, d / 2 + jet) + 0.4;
  const f2 = d / 2 + jet + 0.016;
  const doorX = (r() - 0.5) * (w - 2.4);
  const wins = Math.max(1, Math.floor(w / 2.6));
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <M g={boxG(w, h, d)} c={wall} tex="plaster" p={[0, h / 2, 0]} />
      {two ? <M g={boxG(w + 0.02, H2, d + 2 * jet)} c={wall} tex="plaster" p={[0, h + H2 / 2, 0]} /> : null}
      {/* frame on all four faces, both floors */}
      <group position={[0, 0, d / 2]}><Face w={w} h={h} win={false} seed={seed} /></group>
      <group position={[0, 0, -d / 2]} rotation={[0, Math.PI, 0]}><Face w={w} h={h} seed={seed + 1} /></group>
      {[-1, 1].map((sd) => <group key={sd} position={[(sd * w) / 2, 0, 0]} rotation={[0, sd * Math.PI / 2, 0]}><Face w={d} h={h} seed={seed + 2 + sd} /></group>)}
      {two ? (
        <>
          <group position={[0, 0, d / 2 + jet]}><Face w={w} h={H2} y0={h} win={false} seed={seed + 4} /></group>
          <group position={[0, 0, -d / 2 - jet]} rotation={[0, Math.PI, 0]}><Face w={w} h={H2} y0={h} seed={seed + 5} /></group>
          {[-1, 1].map((sd) => <group key={sd} position={[(sd * w) / 2 + sd * 0.01, 0, 0]} rotation={[0, sd * Math.PI / 2, 0]}><Face w={d + 2 * jet} h={H2} y0={h} seed={seed + 6} /></group>)}
          {Array.from({ length: Math.round(w / 1.2) }, (_, i) => <M key={`j${i}`} g={boxG(0.12, 0.14, jet + 0.1)} c={BEAM} tex="wood" p={[-w / 2 + 0.3 + i * 1.2, h - 0.05, d / 2 + jet / 2]} />)}
        </>
      ) : null}
      {/* roof */}
      {[-1, 1].map((sd) => <M key={sd} g={boxG(w + 0.7, two ? 0.18 : 0.32, len)} c={roof} tex={two ? "roofTiles" : "shingles"} p={[0, top + roofH / 2, (sd * (d / 2 + jet)) / 2]} r={[sd * (Math.PI / 2 - slope), 0, 0]} />)}
      <M g={cylG(0.18, 0.18, w + 0.7, 10)} c={two ? "#8a5a3a" : "#a8843e"} tex="shingles" p={[0, top + roofH + 0.08, 0]} r={[0, 0, Math.PI / 2]} />
      {[-1, 1].map((sd) => (
        <group key={sd} position={[(sd * w) / 2 - sd * 0.01, top, 0]} rotation={[0, sd * Math.PI / 2, 0]}>
          <M g={coneG(d / 2 + jet, roofH, 3)} c={wall} tex="plaster" p={[0, roofH / 2, 0]} r={[0, Math.PI / 6, 0]} s={[1, 1, 0.05]} />
        </group>
      ))}
      {chimney ? <M g={boxG(0.6, roofH + 1.2, 0.6)} c="#8a7a6a" tex="stone" p={[w * 0.3, top + roofH / 2 + 0.4, -d * 0.15]} /> : null}
      {/* door, windows with shutters, a flower box */}
      <M g={boxG(0.95, 1.85, 0.1)} c={["#6a4428", "#5a3a2a", "#7a5030", "#4a5a3a"][Math.floor(r() * 4)]} tex="planks" p={[doorX, 0.93, d / 2 + 0.05]} />
      <M g={boxG(1.15, 0.14, 0.14)} c={BEAM} tex="wood" p={[doorX, 1.92, d / 2 + 0.06]} />
      {Array.from({ length: wins }, (_, i) => {
        const x = -w / 2 + (i + 0.5) * (w / wins);
        if (Math.abs(x - doorX) < 1.0) return null;
        return (
          <group key={i} position={[x, h * 0.6, d / 2 + 0.02]}>
            <M g={boxG(0.7, 0.6, 0.03)} c="#2a2438" />
            {[-1, 1].map((sd) => <M key={sd} g={boxG(0.36, 0.62, 0.05)} c="#7a5030" tex="planks" p={[sd * 0.56, 0, 0.04]} r={[0, sd * -0.5, 0]} />)}
            {box && i === 0 ? <><M g={boxG(0.8, 0.16, 0.2)} c="#6a4428" tex="wood" p={[0, -0.4, 0.12]} />{[-0.25, 0, 0.25].map((q) => <M key={q} g={sphG(0.11, 8)} c={["#d84a5a", "#e8c44a", "#c86ad8"][Math.floor(r() * 3)]} p={[q, -0.27, 0.13]} />)}</> : null}
          </group>
        );
      })}
      {two ? Array.from({ length: wins + 1 }, (_, i) => <M key={`w2${i}`} g={boxG(0.6, 0.55, 0.03)} c="#2a2438" p={[-w / 2 + (i + 0.5) * (w / (wins + 1)), h + H2 * 0.55, f2 + 0.005]} />) : null}
    </group>
  );
};

/** the manor: a stone hall with a slate roof, a tower, steps */
export const Manor: React.FC<{ p: V3; yaw?: number }> = ({ p, yaw = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(14, 7, 8)} c="#b8ac94" tex="stone" p={[0, 3.5, 0]} />
    {[-1, 1].map((s) => <M key={s} g={boxG(14.8, 0.3, 5.4)} c="#5a5a6a" tex="roofTiles" p={[0, 8.6, s * 2.05]} r={[s * 0.62, 0, 0]} />)}
    <M g={boxG(4, 13, 4)} c="#aca088" tex="stone" p={[-7.5, 6.5, 1]} />
    {[-1.5, -0.5, 0.5, 1.5].map((x) => <M key={x} g={boxG(0.7, 0.7, 4.2)} c="#aca088" tex="stone" p={[-7.5 + x, 13.3, 1]} />)}
    {[-4.5, -1.5, 1.5, 4.5].map((x) => <M key={x} g={boxG(0.9, 1.4, 0.05)} c="#2a2438" p={[x, 5, 4.03]} />)}
    {[-4.5, 4.5].map((x) => <M key={x} g={boxG(0.9, 1.4, 0.05)} c="#2a2438" p={[x, 2.2, 4.03]} />)}
    <M g={boxG(2.2, 3.2, 0.2)} c="#5a3a22" tex="planks" p={[0, 1.6, 4.05]} />
    <M g={boxG(2.6, 0.5, 0.2)} c="#9a8e78" tex="stone" p={[0, 3.45, 4.1]} />
    {[0, 1, 2].map((i) => <M key={i} g={boxG(3.6 - i * 0.4, 0.2, 1.4 - i * 0.4)} c="#a89c84" tex="stone" p={[0, 0.1 + i * 0.2, 4.7 - i * 0.2]} />)}
    <M g={boxG(1.2, 0.8, 0.06)} c="#2a4a8a" tex="fabric" p={[0, 5.4, 4.06]} />
    <M g={boxG(0.5, 0.5, 0.07)} c="#e8c44a" p={[0, 5.4, 4.07]} />
  </group>
);

/** the priory church on its hill (a stone plinth under it so it never floats) */
export const PrioryChurch: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <M g={boxG(11, 4, 7)} c="#9a907c" tex="stone" p={[0, -1.8, 0]} />
    <M g={boxG(10, 6.5, 5.4)} c="#b8ad98" tex="stone" p={[0, 3.25, 0]} />
    <M g={boxG(3.4, 14, 3.4)} c="#aca28c" tex="stone" p={[-4, 7, 0.2]} />
    <M g={coneG(2.6, 4.5, 4)} c="#5a5a6a" tex="roofTiles" p={[-4, 16.25, 0.2]} r={[0, Math.PI / 4, 0]} />
    {[-1, 1].map((s) => <M key={s} g={boxG(10.6, 0.25, 3.7)} c="#5a5a6a" tex="roofTiles" p={[0.3, 7.6, s * 1.35]} r={[s * 0.75, 0, 0]} />)}
    <M g={boxG(0.9, 1.8, 0.05)} c="#2a2438" p={[-4, 11.5, 1.92]} />
    {[-1, 1, 3].map((x) => <M key={x} g={boxG(0.7, 1.8, 0.05)} c="#2a2438" p={[x, 3.6, 2.72]} />)}
    {/* cloister wall + a few graves */}
    <M g={boxG(14, 1.2, 0.4)} c="#a89c84" tex="stone" p={[2, 0.6, 6]} />
    {[0, 1, 2, 3].map((i) => <M key={i} g={boxG(0.5, 0.8, 0.15)} c="#9a9488" tex="stone" p={[4 + i * 1.2, 0.4, 4.2]} />)}
  </group>
);

// ------------------------------------------------------------------ dressing
const Tree: React.FC<{ p: V3; s?: number; kind?: number; seed?: number }> = ({ p, s = 1, kind = 0, seed = 0 }) => {
  const g = ["#4f8a3c", "#5e9a44", "#457a34", "#3e6e30", "#6aa04a"];
  if (kind === 1) return (
    <group position={p} scale={s}>
      <M g={cylG(0.18, 0.24, 1.6, 8)} c="#5a3c26" tex="wood" p={[0, 0.8, 0]} />
      {[0, 1, 2].map((i) => <M key={i} g={coneG(1.6 - i * 0.35, 2.2, 10)} c={g[(seed + i) % 5 === 4 ? 3 : 3]} tex="grass" p={[0, 2.2 + i * 1.2, 0]} />)}
    </group>
  );
  return (
    <group position={p} scale={s}>
      <M g={cylG(0.18, 0.26, 2.4, 8)} c="#5a3c26" tex="wood" p={[0, 1.2, 0]} />
      <M g={sphG(1.5, 12)} c={g[seed % 5]} tex="grass" p={[0, 3.2, 0]} />
      <M g={sphG(1.1, 10)} c={g[(seed + 1) % 5]} tex="grass" p={[0.8, 3.9, 0.3]} />
      <M g={sphG(1.0, 10)} c={g[(seed + 2) % 5]} tex="grass" p={[-0.9, 3.7, -0.2]} />
    </group>
  );
};
const Fence: React.FC<{ p: V3; n: number; yaw?: number }> = ({ p, n, yaw = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    {Array.from({ length: n }, (_, i) => <M key={i} g={boxG(0.1, 1.0, 0.1)} c="#7a5634" tex="wood" p={[i * 1.1, 0.5, 0]} r={[0, 0, i % 2 ? 0.04 : -0.03]} />)}
    {[0.4, 0.8].map((y) => <M key={y} g={boxG(1.1 * (n - 1) + 0.2, 0.07, 0.05)} c="#8a6240" tex="wood" p={[0.55 * (n - 1), y, 0.08]} />)}
  </group>
);
const Garden: React.FC<{ p: V3; yaw?: number; rows?: number }> = ({ p, yaw = 0, rows = 4 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(4, 0.08, 3)} c="#6a4e36" tex="sand" p={[0, 0.02, 0]} />
    {Array.from({ length: rows }, (_, r) => Array.from({ length: 6 }, (_, c) => <M key={`${r}${c}`} g={sphG(0.22, 8)} c={r % 2 ? "#6aa04a" : "#8ab85a"} tex="grass" p={[-1.6 + c * 0.64, 0.14, -1.1 + r * 0.72]} s={[1, 0.7, 1]} />))}
  </group>
);
const WoodPile: React.FC<{ p: V3; yaw?: number }> = ({ p, yaw = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    {[0, 1, 2].map((r) => Array.from({ length: 5 - r }, (_, i) => <M key={`${r}${i}`} g={cylG(0.12, 0.12, 1.2, 8)} c="#9a6a3a" tex="wood" p={[-0.5 + i * 0.25 + r * 0.12, 0.12 + r * 0.22, 0]} r={[Math.PI / 2, 0, 0]} />))}
    <M g={boxG(0.5, 0.45, 0.5)} c="#7a5030" tex="wood" p={[1.1, 0.22, 0.2]} />
  </group>
);
const Barrel: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <M g={cylG(0.32, 0.3, 0.9, 14)} c="#b8743a" tex="wood" p={[0, 0.45, 0]} />
    {[0.15, 0.75].map((y) => <M key={y} g={cylG(0.335, 0.335, 0.05, 14)} c="#4a4a52" tex="metal" p={[0, y, 0]} />)}
  </group>
);
const Crate: React.FC<{ p: V3; s?: number; yaw?: number; fruit?: string }> = ({ p, s = 0.6, yaw = 0, fruit }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(s, s * 0.7, s)} c="#c8945a" tex="planks" p={[0, s * 0.35, 0]} />
    {fruit ? [-0.15, 0.15].map((x) => [-0.15, 0.15].map((z) => <M key={`${x}${z}`} g={sphG(s * 0.17, 8)} c={fruit} p={[x * s * 2, s * 0.72, z * s * 2]} />)) : null}
  </group>
);
export const Stall: React.FC<{ p: V3; yaw?: number; awning: string; goods: string[] }> = ({ p, yaw = 0, awning, goods }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(2.6, 0.1, 1.2)} c="#9a6a3a" tex="planks" p={[0, 0.9, 0]} />
    {[[-1.2, -0.5], [1.2, -0.5], [-1.2, 0.5], [1.2, 0.5]].map(([x, z]) => <M key={`${x}${z}`} g={boxG(0.1, x && z < 0 ? 2.4 : 2.0, 0.1)} c="#6a4426" tex="wood" p={[x, z < 0 ? 1.2 : 1.0, z]} />)}
    <M g={boxG(2.9, 0.06, 1.6)} c={awning} tex="fabric" p={[0, 2.3, 0.05]} r={[-0.25, 0, 0]} />
    {Array.from({ length: 7 }, (_, i) => <M key={i} g={boxG(0.41, 0.25, 0.04)} c={i % 2 ? "#f4ead6" : awning} tex="fabric" p={[-1.23 + i * 0.41, 2.05, 0.83]} />)}
    {goods.map((c, i) => <Crate key={i} p={[-0.9 + i * 0.6, 0.95, 0]} s={0.45} fruit={c} />)}
  </group>
);
const Laundry: React.FC<{ p: V3; yaw?: number }> = ({ p, yaw = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    {[-2, 2].map((x) => <M key={x} g={cylG(0.05, 0.05, 2.2, 6)} c="#6a4a2c" tex="wood" p={[x, 1.1, 0]} />)}
    <M g={cylG(0.012, 0.012, 4, 6)} c="#d8c8a8" p={[0, 2.05, 0]} r={[0, 0, Math.PI / 2]} />
    {[-1.4, -0.5, 0.4, 1.3].map((x, i) => <M key={x} g={boxG(0.6, 0.8 - (i % 2) * 0.2, 0.02)} c={["#e8e4da", "#b8c8e0", "#d8b0a0", "#e8e4da"][i]} tex="fabric" p={[x, 1.65, 0]} />)}
  </group>
);
const Cart: React.FC<{ p: V3; yaw?: number; hay?: boolean }> = ({ p, yaw = 0, hay = true }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(2.2, 0.12, 1.2)} c="#a8743e" tex="planks" p={[0, 0.72, 0]} />
    {[-1, 1].map((sd) => <M key={sd} g={boxG(2.2, 0.36, 0.08)} c="#9a6a38" tex="planks" p={[0, 0.94, sd * 0.56]} />)}
    {[-1, 1].map((sd) => (
      <group key={sd} position={[0.1, 0.48, sd * 0.68]}>
        <M g={torG(0.44, 0.06)} c="#6a4426" tex="wood" />
        <M g={boxG(0.06, 0.86, 0.05)} c="#6a4426" />
        <M g={boxG(0.86, 0.06, 0.05)} c="#6a4426" />
      </group>
    ))}
    {[-1, 1].map((sd) => <M key={sd} g={boxG(1.6, 0.08, 0.08)} c="#7a5030" tex="wood" p={[1.85, 0.62, sd * 0.4]} r={[0, 0, -0.12]} />)}
    {hay ? <M g={sphG(0.42, 12)} c="#d8b45a" tex="grass" p={[-0.4, 1.05, 0]} s={[1.4, 0.55, 1.1]} /> : null}
  </group>
);
export { Cart };
const Well: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <M g={cylG(0.75, 0.8, 0.85, 18)} c="#a59a8a" tex="stone" p={[0, 0.42, 0]} />
    <M g={cylG(0.56, 0.56, 0.02, 18)} c="#1e2440" p={[0, 0.86, 0]} />
    {[-1, 1].map((sd) => <M key={sd} g={boxG(0.1, 1.5, 0.1)} c="#5a3a24" tex="wood" p={[sd * 0.68, 1.5, 0]} />)}
    <M g={cylG(0.07, 0.07, 1.46, 8)} c="#7a5030" tex="wood" p={[0, 1.95, 0]} r={[0, 0, Math.PI / 2]} />
    {[-1, 1].map((sd) => <M key={sd} g={boxG(1.8, 0.08, 0.9)} c="#8a5a30" tex="planks" p={[0, 2.42, sd * 0.3]} r={[sd * 0.62, 0, 0]} />)}
  </group>
);
const Hay: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => <M g={sphG(0.8 * s, 12)} c="#d9b25a" tex="grass" p={p} s={[1.3, 0.6, 1]} />;
const Smithy: React.FC<{ p: V3; yaw?: number }> = ({ p, yaw = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    {[[-2, -1.5], [2, -1.5], [-2, 1.5], [2, 1.5]].map(([x, z]) => <M key={`${x}${z}`} g={boxG(0.2, 2.6, 0.2)} c="#5a3a22" tex="wood" p={[x, 1.3, z]} />)}
    {[-1, 1].map((s) => <M key={s} g={boxG(4.8, 0.22, 2.2)} c="#a8843e" tex="shingles" p={[0, 3.0, s * 0.9]} r={[s * 0.5, 0, 0]} />)}
    <M g={boxG(1.4, 1.0, 1.0)} c="#8a7a6a" tex="stone" p={[-1, 0.5, -0.8]} />
    <mesh position={[-1, 1.02, -0.8]} material={coreMat("#ff8a2a", 1.15)} userData={{ outline: false }}><boxGeometry args={[0.8, 0.05, 0.5]} /></mesh>
    <M g={boxG(0.5, 0.35, 0.25)} c="#3a3a42" tex="metal" p={[0.8, 0.75, 0.3]} />
    <M g={cylG(0.25, 0.3, 0.55, 10)} c="#6a4426" tex="wood" p={[0.8, 0.27, 0.3]} />
    <M g={boxG(0.6, 3.2, 0.6)} c="#8a7a6a" tex="stone" p={[-1.4, 2.2, -1.3]} />
  </group>
);
/** rolling hills ring + far forest: closes every exterior horizon */
const Horizon: React.FC = () => {
  const r = rng(77);
  const hills = Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2 + r() * 0.2, R = 150 + r() * 40;
    return { p: [Math.sin(a) * R, -18 + r() * 8, -20 + Math.cos(a) * R] as V3, s: 40 + r() * 25, c: ["#6f8f48", "#7f9a4c", "#668a44", "#8aa45a"][i % 4] };
  });
  const trees = Array.from({ length: 160 }, (_, i) => {
    const a = (i / 160) * Math.PI * 2 + r() * 0.03, R = 95 + r() * 30;
    return { p: [Math.sin(a) * R, 0, -20 + Math.cos(a) * R] as V3, s: 1.6 + r() * 1.4, kind: r() < 0.45 ? 1 : 0, seed: i };
  });
  return (
    <>
      {hills.map((h, i) => <M key={i} g={sphG(1, 18)} c={h.c} tex="grass" p={h.p} s={[h.s, h.s * 0.55, h.s]} cast={false} />)}
      {trees.map((t, i) => <Tree key={i} p={t.p} s={t.s} kind={t.kind} seed={t.seed} />)}
    </>
  );
};

/** the whole static village (memoized) */
export const Netherwick = React.memo(() => {
  const r = rng(11);
  const houses: HouseOpts[] = [];
  // the green: houses on three sides, facing in
  const ring: [number, number, number][] = [[-14, -2, Math.PI / 2], [-14, -10, Math.PI / 2], [-14, -18, Math.PI / 2], [-14, -26, Math.PI / 2],
    [14, -4, -Math.PI / 2], [14, -24, -Math.PI / 2], [-8, -34, 0], [0, -35, 0], [8, -34, 0]];
  ring.forEach(([x, z, yaw], i) => houses.push({ p: [x, 0, z], yaw: yaw + Math.PI * (yaw === 0 ? 0 : 0), w: 6.5 + r() * 1.2, d: 5, h: 2.8, two: i % 3 !== 1, seed: 100 + i, box: i % 2 === 0 }));
  // main street south of the green: both sides
  for (let k = 0; k < 6; k++) {
    for (const side of [-1, 1]) {
      const z = 6 + k * 7.5 + (side > 0 ? 2 : 0);
      houses.push({ p: [side * (7.5 + r() * 0.8), 0, z], yaw: side > 0 ? -Math.PI / 2 : Math.PI / 2, w: 5.4 + r() * 1.2, d: 5, h: 2.7 + r() * 0.3, two: r() < 0.35, seed: 200 + k * 2 + (side > 0 ? 1 : 0), box: r() < 0.4 });
    }
  }
  // west lane + back rows
  for (let k = 0; k < 6; k++) houses.push({ p: [-26 - r() * 2, 0, -30 + k * 9], yaw: Math.PI / 2 + (r() - 0.5) * 0.3, w: 6, d: 5, h: 2.7, seed: 300 + k });
  for (let k = 0; k < 5; k++) houses.push({ p: [24 + r() * 2, 0, 6 + k * 9], yaw: -Math.PI / 2 + (r() - 0.5) * 0.3, w: 6, d: 5, h: 2.7, seed: 400 + k });
  for (let k = 0; k < 6; k++) houses.push({ p: [-30 + k * 11, 0, -48 - r() * 3], yaw: (r() - 0.5) * 0.4, w: 6, d: 5, h: 2.7, two: k % 2 === 0, seed: 500 + k });
  houses.forEach((h) => { h.wall = WALLS[h.seed! % WALLS.length]; h.roof = h.two ? ["#9a5a3a", "#7a4a3a", "#8a6a4a"][h.seed! % 3] : THATCH[h.seed! % THATCH.length]; });
  return (
    <group>
      {/* ground: grass, the mud green, the streets */}
      <M g={boxG(400, 0.2, 400)} c="#7f9a4c" tex="grass" p={[0, -0.1, -20]} />
      <M g={boxG(24, 0.2, 30)} c="#8a6a48" tex="sand" ts={0.6} p={[0, -0.085, -16]} />
      <M g={boxG(9, 0.2, 52)} c="#8a6a48" tex="sand" ts={0.6} p={[0, -0.086, 26]} />
      <M g={boxG(60, 0.2, 6)} c="#8a6a48" tex="sand" ts={0.6} p={[-8, -0.087, -40]} />
      <M g={boxG(5, 0.2, 40)} c="#8a6a48" tex="sand" ts={0.6} p={[4, -0.088, -60]} r={[0, 0.15, 0]} />
      {/* strip fields south (the wake field) */}
      {Array.from({ length: 14 }, (_, i) => <M key={i} g={boxG(5.5, 0.1, 70)} c={["#a8a050", "#7a8a40", "#9a7a4a", "#8aa04a"][i % 4]} tex={i % 2 ? "grass" : "sand"} p={[-40 + i * 6, -0.03, 90]} />)}
      {houses.map((h, i) => <House key={i} {...h} />)}
      <Manor p={MANOR} yaw={-Math.PI / 2} />
      {/* the manor yard: side walls, gate posts toward the green */}
      <M g={boxG(9, 2.0, 0.5)} c="#a89c84" tex="stone" p={[19.5, 1.0, -23.5]} />
      <M g={boxG(9, 2.0, 0.5)} c="#a89c84" tex="stone" p={[19.5, 1.0, -4.5]} />
      {[-21.2, -6.8].map((z) => <M key={z} g={boxG(0.7, 2.6, 0.7)} c="#9a8e78" tex="stone" p={[15.2, 1.3, z]} />)}
      {/* the priory hill */}
      <M g={sphG(1, 24)} c="#7a9a4a" tex="grass" p={[8, -6, -82]} s={[40, 13.5, 30]} />
      <PrioryChurch p={PRIORY} />
      {/* dressing */}
      <Well p={[6, 0, -4]} />
      <Smithy p={[-9, 0, 14]} yaw={Math.PI / 2} />
      <Stall p={[-6, 0, -20]} yaw={Math.PI / 2} awning="#c0503a" goods={["#d84a3a", "#8ac04a", "#e8c44a"]} />
      <Stall p={[6.5, 0, -22]} yaw={-Math.PI / 2} awning="#3a6ab0" goods={["#e8a04a", "#a85ad8", "#d8d0b0"]} />
      <Stall p={[-6, 0, -27]} yaw={Math.PI / 2} awning="#e0b040" goods={["#c84a4a", "#d8a85a", "#6a9a4a"]} />
      {[[-11, -6], [11, -14], [-11.2, -22], [3.5, 4]].map(([x, z], i) => <Barrel key={i} p={[x, 0, z]} />)}
      {[[-10.6, -6.6], [11.6, -13.3], [10.8, 9], [-4, 24]].map(([x, z], i) => <Barrel key={`b${i}`} p={[x, 0, z]} />)}
      {[[-10.5, -14, 0.3], [10.6, -3, 0.8], [4.6, 18, 0.2], [-4.5, 32, 0.5]].map(([x, z, y], i) => <Crate key={i} p={[x, 0, z]} yaw={y} s={0.6} fruit={i % 2 ? "#d84a3a" : undefined} />)}
      <Cart p={[-5, 0, 10]} yaw={0.4} />
      <Cart p={[9, 0, -30]} yaw={-0.2} />
      <WoodPile p={[-11, 0, 2]} yaw={Math.PI / 2} />
      <WoodPile p={[11, 0, 20]} yaw={-Math.PI / 2} />
      <Laundry p={[-19, 0, -6]} yaw={Math.PI / 2} />
      <Laundry p={[18, 0, 14]} yaw={-1.2} />
      {[[-19, 4], [19, 30], [-19, 24], [19, -32]].map(([x, z], i) => <Garden key={i} p={[x, 0, z]} yaw={i % 2 ? 0.2 : -0.1} />)}
      {[[-19, 0, 8], [19, 0, 2], [-30, 0, 30], [30, 0, -36]].map(([x, y, z], i) => <Fence key={i} p={[x, y, z]} n={6} yaw={i % 2 ? Math.PI / 2 : 0} />)}
      {[[-16, 0.3, 30], [16, 0.3, 36], [-12, 0.3, 40], [-34, 0.3, 50], [30, 0.3, 54], [12, 0.3, 58]].map((p, i) => <Hay key={i} p={p as V3} s={i % 2 ? 0.9 : 1.1} />)}
      {/* trees in and around the village */}
      {Array.from({ length: 34 }, (_, i) => {
        const a = (i / 34) * Math.PI * 2, R = 40 + (i % 5) * 7, x = Math.sin(a) * R, z = -10 + Math.cos(a) * R * 1.1;
        if (Math.abs(x) < 12 && z > -20 && z < 60) return null; // never in the main street
        return <Tree key={i} p={[x, 0, z]} s={1.1 + (i % 3) * 0.3} kind={i % 4 === 0 ? 1 : 0} seed={i} />;
      })}
      {[[-20, -14], [20, -8], [-18, 16], [18, 44], [-22, 50]].map(([x, z], i) => <Tree key={`t${i}`} p={[x, 0, z]} s={1.2} seed={i + 3} />)}
      <Horizon />
    </group>
  );
});

/** soft chimney smoke on a few houses */
export const VillageSmoke: React.FC<{ t: number }> = ({ t }) => (
  <>
    {[[-14.5, 6.2, -1.2], [-14.5, 6.2, -17.3], [8.5, 6.4, 12], [-8.4, 6.2, 27], [2.4, 6.2, -36], [-1.3, 4.5, 13.8]].map((p, i) => (
      <group key={i} position={p as V3} scale={1.2}>
        {Array.from({ length: 6 }, (_, k) => {
          const u = (t * 0.07 + k / 6 + i * 0.13) % 1;
          return <M key={k} g={sphG(0.6, 12)} c="#ece6de" op={0.5 * (1 - u) * Math.min(1, u * 6)} p={[Math.sin(k * 2.3 + i) * 0.3 + u * 1.6, u * 5, Math.cos(k * 1.7) * 0.3]} s={0.4 + u * 1.4} cast={false} />;
        })}
      </group>
    ))}
  </>
);
