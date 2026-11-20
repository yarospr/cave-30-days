# Noose around the neck for bodyFront (additive): opts.noose = true draws the rope ring + the rope going up.
p = "src/flat/toon.ts"
s = open(p, encoding="utf8").read()
a = "  armL?: [number, number]; armR?: [number, number];"
assert a in s
s = s.replace(a, a + "\n  /** medieval: a noose around the neck, the rope going straight up off the card */\n  noose?: boolean;", 1)
a = "  // ---- head: rotates with the body, plus its own tilt about the chin ----"
assert a in s
s = s.replace(a, """  if (opts.noose) {
    const rope = "#c9a46a", kx = 300 + 0.3 * W, ky = chin - 0.02 * HH;
    p.stroke([[kx, ky], [kx - 4 * u, ky - 0.6 * HH], [300 + 0.05 * W, 0]], 9 * u, INK);
    p.stroke([[kx, ky], [kx - 4 * u, ky - 0.6 * HH], [300 + 0.05 * W, 0]], 5.5 * u, rope);
    const ring: P2[] = Array.from({ length: 25 }, (_, i) => [300 + 0.36 * W * Math.cos((i / 24) * Math.PI * 2), chin + 0.08 * HH * Math.sin((i / 24) * Math.PI * 2)] as P2);
    p.stroke(ring, 10 * u, INK); p.stroke(ring, 6 * u, rope);
    p.ell(kx, ky + 3 * u, 8 * u, 11 * u, rope, 2.5 * u);
  }
""" + a, 1)
open(p, "w", encoding="utf8").write(s)
print("ok")
