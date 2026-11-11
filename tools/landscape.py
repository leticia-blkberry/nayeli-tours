"""Generate the layered mountain + fir-forest SVG fragment for the Nayeli Tours hero.

Usage: python3 landscape.py <index.html>
Replaces everything between the moon and the mushroom group with new layers.
Colors are the logo's aqua / leaf green blended over the dark logo-green base.
"""
import math
import random
import sys

R = random.Random(7)


def blend(rgb, a, base=(13, 22, 2)):
    return "#%02x%02x%02x" % tuple(round(a * c + (1 - a) * b) for c, b in zip(rgb, base))


AQUA = (36, 213, 184)
LEAF = (60, 205, 136)
WHITE = (255, 255, 255)


def fmt(pts):
    return "M" + " ".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z"


# ---------- fir tree ----------
def fir(cx, base, h, w):
    n = max(6, int(h / 11))
    left, right = [], []
    top = base - h
    trunk = h * 0.08
    crown_bottom = base - trunk
    for side, out in ((-1, left), (1, right)):
        for i in range(1, n + 1):
            t = i / n
            y = top + t * (crown_bottom - top)
            half = (w / 2) * (t ** 0.85)
            tip = half * (0.8 + 0.4 * R.random())
            droop = (crown_bottom - top) / n * (0.25 + 0.3 * R.random())
            notch_y = y - (crown_bottom - top) / n * 0.55
            out.append((cx + side * half * 0.45, notch_y))
            # ragged extra point near the tip
            out.append((cx + side * tip * 0.8, y + droop * 0.3 - 2 * R.random()))
            out.append((cx + side * tip, y + droop))
            out.append((cx + side * half * 0.5, y + droop * 0.6))
    tw = max(1.5, w * 0.05)
    pts = [(cx, top - 3)] + right + [(cx + tw, crown_bottom), (cx + tw, base + 6), (cx - tw, base + 6), (cx - tw, crown_bottom)] + left[::-1]
    return fmt(pts)


def tree_row(x0, x1, base_fn, hmin, hmax, gap, width_ratio=0.52, hmul=lambda x: 1.0):
    paths = []
    x = x0
    while x < x1:
        h = R.uniform(hmin, hmax) * hmul(x)
        w = h * width_ratio * R.uniform(0.85, 1.15)
        paths.append(fir(x, base_fn(x), h, w))
        x += R.uniform(*gap)
    # ground under the row
    xs = range(int(x0) - 60, int(x1) + 80, 40)
    ground = [(xx, base_fn(xx) + 2) for xx in xs] + [(x1 + 80, 900), (x0 - 60, 900)]
    paths.append(fmt(ground))
    return " ".join(paths)


# ---------- mountains ----------
def ridge(points, rough, detail=5):
    out = [points[0]]
    for (xa, ya), (xb, yb) in zip(points, points[1:]):
        steps = max(2, int(abs(xb - xa) / detail))
        for s in range(1, steps + 1):
            t = s / steps
            x = xa + (xb - xa) * t
            y = ya + (yb - ya) * t
            if s != steps:
                y += R.uniform(-rough, rough) * math.sin(math.pi * t)
            out.append((x, y))
    return out


def mountain(points, rough):
    r = ridge(points, rough)
    return fmt(r + [(r[-1][0], 900), (r[0][0], 900)])


def streaks(px, py, count, length, side=-1):
    out = []
    for _ in range(count):
        sx = px + side * R.uniform(2, 18)
        sy = py + R.uniform(6, 30)
        ang = math.radians(R.uniform(52, 72))
        L = length * R.uniform(0.5, 1.0)
        n = 8
        a, b = [], []
        for i in range(n + 1):
            t = i / n
            cx = sx + side * math.cos(ang) * L * t
            cy = sy + math.sin(ang) * L * t
            wdt = (1.5 + 7 * math.sin(math.pi * t) * R.uniform(0.6, 1.2))
            a.append((cx - wdt * 0.5, cy + R.uniform(-2, 2)))
            b.append((cx + wdt * 0.5, cy + R.uniform(-2, 2)))
        out.append(fmt(a + b[::-1]))
    return " ".join(out)


# ---------- clouds ----------
def cloud(xc, yc, length, thick):
    n = int(length / 30)
    top, bot = [], []
    for i in range(n + 1):
        t = i / n
        x = xc - length / 2 + length * t
        env = math.sin(math.pi * t) ** 0.6
        top.append((x, yc - thick / 2 * env * R.uniform(0.85, 1.12)))
        bot.append((x, yc + thick / 2 * env * R.uniform(0.45, 0.7)))
    return fmt(top + bot[::-1])


def build():
    c_far = blend(AQUA, 0.40)
    c_main = blend(AQUA, 0.29)
    c_hi = blend(AQUA, 0.42)
    c_hills = blend(AQUA, 0.19)
    c_cloud1 = blend(AQUA, 0.42)
    c_cloud2 = blend(AQUA, 0.28)
    c_row1 = blend(LEAF, 0.15)
    c_row2 = blend(LEAF, 0.09)
    c_row3 = "#0a1302"
    c_front = "#060a01"

    clouds1 = " ".join(cloud(*c) for c in [(240, 92, 520, 40), (1120, 70, 640, 46), (620, 210, 460, 30), (1330, 230, 360, 30)])
    clouds2 = " ".join(cloud(*c) for c in [(80, 180, 320, 26), (900, 150, 420, 26), (430, 300, 380, 22), (1180, 330, 480, 26), (1000, 260, 280, 18)])

    far = mountain([(-40, 470), (120, 410), (260, 440), (420, 360), (560, 420), (700, 390), (840, 440), (990, 370), (1120, 420), (1260, 350), (1400, 410), (1480, 400)], 10)
    main = mountain([(-40, 560), (110, 470), (230, 330), (330, 250), (420, 330), (520, 300), (600, 380), (720, 470), (860, 430), (980, 330), (1090, 270), (1170, 320), (1260, 300), (1380, 400), (1480, 450)], 9)
    hi = " ".join([streaks(330, 250, 5, 140), streaks(520, 300, 3, 90), streaks(1090, 270, 5, 140), streaks(1260, 300, 3, 90), streaks(230, 330, 2, 80)])
    hills = fmt(ridge([(-40, 640), (200, 600), (420, 630), (640, 590), (860, 625), (1080, 595), (1300, 620), (1480, 600)], 6, 20) + [(1480, 900), (-40, 900)])

    row1 = tree_row(-30, 1470, lambda x: 655 + 12 * math.sin(x / 140), 38, 92, (11, 22))
    row2 = tree_row(-30, 1470, lambda x: 730 + 14 * math.sin(x / 180 + 1), 80, 175, (24, 46),
                    hmul=lambda x: 0.75 + 0.45 * abs(x - 720) / 720)
    row3 = tree_row(-60, 1500, lambda x: 815 + 10 * math.sin(x / 200 + 2), 70, 130, (40, 70),
                    hmul=lambda x: 1.0 + 2.2 * max(0, abs(x - 720) - 380) / 340)
    giants = " ".join([fir(10, 905, 560, 230), fir(120, 905, 430, 180), fir(1330, 905, 470, 200), fir(1440, 905, 590, 240)])
    ground = fmt(ridge([(-40, 855), (360, 845), (720, 860), (1080, 848), (1480, 856)], 5, 30) + [(1480, 900), (-40, 900)])

    return f'''          <g class="clouds">
            <path d="{clouds2}" fill="{c_cloud2}"/>
            <path d="{clouds1}" fill="{c_cloud1}"/>
          </g>
          <circle class="moon-glow" cx="790" cy="125" r="170" fill="url(#moonGlow)"/>
          <circle cx="790" cy="125" r="40" fill="#ffffff"/>
          <circle cx="803" cy="116" r="8" fill="#0d98de" fill-opacity=".18"/><circle cx="780" cy="141" r="5" fill="#0d98de" fill-opacity=".18"/>
          <path d="{far}" fill="{c_far}"/>
          <path d="{main}" fill="{c_main}"/>
          <path d="{hi}" fill="{c_hi}"/>
          <rect class="mist mist-a" x="-200" y="520" width="1840" height="140" fill="url(#mist)"/>
          <path d="{hills}" fill="{c_hills}"/>
          <path d="{row1}" fill="{c_row1}"/>
          <rect class="mist mist-b" x="-200" y="660" width="1840" height="110" fill="url(#mist)"/>
          <path d="{row2}" fill="{c_row2}"/>
          <path d="{row3}" fill="{c_row3}"/>
          <path d="{giants} {ground}" fill="{c_front}"/>
'''


if __name__ == "__main__":
    p = sys.argv[1]
    s = open(p, encoding="utf-8").read()
    start = s.index('          <circle class="moon-glow"')
    end = s.index('          <g filter="url(#glow)">')
    s = s[:start] + build() + s[end:]
    # sky: flat green night like the reference, aurora keeps the magic
    a = s.index('<linearGradient id="sky"')
    b = s.index('</linearGradient>', a) + len('</linearGradient>')
    s = s[:a] + '''<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#050801"/>
              <stop offset=".45" stop-color="#0d1602"/>
              <stop offset=".75" stop-color="#10291d"/>
              <stop offset="1" stop-color="#0d1602"/>
            </linearGradient>''' + s[b:]
    # drop the old simple pine symbol
    a = s.find('            <symbol id="pine"')
    if a != -1:
        b = s.index('</symbol>', a) + len('</symbol>\n')
        s = s[:a] + s[b:]
    open(p, "w", encoding="utf-8").write(s)
    print("ok", len(s))
