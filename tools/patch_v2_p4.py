# User notes, round 3 (full film): S10–S12 fixes and acting. Run from medieval/.
def patch(p, pairs):
    s = open(p, encoding="utf8").read()
    for a, b in pairs:
        assert s.count(a) == 1, (p, a[:90])
        s = s.replace(a, b)
    open(p, "w", encoding="utf8").write(s)

# the translation card can carry the changed ending (rhymes with the opening underline)
patch("src/med/props.tsx", [
    ('''export const NoteCard: React.FC<{ p: V3; r?: V3; s?: number; underline?: number }> = ({ p, r = [-Math.PI / 2, 0, 0], s = 1, underline = 0 }) => {
  const tex = canvasTex(`note|${underline.toFixed(2)}`, 1000, 620, (g, w, h) => {''',
     '''export const NoteCard: React.FC<{ p: V3; r?: V3; s?: number; underline?: number; ending?: boolean }> = ({ p, r = [-Math.PI / 2, 0, 0], s = 1, underline = 0, ending = false }) => {
  const tex = canvasTex(`note|${underline.toFixed(2)}|${ending ? 1 : 0}`, 1000, 620, (g, w, h) => {'''),
    ('''    const L = ["Netherwick Priory chronicle, 1253 (transl.):", "\\"In this year a stranger fell from the sky", "into our village. He spoke in strange tongues", "and carried a stone of light.", "On the seventh day, he was hanged.\\""];
    L.forEach((t, i) => g.fillText(t, 110, 100 + i * 70));
    if (underline > 0) { g.strokeStyle = "#c0302a"; g.lineWidth = 7; g.beginPath(); g.moveTo(110, 404 + 14); g.lineTo(110 + 720 * underline, 404 + 10); g.stroke(); }''',
     '''    const L = ["Netherwick Priory chronicle, 1253 (transl.):", "\\"In this year a stranger fell from the sky", "into our village. He spoke in strange tongues", "and carried a stone of light.", ending ? "On the seventh day, the stranger went home." : "On the seventh day, he was hanged.\\""];
    if (ending) L.push("He left us his stone of light,", "which never spoke again.\\"");
    L.forEach((t, i) => g.fillText(t, 110, 100 + i * 70));
    if (underline > 0) { g.strokeStyle = "#c0302a"; g.lineWidth = 7; g.beginPath(); g.moveTo(110, 404 + 14); g.lineTo(110 + (ending ? 850 : 720) * underline, 404 + 10); g.stroke(); }'''),
])
patch("src/med/sets.tsx", [
    ('''book?: { old?: boolean; line?: number; wet?: number; flip?: number }; note?: number; noteAt?: V3; catalog?: boolean }> = ({ lamp = 1, book = {}, note = 0, noteAt, catalog = false }) => (''',
     '''book?: { old?: boolean; line?: number; wet?: number; flip?: number }; note?: number; noteAt?: V3; catalog?: boolean; noteEnd?: boolean }> = ({ lamp = 1, book = {}, note = 0, noteAt, catalog = false, noteEnd = false }) => ('''),
    ('''underline={note} />''', '''underline={note} ending={noteEnd} />'''),
])

p = "src/med/seq/p4.tsx"
patch(p, [
    # s10g: two framings; he grips the bars, then shows the phone
    ('''      const cam = move([[-0.5, 1.5, 2.6], [0.25, 1.45, 1.15], 32], null, 0);
      const prove = t > W("S10", 5, "and i can prove it");
      return { mood: "night", cam, focus: [0.25, 1.45, 1.15], blur: 1.6, node: <><Cellar t={t} /><Who id="you" sp="you" t={t} p={IN} cam={cam.pos} mood="night" res={1.5} f={{ expr: prove ? "smile" : "stern", prop: prove ? "phoneLit" : "point", armR: prove ? [130, 40] : undefined, frontR: true, facing: 1 }} /><Who id="aldric" t={t} p={OUT} cam={cam.pos} mood="lamp" seed={5} f={{ back: true, prop: "candle" }} /></> };''',
     '''      const prove = t > W("S10", 5, "and i can prove it");
      const dice = W("S10", 5, "lost it at dice");
      if (t < dice - 0.35) {
        const cam = move([[-0.5, 1.5, 2.6], [0.25, 1.45, 1.15], 32], [[-0.4, 1.5, 2.45], [0.25, 1.45, 1.15], 30], ramp(t, L10(5).start, dice));
        const grip = ramp(t, L10(5).start, L10(5).start + 0.5);
        return { mood: "night", cam, focus: [0.25, 1.45, 1.15], blur: 1.6, node: <><Cellar t={t} /><Who id="you" sp="you" t={t} p={add(IN, [0, 0, 0.12 * grip])} cam={cam.pos} mood="night" res={1.5} f={{ expr: "stern", armL: [120 * grip, 60], armR: [120 * grip, 60], frontL: true, frontR: true, facing: 1, headTilt: -4 }} /><Who id="aldric" t={t} p={OUT} cam={cam.pos} mood="lamp" seed={5} f={{ back: true, prop: "candle" }} /></> };
      }
      const cam = move([[1.05, 1.5, 0.3], [0.3, 1.45, 1.4], 34], null, 0);
      const up = ramp(t, W("S10", 5, "and i can prove it") - 0.2, W("S10", 5, "and i can prove it") + 0.4);
      return { mood: "night", cam, focus: [0.3, 1.45, 1.4], blur: 1.4, node: <><Cellar t={t} /><Who id="you" sp="you" t={t} p={IN} cam={cam.pos} mood="night" res={1.5} f={{ expr: prove ? "smile" : "stern", prop: prove ? "phoneLit" : "point", armR: prove ? [60 + 70 * up, 40] : undefined, frontR: true, facing: 1 }} /><Who id="aldric" t={t} p={OUT} cam={cam.pos} mood="lamp" seed={5} f={{ expr: prove ? "shock" : "nervous", prop: "candle", facing: -1 }} /></> };'''),
    # s10j (6:10): it showed the back of Aldric's head. Now a side two-shot: Aldric leans in and whispers, the hero nods, then winces
    ('''        const cam = move([[0.3, 1.45, 3.4], [0.3, 1.35, 1.6], 34], null, 0);
        return { mood: "night", cam, focus: [0.3, 1.4, 1.6], blur: 1.2, node: <><Cellar t={t} /><Who id="you" t={t} p={IN} cam={cam.pos} mood="night" f={{ expr: "nervous", facing: 1 }} /><Who id="aldric" t={t} p={OUT} cam={cam.pos} mood="lamp" seed={5} f={{ back: true, prop: "candle" }} /></> };''',
     '''        const cam = move([[1.55, 1.5, 1.7], [0.3, 1.38, 1.7], 34], null, 0);
        const terr = t > W("S10", 8, "a terrible plan");
        const lean = ramp(t, L10(8).start, L10(8).start + 0.5);
        return { mood: "night", cam, focus: [0.3, 1.4, 1.7], blur: 1.2, node: <><Cellar t={t} /><Who id="you" t={t} p={IN} cam={cam.pos} mood="night" res={1.3} f={{ expr: terr ? "pained" : "nervous", facing: 1, headTilt: terr ? -6 : 6 * Math.sin(t * 7) }} /><Who id="aldric" t={t} p={add(OUT, [0, 0, -0.15 * lean])} cam={cam.pos} mood="lamp" seed={5} res={1.3} f={{ expr: "nervous", prop: "candle", facing: -1, tilt: -10 * lean, talk: terr ? 0 : 0.4 + 0.4 * Math.sin(t * 12), armL: [80, 120], frontL: true }} /></> };'''),
    # s11c (10 s): three framings: Aldric pleads with the steward / the steward savours the idea / Aldric walks to the gallows
    ('''      const cam = move([[STEW_P[0] + 2.4, 1.7, STEW_P[2] + 1.0], [STEW_P[0] + 0.4, 1.45, STEW_P[2]], 36], [[STEW_P[0] + 2.8, 1.9, STEW_P[2] + 0.6], [STEW_P[0] + 1.6, 1.5, STEW_P[2] - 1.0], 38], k);''',
     '''      const likes = W("S11", 1, "the steward likes");
      const cam = t < likes - 0.1
        ? move([[STEW_P[0] + 1.9, 1.65, STEW_P[2] + 1.3], [STEW_P[0] + 0.45, 1.5, STEW_P[2]], 34], [[STEW_P[0] + 1.75, 1.62, STEW_P[2] + 1.15], [STEW_P[0] + 0.45, 1.5, STEW_P[2]], 32], ramp(t, L11(1).start, likes))
        : t < agree - 0.4
          ? move([[STEW_P[0] + 0.9, 1.6, STEW_P[2] + 1.3], [STEW_P[0], 1.62, STEW_P[2]], 30], null, 0)
          : move([[STEW_P[0] + 2.8, 1.9, STEW_P[2] + 0.6], [STEW_P[0] + 1.6, 1.5, STEW_P[2] - 1.0], 38], null, 0);
      const plead = t < likes ? step(t, [[L11(1).start, 0], [W("S11", 1, "hold the devils stone"), 1], [W("S11", 1, "so the whole village"), 2]]) : 3;
      const rub = t > likes && t < agree ? Math.sin(t * 8) * 10 : 0;'''),
    ('''        <Who id="steward" t={t} p={STEW_P} cam={cam.pos} mood="golden" seed={12} f={{ expr: t > agree ? "smile" : "stern", headTilt: nod, facing: 1 }} />''',
     '''        <Who id="steward" t={t} p={STEW_P} cam={cam.pos} mood="golden" seed={12} res={1.3} f={{ expr: t > likes + 0.4 ? "grin" : "stern", headTilt: nod, facing: 1, armR: t > likes ? [110 + rub, 120] : undefined, frontR: true, look: t < likes ? 0.4 : 0 }} />'''),
    ('''armR: t < agree - 0.4 ? [70 + 30 * Math.sin(t * 4), 60] : [60, 70], frontR: true,''',
     '''armR: t < agree - 0.4 ? (plead === 1 ? [100, 20] : plead === 2 ? [140, 60] : [70 + 30 * Math.sin(t * 4), 60]) : [60, 70], frontR: true, armL: plead === 2 ? [140, 60] : undefined, frontL: plead === 2,'''),
    # s12h: the push ends wider, the whole bottom of the page readable
    ('''      const cam = move([[0.36, 1.6, 0.85], [0.4, 0.86, 0.2], 34], [[0.5, 1.02, 0.5], [0.52, 0.875, 0.38], 30], kk);''',
     '''      const cam = move([[0.36, 1.6, 0.85], [0.4, 0.86, 0.2], 34], [[0.46, 1.26, 0.72], [0.48, 0.875, 0.3], 32], kk);'''),
    # s12i (7:41): the Latin line read out in English made no sense; now the translation card, like the opening, with the new ending underlined
    ('''      const cam = move([[0.52, 1.0, 0.56], [0.53, 0.875, 0.38], 28], [[0.53, 0.97, 0.5], [0.53, 0.875, 0.38], 26], k);
      return { mood: "lamp", cam, focus: [0.53, 0.875, 0.38], blur: 1.2, node: <><Archive book={{ old: true, line: 2 }} /></> };''',
     '''      const ul = ramp(t, W("S12", 8, "the stranger went home") - 0.3, WE("S12", 8, "home") + 0.3);
      const cam = move([[1.0, 1.12, 0.74], [0.98, 0.8, 0.43], 30], [[0.99, 1.06, 0.68], [0.98, 0.8, 0.43], 28], k);
      return { mood: "lamp", cam, focus: [0.98, 0.8, 0.43], blur: 1.6, node: <><Archive book={{ old: true, line: 2 }} note={ul} noteEnd /><Pencil2 at={[0.94 + 0.17 * ul, 0.805, 0.452]} /></> };'''),
    # s12j (7:49): the laptop base filled the lower half. Over his shoulder, the laptop whole, the entry on screen
    ('''      const cam = move([[-0.2, 1.25, 1.0], [-0.22, 0.95, 0.4], 30], [[-0.22, 1.12, 0.82], [-0.22, 0.95, 0.4], 26], k);
      return { mood: "lamp", cam, focus: [-0.22, 0.95, 0.4], blur: 1.4, node: <><Archive book={{ old: true, line: 2 }} catalog />{sitArchive(t, cam.pos)}</> };''',
     '''      const zoom = ramp(t, W("S12", 9, "a small black"), L12(9).end);
      const cam = move([[-0.85, 1.55, 1.55], [-0.28, 0.92, 0.36], 34], [[-0.6, 1.3, 1.05], [-0.32, 0.93, 0.4], 30], zoom);
      return { mood: "lamp", cam, focus: [-0.32, 0.93, 0.4], blur: 1.2, node: <><Archive book={{ old: true, line: 2 }} catalog />{sitArchive(t, cam.pos)}</> };'''),
    # s12k: Aldric with the phone: looks at it, holds it to his chest, looks up and smiles
    ('''      const cam = move([[1.8, 1.7, 2.4], [-0.1, 1.2, 0.6], 36], [[1.6, 1.6, 2.0], [-0.1, 1.2, 0.6], 34], k);
      return { mood: "lamp", cam, focus: [-0.1, 1.2, 0.78], blur: 1.2, node: <><Scriptorium t={t} book={{ drawing: true, line: 2 }} /><Who id="aldric" t={t} p={AL12} cam={cam.pos} mood="lamp" seed={5} f={{ mode: "sit", expr: "smile_closed", prop: "phone", armR: [60, 100], frontR: true, armL: [34, 88], frontL: true, headTilt: 8 }} /></> };''',
     '''      const sm = W("S12", 10, "sometimes");
      if (t < sm - 0.15) {
        const cam = move([[1.8, 1.7, 2.4], [-0.1, 1.2, 0.6], 36], [[1.6, 1.6, 2.0], [-0.1, 1.2, 0.6], 34], ramp(t, L12(10).start, sm));
        return { mood: "lamp", cam, focus: [-0.1, 1.2, 0.78], blur: 1.2, node: <><Scriptorium t={t} book={{ drawing: true, line: 2 }} /><Who id="aldric" t={t} p={AL12} cam={cam.pos} mood="lamp" seed={5} f={{ mode: "sit", expr: "neutral", prop: "phone", armR: [80, 100], frontR: true, armL: [34, 88], frontL: true, headTilt: 14, look: 0.3 }} /></> };
      }
      const hug = ramp(t, sm, sm + 0.8);
      const cam = move([[0.45, 1.45, 1.75], [-0.1, 1.32, 0.78], 30], null, 0);
      return { mood: "lamp", cam, focus: [-0.1, 1.3, 0.78], blur: 1.8, node: <><Scriptorium t={t} book={{ drawing: true, line: 2 }} /><Who id="aldric" t={t} p={AL12} cam={cam.pos} mood="lamp" seed={5} res={1.6} f={{ mode: "sit", expr: hug > 0.6 ? "smile_closed" : "smile", prop: "phone", armR: [80 + 40 * hug, 100 + 30 * hug], frontR: true, armL: [34, 88], frontL: true, headTilt: 14 - 22 * hug, look: -0.2 * hug }} /></> };'''),
])

s = open(p, encoding="utf8").read()
if "const Pencil2" not in s:
    s = s.replace('''function sitArchive(''', '''function Pencil2({ at }: { at: V3 }) {
  return (
    <group position={at} rotation={[0.9, 0.4, 0]}>
      <M g={cylG(0.004, 0.004, 0.15, 6)} c="#c84a3a" p={[0, 0.075, 0]} />
      <M g={cylG(0.0, 0.004, 0.02, 6)} c="#2a2228" p={[0, -0.01, 0]} />
    </group>
  );
}
function sitArchive(''', 1)
    s = s.replace('import { line, ramp, scene, W } from "../time";', 'import { line, ramp, scene, W, WE } from "../time";\nimport { M, cylG } from "../../inkbeat/core/kit";', 1)
    open(p, "w", encoding="utf8").write(s)
print("p4 ok")
