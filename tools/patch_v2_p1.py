# User notes, round 3 (full film): archive shots. Run from medieval/.
p = "src/med/seq/p1.tsx"
s = open(p, encoding="utf8").read()

def rep(a, b):
    global s
    assert s.count(a) == 1, a[:80]
    s = s.replace(a, b)

# s02c: two framings + acting (lean in, finger on the lines, impressed at the year)
rep('''      const cam = move([[0.95, 1.45, -1.35], [0.4, 1.05, 0.6], 34], [[0.8, 1.38, -1.05], [0.4, 1.05, 0.6], 34], k);
      const tc = W("S02", 1, "chronicle");
      const fl = ramp(t, tc - 0.2, tc + 0.9);
      const reach = keys(t, [[A(1).start, 0], [tc - 0.2, 1], [tc + 0.9, 0.2]]);
      return { mood: "lamp", cam, focus: FACE_A, blur: 1.1, node: <><Archive book={{ flip: fl < 1 ? fl : -1 }} />{sit(t, cam.pos, { expr: t > W("S02", 1, "twelve") ? "smile" : "neutral", armR: [34 + 25 * reach, 88 - 30 * reach], tilt: -4 * reach }, 1.4)}</> };''',
'''      const tc = W("S02", 1, "chronicle"), tm = W("S02", 1, "written by monks"), ty = W("S02", 1, "twelve");
      const fl = ramp(t, tc - 0.2, tc + 0.9);
      const reach = keys(t, [[A(1).start, 0], [tc - 0.2, 1], [tc + 0.9, 0.2]]);
      if (t < tm) {
        const cam = move([[0.95, 1.45, -1.35], [0.4, 1.05, 0.6], 34], [[0.85, 1.4, -1.15], [0.4, 1.05, 0.6], 34], ramp(t, A(1).start, tm));
        return { mood: "lamp", cam, focus: FACE_A, blur: 1.1, node: <><Archive book={{ flip: fl < 1 ? fl : -1 }} />{sit(t, cam.pos, { expr: "neutral", armR: [34 + 25 * reach, 88 - 30 * reach], tilt: -4 * reach }, 1.4)}</> };
      }
      // leaning over the page, a finger running along the lines; the year makes him whistle
      const lean = ramp(t, tm, tm + 0.6);
      const cam = move([[1.35, 1.32, 0.05], [0.42, 1.05, 0.62], 34], null, 0);
      return { mood: "lamp", cam, focus: FACE_A, blur: 1.2, node: <><Archive />{sit(t, cam.pos, { expr: t > ty ? "whistle" : "neutral", look: 0.5 * Math.sin((t - tm) * 2.4), headTilt: 10 * lean, tilt: 9 * lean, armR: [40 + 8 * Math.sin((t - tm) * 3), 70], frontR: true }, 1.5, { dy: -0.03 * lean })}</> };''')

# s02h: the card slides in (insert), then the reader over the card: foreground card, his face reading the lines
rep('''      const cam = move([[1.0, 1.1, 0.72], NOTE, 32], null, 0);
      return { mood: "lamp", cam, focus: NOTE, blur: 1.8, node: <><Archive noteAt={at} /><Hand at={[1.12 + 0.25 * (1 - slide), 0.81, 0.46 + 0.15 * (1 - slide)]} yaw={0.6} /></> };''',
'''      if (t < A(6).start - 0.1) {
        const cam = move([[1.0, 1.1, 0.72], NOTE, 32], null, 0);
        return { mood: "lamp", cam, focus: NOTE, blur: 1.8, node: <><Archive noteAt={at} /><Hand at={[1.12 + 0.25 * (1 - slide), 0.81, 0.46 + 0.15 * (1 - slide)]} yaw={0.6} /></> };
      }
      const cam = move([[1.25, 1.12, -0.25], [0.62, 1.08, 0.75], 36], null, 0);
      const look = 0.7 * Math.sin((t - A(6).start) * 2.2);
      return { mood: "lamp", cam, focus: FACE_A, blur: 1.4, node: <><Archive />{sit(t, cam.pos, { expr: "nervous", look, headTilt: 12, tilt: 8, armR: [44, 70], frontR: true, armL: [40, 80], frontL: true }, 1.6, { dy: -0.025 })}</> };''')

open(p, "w", encoding="utf8").write(s)
print("p1 ok")
