#!/bin/sh
# Print the shot list [id, from, dur] of the full film as JSON (bundles assemble.tsx with a tiny DOM stub).
cd "$(dirname "$0")/.."
cat > _stub.js <<'EOS'
const __any = new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => 1 : k === "width" || k === "height" ? 64 : __any), apply: () => __any, construct: () => __any, set: () => true });
globalThis.document = __any; globalThis.Image = function () { return __any; };
EOS
echo 'import { ALL_SHOTS } from "./src/med/assemble"; console.log(JSON.stringify(ALL_SHOTS.map((s, i) => [s.id, +s.from.toFixed(2), +((ALL_SHOTS[i + 1]?.from ?? 492.6) - s.from).toFixed(2)])));' > _shots.tsx
npx esbuild _shots.tsx --bundle --platform=node --format=cjs --packages=external --inject:_stub.js --log-level=error --outfile=_shots.cjs && node _shots.cjs 2>/dev/null
rm -f _shots.tsx _shots.cjs _stub.js
