# Project Status

## What is this project?
`race_of_nations` is a browser-based frontend for a multiplayer-style racing game experience. It is built with React and TypeScript using Vite as the bundler, and it focuses on a neon-themed UI with screens for lobby management, racing, leaderboard display, and game settings.

## Current Status

### Overall: ✅ LobbyPage Redesigned
The LobbyPage has been completely redesigned to match the lobby_design.md specification. The app builds successfully with no TypeScript errors.

### Recent Changes

#### 1. LobbyPage Redesign (COMPLETED)
- **New responsive layout** using flexbox with `clamp()` for viewport-relative sizing
- **Custom header** with chunky rounded icon buttons (Home/Settings) and centered title
- **Flag-dominant team cards** where filled slots show large flag images
- **Infinite scroll banner** with continuous animation (no pause on hover)
- **Click-to-remove** on filled team cards removes the country
- **Viewportion-relative sizing** throughout (no fixed px for layout)

#### 2. Data Model Updates
- **Country interface** now includes `code` (lowercase ISO), `displayCode` (3-letter like "USA"), and `name`
- All `COUNTRIES` array updated to use lowercase codes matching asset filenames
- `MOCK_PLAYERS` updated with `displayCode` field

#### 3. Store Updates
- Added `removeCountry(teamNumber)` action to remove a country from a slot

#### 4. UI Component Fixes
- **NeonButton**: Green/danger button colors corrected to #22c55e and #c0213a
- **CountdownTimer**: Magenta color (#ff00aa) fixed
- **CountryFlag**: Added `xl` (72x48) and `banner` (24x16) size options

#### 5. SettingsPage Fixes
- Updated button variants (red→danger, green→primary, blue→secondary) for NeonButton compatibility

## Project goal
The goal is to deliver a polished, static frontend for a racing game UI that can be deployed to platforms like Vercel, Netlify, GitHub Pages, or Cloudflare Pages. The app should provide a complete user flow from lobby setup through race play and leaderboard review, with strong visual polish and responsive UI behavior.

## Folder structure and file responsibilities

### Root files
- `index.html` - HTML entrypoint for the Vite app.
- `package.json` - npm dependencies, scripts, and project metadata.
- `README.md` - existing project overview and setup instructions.
- `tsconfig.json` / `tsconfig.node.json` - TypeScript configuration for the app and build tooling.
- `vite.config.ts` - Vite build and dev server configuration.
- `project_status.md` - this file, describing current project state and structure.

### `public/`
Contains static assets used by the app.
- `countries.js` - likely mock or configuration data for supported countries.
- `flags/country_flag/` - contains country flag PNGs named by 2-letter ISO code (lowercase)
- `cars/rally_car_livery_sprites/` - contains car sprite assets for each country
- `obstacles/` - contains obstacle images (banana, rock, oil) for the race scene
- `sound/` - contains audio assets for the game

### `src/`
The source folder for app code.

#### `src/App.tsx`
Main application shell with React Router setup for all pages.

#### `src/main.tsx`
Vite React entrypoint that renders the app into the DOM.

#### `src/index.css`
Global CSS styles including:
- CSS variables for color palette (--color-bg-primary, --color-neon-cyan, etc.)
- Stadium gradient background (.bg-stadium)
- Team grid and card styles
- Infinite scroll banner animations
- All lobby-specific styles with viewport-relative units

#### `src/components/layout/`
Layout-level UI components used across pages.
- `GameBackground.tsx` - Renders the stadium gradient background (variant: 'stadium' | 'track')
- `GameHeader.tsx` - Top header with title, home/settings buttons

#### `src/components/ui/`
Reusable UI controls and visual components.
- `CarSprite.tsx` - Renders car sprite for race, positioned by progress %
- `CountdownTimer.tsx` - Countdown timer with magenta digits
- `CountryFlag.tsx` - Displays flag PNG for a country (sizes: sm, md, lg, xl, banner, full)
- `Dropdown.tsx` - Custom dropdown control
- `GlowText.tsx` - Neon-style glowing text component
- `NeonButton.tsx` - Neon-styled button (variants: primary/danger/secondary/ghost)
- `NeonPanel.tsx` - Glass-effect panel container with glow borders
- `Slider.tsx` - Custom slider control for settings
- `ToggleSwitch.tsx` - Toggle control switch

#### `src/data/`
- `mockData.ts` - All mock data including COUNTRIES array, MOCK_PLAYERS, MOCK_RACE_PARTICIPANTS, MOCK_LEADERBOARD, DEFAULT_SETTINGS

#### `src/hooks/`
- `useGameStore.ts` - Zustand store managing: players, countdown, raceInProgress, winner, settings, votes, selectedCountry, and actions like selectCountry, removeCountry, startRace, resetRace

#### `src/lib/`
- `utils.ts` - `cn()` utility for merging classNames

#### `src/pages/`
Route pages that represent the main app screens.
- `LeaderboardPage.tsx` - Shows winner display with laurel, top 5 podium, daily leaderboard sidebar, confetti
- `LobbyPage.tsx` - **RECENTLY REDESIGNED** - Country selection, team slots, countdown, infinite banner
- `RacePage.tsx` - Renders race track with lanes, car sprites, position progress, boost badges, vote panel
- `SettingsPage.tsx` - Tabbed settings (General, Audio, Display, Gameplay, Voting, Countries, Advanced)

#### `src/types/`
- `index.ts` - TypeScript interfaces: Country, Player, RaceParticipant, LeaderboardEntry, RaceResult, GameSettings

## Asset Conventions

### Flags
- Path: `/flags/country_flag/{countryCode}.png`
- Country codes are lowercase 2-letter ISO (e.g., `us.png`, `in.png`)
- Display codes are 3-letter (e.g., "USA", "IND")

### Cars
- Path: `/cars/rally_car_livery_sprites/{countryCode}.png`
- Country codes are lowercase

### State Flow
1. User selects country from banner/selector → `selectCountry()` in store
2. Country fills next empty team slot in `players` array
3. Click on filled team card → `removeCountry()` clears that slot
4. START RACE → navigates to `/race` with current players
5. RESET TIMER → resets countdown to 60

## Potential Next Steps

### High Priority
1. **RacePage Redesign** - Apply same viewport-relative scaling and visual polish to RacePage
2. **LeaderboardPage Redesign** - Implement winner display with laurel SVGs, podium cards, confetti animation
3. **SettingsPage Polish** - Ensure all 7 tabs are fully functional with proper controls

### Medium Priority
4. **Real PNG Flag Verification** - Ensure all flags in COUNTRIES array have corresponding PNG assets
5. **Full Game Flow** - Connect all pages properly: Lobby → Race → Leaderboard → back to Lobby
6. **Responsive Testing** - Verify UI scales correctly at 1920×1080, 1440×900, 1280×720

### Lower Priority
7. **Race Animation** - Implement smooth car movement with CSS transitions
8. **Vote System UI** - Create polished boost/vote panel in RacePage
9. **Sound Integration** - Wire up audio controls in Settings and game events
10. **Backend Integration** - Replace mock data with real API endpoints when available