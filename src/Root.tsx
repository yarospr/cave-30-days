import React from "react";
import { Composition } from "remotion";
import { Demo, DEMO_MOODS } from "./demo/Demo";
import { DemoCast } from "./demo/DemoCast";
import { DemoMove, MOVE_FRAMES } from "./demo/DemoMove";
import { SUB } from "./inkbeat/core/frame";
import { CaveLook, LOOK_FRAMES } from "./cave/LookDev";
import { FILM_FRAMES as CAVE_FRAMES, FullFilm, midCount, PartMids } from "./cave/assemble";

// DemoHero: a low hero framing with foreground props. Demo: one still. Demo-<mood>: the same frame in each act light. DemoWide: the whole set.
// DemoCast: the three example characters in a row (a landscape family sheet).
// DemoMove: a 3 s beat-rig move (sharp). DemoMoveSub: the same at SUB × fps for motion blur (average with ffmpeg tmix).
export const Root: React.FC = () => (
  <>
    <Composition id="Cave" component={FullFilm} durationInFrames={CAVE_FRAMES} fps={30} width={1920} height={1080} />
    {["c1", "c2", "c3", "c4"].map((p) => <Composition key={p} id={`Mids-${p}`} component={PartMids} durationInFrames={Math.max(1, midCount(p))} fps={30} width={1920} height={1080} defaultProps={{ part: p }} />)}
    {["c1", "c2", "c3", "c4"].map((p) => <Composition key={p + "q"} id={`Quarts-${p}`} component={PartMids} durationInFrames={Math.max(1, midCount(p, 2))} fps={30} width={1920} height={1080} defaultProps={{ part: p, pts: [0.12, 0.88] }} />)}
    <Composition id="CaveLook" component={CaveLook} durationInFrames={LOOK_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="Demo" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "day", wide: false }} />
    <Composition id="DemoHero" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "dusk", wide: false, hero: true }} />
    <Composition id="DemoWide" component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: "day", wide: true }} />
    {DEMO_MOODS.map((m) => (
      <Composition key={m} id={`Demo-${m}`} component={Demo} durationInFrames={30} fps={30} width={1080} height={1920} defaultProps={{ mood: m, wide: false }} />
    ))}
    <Composition id="DemoCast" component={DemoCast} durationInFrames={30} fps={30} width={1920} height={1080} defaultProps={{ mood: "day" }} />
    <Composition id="DemoMove" component={DemoMove} durationInFrames={MOVE_FRAMES} fps={30} width={1080} height={1920} defaultProps={{ sub: false }} />
    <Composition id="DemoMoveSub" component={DemoMove} durationInFrames={MOVE_FRAMES * SUB} fps={30 * SUB} width={1080} height={1920} defaultProps={{ sub: true }} />
  </>
);
