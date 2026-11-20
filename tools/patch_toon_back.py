# Back view for bodyFront (additive): no face, the head covered by hair / coif / hood from behind.
p = "src/flat/toon.ts"
s = open(p, encoding="utf8").read()
a = "  light?: number; facing?: -1 | 0 | 1; seed?: number;"
assert a in s
s = s.replace(a, a + "\n  /** medieval: seen from behind (no face; hair / coif covers the head) */\n  back?: boolean;", 1)
a = "  faceFront(p, 300, hc, W, expr, facing, look, lid, brim, skin, o.moustache, o.build === \"stout\");"
assert a in s
b = """  if (opts.back) {
    const col = o.hat === "bonnet" ? (o.cap ?? BONNET) : o.hat === "straw" ? "#e2b75c" : o.hood && o.hat === "tonsure" ? o.hood : (o.hair ?? "#5a3a26");
    const cover = blobPts(300, hc, H).filter(([, y]) => y < hc + (o.hat === "bonnet" ? 0.75 : o.hat === "tonsure" ? 0.55 : 0.45) * H.b);
    if (cover.length > 2) { p.shadedFill(cover, col, mul(col, SH_FELT), light, H.a, 0.35); p.poly(cover, null, ow * 0.8); }
    if (o.hat === "tonsure") p.ell(300, hc - 0.45 * H.b, 0.38 * W, 0.28 * H.b, skin, ow * 0.6);
  } else
""" + a
s = s.replace(a, b, 1)
open(p, "w", encoding="utf8").write(s)
print("ok")
