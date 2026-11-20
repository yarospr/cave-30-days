// Extra flat cards in the cast's style: the pig, and a seeded crowd of villagers. Same pen, same plum ink.
import React from "react";
import * as THREE from "three";
import type { V3 } from "../inkbeat/types";
import { INK, Pen, mul, shade } from "./toon";
import type { Outfit } from "./toon";

type P2 = [number, number];
const ellPts = (cx: number, cy: number, rx: number, ry: number, n = 48): P2[] => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos((i / n) * Math.PI * 2), cy + ry * Math.sin((i / n) * Math.PI * 2)] as P2);

/** a pig in side view facing screen-right, 800 x 500 units, feet at y = 480. sniff 0..1 lifts the snout */
export const drawPig = (p: Pen, sniff = 0, blink = false) => {
  const pink = "#f2a7b4", dark = mul(pink, [0.82, 0.72, 0.78]);
  for (const [x, far] of [[250, true], [330, false], [520, true], [600, false]] as [number, boolean][]) {
    p.stroke([[x, 330], [x + 4, 470]], 26, far ? dark : pink);
    p.stroke([[x - 6, 474], [x + 16, 474]], 14, INK);
  }
  const body = ellPts(420, 290, 250, 150);
  p.poly(body, pink, 12);
  p.ell(220, 240, 30, 22, null, 6, 120, 300); // curly tail
  const hx = 640, hy = 230 - 20 * sniff;
  p.poly(ellPts(hx, hy, 105, 95), pink, 12);
  p.poly([[hx - 40, hy - 70], [hx - 5, hy - 140], [hx + 25, hy - 70]], dark, 10); // ear
  p.poly(ellPts(hx + 95, hy + 18, 34, 42), shade(pink, 0.92), 10); // snout
  p.dot(hx + 88, hy + 8, 6); p.dot(hx + 104, hy + 26, 6);
  if (blink) p.stroke([[hx + 12, hy - 16], [hx + 36, hy - 16]], 7);
  else p.ell(hx + 24, hy - 18, 8, 12, INK, 0);
};

const blobTex = (() => {
  let t: THREE.CanvasTexture | null = null;
  return () => {
    if (t) return t;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, "rgba(30,18,40,0.5)"); gr.addColorStop(1, "rgba(30,18,40,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    t = new THREE.CanvasTexture(c);
    return t;
  };
})();
const cache = new Map<string, THREE.CanvasTexture>();
/** any flat card: cw x ch design units drawn by `draw`, feet at `sole`, `mpu` metres per unit, yaw toward the camera */
export const FlatThing: React.FC<{ id: string; cw: number; ch: number; sole: number; mpu: number; draw: (p: Pen) => void; p: V3; cam: V3; dir?: 1 | -1; tint?: string; res?: number; noBlob?: boolean; roll?: number }> = ({ id, cw, ch, sole, mpu, draw, p, cam, dir = 1, tint = "#ffffff", res = 1, noBlob = false, roll = 0 }) => {
  const key = `${id}|${res}`;
  let tex = cache.get(key);
  if (!tex) {
    if (cache.size > 160) { for (const v of cache.values()) v.dispose(); cache.clear(); }
    const c = document.createElement("canvas"); c.width = Math.round(cw * res); c.height = Math.round(ch * res);
    const g = c.getContext("2d")!; g.setTransform(res, 0, 0, res, 0, 0); draw(new Pen(g));
    tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    cache.set(key, tex);
  }
  const geo = React.useMemo(() => new THREE.PlaneGeometry(cw * mpu, ch * mpu), [cw, ch, mpu]);
  const mat = React.useMemo(() => new THREE.MeshBasicMaterial({ alphaTest: 0.5, side: THREE.DoubleSide }), []);
  const depth = React.useMemo(() => new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaTest: 0.5, side: THREE.DoubleSide }), []);
  const occ = React.useMemo(() => new THREE.ShaderMaterial({
    uniforms: { map: { value: null as THREE.Texture | null } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform sampler2D map; varying vec2 vUv; void main(){ if (texture2D(map, vUv).a < 0.5) discard; gl_FragColor = vec4(0.5, 0.5, 1.0, 130.0 / 255.0); }",
    side: THREE.DoubleSide, transparent: true, blending: THREE.NoBlending,
  }), []);
  const bmat = React.useMemo(() => new THREE.MeshBasicMaterial({ map: blobTex(), transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), []);
  mat.map = tex; mat.color.set(tint); mat.needsUpdate = true; depth.map = tex; occ.uniforms.map.value = tex;
  const yaw = Math.atan2(cam[0] - p[0], cam[2] - p[2]);
  return (
    <group position={p}>
      <group rotation={[0, yaw, 0]}><group rotation={[0, 0, roll]}><mesh geometry={geo} material={mat} customDepthMaterial={depth} castShadow={!noBlob} position={[0, (sole - ch / 2) * mpu, 0]} scale={[dir, 1, 1]} userData={{ occluder: occ }} /></group></group>
      {noBlob ? null : <mesh geometry={blobGeo} material={bmat} position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[cw * mpu * 0.8, cw * mpu * 0.3, 1]} userData={{ outline: false }} />}
    </group>
  );
};
const blobGeo = new THREE.PlaneGeometry(1, 1);

/** the pig: 1.1 m long */
export const Pig: React.FC<{ p: V3; cam: V3; dir?: 1 | -1; sniff?: number; blink?: boolean; tint?: string }> = ({ p, cam, dir = 1, sniff = 0, blink = false, tint }) => (
  <FlatThing id={`pig|${sniff.toFixed(2)}|${blink}`} cw={800} ch={500} sole={480} mpu={0.00135} draw={(pen) => drawPig(pen, sniff, blink)} p={p} cam={cam} dir={dir} tint={tint} res={1.4} />
);

// ------------------------------------------------------------------ crowd
const JACKETS = ["#8a7a5a", "#6a7a5a", "#9a6a4a", "#7a6a8a", "#5a6a7a", "#a08a5a", "#8a5a4a", "#6a5a4a"];
const DRESSES = ["#7a5a8a", "#a05a4a", "#5a7a9a", "#8a8a4a", "#6a8a6a"];
const HAIRS = ["#3a2a1e", "#6a4a2a", "#8a6a3a", "#2a2220", "#b08a5a", "#9a9a92"];
const SKINS = ["#ffe2c2", "#f5c9a0", "#ecd0b6", "#c99067", "#e8b88a"];
/** a seeded villager: men in tunics with straw hats / hair / hoods, women in dresses with coifs */
export const villagerOutfit = (i: number): Outfit => {
  const r = (k: number) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1 + 1) % 1;
  const skin = SKINS[Math.floor(r(1) * SKINS.length)];
  if (r(2) < 0.38) return { jacket: "#e8dcc4", pants: "#5a3d26", boots: "#4a3020", dress: DRESSES[Math.floor(r(3) * DRESSES.length)], hat: "bonnet", cap: r(4) < 0.5 ? "#f4efe4" : "#d8c8a8", skin, buttons: "none" };
  const hat = r(5) < 0.3 ? "straw" : "hair";
  return {
    jacket: JACKETS[Math.floor(r(6) * JACKETS.length)], pants: "#4a3a2e", boots: "#3a2618", hat, hair: HAIRS[Math.floor(r(7) * HAIRS.length)], skin,
    beard: r(8) < 0.3 ? HAIRS[Math.floor(r(9) * HAIRS.length)] : undefined, moustache: r(10) < 0.25 ? "#4a3426" : undefined,
    hood: r(11) < 0.25 ? JACKETS[Math.floor(r(12) * JACKETS.length)] : undefined, buttons: r(13) < 0.5 ? "none" : undefined, build: r(14) < 0.2 ? "stout" : "adult",
  };
};

// ------------------------------------------------------------------ the phone held in the hands (close-up card)
/** 700 x 900 units: two hoodie sleeves from the bottom, dot hands gripping a phone, its live screen drawn in.
 *  thumb 0..1 = the right thumb pressing the side button; tied = rope around the wrists */
export const drawPhoneHeld = (p: Pen, screen: HTMLCanvasElement | null, o: { thumb?: number; tied?: boolean; sleeve?: string; lift?: number }) => {
  const sleeve = o.sleeve ?? "#8e95a3", INKC = INK;
  const cx = 350, top = 140 - (o.lift ?? 0) * 60, w = 300, h = 600;
  // sleeves (thick strokes from the bottom corners to the wrists)
  for (const s of [-1, 1]) {
    p.stroke([[cx + s * 330, 900], [cx + s * 230, 760], [cx + s * 175, top + h * 0.72]], 74, INKC);
    p.stroke([[cx + s * 330, 900], [cx + s * 230, 760], [cx + s * 175, top + h * 0.72]], 58, sleeve);
  }
  // phone body + screen
  const x0 = cx - w / 2, y0 = top;
  p.poly([[x0, y0 + 30], [x0 + 30, y0], [x0 + w - 30, y0], [x0 + w, y0 + 30], [x0 + w, y0 + h - 30], [x0 + w - 30, y0 + h], [x0 + 30, y0 + h], [x0, y0 + h - 30]], "#1d1b24", 12);
  if (screen) p.g.drawImage(screen, x0 + 18, y0 + 18, w - 36, h - 36);
  p.stroke([[x0 + w + 6, y0 + 150], [x0 + w + 6, y0 + 220]], 12, "#3a3842"); // side button
  // hands: big ink dots gripping both sides, fingers as small dots on the back edge
  for (const s of [-1, 1]) {
    const hx = cx + s * (w / 2 + 6), hy = top + h * 0.66;
    p.dot(hx, hy, 50);
    for (let k = 0; k < 3; k++) p.dot(hx - s * 6, hy - 70 - k * 44, 18);
  }
  const th = o.thumb ?? 0;
  p.dot(cx + w / 2 + 14 - th * 10, top + 185 + (1 - th) * 70, 24); // right thumb on the button
  if (o.tied) for (const s of [-1, 1]) {
    const y = top + h * 0.82;
    p.band([[cx + s * 120, y - 14], [cx + s * 240, y + 10]], "#c9a46a", 26, 6);
    p.band([[cx + s * 120, y + 14], [cx + s * 240, y + 38]], "#c9a46a", 26, 6);
  }
};
export const PhoneHeld: React.FC<{ id: string; screen: HTMLCanvasElement | null; p: V3; cam: V3; s?: number; thumb?: number; tied?: boolean; tint?: string }> = ({ id, screen, p, cam, s = 1, thumb = 0, tied = false, tint }) => (
  <FlatThing id={`held|${id}|${thumb.toFixed(1)}|${tied}`} cw={700} ch={900} sole={900} mpu={0.00042 * s} draw={(pen) => drawPhoneHeld(pen, screen, { thumb, tied })} p={p} cam={cam} tint={tint} res={1.6} noBlob />
);

// ------------------------------------------------------------------ birds
/** a crow in side view (300 x 240, feet at 230); peck 0..1 dips the head */
export const drawCrow = (p: Pen, peck = 0, wing = 0) => {
  const dk = "#2a2630";
  p.stroke([[120, 180], [116, 228]], 6, INK); p.stroke([[150, 180], [154, 228]], 6, INK);
  p.poly([[60, 150], [120, 110], [200, 115], [235, 140], [200, 185], [110, 190], [40, 175]], dk, 9);
  p.poly([[70, 140], [150, 120 - wing * 70], [190, 135]], "#3a3442", 7);
  const hx = 225 + peck * 20, hy = 110 + peck * 50;
  p.ell(hx, hy, 32, 28, dk, 9);
  p.poly([[hx + 26, hy - 6], [hx + 66, hy + 4], [hx + 26, hy + 12]], "#c8a040", 6);
  p.dot(hx + 8, hy - 6, 5, "#f4ead6");
};
export const Crow: React.FC<{ p: V3; cam: V3; dir?: 1 | -1; peck?: number; wing?: number; tint?: string }> = ({ p, cam, dir = 1, peck = 0, wing = 0, tint }) => (
  <FlatThing id={`crow|${peck.toFixed(1)}|${wing.toFixed(1)}`} cw={300} ch={240} sole={230} mpu={0.0013} draw={(pen) => drawCrow(pen, peck, wing)} p={p} cam={cam} dir={dir} tint={tint} res={1.2} noBlob />
);
/** a flying bird far away: a V that flaps */
export const Bird: React.FC<{ p: V3; cam: V3; flap: number; s?: number }> = ({ p, cam, flap, s = 1 }) => (
  <FlatThing id={`bird|${flap.toFixed(1)}`} cw={200} ch={100} sole={60} mpu={0.004 * s} draw={(pen) => pen.stroke([[10, 50 - flap * 40], [100, 60], [190, 50 - flap * 40]], 14, "#2a2630")} p={p} cam={cam} res={1} noBlob />
);

/** a depth-only stand-in for the normal pass: hides the world ink behind an alpha-tested card and gives DOF its
 *  distance, without inking the card itself (see pipeline.ts `occluder`, shaders.ts card alpha 130/255) */
export const occluderMat = (tex: THREE.Texture) => {
  const m = new THREE.ShaderMaterial({
    uniforms: { map: { value: tex } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform sampler2D map; varying vec2 vUv; void main(){ if (texture2D(map, vUv).a < 0.5) discard; gl_FragColor = vec4(0.5, 0.5, 1.0, 130.0 / 255.0); }",
    side: THREE.DoubleSide, transparent: true, blending: THREE.NoBlending,
  });
  return m;
};
