
# ------------------------------------------------------------------ voice, every line brought to one level
raw = dec(f"{OUT}/voice.wav"); raw = np.pad(raw, ((0, max(0, N - len(raw))), (0, 0)))[:N]
gain = np.ones(N, np.float32); TARGET = {"narrator": -15.5, "stranger": -15.5}
for l in VTL["lines"]:
    a, b = int((l["start"] - 0.03) * SR), int((l["end"] + 0.1) * SR)
    r = rms(raw[a:b]); tgt = TARGET.get(l["sp"], -15.0)
    gain[max(0, a - 2400):b + 2400] = min(db(9), max(db(-9), db(tgt) / r))
k = 2400; gain = np.convolve(gain, np.ones(k) / k, mode="same").astype(np.float32)
voice = raw * gain[:, None]
e = np.abs(voice).mean(axis=1); hop = 480; ev = np.array([e[i:i + hop].mean() for i in range(0, N, hop)])
act = (ev > db(-42)).astype(np.float32); out = np.zeros_like(act); v = 0.0
for i, x in enumerate(act):
    v += (x - v) * (0.25 if x > v else 0.018); out[i] = v
duck = np.interp(np.arange(N), np.arange(len(out)) * hop, out).astype(np.float32)[:, None]
music = np.zeros((N, 2), np.float32); amb = np.zeros((N, 2), np.float32); sfx = np.zeros((N, 2), np.float32)
CAVE = "aecho=0.8:0.7:180|320:0.35|0.25"; FAR = "highpass=f=250,lowpass=f=1100,aecho=0.8:0.7:240|420:0.4|0.3"; LOW = "lowpass=f=600"

# ------------------------------------------------------------------ synthesis (deterministic)
rng = np.random.default_rng(7)
def st2(x): return np.stack([x, x], 1).astype(np.float32)
def tone(f, d, dec_=6.0, harm=(1, 2.76, 5.4), amp=(1, 0.35, 0.12)):
    t = np.arange(int(d * SR)) / SR
    return st2(sum(a * np.sin(2 * np.pi * f * h * t) * np.exp(-dec_ * t * (1 + i * 0.8)) for i, (h, a) in enumerate(zip(harm, amp))))
def noise(d): return rng.standard_normal(int(d * SR)).astype(np.float32)
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0; return np.fft.irfft(X, len(x)).astype(np.float32)
def put_db(bus, x, t, g): put(bus, x / (np.abs(x).max() + 1e-6) * db(g), warp(t))
def ringing(t0, d, g=-30):
    t = np.arange(int(d * SR)) / SR; x = np.sin(2 * np.pi * 6200 * t) * np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / 0.8)
    put(sfx, st2(x) * db(g), warp(t0))
def flutter(t0, d, g=-12, rate=11):
    x = bp(noise(d), 600, 3500); t = np.arange(len(x)) / SR
    x *= (0.55 + 0.45 * np.sin(2 * np.pi * rate * t)) * np.minimum(1, t / 0.15) * np.minimum(1, (d - t) / 0.6); put_db(sfx, st2(x), t0, g)
def chirp(t0, n=3, g=-20):
    for i in range(n):
        t = np.arange(int(0.05 * SR)) / SR; x = np.sin(2 * np.pi * 4600 * t) * np.sin(np.pi * t / 0.05)
        put(sfx, st2(x) * db(g), warp(t0 + i * 0.09))
def spark(t0, g=-12):
    x = bp(noise(0.05), 2500, 9000) * np.exp(-np.arange(int(0.05 * SR)) / SR * 90); put_db(sfx, st2(x), t0, g)
    put_db(sfx, tone(1800, 0.12, 40, (1, 2.3), (1, 0.4)), t0, g - 6)
def cough(t0, g=-12):
    for j, d in enumerate([0.22, 0.18]):
        x = bp(noise(d), 250, 1800); tt = np.arange(len(x)) / SR; x *= np.exp(-tt * 14) * np.minimum(1, tt / 0.01); put_db(sfx, st2(x), t0 + j * 0.3, g - 2 * j)
def rain(t0, t1, g=-24):
    d = warp(t1) - warp(t0); x = bp(noise(d), 1500, 9000); x = np.stack([x, np.roll(x, 911)], 1)
    put(amb, x / (np.abs(x).max() + 1e-6) * db(g) * env_fade(len(x), 0.4, 0.05), warp(t0))
NOTES = [523.3, 587.3, 659.3, 784.0, 880.0, 784.0, 659.3]   # a little pentatonic tune
def stamp(t): hit(sfx, "punch_whoosh", t - 0.08, -16); hit(sfx, "thud_body", t, -14, af=LOW)
def voice_echo(sc, i, word, t, g=-12, dur=0.9):
    l = LINES[(sc, i)]; ws = [x for x in l["words"] if x[0] == word]
    a = int(ws[0][1] * SR) if ws else int(l["start"] * SR); x = raw[a:a + int(dur * SR)].copy()
    y = np.zeros((int(5.5 * SR), 2), np.float32); y[:len(x)] += x
    for d_, gg in [(0.35, 0.55), (0.7, 0.4), (1.1, 0.3), (1.6, 0.22), (2.2, 0.15), (3.0, 0.1)]:
        o = int(d_ * SR); y[o:o + len(x)] += x * gg
    put(sfx, y * db(g) / (np.abs(y).max() + 1e-6) * 0.9, warp(t))

S = SC
# ================================================================== S01 the street
cue(music, "Darkest Child", 12, 0.0, en("S01", 3) - 0.05, -12, 0.4, 0.05)
rain(0.0, en("S01", 3) + 0.02, -22)
bed(amb, "wind_cold", 0.0, en("S01", 3) + 0.02, -26, 0.4, 0.05, af="lowpass=f=900")
for k in range(4): hit(sfx, "steps_dirt", 0.05 + k * 0.42, -20, ss=1 + k * 0.4, dur=0.3, fo=0.08)
hit(sfx, "cloth", w("S01", 0, "thirty") - 0.3, -16)
hit(sfx, "paper", w("S01", 0, "million"), -10)
hit(sfx, "swoosh", w("S01", 3, "deal") + 0.2, -20, rate=0.6)
hit(sfx, "punch_whoosh", en("S01", 3) - 0.15, -6)
hit(sfx, "impact", en("S01", 3) + 0.02, -2, af="lowpass=f=380")
hit(sfx, "thud_body", en("S01", 3) + 0.05, -6, af=LOW)
hit(sfx, "impact", en("S01", 3) + 0.45, -12, af="lowpass=f=200,aecho=0.8:0.8:400|700:0.4|0.3")
# ================================================================== S02–S03 darkness
dark0 = S["S02"]["start"]
cue(music, "Long Note Four", 30, dark0 + 0.8, S["S03"]["end"] - 0.5, -17, 3.0, 2.0)
bed(amb, "water_drip", dark0 + 0.2, S["S04"]["end"], -21, 2.0, 1.0, af=CAVE)
bed(amb, "wind_cold", dark0, S["S12"]["end"], -30, 3.0, 2.0, af="lowpass=f=420")
ringing(dark0 + 0.3, 4.5, -36)
hit(sfx, "gasp_male", st("S02", 1) - 0.4, -14)
hit(sfx, "thud_body", w("S02", 4, "ow") - 0.08, -4, af=LOW)
hit(sfx, "impact", w("S02", 4, "ow") - 0.08, -10, af="lowpass=f=300")
for k in range(6): hit(sfx, "cloth", st("S02", 5) + 0.2 + k * 0.75, -20)
hit(sfx, "rope_creak", w("S02", 5, "rope") - 0.1, -10, dur=1.4, fo=0.4)
hit(sfx, "rope_creak", w("S02", 5, "pull"), -8, dur=1.2, fo=0.4)
hit(sfx, "church_bell", w("S02", 5, "bell") - 0.05, -10, af=FAR, dur=4.5, fo=1.5)
hit(sfx, "impact", st("S02", 6) - 0.2, -14, af="lowpass=f=160")
stamp(w("S02", 3, "problem"))
for i in range(4): stamp(w("S03", i, "problem"))
stamp(w("S03", 7, "problem"))
hit(sfx, "wind_cold", st("S03", 0), -20, dur=4, fo=1.5)
hit(sfx, "heartbeat", w("S03", 1, "heartbeat") - 0.2, -8, af="lowpass=f=200", ss=1, dur=5.5, fo=1.5)
ringing(w("S03", 1, "ringing"), 3.0, -27)
for k in range(5): hit(sfx, "steps_dirt", st("S03", 2) + 0.3 + k * 0.55, -22, ss=k * 0.3, dur=0.3, fo=0.08, af=CAVE)
hit(sfx, "water_drip", st("S03", 3), -10, dur=3, af=CAVE)
hit(sfx, "mud_squelch", w("S03", 3, "slip"), -8)
hit(sfx, "mud_squelch", w("S03", 3, "twice") + 0.2, -9)
hit(sfx, "thud_body", w("S03", 3, "twice") + 0.3, -12, af=LOW)
bed(amb, "river", st("S03", 4) - 1.0, S["S06"]["end"], -20, 1.5, 1.5, af="lowpass=f=2500")
hit(sfx, "splash_big", w("S03", 4, "please") + 0.1, -18, dur=1.0, fo=0.3)
hit(sfx, "gulp", st("S03", 5) + 0.2, -10)
flutter(w("S03", 5, "answers") - 0.1, 1.6, -26)
flutter(w("S03", 6, "aaah") - 0.25, 4.5, -6)
hit(sfx, "splash_big", w("S03", 6, "aaah") + 0.35, -8)
flutter(st("S03", 7) - 0.2, 5.5, -12)
hit(sfx, "stomach", w("S03", 7, "starving"), -6)
# ================================================================== S04 foxfire
cue(music, "Spellbound", 0, st("S04", 0) - 0.4, S["S04"]["end"] + 0.4, -14, 2.0, 1.5)
hit(sfx, "magic_shimmer", w("S04", 0, "glowing") - 0.2, -14, fo=0.8)
for k in range(5): hit(sfx, "cloth", w("S04", 0, "glowing") + 0.3 + k * 0.6, -21)
hit(sfx, "magic_shimmer", st("S04", 2) - 0.1, -12, rate=1.2, fo=0.6)
voice_echo("S04", 2, "light", w("S04", 2, "light", 1) + 0.6, -24, 0.7)
hit(sfx, "swoosh", w("S04", 3, "for") - 0.1, -20, rate=0.5)
# ================================================================== S05–S06 time, cricket, fish
cue(music, "Mystery Bazaar", 0, S["S05"]["start"] + 0.2, S["S06"]["end"] - 0.2, -17, 1.5, 1.5)
stamp(w("S05", 0, "problem")); stamp(w("S05", 2, "problem"))
hit(sfx, "watch_tick", st("S05", 0) + 0.5, -18, dur=4, fo=1.0)
hit(sfx, "paper", st("S05", 1) - 0.1, -10)
hit(sfx, "scribble", w("S05", 2, "scratch") - 0.1, -10, dur=1.6, fo=0.3, af="highpass=f=900")
chirp(w("S05", 2, "problem") + 0.6, 3); chirp(w("S05", 2, "face") - 0.3, 3)
hit(sfx, "gasp_male", st("S05", 3) - 0.15, -12)
chirp(st("S05", 4) + 0.2, 4, -18); chirp(st("S05", 4) + 1.8, 3, -20)
hit(sfx, "punch_whoosh", w("S05", 5, "crunchy") - 0.4, -18)
hit(sfx, "mud_squelch", w("S05", 5, "crunchy") - 0.2, -12, rate=1.6)
hit(sfx, "gulp", w("S05", 5, "fine", 2) - 0.4, -12)
stamp(w("S06", 1, "problem")); stamp(w("S06", 4, "problem"))
for x in ["miss", "again"]: hit(sfx, "splash_big", w("S06", 1, x) + 0.1, -16, dur=0.8, fo=0.3)
hit(sfx, "splash_big", w("S06", 1, "fall") + 0.25, -6)
hit(sfx, "cloth", w("S06", 2, "hoodie") - 0.2, -10, dur=1.2)
hit(sfx, "splash_big", st("S06", 3) - 0.1, -12, dur=1.0, fo=0.3)
hit(sfx, "impact", w("S06", 4, "slice"), -16, af="highpass=f=1500")
hit(sfx, "cloth", w("S06", 4, "tear"), -6, rate=1.5, dur=0.6)
hit(sfx, "bubbles", w("S06", 4, "rinse"), -16, dur=1.2, fo=0.3)
# ================================================================== S07 wet, dry chamber, cinema
cue(music, "Oppressive Gloom", 10, S["S07"]["start"] + 0.2, S["S07"]["end"] + 0.5, -16, 1.5, 1.0)
stamp(w("S07", 0, "problem")); stamp(w("S07", 2, "problem"))
for k in range(6): hit(sfx, "water_drip", st("S07", 0) + 0.3 + k * 0.6, -16, dur=0.35, fo=0.1, af=CAVE)
hit(sfx, "wind_cold", st("S07", 1), -16, dur=4, fo=1.5, af="lowpass=f=1500")
hit(sfx, "magic_shimmer", w("S07", 2, "colors") - 0.2, -14, rate=0.8, fo=0.8)
hit(sfx, "crowd_murmur", w("S07", 2, "whispers") - 0.2, -18, af="highpass=f=500,lowpass=f=2500," + CAVE, dur=3, fo=1.2)
hit(sfx, "gasp_male", st("S07", 3) - 0.3, -10)
# ================================================================== S08 the backpack, the rope
cue(music, "Heartbreaking", 0, S["S08"]["start"] + 0.3, S["S08"]["end"] + 0.3, -15, 1.5, 0.8)
hit(sfx, "mud_squelch", w("S08", 0, "backpack"), -10)
hit(sfx, "cloth", w("S08", 0, "somebody"), -14)
hit(sfx, "dishes", w("S08", 1, "tin") - 0.05, -14, dur=0.6, fo=0.2)
hit(sfx, "page_turn", w("S08", 1, "diary") + 0.3, -9)
for x in ["five", "nine"]: hit(sfx, "page_turn", w("S08", 1, x) - 0.15, -11)
hit(sfx, "rope_creak", st("S08", 2) + 0.4, -12, dur=2.0, fo=0.6)
hit(sfx, "rope_creak", en("S08", 3) + 0.1, -10, dur=1.2, fo=0.4)
# ================================================================== S09 fire + lamp
cue(music, "Lightless Dawn", 40, S["S09"]["start"] + 0.2, w("S09", 2, "fire") - 0.1, -17, 1.5, 0.3)
cue(music, "Long Road Ahead B", 0, w("S09", 2, "fire") - 0.2, S["S09"]["end"] + 0.6, -13, 0.4, 1.5)
stamp(w("S09", 0, "problem")); stamp(w("S09", 3, "problem"))
hit(sfx, "impact", w("S09", 1, "flint") + 0.1, -18, af="highpass=f=1200")
hit(sfx, "splash_big", w("S09", 1, "golden"), -18, dur=0.6, fo=0.2)
for x in np.linspace(w("S09", 1, "sparks"), en("S09", 1), 6): spark(x, -10)
for x in np.linspace(st("S09", 2), w("S09", 2, "fire") - 0.15, 6): spark(x, -8)
hit(sfx, "magic_shimmer", w("S09", 2, "fire") - 0.15, -12, rate=0.7)
bed(amb, "fire_crackle", w("S09", 2, "fire") - 0.1, S["S12"]["end"], -18, 0.6, 1.5)
for k in range(4): cough(w("S09", 3, "smoke") + 0.6 + k * 1.3, -10)
cough(w("S09", 3, "except") + 0.2, -8)
hit(sfx, "wind_cold", w("S09", 4, "pulls"), -16, dur=3, fo=1.2, af="lowpass=f=1200")
hit(sfx, "cloth", w("S09", 5, "string"), -10, rate=1.3, dur=0.8)
hit(sfx, "magic_shimmer", w("S09", 5, "lamp") - 0.1, -15, rate=1.1, fo=0.6)
# ================================================================== S10 days 13–18
cue(music, "Teller of the Tales", 0, S["S10"]["start"] + 0.3, S["S10"]["end"] - 0.4, -18, 1.5, 1.0)
bed(amb, "river", st("S10", 1) - 0.3, en("S10", 1), -18, 1.0, 1.0)
hit(sfx, "thunder", st("S10", 1) + 0.2, -16, af=FAR, dur=5, fo=1.5)
bed(amb, "water_flood", w("S10", 1, "rises"), w("S10", 1, "dark"), -14, 1.5, 1.5)
hit(sfx, "bubbles", w("S10", 1, "drowns"), -10, dur=1.5)
hit(sfx, "heartbeat", w("S10", 2, "blue") - 0.2, -10, af="lowpass=f=200", ss=1, dur=4, fo=1.2)
for k in range(4): hit(sfx, "cloth", w("S10", 2, "back") + k * 0.5, -18)
hit(sfx, "scribble", w("S10", 3, "toilet") - 0.2, -14, dur=1.2, fo=0.3)
for k in range(3): hit(sfx, "steps_dirt", w("S10", 3, "downstream") + k * 0.5, -18, ss=k * 0.4, dur=0.3, fo=0.08, af=CAVE)
hit(sfx, "scribble", w("S10", 4, "brush") - 0.1, -14, dur=1.6, fo=0.3, af="lowpass=f=3000")
hit(sfx, "splash_big", w("S10", 4, "bath") + 0.15, -9)
voice_echo("S03", 6, "aaah", w("S10", 4, "scream") - 0.3, -11, 0.9)
hit(sfx, "debris", w("S10", 5, "falls") - 0.1, -16, dur=1.4, fo=0.5)
hit(sfx, "impact", w("S10", 5, "falls") + 0.25, -7, af="lowpass=f=500")
hit(sfx, "splash_big", w("S10", 6, "friend") + 0.1, -18, dur=0.8, fo=0.3)
hit(sfx, "magic_shimmer", w("S10", 6, "an") - 0.1, -16, rate=1.4, fo=0.5)
hit(sfx, "magic_shimmer", st("S10", 7) + 0.2, -18, rate=1.6, fo=0.5)
# ================================================================== S11 home
cue(music, "Wholesome", 0, S["S11"]["start"] + 0.2, S["S11"]["end"] + 0.6, -13, 1.5, 2.0)
stamp(w("S11", 4, "last"))
hit(sfx, "scribble", st("S11", 1) + 0.2, -14, dur=4, fo=1.0, af="lowpass=f=2500")
hit(sfx, "thud_body", w("S11", 2, "stone") - 0.2, -10, af=LOW)
hit(sfx, "thud_body", w("S11", 2, "shelf") + 0.1, -14, af=LOW)
hit(sfx, "cloth", w("S11", 2, "roots") + 0.1, -10)
hit(sfx, "magic_shimmer", w("S11", 3, "stars") - 0.1, -12, fo=0.6)
for k in range(5): hit(sfx, "cloth", w("S11", 4, "weave") + k * 0.4, -20, rate=1.4, dur=0.3)
hit(sfx, "splash_big", w("S11", 4, "dinner"), -18, dur=0.8, fo=0.3)
for x in [w("S11", 5, "dropping") - 0.05, w("S11", 5, "hot"), w("S11", 5, "water") - 0.05]: hit(sfx, "steam", x + 0.1, -16, dur=0.8, fo=0.4)
t0 = w("S11", 5, "tap")
for i in range(int((en("S11", 5) + 0.8 - t0) / 0.42)):
    put_db(sfx, tone(NOTES[i % 7], 1.2, 3.5), t0 + i * 0.42, -12)
hit(sfx, "scribble", w("S11", 6, "marks") - 0.4, -18, dur=1.0, fo=0.3, af="highpass=f=900")
# ================================================================== S12 day 30
cue(music, "At Rest", 10, S["S12"]["start"] + 0.2, st("S12", 4) - 0.3, -17, 1.5, 1.0)
cue(music, "Eternal Hope", 20, st("S12", 4) - 0.6, DUR - 0.2, -13, 1.5, 3.5)
hit(sfx, "church_bell", w("S12", 0, "bell") - 0.1, -10, af="highpass=f=200,aecho=0.8:0.7:300|520:0.4|0.3", dur=5, fo=1.5)
hit(sfx, "rope_creak", st("S12", 1) - 0.6, -16, dur=1.4, fo=0.4)
hit(sfx, "flashlight", st("S12", 1) - 0.3, -8)
for k in range(4): hit(sfx, "steps_dirt", st("S12", 1) + 0.5 + k * 0.45, -26, ss=k * 0.4, dur=0.3, fo=0.08, af=CAVE)
hit(sfx, "thud_body", w("S12", 3, "million") + 0.2, -10, af=LOW)
hit(sfx, "magic_shimmer", w("S12", 4, "steve") - 0.1, -18, rate=1.6, fo=0.5)
# ================================================================== S13: the stalactite tune comes back
t0 = st("S13", 0) - 0.5
for i in range(int((DUR - 1.5 - t0) / 0.5)):
    put_db(sfx, tone(NOTES[i % 7], 1.4, 3.0), t0 + i * 0.5, -18)
hit(sfx, "rope_creak", st("S13", 0) - 0.6, -14, dur=2, fo=0.6)
