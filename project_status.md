# Project Status

## What is this project?
`race_of_nations` is a browser-based multiplayer racing game frontend built with React 18 + TypeScript and Vite. Players select countries in a lobby, watch a real-time race with a boost/vote system, and see results on a leaderboard. No live backend — all state is client-side mock.

---

## Current Status

### Overall: ✅ LobbyPage & RacePage Redesigned
- Both LobbyPage and RacePage have been redesigned per design specifications
- Build passes with no TypeScript errors
- Tech stack: React 19, TypeScript 5.6, Vite 6, Zustand 5, Tailwind CSS 4, lucide-react 0.460

### Build Commands
```bash
npm run dev      # Start development server
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
```

---

## Tech Stack

| Category | Technology |
|---------|------------|
| Framework | React 19.0.0 |
| Language | TypeScript 5.6 |
| Bundler | Vite 6.4.2 |
| State Management | Zustand 5.0.0 |
| Styling | Tailwind CSS 4 + @tailwindcss/vite |
| Routing | React Router DOM 7.0.0 |
| Icons | lucide-react 0.460.0 |
| Utilities | clsx 2.1.1, tailwind-merge 2.6.0 |

---

## Recent Changes

### 1. LobbyPage Redesign (COMPLETED)
- **Layout**: Flexbox column, 100vh, no scroll, `clamp()` sizing throughout
- **Header**: Uses shared `GameHeader` component with screen-corner Home/Settings buttons, centered title "RACE OF NATIONS" with "OF" in cyan
- **Countdown pill**: "RACE STARTING IN" label + magenta digits, inline pill with `fit-content` + centered
- **Team Grid**: 2 rows × 4 columns, clamped column width `minmax(0, clamp(150px,15vw,220px))`, centered
- **Team Cards**:
  - Filled: Flag fills entire card via `position: absolute; inset: 0`, `aspect-ratio: 3/2`, no text
  - Empty: Users icon + "TEAM N" + "Waiting..."
  - Click filled card to remove country
- **Buttons**: START RACE (green #22c55e), RESET TIMER (red #c0213a), `flex-shrink: 0` to prevent squishing
- **Banner**: Infinite scroll, no pause on hover, 55s animation, height-based flag sizing `clamp(43px,6vh,72px)`

### 2. RacePage Redesign (COMPLETED)
- Now uses `bg-track` variant (asphalt dark surface) instead of `bg-stadium`
- **Header**: Same style as LobbyPage
- **Leader Pill**: Crown icon above, gold border, flag + code + "LEADER" label
- **Track Area** (flex: 1):
  - Scrolling asphalt background (200vw, 8s animation)
  - Lane rows with dashed dividers
  - Left info panel: flag + country code (fixed, gradient fade)
  - Car sprites positioned by `progress%` with `translateX(-50%)`
  - Lane vibration animation when racing
  - Boost badges with ⚡ icon
  - Checkered finish line (right side)
- **Vote Panel** (28vh): All teams with flag, code, name, vote count, boost flash on click
- **FINISH RACE button**: Floating green button

### 3. Data Model Updates
- **Country interface**: `{ code: string, displayCode: string, name: string }`
  - `code`: lowercase 2-letter ISO (matches asset filenames)
  - `displayCode`: 3-letter code (USA, IND, GBR)
  - `name`: Full country name
- **Player interface**: `{ id, countryCode, displayCode, countryName, teamNumber, isReady }`
- All mock data updated to use lowercase country codes

### 4. Zustand Store Updates
- `selectCountry(countryCode, teamNumber)` - fills team slot with country data
- `removeCountry(teamNumber)` - clears team slot
- `startRace()` - sets raceInProgress: true
- `resetRace()` - resets to initial state
- `voteForCountry(countryCode)` - increments vote count
- `setCountdown(value)` - update countdown
- `setWinner(countryCode)` - set winner and end race

### 5. UI Component Fixes
- **NeonButton**: primary (green #22c55e), danger (red #c0213a), secondary, ghost variants
- **CountdownTimer**: Magenta (#ff00aa) digits, removed inner card wrapper, inline label+digits
- **CountryFlag**: Added `xl` (72×48), `banner` (24×16) size options
- **GameHeader**: Restructured with `position: fixed` buttons anchored to screen corners, `game-header-btn` CSS classes
- **SettingsPage**: Fixed button variant references

### 6. JSX Comment Cleanup
- Removed all bare `/* */` comments from JSX text nodes across `App.tsx`, `main.tsx`, `GameBackground.tsx`, `GameHeader.tsx`, `LobbyPage.tsx`, `RacePage.tsx`
- Only proper `{/* ... */}` JSX comments retained in .tsx files

### 7. Stadium Background Updated
- Central spotlight (white→cyan→transparent) + two side cyan washes over dark navy gradient

---

## Design System

### Color Palette (CSS Variables)
```css
--color-bg-primary:      #050a1a   /* base background */
--color-bg-secondary:    #0a1628   /* panels, cards */
--color-bg-card:         #0d1f3c   /* slot/card background */
--color-bg-card-hover:  #112447   /* hover state */

--color-neon-cyan:       #00d4ff   /* primary accent */
--color-neon-cyan-glow:  rgba(0, 212, 255, 0.3)
--color-neon-magenta:    #ff00aa   /* countdown digits */
--color-neon-gold:       #ffd700   /* winner, boost icon */

--color-text-primary:    #ffffff
--color-text-secondary:  #94a3b8
--color-text-accent:     #00d4ff
--color-text-gold:       #ffd700
```

### Typography
- **Font**: Barlow Condensed (Google Fonts)
- **Weights**: 400, 600, 700
- **Style**: Uppercase, italic for titles
- **Responsive**: All sizes use `clamp(min, preferred, max)`

### Backgrounds (Pure CSS, no images)
```css
.bg-stadium {
  background:
    radial-gradient(ellipse 40% 60% at 15% 0%, rgba(0, 150, 255, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 40% 60% at 85% 0%, rgba(0, 150, 255, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0, 80, 180, 0.15) 0%, transparent 60%),
    linear-gradient(180deg, #0a1628 0%, #050a1a 60%, #020710 100%);
}
```

---

## Asset Specifications

### Flags
```
Path:     /flags/country_flag/{code}.png
Example:  /flags/country_flag/us.png, /flags/country_flag/in.png
Codes:    lowercase 2-letter ISO (us, in, gb, jp, etc.)
Sizes:    sm (32×22), md (48×32), lg (80×53), xl (72×48), banner (24×16), full (240×160)
```

### Car Sprites
Two types available:
```
F1:   /cars/f1_car_livery_sprites/{code}.png
Rally: /cars/rally_car_livery_sprites/{code}.png
Example: /cars/rally_car_livery_sprites/us.png
Size: ~80px wide, ~48px tall (top-down sprite)
Current usage: RacePage uses rally_car_livery_sprites
```

### Obstacles
```
Path:     /obstacles/obstacle-{type}.png
Types:    banana (4-frame spritesheet), rock, oil
Animation: banana spins with steps(4) over 0.4s
```

---

## Zustand Store Structure

### State
```typescript
{
  currentPage: string
  settings: GameSettings           // { masterVolume, musicVolume, soundEffects, fullscreenMode, ... }
  players: Player[]                // 8 slots, isReady indicates filled/empty
  raceParticipants: RaceParticipant[]  // 8 cars with progress, boosts, position
  leaderboard: LeaderboardEntry[]  // 10 entries with rank, countryCode, countryName, wins
  votes: Record<string, number>    // countryCode -> vote count
  countdown: number                // seconds remaining (starts at 60)
  raceInProgress: boolean
  winner: string | null
  selectedCountry: string
}
```

### Available Actions
```typescript
setPage(page)
updateSettings(settings)
resetSettings()
selectCountry(countryCode, teamNumber)
removeCountry(teamNumber)
startRace()
resetRace()
voteForCountry(countryCode)
setCountdown(value)
setWinner(countryCode)
```

---

## Mock Data

### COUNTRIES (24 total)
| Code | Display | Name |
|------|---------|------|
| us | USA | United States |
| in | IND | India |
| cn | CHN | China |
| gb | GBR | United Kingdom |
| jp | JPN | Japan |
| de | GER | Germany |
| fr | FRA | France |
| ca | CAN | Canada |
| au | AUS | Australia |
| br | BRA | Brazil |
| ar | ARG | Argentina |
| es | ESP | Spain |
| ... | ... | ... (12 more) |

### MOCK_RACE_PARTICIPANTS
8 participants with position, progress (0-100), boosts count

### MOCK_LEADERBOARD
10 entries ranked by wins (1-10)

### MOCK_VOTES
Sample vote distribution across countries

### DEFAULT_SETTINGS
```typescript
{
  masterVolume: 80,
  musicVolume: 65,
  soundEffects: 90,
  fullscreenMode: true,
  showCountryFlags: true,
  raceCountdownDuration: 60,
  maxPlayers: 8,
  defaultCountry: 'IN',
  enableConfetti: true
}
```

---

## Page Responsibilities

| Page | Route | Features |
|------|-------|----------|
| LobbyPage | `/lobby` | Country selection, 8 team slots, countdown, infinite banner |
| RacePage | `/race` | Track with 8 lanes, car sprites, leader pill, vote panel |
| LeaderboardPage | `/leaderboard` | Winner display, podium cards, daily leaderboard, confetti |
| SettingsPage | `/settings` | 7 tabs (General, Audio, Display, Gameplay, Voting, Countries, Advanced) |

---

## Application Routes

```typescript
type PageRoute = '/' | '/lobby' | '/race' | '/leaderboard' | '/settings'
```

---

## Design Conventions

### Responsive Design
- **Primary target**: 1920×1080
- **Secondary**: 1280×720, 1440×900, 1366×768
- **Minimum**: 1280px (no mobile support)
- **Method**: `clamp()` for all sizes, flexbox with `flex: 1`, CSS Grid with `fr` units

### Naming Conventions
- Components: PascalCase (CarSprite.tsx)
- Hooks: camelCase with `use` prefix (useGameStore.ts)
- CSS classes: kebab-case
- Country codes: lowercase 2-letter ISO

### Key Rules
- NO inline styles
- NO prop-drilling (use Zustand)
- NO hardcoded country lists (use mockData.ts)
- NO `px` for layout dimensions
- NO background images (CSS only)
- All text labels uppercase
- Font: Barlow Condensed, uppercase, letter-spacing 0.05em

---

## Project Structure

```
race_of_nations/
├── public/
│   ├── countries.js
│   ├── flags/country_flag/     # 100+ flag PNGs
│   ├── cars/
│   │   ├── f1_car_livery_sprites/  # F1 car sprites
│   │   └── rally_car_livery_sprites/  # Rally car sprites
│   ├── obstacles/              # banana.png, rock.png, oil.png
│   └── sound/                  # audio assets
├── src/
│   ├── App.tsx                 # Router setup
│   ├── main.tsx                # React entrypoint
│   ├── index.css               # Global CSS, variables, all component styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── GameBackground.tsx  # stadium/track gradient variants
│   │   │   └── GameHeader.tsx      # shared header (not currently used in redesigned pages)
│   │   └── ui/
│   │       ├── CarSprite.tsx
│   │       ├── CountdownTimer.tsx
│   │       ├── CountryFlag.tsx
│   │       ├── Dropdown.tsx
│   │       ├── GlowText.tsx
│   │       ├── NeonButton.tsx
│   │       ├── NeonPanel.tsx
│   │       ├── Slider.tsx
│   │       └── ToggleSwitch.tsx
│   ├── data/
│   │   └── mockData.ts         # COUNTRIES, MOCK_PLAYERS, etc.
│   ├── hooks/
│   │   └── useGameStore.ts     # Zustand store
│   ├── lib/
│   │   └── utils.ts            # cn() utility
│   ├── pages/
│   │   ├── LobbyPage.tsx       # ✅ REDESIGNED
│   │   ├── RacePage.tsx        # ✅ REDESIGNED
│   │   ├── LeaderboardPage.tsx # TODO
│   │   └── SettingsPage.tsx    # Partially done
│   └── types/
│       └── index.ts            # All TypeScript interfaces
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── DESIGN.md                   # Visual design system
├── lobby_design.md             # LobbyPage spec
├── race.md                     # RacePage spec
├── CLAUDE.md                   # Project instructions
└── project_status.md           # This file
```

---

## Game Flow

```
┌─────────┐  START RACE   ┌─────────┐  FINISH    ┌──────────────┐
│ LobbyPage │ ──────────→  │ RacePage │ ────────→ │LeaderboardPage│
│ (select)  │              │ (race)   │            │  (results)   │
└─────────┘              └─────────┘            └──────────────┘
      ↑                                                  │
      └────────────── RESTART RACE ─────────────────────┘
```

1. **LobbyPage**: Select countries from banner/selector → fills team slots
2. **RacePage**: View race with cars, leader, vote for boosts
3. **LeaderboardPage**: See winner, podium, rankings
4. **Back to LobbyPage**: Reset and play again

---

## Potential Next Steps

### High Priority
1. **LeaderboardPage Redesign** - Winner with laurel SVGs, podium cards, confetti animation
2. **SettingsPage Polish** - Complete all 7 tabs with working controls
3. **Flag Asset Verification** - Confirm all 24 countries have PNG flags

### Medium Priority
4. **Full Game Flow** - Proper navigation and state reset between pages
5. **Responsive Testing** - Verify UI at 1920×1080, 1440×900, 1280×720
6. **Race Animation System** - Real car movement, obstacle hits, boost mechanics

### Lower Priority
7. **Sound Integration** - Audio controls and event sounds
8. **Obstacle Visuals** - Banana/rock/oil sprite animations
9. **Countdown Overlay** - 3-2-1-GO! before race
10. **Backend Integration** - Replace mock data with API

---

## Files Modified Recently

| File | Changes |
|------|---------|
| `src/pages/LobbyPage.tsx` | Complete rewrite, uses GameHeader, flag-fill cards, cleaned JSX comments |
| `src/pages/RacePage.tsx` | Complete rewrite with track, lanes, vote panel, bg-track, cleaned JSX comments |
| `src/index.css` | Lobby + race styles, stadium gradient, game-header, team-card-flag, banner fixes |
| `src/data/mockData.ts` | Added displayCode, lowercase codes |
| `src/hooks/useGameStore.ts` | Added removeCountry action |
| `src/types/index.ts` | Added displayCode to interfaces |
| `src/components/layout/GameHeader.tsx` | Restructured with fixed corner buttons |
| `src/components/ui/GameBackground.tsx` | Cleaned JSX comments |
| `src/components/ui/CountdownTimer.tsx` | Inline pill layout, cleaned JSX comments |
| `src/components/ui/CountryFlag.tsx` | Added xl, banner sizes, object-contain fix |
| `src/App.tsx` | Cleaned JSX comment leaks |
| `src/main.tsx` | Fixed visible comment text |
| `project_status.md` | This file, kept updated |