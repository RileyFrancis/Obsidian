#!/usr/bin/env python3
"""Builds 'Monster Cards.xlsx' for entering monster card data (Dextrous data merge)."""
import sys
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as L
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
from openpyxl.comments import Comment

OUT = sys.argv[1]
import os
ROWS = int(os.environ.get("ROWS", 200))   # rows pre-filled with formulas
SLOTS = 6                  # action/passive slots per monster
PLAYERS = 6
FONT = "Arial"

wb = Workbook()
ws = wb.active
ws.title = "Cards"

# ---------------------------------------------------------------- styles
def fill(hex_):
    return PatternFill("solid", start_color=hex_, end_color=hex_)

HDR = {  # header colours per group
    "id": "1D4A40", "check": "444444", "stats": "6A1A1A", "hp": "4A2466",
    "act": "1A5546", "auto": "7F7F7F",
}
AUTO_FILL = fill("EDEDED")
AUTO_FONT = Font(name=FONT, size=10, color="595959")
IN_FONT = Font(name=FONT, size=10, color="000000")
thin = Side(style="thin", color="D0D0D0")
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)

# ---------------------------------------------------------------- columns
cols = []  # (header, group, width, note, is_input)
def add(h, g, w, note, inp=True):
    cols.append((h, g, w, note, inp))

add("Number", "id", 9, "3-digit card number, e.g. 017. Stored as text so leading zeros stay.")
add("Set", "id", 7, "4-letter set / expansion code, e.g. CORE.")
add("Name", "id", 22, "Monster name (goes in the name banner).")
add("Check", "check", 34, "AUTO: 'OK' or a list of problems with this row.", False)
add("Level", "id", 7, "Monster level (level medallion).")
add("Art", "id", 18, "Art image filename as uploaded to Dextrous, e.g. hollow-warden.png.")
for s, nm in [("ATK", "attack"), ("DEF", "defense"), ("SPD", "speed")]:
    add(s, "stats", 6, f"Base {nm} (top stat box).")
for s, nm in [("ATK_T", "attack"), ("DEF_T", "defense"), ("SPD_T", "speed")]:
    add(s, "stats", 7, f"Transform modifier for {nm} (bottom stat box), e.g. +2. Use – or leave blank for none.")
for p in range(1, PLAYERS + 1):
    add(f"HP_{p}P", "hp", 7, f"Starting health with {p} player{'s' if p > 1 else ''} (0–20). Leave blank if unused.")
for n in range(1, SLOTS + 1):
    add(f"Act{n}_Type", "act", 11, "move, attack, transform, action (general) or passive. Slots are read top to bottom, so put them in the order the monster acts. Passives usually go last.")
    add(f"Act{n}_A", "act", 7, "MOVE: distance 1–12.  ATTACK: range 0–6 or inf.  Others: leave blank.")
    add(f"Act{n}_B", "act", 7, "ATTACK: number of players 1–4 or inf.  Others: leave blank.")
    add(f"Act{n}_Text", "act", 34, "The rules text that goes beside the badge.")
for n in range(1, SLOTS + 1):
    add(f"Act{n}_Icon", "auto", 17, "AUTO: badge image filename for this slot.", False)
    add(f"Act{n}_TxtHex", "auto", 14, "AUTO: text for the text box placed after a narrow hexagon badge (transform / action / passive).", False)
    add(f"Act{n}_TxtMove", "auto", 14, "AUTO: text for the text box placed after a MOVE badge.", False)
    add(f"Act{n}_TxtAttack", "auto", 14, "AUTO: text for the text box placed after an ATTACK badge.", False)
add("Rules_Inline", "auto", 40, "AUTO: all slots in one block using {icon.png} inline-icon syntax, for a single text box.", False)
for v in range(20, -1, -1):
    add(f"Mark_HP{v}", "auto", 12, f"AUTO: starting-health marker image to show on health box {v} (blank = none).", False)

C = {h: L(i + 1) for i, (h, *_ ) in enumerate(cols)}

# ---------------------------------------------------------------- lists sheet
ls = wb.create_sheet("Lists")
lists = {
    "A": ("Types", ["move", "attack", "transform", "action", "passive"]),
    "B": ("Allowed values", [str(i) for i in range(0, 13)] + ["inf"]),
    "C": ("MOVE distance", [str(i) for i in range(1, 13)]),
    "D": ("ATTACK range", [str(i) for i in range(0, 7)] + ["inf"]),
    "E": ("ATTACK players", [str(i) for i in range(1, 5)] + ["inf"]),
}
for col, (h, vals) in lists.items():
    ls[f"{col}1"] = h
    ls[f"{col}1"].font = Font(name=FONT, bold=True, color="FFFFFF")
    ls[f"{col}1"].fill = fill(HDR["auto"])
    for i, v in enumerate(vals, start=2):
        c = ls[f"{col}{i}"]
        c.value = v
        c.number_format = "@"
        c.font = IN_FONT
    ls.column_dimensions[col].width = 16
def rng(col):
    n = len(lists[col][1])
    return f"Lists!${col}$2:${col}${n + 1}"

# ---------------------------------------------------------------- header row
for i, (h, g, w, note, inp) in enumerate(cols, start=1):
    c = ws.cell(row=1, column=i, value=h)
    c.font = Font(name=FONT, bold=True, color="FFFFFF", size=10)
    c.fill = fill(HDR[g])
    c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    c.border = BORDER
    c.comment = Comment(note, "Card sheet")
    ws.column_dimensions[L(i)].width = w
ws.row_dimensions[1].height = 30
ws.freeze_panes = "D2"

# ---------------------------------------------------------------- formulas
HP = f"{C['HP_1P']}{{r}}:{C[f'HP_{PLAYERS}P']}{{r}}"

def formulas(r):
    f = {}
    hp = HP.format(r=r)
    name = f"{C['Name']}{r}"
    # per slot
    inline_parts = []
    for n in range(1, SLOTS + 1):
        T, A, B, X = (f"{C[f'Act{n}_{k}']}{r}" for k in ("Type", "A", "B", "Text"))
        icon = f"{C[f'Act{n}_Icon']}{r}"
        f[f"Act{n}_Icon"] = (f'=IF({T}="","",IF({T}="move","move-"&{A}&".png",'
                             f'IF({T}="attack","attack-"&{A}&"-"&{B}&".png",{T}&".png")))')
        f[f"Act{n}_TxtHex"] = f'=IF(OR({T}="transform",{T}="action",{T}="passive"),{X},"")'
        f[f"Act{n}_TxtMove"] = f'=IF({T}="move",{X},"")'
        f[f"Act{n}_TxtAttack"] = f'=IF({T}="attack",{X},"")'
        inline_parts.append(f'IF({icon}="","","{{"&{icon}&"}} "&{X})')
    f["Rules_Inline"] = "=_xlfn.TEXTJOIN(CHAR(10),TRUE," + ",".join(inline_parts) + ")"
    for v in range(20, -1, -1):
        f[f"Mark_HP{v}"] = f'=IF({name}="","",IFERROR("start-"&MATCH({v},{hp},0)&"p.png",""))'
    # checks
    num, st = f"{C['Number']}{r}", f"{C['Set']}{r}"
    chk = [
        f'IF(AND({num}<>"",OR(LEN({num}&"")<>3,NOT(ISNUMBER(IFERROR(--({num}&""),"x"))))),"Number must be 3 digits. ","")',
        f'IF({num}="","Missing number. ","")',
        f'IF(LEN({st})<>4,"Set must be 4 letters. ","")',
        f'IF(COUNTIF({hp},">20")+COUNTIF({hp},"<0")>0,"Start HP must be 0–20. ","")',
        f'IF(SUMPRODUCT(({hp}<>"")*(COUNTIF({hp},{hp})>1))>0,"Two player counts share a start HP (only one marker fits per box). ","")',
    ]
    for n in range(1, SLOTS + 1):
        T, A, B, X = (f"{C[f'Act{n}_{k}']}{r}" for k in ("Type", "A", "B", "Text"))
        chk.append(f'IF(AND({T}="move",ISNA(MATCH({A}&"",{rng("C")},0))),"Act{n}: MOVE distance must be 1–12. ","")')
        chk.append(f'IF(AND({T}="attack",OR(ISNA(MATCH({A}&"",{rng("D")},0)),ISNA(MATCH({B}&"",{rng("E")},0)))),'
                   f'"Act{n}: ATTACK needs range 0–6/inf and players 1–4/inf. ","")')
        chk.append(f'IF(AND({T}="",{X}<>""),"Act{n}: pick a type. ","")')
        chk.append(f'IF(AND({T}<>"",ISNA(MATCH({T},{rng("A")},0))),"Act{n}: unknown type. ","")')
    joined = "&".join(chk)
    f["Check"] = f'=IF({name}="","",IF({joined}="","OK",TRIM({joined})))'
    return f

# ---------------------------------------------------------------- example rows
examples = [
    {"Number": "001", "Set": "CORE", "Name": "Hollow Warden", "Level": 3, "Art": "hollow-warden.png",
     "ATK": 4, "DEF": 1, "SPD": 3, "ATK_T": "+2", "DEF_T": "+1", "SPD_T": "–",
     "HP_1P": 8, "HP_2P": 10, "HP_3P": 12, "HP_4P": 14, "HP_5P": 16, "HP_6P": 18,
     "slots": [("move", 3, None, "toward the nearest player."),
               ("attack", 1, 1, "Drain 2 sanity."),
               ("action", None, None, "Place an acid token at this monster's location."),
               ("transform", None, None, "After 10 rounds."),
               ("passive", None, None, "Players that share a tile with this monster lose 1 sanity at the end of the round.")]},
    {"Number": "002", "Set": "CORE", "Name": "Wailing Shade", "Level": 5, "Art": "wailing-shade.png",
     "ATK": 2, "DEF": 0, "SPD": 6, "ATK_T": "", "DEF_T": "", "SPD_T": "",
     "HP_1P": 5, "HP_2P": 7, "HP_3P": 9, "HP_4P": 11, "HP_5P": 13, "HP_6P": 15,
     "slots": [("move", 8, None, "toward the nearest player that lost health during their last turn."),
               ("attack", "inf", "inf", "Drain 1 sanity."),
               ("passive", None, None, "This monster cannot be attacked by players with 5 or more sanity.")]},
]

for r in range(2, ROWS + 2):
    fm = formulas(r)
    ex = examples[r - 2] if r - 2 < len(examples) else None
    vals = {}
    if ex:
        vals = {k: v for k, v in ex.items() if k != "slots"}
        for n, (t, a, b, x) in enumerate(ex["slots"], start=1):
            vals[f"Act{n}_Type"], vals[f"Act{n}_A"], vals[f"Act{n}_B"], vals[f"Act{n}_Text"] = t, a, b, x
    for i, (h, g, w, note, inp) in enumerate(cols, start=1):
        c = ws.cell(row=r, column=i)
        c.border = BORDER
        if inp:
            v = vals.get(h)
            c.value = v if v not in ("",) else None
            c.font = IN_FONT
            if h in ("Number", "Set", "ATK_T", "DEF_T", "SPD_T") or h.endswith("_A") or h.endswith("_B"):
                c.number_format = "@" if h in ("Number", "Set", "ATK_T", "DEF_T", "SPD_T") else "General"
            if h.endswith("_Text"):
                c.alignment = Alignment(wrap_text=False, vertical="top")
            else:
                c.alignment = Alignment(horizontal="center", vertical="top")
        else:
            c.value = fm[h]
            c.font = AUTO_FONT
            c.fill = AUTO_FILL
            c.alignment = Alignment(vertical="top", horizontal="left" if h in ("Check", "Rules_Inline") or "Txt" in h else "center")

last = ROWS + 1

# ---------------------------------------------------------------- validation
def dv_list(src, cols_, prompt):
    dv = DataValidation(type="list", formula1=f"={src}", allow_blank=True, showDropDown=False)
    dv.error, dv.errorTitle = prompt, "Not allowed"
    dv.prompt, dv.promptTitle = prompt, "Choose"
    ws.add_data_validation(dv)
    for col in cols_:
        dv.add(f"{col}2:{col}{last}")

dv_list(rng("A"), [C[f"Act{n}_Type"] for n in range(1, SLOTS + 1)], "move, attack, transform, action or passive")
dv_list(rng("B"), [C[f"Act{n}_{k}"] for n in range(1, SLOTS + 1) for k in ("A", "B")], "A number 0–12, or inf")

hpdv = DataValidation(type="whole", operator="between", formula1="0", formula2="20", allow_blank=True)
hpdv.error, hpdv.errorTitle = "Starting health must be a whole number from 0 to 20.", "Health 0–20"
ws.add_data_validation(hpdv)
hpdv.add(f"{C['HP_1P']}2:{C[f'HP_{PLAYERS}P']}{last}")

setdv = DataValidation(type="textLength", operator="equal", formula1="4", allow_blank=True)
setdv.error, setdv.errorTitle = "The set code must be exactly 4 letters, e.g. CORE.", "Set code"
ws.add_data_validation(setdv)
setdv.add(f"{C['Set']}2:{C['Set']}{last}")

# ---------------------------------------------------------------- check colouring
chk = f"{C['Check']}2:{C['Check']}{last}"
ws.conditional_formatting.add(chk, FormulaRule(formula=[f'${C["Check"]}2="OK"'], fill=fill("D9EAD3"), font=Font(name=FONT, color="274E13")))
ws.conditional_formatting.add(chk, FormulaRule(formula=[f'AND(${C["Check"]}2<>"",${C["Check"]}2<>"OK")'], fill=fill("F4CCCC"), font=Font(name=FONT, color="990000")))

# ---------------------------------------------------------------- instructions sheet
ins = wb.create_sheet("How to use", 1)
lines = [
    ("Monster card sheet", "title"),
    ("One row per monster. Dextrous reads the Cards tab; each column header is a field you can connect to a text or image box.", ""),
    ("", ""),
    ("Legend", "h"),
    ("Coloured header, white cells", "Type here."),
    ("Grey header, grey cells", "AUTO: formulas. Don't edit; they fill themselves in from what you typed."),
    ("Check column", "Green 'OK' when the row is valid; red with a list of problems otherwise."),
    ("Rows 2–3", "Example monsters. Overwrite or delete them."),
    ("", ""),
    ("Columns to fill in", "h"),
    ("Number / Set / Name / Level", "Card number as 3 digits (017), 4-letter set code (CORE), name and level."),
    ("Art", "Filename of the art image you uploaded to Dextrous."),
    ("ATK / DEF / SPD", "Base stats (top boxes)."),
    ("ATK_T / DEF_T / SPD_T", "Transform modifiers (bottom boxes), e.g. +2. Leave blank or use – for none."),
    ("HP_1P … HP_6P", "Starting health for each player count, 0–20. Each must be different, since only one marker fits per health box."),
    ("Act1 … Act6", "Up to 6 slots, read in order. Type = move / attack / transform / action / passive."),
    ("   _A and _B", "MOVE: A = distance 1–12.  ATTACK: A = range 0–6 or inf, B = players 1–4 or inf.  Others: leave blank."),
    ("   _Text", "The rules text that goes beside the badge."),
    ("", ""),
    ("AUTO columns for Dextrous", "h"),
    ("ActN_Icon", "Badge filename for slot N, e.g. move-3.png, attack-inf-1.png, passive.png. Connect to the slot's image box."),
    ("ActN_TxtHex / _TxtMove / _TxtAttack", "The slot's text, placed only in the column that matches its badge width; the other two stay blank. "
                                             "Connect each to one of the three overlapping text boxes for that slot."),
    ("Rules_Inline", "Alternative: every slot in one block as '{icon.png} text', one per line, for a single text box using inline icons."),
    ("Mark_HP20 … Mark_HP0", "Starting-health marker image for each health box (start-3p.png etc.), blank if none. Connect to an image box placed on that health box."),
    ("", ""),
    ("Using it with Dextrous", "h"),
    ("1", "Upload this file to Google Drive and open it with Google Sheets (File > Save as Google Sheets)."),
    ("2", "In Dextrous, connect the Google Sheet as the data source for the monster card layout."),
    ("3", "Upload the art, the badge PNGs (ability icons/numbered + transform/action/passive) and the start-Np markers, with filenames unchanged."),
    ("4", "Connect each box in the layout to its column, as described above."),
]
ins.column_dimensions["A"].width = 34
ins.column_dimensions["B"].width = 110
for i, (a, b) in enumerate(lines, start=1):
    ca, cb = ins.cell(row=i, column=1, value=a), ins.cell(row=i, column=2, value=b if b not in ("title", "h") else None)
    if b == "title":
        ca.font = Font(name=FONT, size=14, bold=True)
    elif b == "h":
        ca.font = Font(name=FONT, size=11, bold=True, color="FFFFFF")
        ca.fill = fill(HDR["id"]); ins.cell(row=i, column=2).fill = fill(HDR["id"])
    else:
        ca.font = Font(name=FONT, size=10, bold=bool(a and a[0] != " " and not a.isdigit()))
        cb.font = Font(name=FONT, size=10)
        cb.alignment = Alignment(wrap_text=True, vertical="top")
        ca.alignment = Alignment(vertical="top")
# sample legend swatches
ins["A5"].fill = fill(HDR["act"]); ins["A5"].font = Font(name=FONT, size=10, bold=True, color="FFFFFF")
ins["A6"].fill = fill(HDR["auto"]); ins["A6"].font = Font(name=FONT, size=10, bold=True, color="FFFFFF")

wb.calculation.fullCalcOnLoad = True   # no cached values from openpyxl; compute on open
wb.save(OUT)
print("saved", OUT, "columns:", len(cols))
