// The cave cast: the same hero as the medieval film (grey hoodie), the hooded stranger (face never seen).
import type { Outfit } from "../flat/toon";
import { INK } from "../flat/toon";

export const CAST: Record<string, Outfit> = {
  /** you: grey hoodie (hood down), jeans, white sneakers, brown hair (same as the medieval film) */
  you: { jacket: "#8e95a3", pants: "#3e5a8c", boots: "#f2efe8", hat: "hair", hair: "#5a3a26", hood: "#7d8493", buttons: "none" },
  /** you without the hoodie (it is the fishing net / drying): a white T-shirt */
  youTee: { jacket: "#e6e2da", pants: "#3e5a8c", boots: "#f2efe8", hat: "hair", hair: "#5a3a26", buttons: "none" },
  /** later days: the hoodie dirty, sleeves smeared with clay */
  youDirty: { jacket: "#7e8290", pants: "#38507a", boots: "#cfc6b4", hat: "hair", hair: "#4e3222", hood: "#6e7280", buttons: "none" },
  /** the stranger: a long charcoal coat, the hood up, no face */
  stranger: { jacket: "#2a2a36", pants: "#1c1c24", boots: INK, hoodUp: "#30303e", buttons: "none", build: "adult" },
};
