# Race of Nations — Project Details

## Overview

**Race of Nations** is a browser-based 2D top-down car racing game where 8 countries compete in a straight-line drag race. The player controls the USA car using keyboard inputs, racing against 7 AI opponents across a 6,000-meter track filled with obstacles (banana peels, oil slicks, and rocks). The game features country flag liveries rendered via a 6-pass canvas compositing pipeline, a nitro boost system, real-time particle effects, and a persistent daily leaderboard with a reset option.

---

## Tech Stack & Rationale

| Technology | Version | Why It's Used |
|---|---|---|
| **Next.js** | 16.x | React framework with file-based routing, optimized builds, and static generation. Used in standalone output mode for efficient deployment. |
| **React** | 19.x | UI library for declarative rendering. Manages game state overlays (menus, countdown, leaderboard) while the canvas handles the game loop. |
| **TypeScript** | 5.x | Type safety for game data structures, state machines, and module interfaces. Prevents runtime errors in a complex real-time game loop. |
| **Tailwind CSS** | 4.x | Utility-first CSS framework for rapid UI styling of overlay elements (menus, countdown, leaderboard). No custom CSS needed. |
| **Canvas API** | Native | HTML5 Canvas is the core rendering engine. Chosen over WebGL/WebGPU for simplicity — this is a 2D sprite-based game, not a 3D simulation. Provides direct pixel control for the 6-pass livery compositing. |
| **flagcdn.com** | External API | Free, reliable flag image CDN. Flags are loaded at startup and composited onto car sprites. No API key required. |
| **localStorage** | Browser API | Persists the daily session leaderboard across page reloads. Keyed by date so each day starts fresh. No backend needed. |

### Why NOT Other Options

- **Not Three.js / Pixi.js**: The game is a 2D top-down view with simple sprite rendering. A full game engine would be overkill and add 500KB+ to the bundle.
- **Not WebSocket / Server**: The game is single-player (player vs. AI). No multiplayer synchronization is needed, so no server-side game state.
- **Not a Game Engine (Phaser, etc.)**: The game loop is straightforward (requestAnimationFrame + delta time). Building it natively with Canvas API gives full control over the compositing pipeline and keeps the bundle small.

---

## Project Structure

```
race-of-nations/
├── public/                          # Static assets served directly
│   ├── car-sprite.png               # Base car sprite sheet (612×408 px)
│   ├── obstacle-banana.png          # Banana peel sprite sheet (4-frame horizontal)
│   ├── obstacle-oil.png             # Oil slick sprite sheet (4-frame horizontal)
│   ├── obstacle-rock.png            # Rock sprite sheet (4-frame horizontal)
│   └── robots.txt                   # Search engine crawl directives
│
├── src/
│   ├── app/
│   │   ├── globals.css              # Tailwind v4 base styles, oklch color theme
│   │   ├── layout.tsx               # Root HTML layout, Geist fonts, Toaster mount
│   │   └── page.tsx                 # Main game component (React + Canvas)
│   │
│   ├── game/                        # Game logic modules (extracted from page.tsx)
│   │   ├── types.ts                 # All TypeScript interfaces & type definitions
│   │   ├── constants.ts             # Tunable game constants & country list
│   │   ├── assets.ts                # Sprite & flag image loading utilities
│   │   ├── livery.ts                # 6-pass car livery compositing pipeline
│   │   ├── obstacles.ts             # Obstacle generation & collision resolution
│   │   ├── leaderboard.ts           # Daily leaderboard persistence (localStorage) + reset
│   │   └── utils.ts                 # Drawing helpers (roundRect, formatTime)
│   │
│   ├── components/ui/               # shadcn/ui components (minimal subset)
│   │   ├── toast.tsx                # Toast notification component
│   │   └── toaster.tsx              # Toast provider/mount component
│   │
│   ├── hooks/
│   │   └── use-toast.ts             # Toast state management hook
│   │
│   └── lib/
│       └── utils.ts                 # cn() utility (clsx + tailwind-merge)
│
├── .env                             # Environment variables
├── .gitignore                       # Git ignore rules
├── eslint.config.mjs                # ESLint flat config
├── next-env.d.ts                    # Next.js TypeScript declarations
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies & scripts
├── postcss.config.mjs               # PostCSS config (Tailwind v4 plugin)
├── tailwind.config.ts               # Tailwind content paths
├── tsconfig.json                    # TypeScript configuration
└── project-details.md               # This file
```

---

## File-by-File Explanation

### `src/app/page.tsx` — Main Game Component

This is the entry point and the largest file. It:

1. **Loads assets** on mount (car sprite, obstacle sprites, country flags)
2. **Pre-renders car liveries** using the 6-pass compositing pipeline
3. **Runs the game loop** via `requestAnimationFrame` with delta-time normalization
4. **Manages game states**: loading → menu → countdown → racing → finished
5. **Handles keyboard input** for player acceleration, braking, and nitro
6. **Updates AI cars** with speed variation and obstacle effect handling
7. **Detects collisions** between cars and obstacles
8. **Renders the entire scene** to Canvas: sky, track, curbs, cars, obstacles, particles, progress bar
9. **Renders UI overlays** in React JSX: obstacle effect indicator, controls hint, menu, countdown, finish screen with leaderboard

The game loop uses a mutable `gameRef` (React ref) for performance — state that changes every frame (positions, speeds, timers) is stored in a plain object, not React state. Only values needed for UI display (rank, nitro, obstacle effect) are pushed to React state via setters.

#### UI Overlays

- **Obstacle Effect Indicator**: A small panel in the top-left corner that appears when the player hits an obstacle, showing "SPINNING!", "SLIDING!", or "SLOWED!" with color-coded styling (yellow/purple/red)
- **Controls Hint**: A bottom-center bar showing keyboard controls during racing
- **Countdown**: Full-screen 3-2-1-GO! overlay before the race starts
- **Start Menu**: Country grid, controls guide, and START RACE button
- **Finish Screen**: Two-panel layout with race results (center) and daily leaderboard (right)

### `src/game/types.ts` — Type Definitions

Defines all shared TypeScript interfaces:

- **`CountryEntry`**: ISO code + display name for flag loading
- **`Car`**: Full car state including position, speed, nitro, obstacle effect timers, and pre-rendered canvas
- **`Obstacle`**: Position, type, animation state, and collision tracking (`hitBy` set)
- **`ObstacleSpriteData`**: Loaded sprite sheet dimensions for frame slicing
- **`Particle`**: Position, velocity, lifetime, color, and size for visual effects
- **`GameState`**: State machine type (`loading | menu | countdown | racing | finished`)
- **`GameData`**: The mutable game state object stored in a React ref
- **`ObstacleEffect`**: HUD display type for active obstacle effects
- **`LeaderboardEntry`**: Win count per country for daily tracking

### `src/game/constants.ts` — Tunable Constants

All magic numbers live here for easy tuning:

- **Canvas & Track**: `CANVAS_W=1200`, `CANVAS_H=800`, `LANE_COUNT=8`, `LANE_HEIGHT=70`
- **Car Display**: `CAR_DISPLAY_W=64`, `CAR_DISPLAY_H=40`
- **Race Distance**: `RACE_DISTANCE=6000`, `START_X=120`, `FINISH_STOP_OFFSET=80`
- **Obstacles**: Hit radius, display size, animation frame count and speed
- **Sprite Geometry**: Source crop coordinates from the 612×408 sprite sheet
- **Player/AI Stats**: Max speed, acceleration ranges for both player and AI cars
- **Countries**: The 8 competing nations with their ISO codes

### `src/game/assets.ts` — Asset Loading

Three async functions that load images at game startup:

1. **`loadCarSprite()`**: Loads `/car-sprite.png` (the white base car)
2. **`loadAllObstacleSprites()`**: Loads all 3 obstacle sprite sheets in parallel, computes frame dimensions from sheet width / 4
3. **`loadFlagImage(code)`**: Loads a country flag from `flagcdn.com/w160/{code}.png`. Falls back to a gray rectangle with the country code if the CDN fails

### `src/game/livery.ts` — 6-Pass Compositing Pipeline

The `renderCountryCar()` function takes a base car sprite and a flag image, then composites them through 6 canvas operations:

| Pass | Composite Operation | Purpose |
|---|---|---|
| 1 | source-over | Draw the base car sprite |
| 2 | source-atop | Paint the flag onto the car body (only where car pixels exist) |
| 3 | multiply | Re-draw car sprite over flag — preserves car shading/detail while tinting with flag colors |
| 4 | color-burn | Darkens windows and outlines — adds depth to the compositing |
| 5 | source-atop | Vertical shading gradient — simulates light from above (lighter top, darker bottom) |
| 6 | source-atop | Horizontal shading gradient — simulates 3D body curvature |

The result is an offscreen `<canvas>` element stored on each `Car` object, drawn at 64×40 px during the game loop.

### `src/game/obstacles.ts` — Obstacle System

Two functions:

1. **`generateObstacles()`**: Creates 16 obstacles (2 per lane) with even spatial distribution. For each lane, the track is divided into 2 segments and a random X position is chosen within each segment. Types are randomly assigned.

2. **`processObstacleCollisions()`**: Checks every obstacle against every car in the same lane. If a collision is detected (distance < 22px), the appropriate effect is applied:

| Obstacle | Effect | Duration | Speed Penalty |
|---|---|---|---|
| Banana | Spin (car rotates) | ~0.75s | ×0.3 |
| Oil | Slide (speed wobble) | ~1.0s | ×0.6 |
| Rock | Slow (reduced max speed) | ~1.3s | ×0.15 |

Impact particles are spawned on collision (8 per hit, colored by obstacle type).

### `src/game/leaderboard.ts` — Daily Session Leaderboard

Persists win counts per country using `localStorage`, scoped to the current date:

- **`loadSessionLeaderboard()`**: Reads from `race-leaderboard-YYYY-MM-DD`, or initializes all 8 countries at 0 wins
- **`saveSessionLeaderboard()`**: Writes the leaderboard array as JSON
- **`recordRaceResult(standings)`**: Increments the winner's win count and returns the updated leaderboard
- **`resetSessionLeaderboard()`**: Clears all win counts to 0, saves the fresh leaderboard to localStorage, and returns it. Called by the "Reset Daily Leaderboard" button on the finish screen

### `src/game/utils.ts` — Drawing Helpers

- **`roundRect()`**: Draws a rounded rectangle path (used for the progress bar). Does not fill or stroke — the caller handles that.
- **`formatTime()`**: Converts elapsed seconds to `M:SS.CC` format (used internally, not displayed in race HUD).

### `src/app/layout.tsx` — Root Layout

Standard Next.js root layout that:
- Loads Geist Sans and Geist Mono fonts
- Applies Tailwind's `antialiased` and theme classes
- Mounts the `<Toaster />` component for future notifications
- Sets page metadata (title, description, keywords)

### `src/app/globals.css` — Global Styles

Tailwind v4 CSS-first configuration:
- Imports `tailwindcss` and `tw-animate-css`
- Defines oklch-based color variables for light/dark themes
- Sets up shadcn/ui theme variables (background, foreground, card, primary, etc.)

### `src/components/ui/` — Toast Components

Minimal shadcn/ui component subset for toast notifications:
- **`toast.tsx`**: Radix UI toast primitive wrappers with CVA variants
- **`toaster.tsx`**: Mount component that renders active toasts
- **`use-toast.ts`** (hook): State management for toast queue

### `src/lib/utils.ts` — Utility Function

Single `cn()` function that merges `clsx` conditional classes with `tailwind-merge` deduplication. Used by all shadcn/ui components.

---

## Game Architecture

### State Machine

```
loading → menu → countdown → racing → finished
                                        ↓
                              countdown (Race Again)
```

- **loading**: Assets are being downloaded (sprites + flags)
- **menu**: Start screen with country grid and controls guide
- **countdown**: 3-2-1-GO countdown before race starts
- **racing**: Active gameplay with keyboard input
- **finished**: Race results with top-5 podium and session leaderboard

### Game Loop (60fps target)

The game loop runs via `requestAnimationFrame` with delta-time normalization (`dt = elapsed / 16.667`), capped at 2× to prevent spiral-of-death on tab switches.

**Update phase** (when `racing`):
1. Decrement obstacle effect timers on all cars
2. Update finished cars (coast to stop)
3. Process player input (accelerate, brake, nitro)
4. Update AI cars (speed variation, obstacle effects)
5. Check finish line crossings
6. Process obstacle collisions
7. Spawn nitro exhaust particles
8. Update and cull particles
9. Calculate player rank
10. Check if race is over

**Render phase** (every frame):
1. Clear canvas
2. Draw sky gradient + stars
3. Draw ground + grandstand with crowd dots
4. Draw track surface + curbs + lane dividers
5. Draw lane labels (mini car sprite + country name)
6. Draw distance markers
7. Draw start/finish lines
8. Draw particles
9. Draw obstacles (with animation and oil shimmer)
10. Draw cars (with spin/slow/nitro visual effects)
11. Draw player highlight arrow
12. Draw progress bar (top of screen, colored dots per car)

### Performance Strategy

- **Pre-rendered car liveries**: The 6-pass compositing only runs once per car at startup. During the game loop, each car is drawn with a single `drawImage()` call.
- **Mutable ref for game state**: Frame-by-frame state (positions, speeds) is stored in a plain object via `useRef`, avoiding React re-renders on every frame.
- **Selective React state**: Only UI-displayed values (rank, nitro, obstacle effect) trigger React state updates.
- **Frustum culling**: Cars and obstacles outside the visible canvas are skipped during rendering.
- **Sprite sheet animation**: Obstacles use 4-frame horizontal sprite sheets, advancing frames at ~5fps (every 12 game ticks).

---

## Controls

| Key | Action |
|---|---|
| W / Arrow Up | Accelerate |
| S / Arrow Down | Brake |
| Shift | Activate nitro boost |

---

## Obstacle Types

| Obstacle | Visual Effect | Gameplay Effect |
|---|---|---|
| Banana Peel | Car spins (rotates rapidly) | Speed ×0.3, no acceleration for ~0.75s |
| Oil Slick | Dark overlay + speed wobble | Speed ×0.6, random speed variation for ~1.0s |
| Rock | Red tint overlay | Speed ×0.15, max speed capped at 35% for ~1.3s |

Each lane has exactly 2 obstacles, ensuring even distribution across the 8-lane track (16 total obstacles per race).

---

## Leaderboard System

The daily leaderboard tracks wins per country and persists in `localStorage` using date-scoped keys (`race-leaderboard-YYYY-MM-DD`). Key features:

- **Automatic daily reset**: Each new calendar day starts with a fresh leaderboard (all countries at 0 wins) due to the date-scoped localStorage key
- **Win tracking**: Only the race winner (1st place) receives a +1 to their win count
- **Manual reset**: A "Reset Daily Leaderboard" button on the finish screen allows players to clear all win counts mid-day. The button:
  - Sets all country win counts back to 0
  - Saves the fresh leaderboard to localStorage
  - Immediately updates the UI
  - Is styled with a red theme to signal a destructive action
- **Display**: Sorted by wins descending, filtered to countries with at least 1 win, shown with flag images and medal icons (gold/silver/bronze for top 3)

---

## Deployment

The project uses Next.js `output: "standalone"` mode, which produces a self-contained build in `.next/standalone/` that can be deployed without `node_modules`.

```bash
npm run build    # Build the production bundle
npm run start    # Start the production server
```

For development:
```bash
npm run dev      # Start dev server on port 3000
```

---

## Key Design Decisions

1. **Canvas over DOM**: The game is rendered entirely on a `<canvas>` element because:
   - We need per-pixel compositing (6-pass livery pipeline)
   - Sprite animation requires direct image manipulation
   - Particle systems need frame-by-frame rendering
   - DOM-based rendering of 8 moving cars + 16 obstacles + particles would be janky

2. **React overlays on top of Canvas**: UI elements (menus, countdown, leaderboard) are React components positioned absolutely over the canvas. This gives us:
   - Tailwind styling for beautiful UI
   - Declarative state management
   - Accessibility (keyboard navigation, screen reader support)

3. **Minimal race HUD**: The race UI is intentionally clean — only the obstacle effect indicator appears during racing (when the player hits an obstacle), keeping the view unobstructed. The progress bar on the canvas provides spatial awareness of all cars' positions.

4. **No backend**: The game is fully client-side. The daily leaderboard uses localStorage. This keeps the deployment simple (static hosting) and eliminates latency.

5. **Flag CDN over local flags**: Using flagcdn.com means we always get up-to-date flag images without bundling 160+ flag PNGs. The fallback ensures the game works even if the CDN is down.

6. **Pre-rendered liveries over real-time compositing**: The 6-pass compositing pipeline runs once at startup, producing an offscreen canvas per car. This avoids running 6 `drawImage` calls per car per frame (48 vs 8 draw calls per frame).

7. **Leaderboard reset option**: While the leaderboard auto-resets daily via date-scoped keys, a manual reset button gives players control to start fresh at any time — useful for testing or when playing multiple sessions in a day.
