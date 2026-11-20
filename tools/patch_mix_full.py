# One-off: the cellar camera in p4, and the sound cues for S04–S12 in tools/mix.py. Run from medieval/.
p = "src/med/seq/p4.tsx"
s = open(p, encoding="utf8").read()
s = s.replace("const cam = move([[2.1, 1.75, -0.7], [-0.7, 0.9, 0.7], 42], null, 0);", "const cam = move([[1.7, 1.65, -1.9], [-0.7, 0.9, 1.3], 42], null, 0);")
s = s.replace('<Who id="you" t={t} p={[-1.5, 0.08, -1.4]} cam={cam.pos} mood="night" f={{ mode: "sit", expr: "pained", headTilt: 16,',
              '<Who id="you" t={t} p={[-0.8, 0.02, 0.3]} cam={cam.pos} mood="night" f={{ mode: "sit", expr: "pained", headTilt: 16,')
open(p, "w", encoding="utf8").write(s)

p = "tools/mix.py"
s = open(p, encoding="utf8").read()
MARK = "# ------------------------------------------------------------------ mix: steady beds"
if "# ================================================================== S04 the village at dusk" not in s:
    block = open("tools/cues_s04_s12.py", encoding="utf8").read()
    a = s.index(MARK)
    s = s[:a] + block + "\n" + s[a:]
    open(p, "w", encoding="utf8").write(s)
print("ok")

# the recording played from the phone at the gallows (S11 line 3) sounds like a small phone speaker
s = open("tools/mix.py", encoding="utf8").read()
A = "voice = raw * gain[:, None]\n"
if "phone speaker" not in s:
    s = s.replace(A, A + '''# phone speaker: the S11 playback of Hamo's line, band-limited
_l = LINES[("S11", 3)]; _a, _b = int((_l["start"] - 0.05) * SR), int((_l["end"] + 0.25) * SR)
_seg = voice[_a:_b].copy()
_hp = _seg - np.stack([np.convolve(_seg[:, c], np.ones(40) / 40, mode="same") for c in range(2)], 1)
voice[_a:_b] = np.stack([np.convolve(_hp[:, c], np.ones(4) / 4, mode="same") for c in range(2)], 1) * 2.0
''', 1)
    open("tools/mix.py", "w", encoding="utf8").write(s)
print("phone ok")
