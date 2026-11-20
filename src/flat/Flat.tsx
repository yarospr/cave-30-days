// Flat 2D cartoon characters (src/flat/toon.ts drawings) standing in the inkbeat 3D world.
// Each character is a yaw-only billboard card: the drawing carries its own thick-thin plum ink, so the card is
// hidden from the world ink pass (userData.outline = false). It casts a real shadow (alpha-tested depth) and gets
// a soft contact blob under the feet. The canvas is a pure function of the drawing options: a deterministic key,
// redrawn only when the key changes (no per-tab state).
import React from "react";
import * as THREE from "three";
import type { V3 } from "../inkbeat/types";
import { bodyFront, bodySide, Pen } from "./toon";
import type { FrontOpts, Outfit, SideOpts } from "./toon";

/** metres per design unit: the 600 x 1000 card is 1.30 x 2.16 m, soles at y = 975 */
export const SU = 0.00216;
const CW = 600, CH = 1000, SOLE = 975;

type Drawn = { tex: THREE.CanvasTexture; key: string };
const cache = new Map<string, Drawn>();
const draw = (key: string, k: number, fn: (p: Pen) => void): THREE.CanvasTexture => {
  const hit = cache.get(key);
  if (hit) return hit.tex;
  if (cache.size > 260) { for (const v of cache.values()) v.tex.dispose(); cache.clear(); }
  const cv = document.createElement("canvas");
  cv.width = Math.round(CW * k); cv.height = Math.round(CH * k);
  const g = cv.getContext("2d")!;
  g.setTransform(k, 0, 0, k, 0, 0);
  fn(new Pen(g));
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  cache.set(key, { tex, key });
  return tex;
};

const blobTex = (() => {
  let t: THREE.CanvasTexture | null = null;
  return () => {
    if (t) return t;
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    gr.addColorStop(0, "rgba(30,18,40,0.55)"); gr.addColorStop(0.6, "rgba(30,18,40,0.25)"); gr.addColorStop(1, "rgba(30,18,40,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    t = new THREE.CanvasTexture(c);
    return t;
  };
})();

const planeG = new THREE.PlaneGeometry(CW * SU, CH * SU);
const blobG = new THREE.PlaneGeometry(1, 1);

export type FlatProps = {
  o: Outfit;
  /** feet on the ground */
  p: V3;
  /** camera position: the card turns (yaw only) to face it */
  cam: V3;
  view?: "front" | "side";
  /** side view faces screen-right; -1 mirrors it to face screen-left */
  dir?: 1 | -1;
  front?: FrontOpts;
  side?: SideOpts;
  /** size multiplier (1 = adult ~1.7 m) */
  s?: number;
  /** canvas resolution multiplier (close-ups: 1.6–2) */
  res?: number;
  /** colour the card is multiplied by (scene light on the character) */
  tint?: string;
  shadow?: boolean;
  blob?: boolean;
  /** lying flat on the ground, face up; the value is the roll (rad) */
  lie?: number;
  /** animation: lift off the ground (m), squash/stretch (1 = none; volume kept), roll about the feet in the card plane (rad) */
  dy?: number; sy?: number; roll?: number;
};

export const Flat: React.FC<FlatProps> = ({ o, p, cam, view = "front", dir = 1, front = {}, side = {}, s = 1, res = 1.2, tint = "#ffffff", shadow = true, blob = true, lie, dy = 0, sy = 1, roll = 0 }) => {
  const key = JSON.stringify([o, view, view === "front" ? front : side, res]);
  const tex = draw(key, res, (pen) => (view === "front" ? bodyFront(pen, o, front) : bodySide(pen, o, side)));
  const mat = React.useMemo(() => new THREE.MeshBasicMaterial({ transparent: false, alphaTest: 0.5, side: THREE.DoubleSide, toneMapped: true }), []);
  const depth = React.useMemo(() => new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaTest: 0.5, side: THREE.DoubleSide }), []);
  const bmat = React.useMemo(() => new THREE.MeshBasicMaterial({ map: blobTex(), transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), []);
  mat.map = tex; mat.color.set(tint); mat.needsUpdate = true;
  depth.map = tex;
  const occ = React.useMemo(() => new THREE.ShaderMaterial({
    uniforms: { map: { value: null as THREE.Texture | null } },
    vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
    fragmentShader: "uniform sampler2D map; varying vec2 vUv; void main(){ if (texture2D(map, vUv).a < 0.5) discard; gl_FragColor = vec4(0.5, 0.5, 1.0, 130.0 / 255.0); }",
    side: THREE.DoubleSide, transparent: true, blending: THREE.NoBlending,
  }), []);
  occ.uniforms.map.value = tex;
  const yaw = Math.atan2(cam[0] - p[0], cam[2] - p[2]);
  const up = ((SOLE - CH / 2) * SU) * s; // card centre above the soles
  const sx = 1 / Math.sqrt(sy);
  return (
    <group position={p}>
      {lie === undefined ? (
        <group position={[0, dy, 0]} rotation={[0, yaw, 0]}>
          <group rotation={[0, 0, roll]}>
            <mesh geometry={planeG} material={mat} customDepthMaterial={depth} castShadow={shadow} receiveShadow={false}
              position={[0, up * sy, 0]} scale={[s * dir * sx, s * sy, s]} userData={{ occluder: occ }} renderOrder={2} />
          </group>
        </group>
      ) : (
        <mesh geometry={planeG} material={mat} customDepthMaterial={depth} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, lie]} scale={[s * dir, s, s]} userData={{ occluder: occ }} renderOrder={2} />
      )}
      {blob && lie === undefined ? (
        <mesh geometry={blobG} material={bmat} position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.75 * s / (1 + dy * 2), 0.32 * s / (1 + dy * 2), 1]} userData={{ outline: false }} renderOrder={1} />
      ) : null}
    </group>
  );
};
