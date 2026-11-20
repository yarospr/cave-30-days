# Build YouTube subtitles (SRT) for FINAL_3D.mp4 from the 3D timeline: script text + per-word voice timings.
# usage: python -I -X utf8 make_srt.py <timeline.json> <out.srt>
import difflib, json, re, sys

tl, out = sys.argv[1], sys.argv[2]
d = json.load(open(tl, encoding="utf8"))
SKIP = set()
MAXC, MAXL, MAXDUR = 84, 42, 6.5

norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())

def timed_tokens(l):
    text = l["en"].replace("(gasp)", "[gasps]")
    toks = text.split()
    asr = [norm(w[0]) for w in l["words"]]
    nt = [norm(t) for t in toks]
    tm = [None] * len(toks)
    for a, b, n in difflib.SequenceMatcher(None, nt, asr, autojunk=False).get_matching_blocks():
        for k in range(n):
            tm[a + k] = (l["words"][b + k][1], l["words"][b + k][2])
    # fill gaps by character share between known neighbours
    i = 0
    while i < len(toks):
        if tm[i] is not None: i += 1; continue
        j = i
        while j < len(toks) and tm[j] is None: j += 1
        t0 = tm[i - 1][1] if i > 0 else l["start"]
        t1 = tm[j][0] if j < len(toks) else l["end"]
        if t1 < t0: t1 = t0
        w = [len(toks[k]) + 1 for k in range(i, j)]; tot = sum(w); acc = 0
        for k in range(i, j):
            s = t0 + (t1 - t0) * acc / tot; acc += w[k - i]
            tm[k] = (s, t0 + (t1 - t0) * acc / tot)
        i = j
    return list(zip(toks, tm))

def chunks(tt):
    out, cur = [], []
    for k, (tok, tm) in enumerate(tt):
        cur.append((tok, tm))
        txt = " ".join(t for t, _ in cur)
        nxt = tt[k + 1][0] if k + 1 < len(tt) else ""
        end_sent = re.search(r"[.!?…]$|\.\.\.$|—$", tok) is not None
        soft = tok.endswith(",") and len(txt) > 40
        long = len(txt) + 1 + len(nxt) > MAXC or (cur[-1][1][1] - cur[0][1][0]) > MAXDUR
        if end_sent and len(txt) > 14 or soft or long or not nxt:
            out.append(cur); cur = []
    if cur: out.append(cur)
    # glue a tiny tail onto the previous chunk when it fits
    res = []
    for c in out:
        if res and len(" ".join(t for t, _ in c)) < 12 and len(" ".join(t for t, _ in res[-1] + c)) <= MAXC and c[0][1][0] - res[-1][-1][1][1] < 0.6:
            res[-1] = res[-1] + c
        else:
            res.append(c)
    return res

def wrap(txt):
    if len(txt) <= MAXL: return txt
    words = txt.split(); best = None
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        sc = max(len(a), len(b))
        if best is None or sc < best[0]: best = (sc, a, b)
    return best[1] + "\n" + best[2]

cues = []
for l in d["lines"]:
    if (l["scene"], l["i"]) in SKIP: continue
    for c in chunks(timed_tokens(l)):
        cues.append([c[0][1][0], c[-1][1][1], " ".join(t for t, _ in c)])
cues.sort(key=lambda c: c[0])
for i, c in enumerate(cues):
    c[0] = max(0.0, c[0] - 0.08)
    nxt = cues[i + 1][0] - 0.08 if i + 1 < len(cues) else d["duration"]
    c[1] = min(max(c[1] + 0.35, c[0] + 1.0), nxt - 0.04)
    if c[1] <= c[0]: c[1] = c[0] + 0.5

ts = lambda x: "%02d:%02d:%02d,%03d" % (int(x // 3600), int(x % 3600 // 60), int(x % 60), round((x - int(x)) * 1000) % 1000)
with open(out, "w", encoding="utf8", newline="\n") as f:
    for i, (a, b, t) in enumerate(cues, 1):
        f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{wrap(t)}\n\n")
print(len(cues), "cues; last ends", round(cues[-1][1], 2), "s")
