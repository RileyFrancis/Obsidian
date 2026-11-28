#!/usr/bin/env python3
"""
Builds 'Monster Cards.xlsx':
  Monsters  - human-readable page you type into
  Dextrous  - exactly the fields the Dextrous layout uses, filled by formulas
  How to use, Lists
Usage: python make_card_sheet.py "Monster Cards.xlsx"   (env ROWS=n to change row count)
"""
import os
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as L
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
from openpyxl.comments import Comment

OUT = sys.argv[1]
ROWS = int(os.environ.get("ROWS", 200))   # monster rows pre-filled with formulas
ABILITIES = 5
PLAYERS = 6
FONT = "Arial"
TYPES = ["move", "attack", "transform", "action"]

wb = Workbook()
ws = wb.active
ws.title = "Monsters"


def fill(h):
    return PatternFill("solid", start_color=h, end_color=h)


HDR = {"id": "1D4A40", "check": "444444", "stats": "6A1A1A", "hp": "4A2466",
       "ab": "1A5546", "pas": "233F52", "auto": "7F7F7F"}
AUTO_FILL = fill("EDEDED")
AUTO_FONT = Font(name=FONT, size=10, color="595959")
IN_FONT = Font(name=FONT, size=10)
thin = Side(style="thin", color="D0D0D0")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

# ================================================================ Monsters page
mcols = []  # (key, header, group, width, note, is_input, text_format)


def add(key, header, group, width, note, inp=True, txt=False):
    mcols.append((key, header, group, width, note, inp, txt))


add("number", "Number", "id", 9, "3-digit card number, e.g. 017.", txt=True)
add("expansion", "Expansion", "id", 10, "4-letter set / expansion code, e.g. CORE.", txt=True)
add("name", "Name", "id", 22, "Monster name.")
add("check", "Check", "check", 34, "AUTO: 'OK', or the problems with this row.", inp=False)
add("level", "Level", "id", 7, "Monster level.")
add("image", "Image", "id", 20, "Art image filename as uploaded to Dextrous, e.g. hollow-warden.png.")
for s, nm in [("atk", "Attack"), ("def", "Defense"), ("spd", "Speed")]:
    add(f"{s}_main", s.upper(), "stats", 6, f"{nm}: base value (top box).")
    add(f"{s}_tsf", f"{s.upper()} +T", "stats", 7, f"{nm}: transform modifier (bottom box), e.g. +2. Blank or – for none.", txt=True)
for p in range(1, PLAYERS + 1):
    add(f"hp{p}", f"HP {p}P", "hp", 6, f"Starting health with {p} player{'s' if p > 1 else ''} (0–20). Blank if unused.")
for n in range(1, ABILITIES + 1):
    add(f"t{n}", f"Ability {n}", "ab", 11, "move, attack, transform or action. Abilities are listed in the order the monster performs them.")
    add(f"a{n}", f"#1", "ab", 5, "MOVE: distance 1–12.  ATTACK: range 0–6 or inf.  Otherwise blank.")
    add(f"b{n}", f"#2", "ab", 5, "ATTACK: number of players 1–4 or inf.  Otherwise blank.")
    add(f"x{n}", f"Ability {n} text", "ab", 34, "Rules text that goes beside the badge.")
add("passive", "Passive", "pas", 40, "Passive ability text.")

MC = {k: L(i + 1) for i, (k, *_) in enumerate(mcols)}

# ================================================================ Lists page
ls = wb.create_sheet("Lists")
lists = {
    "A": ("Ability types", TYPES),
    "B": ("Allowed #1/#2", [str(i) for i in range(0, 13)] + ["inf"]),
    "C": ("MOVE distance", [str(i) for i in range(1, 13)]),
    "D": ("ATTACK range", [str(i) for i in range(0, 7)] + ["inf"]),
    "E": ("ATTACK players", [str(i) for i in range(1, 5)] + ["inf"]),
}
for col, (h, vals) in lists.items():
    c = ls[f"{col}1"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True, color="FFFFFF"), fill(HDR["auto"])
    for i, v in enumerate(vals, start=2):
        c = ls[f"{col}{i}"]
        c.value, c.number_format, c.font = v, "@", IN_FONT
    ls.column_dimensions[col].width = 16


def rng(col):
    return f"Lists!${col}$2:${col}${len(lists[col][1]) + 1}"


# folder prefixes for Dextrous image paths (editable on the Lists page)
ABILITY_DIR, PLAYER_DIR = "Lists!$G$2", "Lists!$H$2"
for col, h, v in [("G", "Ability icon folder", "ability_tags/"), ("H", "Player tag folder", "player_tags/")]:
    c = ls[f"{col}1"]
    c.value, c.font, c.fill = h, Font(name=FONT, bold=True, color="FFFFFF"), fill(HDR["id"])
    c = ls[f"{col}2"]
    c.value, c.font, c.fill, c.number_format = v, Font(name=FONT, size=10, bold=True), fill("FFF2CC"), "@"
    c.comment = Comment("Folder prefix added in front of the image filenames on the Dextrous page. "
                        "Change it here if your Dextrous folder name or path format differs.", "Card sheet")
    ls.column_dimensions[col].width = 20


# ================================================================ Monsters: header + rows
for i, (k, h, g, w, note, inp, txt) in enumerate(mcols, start=1):
    c = ws.cell(row=1, column=i, value=h)
    c.font = Font(name=FONT, bold=True, color="FFFFFF", size=10)
    c.fill = fill(HDR[g])
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = BORDER
    c.comment = Comment(note, "Card sheet")
    ws.column_dimensions[L(i)].width = w
ws.row_dimensions[1].height = 30
ws.freeze_panes = "D2"


def m(key, r):
    return f"{MC[key]}{r}"


def check_formula(r):
    hp = f"{MC['hp1']}{r}:{MC[f'hp{PLAYERS}']}{r}"
    num, ex = m("number", r), m("expansion", r)
    parts = [
        f'IF({num}="","Missing number. ","")',
        f'IF(AND({num}<>"",OR(LEN({num}&"")<>3,NOT(ISNUMBER(IFERROR(--({num}&""),"x"))))),"Number must be 3 digits. ","")',
        f'IF(LEN({ex})<>4,"Expansion must be 4 letters. ","")',
        f'IF(COUNTIF({hp},">20")+COUNTIF({hp},"<0")>0,"Start HP must be 0–20. ","")',
        f'IF(SUMPRODUCT(({hp}<>"")*(COUNTIF({hp},{hp})>1))>0,"Two player counts share a start HP (only one marker fits per box). ","")',
    ]
    for n in range(1, ABILITIES + 1):
        T, A, B, X = m(f"t{n}", r), m(f"a{n}", r), m(f"b{n}", r), m(f"x{n}", r)
        parts += [
            f'IF(AND({T}="move",ISNA(MATCH({A}&"",{rng("C")},0))),"Ability {n}: MOVE distance must be 1–12. ","")',
            f'IF(AND({T}="attack",OR(ISNA(MATCH({A}&"",{rng("D")},0)),ISNA(MATCH({B}&"",{rng("E")},0)))),'
            f'"Ability {n}: ATTACK needs range 0–6/inf and players 1–4/inf. ","")',
            f'IF(AND({T}="",{X}<>""),"Ability {n}: pick a type. ","")',
            f'IF(AND({T}<>"",ISNA(MATCH({T},{rng("A")},0))),"Ability {n}: unknown type. ","")',
        ]
    j = "&".join(parts)
    return f'=IF({m("name", r)}="","",IF({j}="","OK",TRIM({j})))'


examples = [
    {"number": "001", "expansion": "CORE", "name": "Hollow Warden", "level": 3, "image": "hollow-warden.png",
     "atk_main": 4, "atk_tsf": "+2", "def_main": 1, "def_tsf": "+1", "spd_main": 3, "spd_tsf": "–",
     "hp1": 8, "hp2": 10, "hp3": 12, "hp4": 14, "hp5": 16, "hp6": 18,
     "ab": [("move", 3, None, "toward the nearest player."),
            ("attack", 1, 1, "Drain 2 sanity."),
            ("action", None, None, "Place an acid token at this monster's location."),
            ("transform", None, None, "After 10 rounds.")],
     "passive": "Players that share a tile with this monster lose 1 sanity at the end of the round."},
    {"number": "002", "expansion": "CORE", "name": "Wailing Shade", "level": 5, "image": "wailing-shade.png",
     "atk_main": 2, "def_main": 0, "spd_main": 6,
     "hp1": 5, "hp2": 7, "hp3": 9, "hp4": 11, "hp5": 13, "hp6": 15,
     "ab": [("move", 8, None, "toward the nearest player that lost health during their last turn."),
            ("attack", "inf", "inf", "Drain 1 sanity.")],
     "passive": "This monster cannot be attacked by players with 5 or more sanity."},
]

last = ROWS + 1
for r in range(2, last + 1):
    ex = examples[r - 2] if r - 2 < len(examples) else {}
    vals = {k: v for k, v in ex.items() if k != "ab"}
    for n, (t, a, b, x) in enumerate(ex.get("ab", []), start=1):
        vals.update({f"t{n}": t, f"a{n}": a, f"b{n}": b, f"x{n}": x})
    for i, (k, h, g, w, note, inp, txt) in enumerate(mcols, start=1):
        c = ws.cell(row=r, column=i)
        c.border = BORDER
        if inp:
            c.value = vals.get(k)
            c.font = IN_FONT
            if txt:
                c.number_format = "@"
            wide = k.startswith("x") or k in ("passive", "name", "image")
            c.alignment = Alignment(horizontal="left" if wide else "center", vertical="top")
        else:
            c.value = check_formula(r)
            c.font, c.fill = AUTO_FONT, AUTO_FILL
            c.alignment = Alignment(vertical="top")

# validation on Monsters
def dv(kind, cols_, msg, title, **kw):
    d = DataValidation(type=kind, allow_blank=True, **kw)
    d.error, d.errorTitle, d.prompt, d.promptTitle = msg, title, msg, title
    ws.add_data_validation(d)
    for col in cols_:
        d.add(f"{col}2:{col}{last}")

dv("list", [MC[f"t{n}"] for n in range(1, ABILITIES + 1)], "move, attack, transform or action", "Ability type", formula1=f"={rng('A')}")
dv("list", [MC[f"{k}{n}"] for n in range(1, ABILITIES + 1) for k in "ab"], "A number 0–12, or inf", "Badge number", formula1=f"={rng('B')}")
dv("whole", [MC[f"hp{p}"] for p in range(1, PLAYERS + 1)], "Starting health: whole number 0–20", "Health", operator="between", formula1="0", formula2="20")
dv("textLength", [MC["expansion"]], "Exactly 4 letters, e.g. CORE", "Expansion", operator="equal", formula1="4")

chk = f"{MC['check']}2:{MC['check']}{last}"
ws.conditional_formatting.add(chk, FormulaRule(formula=[f'${MC["check"]}2="OK"'], fill=fill("D9EAD3"), font=Font(name=FONT, color="274E13")))
ws.conditional_formatting.add(chk, FormulaRule(formula=[f'AND(${MC["check"]}2<>"",${MC["check"]}2<>"OK")'], fill=fill("F4CCCC"), font=Font(name=FONT, color="990000")))

# ================================================================ Dextrous page
ds = wb.create_sheet("Dextrous", 1)
SRC = "Monsters!"


def ref(key, r):
    return f"{SRC}{MC[key]}{r}"


def blank_or(key, r):
    """Copy a Monsters cell, keeping blanks blank (not 0)."""
    return f'=IF({ref(key, r)}="","",{ref(key, r)})'


dfields = []  # (header, formula_fn)
for hdr, key in [("image", "image"), ("card_title", "name"), ("level", "level"),
                 ("atk_main", "atk_main"), ("atk_tsf", "atk_tsf"), ("def_main", "def_main"),
                 ("def_tsf", "def_tsf"), ("spd_main", "spd_main"), ("spd_tsf", "spd_tsf"),
                 ("passive_text", "passive")]:
    dfields.append((hdr, lambda r, k=key: blank_or(k, r)))

for n in range(1, ABILITIES + 1):
    def icon(r, n=n):
        T, A, B = ref(f"t{n}", r), ref(f"a{n}", r), ref(f"b{n}", r)
        return (f'=IF({T}="","",{ABILITY_DIR}&IF({T}="move","move-"&{A}&".png",'
                f'IF({T}="attack","attack-"&{A}&"-"&{B}&".png",{T}&".png")))')
    dfields.append((f"ability_{n}", icon))

for n in range(1, ABILITIES + 1):
    for size, cond in [(1, 'OR({T}="transform",{T}="action")'), (2, '{T}="move"'), (3, '{T}="attack"')]:
        s = 3 * (n - 1) + size
        def txt(r, n=n, cond=cond):
            T, X = ref(f"t{n}", r), ref(f"x{n}", r)
            return f'=IF({cond.format(T=T)},{X},"")'
        dfields.append((f"ability_text_s{s}", txt))

dfields.append(("number", lambda r: blank_or("number", r)))
dfields.append(("expansion", lambda r: blank_or("expansion", r)))
for v in range(0, 21):
    def mark(r, v=v):
        hp = f"{SRC}{MC['hp1']}{r}:{MC[f'hp{PLAYERS}']}{r}"
        return f'=IF({ref("name", r)}="","",IFERROR({PLAYER_DIR}&"start-"&MATCH({v},{hp},0)&"p.png",""))'
    dfields.append((f"p_tracker_{v}", mark))

for i, (h, fn) in enumerate(dfields, start=1):
    c = ds.cell(row=1, column=i, value=h)
    c.font = Font(name=FONT, bold=True, color="FFFFFF", size=10)
    c.fill = fill(HDR["auto"])
    c.border = BORDER
    ds.column_dimensions[L(i)].width = 22 if ("text" in h or h in ("image", "card_title")) else 13
    for r in range(2, last + 1):
        cc = ds.cell(row=r, column=i, value=fn(r))
        cc.font = AUTO_FONT
        if h in ("number", "expansion", "atk_tsf", "def_tsf", "spd_tsf"):
            cc.number_format = "@"
ds.freeze_panes = "C2"
ds.sheet_properties.tabColor = "7F7F7F"
ws.sheet_properties.tabColor = HDR["id"]

# ================================================================ How to use
ins = wb.create_sheet("How to use", 2)
lines = [
    ("Monster card sheet", "title"),
    ("Type on the Monsters page. The Dextrous page fills itself in with exactly the fields your Dextrous layout uses. Connect Dextrous to the Dextrous page.", ""),
    ("", ""),
    ("Monsters page", "h"),
    ("Coloured header columns", "Type here. Hover a header for a note on what goes in it."),
    ("Check (grey)", "AUTO. Green 'OK' when the row is valid; red with a list of problems otherwise."),
    ("Rows 2–3", "Example monsters. Overwrite or delete them."),
    ("Number / Expansion", "3-digit number (017) and 4-letter code (CORE)."),
    ("ATK / DEF / SPD", "Base stat (top box). The '+T' column next to each is the transform modifier (bottom box), e.g. +2."),
    ("HP 1P … HP 6P", "Starting health for each player count, 0–20. Must all be different (one marker per health box)."),
    ("Ability 1 … 5", "Type: move / attack / transform / action, in the order the monster performs them."),
    ("   #1 and #2", "MOVE: #1 = distance 1–12.   ATTACK: #1 = range 0–6 or inf, #2 = players 1–4 or inf.   Others: leave blank."),
    ("   Ability text", "Rules text that goes beside the badge."),
    ("Passive", "Passive ability text."),
    ("", ""),
    ("Dextrous page (don't edit)", "h"),
    ("image, card_title, level", "Copied from Image, Name, Level."),
    ("atk_main … spd_tsf", "Copied from the stat columns."),
    ("passive_text", "Copied from Passive."),
    ("ability_1 … ability_5", "Badge image path for each ability, e.g. ability_tags/move-3.png, ability_tags/attack-inf-1.png."),
    ("ability_text_s1 … s15", "Three text boxes per ability, numbered in sequence: ability n uses s(3n−2) after a hexagon badge (transform/action), "
                              "s(3n−1) after a MOVE badge and s(3n) after an ATTACK badge. Only the matching box gets the text."),
    ("number, expansion", "Copied from Number and Expansion."),
    ("p_tracker_0 … p_tracker_20", "Marker image path for that health box (player_tags/start-3p.png etc.), blank if no player count starts there."),
    ("Image folders", "The folder names (ability_tags/, player_tags/) live in yellow cells G2 and H2 on the Lists page. Change them there if Dextrous needs a different folder or path format."),
    ("", ""),
    ("Connecting to Dextrous", "h"),
    ("1", "Upload this file to Google Drive and open it with Google Sheets (File > Save as Google Sheets)."),
    ("2", "Connect Dextrous to the 'Dextrous' tab. For a CSV, open that tab and use File > Download > Comma-separated values."),
    ("3", "Badge PNGs go in the Dextrous folder ability_tags, start-Np markers in player_tags, with filenames unchanged."),
    ("Blank rows", f"The Dextrous page has formulas in rows 2–{last}, so rows with no monster are blank but not empty. "
                   "If Dextrous makes blank cards from them, delete the unused rows on the Dextrous page (or copy the formulas down only as far as you need)."),
]
ins.column_dimensions["A"].width = 30
ins.column_dimensions["B"].width = 115
for i, (a, b) in enumerate(lines, start=1):
    ca = ins.cell(row=i, column=1, value=a)
    cb = ins.cell(row=i, column=2, value=None if b in ("title", "h") else b)
    if b == "title":
        ca.font = Font(name=FONT, size=14, bold=True)
    elif b == "h":
        ca.font = Font(name=FONT, size=11, bold=True, color="FFFFFF")
        ca.fill = cb.fill = fill(HDR["id"])
    else:
        ca.font = Font(name=FONT, size=10, bold=bool(a and not a.startswith(" ") and not a.isdigit()))
        cb.font = Font(name=FONT, size=10)
        cb.alignment = Alignment(wrap_text=True, vertical="top")
        ca.alignment = Alignment(vertical="top")
ins["A5"].fill = fill(HDR["ab"]); ins["A5"].font = Font(name=FONT, size=10, bold=True, color="FFFFFF")
ins["A6"].fill = fill(HDR["auto"]); ins["A6"].font = Font(name=FONT, size=10, bold=True, color="FFFFFF")

wb.calculation.fullCalcOnLoad = True   # openpyxl stores no cached values; compute on open
wb.save(OUT)
print("saved", OUT, "| Monsters cols:", len(mcols), "| Dextrous cols:", len(dfields))
print("Dextrous headers:", ", ".join(h for h, _ in dfields))
