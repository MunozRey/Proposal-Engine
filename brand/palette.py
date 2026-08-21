# Switchyard palette definition + WCAG verifier (single source of truth)

NEUTRAL = {
 "0":"#FFFFFF","50":"#F6F8FA","100":"#EBEEF2","200":"#DCE1E8","300":"#C2CAD4",
 "400":"#98A3B2","500":"#6E7A8A","600":"#55606E","700":"#414A56","800":"#2A323C",
 "900":"#1A2029","950":"#0B0F14",
}
PRIMARY = {  # Track Teal
 "50":"#EDFAF7","100":"#D2F3EC","200":"#A6E7DA","300":"#6FD5C3","400":"#34BCA6",
 "500":"#14A08A","600":"#0F8374","700":"#0D6A5F","800":"#0E554D","900":"#0D4640",
}
ACCENT = {   # Lunar Violet
 "50":"#F5F1FE","100":"#EAE2FD","200":"#D6C7FB","300":"#BCA4F7","400":"#9B78F0",
 "500":"#7C4FE4","600":"#6D28D9","700":"#5B21B6","800":"#4C1D95","900":"#3B1578",
}
SECONDARY = {  # Steel Blue - supporting brand hue
 "50":"#EEF4FB","100":"#D8E6F6","200":"#B4CDEC","300":"#84ADDE","400":"#5288CB",
 "500":"#316AB4","600":"#245495","700":"#1E4478","800":"#1B3862","900":"#182F51",
}
SEMANTIC = {
 "success":{"light":"#15803D","dark":"#4ADE80"},
 "warning":{"light":"#A16207","dark":"#FBBF24"},
 "error":  {"light":"#B91C1C","dark":"#F87171"},
 "info":   {"light":"#1D4ED8","dark":"#7DD3FC"},
}
BG = {"light_bg":"#FFFFFF","light_surface":"#F6F8FA","dark_bg":"#0B0F14","dark_surface":"#141B23"}

def _lin(c):
    c/=255.0
    return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def lum(hx):
    hx=hx.lstrip("#"); r,g,b=(int(hx[i:i+2],16) for i in (0,2,4))
    return 0.2126*_lin(r)+0.7152*_lin(g)+0.0722*_lin(b)
def ratio(a,b):
    la,lb=lum(a),lum(b); hi,lo=max(la,lb),min(la,lb)
    return (hi+0.05)/(lo+0.05)
