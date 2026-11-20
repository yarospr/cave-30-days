# Free arm control for bodyFront (additive): armL / armR = [shoulder deg, elbow deg].
# shoulder 0 = hanging down, 90 = straight out to the side, 160 = up over the head; elbow bends the forearm up/inward.
# armFront: draw that arm in front of the torso (hands reaching across / holding things at the chest).
p = "src/flat/toon.ts"
s = open(p, encoding="utf8").read()


def R(a, b):
    global s
    assert a in s, a[:80]
    s = s.replace(a, b, 1)


R("  /** medieval: seen from behind (no face; hair / coif covers the head) */\n  back?: boolean;",
  "  /** medieval: seen from behind (no face; hair / coif covers the head) */\n  back?: boolean;\n"
  "  /** medieval: free arms [shoulder deg, elbow deg]; 0/0 = hanging. Overrides the prop pose for that arm. */\n"
  "  armL?: [number, number]; armR?: [number, number];\n"
  "  /** draw the left / right arm in front of the torso */\n  frontL?: boolean; frontR?: boolean;")
# after the arms list is built, apply the overrides
R("  const drawArm = (a: Arm) => { p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 5.2 * u, armCol); p.dot(a.pts[2][0], a.pts[2][1], 5.5 * u); };",
  """  const freeArm = (side: number, ang: [number, number]): [P2, P2, P2] => {
    const S = sh(side), Lu = 0.5 * HH, Ll = 0.5 * HH, a1 = rad(ang[0]), a2 = rad(ang[0] + ang[1]);
    const E: P2 = [S[0] + side * Math.sin(a1) * Lu, S[1] + Math.cos(a1) * Lu];
    return [S, E, [E[0] + side * Math.sin(a2) * Ll, E[1] + Math.cos(a2) * Ll]];
  };
  if (opts.armL || opts.armR) {
    const keep = arms.filter((a) => (a.pts[2][0] < tcx ? !opts.armL : !opts.armR));
    arms.length = 0; arms.push(...keep);
    if (opts.armL) arms.push({ pts: freeArm(-1, opts.armL), front: !!opts.frontL });
    if (opts.armR) arms.push({ pts: freeArm(1, opts.armR), front: opts.frontR ?? !!(prop && typeof prop === "string") });
  }
  const drawArm = (a: Arm) => { p.stroke(curve(a.pts[0], a.pts[1], a.pts[2]), 5.2 * u, armCol); p.dot(a.pts[2][0], a.pts[2][1], 5.5 * u); };""")
open(p, "w", encoding="utf8").write(s)
print("ok")
