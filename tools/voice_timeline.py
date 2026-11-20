"""Align voice files to script lines, cut each line, lay them on a timeline.
usage: python -I -X utf8 tools/voice_timeline.py   (run from cave/)
in : script/script.json, audio/voices/*.mp3, audio/tx/*.json (whisper word timestamps)
out: audio/voice.wav (48k mono), audio/timeline.json"""
import json, re, subprocess, difflib, os, wave
import numpy as np

SR = 48000
NARR_SPEED = float(os.environ.get("NARR_SPEED", "1.08"))
OUT = os.environ.get("VOICE_OUT", "audio")
os.makedirs(OUT, exist_ok=True)
S = json.load(open("script/script.json", encoding="utf-8"))
TXD = "audio/tx/"
def txfile(key):
    for p in os.listdir(TXD):
        if key in p:
            return TXD + p
    raise SystemExit("no transcript for " + key)
TX = {sp: txfile(sp + ".mp3") for sp in ["narrator_1", "narrator_2", "you", "stranger"]}
NUM = {"1962": "nineteen sixty two", "40000": "forty thousand", "100": "one hundred", "30": "thirty", "24": "twenty four",
       "18": "eighteen", "17": "seventeen", "16": "sixteen", "15": "fifteen", "14": "fourteen", "13": "thirteen",
       "12": "twelve", "10": "ten", "9": "nine", "2": "two", "1": "one", "3": "three", "4": "four", "5": "five"}
# loudness: every voice to the narrator's level (stranger came in ~6 dB quiet), then a peak limiter
GAIN_DB = {"narrator_1": 0.0, "narrator_2": 0.0, "you": 3.5, "stranger": 6.5}
# hard cuts: the hero is knocked out mid-sentence (S01 line 3): stop dead at this source second
CUT_AT = {("S01", 3): float(os.environ.get("CUT_S01", "5.30"))}

def norm(t):
    t = t.lower().replace("’", "'")
    t = t.replace(",000", "000")
    t = re.sub(r"\d+", lambda m: NUM.get(m.group(0), m.group(0)), t)
    ws = [w for w in re.sub(r"[^a-z' ]", " ", t).replace("'", "").split() if w]
    return [SYN.get(w, w) for w in ws]

# whisper mishearings / dialect spellings -> one form
SYN = {"huh": "ha", "sealing": "ceiling", "ah": "aaah", "aah": "aaah", "aaa": "aaah", "kilometres": "kilometers",
       "metre": "meter", "colours": "colors"}

def load_audio(path, gain_db=0.0):
    af = f"volume={gain_db}dB,alimiter=limit=0.89:level=false" if gain_db else "anull"
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-af", af, "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

def words_of(txpath, offset=0.0):
    r = json.load(open(txpath, encoding="utf-8"))
    out = []
    for s in r["segments"]:
        for w in s.get("words", []):
            for n in norm(w["word"]):
                out.append((n, w["start"] + offset, w["end"] + offset))
    return out

# ---- speaker audio + words (narrator = part1 + part2 joined) ----
spk_audio, spk_words = {}, {}
a1, a2 = load_audio("audio/voices/narrator_1.mp3"), load_audio("audio/voices/narrator_2.mp3")
gap = np.zeros(int(0.6 * SR), np.float32)
spk_audio["narrator"] = np.concatenate([a1, gap, a2])
spk_words["narrator"] = words_of(TX["narrator_1"]) + words_of(TX["narrator_2"], len(a1) / SR + 0.6)
for sp in ["you", "stranger"]:
    spk_audio[sp] = load_audio(f"audio/voices/{sp}.mp3", GAIN_DB[sp])
    spk_words[sp] = words_of(TX[sp])

# ---- per speaker: map script words -> heard words ----
lines = []
for sc in S["scenes"]:
    for i, l in enumerate(sc["lines"]):
        lines.append({"scene": sc["id"], "i": i, "sp": l["sp"], "en": l["en"], "hold": l.get("hold")})
for sp in spk_audio:
    mine = [L for L in lines if L["sp"] == sp]
    sw, owner = [], []
    for k, L in enumerate(mine):
        ws = norm(L["en"].replace("(gasp)", ""))
        sw += ws
        owner += [k] * len(ws)
    hw = [w for w, _, _ in spk_words[sp]]
    sm = difflib.SequenceMatcher(None, sw, hw, autojunk=False)
    hit = {}
    for a, b, n in sm.get_matching_blocks():
        for j in range(n):
            hit[a + j] = b + j
    for k, L in enumerate(mine):
        idx = [hit[x] for x in range(len(sw)) if owner[x] == k and x in hit]
        nw = owner.count(k)
        L["match"] = round(len(idx) / max(1, nw), 2)
        if idx:
            L["t0"], L["t1"] = spk_words[sp][min(idx)][1], spk_words[sp][max(idx)][2]
            L["words"] = [spk_words[sp][j] for j in sorted(set(idx))]
    for k, L in enumerate(mine):
        if "t0" not in L:
            prev = mine[k - 1]["t1"] if k else 0.0
            nxt = next((m["t0"] for m in mine[k + 1:] if "t0" in m), len(spk_audio[sp]) / SR)
            L["t0"], L["t1"], L["words"] = prev + 0.05, nxt - 0.05, []
    # cut points: quietest 20 ms window between consecutive lines
    au = spk_audio[sp]
    env = np.sqrt(np.convolve(au ** 2, np.ones(960) / 960, mode="same"))
    def quiet(a, b):
        a, b = int(a * SR), int(b * SR)
        if b - a < 480:
            return (a + b) / 2 / SR
        return (a + int(np.argmin(env[a:b]))) / SR
    for k, L in enumerate(mine):
        lo = mine[k - 1]["t1"] if k else 0.0
        hi = mine[k + 1]["t0"] if k + 1 < len(mine) else len(au) / SR
        L["c0"] = quiet(max(lo, L["t0"] - 0.6), L["t0"] - 0.02) if L["t0"] - lo > 0.06 else max(0.0, L["t0"] - 0.02)
        L["c1"] = quiet(L["t1"] + 0.06, min(hi, L["t1"] + 0.8)) if hi - L["t1"] > 0.12 else L["t1"] + 0.03
        if (L["scene"], L["i"]) in CUT_AT:
            L["c1"] = L["t1"] = CUT_AT[(L["scene"], L["i"])]
            L["cut"] = True

# ---- pauses (seconds before / after each scene) ----
# v2 (user: "boring, cut pauses"): tight scene pads, short gaps between lines, holds halved
# S01 ends on the hit: 1.6 s of black before the cave wakes up
PAD = {"S01": [0.3, 1.6], "S02": [0.6, 0.2], "S03": [0.5, 0.2], "S04": [0.6, 0.3], "S05": [0.4, 0.2], "S06": [0.4, 0.2],
       "S07": [0.4, 0.2], "S08": [0.5, 0.3], "S09": [0.5, 0.3], "S10": [0.5, 0.2], "S11": [0.6, 0.3], "S12": [0.6, 0.6],
       "S13": [0.5, 2.5]}
HOLD_K = 0.5

def fade(x, out_ms=8):
    n = min(len(x) // 4, int(0.008 * SR))
    if n > 0:
        r = np.linspace(0, 1, n, dtype=np.float32)
        x[:n] *= r
        x[-n:] *= r[::-1]
    return x

def atempo(x, k):
    p = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-af", f"atempo={k}", "-f", "f32le", "-"],
                       input=x.tobytes(), capture_output=True).stdout
    return np.frombuffer(p, dtype=np.float32).copy()

out, t, scenes = [], 0.0, []
for sc in S["scenes"]:
    pre, post = PAD[sc["id"]]
    s0 = t
    t += pre
    mine = [L for L in lines if L["scene"] == sc["id"]]
    for n, L in enumerate(mine):
        seg = spk_audio[L["sp"]][int(L["c0"] * SR): int(L["c1"] * SR)].copy()
        k = NARR_SPEED if L["sp"] == "narrator" else 1.0
        if k != 1.0:
            seg = atempo(seg, k)
        seg = fade(seg)
        L["start"] = round(t + (L["t0"] - L["c0"]) / k, 3)
        L["end"] = round(t + (L["t1"] - L["c0"]) / k, 3)
        L["words"] = [(w, round(t + (a - L["c0"]) / k, 3), round(t + (b - L["c0"]) / k, 3)) for w, a, b in L["words"]]
        out.append((t, seg))
        t += len(seg) / SR
        nxt = mine[n + 1] if n + 1 < len(mine) else None
        if L["hold"]:
            t += L["hold"] * HOLD_K
        elif nxt is not None:
            t += 0.06 if nxt["sp"] != L["sp"] else 0.1
    t += post
    scenes.append({"id": sc["id"], "start": round(s0, 3), "end": round(t, 3)})
total = t + 0.5
buf = np.zeros(int(total * SR) + SR, np.float32)
for st, seg in out:
    a = int(st * SR)
    buf[a:a + len(seg)] += seg
buf = buf[: int(total * SR)]
with wave.open(f"{OUT}/voice.wav", "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
for L in lines:
    for k in ("c0", "c1", "t0", "t1"):
        L.pop(k, None)
json.dump({"duration": round(total, 3), "scenes": scenes, "lines": lines}, open(f"{OUT}/timeline.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"total {total:.1f}s = {int(total // 60)}:{total % 60:04.1f}")
for L in lines:
    flag = "" if L["match"] >= 0.8 else "  <<< LOW"
    print(f"{L['scene']} {L['sp'][:4]:4} {L['start']:7.2f}-{L['end']:7.2f} m={L['match']:.2f} {L['en'][:70]}{flag}")
for s in scenes:
    print(s["id"], s["start"], s["end"])
