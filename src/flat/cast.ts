// The film's cast: one flat cartoon family (toon.ts construction), medieval outfits plus one modern hero.
// One look per character for the whole film.
import type { Outfit } from "./toon";
import { INK } from "./toon";

export const CAST: Record<string, Outfit> = {
  /** you: grey hoodie (hood down), jeans, white sneakers (muddy from day 1), brown hair */
  you: { jacket: "#8e95a3", pants: "#3e5a8c", boots: "#f2efe8", hat: "hair", hair: "#5a3a26", hood: "#7d8493", buttons: "none" },
  /** Brother Aldric: brown habit with a rope belt, tonsure */
  aldric: { jacket: "#7a5434", pants: "#5a3d26", boots: "#4a3020", dress: "#7a5434", hat: "tonsure", hair: "#6b4a2e", hood: "#6c4a2e", skin: "#f5c9a0" },
  /** Maud: green dress, white coif, rolled sleeves */
  maud: { jacket: "#e8dcc4", pants: "#5a3d26", boots: "#4a3020", dress: "#4f8a4a", hat: "bonnet", cap: "#f4efe4", skin: "#f7c9a2", build: "stout" },
  /** Hamo the reeve: red cloak, balding red hair, red beard and moustache */
  reeve: { jacket: "#b03a2e", pants: "#4a3a30", boots: "#3a2618", hat: "hair", hair: "#c0632e", beard: "#c0632e", moustache: "#a04e22", buttons: "#e8c45a", build: "stout" },
  /** a villager: grey tunic, straw hat */
  villager: { jacket: "#8a8a78", pants: "#5a4a3a", boots: "#4a3020", hat: "straw", skin: "#ecc8a2", moustache: "#5a3a22" },
  /** the steward: blue */
  steward: { jacket: "#3a5a9a", pants: "#2e2e3a", boots: INK, hat: "hair", hair: "#2e2620", buttons: "#e8c45a" },
  /** guards: mail grey, an iron cap, a spear */
  guard: { jacket: "#7a7e88", pants: "#4a4a52", boots: INK, hat: "cap", cap: "#5a5e68", buttons: "none", belt: null, moustache: "#3a2a1e" },
  guard2: { jacket: "#727680", pants: "#4a4a52", boots: INK, hat: "cap", cap: "#4e525c", buttons: "none", beard: "#5a3a22" },
  /** the travelling merchant: purple coat, red cap, black beard */
  merchant: { jacket: "#5a3a7a", pants: "#3a2a3e", boots: "#2a1a14", hat: "cap", cap: "#a83a3a", beard: "#2a2220", buttons: "#e8c44a" },
  /** other monks */
  monk2: { jacket: "#6a4a30", pants: "#5a3d26", boots: "#4a3020", dress: "#6a4a30", hat: "tonsure", hair: "#9a9a92", hood: "#5c4028", skin: "#ecd0b6" },
  monk3: { jacket: "#7e5838", pants: "#5a3d26", boots: "#4a3020", dress: "#7e5838", hat: "tonsure", hair: "#2a2220", hood: "#6e4c30", skin: "#c99067" },
};
