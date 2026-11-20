// Acting helpers: everything a pure function of time. Keyframes (eased), steps, deterministic noise, idle life,
// panicked look-around, trembling, walking along a path.
import type { V3 } from "../inkbeat/types";

export const n1 = (t: number, seed = 0) => {
  // smooth 1D value noise in -1..1
  const x = t + seed * 17.13, i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
  const h = (k: number) => { const s = Math.sin((k + seed * 3.7) * 127.1) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };
  return h(i) * (1 - u) + h(i + 1) * u;
};
const ease = (x: number) => { const k = Math.max(0, Math.min(1, x)); return k * k * (3 - 2 * k); };
type Num = number | number[];
const lerp = (a: Num, b: Num, k: number): Num => (Array.isArray(a) ? a.map((x, i) => x + ((b as number[])[i] - x) * k) : a + ((b as number) - a) * k);
/** eased keyframes [[time, value], ...]; each segment eases over `blend` s (or the whole gap if shorter) ending at the key */
export function keys<T extends Num>(t: number, ks: [number, T][], blend = 0.35): T {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t < ks[i][0]) {
      const [t0, a] = ks[i - 1], [t1, b] = ks[i];
      const d = Math.min(blend, t1 - t0);
      return lerp(a, b, ease((t - (t1 - d)) / d)) as T;
    }
  }
  return ks[ks.length - 1][1];
}
/** step keys: the value of the last key at or before t */
export function step<T>(t: number, ks: [number, T][]): T {
  let v = ks[0][1];
  for (const [k, x] of ks) if (t >= k) v = x;
  return v;
}
/** idle life: a slow sway, a head bob, breathing */
export const idle = (t: number, seed = 0, amt = 1) => ({
  tilt: 2.2 * amt * n1(t * 0.35, seed),
  headTilt: 3.5 * amt * n1(t * 0.5, seed + 1),
  sy: 1 + 0.012 * amt * Math.sin(t * 2.1 + seed),
});
/** panicked look-around: snappy head turns left / right / front every ~0.6–0.9 s */
export const lookAround = (t: number, seed = 0, rate = 1.4) => {
  const k = Math.floor(t * rate + seed), ph = (t * rate + seed) % 1;
  const dirs: (-1 | 0 | 1)[] = [1, -1, 0, -1, 1, 0, 1, -1];
  const f = dirs[(k + seed) % dirs.length];
  return { facing: f, look: f * 0.9, headTilt: f * 6 + 4 * Math.sin(ph * Math.PI) };
};
/** small fast trembling offset (m) */
export const tremble = (t: number, amt = 0.006, seed = 0): V3 => [amt * n1(t * 9, seed), amt * 0.5 * n1(t * 11, seed + 3), 0];
/** walk from a to b between t0 and t1: position + gait phase (2 steps per second) */
export const walk = (t: number, t0: number, t1: number, a: V3, b: V3) => {
  const k = Math.max(0, Math.min(1, (t - t0) / (t1 - t0)));
  const kk = k < 0.08 ? (k * k) / 0.16 : k > 0.92 ? 1 - ((1 - k) * (1 - k)) / 0.16 : k;
  const p: V3 = [a[0] + (b[0] - a[0]) * kk, a[1] + (b[1] - a[1]) * kk, a[2] + (b[2] - a[2]) * kk];
  const moving = t > t0 && t < t1;
  return { p, phase: moving ? (t - t0) * 1.0 : 0, moving };
};
/** a quick hop / startle: lift (m) and squash over `d` seconds starting at t0 */
export const hop = (t: number, t0: number, h = 0.25, d = 0.45) => {
  const k = (t - t0) / d;
  if (k <= 0 || k >= 1) return { dy: 0, sy: 1 };
  return { dy: h * Math.sin(Math.PI * k), sy: k < 0.15 ? 1 - 0.12 * (k / 0.15) : 1 + 0.08 * Math.sin(Math.PI * k) };
};
