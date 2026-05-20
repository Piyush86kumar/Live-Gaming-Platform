# lobby_design.md — LobbyPage Design Specification

---

## Viewport & Scaling Philosophy

- **Primary target:** 1920×1080 (fullscreen TV/display)
- **Secondary:** 1280×720, 1440×900, 1366×768
- **Approach:** Every size value uses `clamp()` or viewport-relative units — NO fixed `px` for layout dimensions
- **Font sizes:** all `clamp(min, preferred-vw, max)`
- **Card sizes:** CSS Grid with `1fr` columns — cards grow/shrink with viewport
- **Images:** `width: 100%`, `object-fit: cover` — never fixed pixel dimensions on flags
- **The page must fill exactly 100vh with no scroll** — all sections share the vertical space proportionally using `flex` with `flex: N` ratios

---

## Full Page Layout

```
┌──────────────────────────────────────────────────────┐  ← 100vh total
│                                                      │
│  [HOME]        RACE OF NATIONS           [SETTINGS]  │  flex: 0 0 auto (~12vh)
│             RACE STARTING IN  00:60                  │
│                                                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │  [FLAG] │ │  [FLAG] │ │ [icon]  │ │ [icon]  │    │  flex: 1 (~52vh)
│  │   USA   │ │   IND   │ │ TEAM 3  │ │ TEAM 4  │    │  (team grid takes
│  │ United  │ │  India  │ │Waiting..│ │Waiting..│    │   majority of space)
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ [icon]  │ │ [icon]  │ │ [icon]  │ │ [icon]  │    │
│  │ TEAM 5  │ │ TEAM 6  │ │ TEAM 7  │ │ TEAM 8  │    │
│  │Waiting..│ │Waiting..│ │Waiting..│ │Waiting..│    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│                                                      │
│            [START RACE]  [RESET TIMER]               │  flex: 0 0 auto (~8vh)
│                                                      │
├──────────────────────────────────────────────────────┤
│  CHOOSE YOUR COUNTRY                                 │  flex: 0 0 auto (~28vh)
│  ┌──────────────────────────────────────────────┐    │
│  │→ [flag] United States USA  [flag] India IND →│    │
│  └──────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### Root container CSS
```css
.lobby-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-stadium);  /* CSS gradient from design.md */
}
```

---

## Section 1: Header (~12vh)

```css
.lobby-header {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(8px, 1.5vh, 20px) clamp(16px, 2vw, 40px);
  position: relative;
}
```

### Home & Settings Buttons
- **Position:** absolute top-left and top-right of header
- **Size:** `clamp(40px, 4vw, 56px)` square
- **Style:**
  ```css
  background: rgba(10, 22, 40, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: clamp(6px, 0.8vw, 10px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  ```
- **Icon size:** `clamp(18px, 1.8vw, 26px)`

### Title
```css
font-family: 'Barlow Condensed', sans-serif;
font-weight: 700;
font-style: italic;
font-size: clamp(2rem, 4.5vw, 4rem);
text-transform: uppercase;
letter-spacing: 0.05em;
```
- "RACE" → white
- "OF" → `#00d4ff` cyan
- "NATIONS" → white

### Countdown Pill
```css
display: flex;
align-items: center;
gap: clamp(8px, 1vw, 16px);
background: rgba(5, 10, 26, 0.85);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 8px;
padding: clamp(4px, 0.6vh, 8px) clamp(12px, 1.5vw, 24px);
margin-top: clamp(4px, 0.8vh, 10px);
```
- Label `RACE STARTING IN`: white, `clamp(0.7rem, 1vw, 0.9rem)`, uppercase, letter-spacing 0.1em
- Digits `00:60`: `#ff00aa` magenta, `clamp(1.4rem, 2.2vw, 2rem)`, bold, monospace

---

## Section 2: Team Grid (flex: 1, takes remaining space after header/buttons/banner)

```css
.team-grid-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(8px, 1.5vh, 20px) clamp(16px, 2.5vw, 48px);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: clamp(8px, 1.2vw, 20px);
  height: 100%;
}
```

### All Cards — identical dimensions, same proportions
```css
.team-card {
  border-radius: clamp(6px, 0.8vw, 12px);
  background: #0d1f3c;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 0;  /* critical for flex children to shrink properly */
}
```

### Filled Card
```
┌──────────────────────────────────┐
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │  ← flag image
│  │      FLAG PNG IMAGE        │  │     width: 85% of card
│  │                            │  │     height: ~60% of card height
│  └────────────────────────────┘  │     object-fit: cover
│                                  │     border-radius: 4px
│            USA                   │  ← displayCode
│         United States            │  ← name
│                                  │
└──────────────────────────────────┘
```
```css
border: 2px solid #00d4ff;
box-shadow: 0 0 clamp(8px, 1.2vw, 20px) rgba(0, 212, 255, 0.35);

.card-flag {
  width: 85%;
  aspect-ratio: 3/2;   /* standard flag ratio — scales correctly at any size */
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: clamp(4px, 0.8vh, 10px);
}

.card-display-code {
  font-size: clamp(0.9rem, 1.4vw, 1.3rem);
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  line-height: 1.1;
}

.card-country-name {
  font-size: clamp(0.65rem, 0.9vw, 0.9rem);
  color: #94a3b8;
  margin-top: 2px;
}
```

### Empty Card
```
┌──────────────────────────────────┐
│                                  │
│         [group SVG icon]         │  ← size: clamp(28px, 3vw, 48px)
│                                  │     color: #4a5568
│           TEAM 3                 │  ← clamp(0.8rem, 1.2vw, 1.1rem), white, bold
│          Waiting...              │  ← clamp(0.6rem, 0.85vw, 0.8rem), #4a5568
│                                  │
└──────────────────────────────────┘
```
```css
border: 1px solid rgba(255, 255, 255, 0.1);
opacity: 0.7;
cursor: default;
```

### Interaction
- Click country in banner → fills **lowest-numbered** empty slot
- Click filled card → removes country, slot resets to empty
- Max 8 teams

---

## Section 3: Action Buttons (~8vh)

```css
.lobby-buttons {
  flex: 0 0 auto;
  display: flex;
  gap: clamp(8px, 1.2vw, 20px);
  justify-content: center;
  padding: clamp(6px, 1vh, 14px) 0;
}
```

### Both buttons share base style
```css
height: clamp(40px, 5vh, 58px);
min-width: clamp(160px, 14vw, 240px);
border-radius: clamp(6px, 0.6vw, 10px);
font-family: 'Barlow Condensed', sans-serif;
font-weight: 700;
font-size: clamp(0.8rem, 1.1vw, 1rem);
text-transform: uppercase;
letter-spacing: 0.08em;
cursor: pointer;
transition: filter 0.15s, box-shadow 0.15s;
```

| Button | Background | Border | Shadow |
|--------|-----------|--------|--------|
| START RACE | `#22c55e` | `#16a34a` | `0 0 14px rgba(34,197,94,0.45)` |
| RESET TIMER | `#c0213a` | `#9b1a2e` | `0 0 14px rgba(192,33,58,0.45)` |

Hover: `filter: brightness(1.12)`, shadow intensity increases

---

## Section 4: Infinite Scroll Banner (~28vh)

```css
.banner-section {
  flex: 0 0 auto;
  height: clamp(140px, 26vh, 240px);
  display: flex;
  flex-direction: column;
  background: rgba(6, 13, 30, 0.97);
  border-top: 1px solid rgba(0, 212, 255, 0.2);
  padding-top: clamp(8px, 1.2vh, 16px);
  overflow: hidden;
}
```

### "CHOOSE YOUR COUNTRY" Heading
```css
text-align: center;
font-family: 'Barlow Condensed', sans-serif;
font-weight: 600;
font-size: clamp(0.7rem, 1vw, 0.95rem);
text-transform: uppercase;
letter-spacing: 0.15em;
color: white;
margin-bottom: clamp(8px, 1.2vh, 14px);
flex: 0 0 auto;
```

### Scroll Track Wrapper
```css
.banner-overflow {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
}
```

### Scroll Track
```css
.banner-track {
  display: flex;
  align-items: center;
  gap: clamp(24px, 3vw, 56px);
  width: max-content;
  animation: marquee 55s linear infinite;
  padding: 0 clamp(12px, 1.5vw, 24px);
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
/* Always scrolling — NO pause on hover */
```

Render `[...countries, ...countries]` for seamless loop.

### Each Banner Item
```
┌──────────────────┐
│   ┌──────────┐   │
│   │  FLAG    │   │  ← aspect-ratio: 4/3, width: clamp(48px, 5vw, 80px)
│   │  IMAGE   │   │     object-fit: cover, border-radius: 6px
│   └──────────┘   │     border: 1px solid rgba(255,255,255,0.2)
│  United States   │  ← name: white, clamp(0.6rem, 0.85vw, 0.8rem)
│      USA         │  ← displayCode: #00d4ff cyan, clamp(0.55rem, 0.75vw, 0.75rem), bold
└──────────────────┘
```

```css
.banner-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(3px, 0.5vh, 6px);
  cursor: pointer;
  flex-shrink: 0;
}

.banner-item:hover .banner-flag {
  border-color: rgba(0, 212, 255, 0.6);
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
}

.banner-flag {
  width: clamp(48px, 5vw, 80px);
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.banner-name {
  font-size: clamp(0.6rem, 0.85vw, 0.8rem);
  color: white;
  white-space: nowrap;
}

.banner-code {
  font-size: clamp(0.55rem, 0.75vw, 0.75rem);
  color: #00d4ff;
  font-weight: 700;
  white-space: nowrap;
}
```

### Click behavior
- Click banner item → adds to next empty lobby slot
- Banner continues scrolling during and after click
- No selected state visible on banner items

---

## Vertical Proportion Summary

At 1920×1080:

| Section | Approx height | flex behavior |
|---------|--------------|---------------|
| Header (title + countdown) | ~130px | `flex: 0 0 auto` |
| Team Grid | ~580px | `flex: 1` — grows/shrinks |
| Buttons | ~80px | `flex: 0 0 auto` |
| Banner | ~210px | `flex: 0 0 auto` |
| **Total** | **~1000px** | remaining = padding |

At 1280×720 (scales down ~67%):

| Section | Approx height |
|---------|--------------|
| Header | ~90px |
| Team Grid | ~380px |
| Buttons | ~60px |
| Banner | ~150px |

---

## Data Shape

### Country object
```typescript
interface Country {
  code: string         // 2-letter ISO lowercase — matches asset filename: "us", "in"
  displayCode: string  // 2–3 letter display: "USA", "IND", "CHN", "UK"
  name: string         // full name: "United States", "India"
}
```

### Asset paths
```
/flags/{country.code}.png   →  /flags/us.png
/cars/{country.code}.png    →  /cars/us.png
```

### Zustand store
```typescript
teams: (Country | null)[]        // length always 8, null = empty
countries: Country[]             // full list — source for banner
countdown: number                // seconds remaining
addTeam(country: Country): void  // fills lowest-index null slot
removeTeam(index: number): void  // sets teams[index] = null
startRace(): void
resetTimer(): void
```

---

## Responsive Breakpoint Behavior

| Viewport width | Adjustments |
|----------------|-------------|
| ≥1920px | All clamp() values at max — spacious feel |
| 1440–1919px | Mid values — design looks as intended |
| 1280–1439px | Min/mid values — slightly compact but fully readable |
| <1280px | Not supported — game UI targets desktop/TV only |

**Never use media queries for this page** — `clamp()` + `flex: 1` handles all scaling continuously.