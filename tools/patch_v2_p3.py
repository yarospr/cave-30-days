# User notes, round 3 (full film): S07–S09 fixes and acting. Run from medieval/.
p = "src/med/seq/p3.tsx"
s = open(p, encoding="utf8").read()

def rep(a, b):
    global s
    assert s.count(a) == 1, a[:90]
    s = s.replace(a, b)

# the REC label sat under the DAY pill: move it to the bottom-left corner
rep('''<div style={{ position: "absolute", left: 120, top: 100, display: "flex"''', '''<div style={{ position: "absolute", left: 120, bottom: 96, display: "flex"''')

# s07e (3:45): he walked through a table. Now down the aisle, toward the lens; the barrel rolls to Maud's foot
rep('''      const w = walk(t, t0, drop, [-4.2, 0, 2.6], [-1.0, 0, 0.6]);
      const cam = move([[0.8, 1.7, 4.2], [-2.0, 1.0, 1.0], 40], null, 0);
      const roll = ramp(t, drop, drop + 2.2);
      const bx = -1.0 + 2.6 * roll;
      return { mood: "day", cam, focus: [-1.6, 1, 1], blur: 1.0, node: <><Alehouse t={t} /><Who id="you" t={t} p={add(w.p, tremble(t, 0.01))} cam={cam.pos} mood="day" f={t < drop ? { expr: "pained", prop: "barrel", mode: "stroll", phase: w.phase, tilt: 6 * Math.sin(t * 3) } : { expr: "shock", armL: [90, 20], armR: [90, 20] }} />{t >= drop ? <group position={[bx, 0.32, 0.9]} rotation={[0, 0, -roll * 9]}><Barrel p={[0, 0, 0]} lie /></group> : null}<Who id="maud" t={t} p={[1.6, 0, -0.3]} cam={cam.pos} mood="day" seed={6} f={{ prop: "hips", expr: t > drop ? "pained" : "stern", facing: -1, headTilt: t > drop ? Math.sin(t * 6) * 8 : 0 }} /></> };''',
'''      const w = walk(t, t0, drop, [-4.4, 0, -0.2], [-1.3, 0, -0.2]);
      const cam = move([[2.7, 1.55, 1.1], [-1.9, 1.0, -0.3], 40], null, 0);
      const roll = ramp(t, drop, drop + 1.8);
      const bx = -1.0 + 1.85 * roll;
      const stop = t > drop + 1.8;
      const h = hop(t, drop + 1.75, 0.08, 0.3);
      return { mood: "day", cam, focus: [-1.2, 1, -0.2], blur: 1.0, node: <><Alehouse t={t} /><Who id="you" t={t} p={add(w.p, tremble(t, 0.01))} cam={cam.pos} mood="day" f={t < drop ? { expr: "pained", prop: "barrel", mode: "stroll", phase: w.phase, tilt: 6 * Math.sin(t * 3) } : { expr: "shock", armL: [90, 20], armR: [90, 20] }} />{t >= drop ? <group position={[bx, 0.32, -0.25]} rotation={[0, 0, -roll * 7]}><Barrel p={[0, 0, 0]} lie /></group> : null}<Who id="maud" t={t} p={[1.35, h.dy, -0.55]} sy={h.sy} cam={cam.pos} mood="day" seed={6} f={{ prop: stop ? "point" : "hips", expr: t > drop ? (stop ? "stern" : "shock") : "stern", facing: -1 }} /></> };''')

# s08b (4:18): people popped into the yard. Now they hurry in from beyond both frame edges
rep('''      const fill = ramp(t, W("S08", 0, "the whole village") - 0.5, L8(0).end + 0.6);
      return { mood: "day", cam, sky: true, focus: [19, 1.4, -14], blur: 0.6, node: <><Manor8 t={t} />{YARD.slice(0, Math.floor(10 + 34 * fill)).map(({ p, i }) => <Who key={i} id={villagerOutfit(i + 100)} t={t} p={[p[0] - 3 * (1 - fill) * ((i % 3) / 3), 0, p[2]]} cam={cam.pos} mood="day" seed={i % 26} res={0.6} life={0} f={{ back: true, mode: fill < 1 ? "stroll" : "stand", phase: t + i * 0.3 }} />)}''',
'''      const t0 = W("S08", 0, "the whole village") - 0.6;
      return { mood: "day", cam, sky: true, focus: [19, 1.4, -14], blur: 0.6, node: <><Manor8 t={t} />{YARD.map(({ p, i }) => {
        const src: V3 = [13.6 - (i % 3) * 0.5, 0, i % 2 ? -5.4 - (i % 4) * 0.3 : -18.8 + (i % 4) * 0.3];
        const dist = Math.hypot(p[0] - src[0], p[2] - src[2]);
        const u = Math.min(1, (i < 12 ? 1 : 0.85 * (1 - (i - 12) / 32)) + Math.max(0, t - t0) * 2.3 / dist);
        const q: V3 = [src[0] + (p[0] - src[0]) * u, 0, src[2] + (p[2] - src[2]) * u];
        return <Who key={i} id={villagerOutfit(i + 100)} t={t} p={q} cam={cam.pos} mood="day" seed={i % 26} res={0.6} life={0} f={{ back: true, mode: u < 1 ? "march" : "stand", phase: t * 1.8 + i * 0.37 }} />;
      })}''')

# s08f (4:35): the coin insert was too close and empty. Twelve coins counted onto the board, the cup lands; then his gulp
rep('''      const cam = move([[0.25, 1.48, -5.35], [0.2, 1.22, -5.92], 34], null, 0);
      const n = Math.min(12, Math.floor((t - L8(4).start) * 6) + 1);
      const cupIn = t > W("S08", 4, "a silver cup");
      return { mood: "cold", cam, focus: [0.3, 1.2, -5.95], blur: 1.6, node: <><Hall t={t} />{Array.from({ length: n }, (_, i) => <Coin key={i} p={[-0.25 + (i % 6) * 0.06, 1.2 + Math.floor(i / 6) * 0.005, -5.9 + Math.floor(i / 6) * 0.06]} />)}{cupIn ? <Cup p={[0.6, 1.2, -5.95]} s={1.4} /> : null}</>, over: <Tag a={ramp(t, L8(4).start + 0.4, L8(4).start + 0.9)} big={cupIn ? "SILVER CUP  >  12 PENCE" : "12 PENCE"} small="enough to hang a thief" /> };''',
'''      const t0 = L8(4).start, cupT = W("S08", 4, "a silver cup"), gulp = W("S08", 4, "a lot more") + 0.2;
      const cupIn = t > cupT;
      if (t < gulp) {
        const cam = move([[0.16, 1.68, -5.0], [0.12, 1.21, -5.93], 34], [[0.17, 1.6, -5.18], [0.12, 1.21, -5.93], 32], ramp(t, t0, gulp));
        const drop = 1 - ramp(t, cupT, cupT + 0.22);
        return { mood: "cold", cam, focus: [0.12, 1.2, -5.93], blur: 1.4, exposure: cupIn && drop > 0 ? 0 : 0, node: <><Hall t={t} />{Array.from({ length: 12 }, (_, i) => { const ti = t0 + 0.3 + i * 0.28; if (t < ti) return null; return <Coin key={i} p={[-0.13 + (i % 6) * 0.052, 1.2 + 0.06 * (1 - ramp(t, ti, ti + 0.12)), -5.96 + Math.floor(i / 6) * 0.058]} />; })}{cupIn ? <Cup p={[0.33, 1.2 + 0.3 * drop, -5.93]} s={1.5} /> : null}</>, over: <Tag a={ramp(t, t0 + 0.4, t0 + 0.9)} big={cupIn ? "SILVER CUP  >  12 PENCE" : "12 PENCE"} small="enough to hang a thief" /> };
      }
      const cam = move([[15.95, 1.62, -11.85], [16.4, 1.5, -13.2], 32], null, 0);
      const gl = keys(t, [[gulp, 0], [gulp + 0.4, 1], [gulp + 0.9, 0]]);
      return { mood: "day", cam, sky: true, focus: [16.4, 1.5, -13.2], blur: 1.8, node: <><Manor8 t={t} /><Yard t={t} cam={cam.pos} turn={1} /><Who id="you" t={t} p={HERO8} cam={cam.pos} mood="day" res={1.6} dy={-0.02 * gl} f={{ expr: "nervous", headTilt: 6 + 6 * gl, look: -0.3, armL: [40, 100], frontL: true }} /></> };''')

# s09a: the guards walk him in to the middle of the hall; the steward raps the table
rep('''      const cam = move([[3.6, 3.4, 6.2], [-0.8, 1.2, -3.5], 44], [[3.0, 3.0, 5.0], [-0.8, 1.2, -3.5], 44], k);
      return { mood: "cold", cam, focus: [0, 1.2, -3], blur: 0.6, node: <><Hall t={t} /><Court t={t} cam={cam.pos} /><Who id="steward" t={t} p={STEW} cam={cam.pos} mood="cold" seed={12} f={{ mode: "sit", expr: "stern" }} /><Who id="you" t={t} p={HERO9} cam={cam.pos} mood="cold" f={{ back: true, prop: "tied" }} />{guards(t, cam.pos, HERO9, 0, "cold")}</> };''',
'''      const cam = move([[3.6, 3.4, 6.2], [-0.8, 1.2, -3.5], 44], [[3.0, 3.0, 5.0], [-0.8, 1.2, -3.5], 44], k);
      const w = walk(t, L9(0).start - 0.4, L9(0).start + 2.8, [0.4, 0, 1.3], HERO9);
      const rap = W("S09", 0, "so his steward");
      const sl = keys(t, [[rap - 0.2, 0], [rap, 1], [rap + 0.2, 0.3], [rap + 0.4, 1], [rap + 0.6, 0]], 0.15);
      const gw = (dx: number, id: string, seed: number) => <Who id={id} t={t} p={add(w.p, [dx, 0, 0.15])} cam={cam.pos} mood="cold" seed={seed} f={{ prop: "spear", back: true, mode: w.moving ? "stroll" : "stand", phase: w.phase + (dx > 0 ? 0.5 : 0), expr: "stern" }} />;
      return { mood: "cold", cam, focus: [0, 1.2, -3], blur: 0.6, node: <><Hall t={t} /><Court t={t} cam={cam.pos} /><Who id="steward" t={t} p={STEW} cam={cam.pos} mood="cold" seed={12} f={{ mode: "sit", expr: "stern", armR: [90 + 50 * sl, 30], frontR: true }} /><Who id="you" t={t} p={w.p} cam={cam.pos} mood="cold" f={{ back: true, prop: "tied", mode: w.moving ? "stroll" : "stand", phase: w.phase }} />{gw(-0.75, "guard", 50)}{gw(0.75, "guard2", 51)}</> };''')

# s09b: the steward reads the charter; at "no king's judge" — the hero between the guards, swallowing
rep('''      const cam = move([[0.6, 1.9, -4.2], [0, 1.85, -6.9], 32], null, 0);
      return { mood: "cold", cam, focus: [0, 1.8, -6.9], blur: 1.8, node: <><Hall t={t} /><Who id="steward" t={t} p={STEW} cam={cam.pos} mood="cold" seed={12} res={1.4} f={{ mode: "sit", expr: "stern", prop: "book", armR: [60, 90], frontR: true, look: 0.3, headTilt: 8 }} /></>, over: <Tag a={ramp(t, W("S09", 1, "called") + 0.3, W("S09", 1, "called") + 0.9)} big="INFANGTHIEF" small="the right to hang a thief caught on your land" /> };''',
'''      const nk = W("S09", 1, "no kings judge");
      const tag = <Tag a={ramp(t, W("S09", 1, "called") + 0.3, W("S09", 1, "called") + 0.9)} big="INFANGTHIEF" small="the right to hang a thief caught on your land" />;
      if (t < nk - 0.15) {
        const cam = move([[0.6, 1.9, -4.2], [0, 1.85, -6.9], 32], [[0.5, 1.88, -4.6], [0, 1.85, -6.9], 30], ramp(t, L9(1).start, nk));
        const up = ramp(t, L9(1).start, L9(1).start + 0.8);
        return { mood: "cold", cam, focus: [0, 1.8, -6.9], blur: 1.8, node: <><Hall t={t} /><Who id="steward" t={t} p={STEW} cam={cam.pos} mood="cold" seed={12} res={1.4} f={{ mode: "sit", expr: "stern", prop: "book", armR: [40 + 40 * up, 90], frontR: true, look: 0.4 * Math.sin((t - L9(1).start) * 1.7), headTilt: 8 + 4 * Math.sin(t * 2.1) }} /></>, over: tag };
      }
      const cam = move([[-1.4, 1.55, -0.55], [0.4, 1.4, -1.6], 32], null, 0);
      const gl = keys(t, [[nk, 0], [nk + 0.4, 1], [nk + 0.9, 0]]);
      return { mood: "cold", cam, focus: [0.4, 1.4, -1.6], blur: 1.6, node: <><Hall t={t} /><Court t={t} cam={cam.pos} cold /><Who id="you" t={t} p={HERO9} cam={cam.pos} mood="cold" res={1.4} dy={-0.02 * gl} f={{ expr: "nervous", prop: "tied", headTilt: 4 + 8 * gl, look: 0.3 }} />{guards(t, cam.pos, HERO9, 0, "cold")}</>, over: tag };''')

# s09f: he looks around for a friendly face; then the jury, whispering, close
rep('''      const cam = move([[0.4, 4.5, 2.0], [0.4, 0.8, -1.6], 40], [[0.4, 3.6, 0.6], [0.4, 0.9, -1.6], 38], k);
      return { mood: "cold", cam, focus: HERO9, blur: 1.0, node: <><Hall t={t} /><Court t={t} cam={cam.pos} whisper cold /><Who id="you" t={t} p={HERO9} cam={cam.pos} mood="cold" f={{ expr: "nervous", prop: "tied", headTilt: 10 }} />{guards(t, cam.pos, HERO9, 0, "cold")}<Who id="steward" t={t} p={STEW} cam={cam.pos} mood="cold" seed={12} f={{ mode: "sit", expr: "stern" }} /></> };''',
'''      const tt = W("S09", 5, "to them");
      if (t < tt - 0.15) {
        const cam = move([[0.4, 4.5, 2.0], [0.4, 0.8, -1.6], 40], [[0.4, 3.6, 0.6], [0.4, 0.9, -1.6], 38], ramp(t, L9(5).start, tt));
        const fc = step(t, [[L9(5).start, -1], [L9(5).start + 1.2, 1], [L9(5).start + 2.3, 0], [L9(5).start + 3.1, -1]]) as -1 | 0 | 1;
        return { mood: "cold", cam, focus: HERO9, blur: 1.0, node: <><Hall t={t} /><Court t={t} cam={cam.pos} whisper cold /><Who id="you" t={t} p={HERO9} cam={cam.pos} mood="cold" f={{ expr: "nervous", prop: "tied", headTilt: 6, facing: fc }} />{guards(t, cam.pos, HERO9, 0, "cold")}<Who id="steward" t={t} p={STEW} cam={cam.pos} mood="cold" seed={12} f={{ mode: "sit", expr: "stern" }} /></> };
      }
      const cam = move([[-3.3, 1.3, -1.0], [-5.0, 0.95, -2.7], 34], [[-3.45, 1.28, -1.25], [-5.0, 0.95, -2.7], 32], ramp(t, tt, L9(5).end + 0.4));
      return { mood: "cold", cam, focus: [-4.8, 1.0, -2.6], blur: 1.4, node: <><Hall t={t} /><Court t={t} cam={cam.pos} whisper cold /></> };''')

open(p, "w", encoding="utf8").write(s)
print("p3 ok")
