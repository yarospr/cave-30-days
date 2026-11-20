// Interiors and extra exteriors for S04–S12: the priory scriptorium, Maud's alehouse, the river below the tannery,
// the manor hall (the court), the cellar. Dense dressing, painted surfaces, warm practicals, no coplanar faces.
import React from "react";
import { boxG, coneG, coreMat, cylG, Flame, M, sphG, torG } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";
import { Chronicle } from "./props";

const n1 = (x: number) => { const s = Math.sin(x * 127.1) * 43758.5453; return s - Math.floor(s); };

// ------------------------------------------------------------------ small props
export const Candle: React.FC<{ p: V3; t: number; h?: number; seed?: number }> = ({ p, t, h = 0.16, seed = 0 }) => (
  <group position={p}>
    <M g={cylG(0.03, 0.035, 0.03, 10)} c="#8a6a3a" tex="metal" p={[0, 0.015, 0]} />
    <M g={cylG(0.02, 0.02, h, 8)} c="#f2e8cc" p={[0, 0.03 + h / 2, 0]} />
    <Flame p={[0, 0.05 + h, 0]} s={0.07} t={t} seed={seed} />
  </group>
);
export const Mug: React.FC<{ p: V3; c?: string }> = ({ p, c = "#8a6a4a" }) => (
  <group position={p}>
    <M g={cylG(0.045, 0.04, 0.12, 10)} c={c} tex="wood" p={[0, 0.06, 0]} />
    <M g={torG(0.03, 0.008)} c={c} p={[0.05, 0.06, 0]} r={[0, 0, Math.PI / 2]} />
  </group>
);
export const Cup: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <M g={cylG(0.06, 0.03, 0.1, 14)} c="#d8dce4" tex="metal" p={[0, 0.16, 0]} />
    <M g={cylG(0.012, 0.012, 0.1, 8)} c="#c8ccd4" tex="metal" p={[0, 0.06, 0]} />
    <M g={cylG(0.05, 0.055, 0.015, 14)} c="#c8ccd4" tex="metal" p={[0, 0.008, 0]} />
  </group>
);
export const Bread: React.FC<{ p: V3 }> = ({ p }) => <M g={sphG(0.08, 10)} c="#a86a34" tex="sand" p={p} s={[1.4, 0.7, 1]} />;
export const Bowl: React.FC<{ p: V3; full?: string }> = ({ p, full = "#8a8270" }) => (
  <group position={p}>
    <M g={cylG(0.09, 0.06, 0.06, 12, true)} c="#7a5a3a" tex="wood" p={[0, 0.03, 0]} />
    <M g={cylG(0.08, 0.08, 0.01, 12)} c={full} p={[0, 0.05, 0]} />
  </group>
);
export const Dice: React.FC<{ p: V3; r?: number }> = ({ p, r = 0 }) => <M g={boxG(0.03, 0.03, 0.03)} c="#f2ecdc" p={[p[0], p[1] + 0.015, p[2]]} r={[0, r, 0]} />;
export const Coin: React.FC<{ p: V3 }> = ({ p }) => <M g={cylG(0.018, 0.018, 0.004, 12)} c="#c8cdd4" tex="metal" p={p} />;
const Barrel: React.FC<{ p: V3; lie?: boolean }> = ({ p, lie }) => (
  <group position={p} rotation={lie ? [0, 0, Math.PI / 2] : [0, 0, 0]}>
    <M g={cylG(0.32, 0.3, 0.9, 14)} c="#b8743a" tex="wood" p={[0, lie ? 0 : 0.45, 0]} />
    {[0.15, 0.75].map((y) => <M key={y} g={cylG(0.335, 0.335, 0.05, 14)} c="#4a4a52" tex="metal" p={[0, lie ? y - 0.45 : y, 0]} />)}
  </group>
);
export { Barrel };
const Bench: React.FC<{ p: V3; len: number; yaw?: number }> = ({ p, len, yaw = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(len, 0.06, 0.3)} c="#8a5a34" tex="planks" p={[0, 0.45, 0]} />
    {[-1, 1].map((s) => <M key={s} g={boxG(0.06, 0.45, 0.26)} c="#6a4426" tex="wood" p={[s * (len / 2 - 0.2), 0.22, 0]} />)}
  </group>
);
const Table: React.FC<{ p: V3; len: number; w?: number; yaw?: number; h?: number }> = ({ p, len, w = 0.9, yaw = 0, h = 0.76 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(len, 0.07, w)} c="#9a6a3a" tex="planks" p={[0, h, 0]} />
    {[-1, 1].map((s) => <M key={s} g={boxG(0.1, h, w * 0.8)} c="#6a4426" tex="wood" p={[s * (len / 2 - 0.25), h / 2, 0]} />)}
  </group>
);
export { Table, Bench };

// ------------------------------------------------------------------ the priory scriptorium (night, candles)
/** Aldric's desk at the origin facing +z (he sits at z ≈ +0.75); the chronicle open on it */
export const Scriptorium: React.FC<{ t: number; book?: { old?: boolean; line?: number; drawing?: boolean; wet?: number; flip?: number; reveal?: number }; quill?: V3 }> = ({ t, book = {}, quill }) => (
  <group>
    <M g={boxG(16, 0.2, 18)} c="#8a8478" tex="stone" p={[0, -0.1, -2]} />
    <M g={boxG(16, 6, 0.4)} c="#a89c84" tex="stone" p={[0, 3, -7]} />
    <M g={boxG(0.4, 6, 18)} c="#a89c84" tex="stone" p={[-6, 3, -2]} />
    <M g={boxG(0.4, 6, 18)} c="#a89c84" tex="stone" p={[6, 3, -2]} />
    <M g={boxG(16, 6, 0.4)} c="#a89c84" tex="stone" p={[0, 3, 6]} />
    <M g={boxG(16, 0.3, 18)} c="#4a3a2a" tex="planks" p={[0, 6.1, -2]} />
    {[-5, -2, 1, 4].map((z) => <M key={z} g={boxG(12, 0.3, 0.3)} c="#5a3a22" tex="wood" p={[0, 5.7, z]} />)}
    {/* arched windows with moonlight (left wall), a cross on the back wall */}
    {[-4.5, -1, 2.5].map((z) => (
      <group key={z} position={[-5.78, 2.6, z]}>
        <mesh material={coreMat("#6a8ad8", 0.85)} userData={{ outline: false }}><boxGeometry args={[0.05, 1.6, 0.8]} /></mesh>
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]} material={coreMat("#6a8ad8", 0.85)} userData={{ outline: false }}><cylinderGeometry args={[0.4, 0.4, 0.05, 16, 1, false, 0, Math.PI]} /></mesh>
        <M g={boxG(0.1, 0.06, 0.9)} c="#5a4a3a" p={[0.05, 0, 0]} />
        <M g={boxG(0.1, 1.6, 0.06)} c="#5a4a3a" p={[0.05, 0, 0]} />
      </group>
    ))}
    <M g={boxG(0.16, 1.4, 0.1)} c="#5a3a22" tex="wood" p={[0, 3.6, -6.75]} />
    <M g={boxG(0.8, 0.16, 0.1)} c="#5a3a22" tex="wood" p={[0, 3.9, -6.75]} />
    {/* writing desks in rows, each with a candle, an ink pot, parchment */}
    {[[-3.2, -3.5], [-0.2, -3.5], [2.8, -3.5], [-3.2, -1.2], [2.8, -1.2], [-3.2, 1.2], [2.8, 1.2]].map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <M g={boxG(1.2, 0.06, 0.7)} c="#7a5030" tex="wood" p={[0, 0.95, 0]} r={[0.25, 0, 0]} />
        <M g={boxG(1.1, 0.9, 0.08)} c="#6a4426" tex="wood" p={[0, 0.45, -0.3]} />
        <M g={boxG(0.5, 0.004, 0.35)} c="#efe2bf" tex="paper" p={[0, 0.99, 0.02]} r={[0.25, 0, 0]} />
        <Candle p={[0.45, 1.0, -0.18]} t={t} seed={i} />
        <M g={cylG(0.04, 0.05, 0.07, 10)} c="#2a2a30" p={[-0.4, 1.0, -0.18]} />
        <M g={boxG(0.45, 0.42, 0.06)} c="#6a4426" tex="wood" p={[0, 0.24, 0.65]} />
      </group>
    ))}
    {/* shelves of books and scrolls on the right wall */}
    {[-4.5, -2.2].map((z) => (
      <group key={z} position={[5.6, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
        {[-1, 1].map((s) => <M key={s} g={boxG(0.08, 2.6, 0.5)} c="#5a3a22" tex="wood" p={[s * 1.0, 1.3, 0]} />)}
        {[0.6, 1.2, 1.8, 2.4].map((y) => <M key={y} g={boxG(2.0, 0.05, 0.5)} c="#6a4426" tex="wood" p={[0, y, 0]} />)}
        {[0.6, 1.2, 1.8].map((y, r) => Array.from({ length: 7 }, (_, i) => <M key={`${r}${i}`} g={r === 1 ? cylG(0.06, 0.06, 0.4, 8) : boxG(0.1, 0.36, 0.3)} c={["#7a3a2a", "#3a4a6a", "#6a5a2a", "#e8dcc0"][(i + r) % 4]} tex="paper" p={[-0.8 + i * 0.27, y + (r === 1 ? 0.08 : 0.2), 0]} r={r === 1 ? [Math.PI / 2, 0, 0] : [0, 0, (i % 3) * 0.05]} />))}
      </group>
    ))}
    {/* parchments drying on a line */}
    <M g={cylG(0.008, 0.008, 7, 6)} c="#c8b8a0" p={[0, 3.2, -5.6]} r={[0, 0, Math.PI / 2]} />
    {[-2.6, -1.4, -0.2, 1.0, 2.2].map((x) => <M key={x} g={boxG(0.6, 0.8, 0.01)} c="#efe2bf" tex="paper" p={[x, 2.78, -5.6]} />)}
    {/* Aldric's desk (front, flat top), the chronicle, candles, quills */}
    <group position={[0, 0, 0]}>
      <M g={boxG(1.6, 0.07, 0.95)} c="#7a5030" tex="wood" p={[0, 0.79, 0]} />
      <M g={boxG(1.5, 0.75, 0.08)} c="#6a4426" tex="wood" p={[0, 0.38, -0.42]} />
      {[-0.72, 0.72].map((x) => <M key={x} g={boxG(0.08, 0.76, 0.85)} c="#6a4426" tex="wood" p={[x, 0.38, 0]} />)}
      <Chronicle p={[0, 0.825, 0]} s={0.95} old={book.old ?? false} line={book.line ?? 0} drawing={book.drawing ?? false} wet={book.wet ?? 0} flip={book.flip ?? -1} reveal={book.reveal ?? 1} />
      <Candle p={[-0.62, 0.825, -0.25]} t={t} h={0.22} seed={11} />
      <Candle p={[0.62, 0.825, -0.3]} t={t} h={0.14} seed={12} />
      <M g={cylG(0.04, 0.05, 0.07, 10)} c="#2a2a30" p={[0.58, 0.86, 0.15]} />
      <group position={quill ?? [0.6, 0.93, 0.17]} rotation={[0.3, 0, 0.5]}>
        <M g={cylG(0.003, 0.003, 0.22, 5)} c="#f2ece0" p={[0, 0.11, 0]} />
        <M g={boxG(0.025, 0.14, 0.002)} c="#f2ece0" p={[0.01, 0.16, 0]} />
      </group>
    </group>
  </group>
);

// ------------------------------------------------------------------ Maud's alehouse
/** the room: hearth at the back (z = -4.5), long tables, barrels along the left wall, the counter at the right */
export const Alehouse: React.FC<{ t: number; night?: boolean; cup?: boolean; dice?: number }> = ({ t, night = false, cup = false, dice = 0 }) => (
  <group>
    <M g={boxG(14, 0.2, 12)} c="#6a5a46" tex="planks" p={[0, -0.1, -1]} />
    <M g={boxG(14, 4, 0.3)} c="#d8c8a8" tex="plaster" p={[0, 2, -5.2]} />
    <M g={boxG(0.3, 4, 12)} c="#d8c8a8" tex="plaster" p={[-6, 2, -1]} />
    <M g={boxG(0.3, 4, 12)} c="#d8c8a8" tex="plaster" p={[6, 2, -1]} />
    <M g={boxG(14, 4, 0.3)} c="#d8c8a8" tex="plaster" p={[0, 2, 5]} />
    <M g={boxG(14, 0.2, 12)} c="#5a4430" tex="planks" p={[0, 4.1, -1]} />
    {[-4, -1.5, 1, 3.5].map((z) => <M key={z} g={boxG(12, 0.3, 0.3)} c="#4a3222" tex="wood" p={[0, 3.3, z]} />)}
    {[-4.5, -1.5, 1.5, 4.5].map((x) => <M key={x} g={boxG(0.25, 4, 0.25)} c="#4a3222" tex="wood" p={[x, 2, -5.0]} />)}
    {/* hearth + cauldron + fire */}
    <M g={boxG(2.4, 1.2, 0.8)} c="#8a7a6a" tex="stone" p={[0, 0.6, -4.7]} />
    <M g={boxG(2.6, 2.8, 0.5)} c="#8a7a6a" tex="stone" p={[0, 2.6, -4.9]} />
    <mesh position={[0, 0.62, -4.4]} material={coreMat("#ff8a2a", 1.1)} userData={{ outline: false }}><boxGeometry args={[1.4, 0.04, 0.4]} /></mesh>
    <Flame p={[-0.3, 0.7, -4.35]} s={0.35} t={t} seed={1} />
    <Flame p={[0.3, 0.7, -4.35]} s={0.3} t={t} seed={2} />
    <M g={sphG(0.38, 14)} c="#2a2a30" tex="metal" p={[0, 1.2, -4.3]} s={[1, 0.8, 1]} />
    <M g={cylG(0.012, 0.012, 1.2, 6)} c="#3a3a40" p={[0, 1.9, -4.3]} />
    {/* hanging pots and herbs */}
    {[-2.5, -2, 2, 2.6].map((x, i) => <M key={x} g={i % 2 ? sphG(0.14, 8) : cylG(0.12, 0.1, 0.18, 10)} c={i % 2 ? "#6a8a4a" : "#7a5a3a"} tex={i % 2 ? "grass" : "metal"} p={[x, 2.8, -4.85]} />)}
    {/* barrels along the left wall (stacked) */}
    {[-3, -2, -1, 0, 1].map((z) => <Barrel key={z} p={[-5.4, 0.32, z]} lie />)}
    {[-2.5, -1.5, -0.5, 0.5].map((z) => <Barrel key={`u${z}`} p={[-5.4, 0.95, z]} lie />)}
    <Barrel p={[-4.8, 0, -4.1]} /><Barrel p={[-4.1, 0, -4.4]} />
    {/* the counter with kegs and mugs */}
    <group position={[4.6, 0, -1.5]}>
      <M g={boxG(0.9, 1.1, 4)} c="#7a5030" tex="planks" p={[0, 0.55, 0]} />
      <M g={boxG(1.0, 0.08, 4.1)} c="#9a6a3a" tex="wood" p={[0, 1.12, 0]} />
      {[-1.4, -0.4, 0.6, 1.5].map((z, i) => <Mug key={z} p={[0, 1.16, z]} c={i % 2 ? "#8a6a4a" : "#6a7a8a"} />)}
      <Barrel p={[0.9, 1.16, -1]} lie /><Barrel p={[0.9, 1.16, 0.4]} lie />
    </group>
    {/* long tables and benches with dressing */}
    {[[-1.8, -1.8], [1.4, -1.6], [-1.6, 1.4], [1.6, 1.6]].map(([x, z], i) => (
      <group key={i}>
        <Table p={[x, 0, z]} len={2.6} />
        <Bench p={[x, 0, z - 0.75]} len={2.4} />
        <Bench p={[x, 0, z + 0.75]} len={2.4} />
        <Mug p={[x - 0.6, 0.8, z + 0.1]} /><Mug p={[x + 0.5, 0.8, z - 0.2]} c="#6a7a8a" />
        <Bread p={[x, 0.82, z + 0.15]} />
        <Candle p={[x + 0.9, 0.8, z]} t={t} seed={20 + i} />
      </group>
    ))}
    {cup ? <Cup p={[1.1, 0.8, -1.5]} /> : null}
    {dice > 0 ? <><Dice p={[1.5, 0.8, -1.4]} r={dice * 3} /><Dice p={[1.62, 0.8, -1.55]} r={dice * 5} />{[0, 1, 2].map((k) => <Coin key={k} p={[1.8 + k * 0.03, 0.8, -1.7]} />)}</> : null}
    {/* windows: daylight or night */}
    {[-3, 3].map((x) => (
      <group key={x} position={[x, 2.1, 4.84]}>
        <mesh material={coreMat(night ? "#24306a" : "#fff0c8", night ? 0.8 : 1.05)} userData={{ outline: false }}><boxGeometry args={[1.0, 0.9, 0.04]} /></mesh>
        <M g={boxG(1.1, 0.08, 0.1)} c="#4a3222" p={[0, 0, -0.04]} />
        <M g={boxG(0.08, 1.0, 0.1)} c="#4a3222" p={[0, 0, -0.04]} />
      </group>
    ))}
    <M g={boxG(1.1, 2.1, 0.1)} c="#5a3a22" tex="planks" p={[0, 1.05, 4.84]} />
  </group>
);

// ------------------------------------------------------------------ the river below the tannery (and the latrine)
export const River: React.FC<{ t: number }> = ({ t }) => {
  const flow = (t * 0.25) % 1;
  return (
    <group>
      <M g={boxG(6, 0.1, 80)} c="#3a6a8a" p={[0, 0.0, 0]} />
      {Array.from({ length: 16 }, (_, i) => <M key={i} g={boxG(0.08 + (i % 3) * 0.05, 0.01, 1.4)} c="#9ac8e0" op={0.6} p={[-2.3 + (i * 0.37) % 4.6, 0.06, -38 + ((i * 5.3 + flow * 10) % 76)]} cast={false} />)}
      {[-1, 1].map((s) => <M key={s} g={boxG(2.6, 0.4, 80)} c="#6a5a3a" tex="sand" p={[s * 4.2, 0.05, 0]} r={[0, 0, s * -0.12]} />)}
      {Array.from({ length: 30 }, (_, i) => <M key={`r${i}`} g={coneG(0.06, 0.9 + n1(i) * 0.5, 5)} c="#6a8a3a" tex="grass" p={[(i % 2 ? 1 : -1) * (3.1 + n1(i + 3) * 0.4), 0.3, -30 + i * 2.1]} />)}
      {/* the tannery upstream: a shed, hides on frames, vats */}
      <group position={[5.5, 0, -12]}>
        <M g={boxG(4, 2.6, 3)} c="#9a8a6a" tex="planks" p={[0, 1.3, 0]} />
        {[-1, 1].map((s) => <M key={s} g={boxG(4.6, 0.15, 2)} c="#8a6a3a" tex="shingles" p={[0, 3.0, s * 0.8]} r={[s * 0.5, 0, 0]} />)}
        {[-1.6, -0.4, 0.8].map((z, i) => (
          <group key={z} position={[-2.6, 0, z]}>
            {[-0.5, 0.5].map((x) => <M key={x} g={boxG(0.08, 1.8, 0.08)} c="#5a3a22" p={[0, 0.9, x]} />)}
            <M g={boxG(0.04, 1.0, 0.9)} c={["#a87a4a", "#8a5a3a", "#b88a5a"][i]} tex="fabric" p={[0, 1.2, 0]} />
          </group>
        ))}
        {[0, 1].map((k) => <M key={k} g={cylG(0.5, 0.5, 0.7, 14)} c="#6a4a2a" tex="wood" p={[-1 + k * 1.4, 0.35, 2.2]} />)}
        <M g={boxG(0.4, 0.15, 3)} c="#5a4a2a" p={[-2.9, 0.1, 3.2]} r={[0, 0, -0.3]} />
      </group>
      {/* the latrine */}
      <group position={[-6.5, 0, 6]}>
        <M g={boxG(1.2, 2.1, 1.2)} c="#8a6a4a" tex="planks" p={[0, 1.05, 0]} />
        <M g={boxG(1.5, 0.12, 1.5)} c="#6a4a2a" tex="planks" p={[0, 2.18, 0]} r={[0.15, 0, 0]} />
        <M g={boxG(0.8, 1.8, 0.05)} c="#6a4a2a" tex="planks" p={[0, 0.9, 0.62]} />
        <M g={boxG(0.16, 0.16, 0.06)} c="#2a2228" p={[0, 1.55, 0.66]} />
      </group>
    </group>
  );
};
/** a straw bed in a corner (the alehouse loft) */
export const StrawBed: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <M g={boxG(2, 0.25, 1)} c="#d8b45a" tex="grass" p={[0, 0.12, 0]} />
    <M g={sphG(0.25, 10)} c="#c8a44a" tex="grass" p={[-0.7, 0.3, 0]} s={[1.4, 0.6, 1.2]} />
    <M g={boxG(1.4, 0.04, 0.8)} c="#8a7a6a" tex="fabric" p={[0.2, 0.27, 0]} />
  </group>
);

// ------------------------------------------------------------------ the manor hall (the court)
export const Hall: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <M g={boxG(14, 0.2, 18)} c="#8a8478" tex="stone" p={[0, -0.1, 0]} />
    <M g={boxG(14, 7, 0.4)} c="#b0a48c" tex="stone" p={[0, 3.5, -8]} />
    <M g={boxG(0.4, 7, 18)} c="#b0a48c" tex="stone" p={[-7, 3.5, 0]} />
    <M g={boxG(0.4, 7, 18)} c="#b0a48c" tex="stone" p={[7, 3.5, 0]} />
    <M g={boxG(14, 7, 0.4)} c="#b0a48c" tex="stone" p={[0, 3.5, 9]} />
    <M g={boxG(14, 0.3, 18)} c="#4a3a2a" tex="planks" p={[0, 7.1, 0]} />
    {[-6, -2, 2, 6].map((z) => (
      <group key={z}>
        <M g={boxG(13.4, 0.35, 0.35)} c="#4a3222" tex="wood" p={[0, 6.2, z]} />
        {[-1, 1].map((s) => <M key={s} g={boxG(0.25, 2.6, 0.25)} c="#4a3222" tex="wood" p={[s * 3.2, 6.2, z]} r={[0, 0, s * 1.0]} />)}
      </group>
    ))}
    {/* dais, table, the steward's chair, banner */}
    <M g={boxG(9, 0.4, 3.2)} c="#9a8e78" tex="stone" p={[0, 0.2, -6.2]} />
    <Table p={[0, 0.4, -6.0]} len={5} w={1.0} />
    <group position={[0, 0.4, -6.9]}>
      <M g={boxG(0.9, 0.08, 0.8)} c="#6a3a2a" tex="wood" p={[0, 0.55, 0]} />
      <M g={boxG(0.9, 1.9, 0.12)} c="#5a3222" tex="wood" p={[0, 1.4, -0.35]} />
      <M g={boxG(0.6, 1.2, 0.02)} c="#3a5a9a" tex="fabric" p={[0, 1.5, -0.28]} />
    </group>
    <M g={boxG(2.2, 3.2, 0.05)} c="#2a4a8a" tex="fabric" p={[0, 4.2, -7.77]} />
    <M g={boxG(0.9, 0.9, 0.06)} c="#e8c44a" p={[0, 4.4, -7.74]} r={[0, 0, Math.PI / 4]} />
    {[-2.2, -1.2, 1.2, 2.2].map((x) => <M key={x} g={boxG(0.25, 0.3, 0.25)} c="#e8dcc0" tex="paper" p={[x, 1.33, -6.0]} />)}
    <Candle p={[-1.8, 1.18, -6.1]} t={t} h={0.25} /><Candle p={[1.8, 1.18, -6.1]} t={t} h={0.25} seed={3} />
    {/* the jury bench (left side) */}
    <Bench p={[-4.6, 0, -2.6]} len={5.5} yaw={Math.PI / 2} />
    <Bench p={[-5.6, 0, -2.6]} len={5.5} yaw={Math.PI / 2} />
    {/* torches on the walls + windows with light */}
    {[[-6.75, -4], [-6.75, 2], [6.75, -4], [6.75, 2]].map(([x, z], i) => (
      <group key={i} position={[x, 2.8, z]}>
        <M g={cylG(0.04, 0.03, 0.5, 6)} c="#5a3a22" p={[x > 0 ? -0.12 : 0.12, 0, 0]} r={[0, 0, x > 0 ? 0.4 : -0.4]} />
        <Flame p={[x > 0 ? -0.22 : 0.22, 0.3, 0]} s={0.18} t={t} seed={30 + i} />
      </group>
    ))}
    {[-3, 0, 3].map((z) => <mesh key={z} position={[6.78, 4.4, z * 1.6 + 1]} material={coreMat("#fff0c8", 1.0)} userData={{ outline: false }}><boxGeometry args={[0.04, 1.6, 0.7]} /></mesh>)}
  </group>
);

// ------------------------------------------------------------------ the cellar (night)
export const Cellar: React.FC<{ t: number; gate?: number }> = ({ t, gate = 0 }) => (
  <group>
    <M g={boxG(8, 0.2, 8)} c="#5a5650" tex="stone" p={[0, -0.1, 0]} />
    <M g={boxG(8, 3.4, 0.4)} c="#7a7468" tex="stone" p={[0, 1.7, -3]} />
    <M g={boxG(0.4, 3.4, 8)} c="#7a7468" tex="stone" p={[-3, 1.7, 0]} />
    <M g={boxG(0.4, 3.4, 8)} c="#7a7468" tex="stone" p={[3, 1.7, 0]} />
    {[-2, 0, 2].map((z) => <M key={z} g={torG(3, 0.3, Math.PI)} c="#6a6458" tex="stone" p={[0, 1.6, z]} s={[1, 0.6, 1]} />)}
    <M g={boxG(8, 0.3, 8)} c="#5a5448" tex="stone" p={[0, 3.45, 0]} />
    {/* the small barred window high up with moonlight */}
    <group position={[-1.2, 2.7, -2.78]}>
      <mesh material={coreMat("#7a9ae8", 1.0)} userData={{ outline: false }}><boxGeometry args={[0.7, 0.4, 0.04]} /></mesh>
      {[-0.2, 0, 0.2].map((x) => <M key={x} g={cylG(0.02, 0.02, 0.42, 6)} c="#2a2a30" tex="metal" p={[x, 0, 0.04]} />)}
    </group>
    <mesh position={[-0.9, 1.2, -1.6]} rotation={[0.7, 0, 0.15]} userData={{ outline: false }}><boxGeometry args={[0.6, 3.0, 0.02]} /><meshBasicMaterial color="#9ab4ff" transparent opacity={0.12} depthWrite={false} toneMapped={false} /></mesh>
    {/* straw, a bucket, chains */}
    <M g={boxG(1.8, 0.12, 1.2)} c="#c8a44a" tex="grass" p={[-1.6, 0.06, -1.6]} />
    <M g={cylG(0.18, 0.15, 0.3, 10, true)} c="#6a4a2a" tex="wood" p={[2.2, 0.15, -2.2]} />
    {[0, 1, 2, 3, 4].map((k) => <M key={k} g={torG(0.05, 0.012)} c="#4a4a52" tex="metal" p={[2.75, 2.2 - k * 0.09, -1 + (k % 2) * 0.02]} r={[0, (k % 2) * Math.PI / 2, 0]} />)}
    {/* the bars (front, z = 1.6) with a door that opens by `gate` */}
    {Array.from({ length: 13 }, (_, i) => {
      const x = -2.8 + i * 0.46, door = i >= 5 && i <= 7;
      return door ? null : <M key={i} g={cylG(0.025, 0.025, 3.2, 6)} c="#3a3a42" tex="metal" p={[x, 1.6, 1.6]} />;
    })}
    <M g={boxG(6, 0.08, 0.08)} c="#3a3a42" tex="metal" p={[0, 3.1, 1.6]} />
    <M g={boxG(6, 0.08, 0.08)} c="#3a3a42" tex="metal" p={[0, 0.2, 1.6]} />
    <group position={[-0.5, 0, 1.6]} rotation={[0, -gate * 1.4, 0]}>
      {[0, 1, 2].map((k) => <M key={k} g={cylG(0.025, 0.025, 2.4, 6)} c="#3a3a42" tex="metal" p={[0.23 + k * 0.46, 1.25, 0]} />)}
      {[0.3, 2.3].map((y) => <M key={y} g={boxG(1.38, 0.07, 0.07)} c="#3a3a42" tex="metal" p={[0.69, y, 0]} />)}
      <M g={boxG(0.12, 0.18, 0.1)} c="#5a5a62" tex="metal" p={[1.2, 1.2, 0.05]} />
    </group>
    {/* the corridor outside the bars */}
    <M g={boxG(8, 3.4, 0.4)} c="#7a7468" tex="stone" p={[0, 1.7, 4.2]} />
    <group position={[2.2, 1.6, 4.0]}>
      <M g={cylG(0.04, 0.03, 0.5, 6)} c="#5a3a22" r={[0.4, 0, 0]} p={[0, 0, -0.1]} />
      <Flame p={[0, 0.3, -0.2]} s={0.16} t={t} seed={40} />
    </group>
  </group>
);
