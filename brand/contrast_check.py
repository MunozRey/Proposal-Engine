import sys; sys.path.insert(0,__import__("os").path.dirname(__import__("os").path.abspath(__file__)))
from palette import *

# role -> (hex, background, required_ratio, purpose)
def rows():
    L,LS,D,DS = BG["light_bg"],BG["light_surface"],BG["dark_bg"],BG["dark_surface"]
    R=[]
    R+=[("text/primary",       NEUTRAL["900"], L, 4.5,"body text on light bg"),
        ("text/primary",       NEUTRAL["900"], LS,4.5,"body text on light surface"),
        ("text/secondary",     NEUTRAL["600"], L, 4.5,"muted text on light bg"),
        ("text/secondary",     NEUTRAL["600"], LS,4.5,"muted text on light surface"),
        ("text/primary(dark)", "#E8ECF1",      D, 4.5,"body text on dark bg"),
        ("text/primary(dark)", "#E8ECF1",      DS,4.5,"body text on dark surface"),
        ("text/secondary(dk)", NEUTRAL["400"], D, 4.5,"muted text on dark bg"),
        ("text/secondary(dk)", NEUTRAL["400"], DS,4.5,"muted text on dark surface"),
        # WCAG 1.4.11 applies to boundaries that convey state/affordance, not
        # decorative rules. Split accordingly and hold each to its real bar.
        ("border-default(L)",  NEUTRAL["500"], L, 3.0,"input/control boundary on light"),
        ("border-default(L)",  NEUTRAL["500"], LS,3.0,"input/control boundary on light surf"),
        ("border-default(D)",  NEUTRAL["500"], D, 3.0,"input/control boundary on dark"),
        ("border-default(D)",  NEUTRAL["500"], DS,3.0,"input/control boundary on dark surf"),
        ("focus-ring(L)",      PRIMARY["600"], L, 3.0,"focus indicator on light"),
        ("focus-ring(D)",      PRIMARY["300"], D, 3.0,"focus indicator on dark"),
       ]
    R+=[("primary(light)",  PRIMARY["700"], L,4.5,"brand text/link on light"),
        ("primary(light)",  PRIMARY["700"], LS,4.5,"brand text/link on light surface"),
        ("primary(dark)",   PRIMARY["300"], D,4.5,"brand text/link on dark"),
        ("primary(dark)",   PRIMARY["300"], DS,4.5,"brand text/link on dark surface"),
        ("on-primary-btn",  "#FFFFFF", PRIMARY["700"],4.5,"white label on primary button"),
        ("accent(light)",   ACCENT["600"],  L,4.5,"accent text on light"),
        ("accent(dark)",    ACCENT["300"],  D,4.5,"accent text on dark"),
        ("on-accent-btn",   "#FFFFFF", ACCENT["600"],4.5,"white label on accent button"),
        ("secondary(light)",SECONDARY["700"],L,4.5,"secondary text on light"),
        ("secondary(dark)", SECONDARY["300"],D,4.5,"secondary text on dark"),
       ]
    for n,v in SEMANTIC.items():
        R.append((f"{n}(light)", v["light"], L,4.5,f"{n} text on light"))
        R.append((f"{n}(light)", v["light"], LS,4.5,f"{n} text on light surface"))
        R.append((f"{n}(dark)",  v["dark"],  D,4.5,f"{n} text on dark"))
        R.append((f"{n}(dark)",  v["dark"],  DS,4.5,f"{n} text on dark surface"))
    return R

fails=0
print("%-20s %-9s %-9s %7s %6s %s"%("ROLE","FG","BG","RATIO","NEED","VERDICT"))
print("-"*78)
for role,fg,bg,need,purpose in rows():
    r=ratio(fg,bg); ok = r>=need
    if not ok: fails+=1
    print("%-20s %-9s %-9s %6.2f: %5.1f %s"%(role,fg,bg,r,need,"PASS" if ok else "*** FAIL ***"))
print("-"*78)
print("TOTAL CHECKS: %d   FAILURES: %d"%(len(rows()),fails))
