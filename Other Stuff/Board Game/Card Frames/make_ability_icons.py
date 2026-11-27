#!/usr/bin/env python3
"""
Ability badges for monster action sets (MOVE, ATTACK, TRANSFORM, general ACTION,
PASSIVE), in the same style as the monster card frame.

Each badge is a pointed plate: an icon section, then blank number wells.
    MOVE       [footprints | distance]
    ATTACK     [claws | -> range | person # players]
    TRANSFORM  [soul flame]
    ACTION     [sigil]          (general action)
    PASSIVE    [eye]

Run ./render.sh (it calls this script too). Outputs go to ./ability icons/.
"""
from pathlib import Path
import make_monster_frame as fr
from make_monster_frame import f, INK, BONE, BONE_MID, BONE_DK, SOUL, SOUL_MID, SOUL_DK

OUT = Path(__file__).resolve().parent / "ability icons"

BADGE_H = 5.5        # mm; fits beside two lines of rules text
POINT = 1.6          # depth of the pointed ends
SLANT = 0.7          # half the horizontal lean of the section dividers
ICON_W = 6.2         # icon section width
NUM_W = 4.8          # plain number well width
GLYPH_NUM_W = 7.0    # number well that carries a small glyph (range / players)

TYPES = {
    #  name        icon fn        tint       number wells (None = plain)
    "move":      ("icon_move",      "#1a5546", [None]),
    "attack":    ("icon_attack",    "#5b1e24", ["range", "players"]),
    "transform": ("icon_transform", "#42205c", []),
    "action":    ("icon_action",    "#4a3b1c", []),
    "passive":   ("icon_passive",   "#233f52", []),
}


# ------------------------------------------------------------------ icons
# Drawn in a 10x10 unit box centred on (0,0), then scaled into the badge.
def icon_move():
    def paw(cx, cy, rot):
        toes = "".join(
            f'<path transform="translate({tx},{ty}) rotate({ta})" d="M0,-1.15 C0.55,-0.6 0.62,0.25 0,0.6 C-0.62,0.25 -0.55,-0.6 0,-1.15 Z"/>'
            for tx, ty, ta in [(-1.3, -0.95, -22), (0, -1.55, 0), (1.3, -0.95, 22)])
        return (f'<g transform="translate({cx},{cy}) rotate({rot})" fill="{BONE}" stroke="{INK}" stroke-width="0.35">'
                f'<path d="M0,-0.2 C1.3,-0.2 1.75,0.9 1.45,1.55 C1.2,2.1 0.6,1.85 0,1.85 C-0.6,1.85 -1.2,2.1 -1.45,1.55 C-1.75,0.9 -1.3,-0.2 0,-0.2 Z"/>'
                f'{toes}</g>')
    return paw(-1.7, 1.7, 20) + paw(1.7, -1.9, 20)


def icon_attack():
    out = []
    for i, dx in enumerate((-2.3, 0, 2.3)):
        sx, sy = dx + 2.2, -4.2
        ex, ey = dx - 2.2, 4.2
        mx, my = (sx + ex) / 2 + 0.9, (sy + ey) / 2 + 0.4
        w = 0.85
        out.append(f'<path d="M{f(sx)},{f(sy)} Q{f(mx + w)},{f(my + w * 0.4)} {f(ex)},{f(ey)} '
                   f'Q{f(mx - w)},{f(my - w * 0.4)} {f(sx)},{f(sy)} Z" fill="{BONE}" stroke="{INK}" stroke-width="0.32" stroke-linejoin="round"/>')
    return "".join(out)


def icon_transform():
    outer = ("M0,4.4 C-3.1,4.4 -3.7,1.0 -2.3,-1.0 C-1.7,0.3 -1.0,0.5 -0.9,0.1 "
             "C-1.3,-1.9 0,-3.5 0.6,-4.7 C1.0,-2.9 3.5,-1.7 3.1,1.2 C2.9,3.3 1.7,4.4 0,4.4 Z")
    inner = "M0,3.5 C-1.6,3.5 -1.9,1.7 -1.1,0.7 C-0.7,1.4 -0.2,1.3 -0.2,0.9 C-0.4,-0.3 0.3,-1.3 0.6,-2.0 C0.9,-0.9 2.1,0.0 1.9,1.7 C1.8,2.8 1.0,3.5 0,3.5 Z"
    return (f'<path d="{outer}" fill="{SOUL_MID}" stroke="{INK}" stroke-width="0.38" stroke-linejoin="round"/>'
            f'<path d="{inner}" fill="{SOUL}"/>'
            f'<path d="{inner}" fill="#ffffff" opacity="0.25" transform="translate(0.15,1.2) scale(0.55)"/>')


def icon_action():
    star = "M0,-4.6 Q0.7,-0.7 4.6,0 Q0.7,0.7 0,4.6 Q-0.7,0.7 -4.6,0 Q-0.7,-0.7 0,-4.6 Z"
    return (f'<circle r="2.7" fill="none" stroke="{BONE_MID}" stroke-width="0.45"/>'
            f'<path d="{star}" fill="{BONE}" stroke="{INK}" stroke-width="0.32" stroke-linejoin="round"/>'
            f'<circle r="0.75" fill="{SOUL}" stroke="{INK}" stroke-width="0.2"/>')


def icon_passive():
    return (f'<path d="M-4.7,0 Q0,-4.1 4.7,0 Q0,4.1 -4.7,0 Z" fill="{BONE}" stroke="{INK}" stroke-width="0.4" stroke-linejoin="round"/>'
            f'<circle r="1.95" fill="{SOUL_MID}" stroke="{INK}" stroke-width="0.3"/>'
            f'<circle r="1.2" fill="{SOUL}" opacity="0.55"/>'
            f'<ellipse rx="0.5" ry="1.55" fill="{INK}"/>'
            f'<circle cx="0.8" cy="-0.8" r="0.35" fill="#fff" opacity="0.8"/>')


# small glyphs that sit at the left of a number well, ~2mm tall (unit box -2..2)
def glyph_range():
    return (f'<path d="M-1.6,0 L0.6,0" stroke="{BONE_MID}" stroke-width="0.42" stroke-dasharray="0.55 0.35"/>'
            f'<path d="M0.4,-0.85 L1.7,0 L0.4,0.85 Z" fill="{BONE_MID}"/>')


def glyph_players():
    return (f'<circle cx="0" cy="-0.75" r="0.6" fill="{BONE_MID}"/>'
            f'<path d="M-1.15,1.3 Q-1.15,-0.05 0,-0.05 Q1.15,-0.05 1.15,1.3 Z" fill="{BONE_MID}"/>')


GLYPHS = {"range": glyph_range, "players": glyph_players}


# ------------------------------------------------------------------ badge
def badge(kind, x=0.0, y=0.0, values=None):
    """Return (svg, width) for a badge with its top-left at (x, y).
    values: optional list of strings to print in the number wells (for previews)."""
    icon_fn, tint, wells = TYPES[kind]
    h = BADGE_H
    widths = [GLYPH_NUM_W if g else NUM_W for g in wells]
    # icon-only badges are regular hexagons (flat top = h / sqrt(3))
    body_w = ICON_W + sum(widths) if wells else h / 3 ** 0.5
    total = POINT * 2 + body_w
    ym = h / 2

    def P(px, py):
        return f"{f(x + px)},{f(y + py)}"

    outline = f"M{P(0, ym)} L{P(POINT, 0)} L{P(POINT + body_w, 0)} L{P(total, ym)} L{P(POINT + body_w, h)} L{P(POINT, h)} Z"

    # divider x positions (at mid-height); each divider leans like "\"
    divs = []
    acc = POINT + ICON_W
    for w in widths:
        divs.append(acc)
        acc += w

    out = [f'<g class="badge-{kind}">']
    out.append(f'<path d="{outline}" fill="url(#bPlate)" stroke="{INK}" stroke-width="0.55" stroke-linejoin="round"/>')

    # icon section tinted
    if divs:
        d0 = divs[0]
        icon_area = (f"M{P(0, ym)} L{P(POINT, 0)} L{P(d0 - SLANT, 0)} L{P(d0 + SLANT, h)} L{P(POINT, h)} Z")
    else:
        icon_area = outline
    out.append(f'<path d="{icon_area}" fill="{tint}"/>')
    out.append(f'<path d="{icon_area}" fill="url(#bSheen)"/>')

    # number wells
    for i, (d, w, g) in enumerate(zip(divs, widths, wells)):
        right = d + w
        last = i == len(wells) - 1
        inset = 0.55
        if last:
            well = (f"M{P(d - SLANT + inset, inset)} L{P(POINT + body_w - 0.1, inset)} L{P(total - inset * 1.25, ym)} "
                    f"L{P(POINT + body_w - 0.1, h - inset)} L{P(d + SLANT + inset, h - inset)} Z")
        else:
            well = (f"M{P(d - SLANT + inset, inset)} L{P(right - SLANT - inset, inset)} "
                    f"L{P(right + SLANT - inset, h - inset)} L{P(d + SLANT + inset, h - inset)} Z")
        out.append(f'<path d="{well}" fill="#070c0c" stroke="{BONE_DK}" stroke-width="0.18" stroke-linejoin="round"/>')
        gx = d + 1.75
        if g:
            out.append(f'<g transform="translate({f(x + gx)},{f(y + ym)}) scale(0.62)">{GLYPHS[g]()}</g>')
        if values and i < len(values) and values[i]:
            num_cx = (d + (gx + 1.0 if g else d) + right + (POINT * 0.6 if last else 0)) / 2 if g else d + w / 2 + (0.35 if last else 0)
            if g:
                num_cx = gx + 1.0 + (right + (0.6 if last else 0) - (gx + 1.0)) / 2
            out.append(f'<text x="{f(x + num_cx)}" y="{f(y + ym + 1.2)}" font-family="{fr.NUM_FONT}" font-weight="bold" '
                       f'font-size="3.3" text-anchor="middle" fill="{BONE}">{values[i]}</text>')

    # divider lines
    for d in divs:
        out.append(f'<path d="M{P(d - SLANT, 0)} L{P(d + SLANT, h)}" stroke="{INK}" stroke-width="0.5"/>'
                   f'<path d="M{P(d - SLANT, 0)} L{P(d + SLANT, h)}" stroke="{BONE_MID}" stroke-width="0.2"/>')

    # icon
    if wells:
        icx = POINT * 0.55 + ICON_W / 2
        sc = 0.43 if kind != "passive" else 0.47
    else:
        icx = total / 2
        sc = 0.41 if kind != "passive" else 0.44
    out.append(f'<g transform="translate({f(x + icx)},{f(y + ym)}) scale({sc})">{globals()[icon_fn]()}</g>')

    # bone outline, hand-inked
    out.append(f'<g filter="url(#wobble)"><path d="{outline}" fill="none" stroke="{BONE_MID}" stroke-width="0.3" stroke-linejoin="round"/></g>')
    out.append('</g>')
    return "\n".join(out), total


def badge_defs():
    return f'''<defs>
  <filter id="wobble" x="-3%" y="-10%" width="106%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="0.25" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <linearGradient id="bPlate" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#26332f"/><stop offset="1" stop-color="#121a18"/>
  </linearGradient>
  <linearGradient id="bSheen" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
    <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0.3"/>
  </linearGradient>
</defs>'''


def standalone(kind):
    m = 0.5
    body, w = badge(kind, m, m)
    cw, ch = w + 2 * m, BADGE_H + 2 * m
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{f(cw)}mm" height="{f(ch)}mm" viewBox="0 0 {f(cw)} {f(ch)}">
{badge_defs()}
{body}
</svg>
'''


# ------------------------------------------------------------------ preview on a card
def preview_card():
    svg = fr.build(example=True)
    # drop the example's rules text; keep name, stats, etc.
    start = svg.index('<g id="example">')
    ex = svg[start:]
    lines = [l for l in ex.split("\n") if "font-family=\"'EB Garamond', serif\"" not in l and "letter-spacing='0.2'" not in l]
    svg = svg[:start] + "\n".join(lines)

    tf = "'EB Garamond', serif"
    x0 = fr.COL_X0 + 2.0
    tx = lambda w: x0 + w + 1.2
    rows = [
        ("move", ["3"], ["toward the nearest player."]),
        ("attack", ["1", "1"], ["Drain 2 sanity."]),
        ("action", None, ["Place an acid token at this", "monster's location."]),
        ("transform", None, ["After 10 rounds."]),
    ]
    parts = []
    y = fr.TXT_Y0 + 2.4
    for kind, vals, text in rows:
        b, w = badge(kind, x0, y, vals)
        parts.append(b)
        if len(text) == 1:
            parts.append(f'<text x="{f(tx(w))}" y="{f(y + BADGE_H / 2 + 0.9)}" font-family="{tf}" font-size="2.55" fill="{INK}">{text[0]}</text>')
        else:
            for j, t in enumerate(text):
                parts.append(f'<text x="{f(tx(w))}" y="{f(y + 2.15 + j * 2.9)}" font-family="{tf}" font-size="2.55" fill="{INK}">{t}</text>')
        y += BADGE_H + 1.6
    y += 1.2
    b, w = badge("passive", x0, y)
    parts.append(b)
    for j, t in enumerate(["Players that share a tile with this", "monster lose 1 sanity at the end", "of the round."]):
        xx = tx(w) if j < 2 else x0
        parts.append(f'<text x="{f(xx)}" y="{f(y + 2.15 + j * 2.9)}" font-family="{tf}" font-style="italic" font-size="2.55" fill="{INK}">{t}</text>')

    insert = badge_defs().replace("<defs>", "").replace("</defs>", "").replace('id="wobble"', 'id="bwobble"')
    body = "\n".join(parts).replace("url(#wobble)", "url(#bwobble)")
    svg = svg.replace("</defs>", insert + "</defs>", 1)
    return svg.replace("</g>\n</svg>", body + "\n</g>\n</svg>")


def sheet():
    """All badges on a dark strip, with sample numbers, for a quick look."""
    m, gap = 2.0, 2.0
    parts, y, maxw = [], m, 0
    samples = {"move": ["3"], "attack": ["2", "1"]}
    for kind in TYPES:
        b1, w1 = badge(kind, m, y)
        parts.append(b1)
        maxw = max(maxw, m + w1)
        if kind in samples:
            x2 = m + w1 + 4
            b2, w2 = badge(kind, x2, y, samples[kind])
            parts.append(b2)
            maxw = max(maxw, x2 + w2)
        y += BADGE_H + gap
    cw, ch = maxw + m, y - gap + m
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{f(cw)}mm" height="{f(ch)}mm" viewBox="0 0 {f(cw)} {f(ch)}">
{badge_defs()}
<rect width="{f(cw)}" height="{f(ch)}" fill="{fr.PARCH}"/>
{"".join(parts)}
</svg>
'''


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for kind in TYPES:
        (OUT / f"{kind}.svg").write_text(standalone(kind))
    (OUT / "_sheet.svg").write_text(sheet())
    (OUT / "_preview_card.svg").write_text(preview_card())
    print("wrote badges to", OUT)
