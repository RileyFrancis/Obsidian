#!/usr/bin/env python3
"""
Generates the monster card frame (tarot size, 70 x 120 mm) as SVG.

All coordinates are in millimetres. Run ./render.sh to regenerate the SVGs
and render 300 DPI PNGs with Inkscape.

Outputs (next to this script):
    monster_frame.svg          trim size 70x120mm
    monster_frame_bleed.svg    76x126mm (3mm bleed each side, for print shops)
    monster_frame_example.svg  trim size, filled in with a sample monster
"""
from pathlib import Path
import math

OUT = Path(__file__).resolve().parent

W, H = 70.0, 120.0

# ---- palette: black void, cold bone, spectral soul-green ----
VOID = "#050909"
STONE = "#0f1615"
STONE_HI = "#1c2826"
BONE = "#d4d9c8"
BONE_MID = "#8fa49b"
BONE_DK = "#435851"
SOUL = "#62f5c8"          # bright spectral glow
SOUL_MID = "#2bb592"
SOUL_DK = "#0d4639"
INK = "#030606"
PARCH = "#cfcdb5"
PARCH_DK = "#959c87"
BLOOD_HI = "#6e1a1d"      # HP drop only; set to SOUL_MID for an all-soul look
ATK_C, DEF_C, SPD_C = "#5b1e24", "#233f52", "#1a5546"

LABEL_FONT = "'EB Garamond SC', 'EB Garamond', serif"
NUM_FONT = "'Linux Libertine O', 'EB Garamond', serif"

# ---- layout ----
HB_X0, HB_X1 = 3.0, 11.4        # health bar channel
HB_Y0, HB_Y1 = 3.0, 117.0
HB_CAP = 5.6                    # space at top of bar for the HP drop
COL_X0, COL_X1 = 12.6, 66.8     # main column
NAME_Y0, NAME_Y1 = 3.2, 11.4
ART_Y0, ART_Y1 = 12.9, 55.4
STAT_Y0, STAT_Y1 = 56.9, 68.1
TXT_Y0, TXT_Y1 = 69.7, 114.6
STAT_GAP = 1.6


def f(v):
    return f"{v:.3f}".rstrip("0").rstrip(".")


# ------------------------------------------------------------------ icons
def icon_sword(cx, cy, s):
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
  <path d="M-1.15,0.6 C-1.15,1.4 -0.7,2.0 -0.1,2.2" fill="none" stroke="{BONE_MID}" stroke-width="0.3" stroke-linecap="round" opacity="0.45"/>
</g>'''


def icon_skull(cx, cy, s):
    return f'''<g transform="translate({f(cx)},{f(cy)}) scale({f(s)})">
  <path d="M-2.1,0.6 C-2.6,-1.2 -1.6,-2.6 0,-2.6 C1.6,-2.6 2.6,-1.2 2.1,0.6 L1.5,1.0 L1.4,2.1 L-1.4,2.1 L-1.5,1.0 Z" fill="{BONE}" stroke="{INK}" stroke-width="0.3"/>
  <ellipse cx="-0.85" cy="-0.35" rx="0.6" ry="0.68" fill="{SOUL_DK}"/>
  <ellipse cx="0.85" cy="-0.35" rx="0.6" ry="0.68" fill="{SOUL_DK}"/>
  <ellipse cx="-0.85" cy="-0.3" rx="0.28" ry="0.32" fill="{SOUL}"/>
  <ellipse cx="0.85" cy="-0.3" rx="0.28" ry="0.32" fill="{SOUL}"/>
  <path d="M0,0.55 L-0.32,1.1 L0.32,1.1 Z" fill="{INK}"/>
  <path d="M-0.7,1.35 L-0.7,2.1 M0,1.35 L0,2.1 M0.7,1.35 L0.7,2.1" stroke="{INK}" stroke-width="0.2"/>
</g>'''


# health cell colours: reddish-purple at 20 -> purple -> blue at 0
HP_RAMP = [(0.0, "#5e1a3c"), (0.5, "#3f1b5c"), (1.0, "#1b2e60")]


def _hex(c):
    return tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))


def _mix(a, b, t):
    return "#" + "".join(f"{round(x + (y - x) * t):02x}" for x, y in zip(_hex(a), _hex(b)))


def _scale(c, k):
    return "#" + "".join(f"{min(255, round(x * k)):02x}" for x in _hex(c))


HP_RAMP_END = 0.65   # how far along HP_RAMP the 0 cell reaches (1.0 = full blue)


def hp_color(val):
    t = (20 - val) / 20 * HP_RAMP_END
    for (t0, c0), (t1, c1) in zip(HP_RAMP, HP_RAMP[1:]):
        if t <= t1:
            return _mix(c0, c1, (t - t0) / (t1 - t0))
    return HP_RAMP[-1][1]


def hp_gradients():
    out = []
    for val in range(21):
        c = hp_color(val)
        out.append(f'<linearGradient id="hp{val}" x1="0" y1="0" x2="0" y2="1">'
                   f'<stop offset="0" stop-color="{_scale(c, 0.5)}"/><stop offset="1" stop-color="{c}"/></linearGradient>')
    return "\n  ".join(out)


def diamond(cx, cy, r, fill=BONE_MID, stroke=INK, sw=0.2):
    return (f'<path d="M{f(cx)},{f(cy-r)} L{f(cx+r)},{f(cy)} L{f(cx)},{f(cy+r)} L{f(cx-r)},{f(cy)} Z" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="{f(sw)}"/>')


def well(x0, y0, x1, y1, fill="#070c0c", stroke=BONE_DK, rx=0.6):
    """Recessed box for a value to be written in."""
    return (f'<rect x="{f(x0)}" y="{f(y0)}" width="{f(x1-x0)}" height="{f(y1-y0)}" rx="{f(rx)}" '
            f'fill="{fill}" stroke="{stroke}" stroke-width="0.2"/>'
            f'<path d="M{f(x0+0.4)},{f(y0+0.3)} L{f(x1-0.4)},{f(y0+0.3)}" stroke="#000" stroke-width="0.3" opacity="0.7"/>')


# ------------------------------------------------------------------ defs
def defs():
    return f'''<defs>
  <!-- slight hand-inked wobble on frame linework -->
  <filter id="wobble" x="-2%" y="-2%" width="104%" height="104%">
    <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="0.32" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
  <!-- soft spectral glow -->
  <filter id="glow" x="-10%" y="-10%" width="120%" height="120%">
    <feGaussianBlur stdDeviation="0.55"/>
  </filter>
  <!-- drifting soul mist on the background -->
  <filter id="mist" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="4" seed="11" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.75  0 0 0 0 0.62  0 0 0 2.4 -1.2"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
  <!-- cool grime used on plates -->
  <filter id="grime" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="4" seed="5" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.55  0 0 0 0 0.52  0 0 0 2.2 -1.05"/>
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
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.22  0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 2.6 -1.35"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>

  <radialGradient id="artGrad" cx="50%" cy="45%" r="70%">
    <stop offset="0" stop-color="#1f3a35"/>
    <stop offset="0.6" stop-color="#101c1a"/>
    <stop offset="1" stop-color="#060b0b"/>
  </radialGradient>
  <radialGradient id="parchGrad" cx="50%" cy="45%" r="75%">
    <stop offset="0" stop-color="{PARCH}"/>
    <stop offset="0.75" stop-color="#c0c0a6"/>
    <stop offset="1" stop-color="{PARCH_DK}"/>
  </radialGradient>
  <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#26332f"/>
    <stop offset="1" stop-color="#121a18"/>
  </linearGradient>
  <linearGradient id="cellGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#08110f"/>
    <stop offset="1" stop-color="#0f2a24"/>
  </linearGradient>
  <linearGradient id="modGrad" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#062019"/>
    <stop offset="1" stop-color="#0d3a30"/>
  </linearGradient>
  {hp_gradients()}
  <radialGradient id="lvlGrad" cx="50%" cy="50%" r="60%">
    <stop offset="0" stop-color="#1d6b58"/>
    <stop offset="0.7" stop-color="#0b2e27"/>
    <stop offset="1" stop-color="#051310"/>
  </radialGradient>
  <radialGradient id="medGrad" cx="40%" cy="35%" r="70%">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.18"/>
    <stop offset="1" stop-color="#000000" stop-opacity="0.35"/>
  </radialGradient>
</defs>'''


# ------------------------------------------------------------------ parts
def background(x, y, w, h, mask=None):
    m = f' mask="url(#{mask})"' if mask else ""
    return f'''<g id="background"{m}>
  <rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{VOID}"/>
  <rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{STONE}"/>
  <rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="#000" filter="url(#mist)" opacity="0.45"/>
  <rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="#000" filter="url(#grain)" opacity="0.35"/>
</g>'''


def outer_border():
    return f'''<g id="outer-border">
  <rect x="1.5" y="1.5" width="{f(W-3)}" height="{f(H-3)}" rx="2.2" fill="none" stroke="{SOUL}" stroke-width="0.6" opacity="0.35" filter="url(#glow)"/>
  <g filter="url(#wobble)">
    <rect x="1.5" y="1.5" width="{f(W-3)}" height="{f(H-3)}" rx="2.2" fill="none" stroke="{BONE_MID}" stroke-width="0.4"/>
    <rect x="2.15" y="2.15" width="{f(W-4.3)}" height="{f(H-4.3)}" rx="1.7" fill="none" stroke="{BONE_DK}" stroke-width="0.18"/>
  </g>
</g>'''


def hb_cells():
    """Yields (value, x, y, w, h) for each of the 21 health cells, 20 at top."""
    top = HB_Y0 + HB_CAP + 0.3
    bot = HB_Y1 - 0.6
    n = 21
    pitch = (bot - top) / n
    gap = 0.55
    cw = HB_X1 - HB_X0 - 2.0
    for i in range(n):
        yield 20 - i, HB_X0 + 1.0, top + i * pitch + gap / 2, cw, pitch - gap


def health_bar():
    out = ['<g id="health-bar">']
    w = HB_X1 - HB_X0
    cx = (HB_X0 + HB_X1) / 2
    out.append(f'<rect x="{f(HB_X0)}" y="{f(HB_Y0)}" width="{f(w)}" height="{f(HB_Y1-HB_Y0)}" rx="1.4" '
               f'fill="#070c0c" stroke="{INK}" stroke-width="0.6"/>')
    out.append(f'<g filter="url(#wobble)"><rect x="{f(HB_X0)}" y="{f(HB_Y0)}" width="{f(w)}" height="{f(HB_Y1-HB_Y0)}" rx="1.4" '
               f'fill="none" stroke="{BONE_MID}" stroke-width="0.35"/></g>')
    out.append(icon_drop(cx, HB_Y0 + HB_CAP / 2 + 0.25, 0.85))
    for val, x, y, cw, ch in hb_cells():
        out.append(f'<rect x="{f(x)}" y="{f(y)}" width="{f(cw)}" height="{f(ch)}" rx="0.75" '
                   f'fill="url(#hp{val})" stroke="{_mix(hp_color(val), BONE_MID, 0.45)}" stroke-width="0.22"/>')
        out.append(f'<path d="M{f(x+0.5)},{f(y+0.35)} L{f(x+cw-0.5)},{f(y+0.35)}" stroke="#000" stroke-width="0.25" opacity="0.6"/>')
        cy = y + ch / 2
        if val == 0:
            out.append(icon_skull(cx, cy, 0.72))
        else:
            out.append(f'<text x="{f(cx)}" y="{f(cy + 0.95)}" font-family="{NUM_FONT}" font-size="2.7" '
                       f'text-anchor="middle" fill="{BONE_MID}">{val}</text>')
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
    <path d="{inner}" fill="none" stroke="{SOUL_DK}" stroke-width="0.22"/>
  </g>
  {diamond(x0 + 0.05, ym, 0.75, SOUL_MID)}
</g>'''


def level_badge():
    cx, cy = 61.6, (NAME_Y0 + NAME_Y1) / 2 + 0.1
    r_out, r_ring, r_in = 5.6, 4.85, 3.85
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
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_out)}" fill="{SOUL}" opacity="0.35" filter="url(#glow)"/>
  <path d="{' '.join(teeth)}" fill="{BONE_MID}" stroke="{INK}" stroke-width="0.25" stroke-linejoin="round"/>
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_ring+0.1)}" fill="{STONE_HI}" stroke="{INK}" stroke-width="0.45"/>
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_ring-0.25)}" fill="none" stroke="{BONE}" stroke-width="0.3"/>
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_in)}" fill="url(#lvlGrad)" stroke="{INK}" stroke-width="0.35"/>
  <circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r_in-0.45)}" fill="none" stroke="{SOUL_MID}" stroke-width="0.18" opacity="0.8"/>
  <text x="{f(cx)}" y="{f(cy - 2.05)}" font-family="{LABEL_FONT}" font-size="1.25" letter-spacing="0.1" text-anchor="middle" fill="{BONE_MID}">lvl</text>
</g>'''


def art_window(transparent=False):
    x0, x1, y0, y1 = COL_X0, COL_X1, ART_Y0, ART_Y1
    w, h = x1 - x0, y1 - y0
    fill = "none" if transparent else "url(#artGrad)"
    mist = "" if transparent else (f'<rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" fill="#000" '
                                   f'filter="url(#mist)" opacity="0.3"/>')
    out = [f'''<g id="art-window">
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" fill="none" stroke="{SOUL}" stroke-width="0.9" opacity="0.45" filter="url(#glow)"/>
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" fill="{fill}" stroke="{INK}" stroke-width="0.8"/>
  {mist}
  <g filter="url(#wobble)">
    <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" fill="none" stroke="{BONE}" stroke-width="0.4"/>
    <rect x="{f(x0+0.8)}" y="{f(y0+0.8)}" width="{f(w-1.6)}" height="{f(h-1.6)}" fill="none" stroke="{SOUL_DK}" stroke-width="0.22"/>
  </g>''']
    L = 3.2
    for (cx, cy, sx, sy) in [(x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)]:
        out.append(f'<path d="M{f(cx+sx*0.4)},{f(cy+sy*(L+0.4))} L{f(cx+sx*0.4)},{f(cy+sy*0.4)} L{f(cx+sx*(L+0.4))},{f(cy+sy*0.4)}" '
                   f'fill="none" stroke="{BONE}" stroke-width="0.55" stroke-linecap="square"/>')
        out.append(diamond(cx + sx * 1.55, cy + sy * 1.55, 0.6, SOUL_MID))
    out.append('</g>')
    return "\n".join(out)


def stat_layout():
    """Yields (x, pw, (top well), (bottom well)) for the three stat plates."""
    pw = (COL_X1 - COL_X0 - 2 * STAT_GAP) / 3
    cy = (STAT_Y0 + STAT_Y1) / 2
    for k in range(3):
        x = COL_X0 + k * (pw + STAT_GAP)
        fx0, fx1 = x + 8.7, x + pw - 0.9
        top = (fx0, STAT_Y0 + 0.85, fx1, cy - 0.3)
        bot = (fx0, cy + 0.3, fx1, STAT_Y1 - 0.85)
        yield x, pw, top, bot


def stat_plates():
    out = ['<g id="stats">']
    y0, y1 = STAT_Y0, STAT_Y1
    cy = (y0 + y1) / 2
    specs = [(ATK_C, icon_sword, 0.66), (DEF_C, icon_shield, 0.66), (SPD_C, icon_wing, 0.64)]
    for (x, pw, top, bot), (col, icon, sc) in zip(stat_layout(), specs):
        out.append(f'<rect x="{f(x)}" y="{f(y0)}" width="{f(pw)}" height="{f(y1-y0)}" rx="1.0" fill="url(#plateGrad)" stroke="{INK}" stroke-width="0.6"/>')
        out.append(f'<g filter="url(#wobble)"><rect x="{f(x)}" y="{f(y0)}" width="{f(pw)}" height="{f(y1-y0)}" rx="1.0" fill="none" stroke="{BONE_MID}" stroke-width="0.3"/></g>')
        mx, r = x + 4.4, 3.75
        out.append(f'<circle cx="{f(mx)}" cy="{f(cy)}" r="{f(r)}" fill="{col}" stroke="{INK}" stroke-width="0.45"/>')
        out.append(f'<circle cx="{f(mx)}" cy="{f(cy)}" r="{f(r)}" fill="url(#medGrad)"/>')
        out.append(f'<circle cx="{f(mx)}" cy="{f(cy)}" r="{f(r-0.4)}" fill="none" stroke="{BONE}" stroke-width="0.25"/>')
        off = (-0.1, 0.35) if icon is icon_wing else (0, 0)
        out.append(icon(mx + off[0], cy + off[1], sc))
        # top: base value / bottom: transform modifier (soul-tinted)
        out.append(well(*top))
        out.append(well(*bot, fill="url(#modGrad)", stroke=SOUL_MID))
    out.append('</g>')
    return "\n".join(out)


def id_plate_layout():
    """Number well (3 digits) and set well (4 letters) at the bottom right."""
    x1 = COL_X1 - 1.5
    num_w, set_w, pad, gap = 5.6, 7.8, 0.55, 0.5
    x0 = x1 - (pad * 2 + num_w + gap + set_w)
    y0, y1 = TXT_Y1 - 1.6, TXT_Y1 + 1.7
    nw = (x0 + pad, y0 + 0.45, x0 + pad + num_w, y1 - 0.45)
    sw = (nw[2] + gap, y0 + 0.45, nw[2] + gap + set_w, y1 - 0.45)
    return (x0, y0, x1, y1), nw, sw


def text_box():
    x0, x1, y0, y1 = COL_X0, COL_X1, TXT_Y0, TXT_Y1
    w, h = x1 - x0, y1 - y0
    out = [f'''<g id="text-box">
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" rx="0.8" fill="url(#parchGrad)"/>
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" rx="0.8" fill="#000" filter="url(#stain)" opacity="0.45"/>
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" rx="0.8" fill="#000" filter="url(#grain)" opacity="0.18"/>
  <rect x="{f(x0)}" y="{f(y0)}" width="{f(w)}" height="{f(h)}" rx="0.8" fill="none" stroke="{INK}" stroke-width="0.9"/>
  <g filter="url(#wobble)">
    <rect x="{f(x0-0.55)}" y="{f(y0-0.55)}" width="{f(w+1.1)}" height="{f(h+1.1)}" rx="1.2" fill="none" stroke="{BONE_MID}" stroke-width="0.3"/>
    <rect x="{f(x0+1.0)}" y="{f(y0+1.0)}" width="{f(w-2.0)}" height="{f(h-2.0)}" rx="0.4" fill="none" stroke="{PARCH_DK}" stroke-width="0.15"/>
  </g>''']
    (px0, py0, px1, py1), nw, sw = id_plate_layout()
    out.append(f'<rect x="{f(px0)}" y="{f(py0)}" width="{f(px1-px0)}" height="{f(py1-py0)}" rx="0.7" fill="url(#plateGrad)" stroke="{INK}" stroke-width="0.45"/>')
    out.append(f'<rect x="{f(px0)}" y="{f(py0)}" width="{f(px1-px0)}" height="{f(py1-py0)}" rx="0.7" fill="none" stroke="{BONE_MID}" stroke-width="0.25"/>')
    out.append(well(*nw, rx=0.4))
    out.append(well(*sw, rx=0.4))
    out.append('</g>')
    return "\n".join(out)


# ------------------------------------------------------------------ example fill
def example_fill():
    tf = "'EB Garamond', serif"
    cx_l = 61.6
    cy_l = (NAME_Y0 + NAME_Y1) / 2 + 0.1
    parts = [
        f'<text x="{f(COL_X0 + 2.3)}" y="{f(NAME_Y1 - 2.45)}" font-family="{LABEL_FONT}" font-size="4.0" letter-spacing="0.15" fill="{BONE}">Hollow Warden</text>',
        f'<text x="{f(cx_l)}" y="{f(cy_l + 2.0)}" font-family="{NUM_FONT}" font-weight="bold" font-size="4.6" text-anchor="middle" fill="{BONE}">3</text>',
        f'<g opacity="0.85"><circle cx="39.7" cy="34.1" r="12" fill="none" stroke="{BONE_DK}" stroke-width="0.4" stroke-dasharray="1 1"/>'
        f'<text x="39.7" y="35.2" font-family="{LABEL_FONT}" font-size="3" letter-spacing="0.4" text-anchor="middle" fill="{BONE_DK}">art</text></g>',
    ]
    _, nw, sw = id_plate_layout()
    for (a, b, c, d), txt in [(nw, "017"), (sw, "CORE")]:
        parts.append(f'<text x="{f((a+c)/2)}" y="{f(d - 0.72)}" font-family="{NUM_FONT}" font-size="1.85" letter-spacing="0.1" '
                     f'text-anchor="middle" fill="{BONE}">{txt}</text>')
    for (x, pw, top, bot), base, mod in zip(stat_layout(), ["4", "1", "3"], ["+2", "+1", "–"]):
        parts.append(f'<text x="{f((top[0]+top[2])/2)}" y="{f(top[3] - 0.95)}" font-family="{NUM_FONT}" font-weight="bold" font-size="3.6" '
                     f'text-anchor="middle" fill="{BONE}">{base}</text>')
        parts.append(f'<text x="{f((bot[0]+bot[2])/2)}" y="{f(bot[3] - 1.0)}" font-family="{NUM_FONT}" font-weight="bold" font-size="3.0" '
                     f'text-anchor="middle" fill="{SOUL}">{mod}</text>')
    lines = [
        ("b", "Actions"),
        ("", "<tspan font-weight='bold'>MOVE 3</tspan> toward the nearest player."),
        ("", "<tspan font-weight='bold'>ATTACK</tspan> 1 range, 1 player: drain"),
        ("", "2 sanity."),
        ("", "Place an acid token at this monster's"),
        ("", "location."),
        ("gap", ""),
        ("b", "Passive"),
        ("i", "Players that share a tile with this"),
        ("i", "monster lose 1 sanity at the end of"),
        ("i", "the round."),
    ]
    y = TXT_Y0 + 4.6
    for kind, ln in lines:
        if kind == "gap":
            y += 1.5
            continue
        attrs = {"b": f"font-family=\"{LABEL_FONT}\" letter-spacing='0.2' fill='#1d4a40'",
                 "i": f"font-style='italic' fill='{INK}'", "": f"fill='{INK}'"}[kind]
        fam = "" if kind == "b" else f'font-family="{tf}"'
        parts.append(f'<text x="{f(COL_X0 + 2.4)}" y="{f(y)}" {fam} font-size="2.55" {attrs}>{ln.lower() if kind == "b" else ln}</text>')
        y += 3.05
    # a token on HP 14 to show tracking
    for val, x, cy0, cw, ch in hb_cells():
        if val == 14:
            cx, cy = x + cw / 2, cy0 + ch / 2
            parts.append(f'<g opacity="0.92"><rect x="{f(cx-2.3)}" y="{f(cy-2.3)}" width="4.6" height="4.6" rx="0.6" fill="#c9a227" stroke="{INK}" stroke-width="0.3"/>'
                         f'<rect x="{f(cx-2.3)}" y="{f(cy-2.3)}" width="4.6" height="1.3" rx="0.6" fill="#fff" opacity="0.25"/></g>')
    return '<g id="example">' + "\n".join(parts) + '</g>'


# ------------------------------------------------------------------ assemble
def build(bleed=0.0, example=False, transparent_art=None):
    """transparent_art: cut the art window out so artwork can sit underneath.
    Defaults to True for blank frames, False for the filled-in example."""
    if transparent_art is None:
        transparent_art = not example
    cw, ch = W + 2 * bleed, H + 2 * bleed
    hole = ""
    if transparent_art:
        hole = (f'<mask id="artHole" maskUnits="userSpaceOnUse" x="0" y="0" width="{f(cw)}" height="{f(ch)}">'
                f'<rect width="{f(cw)}" height="{f(ch)}" fill="#fff"/>'
                f'<rect x="{f(COL_X0 + bleed)}" y="{f(ART_Y0 + bleed)}" width="{f(COL_X1 - COL_X0)}" '
                f'height="{f(ART_Y1 - ART_Y0)}" fill="#000"/></mask>')
    body = "\n".join([
        outer_border(),
        health_bar(),
        art_window(transparent_art),
        name_banner(),
        level_badge(),
        stat_plates(),
        text_box(),
        example_fill() if example else "",
    ])
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{f(cw)}mm" height="{f(ch)}mm" viewBox="0 0 {f(cw)} {f(ch)}">
{defs().replace("</defs>", hole + "</defs>")}
{background(0, 0, cw, ch, "artHole" if transparent_art else None)}
<g id="card" transform="translate({f(bleed)},{f(bleed)})">
{body}
</g>
</svg>
'''


def build_background(bleed=0.0):
    """Just the background texture (dark stone, soul mist, grain), no frame."""
    cw, ch = W + 2 * bleed, H + 2 * bleed
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{f(cw)}mm" height="{f(ch)}mm" viewBox="0 0 {f(cw)} {f(ch)}">
{defs()}
{background(0, 0, cw, ch)}
</svg>
'''


if __name__ == "__main__":
    (OUT / "monster_background.svg").write_text(build_background())
    (OUT / "monster_background_bleed.svg").write_text(build_background(bleed=3.0))
    (OUT / "monster_frame.svg").write_text(build())
    (OUT / "monster_frame_bleed.svg").write_text(build(bleed=3.0))
    (OUT / "monster_frame_example.svg").write_text(build(example=True))
    print("wrote SVGs to", OUT)
