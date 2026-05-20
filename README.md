# Race of Nations

A production-ready frontend UI for a browser-based multiplayer racing game.

## Features

- **Lobby Screen**: Country selection, team management, countdown timer
- **Race Screen**: Real-time race visualization, voting/boost system
- **Leaderboard**: Winner celebration, daily top winners ranking
- **Settings**: Comprehensive admin panel with audio, display, gameplay options

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS v4
- React Router DOM v7
- Zustand (state management)
- Lucide React (icons)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
  components/
    ui/          # Reusable UI components (NeonPanel, NeonButton, etc.)
    layout/      # Layout components (GameHeader, GameBackground)
  pages/         # Route pages (Lobby, Race, Leaderboard, Settings)
  hooks/         # Zustand store
  data/          # Mock data and constants
  types/         # TypeScript interfaces
  lib/           # Utilities (cn helper)
```

## Deployment

Static-site compatible. Deploy to:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## Design System

- **Colors**: Dark navy backgrounds, electric blue neon borders, gold highlights
- **Typography**: Rajdhani (headings), Inter (body)
- **Effects**: Neon glows, glass panels, gradient text
- **Responsive**: No scrollbars, 100vw × 100vh constraint
