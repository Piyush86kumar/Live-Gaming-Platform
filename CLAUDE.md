# CLAUDE.md — Race of Nations

## Project Overview
`race_of_nations` is a browser-based multiplayer racing game frontend. Players select countries in a lobby, watch a real-time race with a boost/vote system, and see results on a leaderboard. Built as a polished static frontend — no live backend yet.

---

## Tech Stack
- **Framework:** React 18 + TypeScript
- **Bundler:** Vite
- **State:** Zustand (`src/hooks/useGameStore.ts`)
- **Styling:** CSS Modules / global CSS (`src/index.css`)
- **Assets:** PNG sprites in `public/` (flags, cars, obstacles)
- **Routing:** React Router (pages in `src/pages/`)

---

## Folder Structure
```
public/
  flags/        # Flag PNGs named by country code — e.g. in.png, us.png
  cars/         # Car sprite PNGs named by country code — e.g. in.png, us.png
  obstacles/    # Obstacle spritesheets — e.g. obstacle-banana.png (4-frame sheet)
  sound/        # Audio assets
  countries.js  # Country list config

src/
  components/
    layout/     # GameBackground.tsx, GameHeader.tsx
    ui/         # Reusable controls — CarSprite, CountdownTimer, CountryFlag,
                #   Dropdown, GlowText, NeonButton, NeonPanel, Slider, ToggleSwitch
  data/
    mockData.ts # All mock data — countries, teams, leaderboard
  hooks/
    useGameStore.ts  # Zustand store — single source of truth
  lib/
    utils.ts    # Shared utility functions
  pages/
    LobbyPage.tsx
    RacePage.tsx
    LeaderboardPage.tsx
    SettingsPage.tsx
  types/
    index.ts    # All TypeScript interfaces
  App.tsx
  main.tsx
  index.css
```

---

## Key Conventions

### Naming
- Components: PascalCase (`CarSprite.tsx`)
- Hooks/store: camelCase with `use` prefix (`useGameStore.ts`)
- CSS classes: kebab-case
- Country codes: lowercase 2-letter ISO code (`in`, `us`, `au`) — matches asset filenames

### Asset Usage
- Flags: `<img src={/flags/${countryCode}.png} />` — always use `countryCode` (lowercase)
- Cars: `<img src={/cars/${countryCode}.png} />` — same convention
- Obstacles: single spritesheet, 4 frames horizontally — animate via CSS `steps()`
- Never hardcode asset paths as variables — always derive from country code

### State Management
- All game state lives in Zustand (`useGameStore.ts`) — do not use local `useState` for shared data
- Mock data is in `mockData.ts` — do not scatter mock values inside components
- Race teams = countries added in lobby — RacePage reads only active teams from store

### Styling
- No inline styles — use CSS classes only
- Background = pure CSS gradients (no background PNG) — see `design.md`
- All text labels in game UI = uppercase
- Responsive units: use `vw`, `vh`, `%`, `clamp()` — avoid fixed `px` for layout dimensions
- Breakpoints: design for 1920×1080 primary, scale down to 1280×720

### Components
- Reuse components from `src/components/ui/` — do not recreate buttons, panels, or toggles inline
- `GameBackground.tsx` wraps every page — do not add background styling inside page components
- `GameHeader.tsx` is used on all pages — do not duplicate header markup

---

## DO NOT
- Do not use inline styles (`style={{...}}`)
- Do not bypass Zustand — no prop-drilling shared state
- Do not modify the shape of types in `src/types/index.ts` without updating all consumers
- Do not add new npm packages without checking if a CSS/native solution exists first
- Do not hardcode country lists inside components — always read from `mockData.ts` or store
- Do not use `px` for top-level layout dimensions — use relative units
- Do not add background images via `<img>` — backgrounds are CSS only

---

## Page Responsibilities

| Page | Responsibility |
|------|---------------|
| `LobbyPage` | Country selection, team slot management, countdown timer, infinite flag scroll banner |
| `RacePage` | Live race track, car sprites, position progress, boost badges, vote panel (active teams only) |
| `LeaderboardPage` | Winner display with flag + laurel, top 5 podium, daily leaderboard sidebar, confetti |
| `SettingsPage` | Tabbed settings panel — General, Audio, Display, Gameplay, Voting, Countries, Advanced |

---

## Current Status
- Scaffolded and functional with mock data
- Visual redesign in progress — targeting design.md spec
- No live backend — all state is client-side mock

## Next Steps (in order)
1. Implement `GameBackground.tsx` (CSS stadium gradient)
2. Fix `CountryFlag.tsx` to use real PNG assets
3. Redesign `LobbyPage.tsx`
4. Redesign `RacePage.tsx`
5. Redesign `LeaderboardPage.tsx`
6. Redesign `SettingsPage.tsx`