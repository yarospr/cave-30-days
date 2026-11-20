# User notes, round 3 (full film): S04 / S06 fixes and acting. Run from medieval/.
p = "src/med/seq/p2.tsx"
s = open(p, encoding="utf8").read()

def rep(a, b):
    global s
    assert s.count(a) == 1, a[:90]
    s = s.replace(a, b)

# the ring never stands right in front of the lens (2:06: a face filled the frame)
rep('''      let p = ringPos(v, close);''', '''      let p = ringPos(v, close);
      if (Math.hypot(p[0] - cam[0], p[2] - cam[2]) < 2.2) return null;''')

# s04b: "mud up to your ankles" — the whole figure, ankle-deep in a real puddle, pulling his feet out
rep('''      const p: V3 = [ST[0] + 0.2, -0.06, ST[2] + 5];
      const cam = move([[p[0] + 0.5, 0.35, p[2] + 1.4], [p[0], 0.2, p[2]], 34], null, 0);
      const step2 = Math.floor((t - W("S04", 0, "mud up")) * 1.6) % 2;
      return { mood: "dusk", cam, sky: true, focus: [p[0], 0.2, p[2]], blur: 2.2, node: <><Street t={t} /><Who id="you" t={t} p={p} cam={cam.pos} mood="dusk" f={{ mode: "stroll", phase: step2 * 0.25 }} /></> };''',
'''      const p: V3 = [ST[0] + 0.2, 0, ST[2] + 5];
      const t0 = W("S04", 0, "mud up");
      const pull = Math.max(0, Math.sin((t - t0) * 4.2));
      const cam = move([[p[0] + 1.25, 1.05, p[2] + 2.7], [p[0], 0.75, p[2]], 34], null, 0);
      return { mood: "dusk", cam, sky: true, focus: [p[0], 0.8, p[2]], blur: 1.6, node: <><Street t={t} /><Mud p={p} t={t} /><Who id="you" t={t} p={[p[0], -0.09 + 0.05 * pull, p[2]]} sy={1 - 0.03 * pull} cam={cam.pos} mood="dusk" f={{ mode: "stroll", phase: (t - t0) * 0.67, expr: "pained", tilt: 7 * Math.sin((t - t0) * 4.2), armL: [55, 25], armR: [55, 25] }} /></> };''')

# s04e: the villager jabbers in Old English; a speech bubble where one word in five is readable, then "we'll translate"
rep('''      const shrug = t > W("S04", 2, "technically") && t < W("S04", 2, "for the rest");
      return { mood: "dusk", cam, sky: true, focus: [ST[0], 1.4, ST[2]], blur: 1.6, node: <><Street t={t} /><Who id="you" t={t} p={ST} cam={cam.pos} mood="dusk" f={{ expr: shrug ? "nervous" : "neutral", prop: shrug ? "shrug" : undefined, facing: 0 }} />{VILL(t, cam.pos, "dusk", { expr: "stern", facing: 1 }, [ST[0] - 1.2, 0, ST[2] - 0.2])}<Ring t={t} cam={cam.pos} mood="dusk" gather={0.45} close={0} forks={0} /></> };''',
'''      const shrug = t > W("S04", 2, "technically") && t < W("S04", 2, "for the rest");
      const tr = W("S04", 2, "translate") - 0.1;
      const jab = t < tr + 1.6 ? 0.5 + 0.5 * Math.sin(t * 13) : 0;
      return { mood: "dusk", cam, sky: true, focus: [ST[0], 1.4, ST[2]], blur: 1.6, node: <><Street t={t} /><Who id="you" t={t} p={ST} cam={cam.pos} mood="dusk" f={{ expr: shrug ? "nervous" : "neutral", prop: shrug ? "shrug" : undefined, facing: -1, headTilt: shrug ? -8 : 4 * Math.sin(t * 2) }} /><Who id="villager" t={t} p={[ST[0] - 1.2, 0, ST[2] - 0.2]} cam={cam.pos} mood="dusk" seed={7} f={{ prop: "pitchfork", expr: "stern", facing: 1, talk: jab, armL: [60 + 40 * Math.max(0, Math.sin(t * 3)), 40], frontL: true }} /><Ring t={t} cam={cam.pos} mood="dusk" gather={0.45} close={0} forks={0} /></>,
        over: <OldEnglish a={ramp(t, L4(2).start + 0.1, L4(2).start + 0.4)} lit={ramp(t, W("S04", 2, "one word") - 0.1, W("S04", 2, "one word") + 0.3)} en={ramp(t, tr, tr + 0.35)} /> };''')

# s04k: Aldric bursts in ("Stop!"), then a closer on him for the joke
rep('''      const cam = move([[ST[0] + 2.2, 1.55, ST[2] + 2.6], [ST[0] + 0.3, 1.45, ST[2] - 0.8], 38], null, 0);
      const fool = W("S04", 8, "if he is a fool");
      const lower = ramp(t, fool, fool + 1.2);
      return { mood: "night", cam, sky: true, focus: [ST[0] + 0.6, 1.5, ST[2] - 1.2], blur: 1.2, node: <><Street t={t} /><Who id="aldric" sp="aldric" t={t} p={[ST[0] + 0.7, 0, ST[2] - 1.4]} cam={cam.pos} mood="night" seed={5} f={{ expr: t > fool + 0.8 ? "smile" : "stern", armR: t < fool ? [150, 10] : [30, 40], armL: t < fool ? [90, 10] : [20, 20], facing: -1 }} /><Who id="you" t={t} p={ST} cam={cam.pos} mood="night" f={{ expr: "nervous", facing: 1 }} /><Ring t={t} cam={cam.pos} mood="night" gather={1} close={0.8 - 0.3 * lower} forks={1 - lower * 0.6} part={1} /></> };''',
'''      const fool = W("S04", 8, "if he is a fool");
      const lower = ramp(t, fool, fool + 1.2);
      const h = hop(t, L4(8).start, 0.1, 0.35);
      const inn = ramp(t, L4(8).start - 0.1, L4(8).start + 0.45);
      const AP: V3 = [ST[0] + 0.7 + 0.2 * (1 - inn), h.dy, ST[2] - 1.4 - 0.9 * (1 - inn)];
      const wide = t < fool;
      const cam = wide ? move([[ST[0] + 2.2, 1.55, ST[2] + 2.6], [ST[0] + 0.3, 1.45, ST[2] - 0.8], 38], null, 0) : move([[ST[0] + 1.9, 1.6, ST[2] + 0.7], [ST[0] + 0.6, 1.55, ST[2] - 1.4], 32], null, 0);
      return { mood: "night", cam, sky: true, focus: [ST[0] + 0.6, 1.5, ST[2] - 1.2], blur: wide ? 1.2 : 1.8, node: <><Street t={t} /><Who id="aldric" sp="aldric" t={t} p={AP} sy={h.sy} cam={cam.pos} mood="night" seed={5} f={{ expr: t > fool + 0.8 ? "smile" : "stern", armR: wide ? [150, 10] : [60 + 20 * Math.sin(t * 3), 50], armL: wide ? [90, 10] : [20, 20], facing: -1, headTilt: wide ? 0 : -6 }} /><Who id="you" t={t} p={ST} cam={cam.pos} mood="night" f={{ expr: wide ? "nervous" : "relief", facing: 1 }} /><Ring t={t} cam={cam.pos} mood="night" gather={1} close={0.8 - 0.3 * lower} forks={1 - lower * 0.6} part={1} /></> };''')

# s06b: the insert, then across the table: he knocks the brick-hard bread on the board; Maud slides the ale in
rep('''      const cam = move([[1.25, 1.12, -0.95], [1.25, 0.8, -1.45], 34], null, 0);
      return { mood: "day", cam, focus: [1.25, 0.82, -1.4], blur: 1.6, node: <><Alehouse t={t} /><Bowl p={bowlAt} /><Bread p={[1.0, 0.83 + by, -1.42]} />{ale ? <Mug p={[1.48, 0.8, -1.38]} /> : null}<Hand at={[0.95, 0.85 + by, -1.3]} yaw={2.6} /></> };''',
'''      if (t < knock - 0.25) {
        const cam = move([[1.25, 1.12, -0.95], [1.25, 0.8, -1.45], 34], [[1.25, 1.08, -1.02], [1.25, 0.8, -1.45], 32], ramp(t, W("S06", 0, "stew"), knock));
        return { mood: "day", cam, focus: [1.25, 0.82, -1.4], blur: 1.6, node: <><Alehouse t={t} /><Bowl p={bowlAt} /><Bread p={[1.0, 0.83, -1.42]} /><Hand at={[0.95, 0.85, -1.3]} yaw={2.6} /></> };
      }
      const mug = ramp(t, W("S06", 0, "and ale") - 0.3, W("S06", 0, "and ale") + 0.2);
      const cam = move([[1.75, 1.4, -2.9], [1.2, 1.0, -0.9], 36], null, 0);
      const k2 = t > knock && t < knock + 0.8 ? Math.max(0, Math.sin((t - knock) * 12)) : 0;
      return { mood: "day", cam, focus: [1.2, 1.1, -0.9], blur: 1.4, node: <><Alehouse t={t} /><Bowl p={bowlAt} /><Bread p={[0.95, 0.83 + by, -1.42]} />{ale ? <Mug p={[2.2 - 0.7 * mug, 0.8, -1.38]} /> : null}<Who id="you" t={t} p={SEAT6} cam={cam.pos} mood="day" res={1.4} f={{ mode: "sit", expr: t > knock + 0.4 ? "pained" : "neutral", armR: [60 + 50 * k2, 70], frontR: true, armL: [34, 88], frontL: true, facing: 1 }} />{ale ? <Who id="maud" t={t} p={[2.6, 0, -1.0]} cam={cam.pos} mood="day" seed={6} f={{ expr: "grin", armR: [70, 40], frontR: true, facing: -1 }} /> : null}</> };''')

# s06e: Maud pours her way across the room; then the child with a mug bigger than his head
rep('''      const cam = move([[-3.2, 2.1, 3.6], [0, 1.1, -1], 42], [[-2.8, 2.0, 3.1], [0, 1.1, -1], 42], k);
      return { mood: "day", cam, focus: [0, 1, 0], blur: 0.8, node: <><Alehouse t={t} />{Patrons(t, cam.pos, true)}<Who id="maud" t={t} p={[3.6, 0, -1.3]} cam={cam.pos} mood="day" seed={6} f={{ prop: "cup", armR: [70, 60], frontR: true, expr: "smile", facing: -1 }} /></> };''',
'''      const ch = W("S06", 3, "even children");
      if (t < ch - 0.2) {
        const cam = move([[-3.2, 2.1, 3.6], [0, 1.1, -1], 42], [[-2.8, 2.0, 3.1], [0, 1.1, -1], 42], k);
        const wm = walk(t, L6(3).start, ch, [3.4, 0, -0.2], [0.4, 0, -0.2]);
        return { mood: "day", cam, focus: [0, 1, 0], blur: 0.8, node: <><Alehouse t={t} />{Patrons(t, cam.pos, true)}<Who id="maud" t={t} p={wm.p} cam={cam.pos} mood="day" seed={6} f={{ prop: "cup", armR: [70, 60], frontR: true, expr: "smile", facing: -1, mode: wm.moving ? "stroll" : "stand", phase: wm.phase }} /></> };
      }
      // the child: a gulp, a wipe, a grin; Maud behind him topping up a patron
      const sip = (t - ch) % 1.6 < 0.9;
      const cam = move([[0.45, 1.05, 2.15], [-0.6, 0.85, 0.6], 34], [[0.3, 1.0, 1.85], [-0.6, 0.85, 0.6], 32], ramp(t, ch, L6(3).end));
      return { mood: "day", cam, focus: [-0.6, 0.85, 0.6], blur: 1.6, node: <><Alehouse t={t} />{Patrons(t, cam.pos)}<Who id={{ ...villagerOutfit(71), build: "kid" }} t={t} p={[-0.6, 0, 0.6]} cam={cam.pos} mood="day" seed={12} res={1.3} f={{ prop: "cup", armR: sip ? [115, 125] : [50, 80], frontR: true, expr: sip ? "smile_closed" : "grin", headTilt: sip ? -10 : 4, facing: 1 }} /><Who id="maud" t={t} p={[-1.9, 0, -0.3]} cam={cam.pos} mood="day" seed={6} f={{ prop: "cup", armR: [90, 50], frontR: true, expr: "smile", facing: 1 }} /></> };''')

# helpers: the mud puddle and the Old English bubble
rep('''function scene4Start() { return line("S04", 0).start - 0.5; }''',
'''function scene4Start() { return line("S04", 0).start - 0.5; }
/** a wet mud puddle around his feet (the card's feet sink below its surface) */
function Mud({ p, t }: { p: V3; t: number }) {
  return (
    <group position={[p[0], 0, p[2]]}>
      <M g={cylG(0.78, 0.82, 0.05, 28)} c="#5a3e28" tex="sand" p={[0, 0.0, 0]} s={[1.25, 1, 1]} />
      <M g={cylG(0.5, 0.5, 0.012, 24)} c="#7a5a3e" p={[0.35, 0.03, 0.25]} s={[1.3, 1, 0.8]} />
      {[[-0.75, 0.3], [0.9, -0.2], [0.2, 0.75], [-0.4, -0.6]].map(([x, z], i) => <M key={i} g={sphG(0.08 + 0.02 * i, 8)} c="#4a3220" tex="sand" p={[x, 0.02, z]} s={[1.4, 0.5, 1]} />)}
      {[0, 1, 2].map((i) => { const ph = (t * 1.3 + i * 0.33) % 1; return <M key={`b${i}`} g={sphG(0.025, 8)} c="#8a6a4a" p={[-0.2 + i * 0.25, 0.03 + 0.04 * Math.sin(ph * Math.PI), 0.3 - i * 0.2]} s={1 - ph} />; })}
    </group>
  );
}
/** the villager's line as a speech bubble: Old English, one word in five lit; then the translation */
function OldEnglish({ a, lit, en }: { a: number; lit: number; en: number }) {
  const OE = ["Hwæt", "secest", "þu", "her,", "fremde", "mann?", "Ne", "cann", "ic", "þine", "spræce!"];
  const known = new Set([2, 4]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 250, top: 120, maxWidth: 760, opacity: a, transform: `scale(${0.9 + 0.1 * a})`, transformOrigin: "30% 100%", background: "#fff7ea", border: "6px solid #241726", borderRadius: 40, padding: "26px 40px", fontFamily: "Poppins", fontWeight: 800, fontSize: 52, lineHeight: 1.25, color: "#241726" }}>
        {en < 0.5
          ? OE.map((w, i) => <span key={i} style={{ color: known.has(i) && lit > 0.5 ? "#e0642a" : "#241726", opacity: known.has(i) || lit < 0.5 ? 1 : 0.35, marginRight: 16 }}>{w}</span>)
          : <span>What are you looking for here, stranger?</span>}
        <div style={{ position: "absolute", left: 120, bottom: -44, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "44px solid #241726" }} />
      </div>
    </AbsoluteFill>
  );
}''')

open(p, "w", encoding="utf8").write(s)
print("p2 ok")
