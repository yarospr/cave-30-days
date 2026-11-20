// Small cave effects + overlays, all pure functions of t:
//  Echo      expanding pale-blue rings (sound in total darkness: a shout, a touch, an impact)
//  Breath    cold breath puffs
//  Beat      heartbeat pulse rings on the chest
//  Drip      falling water drops
//  overlays: the stranger's card, the depth cross-section, a big tag, the Siffre clipping, the diary page
import React from "react";
import { AbsoluteFill } from "remotion";
import { coreMat } from "../inkbeat/core/kit";
import type { V3 } from "../inkbeat/types";
import { ramp } from "./time";

/** expanding rings from p (flat on the floor when `flat`, else facing +z) */
export const Echo: React.FC<{ p: V3; t: number; t0: number; d?: number; n?: number; r?: number; flat?: boolean; col?: string; yaw?: number }> = ({ p, t, t0, d = 1.4, n = 3, r = 1.6, flat = false, col = "#a8ccff", yaw = 0 }) => (
  <group position={p} rotation={flat ? [-Math.PI / 2, 0, 0] : [0, yaw, 0]}>
    {Array.from({ length: n }, (_, i) => {
      const k = (t - t0 - i * 0.22) / d;
      if (k <= 0 || k >= 1) return null;
      const rr = 0.05 + r * (1 - (1 - k) ** 2);
      return <mesh key={i} material={coreMat(col, 0.9, Math.max(0.02, 0.85 * (1 - k)))} userData={{ outline: false }}><ringGeometry args={[rr, rr + 0.02 + 0.015 * (1 - k), 48]} /></mesh>;
    })}
  </group>
);
/** breath puffs from the mouth every ~2.2 s */
export const Breath: React.FC<{ p: V3; t: number; dir?: number }> = ({ p, t, dir = 1 }) => (
  <>
    {[0, 1, 2].map((i) => {
      const k = ((t + i * 0.25) % 2.2) / 1.1;
      if (k > 1) return null;
      return <mesh key={i} position={[p[0] + dir * (0.05 + 0.25 * k), p[1] + 0.12 * k, p[2] + 0.06]} scale={0.05 + 0.1 * k} material={coreMat("#d8e4ff", 0.6, 0.55 * (1 - k))} userData={{ outline: false }}><sphereGeometry args={[1, 10, 8]} /></mesh>;
    })}
  </>
);
/** a heartbeat: two quick rings per beat (~70 bpm) */
export const Beat: React.FC<{ p: V3; t: number; yaw?: number }> = ({ p, t, yaw = 0 }) => {
  const ph = (t * 1.15) % 1;
  const k1 = ph / 0.45, k2 = (ph - 0.18) / 0.45;
  return (
    <group position={p} rotation={[0, yaw, 0]}>
      {[k1, k2].map((k, i) => (k > 0 && k < 1 ? <mesh key={i} material={coreMat("#ff8a8a", 0.9, 0.7 * (1 - k))} userData={{ outline: false }}><ringGeometry args={[0.04 + 0.35 * k, 0.06 + 0.35 * k, 40]} /></mesh> : null))}
    </group>
  );
};
/** water drops falling from a stalactite tip to the floor (period ~1.3 s) */
export const Drip: React.FC<{ p: V3; t: number; h: number; seed?: number; col?: string }> = ({ p, t, h, seed = 0, col = "#a8e0ff" }) => {
  const k = ((t + seed * 0.37) % 1.3) / 0.55;
  return k < 1 ? <mesh position={[p[0], p[1] - h * k * k, p[2]]} scale={[1, 1.6, 1]} material={coreMat(col, 0.8)} userData={{ outline: false }}><sphereGeometry args={[0.018, 8, 6]} /></mesh> : null;
};

// ------------------------------------------------------------------ 2D overlays
const font = { fontFamily: "Poppins", fontWeight: 800 } as const;
/** the stranger's card, held up to the lens */
export const CardInsert: React.FC<{ a: number; tilt?: number }> = ({ a, tilt = -4 }) => (
  <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: a }}>
    <div style={{ width: 880, height: 500, background: "#f6f1e6", borderRadius: 18, border: "10px solid #1a1416", transform: `rotate(${tilt}deg) scale(${0.9 + 0.1 * a})`,
      boxShadow: "0 30px 60px rgba(0,0,0,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
      <div style={{ ...font, fontSize: 150, color: "#1a1416", letterSpacing: 2 }}>$1,000,000</div>
      <div style={{ width: 600, height: 6, background: "#1a1416" }} />
      <div style={{ ...font, fontSize: 92, color: "#b8302a", letterSpacing: 8 }}>30 DAYS</div>
    </div>
  </AbsoluteFill>
);
/** a cross-section: the street on top, a crooked cave going down 2 km, "YOU" near the top; k draws the depth arrow */
export const DepthSection: React.FC<{ a: number; k: number }> = ({ a, k }) => {
  const path = "M 960 150 C 900 260 1020 330 940 420 S 860 560 990 640 S 1120 760 980 860 S 900 960 1000 1040";
  return (
    <AbsoluteFill style={{ background: "#07060c", opacity: a }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs><linearGradient id="earth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3a2a24" /><stop offset="1" stopColor="#120c10" /></linearGradient></defs>
        <rect x={0} y={150} width={1920} height={930} fill="url(#earth)" />
        <rect x={0} y={120} width={1920} height={34} fill="#3a7a4a" stroke="#14101a" strokeWidth={6} />
        {[300, 420, 1380, 1560].map((x, i) => <rect key={i} x={x} y={120 - 60 - i * 18} width={90} height={60 + i * 18} fill="#4a4660" stroke="#14101a" strokeWidth={5} />)}
        <path d={path} stroke="#0a0608" strokeWidth={70} fill="none" strokeLinecap="round" />
        <path d={path} stroke="#2a1e22" strokeWidth={50} fill="none" strokeLinecap="round" />
        {[[860, 470, 120], [1060, 720, 150], [920, 930, 110]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.45} fill="#2a1e22" stroke="#0a0608" strokeWidth={10} />)}
        <circle cx={945} cy={410} r={16} fill="#7affc8" />
        <text x={985} y={420} fill="#f4ece0" style={{ ...font, fontSize: 44 }}>YOU</text>
        <line x1={1300} y1={154} x2={1300} y2={154 + 880 * k} stroke="#ff4a3a" strokeWidth={10} strokeDasharray="30 18" />
        {k > 0.95 ? <polygon points="1278,1030 1322,1030 1300,1066" fill="#ff4a3a" /> : null}
        <text x={1340} y={160 + 880 * k} fill="#ff4a3a" style={{ ...font, fontSize: 76 }} opacity={ramp(k, 0.3, 0.6)}>{`${Math.round(2000 * k).toLocaleString("en-US")} M`}</text>
      </svg>
    </AbsoluteFill>
  );
};
/** a big tag (sound-off readability) at a screen position */
export const Tag: React.FC<{ a: number; text: string; x: number; y: number; col?: string; size?: number; rot?: number }> = ({ a, text, x, y, col = "#ffd23a", size = 84, rot = -3 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: a, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${0.85 + 0.15 * a})`, background: col, border: "7px solid #14101a",
    borderRadius: 14, padding: "4px 26px 0", ...font, fontWeight: 900, fontSize: size, color: "#14101a", boxShadow: "0 8px 0 #14101a", whiteSpace: "nowrap" }}>{text}</div>
);
/** a newspaper clipping: Michel Siffre, 1962 */
export const Clipping: React.FC<{ a: number; k: number }> = ({ a, k }) => (
  <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: a, background: `rgba(4,8,6,${0.55 * a})` }}>
    <div style={{ width: 900, padding: "36px 48px", background: "#ebe2cc", transform: `rotate(${2 - 3 * k}deg) scale(1.35)`, boxShadow: "0 30px 60px rgba(0,0,0,0.6)", border: "4px solid #2a2420", color: "#1e1a18" }}>
      <div style={{ ...font, fontSize: 30, letterSpacing: 6, color: "#6a5a4a" }}>FRANCE · 1962</div>
      <div style={{ ...font, fontSize: 64, lineHeight: 1.05, margin: "10px 0 18px" }}>MAN LIVES 2 MONTHS IN A CAVE WITHOUT A CLOCK</div>
      <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
        <div style={{ width: 220, height: 220, background: "#8a8070", border: "4px solid #2a2420", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
          <svg width={200} height={200} viewBox="0 0 200 200"><circle cx={100} cy={80} r={42} fill="#d8c8b0" stroke="#2a2420" strokeWidth={6} /><rect x={50} y={125} width={100} height={90} rx={30} fill="#4a4a50" stroke="#2a2420" strokeWidth={6} /><rect x={60} y={58} width={80} height={22} rx={8} fill="#e8d050" stroke="#2a2420" strokeWidth={5} /></svg>
        </div>
        <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 36, lineHeight: 1.3 }}>
          Michel Siffre came out <span style={{ background: "#ffd23a", padding: "0 6px" }}>sure it was a month earlier</span>. His inner clock had drifted by weeks.
        </div>
      </div>
    </div>
  </AbsoluteFill>
);
/** the diary: up to `n` entries visible, handwriting getting worse */
export const Diary: React.FC<{ a: number; n: number }> = ({ a, n }) => {
  const E = [["DAY 1", "easy money :)"], ["DAY 5", "the voices"], ["DAY 9", "I can't anymore. Ringing the bell."]];
  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: a, background: `rgba(2,10,8,${0.6 * a})` }}>
      <div style={{ width: 1100, height: 760, background: "#e6dcc0", borderRadius: 10, border: "8px solid #3a4a32", boxShadow: "0 30px 60px rgba(0,0,0,0.7), inset 0 0 80px rgba(90,120,80,0.35)", padding: "50px 70px", transform: "rotate(-2deg)",
        backgroundImage: "repeating-linear-gradient(0deg, transparent 0 62px, rgba(60,80,120,0.25) 62px 64px)" }}>
        {E.slice(0, n).map(([d, s], i) => (
          <div key={i} style={{ marginBottom: 46, transform: `rotate(${[-1, 2, -5][i]}deg) skewX(${[-6, -10, -18][i]}deg)`, color: ["#2a3a5a", "#3a3a4a", "#5a2a2a"][i] }}>
            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: 40, letterSpacing: [1, 3, 6][i] }}>{d}</div>
            <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: [62, 66, 58][i], letterSpacing: [0, 2, 5][i], lineHeight: 1.1 }}>{s}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
