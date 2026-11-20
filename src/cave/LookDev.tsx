// Look-dev frames for the cave: one frame per mood / set (render: node tools/stills.mjs out/st/look.jpg 4 0:8 480 CaveLook)
import React from "react";
import type { V3 } from "../inkbeat/types";
import { FilmCut, move } from "./film";
import type { Shot } from "./film";
import { Bat, Cricket, Fish, Olm } from "./creatures";
import { D, DEN, Den, Hall, LOG, MarkWall, SH, Shaft, ST, Street, T, Tunnel, WAKE } from "./sets";
import { Who } from "./who";

const S = (id: string, from: number, r: Shot["render"]): Shot => ({ id, from, render: r });
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const shots: Shot[] = [
  S("street", 0, (t) => {
    const cam = move([add(ST, [-1.5, 1.6, 5.5]), add(ST, [0.6, 1.3, -1]), 38], null, 0);
    return { mood: "street", cam, sky: true, focus: add(ST, [0.4, 1.3, 0]), blur: 1.2, node: <><Street t={t} />
      <Who id="you" t={t} p={add(ST, [-0.4, 0, 0.4])} cam={cam.pos} mood="street" f={{ expr: "smile", facing: 1, prop: "card" }} />
      <Who id="stranger" t={t} p={add(ST, [0.8, 0, -0.2])} cam={cam.pos} mood="street" f={{ facing: -1, armR: [60, 30], frontR: true }} /></> };
  }),
  S("void", 1, (t) => {
    const cam = move([[WAKE[0] + 1.6, 1.3, WAKE[2] + 3.4], [WAKE[0], 0.9, WAKE[2]], 40], null, 0);
    return { mood: "void", cam, focus: WAKE, blur: 1.0, node: <><Hall t={t} waterLit={0} log={-1} cam={cam.pos} /><Who id="you" t={t} p={WAKE} cam={cam.pos} mood="void" f={{ expr: "shock", armL: [100, 20], armR: [100, 20] }} /></> };
  }),
  S("fox", 2, (t) => {
    const cam = move([[LOG[0] - 2.6, 1.4, LOG[2] + 3.0], [LOG[0], 0.8, LOG[2]], 40], null, 0);
    return { mood: "fox", cam, focus: LOG, blur: 1.0, node: <><Hall t={t} waterLit={0.6} log={1} cam={cam.pos} /><Who id="you" t={t} p={[LOG[0] - 0.9, 0, LOG[2] + 0.4]} cam={cam.pos} mood="fox" f={{ expr: "grin", prop: "shroom" }} /><Fish p={[3.3, -0.12, 3.2]} cam={cam.pos} s={1.4} /></> };
  }),
  S("foxwide", 3, (t) => {
    const cam = move([[-5.5, 2.4, 6.0], [2, 1.4, -2], 50], null, 0);
    return { mood: "fox", cam, focus: [0, 1, 0], blur: 0.6, node: <><Hall t={t} waterLit={0.6} log={1} cam={cam.pos} /><Who id="you" t={t} p={[LOG[0] - 0.9, 0, LOG[2] + 0.4]} cam={cam.pos} mood="fox" f={{ expr: "relief", prop: "shroom" }} /><Bat p={[-1, 4.2, -2]} cam={cam.pos} hang s={2} /></> };
  }),
  S("fire", 4, (t) => {
    const cam = move([add(D, [-1.6, 1.5, 3.2]), add(D, [1.0, 0.8, -1.2]), 42], null, 0);
    return { mood: "fire", cam, focus: DEN.fire, blur: 1.0, node: <><Den t={t} fire={1} smoke="chimney" lamps={1} shelf cam={cam.pos} /><MarkWall /><Who id="you" t={t} p={add(DEN.fire, [-0.9, 0, 0.6])} cam={cam.pos} mood="fire" f={{ expr: "grin", prop: "lampStone" }} /></> };
  }),
  S("home", 5, (t) => {
    const cam = move([add(D, [2.4, 1.6, 3.4]), add(D, [-1.2, 1.2, -1.6]), 48], null, 0);
    return { mood: "home", cam, focus: DEN.bed, blur: 0.8, node: <><Den t={t} paint={1} marks={24} table shelf bed={1} stars={1} fire={0.7} smoke="chimney" lamps={3} xylo trap dishes cam={cam.pos} /><MarkWall />
      <Who id="youDirty" t={t} p={add(DEN.bed, [0.9, 0, 0.5])} cam={cam.pos} mood="home" f={{ expr: "smile", prop: "steve" }} /><Olm p={add(DEN.pool, [0, 0.02, 0])} cam={cam.pos} s={1.5} /><Cricket p={add(DEN.table, [0.3, 0.7, 0])} cam={cam.pos} s={2} /></> };
  }),
  S("shaft", 6, (t) => {
    const cam = move([add(SH, [0.3, 1.2, 0.6]), add(SH, [0, 16, 0]), 50], null, 0);
    return { mood: "fox", cam, blur: 0.4, node: <Shaft t={t} swing={0.3} /> };
  }),
  S("tunnel", 7, (t) => {
    const cam = move([add(T, [0, 0.6, 3.0]), add(T, [0, 0.4, -3]), 50], null, 0);
    return { mood: "fire", cam, blur: 0.6, node: <><Tunnel cam={cam.pos} /><Who id="you" t={t} p={add(T, [0, 0, -0.5])} cam={cam.pos} mood="fire" s={0.75} f={{ expr: "nervous", prop: "lampStone" }} /></> };
  }),
];
export const LOOK_FRAMES = shots.length;
export const CaveLook: React.FC = () => <FilmCut shots={shots} hud={() => null} at={(f) => f + 0.001} />;
