// Every time in the film comes from the voice timeline (audio/timeline.json, copied here): shots and beats are
// anchored to words, never typed. W(scene, line, phrase) = when that phrase starts; WE = when it ends.
import TL from "./timeline.json";

export const FPS = 30;
export const DURATION: number = TL.duration;
export const FILM_FRAMES = Math.ceil(DURATION * FPS);

type Word = [string, number, number];
export type Line = { scene: string; i: number; sp: string; en: string; start: number; end: number; words: Word[] };
export const LINES = TL.lines as unknown as Line[];
export const SCENES = TL.scenes as { id: string; start: number; end: number }[];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' ]/g, " ").replace(/'/g, "").split(/\s+/).filter(Boolean);

export const line = (scene: string, i: number): Line => {
  const l = LINES.find((x) => x.scene === scene && x.i === i);
  if (!l) throw new Error(`no line ${scene}/${i}`);
  return l;
};
export const scene = (id: string) => {
  const s = SCENES.find((x) => x.id === id);
  if (!s) throw new Error(`no scene ${id}`);
  return s;
};

/** [start, end] of a phrase inside a line (first word of the phrase that the ASR heard; falls back to the line) */
const find = (sc: string, i: number, phrase?: string, occ = 0): [number, number] => {
  const l = line(sc, i);
  if (!phrase) return [l.start, l.end];
  const want = norm(phrase);
  const ws = l.words.map((w) => w[0]);
  let seen = 0;
  for (let k = 0; k < ws.length; k++) {
    let n = 0;
    while (n < want.length && k + n < ws.length && ws[k + n] === want[n]) n++;
    if (n === want.length || (n >= 2 && n >= want.length - 1)) {
      if (seen++ === occ) return [l.words[k][1], l.words[Math.min(ws.length - 1, k + want.length - 1)][2]];
    }
  }
  // the first word alone
  for (let k = 0; k < ws.length; k++) if (ws[k] === want[0]) return [l.words[k][1], l.words[k][2]];
  throw new Error(`phrase "${phrase}" not in ${sc}/${i}: ${l.en}`);
};
export const W = (sc: string, i: number, phrase?: string, occ = 0) => find(sc, i, phrase, occ)[0];
export const WE = (sc: string, i: number, phrase?: string, occ = 0) => find(sc, i, phrase, occ)[1];

/** mouth openness 0..1 for a speaker at time t: open on each word, syllable-like pulses, closed between words */
export const talk = (sp: string, t: number): number => {
  for (const l of LINES) {
    if (l.sp !== sp || t < l.start - 0.05 || t > l.end + 0.05) continue;
    for (const [, a, b] of l.words) {
      if (t < a || t > b) continue;
      const syl = Math.max(1, Math.round((b - a) / 0.17));
      const ph = ((t - a) / (b - a)) * syl;
      return 0.3 + 0.7 * Math.abs(Math.sin(Math.PI * ph));
    }
    return 0;
  }
  return 0;
};

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const ease = (x: number) => { const k = clamp01(x); return k * k * (3 - 2 * k); };
/** 0..1 ramp between two times */
export const ramp = (t: number, a: number, b: number) => ease((t - a) / Math.max(1e-3, b - a));
