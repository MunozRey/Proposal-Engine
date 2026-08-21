# Switchyard — WCAG contrast verification

Regenerate with `python3 brand/contrast_check.py`. Source of truth: `brand/palette.py`.

Thresholds: **4.5:1** for text (WCAG 2.2 AA, 1.4.3), **3:1** for non-text UI
boundaries and focus indicators (1.4.11). Decorative dividers (`border-subtle`)
carry no state and are exempt from 1.4.11 — they are excluded deliberately, not overlooked.

```
ROLE                 FG        BG          RATIO   NEED VERDICT
------------------------------------------------------------------------------
text/primary         #1A2029   #FFFFFF    16.37:   4.5 PASS
text/primary         #1A2029   #F6F8FA    15.38:   4.5 PASS
text/secondary       #55606E   #FFFFFF     6.39:   4.5 PASS
text/secondary       #55606E   #F6F8FA     6.01:   4.5 PASS
text/primary(dark)   #E8ECF1   #0B0F14    16.20:   4.5 PASS
text/primary(dark)   #E8ECF1   #141B23    14.62:   4.5 PASS
text/secondary(dk)   #98A3B2   #0B0F14     7.52:   4.5 PASS
text/secondary(dk)   #98A3B2   #141B23     6.79:   4.5 PASS
border-default(L)    #6E7A8A   #FFFFFF     4.36:   3.0 PASS
border-default(L)    #6E7A8A   #F6F8FA     4.10:   3.0 PASS
border-default(D)    #6E7A8A   #0B0F14     4.41:   3.0 PASS
border-default(D)    #6E7A8A   #141B23     3.98:   3.0 PASS
focus-ring(L)        #0F8374   #FFFFFF     4.65:   3.0 PASS
focus-ring(D)        #6FD5C3   #0B0F14    10.97:   3.0 PASS
primary(light)       #0D6A5F   #FFFFFF     6.47:   4.5 PASS
primary(light)       #0D6A5F   #F6F8FA     6.08:   4.5 PASS
primary(dark)        #6FD5C3   #0B0F14    10.97:   4.5 PASS
primary(dark)        #6FD5C3   #141B23     9.90:   4.5 PASS
on-primary-btn       #FFFFFF   #0D6A5F     6.47:   4.5 PASS
accent(light)        #6D28D9   #FFFFFF     7.10:   4.5 PASS
accent(dark)         #BCA4F7   #0B0F14     8.96:   4.5 PASS
on-accent-btn        #FFFFFF   #6D28D9     7.10:   4.5 PASS
secondary(light)     #1E4478   #FFFFFF     9.75:   4.5 PASS
secondary(dark)      #84ADDE   #0B0F14     8.25:   4.5 PASS
success(light)       #15803D   #FFFFFF     5.02:   4.5 PASS
success(light)       #15803D   #F6F8FA     4.71:   4.5 PASS
success(dark)        #4ADE80   #0B0F14    11.03:   4.5 PASS
success(dark)        #4ADE80   #141B23     9.95:   4.5 PASS
warning(light)       #A16207   #FFFFFF     4.92:   4.5 PASS
warning(light)       #A16207   #F6F8FA     4.62:   4.5 PASS
warning(dark)        #FBBF24   #0B0F14    11.51:   4.5 PASS
warning(dark)        #FBBF24   #141B23    10.39:   4.5 PASS
error(light)         #B91C1C   #FFFFFF     6.47:   4.5 PASS
error(light)         #B91C1C   #F6F8FA     6.08:   4.5 PASS
error(dark)          #F87171   #0B0F14     6.95:   4.5 PASS
error(dark)          #F87171   #141B23     6.27:   4.5 PASS
info(light)          #1D4ED8   #FFFFFF     6.70:   4.5 PASS
info(light)          #1D4ED8   #F6F8FA     6.30:   4.5 PASS
info(dark)           #7DD3FC   #0B0F14    11.53:   4.5 PASS
info(dark)           #7DD3FC   #141B23    10.40:   4.5 PASS
------------------------------------------------------------------------------
TOTAL CHECKS: 40   FAILURES: 0
```
