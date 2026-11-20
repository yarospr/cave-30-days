// Sets for the pilot: the university archive at night, the morning field outside Netherwick, the gallows on the
// village green. Painted surfaces, three depth layers, >= 12 props in each framing, no coplanar faces.
import React from "react";
import { boxG, coreMat, cylG, M, sphG, torG } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";
import { Cottage, Fence, Hay, Priory, Tree, Village, Cart } from "./Village";
import { catalogTex, Chronicle, Glow, NoteCard } from "./props";

// ------------------------------------------------------------------ archive (night, a warm desk lamp)
const Shelf: React.FC<{ p: V3; yaw?: number; seed?: number }> = ({ p, yaw = 0, seed = 0 }) => {
  const cols = ["#b8a07a", "#9a8a6a", "#c4b08a", "#7a6a5a", "#a89470"];
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      {[-1, 1].map((s) => <M key={s} g={boxG(0.05, 2.4, 0.5)} c="#7a8088" tex="metal" p={[s * 1.0, 1.2, 0]} />)}
      {[0.1, 0.65, 1.2, 1.75, 2.3].map((y) => <M key={y} g={boxG(2.0, 0.035, 0.5)} c="#8a9098" tex="metal" p={[0, y, 0]} />)}
      {[0.1, 0.65, 1.2, 1.75].map((y, row) =>
        Array.from({ length: 5 }, (_, i) => {
          const k = (seed * 7 + row * 5 + i) % 5, w = 0.3 + (k % 3) * 0.04, h = 0.32 + (k % 2) * 0.08;
          return <M key={`${row}-${i}`} g={boxG(w, h, 0.4)} c={cols[k]} tex="paper" p={[-0.78 + i * 0.39, y + 0.018 + h / 2, 0.02]} />;
        }),
      )}
    </group>
  );
};
export const Archive: React.FC<{ lamp?: number; book?: { old?: boolean; line?: number; wet?: number; flip?: number }; note?: number; noteAt?: V3; catalog?: boolean; noteEnd?: boolean }> = ({ lamp = 1, book = {}, note = 0, noteAt, catalog = false, noteEnd = false }) => (
  <group>
    <M g={boxG(14, 0.2, 14)} c="#6a6460" tex="stone" p={[0, -0.1, 0]} />
    <M g={boxG(14, 4, 0.2)} c="#8a8478" tex="brick" p={[0, 2, -4.6]} />
    <M g={boxG(0.2, 4, 14)} c="#8a8478" tex="brick" p={[-5.2, 2, 0]} />
    <M g={boxG(0.2, 4, 14)} c="#8a8478" tex="brick" p={[5.2, 2, 0]} />
    <M g={boxG(14, 0.2, 14)} c="#5a5650" tex="plaster" p={[0, 4.1, 0]} />
    <M g={boxG(14, 4, 0.2)} c="#8a8478" tex="brick" p={[0, 2, 6.8]} />
    {[-3.4, -1.1, 1.2, 3.5].map((x, i) => <Shelf key={x} p={[x, 0, -3.6]} seed={i} />)}
    <Shelf p={[-4.4, 0, -0.6]} yaw={Math.PI / 2} seed={5} />
    <Shelf p={[4.4, 0, -1.2]} yaw={-Math.PI / 2} seed={6} />
    {/* fluorescent fixtures (off), pipes */}
    {[-2, 2].map((x) => <M key={x} g={boxG(1.4, 0.08, 0.25)} c="#c8ccd0" tex="metal" p={[x, 3.9, -1]} />)}
    <M g={cylG(0.06, 0.06, 10, 10)} c="#7a5a4a" tex="metal" p={[0, 3.75, -4.3]} r={[0, 0, Math.PI / 2]} />
    {/* desk */}
    <group position={[0.4, 0, 0.2]}>
      <M g={boxG(1.8, 0.06, 0.9)} c="#8a5a36" tex="wood" p={[0, 0.76, 0]} />
      {[[-0.85, -0.4], [0.85, -0.4], [-0.85, 0.4], [0.85, 0.4]].map(([x, z]) => <M key={`${x}${z}`} g={boxG(0.06, 0.74, 0.06)} c="#6a4228" tex="wood" p={[x, 0.37, z]} />)}
      <Chronicle p={[-0.05, 0.79, 0.02]} s={0.95} old={book.old ?? true} line={book.line ?? 1} wet={book.wet ?? 0} flip={book.flip ?? -1} />
      <NoteCard p={noteAt ?? [0.62, 0.795, 0.22]} r={[-Math.PI / 2, 0, -0.15]} underline={note} ending={noteEnd} />
      {/* scanner */}
      <M g={boxG(0.4, 0.08, 0.36)} c="#3a3c44" tex="metal" p={[-0.68, 0.83, -0.18]} />
      <M g={boxG(0.35, 0.012, 0.3)} c="#6a8aa8" p={[-0.68, 0.876, -0.18]} />
      {/* banker lamp */}
      <M g={cylG(0.09, 0.11, 0.03, 16)} c="#b08a3a" tex="metal" p={[0.7, 0.805, -0.25]} />
      <M g={cylG(0.012, 0.012, 0.32, 8)} c="#b08a3a" tex="metal" p={[0.7, 0.97, -0.25]} />
      <M g={cylG(0.06, 0.16, 0.12, 16, true)} c="#2f6a4a" tex="metal" p={[0.6, 1.12, -0.22]} r={[0, 0, 0.35]} />
      {lamp > 0 ? <Glow p={[0.59, 1.09, -0.22]} r={0.035} col="#ffd890" k={1.15} /> : null}
      <M g={cylG(0.04, 0.035, 0.11, 12)} c="#f0ece2" tex="paper" p={[0.4, 0.84, 0.3]} />
      <M g={cylG(0.041, 0.041, 0.015, 12)} c="#2a1a14" p={[0.4, 0.9, 0.3]} />
      {[0, 1, 2].map((i) => <M key={i} g={boxG(0.3, 0.05, 0.22)} c={["#7a3a2a", "#3a5a6a", "#6a6a3a"][i]} tex="paper" p={[0.2, 0.815 + i * 0.05, -0.33]} r={[0, 0.1 * i, 0]} />)}
    </group>
    {/* v2 dressing: filing cabinets, a trolley of boxes, a ladder, an exit sign, a poster, desk clutter */}
    {[-3.2, -2.6].map((x, i) => (
      <group key={i} position={[x, 0, 2.4]} rotation={[0, Math.PI / 2, 0]}>
        <M g={boxG(0.5, 1.3, 0.6)} c={i ? "#6a7a6a" : "#7a8088"} tex="metal" p={[0, 0.65, 0]} />
        {[0.3, 0.7, 1.1].map((y) => <M key={y} g={boxG(0.4, 0.03, 0.02)} c="#c8ccd0" p={[0, y, 0.31]} />)}
      </group>
    ))}
    <group position={[2.9, 0, 1.4]} rotation={[0, -0.4, 0]}>
      <M g={boxG(1.0, 0.05, 0.6)} c="#8a9098" tex="metal" p={[0, 0.3, 0]} />
      <M g={boxG(1.0, 0.05, 0.6)} c="#8a9098" tex="metal" p={[0, 0.8, 0]} />
      {[[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].map(([x, z]) => <M key={`${x}${z}`} g={boxG(0.03, 0.85, 0.03)} c="#6a7078" p={[x, 0.45, z]} />)}
      {[[-0.25, 0.3], [0.2, 0.3], [-0.2, 0.8], [0.25, 0.8]].map(([x, y], i) => <M key={i} g={boxG(0.4, 0.3, 0.4)} c="#b8945e" tex="paper" p={[x, y + 0.18, 0]} r={[0, i * 0.2, 0]} />)}
    </group>
    <group position={[-4.9, 0, -2.2]} rotation={[0, 0, 0.18]}>
      {[-0.22, 0.22].map((z) => <M key={z} g={boxG(0.06, 3.0, 0.06)} c="#9a7a4a" tex="wood" p={[0, 1.5, z]} />)}
      {Array.from({ length: 8 }, (_, i) => <M key={i} g={boxG(0.05, 0.04, 0.44)} c="#9a7a4a" tex="wood" p={[0, 0.3 + i * 0.35, 0]} />)}
    </group>
    <group position={[2.5, 3.2, -4.48]}>
      <M g={boxG(0.7, 0.28, 0.06)} c="#1a3a2a" p={[0, 0, 0]} />
      <mesh position={[0, 0, 0.035]} material={coreMat("#4cff9a", 1.0)} userData={{ outline: false }}><boxGeometry args={[0.6, 0.18, 0.01]} /></mesh>
    </group>
    <M g={boxG(0.9, 1.2, 0.02)} c="#d8c8a0" tex="paper" p={[5.08, 2.1, 1.4]} r={[0, -Math.PI / 2, 0]} />
    <M g={boxG(0.7, 0.4, 0.015)} c="#a83a2a" p={[5.07, 2.4, 1.4]} r={[0, -Math.PI / 2, 0]} />
    <group position={[0.4, 0, 0.2]}>
      <M g={boxG(0.3, 0.02, 0.24)} c="#3a3c44" tex="metal" p={[-0.72, 0.805, 0.32]} />
      <M g={boxG(0.3, 0.22, 0.015)} c="#2a2c34" tex="metal" p={[-0.72, 0.92, 0.2]} r={[-0.25, 0, 0]} />
      {catalog ? <mesh position={[-0.72, 0.92, 0.2085]} rotation={[-0.25, 0, 0]} userData={{ outline: false }}><planeGeometry args={[0.28, 0.19]} /><meshBasicMaterial map={catalogTex()} toneMapped={false} /></mesh> : null}
      <M g={cylG(0.035, 0.035, 0.1, 10)} c="#4a6a8a" tex="metal" p={[0.82, 0.84, -0.32]} />
      {[[-0.01, 0.2], [0.01, -0.2], [0, 0]].map(([x, r], i) => <M key={i} g={cylG(0.004, 0.004, 0.16, 6)} c={["#e8c44a", "#c84a3a", "#4a8a4a"][i]} p={[0.82 + x, 0.92, -0.32]} r={[r, 0, r]} />)}
      <M g={torG(0.08, 0.012, Math.PI)} c="#2a2a30" p={[-0.85, 0.85, -0.05]} r={[0, 0.5, 0]} />
    </group>
    {/* chair behind the desk */}
    <group position={[0.4, 0, 0.95]}>
      <M g={boxG(0.5, 0.06, 0.48)} c="#3a3c44" tex="fabric" p={[0, 0.48, 0]} />
      <M g={boxG(0.5, 0.55, 0.06)} c="#3a3c44" tex="fabric" p={[0, 0.8, 0.24]} />
      <M g={cylG(0.03, 0.03, 0.45, 8)} c="#5a5c64" tex="metal" p={[0, 0.23, 0]} />
    </group>
    {/* cardboard boxes on the floor, a trolley, a wall clock reading ~3 */}
    {[[-2.4, -1.6], [-2.0, -1.9], [2.6, -2.2]].map(([x, z], i) => <M key={i} g={boxG(0.5, 0.36, 0.4)} c="#b8945e" tex="paper" p={[x, 0.18 + (i === 1 ? 0.36 : 0), z]} r={[0, i * 0.4, 0]} />)}
    <group position={[-1.6, 2.7, -4.48]}>
      <M g={cylG(0.25, 0.25, 0.05, 24)} c="#f0ece2" p={[0, 0, 0]} r={[Math.PI / 2, 0, 0]} />
      <M g={boxG(0.02, 0.17, 0.01)} c="#1a1a1a" p={[0.04, 0.0, 0.03]} r={[0, 0, -1.4]} />
      <M g={boxG(0.015, 0.2, 0.01)} c="#1a1a1a" p={[0, 0.09, 0.035]} />
    </group>
  </group>
);

// ------------------------------------------------------------------ field (morning)
export const Field: React.FC = () => (
  <group>
    <M g={boxG(200, 0.2, 200)} c="#7f9a4c" tex="grass" p={[0, -0.1, -40]} />
    {/* strip fields */}
    {Array.from({ length: 9 }, (_, i) => (
      <M key={i} g={boxG(6, 0.1, 60)} c={["#a8a050", "#7a8a40", "#9a7a4a", "#8aa04a"][i % 4]} tex={i % 2 ? "grass" : "sand"} p={[-26 + i * 6.4, -0.03, -48]} />
    ))}
    {/* the mud patch where you wake */}
    <M g={cylG(2.2, 2.2, 0.04, 28)} c="#6a4e36" tex="sand" ts={0.5} p={[0, 0.0, 0]} s={[1.3, 1, 1]} />
    <M g={cylG(0.8, 0.8, 0.03, 20)} c="#5a4230" p={[1.4, 0.02, 0.6]} />
    <Fence p={[-7, 0, -3]} n={8} yaw={0.15} />
    <Hay p={[5.5, 0.2, -4]} />
    <Hay p={[6.6, 0.2, -3.2]} s={0.8} />
    <M g={boxG(0.12, 0.9, 0.12)} c="#6a4a2c" tex="wood" p={[3.2, 0.45, 1.6]} r={[0.1, 0, 0.15]} />
    {[[-3, -6], [-2.4, -6.4], [2.8, -5.6]].map(([x, z], i) => <M key={i} g={sphG(0.35, 10)} c="#8a8a80" tex="rock" p={[x, 0.1, z]} s={[1.3, 0.6, 1]} />)}
    {/* the village beyond */}
    <group position={[2, 0, -48]}>
      <Cottage p={[-14, 0, 0]} w={6} h={2.8} d={5} yaw={0.2} />
      <Cottage p={[-5, 0, -4]} w={6.5} h={2.9} d={5} yaw={-0.1} />
      <Cottage p={[6, 0, -1]} w={6} h={2.7} d={5} yaw={0.15} />
      <Cottage p={[15, 0, -5]} w={6} h={2.8} d={5} yaw={-0.25} />
      <Priory p={[2, 2, -26]} />
    </group>
    <Tree p={[-16, 0, -20]} s={1.5} />
    <Tree p={[18, 0, -26]} s={1.6} />
    <Tree p={[-30, 0, -50]} s={2} />
    <Tree p={[32, 0, -46]} s={2} />
  </group>
);
/** soft chimney smoke: translucent puffs that rise, grow and fade (transparent -> never inked) */
export const Chimney: React.FC<{ p: V3; s?: number; t: number; seed?: number }> = ({ p, s = 1, t, seed = 0 }) => (
  <group position={p} scale={s}>
    {Array.from({ length: 6 }, (_, i) => {
      const u = (t * 0.07 + i / 6 + seed * 0.13) % 1;
      return <M key={i} g={sphG(0.6, 14)} c="#ece6de" op={0.55 * (1 - u) * Math.min(1, u * 6)} p={[Math.sin(i * 2.3 + seed) * 0.3 + u * 1.6, u * 5, Math.cos(i * 1.7) * 0.3]} s={0.4 + u * 1.4} cast={false} />;
    })}
  </group>
);
export const FieldSmoke: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Chimney p={[-11, 5.2, -50]} s={1.4} t={t} seed={1} />
    <Chimney p={[-2, 5.4, -54]} s={1.4} t={t} seed={2} />
    <Chimney p={[8, 5.2, -50]} s={1.3} t={t} seed={3} />
  </>
);

// ------------------------------------------------------------------ gallows on the village green (dawn)
export const Gallows: React.FC<{ p: V3; yaw?: number; noose?: boolean }> = ({ p, yaw = 0, noose = true }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <M g={boxG(0.24, 4.4, 0.24)} c="#5a3a22" tex="wood" p={[-1.5, 2.2, 0]} />
    <M g={boxG(0.24, 4.4, 0.24)} c="#5a3a22" tex="wood" p={[1.5, 2.2, 0]} />
    <M g={boxG(3.6, 0.26, 0.26)} c="#5a3a22" tex="wood" p={[0, 4.5, 0]} />
    {[-1, 1].map((s) => <M key={s} g={boxG(0.14, 1.1, 0.14)} c="#5a3a22" tex="wood" p={[s * 1.18, 4.08, 0]} r={[0, 0, s * 0.8]} />)}
    {noose ? (
      <>
        <M g={cylG(0.022, 0.022, 2.1, 8)} c="#c9a46a" tex="fabric" p={[0, 3.4, -0.06]} />
      </>
    ) : null}
  </group>
);
export const Green: React.FC<{ t: number }> = ({ t }) => (
  <group>
    <Village />
    <Gallows p={[0, 0, -24]} />
    <Cart p={[0.1, 0, -23.7]} yaw={Math.PI / 2} hay={false} />
    <Chimney p={[-8.6, 4.4, -5]} s={0.9} t={t} seed={4} />
    <mesh position={[-14, 9, -60]} material={coreMat("#ffd8a0", 1.0)} userData={{ outline: false }}>
      <sphereGeometry args={[2.2, 20, 14]} />
    </mesh>
  </group>
);
