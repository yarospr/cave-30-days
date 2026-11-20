// Cave creatures as flat cards in the cast's ink style: bats, the cave cricket, blind white fish, Steve the olm.
// Every pose is a pure function of its arguments (quantised into the texture key).
import React from "react";
import type { V3 } from "../inkbeat/types";
import { FlatThing } from "../flat/extra";
import { INK, mul } from "../flat/toon";
import type { Pen } from "../flat/toon";

type P2 = [number, number];
const q = (x: number, n = 8) => Math.round(x * n) / n;

/** a bat, front view, 600 x 400 units, body centre (300, 200); flap -1 (down) .. 1 (up); hang = folded upside down */
const drawBat = (p: Pen, flap: number, hang: boolean) => {
  const body = "#3a2e3a", wing = "#4e3e50", mem = "#6a5468";
  if (hang) {
    p.poly([[270, 60], [330, 60], [345, 230], [300, 300], [255, 230]], wing, 9);
    p.ell(300, 320, 34, 30, body, 9);
    p.poly([[278, 340], [270, 372], [292, 348]], body, 6); p.poly([[322, 340], [330, 372], [308, 348]], body, 6);
    p.stroke([[290, 60], [290, 30]], 6); p.stroke([[310, 60], [310, 30]], 6);
    p.dot(288, 318, 5, "#ffd890"); p.dot(312, 318, 5, "#ffd890");
    return;
  }
  const up = flap * 120;
  for (const s of [-1, 1]) {
    const tip: P2 = [300 + s * 290, 200 - up], el: P2 = [300 + s * 150, 170 - up * 0.6];
    const pts: P2[] = [[300 + s * 30, 175], el, tip, [300 + s * 230, 230 - up * 0.7], [300 + s * 190, 215 - up * 0.5], [300 + s * 130, 250 - up * 0.4], [300 + s * 80, 225], [300 + s * 30, 240]];
    p.poly(pts, wing, 9);
    p.stroke([el, [300 + s * 190, 215 - up * 0.5]], 4, mem); p.stroke([el, [300 + s * 130, 250 - up * 0.4]], 4, mem);
  }
  p.ell(300, 215, 42, 58, body, 9);
  p.ell(300, 150, 36, 32, body, 9);
  p.poly([[274, 132], [268, 92], [292, 124]], body, 6); p.poly([[326, 132], [332, 92], [308, 124]], body, 6);
  p.dot(287, 148, 5, "#ffd890"); p.dot(313, 148, 5, "#ffd890");
  p.poly([[292, 166], [296, 176], [300, 166]], "#ffffff", 2); p.poly([[300, 166], [304, 176], [308, 166]], "#ffffff", 2);
};
export const Bat: React.FC<{ p: V3; cam: V3; flap?: number; hang?: boolean; s?: number; tint?: string; dir?: 1 | -1; roll?: number }> = ({ p, cam, flap = 0, hang = false, s = 1, tint, dir, roll }) => (
  <FlatThing id={`bat|${q(flap, 4)}|${hang}`} cw={600} ch={400} sole={hang ? 0 : 200} mpu={0.0006 * s} draw={(pen) => drawBat(pen, q(flap, 4), hang)} p={p} cam={cam} tint={tint} res={0.8} noBlob dir={dir} roll={roll} />
);

/** the cave cricket, side view, 700 x 500, feet at y = 430; kick 0..1 */
const drawCricket = (p: Pen, kick: number) => {
  const c = "#d8ccb0", d = mul(c, [0.82, 0.78, 0.72]);
  // long hind legs
  for (const [x, far] of [[300, true], [330, false]] as [number, boolean][]) {
    const kn: P2 = [x + 40, 170 - 40 * kick], ft: P2 = [x + 150 + 60 * kick, 430];
    p.stroke([[x, 300], kn, ft], 18, INK); p.stroke([[x, 300], kn, ft], 10, far ? d : c);
  }
  for (const x of [400, 440, 480]) { p.stroke([[x, 300], [x - 30, 380], [x - 60, 430]], 12, INK); p.stroke([[x, 300], [x - 30, 380], [x - 60, 430]], 6, c); }
  p.ell(400, 280, 140, 70, c, 9);
  for (let k = 0; k < 4; k++) p.arc(330 + k * 40, 280, 22, 60, 300, 420, 4, d);
  p.ell(545, 270, 46, 50, c, 9);
  p.stroke([[575, 245], [660, 120], [690, 40]], 4); p.stroke([[570, 250], [690, 180], [698, 90]], 4);
  p.dot(560, 262, 7);
};
export const Cricket: React.FC<{ p: V3; cam: V3; kick?: number; s?: number; tint?: string; dir?: 1 | -1; roll?: number }> = ({ p, cam, kick = 0, s = 1, tint, dir, roll }) => (
  <FlatThing id={`cricket|${q(kick, 4)}`} cw={700} ch={500} sole={430} mpu={0.00014 * s} draw={(pen) => drawCricket(pen, q(kick, 4))} p={p} cam={cam} tint={tint} res={1} noBlob dir={dir} roll={roll} />
);

/** a blind white fish, side view, 700 x 300, body centre y = 150; wig -1..1 bends the tail */
const drawFish = (p: Pen, wig: number) => {
  const c = "#f2eef2", d = "#ddd2dc";
  p.poly([[60, 150], [180, 80], [420, 70], [560, 110], [600, 150], [560, 190], [420, 225], [180, 215]], c, 9);
  p.poly([[560, 150], [680, 70 + 40 * wig], [660, 150], [680, 230 + 40 * wig]], d, 9);
  p.poly([[300, 76], [360, 30], [420, 72]], d, 7);
  p.stroke([[150, 110], [140, 190]], 5, "#c8b8c4");
  p.arc(90, 160, 30, 14, 20, 120, 5);
};
export const Fish: React.FC<{ p: V3; cam: V3; wig?: number; s?: number; tint?: string; dir?: 1 | -1; roll?: number }> = ({ p, cam, wig = 0, s = 1, tint, dir, roll }) => (
  <FlatThing id={`fish|${q(wig, 3)}`} cw={700} ch={300} sole={150} mpu={0.00028 * s} draw={(pen) => drawFish(pen, q(wig, 3))} p={p} cam={cam} tint={tint} res={0.9} noBlob dir={dir} roll={roll} />
);

/** Steve the olm, side view, 900 x 300, belly at y = 250; wig bends the body, smile 0..1 */
const drawOlm = (p: Pen, wig: number, smile: number) => {
  const c = "#f6bcc8", d = "#e898aa";
  const sp = (x: number) => 180 + 22 * wig * Math.sin(x / 120);
  const top: P2[] = [], bot: P2[] = [];
  for (let x = 60; x <= 760; x += 35) { const w = x < 160 ? 20 + (x - 60) * 0.3 : x > 640 ? 50 - (x - 640) * 0.12 : 50; top.push([x, sp(x) - w]); bot.unshift([x, sp(x) + w * 0.9]); }
  for (const [x, far] of [[260, true], [300, false], [560, true], [600, false]] as [number, boolean][]) {
    p.stroke([[x, sp(x) + 30], [x + 14, 262], [x + 30, 268]], 18, INK); p.stroke([[x, sp(x) + 30], [x + 14, 262], [x + 30, 268]], 10, far ? d : c);
  }
  p.poly([...top, [800, sp(760) - 30], [835, sp(780)], [800, sp(760) + 34], ...bot], c, 9);
  for (const k of [-1, 0, 1]) { const b: P2 = [730, sp(730) - 10 + k * 22]; p.stroke([b, [700, b[1] - 30 + k * 18], [690, b[1] - 46 + k * 26]], 14, INK); p.stroke([b, [700, b[1] - 30 + k * 18], [690, b[1] - 46 + k * 26]], 8, "#ff7a9a"); }
  p.arc(815, sp(790) + 12, 18, 8 * (0.4 + smile), 10, 150, 5);
  p.dot(790, sp(780) - 12, 3.5, "#c8889a");
};
export const Olm: React.FC<{ p: V3; cam: V3; wig?: number; smile?: number; s?: number; tint?: string; dir?: 1 | -1; roll?: number }> = ({ p, cam, wig = 0, smile = 0.5, s = 1, tint, dir, roll }) => (
  <FlatThing id={`olm|${q(wig, 3)}|${q(smile, 2)}`} cw={900} ch={300} sole={268} mpu={0.0003 * s} draw={(pen) => drawOlm(pen, q(wig, 3), q(smile, 2))} p={p} cam={cam} tint={tint} res={1} dir={dir} roll={roll} />
);

/** a swarm of bats streaming out along a path (deterministic), `k` 0..1 = how far the wave has travelled */
export const BatSwarm: React.FC<{ t: number; t0: number; from: V3; to: V3; cam: V3; n?: number; tint?: string; spread?: number; s?: number; loop?: boolean }> = ({ t, t0, from, to, cam, n = 40, tint, spread = 1.2, s = 2, loop = false }) => (
  <>
    {Array.from({ length: n }, (_, i) => {
      const h = (k: number) => { const x = Math.sin(i * 91.7 + k * 13.1) * 43758.5; return x - Math.floor(x); };
      const u0 = (t - t0 - h(1) * 1.4) * (0.45 + 0.3 * h(2));
      const u = loop && u0 > 0 ? u0 % 1 : u0;
      if (u < 0 || u > 1) return null;
      const p: V3 = [from[0] + (to[0] - from[0]) * u + (h(3) - 0.5) * spread * 2 + 0.3 * Math.sin(t * 3 + i), from[1] + (to[1] - from[1]) * u + (h(4) - 0.5) * spread + 0.15 * Math.sin(t * 5 + i), from[2] + (to[2] - from[2]) * u + (h(5) - 0.5) * spread * 2];
      return <Bat key={i} p={p} cam={cam} flap={Math.sin(t * 13 + i * 1.3)} s={s * (0.8 + 0.5 * h(6))} tint={tint} dir={h(7) > 0.5 ? 1 : -1} />;
    })}
  </>
);
