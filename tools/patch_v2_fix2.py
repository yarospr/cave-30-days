# Round 3, second pass after the check stills. Run from medieval/.
def patch(p, pairs):
    s = open(p, encoding="utf8").read()
    for a, b in pairs:
        assert s.count(a) == 1, (p, a[:90])
        s = s.replace(a, b)
    open(p, "w", encoding="utf8").write(s)

patch("src/med/seq/p1.tsx", [
    # the crowd never stands in the lens
    ('''    {CROWD.map((c) => {
      const o = villagerOutfit((c.i % 26) + 11);''', '''    {CROWD.map((c) => {
      if (Math.hypot(c.p[0] - cam[0], c.p[2] - cam[2]) < 2.2) return null;
      const o = villagerOutfit((c.i % 26) + 11);'''),
    # s02c lean: a little further back
    ('''const cam = move([[1.35, 1.32, 0.05], [0.42, 1.05, 0.62], 34], null, 0);''', '''const cam = move([[1.8, 1.42, -0.2], [0.42, 1.08, 0.66], 36], null, 0);'''),
    # s02h: he picks the card up and reads it, held in both hands
    ('''      const cam = move([[1.25, 1.12, -0.25], [0.62, 1.08, 0.75], 36], null, 0);
      const look = 0.7 * Math.sin((t - A(6).start) * 2.2);
      return { mood: "lamp", cam, focus: FACE_A, blur: 1.4, node: <><Archive />{sit(t, cam.pos, { expr: "nervous", look, headTilt: 12, tilt: 8, armR: [44, 70], frontR: true, armL: [40, 80], frontL: true }, 1.6, { dy: -0.025 })}</> };''',
     '''      const cam = move([[0.55, 1.32, -0.65], [0.42, 1.12, 0.8], 34], null, 0);
      const look = 0.6 * Math.sin((t - A(6).start) * 2.2);
      const lift = ramp(t, A(6).start - 0.1, A(6).start + 0.5);
      const cardAt: V3 = [0.42, 0.8 + 0.3 * lift, 0.52 + 0.08 * lift];
      return { mood: "lamp", cam, focus: FACE_A, blur: 1.2, node: <><Archive noteAt={[0.0, -2, 0]} /><NoteCard p={cardAt} r={[-Math.PI / 2 + 1.2 * lift, Math.PI * lift, 0]} s={1.25} />{sit(t, cam.pos, { expr: "nervous", look, headTilt: 10, armR: [40 + 45 * lift, 60 - 20 * lift], frontR: true, armL: [40 + 45 * lift, 60 - 20 * lift], frontL: true }, 1.5)}</> };'''),
    ('import { Phone, screenTex } from "../props";', 'import { NoteCard, Phone, screenTex } from "../props";'),
])

patch("src/med/sets.tsx", [
    # the book stack sat in front of the laptop: move it to the back of the desk
    ('''{[0, 1, 2].map((i) => <M key={i} g={boxG(0.32, 0.05, 0.24)} c={["#7a3a2a", "#3a5a6a", "#6a6a3a"][i]} tex="paper" p={[-0.6, 0.815 + i * 0.05, 0.28]} r={[0, 0.1 * i, 0]} />)}''',
     '''{[0, 1, 2].map((i) => <M key={i} g={boxG(0.3, 0.05, 0.22)} c={["#7a3a2a", "#3a5a6a", "#6a6a3a"][i]} tex="paper" p={[0.2, 0.815 + i * 0.05, -0.33]} r={[0, 0.1 * i, 0]} />)}'''),
])

patch("src/med/seq/p2.tsx", [
    # the puddle: organic overlapping blobs, deeper; he sinks to the ankles
    ('''      <M g={cylG(0.78, 0.82, 0.05, 28)} c="#5a3e28" tex="sand" p={[0, 0.0, 0]} s={[1.25, 1, 1]} />
      <M g={cylG(0.5, 0.5, 0.012, 24)} c="#7a5a3e" p={[0.35, 0.03, 0.25]} s={[1.3, 1, 0.8]} />''',
     '''      {[[0, 0, 0.75], [0.45, 0.25, 0.5], [-0.5, 0.15, 0.55], [0.1, -0.45, 0.5], [-0.25, 0.5, 0.4], [0.6, -0.3, 0.35]].map(([x, z, r], i) => <M key={`m${i}`} g={sphG(r, 20)} c={i % 2 ? "#5a3c26" : "#4e3420"} tex="sand" p={[x, 0.0, z]} s={[1.15, 0.07, 1]} />)}
      <M g={sphG(0.3, 16)} c="#8a6a4e" p={[0.25, 0.04, 0.2]} s={[1.4, 0.03, 0.8]} />'''),
    ('''p={[p[0], -0.09 + 0.05 * pull, p[2]]}''', '''p={[p[0], -0.15 + 0.06 * pull, p[2]]}'''),
])

patch("src/med/seq/p3.tsx", [
    # coins: closer, so the twelve pence and the cup read
    ('''const cam = move([[0.16, 1.68, -5.0], [0.12, 1.21, -5.93], 34], [[0.17, 1.6, -5.18], [0.12, 1.21, -5.93], 32], ramp(t, t0, gulp));''',
     '''const cam = move([[0.1, 1.5, -5.4], [0.08, 1.2, -5.93], 34], [[0.1, 1.46, -5.48], [0.08, 1.2, -5.93], 32], ramp(t, t0, gulp));'''),
    ('''<Coin key={i} p={[-0.13 + (i % 6) * 0.052''', '''<Coin key={i} p={[-0.17 + (i % 6) * 0.052'''),
    ('''<Cup p={[0.33, 1.2 + 0.3 * drop, -5.93]} s={1.5} />''', '''<Cup p={[0.27, 1.2 + 0.3 * drop, -5.93]} s={1.4} />'''),
    # s09b: the hero from above, small between the two guards (the guard no longer covers him)
    ('''const cam = move([[-1.4, 1.55, -0.55], [0.4, 1.4, -1.6], 32], null, 0);''', '''const cam = move([[0.4, 2.6, 0.5], [0.4, 1.15, -1.6], 34], null, 0);'''),
    # s09f: the jury from the aisle, both rows, nobody cut by the frame edge
    ('''const cam = move([[-3.3, 1.3, -1.0], [-5.0, 0.95, -2.7], 34], [[-3.45, 1.28, -1.25], [-5.0, 0.95, -2.7], 32], ramp(t, tt, L9(5).end + 0.4));''',
     '''const cam = move([[-2.8, 1.5, -2.7], [-5.1, 0.95, -2.8], 36], [[-3.0, 1.45, -2.75], [-5.1, 0.95, -2.8], 34], ramp(t, tt, L9(5).end + 0.4));'''),
])

patch("src/med/seq/p4.tsx", [
    # s10j: from the corridor, through the bars (the camera sat inside the bar line)
    ('''const cam = move([[1.55, 1.5, 1.7], [0.3, 1.38, 1.7], 34], null, 0);''', '''const cam = move([[1.75, 1.5, 2.3], [0.3, 1.38, 1.6], 36], null, 0);'''),
    # s11c A: wider, both Aldric and the steward
    ('''? move([[STEW_P[0] + 1.9, 1.65, STEW_P[2] + 1.3], [STEW_P[0] + 0.45, 1.5, STEW_P[2]], 34], [[STEW_P[0] + 1.75, 1.62, STEW_P[2] + 1.15], [STEW_P[0] + 0.45, 1.5, STEW_P[2]], 32], ramp(t, L11(1).start, likes))''',
     '''? move([[STEW_P[0] + 2.0, 1.7, STEW_P[2] - 1.6], [STEW_P[0] + 0.45, 1.45, STEW_P[2]], 36], [[STEW_P[0] + 1.85, 1.68, STEW_P[2] - 1.45], [STEW_P[0] + 0.45, 1.45, STEW_P[2]], 34], ramp(t, L11(1).start, likes))'''),
    ('''          ? move([[STEW_P[0] + 0.9, 1.6, STEW_P[2] + 1.3], [STEW_P[0], 1.62, STEW_P[2]], 30], null, 0)''',
     '''          ? move([[STEW_P[0] + 0.9, 1.62, STEW_P[2] - 1.3], [STEW_P[0], 1.62, STEW_P[2]], 30], null, 0)'''),
])
print("fix2 ok")
