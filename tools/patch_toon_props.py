# One-off patch: talking mouths + medieval props/gestures for src/flat/toon.ts (additive). Run from medieval/.
p = "src/flat/toon.ts"
s = open(p, encoding="utf8").read()


def R(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


R('type MouthK = "dash" | "frown" | "smirk" | "smile" | "smileWide" | "grin" | "laugh" | "o" | "O" | "wave" | "teeth" | "lick";',
  'type MouthK = "dash" | "frown" | "smirk" | "smile" | "smileWide" | "grin" | "laugh" | "o" | "O" | "wave" | "teeth" | "lick" | "talk";\n'
  '/** medieval addition: how open the mouth is while speaking (0..1), set by bodyFront / bodySide from opts.talk */\nlet TALK = 0;')
R('    case "lick": p.arc(mx, my - 3 * u, 8 * u * k, 4.5 * u, 20, 160, mw); p.ell(mx + 6 * u * k, my + 3 * u, 3.6 * u, 4.6 * u, TONGUE, 2.4 * u); break;',
  '    case "lick": p.arc(mx, my - 3 * u, 8 * u * k, 4.5 * u, 20, 160, mw); p.ell(mx + 6 * u * k, my + 3 * u, 3.6 * u, 4.6 * u, TONGUE, 2.4 * u); break;\n'
  '    case "talk": { const o = clamp(TALK, 0, 1); p.ell(mx, my + 1.5 * u, (5 + 2.5 * o) * u * k, (2.2 + 6 * o) * u, MOUTH, 3 * u); if (o > 0.45) p.ell(mx + u, my + (2 + 4 * o) * u, 2.6 * u * k, 1.6 * o * u, TONGUE, 0); break; }')
R('  mouth(p, F.mouth, mx, my, u);', '  mouth(p, TALK > 0.12 ? "talk" : F.mouth, mx, my, u);')
R('  mouth(p, F.mouth, hx + 33 * u, hy + 21 * u, u, 0.62);', '  mouth(p, TALK > 0.12 ? "talk" : F.mouth, hx + 33 * u, hy + 21 * u, u, 0.62);')

R('export type Prop = null | "icecream" | "shako" | ["hammer", number];',
  'export type Prop = null | "icecream" | "shako" | ["hammer", number]\n'
  '  // medieval additions: held at the chest / a pole in the hand / raised / both hands tied in front / gestures\n'
  '  | "phone" | "phoneLit" | "phoneHigh" | "cup" | "book" | "candle" | "dice" | "pitchfork" | "torch" | "tied" | "tiedPhone"\n'
  '  | "point" | "shrug" | "hips" | "barrel";\n'
  'const CHEST = new Set(["phone", "phoneLit", "cup", "book", "candle", "dice"]);')
R('  prop?: Prop; tilt?: number; headTilt?: number; wave?: number;',
  '  prop?: Prop; tilt?: number; headTilt?: number; wave?: number;\n  /** medieval: mouth open 0..1 while speaking */\n  talk?: number;')
R('    light = DEF_LIGHT, facing = 0, seed = 1 } = opts;', '    light = DEF_LIGHT, facing = 0, seed = 1 } = opts;\n  TALK = opts.talk ?? 0;')

R('''  else {
    arms.push({ pts: prop === "shako" ? hang(-1, 0) : hang(-1, -sw), front: false });''',
  '''  else if (prop === "tied" || prop === "tiedPhone") {
    for (const side of [-1, 1]) { const S = sh(side); arms.push({ pts: [S, [tcx + side * (1.02 * T.a + 4 * u), S[1] + 0.42 * HH], [tcx + side * 5 * u, chin + 0.66 * HH]], front: true }); }
  } else if (prop === "shrug") {
    for (const side of [-1, 1]) { const S = sh(side); arms.push({ pts: [S, [tcx + side * (1.15 * T.a + 8 * u), S[1] + 0.3 * HH], [tcx + side * (1.3 * T.a + 22 * u), S[1] + 0.05 * HH]], front: false }); }
  } else if (prop === "hips") {
    for (const side of [-1, 1]) { const S = sh(side); arms.push({ pts: [S, [tcx + side * (1.25 * T.a + 14 * u), S[1] + 0.3 * HH], [tcx + side * 0.95 * T.a, torsoBot - 0.3 * HH]], front: false }); }
  } else if (prop === "barrel") {
    for (const side of [-1, 1]) { const S = sh(side); arms.push({ pts: [S, [tcx + side * (1.1 * T.a + 6 * u), S[1] + 0.3 * HH], [tcx + side * 0.75 * T.a, S[1] + 0.42 * HH]], front: true }); }
  } else {
    arms.push({ pts: prop === "shako" ? hang(-1, 0) : hang(-1, -sw), front: false });''')
R('''    } else arms.push({ pts: hang(1, sw), front: false });
  }''',
  '''    } else if (prop && typeof prop === "string" && CHEST.has(prop)) {
      const S = sh(1);
      arms.push({ pts: [S, [tcx + 1.05 * T.a + 4 * u, S[1] + 0.45 * HH], [tcx + 0.42 * T.a, S[1] + 0.34 * HH]], front: true });
    } else if (prop === "pitchfork" || prop === "torch") {
      const S = sh(1);
      arms.push({ pts: [S, [tcx + 1.1 * T.a + 8 * u, S[1] + 0.3 * HH], [tcx + 1.08 * T.a + 12 * u, S[1] + 0.5 * HH]], front: true });
    } else if (prop === "phoneHigh" || prop === "point") {
      const S = sh(1), hi = prop === "phoneHigh";
      arms.push({ pts: [S, [tcx + 1.12 * T.a + 14 * u, S[1] + (hi ? -0.12 : 0.05) * HH], [tcx + 1.1 * T.a + (hi ? 22 : 40) * u, S[1] + (hi ? -0.48 : -0.05) * HH]], front: true });
    } else arms.push({ pts: hang(1, sw), front: false });
  }''')
R('''  if (prop === "shako") { // carried by the left hand''',
  '''  if (prop && typeof prop === "string") for (const a of arms) if (a.front) {
    const [hx, hy] = a.pts[2];
    const glow = "#fff7c8", screen = "#9fd8ff";
    if (prop === "phone" || prop === "phoneLit" || prop === "phoneHigh" || (prop === "tiedPhone" && hx > tcx)) {
      const lit = prop !== "phone";
      p.poly([[hx - 7 * u, hy - 26 * u], [hx + 7 * u, hy - 26 * u], [hx + 7 * u, hy + 2 * u], [hx - 7 * u, hy + 2 * u]], "#1d1b24", 2 * u);
      if (lit) p.poly([[hx - 5 * u, hy - 23.5 * u], [hx + 5 * u, hy - 23.5 * u], [hx + 5 * u, hy - 1 * u], [hx - 5 * u, hy - 1 * u]], prop === "phoneHigh" ? glow : screen, 0);
    } else if (prop === "cup") {
      p.poly([[hx - 9 * u, hy - 20 * u], [hx + 9 * u, hy - 20 * u], [hx + 5 * u, hy - 4 * u], [hx - 5 * u, hy - 4 * u]], "#cfd3da", 2 * u);
      p.stroke([[hx, hy - 4 * u], [hx, hy + 4 * u]], 3 * u); p.ell(hx, hy + 5 * u, 7 * u, 2 * u, "#cfd3da", 1.8 * u);
    } else if (prop === "book") {
      p.poly([[hx - 16 * u, hy - 20 * u], [hx + 16 * u, hy - 20 * u], [hx + 16 * u, hy + 4 * u], [hx - 16 * u, hy + 4 * u]], "#7a3a26", 2.2 * u);
      p.stroke([[hx, hy - 20 * u], [hx, hy + 4 * u]], 1.6 * u);
    } else if (prop === "candle") {
      p.poly([[hx - 4 * u, hy - 22 * u], [hx + 4 * u, hy - 22 * u], [hx + 4 * u, hy + 2 * u], [hx - 4 * u, hy + 2 * u]], "#f4ead2", 1.8 * u);
      p.ell(hx, hy - 30 * u, 3.5 * u, 7 * u, "#ffc04a", 1.2 * u);
    } else if (prop === "dice") {
      for (const dx of [-6, 6]) p.poly([[hx + dx * u - 5 * u, hy - 14 * u], [hx + dx * u + 5 * u, hy - 14 * u], [hx + dx * u + 5 * u, hy - 4 * u], [hx + dx * u - 5 * u, hy - 4 * u]], "#f2ecdc", 1.6 * u);
    } else if (prop === "pitchfork" || prop === "torch") {
      const top = crown - 0.35 * HH, bot = Math.min(sole - 10 * u, hy + 0.9 * HH);
      p.band([[hx, bot], [hx, top + 30 * u]], "#8a5a34", 5 * u, 1.5 * u, "round");
      if (prop === "pitchfork") {
        p.stroke([[hx - 14 * u, top + 30 * u], [hx + 14 * u, top + 30 * u]], 4 * u, "#7d848c");
        for (const dx of [-14, 0, 14]) p.stroke([[hx + dx * u, top + 30 * u], [hx + dx * u, top]], 3.5 * u, "#7d848c");
      } else {
        p.poly([[hx - 7 * u, top + 30 * u], [hx + 7 * u, top + 30 * u], [hx + 5 * u, top + 14 * u], [hx - 5 * u, top + 14 * u]], "#4a3a2a", 1.6 * u);
        p.ell(hx, top + 2 * u, 10 * u, 16 * u, "#ffb03a", 0); p.ell(hx, top + 6 * u, 5.5 * u, 9 * u, glow, 0);
      }
    }
    p.dot(hx, hy, 5.5 * u);
  }
  if (prop === "tied" || prop === "tiedPhone") {
    const y = chin + 0.66 * HH;
    p.band([[tcx - 9 * u, y - 4 * u], [tcx + 9 * u, y + 2 * u]], "#c9a46a", 5 * u, 1.4 * u);
    p.band([[tcx - 9 * u, y + 3 * u], [tcx + 9 * u, y - 3 * u]], "#c9a46a", 5 * u, 1.4 * u);
  }
  if (prop === "shako") { // carried by the left hand''')

R('export const bodySide = (p: Pen, o: Outfit, opts: SideOpts) => {', 'export const bodySide = (p: Pen, o: Outfit, opts: SideOpts) => {\n  TALK = opts.talk ?? 0;')
R('  stride?: number; light?: number; seed?: number;', '  stride?: number; light?: number; seed?: number;\n  /** medieval: mouth open 0..1 while speaking */\n  talk?: number;')
open(p, "w", encoding="utf8").write(s)
print("patched")
