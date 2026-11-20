// Netherwick, 1253: a muddy village street. Timber-framed plaster cottages with thatched roofs, a well, a cart,
// barrels, fences, hay, trees and the priory tower behind. Every surface painted; beams stand >= 1.5 cm proud of the
// plaster (no coplanar faces); dressing in three depth layers.
import React from "react";
import { boxG, coneG, cylG, M, sphG, torG } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";
import { Barrel, Crate } from "../demo/Street";

const BEAM = "#4a3222";
const THATCH = "#c9a053";

/** a timber-framed cottage: plaster box, proud beams, a steep thatched roof, shutters, a plank door */
export const Cottage: React.FC<{ p: V3; w: number; h: number; d: number; yaw?: number; wall?: string; door?: number }> = ({ p, w, h, d, yaw = 0, wall = "#eadcbc", door = 0.25 }) => {
  const f = d / 2 + 0.016;
  const roofH = 0.55 * d + 0.4, slope = Math.atan2(roofH, d / 2), len = Math.hypot(roofH, d / 2) + 0.35;
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      <M g={boxG(w, h, d)} c={wall} tex="plaster" p={[0, h / 2, 0]} />
      {/* frame on the front face: sill, plate, posts, braces */}
      <M g={boxG(w + 0.04, 0.16, 0.05)} c={BEAM} tex="wood" p={[0, 0.08, f]} />
      <M g={boxG(w + 0.04, 0.16, 0.05)} c={BEAM} tex="wood" p={[0, h - 0.08, f]} />
      <M g={boxG(w + 0.04, 0.12, 0.05)} c={BEAM} tex="wood" p={[0, h * 0.5, f]} />
      {[-0.5, -0.17, 0.17, 0.5].map((x) => (
        <M key={x} g={boxG(0.14, h - 0.32, 0.05)} c={BEAM} tex="wood" p={[x * (w - 0.14), h / 2, f + 0.004]} />
      ))}
      <M g={boxG(0.1, h * 0.62, 0.04)} c={BEAM} tex="wood" p={[-0.33 * w, h * 0.27, f - 0.004]} r={[0, 0, 0.7]} />
      {/* thatched gable roof (two slabs) and a ridge roll */}
      {[-1, 1].map((sd) => (
        <M key={sd} g={boxG(w + 0.7, 0.32, len)} c={THATCH} tex="shingles" p={[0, h + roofH / 2, (sd * d) / 4]} r={[sd * (Math.PI / 2 - slope), 0, 0]} />
      ))}
      <M g={cylG(0.2, 0.2, w + 0.7, 12)} c="#b88d44" tex="shingles" p={[0, h + roofH + 0.1, 0]} r={[0, 0, Math.PI / 2]} />
      {/* gable ends (plaster triangles as a thin wedge) */}
      {[-1, 1].map((sd) => (
        <group key={sd} position={[(sd * w) / 2 - sd * 0.01, h, 0]} rotation={[0, sd * Math.PI / 2, 0]}>
          <M g={coneG(d / 2, roofH, 3)} c={wall} tex="plaster" p={[0, roofH / 2, 0]} r={[0, Math.PI / 6, 0]} s={[1, 1, 0.05]} />
        </group>
      ))}
      {/* door and a small shuttered window */}
      <M g={boxG(0.95, 1.85, 0.08)} c="#6a4428" tex="planks" p={[(door - 0.5) * w + 0.6, 0.93, d / 2 + 0.05]} />
      <M g={boxG(0.7, 0.55, 0.03)} c="#2a2438" p={[(door - 0.5) * w + 2.0, h * 0.62, d / 2 + 0.02]} />
      {[-1, 1].map((sd) => (
        <M key={sd} g={boxG(0.36, 0.6, 0.05)} c="#7a5030" tex="planks" p={[(door - 0.5) * w + 2.0 + sd * 0.56, h * 0.62, d / 2 + 0.05]} r={[0, sd * -0.5, 0]} />
      ))}
    </group>
  );
};

export const Cart: React.FC<{ p: V3; yaw?: number; hay?: boolean }> = ({ p, yaw = 0, hay = true }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(2.2, 0.12, 1.2)} c="#a8743e" tex="planks" p={[0, 0.72, 0]} />
    {[-1, 1].map((sd) => (
      <M key={sd} g={boxG(2.2, 0.36, 0.08)} c="#9a6a38" tex="planks" p={[0, 0.94, sd * 0.56]} />
    ))}
    {[-1, 1].map((sd) => (
      <group key={sd} position={[0.1, 0.48, sd * 0.68]}>
        <M g={torG(0.44, 0.06)} c="#6a4426" tex="wood" />
        <M g={boxG(0.06, 0.86, 0.05)} c="#6a4426" />
        <M g={boxG(0.86, 0.06, 0.05)} c="#6a4426" />
      </group>
    ))}
    {[-1, 1].map((sd) => (
      <M key={sd} g={boxG(1.6, 0.08, 0.08)} c="#7a5030" tex="wood" p={[1.85, 0.62, sd * 0.4]} r={[0, 0, -0.12]} />
    ))}
    {hay ? <M g={sphG(0.42, 14)} c="#d8b45a" tex="grass" p={[-0.4, 1.05, 0]} s={[1.4, 0.55, 1.1]} /> : null}
  </group>
);

export const Well: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <M g={cylG(0.75, 0.8, 0.85, 20, false)} c="#a59a8a" tex="stone" p={[0, 0.42, 0]} />
    <M g={cylG(0.56, 0.56, 0.02, 20)} c="#1e2440" p={[0, 0.86, 0]} />
    {[-1, 1].map((sd) => (
      <M key={sd} g={boxG(0.1, 1.5, 0.1)} c="#5a3a24" tex="wood" p={[sd * 0.68, 1.5, 0]} />
    ))}
    <M g={cylG(0.07, 0.07, 1.46, 10)} c="#7a5030" tex="wood" p={[0, 1.95, 0]} r={[0, 0, Math.PI / 2]} />
    {[-1, 1].map((sd) => (
      <M key={sd} g={boxG(1.8, 0.08, 0.9)} c="#8a5a30" tex="planks" p={[0, 2.42, sd * 0.3]} r={[sd * 0.62, 0, 0]} />
    ))}
    <M g={cylG(0.14, 0.12, 0.22, 12)} c="#6a4428" tex="wood" p={[0.1, 1.4, 0]} />
  </group>
);

export const Fence: React.FC<{ p: V3; n: number; yaw?: number }> = ({ p, n, yaw = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    {Array.from({ length: n }, (_, i) => (
      <M key={i} g={boxG(0.1, 1.0 + (i % 3) * 0.06, 0.1)} c="#7a5634" tex="wood" p={[i * 1.1, 0.5, 0]} r={[0, 0, (i % 2 ? 0.04 : -0.03)]} />
    ))}
    {[0.4, 0.8].map((y) => (
      <M key={y} g={boxG(1.1 * (n - 1) + 0.2, 0.07, 0.05)} c="#8a6240" tex="wood" p={[0.55 * (n - 1), y, 0.08]} />
    ))}
  </group>
);

export const Tree: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <M g={cylG(0.18, 0.26, 2.4, 10)} c="#5a3c26" tex="wood" p={[0, 1.2, 0]} />
    <M g={sphG(1.5, 16)} c="#4f8a3c" tex="grass" p={[0, 3.2, 0]} />
    <M g={sphG(1.1, 14)} c="#5e9a44" tex="grass" p={[0.8, 3.9, 0.3]} />
    <M g={sphG(1.0, 14)} c="#457a34" tex="grass" p={[-0.9, 3.7, -0.2]} />
  </group>
);

/** the priory church on the hill behind the village */
export const Priory: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <M g={boxG(9, 6, 5)} c="#b8ad98" tex="stone" p={[0, 3, 0]} />
    <M g={boxG(3.2, 13, 3.2)} c="#aca28c" tex="stone" p={[-3.5, 6.5, 0.2]} />
    <M g={coneG(2.5, 4, 4)} c="#6a6a7a" tex="roofTiles" p={[-3.5, 15, 0.2]} r={[0, Math.PI / 4, 0]} />
    {[-1, 1].map((sd) => (
      <M key={sd} g={boxG(9.6, 0.25, 3.4)} c="#6a6a7a" tex="roofTiles" p={[0.3, 7.1, sd * 1.25]} r={[sd * 0.75, 0, 0]} />
    ))}
    <M g={boxG(0.8, 1.6, 0.05)} c="#2a2438" p={[-3.5, 10.5, 1.82]} />
  </group>
);

export const Hay: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <M g={sphG(0.8 * s, 14)} c="#d9b25a" tex="grass" p={p} s={[1.3, 0.6, 1]} />
);

/** the street: a mud ground, a grass verge, cottages both sides, dressing */
export const Village: React.FC = () => (
  <group>
    <M g={boxG(140, 0.2, 140)} c="#7f9a4c" tex="grass" p={[0, -0.1, -30]} />
    <M g={boxG(7, 0.2, 80)} c="#8a6a48" tex="sand" ts={0.6} p={[0, -0.085, -20]} />
    <Cottage p={[-8.2, 0, -4.5]} w={7} h={2.9} d={5} yaw={0.12} />
    <Cottage p={[7.8, 0, -6.5]} w={6.4} h={2.8} d={5} yaw={-0.18} wall="#e6d2b0" door={0.7} />
    <Cottage p={[-6.5, 0, -17]} w={6} h={2.7} d={5} yaw={0.3} wall="#e2d6c0" />
    <Cottage p={[8.5, 0, -18]} w={6} h={3} d={5} yaw={-0.35} />
    <Priory p={[2, 2.2, -45]} />
    <M g={sphG(14, 20)} c="#6f8f48" tex="grass" p={[2, -9.5, -46]} s={[2.4, 1, 1.4]} />
    <Well p={[3.6, 0, -3.2]} />
    <Cart p={[-4.3, 0, -0.6]} yaw={0.5} />
    <Barrel p={[-4.7, 0, -3.6]} />
    <Barrel p={[-5.4, 0, -3.2]} />
    <Crate p={[5.3, 0, -2.2]} s={0.6} yaw={0.3} />
    <Crate p={[5.2, 0.6, -2.3]} s={0.45} yaw={0.6} />
    <Hay p={[-3.2, 0.2, -9]} />
    <Fence p={[3.4, 0, -9.5]} n={6} yaw={-0.1} />
    <Fence p={[-12, 0, -10]} n={5} yaw={0.05} />
    <Tree p={[-13, 0, -12]} s={1.2} />
    <Tree p={[12.5, 0, -12]} s={1.1} />
    <Tree p={[-2, 0, -30]} s={1.4} />
    <Tree p={[13, 0, -28]} s={1.3} />
  </group>
);
