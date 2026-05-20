# design.md — Race of Nations Visual Design System

---

## Color Palette

```
/* Core backgrounds */
--color-bg-primary:       #050a1a   /* deepest dark navy — base background */
--color-bg-secondary:     #0a1628   /* slightly lighter navy — panels, cards */
--color-bg-card:          #0d1f3c   /* card/slot background */
--color-bg-card-hover:    #112447   /* card hover state */

/* Neon accents */
--color-neon-cyan:        #00d4ff   /* primary accent — borders, highlights, timer */
--color-neon-cyan-glow:   rgba(0, 212, 255, 0.3)   /* glow shadow */
--color-neon-magenta:     #ff00aa   /* countdown numbers, special highlights */
--color-neon-gold:        #ffd700   /* winner crown, rank badges, boost icon */

/* UI states */
--color-selected-border:  #00d4ff   /* active/selected card border */
--color-waiting:          #4a5568   /* empty team slot text and icon */

/* Buttons */
--color-btn-green:        #22c55e   /* Start Race, Save Changes, Restart Race */
--color-btn-green-hover:  #16a34a
--color-btn-red:          #dc2626   /* Reset Timer, Reset to Defaults */
--color-btn-red-hover:    #b91c1c
--color-btn-blue:         #1e40af   /* Cancel, neutral actions */
--color-btn-blue-hover:   #1d4ed8

/* Text */
--color-text-primary:     #ffffff
--color-text-secondary:   #94a3b8   /* subtitles, labels, waiting text */
--color-text-accent:      #00d4ff   /* country codes, highlighted labels */
--color-text-gold:        #ffd700   /* wins count, leader label */

/* Track */
--color-track-bg:         #1a1a2e   /* asphalt lane background */
--color-track-line:       rgba(255, 255, 255, 0.15)  /* dashed lane dividers */
--color-finish-checker:   #ffffff   /* checkered flag alternating color */
```

---

## Typography

```css
/* Primary display font — headings, titles, country names */
font-family: 'Barlow Condensed', 'Russo One', Impact, sans-serif;
font-weight: 700;
font-style: italic;   /* for RACE OF NATIONS and ARGENTINA-style titles */
text-transform: uppercase;

/* UI labels — buttons, badges, settings items */
font-family: 'Barlow Condensed', sans-serif;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
```

**Font sizes (clamp for responsiveness):**
```
Page title (RACE OF NATIONS):  clamp(2rem, 4vw, 3.5rem)
Section title (SETTINGS):       clamp(1.8rem, 3.5vw, 3rem)
Winner name (ARGENTINA):        clamp(2rem, 4vw, 3.5rem)
Country code (CAN, IND):        clamp(0.75rem, 1.2vw, 1rem)
Country name (Canada):          clamp(0.65rem, 1vw, 0.875rem)
Timer digits:                   clamp(1.5rem, 2.5vw, 2rem)
Button text:                    clamp(0.75rem, 1.2vw, 1rem)
Settings label:                 clamp(0.8rem, 1.2vw, 1rem)
Settings sublabel:              clamp(0.65rem, 1vw, 0.8rem)
```

**Google Fonts import (add to index.css):**
```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;1,700&display=swap');
```

---

## Background System

All backgrounds are **pure CSS — no image files**.

### Stadium Background (Lobby, Settings, Leaderboard)
```css
.bg-stadium {
  background:
    /* spotlight left */
    radial-gradient(ellipse 40% 60% at 15% 0%, rgba(0, 150, 255, 0.18) 0%, transparent 70%),
    /* spotlight right */
    radial-gradient(ellipse 40% 60% at 85% 0%, rgba(0, 150, 255, 0.18) 0%, transparent 70%),
    /* center top glow */
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0, 80, 180, 0.15) 0%, transparent 60%),
    /* base gradient */
    linear-gradient(180deg, #0a1628 0%, #050a1a 60%, #020710 100%);
  min-height: 100vh;
  width: 100%;
}
```

### Track Background (Race Page)
```css
.bg-track {
  background: #1a1a2e;
  /* Asphalt texture via CSS noise — optional overlay */
}

/* Each lane row gets a dashed divider */
.lane-divider {
  border-bottom: 2px dashed rgba(255, 255, 255, 0.12);
}
```

### Leaderboard — additional overlay for drama
```css
.bg-leaderboard {
  /* Extends stadium bg with a darker vignette center */
  background:
    radial-gradient(ellipse 50% 50% at 40% 50%, rgba(0, 0, 0, 0.4) 0%, transparent 70%),
    /* + stadium bg layers above */;
}
```

---

## Asset Conventions

### Flags
```
Path:     public/flags/country_flag/{countryCode}.png
Example:  public/flags/country_flag/in.png, public/flags/country_flag/us.png, public/flags/country_flag/au.png
Code:     lowercase 2-letter ISO code
Usage:    <img src={`public/flags/country_flag/${code}.png`} alt={countryName} />
Sizes:
  - Team slot card:     100% width of card, ~120px height
  - Lobby banner:       48px × 32px
  - Race lane:          32px × 22px
  - Leaderboard row:    28px × 20px
  - Winner card:        100% of winner panel width
```

### Cars
```
Path:     public/cars/{spriteType}/{countryCode}.png
Example:  public/cars/f1_car_livery_sprites/in.png, public/cars/rally_car_livery_sprites/au.png
Types:     f1_car_livery_sprites | rally_car_livery_sprites
Code:     lowercase 2-letter ISO code
Usage:    <img src={`/cars/${spriteType}/${code}.png`} alt={`${code} car`} />
Note:     two car sprite types exist, so use the correct folder for the selected vehicle style.
Size:     ~80px wide, ~48px tall (top-down sprite)
Position: driven by race progress % via CSS left/transform
Motion blur: CSS filter + pseudo-element trail behind car
```

### Obstacles (Banana spritesheet)
```
Path:     public/obstacles/obstacle-banana.png
Frames:   4 frames, horizontal strip
Frame size: ~(total width / 4) × full height
Animation:
  animation: banana-spin steps(4) infinite 0.4s;
  @keyframes banana-spin {
    from { background-position: 0 0; }
    to   { background-position: -100% 0; }
  }
```

---

## Shared Components

### NeonButton
```
Variants:   green | red | blue
Shape:      rounded corners (border-radius: 8px)
Border:     2px solid (matching color, slightly lighter shade)
Shadow:     0 0 12px rgba(color, 0.4)
Padding:    12px 28px
Font:       Barlow Condensed, 700, uppercase
Icon:       optional left icon + label
Hover:      brightness(1.15), shadow increases
```

### NeonPanel
```
Background: var(--color-bg-secondary)
Border:     1px solid rgba(0, 212, 255, 0.2)
Border-radius: 12px
Backdrop:   backdrop-filter: blur(8px)
Glow (active): box-shadow: 0 0 20px rgba(0, 212, 255, 0.25)
```

### Team Slot Card
```
Background: var(--color-bg-card)
Border:     2px solid rgba(255,255,255,0.1)    /* empty */
            2px solid var(--color-neon-cyan)    /* filled */
Border-radius: 10px
Selected glow: box-shadow: 0 0 16px var(--color-neon-cyan-glow)
Size:       responsive — fills grid cell
```

### Slider
```
Track:      height 4px, background rgba(255,255,255,0.15), border-radius 2px
Fill:       background var(--color-neon-cyan)
Thumb:      16px circle, white, box-shadow: 0 0 6px rgba(0,212,255,0.6)
Value label: right-aligned, color var(--color-neon-cyan), font-weight 700
```

### ToggleSwitch
```
Track:      44px × 24px, border-radius 12px
Off state:  background rgba(255,255,255,0.15)
On state:   background var(--color-neon-cyan)
Thumb:      20px circle, white
Label:      "ON" / "OFF" text inside track, 10px Barlow Condensed
```

### Dropdown
```
Background: var(--color-bg-card)
Border:     1px solid rgba(0, 212, 255, 0.3)
Border-radius: 6px
Arrow:      chevron-down icon, cyan
Options:    same background, hover: var(--color-bg-card-hover)
```

### CountdownTimer
```
Container:  dark pill, border 1px solid rgba(255,255,255,0.2)
Label:      "RACE STARTING IN" — white, small caps
Digits:     var(--color-neon-magenta), large, monospace-width
```

### Boost Badge
```
Shape:      rounded rectangle
Background: rgba(0,0,0,0.6)
Border:     1px solid rgba(255,255,255,0.2)
Icon:       ⚡ yellow lightning bolt
Number:     white, bold
```

---

## Page-Specific Notes

### LobbyPage
- Header: home icon (top-left), settings icon (top-right) — both in chunky rounded-square buttons
- Team grid: 2 rows × 4 columns, responsive gap
- Bottom banner: infinite horizontal CSS scroll (`animation: marquee linear infinite`) — all countries, flag + name + code
- START RACE button: green, centered, prominent
- RESET TIMER button: red, next to START RACE

### RacePage
- Track area takes ~70% of vertical height
- Each lane: flag (left) + country code + car sprite (positioned by progress %) + boost badge (right of car)
- Finish line: right edge, CSS checkered pattern using `repeating-linear-gradient`
- Leader pill: top-center, gold border, crown icon above, flag + code inside
- Vote panel: bottom ~30%, shows only active race teams, large flag cards + vote count

### LeaderboardPage
- Left/center ~65% width: winner display
  - "WINNER IS" heading with checkered flag decorations
  - Large flag image centered
  - Gold laurel SVGs flanking the flag (left and right)
  - Country name in large bold italic below flag
  - #2–#5 cards in a row below
  - Race reset countdown + Restart Race button
- Right ~35% width: Today's Top Winners sidebar
  - Ranks 1–3: gold/silver/bronze medal circle icon
  - Ranks 4+: plain number
  - Wins count: gold color
- Confetti: CSS keyframe animation, multicolor particles, plays on mount

### SettingsPage
- Left sidebar: tabs — General, Audio, Display, Gameplay, Voting, Countries, Advanced
  - Active tab: filled with neon cyan background, white text
  - Inactive: transparent, gray text, hover dim highlight
  - Each tab has an icon (left) + label
- Right panel: settings items for active tab
  - Each row: icon (24px) + title (bold) + subtitle (gray, smaller) + control (right-aligned)
- Footer buttons: Save Changes (green), Reset to Defaults (red), Cancel (blue)
- General tab items: Master Volume, Music Volume, Sound Effects, Fullscreen Mode, Show Country Flags, Race Countdown Duration, Maximum Players, Default Country, Enable Confetti Effects, Reset Daily Leaderboard

### RacePage — Car Motion
```css
.car-sprite {
  position: absolute;
  left: calc(var(--progress) * 1%);  /* 0–85% range, 100% = finish */
  transition: left 0.3s ease-out;
  filter: drop-shadow(-8px 0px 6px rgba(255,255,255,0.3));  /* speed trail */
}
```

---

## Animation & Motion Rules

- **Infinite banner scroll:** `animation: marquee 30s linear infinite` — pause on hover
- **Car movement:** CSS `left` transition, `0.3s ease-out` per position update
- **Countdown digits:** color pulse on last 10 seconds — magenta to red
- **Winner reveal:** fade-in + scale-up, `0.6s ease-out`
- **Confetti:** 50–80 particles, random colors from palette, fall from top, `2–4s` duration
- **Obstacle sprite:** `steps(4)` animation on banana spritesheet, `0.4s` cycle
- **Glow pulse (selected card):** subtle `box-shadow` keyframe, `2s` ease-in-out infinite
- **No layout animations** — only opacity, transform, and color transitions. Never animate width/height.

---

## Responsiveness

- Primary target: **1920×1080** (fullscreen display/TV)
- Secondary: **1280×720**
- Use `clamp()` for all font sizes
- Use CSS Grid with `fr` units for layout — not fixed widths
- Use `vw`/`vh` for full-bleed sections
- Test at 1280px minimum width — game UI does not need to support mobile