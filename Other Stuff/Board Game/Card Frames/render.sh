#!/usr/bin/env bash
# Regenerate SVGs and render 300 DPI PNGs (absolute paths: snap Inkscape needs them)
set -e
D="$(cd "$(dirname "$0")" && pwd)"
python3 "$D/make_monster_frame.py"
for n in monster_frame monster_frame_bleed monster_frame_example; do
  inkscape "$D/$n.svg" --export-type=png --export-dpi=300 --export-filename="$D/$n.png" 2>/dev/null
done
# Portable copy with text converted to outlines (looks the same on machines without the fonts)
inkscape "$D/monster_frame.svg" --export-type=svg --export-text-to-path --export-plain-svg --export-filename="$D/monster_frame_outlined.svg" 2>/dev/null
echo done
