# race_ui.md — RacePage Design Specification

---

## Viewport & Scaling Philosophy
- Same as lobby_design.md — `clamp()` everywhere, no fixed px for layout
- Primary: 1920×1080, Secondary: 1280×720
- Page fills exactly `100vh`, no scroll
- Track area and vote panel share vertical space via flex

---

## Full Page Layout

```
┌──────────────────────────────────────────────────────┐  100vh
│  [HOME]        RACE OF NATIONS           [SETTINGS]  │  flex: 0 0 auto (~10vh)
│              [CAN 👑 LEADER pill]                    │
├──────────────────────────────────────────────────────┤
│  ┌────┬─────┬──────────[track scrolls]────────────┐  │
│  │flag│ CAN │  🚗→  [banana] [rock]               │  │
│  ├────┼─────┼────────────────────────────────────  │  │  flex: 1 (~62vh)
│  │flag│ ESP │  🚗→        [oil]                   │  │  Track area
│  ├────┼─────┼────────────────────────────────────  │  │
│  │ .. │ ..  │  🚗→                                 │  │
│  └────┴─────┴────────────────────────────────────  │  │
├──────────────────────────────────────────────────────┤
│  SELECT YOUR COUNTRY TO BOOST YOUR CAR               │  flex: 0 0 auto (~28vh)
│  [CAN] [ESP] [MEX] [ARG] [TUR] [POL] [NED] [AUS]   │
└──────────────────────────────────────────────────────┘
```

### Root container
```css
.race-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-stadium);
}
```

---

## Section 1: Header (~10vh)

Same header pattern as LobbyPage — `GameHeader.tsx`.
- Home button top-left, Settings top-right (chunky rounded-square)
- Title: `RACE OF NATIONS` — "OF" in cyan

### Leader Pill (below title, centered)
```
       👑  (crown icon, gold, above pill)
┌─────────────────────────────┐
│  [FLAG]    CAN              │
│            LEADER           │
└─────────────────────────────┘
```
```css
.leader-pill {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1vw, 14px);
  background: rgba(5, 10, 26, 0.9);
  border: 2px solid #ffd700;
  border-radius: clamp(6px, 0.8vw, 10px);
  padding: clamp(4px, 0.6vh, 8px) clamp(12px, 1.5vw, 22px);
  position: relative;
}

.crown-icon {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffd700;
  font-size: clamp(14px, 1.4vw, 20px);
}

.leader-flag {
  width: clamp(28px, 2.8vw, 42px);
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 3px;
}

.leader-code {
  font-size: clamp(0.9rem, 1.3vw, 1.2rem);
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  line-height: 1;
}

.leader-label {
  font-size: clamp(0.55rem, 0.8vw, 0.75rem);
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```
- Updates in real time as race position changes
- Smooth transition when leader changes — no jarring flash

---

## Section 2: Track Area (flex: 1)

### Container
```css
.track-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

### Track Background — Asphalt
```css
.track-bg {
  position: absolute;
  inset: 0;
  background-color: #2a2a2a;
  /* Subtle asphalt grain texture via CSS noise */
  background-image:
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(255,255,255,0.01) 2px,
      rgba(255,255,255,0.01) 4px
    );
}
```

### Scrolling Track Layer
The track background scrolls right-to-left continuously while race is active, giving the illusion of forward movement.

```css
.track-scroll-layer {
  position: absolute;
  inset: 0;
  /* Wide enough to loop seamlessly — 200vw */
  width: 200vw;
  animation: trackScroll var(--track-scroll-speed) linear infinite;
}

@keyframes trackScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* Speed driven by JS CSS variable — faster when cars are faster */
/* Pauses when race ends */
```

`--track-scroll-speed` is set via JS based on average car speed. Default: `8s`. Faster cars = lower value.

### Lane Layout

One lane row per active team (8 max). Each lane has equal height.

```css
.lanes-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.lane-row {
  flex: 1;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
  position: relative;
  overflow: hidden;  /* clip car within lane */
}

.lane-row:first-child {
  border-top: 1px dashed rgba(255, 255, 255, 0.15);
}
```

### Lane Left Panel (fixed, does not scroll)
Flag + country code visible at all times on the left.

```css
.lane-info {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: clamp(6px, 0.8vw, 12px);
  padding: 0 clamp(8px, 1vw, 16px);
  width: clamp(100px, 10vw, 160px);
  z-index: 3;
  background: linear-gradient(to right, rgba(26,26,46,0.95) 70%, transparent);
}

.lane-flag {
  width: clamp(22px, 2.2vw, 34px);
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 3px;
}

.lane-code {
  font-size: clamp(0.75rem, 1.1vw, 1rem);
  font-weight: 700;
  color: white;
  text-transform: uppercase;
}
```

### Car Sprite

Car moves right across the lane. Position driven by race progress (0–100%).

```css
.car-sprite-wrapper {
  position: absolute;
  left: calc(var(--car-progress) * 1%);  /* JS updates --car-progress */
  transform: translateX(-50%);
  transition: left 0.25s linear;
  z-index: 4;
  display: flex;
  align-items: center;
}

.car-sprite {
  width: clamp(60px, 6vw, 100px);
  height: auto;
  /* Speed trail — motion blur effect */
  filter: drop-shadow(-6px 0 4px rgba(255, 200, 50, 0.55));
}
```

**Car progress range:** `5%` (start) to `88%` (finish line crossing). After crossing, car continues to ~`94%` then stops.

**Car image:** `/cars/{country.code}.png` — top-down sprite

#### Lane Vibration (rough track feel)
```css
.lane-row.racing .car-sprite-wrapper {
  animation: laneVibrate 0.12s ease-in-out infinite;
}

@keyframes laneVibrate {
  0%   { transform: translateX(-50%) translateY(0); }
  25%  { transform: translateX(-50%) translateY(-1.5px); }
  75%  { transform: translateX(-50%) translateY(1.5px); }
  100% { transform: translateX(-50%) translateY(0); }
}
/* Very subtle — stays within lane, barely perceptible */
/* Stop vibration when car hits obstacle or race ends */
```

### Boost Badge
Displayed immediately to the right of the car sprite, moves with car.

```css
.boost-badge {
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 5px;
  padding: 2px 6px;
  margin-left: clamp(4px, 0.5vw, 8px);
  white-space: nowrap;
}

.boost-icon { color: #ffd700; font-size: clamp(10px, 1vw, 14px); }
.boost-count { color: white; font-weight: 700; font-size: clamp(10px, 1vw, 14px); }
```

Shows accumulated boost count. Updates live as votes come in.

---

## Finish Line

The finish line is a vertical checkered stripe on the right side of the track.

```css
.finish-line {
  position: absolute;
  right: clamp(24px, 2.5vw, 40px);
  top: 0;
  bottom: 0;
  width: clamp(20px, 2vw, 32px);
  background-image: repeating-conic-gradient(#000 0% 25%, #fff 0% 50%);
  background-size: 16px 16px;
  z-index: 5;
  opacity: 0;  /* hidden at race start */
  transition: opacity 0.8s ease-in;
}

.finish-line.visible {
  opacity: 1;  /* shown when car progress > 80% */
}
```

**When finish line appears:**
- Trigger: leading car reaches 80% progress
- Fade in over 0.8s
- All cars stop after crossing it (progress capped at ~94%)

---

## Obstacle System

### Placement Rules
- Each lane gets 6–8 obstacles max, randomly placed
- Minimum 300 meters between obstacles on same lane
- Obstacle positions are pre-generated at race start, stored in state
- Different lanes have independent obstacle schedules

### Obstacle Types

| Type | Asset | Speed Effect | Duration | Visual on Car |
|------|-------|-------------|----------|----------------|
| Banana peel | `/obstacles/obstacle-banana.png` (4-frame sprite) | -100% speed (full stop briefly) | 1.2s | Spin animation |
| Rock | `/obstacles/obstacle-rock.png` | -60% speed | 0.8s | Shake animation |
| Oil slick | `/obstacles/obstacle-oil.png` | -40% speed | 0.6s | Shake animation |

### Obstacle Rendering
Each obstacle is positioned absolutely within the lane at its pre-calculated track position. As track scrolls, obstacles move left with it.

```css
.obstacle {
  position: absolute;
  /* X position = obstacle_meter_mark converted to screen % */
  left: calc(var(--obstacle-track-x) * 1px);
  top: 50%;
  transform: translateY(-50%);
  width: clamp(28px, 2.8vw, 44px);
  height: auto;
  z-index: 3;
  pointer-events: none;
}
```

### Obstacle Sprite Animation (banana)
```css
.obstacle-banana {
  width: calc(sprite-total-width / 4);  /* one frame */
  background-image: url('/obstacles/obstacle-banana.png');
  background-repeat: no-repeat;
  animation: bananaFrames 0.4s steps(4) infinite;
}

@keyframes bananaFrames {
  from { background-position-x: 0; }
  to   { background-position-x: -100%; }
}
```

### Car Hit Effects

**Banana — full spin:**
```css
@keyframes carSpin {
  0%   { transform: translateX(-50%) rotate(0deg) scale(1); }
  30%  { transform: translateX(-50%) rotate(180deg) scale(0.85); }
  70%  { transform: translateX(-50%) rotate(300deg) scale(0.9); }
  100% { transform: translateX(-50%) rotate(360deg) scale(1); }
}
.car-hit-banana { animation: carSpin 1.2s ease-out forwards; }
```

**Rock / Oil — shake:**
```css
@keyframes carShake {
  0%,100% { transform: translateX(-50%) translateX(0); }
  20%     { transform: translateX(-50%) translateX(-4px); }
  40%     { transform: translateX(-50%) translateX(4px); }
  60%     { transform: translateX(-50%) translateX(-3px); }
  80%     { transform: translateX(-50%) translateX(3px); }
}
.car-hit-rock { animation: carShake 0.8s ease-out forwards; }
.car-hit-oil  { animation: carShake 0.6s ease-out forwards; }
```

- Obstacle disappears on hit (remove from DOM or opacity: 0)
- Car vibration pauses during hit animation, resumes after

---

## Race Start Countdown

Full-screen overlay before race begins.

```css
.countdown-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
  z-index: 100;
  pointer-events: none;
}

.countdown-number {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(6rem, 15vw, 14rem);
  font-weight: 700;
  font-style: italic;
  color: white;
  text-shadow: 0 0 40px rgba(0, 212, 255, 0.8);
  animation: countPulse 0.9s ease-out;
}

@keyframes countPulse {
  0%   { transform: scale(1.4); opacity: 0; }
  40%  { transform: scale(1.0); opacity: 1; }
  80%  { transform: scale(0.95); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0; }
}
```

Sequence: `3` → `2` → `1` → `GO!` (GO in cyan `#00d4ff`)
Each number shows for 1 second. Race starts after GO fades.

---

## Section 3: Vote / Boost Panel (~28vh)

Only active race teams shown (from Zustand store). Max 8 cards.

```css
.vote-panel {
  flex: 0 0 auto;
  height: clamp(140px, 26vh, 240px);
  background: rgba(6, 13, 30, 0.97);
  border-top: 1px solid rgba(0, 212, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(8px, 1.2vh, 14px) clamp(16px, 2vw, 32px);
  gap: clamp(8px, 1.2vh, 14px);
}
```

### Heading
```
SELECT YOUR COUNTRY TO BOOST YOUR CAR
font: Barlow Condensed, 600, uppercase, clamp(0.7rem, 1vw, 0.95rem)
color: white
letter-spacing: 0.12em
```

### Cards Row
```css
.vote-cards-row {
  display: flex;
  gap: clamp(8px, 1.2vw, 18px);
  align-items: stretch;
  justify-content: center;
  flex: 1;
}
```

### Each Vote Card
```
┌──────────────────┐
│  ┌────────────┐  │
│  │  FLAG PNG  │  │  ← aspect-ratio: 4/3, width: 85% of card
│  └────────────┘  │
│      CAN         │  ← displayCode, white, bold, clamp(0.8rem,1.1vw,1rem)
│      Canada      │  ← name, cyan #00d4ff, clamp(0.6rem,0.85vw,0.8rem)
│      1 vote      │  ← vote count, gray #94a3b8, clamp(0.55rem,0.75vw,0.75rem)
└──────────────────┘
```

```css
.vote-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(3px, 0.5vh, 6px);
  background: rgba(13, 31, 60, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: clamp(6px, 0.8vw, 10px);
  padding: clamp(6px, 1vh, 12px) clamp(8px, 1vw, 14px);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
  min-width: clamp(70px, 8vw, 120px);
}

.vote-card:hover {
  border-color: rgba(0, 212, 255, 0.5);
  box-shadow: 0 0 12px rgba(0, 212, 255, 0.25);
}

.vote-card:active {
  transform: scale(0.95);  /* tactile click feedback */
}

/* Boosting state — brief flash when boost is applied */
.vote-card.boosting {
  border-color: #ffd700;
  box-shadow: 0 0 16px rgba(255, 215, 0, 0.5);
  animation: boostFlash 0.3s ease-out;
}

@keyframes boostFlash {
  0%   { background: rgba(255, 215, 0, 0.25); }
  100% { background: rgba(13, 31, 60, 0.9); }
}
```

### Vote Card Flag
```css
.vote-flag {
  width: 85%;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.2);
}
```

### Boost Mechanic
- Each click = +1 boost to that car
- Each boost = +30% speed for 1 second
- 5 accumulated boosts = +30% speed for 5 seconds (stacks duration, not intensity)
- Vote count displayed on card increments immediately on click
- Car's boost badge count increments simultaneously
- On boost activation: car gets brief gold glow, card gets `boosting` class for 0.3s

```css
.car-boosting .car-sprite {
  filter: drop-shadow(-6px 0 4px rgba(255,200,50,0.55))
          drop-shadow(0 0 8px rgba(255, 215, 0, 0.7));
  animation: boostPulse 0.5s ease-out;
}

@keyframes boostPulse {
  0%   { filter: drop-shadow(0 0 16px rgba(255,215,0,0.9)); }
  100% { filter: drop-shadow(-6px 0 4px rgba(255,200,50,0.55)); }
}
```

---

## Race State Machine

```
IDLE → COUNTDOWN (3,2,1,GO) → RACING → FINISHING → ENDED
```

| State | Track scroll | Cars | Obstacles | Voting |
|-------|-------------|------|-----------|--------|
| IDLE | stopped | at start | hidden | disabled |
| COUNTDOWN | stopped | at start, vibrating | hidden | disabled |
| RACING | scrolling | moving right | active | enabled |
| FINISHING | slowing scroll | crossing line, slowing | inactive | disabled |
| ENDED | stopped | stopped past line | hidden | disabled → navigate to leaderboard |

### Race End Flow
1. First car crosses finish (progress ≥ 88%) → `FINISHING` state
2. Finish line becomes visible (fade in triggered earlier at 80%)
3. All cars decelerate progressively after crossing, stop at ~94%
4. Cars stop one by one in finish order (1st stops first, etc.)
5. Track scroll slows to stop
6. After 2s pause → auto-navigate to LeaderboardPage with results

---

## Speed System

```typescript
interface CarState {
  countryCode: string
  progress: number        // 0–100, derived from distanceCovered / trackLength
  speed: number           // current speed in m/s, base: 40–60 m/s random per car
  baseSpeed: number       // starting speed
  boostCount: number      // accumulated unused boosts
  boostTimer: number      // seconds of boost remaining
  obstacleEffect: null | 'banana' | 'rock' | 'oil'
  obstacleTimer: number   // seconds of effect remaining
  finished: boolean
  finishRank: number | null
}
```

### Speed Calculation (per tick)
```
effectiveSpeed = baseSpeed
  + (boostActive ? baseSpeed * 0.30 : 0)
  - (obstacleEffect === 'banana' ? baseSpeed * 1.00 : 0)
  - (obstacleEffect === 'rock'   ? baseSpeed * 0.60 : 0)
  - (obstacleEffect === 'oil'    ? baseSpeed * 0.40 : 0)

effectiveSpeed = max(0, effectiveSpeed)
```

Game loop tick: every 100ms via `setInterval` or `requestAnimationFrame`.

---

## Zustand Store — RacePage Needs

```typescript
// Read
raceState: 'idle' | 'countdown' | 'racing' | 'finishing' | 'ended'
cars: CarState[]           // active race teams only (from lobby)
trackLength: number        // meters — from settings (1000/1500/2000)
leaderCode: string         // country code of current race leader

// Actions
startCountdown(): void
addBoost(countryCode: string): void   // +1 boost on click
tickRace(): void                       // called every 100ms
endRace(): void                        // navigate to leaderboard
```

---

## Spacing Reference

| Element | Value |
|---------|-------|
| Lane info panel width | `clamp(100px, 10vw, 160px)` |
| Car sprite width | `clamp(60px, 6vw, 100px)` |
| Boost badge font | `clamp(10px, 1vw, 14px)` |
| Finish line width | `clamp(20px, 2vw, 32px)` |
| Vote card min-width | `clamp(70px, 8vw, 120px)` |
| Vote panel height | `clamp(140px, 26vh, 240px)` |
| Obstacle sprite width | `clamp(28px, 2.8vw, 44px)` |
| Countdown number | `clamp(6rem, 15vw, 14rem)` |
| Lane vibration amplitude | `1.5px` (fixed — never scales up) |