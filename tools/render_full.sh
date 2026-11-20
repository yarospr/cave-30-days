#!/bin/sh
# Render the whole film in 4 chunks (resumable: finished chunks are skipped), then join them.
cd "$(dirname "$0")/.."
N=$(node -e "const d=require('./src/cave/timeline.json');console.log(Math.ceil(d.duration*30))")
mkdir -p out/chunks
step=$(( (N + 3) / 4 ))
i=0
: > out/chunks/list.txt
while [ $i -lt 4 ]; do
  a=$(( i * step )); b=$(( a + step - 1 )); [ $b -ge $N ] && b=$(( N - 1 ))
  f=out/chunks/c$i.mp4
  if [ ! -f "$f" ]; then
    npx remotion render src/index.ts Cave "$f.tmp.mp4" --frames=$a-$b --gl=angle --concurrency=4 --timeout=240000 --crf=18 --muted 2>&1 | grep -v "PCFSoft\|Clock" | tail -2 && mv "$f.tmp.mp4" "$f"
  fi
  echo "file 'c$i.mp4'" >> out/chunks/list.txt
  i=$(( i + 1 ))
done
ffmpeg -v error -y -f concat -safe 0 -i out/chunks/list.txt -c copy out/film_v.mp4 && echo "joined out/film_v.mp4"
