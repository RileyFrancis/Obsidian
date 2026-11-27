#!/usr/bin/env python3
"""
Starting-health markers: small tags placed on the right edge of a health cell to
show a monster's starting health for a given player count.

    ( 3 )[ players ]   -> "with 3 players, start here"

Run ./render.sh (it calls this too). Outputs go to ./health markers/.
"""
from pathlib import Path
import make_monster_frame as fr
from make_monster_frame import f, INK, BONE, BONE_MID, SOUL, SOUL_MID

OUT = Path(__file__).resolve().parent / "health markers"

PLAYER_COUNTS = range(1, 7)
R = 2.15          # circle radius (circle is ~one health cell tall)
TAB_H = 2.9       # tab height
TAB_L = 4.6       # tab length beyond the circle's centre + R
M = 0.35          # canvas margin
SHOW_TAB = False  # True = add the tab with the players icon


def players_glyph():
    """Two overlapping busts, unit box ~ -2..2."""
    def bust(cx, fill):
        return (f'<circle cx="{f(cx)}" cy="-0.85" r="0.72" fill="{fill}" stroke="{INK}" stroke-width="0.22"/>'
                f'<path d="M{f(cx-1.3)},1.45 Q{f(cx-1.3)},-0.05 {f(cx)},-0.05 Q{f(cx+1.3)},-0.05 {f(cx+1.3)},1.45 Z" '
                f'fill="{fill}" stroke="{INK}" stroke-width="0.22"/>')
    return bust(0.65, BONE_MID) + bust(-0.55, BONE)


def marker(n, x=0.0, y=0.0):
    """Returns (svg, width, height); (x, y) is the top-left corner."""
    cx, cy = x + R, y + R
    tx1 = cx + R + TAB_L if SHOW_TAB else cx + R
    tab = (f'<rect x="{f(cx)}" y="{f(cy - TAB_H/2)}" width="{f(tx1 - cx)}" height="{f(TAB_H)}" rx="{f(TAB_H/2)}"')
    circ = f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R)}"'
    out = [f'<g class="hp-marker-{n}">']
    # union outline: ink edge, then bone line, then fills on top
    for stroke, sw in [(INK, 0.95), (BONE_MID, 0.5)]:
        if SHOW_TAB:
            out.append(f'{tab} fill="none" stroke="{stroke}" stroke-width="{sw}"/>')
        out.append(f'{circ} fill="none" stroke="{stroke}" stroke-width="{sw}"/>')
    if SHOW_TAB:
        out.append(f'{tab} fill="url(#mkTab)"/>')
    out.append(f'{circ} fill="url(#mkCirc)"/>')
    out.append(f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(R - 0.42)}" fill="none" stroke="{SOUL_MID}" stroke-width="0.22"/>')
    out.append(f'<text x="{f(cx)}" y="{f(cy + 1.1)}" font-family="{fr.NUM_FONT}" font-weight="bold" font-size="3.1" '
               f'text-anchor="middle" fill="{BONE}">{n}</text>')
    gx = cx + R + TAB_L / 2 - 0.25
    if SHOW_TAB:
        out.append(f'<g transform="translate({f(gx)},{f(cy - 0.05)}) scale(0.78)">{players_glyph()}</g>')
    out.append('</g>')
    return "\n".join(out), tx1 - x, 2 * R


def defs():
    return f'''<defs>
  <radialGradient id="mkCirc" cx="40%" cy="35%" r="70%">
    <stop offset="0" stop-color="#1f5a4c"/><stop offset="1" stop-color="#0a221d"/>
  </radialGradient>
  <linearGradient id="mkTab" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2c3a36"/><stop offset="1" stop-color="#141c1a"/>
  </linearGradient>
</defs>'''


def standalone(n):
    body, w, h = marker(n, M, M)
    cw, ch = w + 2 * M, h + 2 * M
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{f(cw)}mm" height="{f(ch)}mm" viewBox="0 0 {f(cw)} {f(ch)}">
{defs()}
{body}
</svg>
'''


def preview_card():
    """Example card with markers for 1-4 players on the health bar."""
    svg = fr.build(example=True)
    # remove the sample gold token so the markers are easy to see
    svg = "\n".join(l for l in svg.split("\n") if "#c9a227" not in l)
    starts = {1: 8, 2: 11, 3: 14, 4: 17}
    cells = {v: (x, y, w, h) for v, x, y, w, h in fr.hb_cells()}
    parts = []
    for n, hp in starts.items():
        x, y, w, h = cells[hp]
        # circle centre sits just inside the cell's right edge
        body, _, mh = marker(n, x + w - R + 0.5, y + h / 2 - R)
        parts.append(body)
    svg = svg.replace("</defs>", defs().replace("<defs>", "").replace("</defs>", "") + "</defs>", 1)
    return svg.replace("</g>\n</svg>", "\n".join(parts) + "\n</g>\n</svg>")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for n in PLAYER_COUNTS:
        (OUT / f"start-{n}p.svg").write_text(standalone(n))
    (OUT / "_preview_card.svg").write_text(preview_card())
    print("wrote markers to", OUT)
