#!/usr/bin/env python3
"""
Generates the monster card frame (tarot size, 70 x 120 mm) as SVG.

All coordinates are in millimetres. Run:
    python3 make_monster_frame.py
then render the SVGs with Inkscape (see render.sh).

Outputs (next to this script):
    monster_frame.svg          trim size 70x120mm
    monster_frame_bleed.svg    76x126mm (3mm bleed each side, for print shops)
    monster_frame_example.svg  trim size, filled in with a sample monster
"""
from pathlib import Path
import math

OUT = Path(__file__).resolve().parent

W, H = 70.0, 120.0
SECTION_LABELS = True          # "ACTIONS" / "PASSIVE" headers in the text box

# ---- palette (Ring of Pain-ish: black void, bone, dried blood) ----
VOID = "#0b0909"
STONE = "#191315"
STONE_HI = "#2a2023"
BONE = "#ddd1b3"
BONE_MID = "#a8997b"
BONE_DK = "#5e5344"
BLOOD = "#6e1717"
BLOOD_HI = "#a8302a"
INK = "#070506"
PARCH = "#cdbf9e"
PARCH_DK = "#9c8c6c"
ATK_C, DEF_C, SPD_C = "#6a1a1a", "#25403f", "#5a4e1f"

LABEL_FONT = "'EB Garamond SC', 'EB Garamond', serif"
NUM_FONT = "'Linux Libertine O', 'EB Garamond', serif"

# ---- layout ----
M = 3.0                         # safe margin from trim
HB_X0, HB_X1 = 3.0, 11.4        # health bar channel
HB_Y0, HB_Y1 = 3.0, 117.0
HB_CAP = 6.4                    # space at top of bar for the HP emblem
COL_X0, COL_X1 = 12.6, 66.8     # main column
NAME_Y0, NAME_Y1 = 3.2, 11.4
ART_Y0, ART_Y1 = 12.9, 61.2
STAT_Y0, STAT_Y1 = 62.7, 71.5
TXT_Y0, TXT_Y1 = 73.1, 114.6
DIVIDER_FRAC = 0.64             # where ACTIONS ends / PASSIVE begins


def f(v):
    return f"{v:.3f}".rstrip("0").rstrip(".")


# ------------------------------------------------------------------ icons
def icon_sword(cx, cy, s):
    """Sword pointing up-right, s = scale (1 ~ 9mm tall)."""
    return f'''<g transform="translate({f(cx)},{f(cy)}) rotate(45) scale({f(s)})">
  <path d="M0,-4.4 L0.62,-3.6 L0.62,1.15 L-0.62,1.15 L-0.62,-3.6 Z" fill="{BONE}" stroke="{INK}" stroke-width="0.28"/>
  <path d="M0,-3.9 L0,0.9" stroke="{BONE_DK}" stroke-width="0.18"/>
  <path d="M-2.0,1.1 Q0,1.55 2.0,1.1 L2.0,1.75 Q0,2.2 -2.0,1.75 Z" fill="{BONE_MID}" stroke="{INK}" stroke-width="0.25"/>
  <rect x="-0.38" y="1.85" width="0.76" height="1.9" fill="{BONE_DK}" stroke="{INK}" stroke-width="0.22"/>
  <circle cx="0" cy="4.15" r="0.55" fill="{BONE_MID}" stroke="{INK}" stroke-width="0.22"/>
</g>'''


def icon_shield(cx, cy, s):
    return f'''<g transform="translate({f(cx)},{f(cy)}) scale({f(s)})">
  <path d="M-3,-3.4 Q0,-4.3 3,-3.4 L3,-0.2 C3,2.3 0.9,3.6 0,4.1 C-0.9,3.6 -3,2.3 -3,-0.2 Z" fill="{BONE}" stroke="{INK}" stroke-width="0.32"/>
  <path d="M-2.2,-2.75 Q0,-3.4 2.2,-2.75 L2.2,-0.3 C2.2,1.6 0.7,2.65 0,3.05 C-0.7,2.65 -2.2,1.6 -2.2,-0.3 Z" fill="none" stroke="{BONE_DK}" stroke-width="0.22"/>
  <path d="M0,-3.3 L0,3.4 M-2.6,-0.6 L2.6,-0.6" stroke="{INK}" stroke-width="0.28"/>
</g>'''


def icon_wing(cx, cy, s):
    """Swept wing with scalloped feather tips."""
    outline = ("M-3.4,0.2 C-2.2,-2.4 0.8,-3.9 4.0,-3.9 "
               "L3.0,-1.9 L3.4,-1.75 L2.2,0.0 L2.6,0.2 L1.2,1.6 L1.5,1.85 "
               "L-0.2,2.7 C-1.5,2.6 -2.8,1.7 -3.4,0.2 Z")
    covert = "M-3.4,0.2 C-2.2,-2.4 0.8,-3.9 4.0,-3.9 L3.0,-1.9 C1.0,-1.5 -1.4,-0.6 -2.6,1.2 Z"
    lines = "M-2.6,1.2 L3.0,-1.9 M-2.0,1.8 L2.2,0.0 M-1.2,2.3 L1.2,1.6"
    return f'''<g transform="translate({f(cx)},{f(cy)}) scale({f(s)})">
  <path d="{outline}" fill="{BONE_MID}" stroke="{INK}" stroke-width="0.3" stroke-linejoin="round"/>
  <path d="{covert}" fill="{BONE}" stroke="{INK}" stroke-width="0.26" stroke-linejoin="round"/>
  <path d="{lines}" stroke="{INK}" stroke-width="0.22" fill="none"/>
</g>'''


def icon_drop(cx, cy, s, fill=BLOOD_HI):
    return f'''<g transform="translate({f(cx)},{f(cy)}) scale({f(s)})">
  <path d="M0,-3.1 C1.1,-1.5 2.3,-0.2 2.3,1.25 A2.3,2.3 0 0 1 -2.3,1.25 C-2.3,-0.2 -1.1,-1.5 0,-3.1 Z" fill="{fill}" stroke="{INK}" stroke-width="0.35"/>
  <path d="M-1.15,0.6 C-1.15,1.4 -0.7,2.0 -0.1,2.2" fill="none" stroke="{BONE}" stroke-width="0.32" stroke-linecap="round" opacity="0.8"/>
</g>'''


def icon_skull(cx, cy, s):
    return f'''<g transform="translate({f(cx)},{f(cy)}) scale({f(s)})">
  <path d="M-2.1,0.6 C-2.6,-1.2 -1.6,-2.6 0,-2.6 C1.6,-2.6 2.6,-1.2 2.1,0.6 L1.5,1.0 L1.4,2.1 L-1.4,2.1 L-1.5,1.0 Z" fill="{BONE}" stroke="{INK}" stroke-width="0.3"/>
  <ellipse cx="-0.85" cy="-0.35" rx="0.6" ry="0.68" fill="{INK}"/>
  <ellipse cx="0.85" cy="-0.35" rx="0.6" ry="0.68" fill="{INK}"/>
  <path d="M0,0.55 L-0.32,1.1 L0.32,1.1 Z" fill="{INK}"/>
  <path d="M-0.7,1.35 L-0.7,2.1 M0,1.35 L0,2.1 M0.7,1.35 L0.7,2.1" stroke="{INK}" stroke-width="0.2"/>
</g>'''


def stud(cx, cy, r=0.55):
    return (f'<circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}" fill="{BONE_MID}" stroke="{INK}" stroke-width="0.2"/>'
            f'<circle cx="{f(cx - r*0.3)}" cy="{f(cy - r*0.3)}" r="{f(r*0.32)}" fill="{BONE}"/>')


def diamond(cx, cy, r, fill=BONE_MID, stroke=INK, sw=0.2):
    return (f'<path d="M{f(cx)},{f(cy-r)} L{f(cx+r)},{f(cy)} L{f(cx)},{f(cy+r)} L{f(cx-r)},{f(cy)} Z" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{f(sw)}"/>')


# ------------------------------------------------------------------ defs
def defs():
    return f'''<defs>
  <!-- slight hand-inked wobble on frame linework -->
  <filter id="wobble" x="-2%" y="-2%" width="104%" height="104%">
    <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="0.32" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <!-- mottled grime used on dark surfaces -->
  <filter id="grime" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="4" seed="11" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 2.2 -1.05"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <!-- fine paper grain -->
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="3" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.05"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <!-- blotchy stains for the parchment box -->
  <filter id="stain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed="21" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 2.6 -1.35"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>

  <radialGradient id="artGrad" cx="50%" cy="45%" r="70%">
    <stop offset="0" stop-color="#3a2f31"/>
    <stop offset="0.6" stop-color="#1d1618"/>
    <stop offset="1" stop-color="#0c0909"/>
  </radialGradient>
  <radialGradient id="parchGrad" cx="50%" cy="45%" r="75%">
    <stop offset="0" stop-color="{PARCH}"/>
    <stop offset="0.75" stop-color="#c2b392"/>
    <stop offset="1" stop-color="{PARCH_DK}"/>
  </radialGradient>
  <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#352a2c"/>
    <stop offset="1" stop-color="#1a1416"/>
  </linearGradient>
  <linearGradient id="cellGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#1a0c0d"/>
    <stop offset="1" stop-color="#2e1213"/>
  </linearGradient>
  <linearGradient id="cellGradHi" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2a0f10"/>
    <stop offset="1" stop-color="#4a1818"/>
  </linearGradient>
  <radialGradient id="lvlGrad" cx="45%" cy="40%" r="65%">
    <stop offset="0" stop-color="#4a1a1a"/>
    <stop offset="1" stop-color="#1e0b0b"/>
  </radialGradient>
  <radialGradient id="medGrad" cx="40%" cy="35%" r="70%">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0.35"/>
  </radialGradient>
</defs>'''


# ------------------------------------------------------------------ parts
def background(x, y, w, h):
    return f'''<g id="background">
  <rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{VOID}"/>
  <rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{STONE}"/>
  <rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="#000" filter="url(#grime)" opacity="0.55"/>
  <rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="#000" filter="url(#grain)" opacity="0.35"/>
</g>'''


def outer_border():
    return f'''<g id="outer-border" filter="url(#wobble)">
  <rect x="1.5" y="1.5" width="{f(W-3)}" height="{f(H-3)}" rx="2.2" fill="none" stroke="{BONE_MID}" stroke-width="0.4"/>
  <rect x="2.15" y="2.15" width="{f(W-4.3)}" height="{f(H-4.3)}" rx="1.7" fill="none" stroke="{BONE_DK}" stroke-width="0.18"/>
</g>'''


def health_bar():
    out = ['<g id="health-bar">']
    w = HB_X1 - HB_X0
    cx = (HB_X0 + HB_X1) / 2
    # channel
    out.append(f'<rect x="{f(HB_X0)}" y="{f(HB_Y0)}" width="{f(w)}" height="{f(HB_Y1-HB_Y0)}" rx="1.4" '
               f'fill="#0e0a0b" stroke="{INK}" stroke-width="0.6"/>')
    out.append(f'<g filter="url(#wobble)"><rect x="{f(HB_X0)}" y="{f(HB_Y0)}" width="{f(w)}" height="{f(HB_Y1-HB_Y0)}" rx="1.4" '
               f'fill="none" stroke="{BONE_MID}" stroke-width="0.35"/></g>')
    # HP emblem at top
    out.append(icon_drop(cx, HB_Y0 + 3.0, 0.78))
    out.append(f'<text x="{f(cx)}" y="{f(HB_Y0 + HB_CAP - 0.25)}" font-family="{LABEL_FONT}" font-size="1.35" '
               f'letter-spacing="0.12" text-anchor="middle" fill="{BONE_MID}">hp</text>')

    top = HB_Y0 + HB_CAP + 0.3
    bot = HB_Y1 - 0.6
    n = 21
    pitch = (bot - top) / n
    gap = 0.55
    cw = w - 2.0
    cx0 = HB_X0 + 1.0
    for i in range(n):
        val = 20 - i
        y = top + i * pitch + gap / 2
        ch = pitch - gap
        mile = val % 5 == 0 and val != 0
        grad = "cellGradHi" if mile else "cellGrad"
        stroke = BONE if mile else BONE_DK
        sw = 0.3 if mile else 0.2
        out.append(f'<rect x="{f(cx0)}" y="{f(y)}" width="{f(cw)}" height="{f(ch)}" rx="0.75" '
                   f'fill="url(#{grad})" stroke="{stroke}" stroke-width="{f(sw)}"/>')
        # inner bevel highlight
        out.append(f'<path d="M{f(cx0+0.5)},{f(y+0.35)} L{f(cx0+cw-0.5)},{f(y+0.35)}" stroke="#000" stroke-width="0.25" opacity="0.6"/>')
        cy = y + ch / 2
        if val == 0:
            out.append(icon_skull(cx, cy, 0.72))
        else:
            fill = BONE if mile else BONE_MID
            weight = "bold" if mile else "normal"
            out.append(f'<text x="{f(cx)}" y="{f(cy + 0.95)}" font-family="{NUM_FONT}" font-size="2.7" '
                       f'font-weight="{weight}" text-anchor="middle" fill="{fill}">{val}</text>')
        if mile:
            # little notches on the channel edge to find 5/10/15/20 quickly
            out.append(f'<path d="M{f(HB_X0)},{f(cy)} L{f(HB_X0+0.7)},{f(cy)} M{f(HB_X1-0.7)},{f(cy)} L{f(HB_X1)},{f(cy)}" '
                       f'stroke="{BONE}" stroke-width="0.35"/>')
    out.append('</g>')
    return "\n".join(out)


def name_banner():
    x0, x1 = COL_X0, 58.5
    y0, y1 = NAME_Y0, NAME_Y1
    ym = (y0 + y1) / 2
    k = 1.3
    outer = f"M{f(x0+k)},{f(y0)} L{f(x1)},{f(y0)} L{f(x1)},{f(y1)} L{f(x0+k)},{f(y1)} L{f(x0)},{f(ym)} Z"
    i = 0.75
    inner = (f"M{f(x0+k+i*0.6)},{f(y0+i)} L{f(x1)},{f(y0+i)} L{f(x1)},{f(y1-i)} "
             f"L{f(x0+k+i*0.6)},{f(y1-i)} L{f(x0+i*1.1)},{f(ym)} Z")
    return f'''<g id="name-banner">
  <path d="{outer}" fill="url(#plateGrad)" stroke="{INK}" stroke-width="0.7"/>
  <path d="{outer}" fill="#000" filter="url(#grime)" opacity="0.4"/>
  <g filter="url(#wobble)">
    <path d="{outer}" fill="none" stroke="{BONE_MID}" stroke-width="0.35"/>
    <path d="{inner}" fill="none" stroke="{BONE_DK}" stroke-width="0.18"/>
  </g>
  {diamond(x0 + 0.05, ym, 0.75, BONE)}
</g>'''


def level_badge():
    cx, cy = 61.6, (NAME_Y0 + NAME_Y1) / 2 + 0.1
    r_out, r_ring, r_in = 5.6, 4.85, 3.85
    # ring of thorns
    teeth = []
    nt = 16
    for j in range(nt):
        a0 = 2 * math.pi * j / nt
        a1 = a0 + math.pi / nt
        a2 = a0 + 2 * math.pi / nt
        p0 = (cx + r_ring * math.cos(a0), cy + r_ring * math.sin(a0))
        p1 = (cx + r_out * math.cos(a1), cy + r_out * math.sin(a1))
        p2 = (cx + r_ring * math.cos(a2), cy + r_ring * math.sin(a2))
        teeth.append(f"M{f(p0[0])},{f(p0[1])} L{f(p1[0])},{f(p1[1])} L{f(p2[0])},{f(p2[1])} Z")
    return f'''<g id="level-badge">
  <path d="{' '.join(teeth)}" fill="{BONE_MID}" stroke="{INK}" stroke-width="0.25" stroke-linejoin="round"/>
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_ring+0.1)}" fill="{STONE_HI}" stroke="{INK}" stroke-width="0.45"/>
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_ring-0.25)}" fill="none" stroke="{BONE}" stroke-width="0.3"/>
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_in)}" fill="url(#lvlGrad)" stroke="{INK}" stroke-width="0.35"/>
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_in)}" fill="url(#medGrad)"/>
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_in-0.45)}" fill="none" stroke="{BONE_DK}" stroke-width="0.15"/>
  <text x="{f(cx)}" y="{f(cy - 2.05)}" font-family="{LABEL_FONT}" font-size="1.25" letter-spacing="0.1" text-anchor="middle" fill="{BONE_MID}">lvl</text>
</g>'''


def art_window():
    x0, x1, y0, y1 = COL_X0, COL_X1, ART_Y0, ART_Y1
    w, h = x1 - x0, y1 - y0
    out = [f'''<g id="art-window">
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" fill="url(#artGrad)" stroke="{INK}" stroke-width="0.8"/>
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" fill="#000" filter="url(#grime)" opacity="0.35"/>
  <g filter="url(#wobble)">
    <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" fill="none" stroke="{BONE}" stroke-width="0.4"/>
    <rect x="{f(x0+0.8)}" y="{f(y0+0.8)}" width="{f(w-1.6)}" height="{f(h-1.6)}" fill="none" stroke="{BONE_DK}" stroke-width="0.18"/>
  </g>''']
    # corner brackets
    L = 3.2
    for (cx, cy, sx, sy) in [(x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)]:
        out.append(f'<path d="M{f(cx+sx*0.4)},{f(cy+sy*(L+0.4))} L{f(cx+sx*0.4)},{f(cy+sy*0.4)} L{f(cx+sx*(L+0.4))},{f(cy+sy*0.4)}" '
                   f'fill="none" stroke="{BONE}" stroke-width="0.55" stroke-linecap="square"/>')
        out.append(diamond(cx + sx * 1.55, cy + sy * 1.55, 0.6, BONE_MID))
    out.append('</g>')
    return "\n".join(out)


def stat_plates():
    out = ['<g id="stats">']
    gap = 1.6
    pw = (COL_X1 - COL_X0 - 2 * gap) / 3
    y0, y1 = STAT_Y0, STAT_Y1
    cy = (y0 + y1) / 2
    specs = [("atk", ATK_C, icon_sword, 0.62), ("def", DEF_C, icon_shield, 0.62), ("spd", SPD_C, icon_wing, 0.6)]
    for k, (label, col, icon, sc) in enumerate(specs):
        x = COL_X0 + k * (pw + gap)
        out.append(f'<rect x="{f(x)}" y="{f(y0)}" width="{f(pw)}" height="{f(y1-y0)}" rx="1.0" fill="url(#plateGrad)" stroke="{INK}" stroke-width="0.6"/>')
        out.append(f'<g filter="url(#wobble)"><rect x="{f(x)}" y="{f(y0)}" width="{f(pw)}" height="{f(y1-y0)}" rx="1.0" fill="none" stroke="{BONE_MID}" stroke-width="0.3"/></g>')
        # medallion
        mx, r = x + 4.3, 3.55
        out.append(f'<circle cx="{f(mx)}" cy="{f(cy)}" r="{f(r)}" fill="{col}" stroke="{INK}" stroke-width="0.45"/>')
        out.append(f'<circle cx="{f(mx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#medGrad)"/>')
        out.append(f'<circle cx="{f(mx)}" cy="{f(cy)}" r="{f(r-0.4)}" fill="none" stroke="{BONE}" stroke-width="0.25"/>')
        off = (-0.1, 0.35) if icon is icon_wing else (0, 0)
        out.append(icon(mx + off[0], cy + off[1], sc))
        # number well
        fx0, fx1 = x + 8.5, x + pw - 0.9
        fy0, fy1 = y0 + 0.85, y1 - 0.85
        out.append(f'<rect x="{f(fx0)}" y="{f(fy0)}" width="{f(fx1-fx0)}" height="{f(fy1-fy0)}" rx="0.6" fill="#0d0a0b" stroke="{BONE_DK}" stroke-width="0.2"/>')
        out.append(f'<path d="M{f(fx0+0.4)},{f(fy0+0.3)} L{f(fx1-0.4)},{f(fy0+0.3)}" stroke="#000" stroke-width="0.3" opacity="0.7"/>')
        out.append(f'<text x="{f((fx0+fx1)/2)}" y="{f(fy0+1.75)}" font-family="{LABEL_FONT}" font-size="1.65" letter-spacing="0.12" '
                   f'text-anchor="middle" fill="{BONE_MID}">{label}</text>')
    out.append('</g>')
    return "\n".join(out)


def text_box():
    x0, x1, y0, y1 = COL_X0, COL_X1, TXT_Y0, TXT_Y1
    w, h = x1 - x0, y1 - y0
    dy = y0 + h * DIVIDER_FRAC
    out = [f'''<g id="text-box">
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" rx="0.8" fill="url(#parchGrad)"/>
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" rx="0.8" fill="#000" filter="url(#stain)" opacity="0.45"/>
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" rx="0.8" fill="#000" filter="url(#grain)" opacity="0.18"/>
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" rx="0.8" fill="none" stroke="{INK}" stroke-width="0.9"/>
  <g filter="url(#wobble)">
    <rect x="{f(x0-0.55)}" y="{f(y0-0.55)}" width="{f(w+1.1)}" height="{f(h+1.1)}" rx="1.2" fill="none" stroke="{BONE_MID}" stroke-width="0.3"/>
    <rect x="{f(x0+1.0)}" y="{f(y0+1.0)}" width="{f(w-2.0)}" height="{f(h-2.0)}" rx="0.4" fill="none" stroke="{PARCH_DK}" stroke-width="0.15"/>
  </g>''']
    if SECTION_LABELS:
        def header(y, label):
            tx = x0 + 2.2
            tw = len(label) * 1.38 + 0.6
            return (f'<text x="{f(tx)}" y="{f(y)}" font-family="{LABEL_FONT}" font-size="2.1" letter-spacing="0.22" '
                    f'fill="{BLOOD}">{label}</text>'
                    f'<path d="M{f(tx+tw)},{f(y-0.65)} L{f(x1-2.2)},{f(y-0.65)}" stroke="{BLOOD}" stroke-width="0.18" opacity="0.7"/>'
                    + diamond(x1 - 2.2, y - 0.65, 0.45, BLOOD, BLOOD, 0.1))
        out.append(header(y0 + 3.3, "actions"))
        # divider ornament
        out.append(f'<path d="M{f(x0+2.2)},{f(dy)} L{f(x1-2.2)},{f(dy)}" stroke="{INK}" stroke-width="0.22" opacity="0.65"/>')
        out.append(diamond((x0 + x1) / 2, dy, 0.8, PARCH, INK, 0.22))
        out.append(diamond((x0 + x1) / 2, dy, 0.3, BLOOD, BLOOD, 0.05))
        out.append(header(dy + 3.3, "passive"))
    # monster number tab
    tx0, tx1 = x1 - 10.5, x1 - 1.5
    ty0, ty1 = y1 - 1.5, y1 + 1.6
    out.append(f'<rect x="{f(tx0)}" y="{f(ty0)}" width="{f(tx1-tx0)}" height="{f(ty1-ty0)}" rx="0.6" fill="url(#plateGrad)" stroke="{INK}" stroke-width="0.45"/>')
    out.append(f'<rect x="{f(tx0)}" y="{f(ty0)}" width="{f(tx1-tx0)}" height="{f(ty1-ty0)}" rx="0.6" fill="none" stroke="{BONE_MID}" stroke-width="0.25"/>')
    out.append(f'<text x="{f(tx0+0.9)}" y="{f(ty1-0.95)}" font-family="{LABEL_FONT}" font-size="1.5" fill="{BONE_MID}">no.</text>')
    out.append('</g>')
    return "\n".join(out)


def separators():
    """Small studs where the sections meet the outer frame on the right."""
    return "\n".join([
        stud(68.25, (ART_Y1 + STAT_Y0) / 2, 0.45),
        stud(68.25, (STAT_Y1 + TXT_Y0) / 2, 0.45),
    ])


# ------------------------------------------------------------------ example fill
def example_fill():
    tf = "'EB Garamond', serif"
    cx_l = 61.6
    cy_l = (NAME_Y0 + NAME_Y1) / 2 + 0.1
    gap = 1.6
    pw = (COL_X1 - COL_X0 - 2 * gap) / 3
    stats = ["4", "1", "3"]
    parts = [
        f'<text x="{f(COL_X0 + 2.3)}" y="{f(NAME_Y1 - 2.45)}" font-family="{LABEL_FONT}" font-size="4.0" letter-spacing="0.15" fill="{BONE}">Hollow Warden</text>',
        f'<text x="{f(cx_l)}" y="{f(cy_l + 2.0)}" font-family="{NUM_FONT}" font-weight="bold" font-size="4.6" text-anchor="middle" fill="{BONE}">3</text>',
        # placeholder art
        f'<g opacity="0.85"><circle cx="39.7" cy="35" r="13" fill="none" stroke="{BONE_DK}" stroke-width="0.4" stroke-dasharray="1 1"/>'
        f'<text x="39.7" y="36.2" font-family="{LABEL_FONT}" font-size="3" letter-spacing="0.4" text-anchor="middle" fill="{BONE_DK}">art</text></g>',
        f'<text x="{f(COL_X1 - 6.0)}" y="{f(TXT_Y1 + 0.65)}" font-family="{NUM_FONT}" font-size="1.7" text-anchor="middle" fill="{BONE}">017</text>',
    ]
    for k, v in enumerate(stats):
        x = COL_X0 + k * (pw + gap)
        fx0, fx1 = x + 8.5, x + pw - 0.9
        parts.append(f'<text x="{f((fx0+fx1)/2)}" y="{f(STAT_Y1 - 1.55)}" font-family="{NUM_FONT}" font-weight="bold" font-size="4.3" '
                     f'text-anchor="middle" fill="{BONE}">{v}</text>')
    lines_actions = [
        ("<tspan font-weight='bold'>MOVE 3</tspan> toward the nearest player.",),
        ("<tspan font-weight='bold'>ATTACK</tspan> 1 range, 1 player: drain",),
        ("2 sanity.",),
        ("Place an acid token at this monster's",),
        ("location.",),
    ]
    lines_passive = [
        ("Players that share a tile with this",),
        ("monster lose 1 sanity at the end of",),
        ("the round.",),
    ]
    y = TXT_Y0 + 7.2
    for (ln,) in lines_actions:
        parts.append(f'<text x="{f(COL_X0 + 2.4)}" y="{f(y)}" font-family="{tf}" font-size="2.55" fill="{INK}">{ln}</text>')
        y += 3.05
    dy = TXT_Y0 + (TXT_Y1 - TXT_Y0) * DIVIDER_FRAC
    y = dy + 7.2
    for (ln,) in lines_passive:
        parts.append(f'<text x="{f(COL_X0 + 2.4)}" y="{f(y)}" font-family="{tf}" font-style="italic" font-size="2.55" fill="{INK}">{ln}</text>')
        y += 3.05
    # a token on HP 14 to show tracking
    top = HB_Y0 + HB_CAP + 0.3
    pitch = (HB_Y1 - 0.6 - top) / 21
    cy = top + (20 - 14) * pitch + pitch / 2
    cx = (HB_X0 + HB_X1) / 2
    parts.append(f'<g opacity="0.92"><rect x="{f(cx-2.3)}" y="{f(cy-2.3)}" width="4.6" height="4.6" rx="0.6" fill="#c9a227" stroke="{INK}" stroke-width="0.3"/>'
                 f'<rect x="{f(cx-2.3)}" y="{f(cy-2.3)}" width="4.6" height="1.3" rx="0.6" fill="#fff" opacity="0.25"/></g>')
    return '<g id="example">' + "\n".join(parts) + '</g>'


# ------------------------------------------------------------------ assemble
def build(bleed=0.0, example=False):
    cw, ch = W + 2 * bleed, H + 2 * bleed
    body = "\n".join([
        outer_border(),
        health_bar(),
        art_window(),
        name_banner(),
        level_badge(),
        stat_plates(),
        text_box(),
        example_fill() if example else "",
    ])
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{f(cw)}mm" height="{f(ch)}mm" viewBox="0 0 {f(cw)} {f(ch)}">
{defs()}
{background(0, 0, cw, ch)}
<g id="card" transform="translate({f(bleed)},{f(bleed)})">
{body}
</g>
</svg>
'''


if __name__ == "__main__":
    (OUT / "monster_frame.svg").write_text(build())
    (OUT / "monster_frame_bleed.svg").write_text(build(bleed=3.0))
    (OUT / "monster_frame_example.svg").write_text(build(example=True))
    print("wrote SVGs to", OUT)
