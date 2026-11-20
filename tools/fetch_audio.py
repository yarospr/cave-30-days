"""Download ready-made music (Kevin MacLeod, incompetech.com, CC BY 4.0) and sound effects (Freesound, CC0 only).
usage: python -I tools/fetch_audio.py   (run from medieval/). Files already present are skipped.
Writes audio/lib/music, audio/lib/sfx and audio/lib/credits.json (for the video description)."""
import json, os, re, time, html, urllib.parse, urllib.request

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
# medieval / folk / comic / tense, all CC BY 4.0 from incompetech; a missing title just fails and is skipped
MUS = ["Achaidh Cheide", "Teller of the Tales", "Folk Round", "Master of the Feast", "Pippin the Hunchback", "Minstrel Guild",
       "Thatched Villagers", "Suonatore di Liuto", "Angevin B", "Celtic Impulse", "Village Consort", "Moonlight Hall",
       "Lord of the Land", "Sneaky Snitch", "Scheming Weasel faster", "Investigations", "Unholy Knight", "Gathering Darkness",
       "Darkest Child", "Oppressive Gloom", "Hitman", "Curiosity", "Mystery Bazaar", "Long Road Ahead B", "Dark Times",
       "Volatile Reaction", "Exhilarate", "Heroic Age", "Wholesome", "Carefree", "Spellbound", "Ossuary 6 - Air"]
# slot: (query, min seconds, max seconds)
SFX = {
    "pig_grunt": ("pig grunt oink", 1, 30), "pig_squeal": ("pig squeal", 0.5, 10), "chickens": ("chickens clucking farm", 5, 120),
    "mud_squelch": ("mud squelch footstep", 0.5, 20), "steps_mud": ("footsteps mud walking", 3, 60), "steps_dirt": ("footsteps dirt gravel walking", 3, 60),
    "village": ("medieval village ambience", 20, 400), "market": ("medieval market crowd ambience", 20, 400), "birds_morning": ("morning birds countryside", 20, 300),
    "crows": ("crows cawing", 3, 60), "church_bell": ("church bell ringing", 3, 60), "bell_toll": ("bell toll single", 2, 20),
    "tavern": ("tavern ambience medieval", 20, 400), "dice": ("dice roll wooden table", 0.5, 8), "coins": ("coins drop table", 0.5, 6),
    "mug_clink": ("beer mugs clink cheers", 0.5, 8), "camera_shutter": ("camera shutter click", 0.2, 3), "button_click": ("phone button click", 0.1, 2),
    "flashlight": ("flashlight click switch", 0.1, 2), "low_battery": ("low battery beep", 0.3, 4), "phone_off": ("phone power off shutdown", 0.3, 4),
    "crowd_gasp": ("crowd gasp", 0.5, 6), "mob_angry": ("angry mob shouting", 4, 60), "crowd_cheer": ("crowd cheer", 2, 20), "crowd_village": ("crowd murmur outdoor", 10, 200),
    "tools_clank": ("farm tools metal clank", 0.5, 10), "barrel_roll": ("wooden barrel rolling", 1, 15), "barrel_drop": ("wooden barrel drop thud", 0.3, 5),
    "door_wood": ("old wooden door open creak", 1, 10), "iron_gate": ("iron prison door slam", 1, 10), "chains": ("chains rattle", 1, 15), "keys": ("keys jingle", 0.5, 6),
    "rope_creak": ("rope creak tension", 1, 20), "drumroll": ("snare drum roll", 2, 20), "war_drum": ("slow drum beat ominous", 3, 40),
    "fire_crackle": ("fire crackling torch", 5, 120), "candle": ("candle flame blow", 0.3, 5), "quill": ("quill pen writing paper", 2, 30),
    "page_turn": ("book page turn", 0.3, 4), "book_close": ("heavy book close", 0.3, 4), "stomach": ("stomach growl", 0.5, 8), "flies": ("flies buzzing", 3, 40),
    "river": ("river stream water flowing", 10, 200), "staff_knock": ("wooden staff knock floor", 0.2, 4), "gasp_male": ("man gasp surprised", 0.3, 3),
    "magic_shimmer": ("magic shimmer whoosh", 1, 8), "time_warp": ("time warp whoosh reverse", 1, 8), "swoosh": ("swoosh transition", 0.3, 2),
    "hit_comic": ("cartoon bonk", 0.2, 2), "scribble": ("pencil scribble", 0.5, 6), "cloth": ("clothing rustle movement", 0.5, 6),
    "horse": ("horse neigh", 1, 8), "cow": ("cow moo", 1, 8), "hammer_smith": ("blacksmith hammer anvil", 2, 30), "spit_roast": ("cooking stew bubbling", 5, 60),
    "scanner": ("scanner machine scanning", 2, 20), "room_tone": ("room tone fluorescent hum", 10, 200), "clock_tick": ("clock ticking", 5, 60),
    "punch_whoosh": ("fast whoosh", 0.2, 2), "thud_body": ("body fall thud", 0.3, 3), "gulp": ("drinking gulp", 0.5, 5), "burp": ("burp", 0.3, 3),
}
os.makedirs("audio/lib/music", exist_ok=True); os.makedirs("audio/lib/sfx", exist_ok=True)
cred_path = "audio/lib/credits.json"
cred = json.load(open(cred_path, encoding="utf-8")) if os.path.exists(cred_path) else {"music": {}, "sfx": {}}
def get(url, timeout=120):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout).read()
for n in MUS:
    p = f"audio/lib/music/{n}.mp3"
    try:
        if not os.path.exists(p):
            data = get("https://incompetech.com/music/royalty-free/mp3-royaltyfree/" + urllib.parse.quote(n) + ".mp3", 300)
            if len(data) < 50000: raise ValueError("too small")
            open(p, "wb").write(data)
        cred["music"][n] = {"author": "Kevin MacLeod (incompetech.com)", "license": "CC BY 4.0"}
        print("music", n, os.path.getsize(p) // 1024, "KB", flush=True)
    except Exception as e:
        print("FAIL music", n, e, flush=True)
FILTER = urllib.parse.quote('license:"Creative Commons 0"')
for slot, (q, lo, hi) in SFX.items():
    p = f"audio/lib/sfx/{slot}.mp3"
    if os.path.exists(p) and slot in cred["sfx"]:
        continue
    try:
        page = get(f"https://freesound.org/search/?q={urllib.parse.quote_plus(q)}&f={FILTER}&s={urllib.parse.quote_plus('Downloads (most first)')}", 60).decode("utf-8", "ignore")
        hits = re.findall(r'data-sound-id="(\d+)"\s+data-username="([^"]*)".*?data-mp3="([^"]+)".*?data-title="([^"]*)"\s+data-duration="([\d.]+)".*?data-num-downloads="(\d+)"', page, re.S)
        ok = [h for h in hits if lo <= float(h[4]) <= hi]
        if not ok:
            print("NONE", slot, len(hits), flush=True); continue
        h = max(ok, key=lambda x: int(x[5]))
        open(p, "wb").write(get(h[2].replace("-lq.mp3", "-hq.mp3")))
        cred["sfx"][slot] = {"id": h[0], "by": html.unescape(h[1]), "title": html.unescape(h[3]), "dur": float(h[4]), "license": "CC0", "url": f"https://freesound.org/s/{h[0]}/"}
        print(f"{slot:14} {float(h[4]):6.1f}s  {html.unescape(h[3])[:60]}  ({h[5]} dl)", flush=True)
    except Exception as e:
        print("FAIL", slot, e, flush=True)
    json.dump(cred, open(cred_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    time.sleep(0.7)
json.dump(cred, open(cred_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
