// Cave light, one mood per stage of the arc (the light IS the story):
//  street  night street, sodium lamp (S01)
//  void    total darkness: the world reads only as pale blue "echo" ink on black (days 1–2)
//  fox     foxfire: dim green mushroom glow from below (days 3–9)
//  fire    flint fire / fish-oil lamp: warm orange key, cool rim (days 10–18)
//  home    the decorated den: warm lamps + teal mushroom "stars" fill (days 18–30)
// Everything far fades to black (fog), never to a colour: a cave has no horizon.
import { mk, MOODS } from "../inkbeat/core/moods";
import type { MoodPreset } from "../inkbeat/core/moods";

const noSky = (c: string) => ({ ...MOODS.lamp.sky, top: c, mid: c, bottom: c, stars: 0, clouds: 0 });

export const CAVE: Record<string, MoodPreset> = {
  street: mk({
    note: "night street, sodium lamp", hemi: ["#4a5ac8", "#1a1428", 0.7], key: ["#ffb060", 3.6, [0.4, 0.8, 0.3]], rim: ["#9ab0ff", 2.2, [-0.6, 0.45, -0.7]],
    fill: ["#6a70d0", 0.4, [-0.7, 0.3, 0.5]], prac: ["#ffa040", 8, "#ffd080"], fog: ["#1a2050", 0.012],
    sky: { ...MOODS.night.sky, stars: 0.4 },
    toon: { shadowTint: [0.82, 0.84, 1.2], hiTint: [1.12, 1.0, 0.86], rimColor: "#b8c4ff" },
    grade: { exposure: 0.82, contrast: 1.16, saturation: 1.12, shadowTint: "#2a2a8a", highlightTint: "#ffd8a0", gain: "#fff2e4" }, bloomTint: "#ffb060", ink: "#0e0a1a",
    camFill: ["#c8d0ff", 0.3], cast: { rim: ["#ffb060", 2.0], fill: ["#c0c8ff", 0.6] },
  }),
  void: mk({
    note: "total darkness, echo ink", hemi: ["#2a3a6a", "#04050a", 0.5], key: ["#5a74c8", 0.6, [0.3, 0.9, 0.4]], rim: ["#7a9aff", 0.8, [-0.6, 0.4, -0.7]],
    fill: ["#3a4a8a", 0.2, [0.7, 0.3, 0.5]], prac: ["#8ab0ff", 2, "#c8dcff"], fog: ["#020309", 0.09],
    sky: noSky("#010103"),
    toon: { shadowTint: [0.7, 0.75, 1.1], hiTint: [0.9, 0.95, 1.1], rimColor: "#8ab0ff" },
    grade: { exposure: 0.42, contrast: 1.25, saturation: 0.7, shadowTint: "#05081a", highlightTint: "#b8ccff", gain: "#d8e4ff" }, bloomTint: "#8ab0ff", ink: "#7fa8ff",
    camFill: ["#8aa0e0", 0.15], cast: { rim: ["#8ab0ff", 0.8], fill: ["#5a6aa0", 0.2] },
  }),
  fox: mk({
    note: "foxfire glow", hemi: ["#2a6a58", "#040c0a", 0.55], key: ["#6affc0", 1.7, [0.2, 0.35, 0.7]], rim: ["#38e8b0", 1.3, [-0.6, 0.3, -0.7]],
    fill: ["#3a5aa0", 0.25, [0.7, 0.3, 0.5]], prac: ["#5affb8", 4, "#c0ffe0"], fog: ["#020a08", 0.075],
    sky: noSky("#010302"),
    toon: { shadowTint: [0.72, 0.95, 1.05], hiTint: [0.9, 1.12, 1.0], rimColor: "#70ffd0" },
    grade: { exposure: 0.7, contrast: 1.2, saturation: 1.1, shadowTint: "#06302e", highlightTint: "#c8ffe4", gain: "#e8fff4" }, bloomTint: "#6affc0", ink: "#04140f",
    camFill: ["#a0ffd8", 0.18], cast: { rim: ["#6affc0", 1.4], fill: ["#5a7ab0", 0.3] },
  }),
  fire: mk({
    note: "flint fire / oil lamp", hemi: ["#6a4a6a", "#120808", 0.5], key: ["#ff9a48", 4.0, [0.5, 0.35, 0.55]], rim: ["#6a80ff", 1.3, [-0.6, 0.4, -0.7]],
    fill: ["#5a50a0", 0.3, [-0.8, 0.3, 0.4]], prac: ["#ff9040", 8, "#ffd080"], fog: ["#0c0606", 0.06],
    sky: noSky("#020101"),
    toon: { shadowTint: [0.9, 0.74, 1.08], hiTint: [1.16, 0.98, 0.8], rimColor: "#a0b0ff" },
    grade: { exposure: 0.92, contrast: 1.2, saturation: 1.15, shadowTint: "#3a1440", highlightTint: "#ffd0a0", gain: "#fff0e0" }, bloomTint: "#ff9a48", ink: "#1a0806",
    camFill: ["#ffd8b8", 0.22], cast: { rim: ["#ffa050", 1.8], fill: ["#a0a8ff", 0.4] },
  }),
  home: mk({
    note: "the den: lamps + mushroom stars", hemi: ["#6a6ab0", "#1a1020", 0.65], key: ["#ffb060", 3.8, [0.45, 0.45, 0.55]], rim: ["#50e8c0", 1.5, [-0.6, 0.5, -0.7]],
    fill: ["#6a70d0", 0.35, [-0.8, 0.3, 0.4]], prac: ["#ffa850", 8, "#ffe0a0"], fog: ["#0e0a12", 0.035],
    sky: noSky("#030205"),
    toon: { shadowTint: [0.88, 0.8, 1.12], hiTint: [1.14, 1.0, 0.84], rimColor: "#80ffe0" },
    grade: { exposure: 1.0, contrast: 1.16, saturation: 1.16, shadowTint: "#2a1a5a", highlightTint: "#ffdcac", gain: "#fff4e6" }, bloomTint: "#ffb868", ink: "#140a10",
    camFill: ["#ffe4c8", 0.25], cast: { rim: ["#ffb060", 1.8], fill: ["#a0f0e0", 0.4] },
  }),
};
CAVE.void.post.outline = { ...CAVE.void.post.outline, widthPx: 2.6 };
Object.assign(MOODS, CAVE);

/** card tint per mood (flat characters are unlit: the tint is the scene light on them) */
export const CTINT: Record<string, string> = { street: "#d8d4f0", void: "#7484ac", fox: "#a8f0d0", fire: "#ffd0a0", home: "#ffe6cc", night: "#a8b4e8" };
