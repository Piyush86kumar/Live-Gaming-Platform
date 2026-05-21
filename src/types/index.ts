/* ===== FILE OVERVIEW ===== */
/* Summary: Core TypeScript interfaces used across the entire application — no runtime code */

/* ===== DOMAIN MODELS ===== */

/* A country available for selection in the lobby */
export interface Country {
  code: string;         /* Lowercase ISO 3166-1 alpha-2 code (e.g. 'us', 'in') */
  displayCode: string;  /* Uppercase short code for UI (e.g. 'USA', 'IND') */
  name: string;         /* Full country name (e.g. 'United States') */
}

/* A player slot in the lobby / active team during race */
export interface Player {
  id: string;            /* Unique player identifier */
  countryCode: string;   /* Country code selected (empty string = unoccupied) */
  displayCode: string;   /* Uppercase code shown on slot (empty if unoccupied) */
  countryName: string;   /* Full name shown on slot (empty if unoccupied) */
  teamNumber: number;    /* 1-based team/player slot number (1-8) */
  isReady: boolean;      /* Whether this player has locked in their selection */
}

/* Participant in an active race (track state) */
export interface RaceParticipant {
  countryCode: string;  /* Lowercase country code */
  countryName: string;  /* Full country name */
  position: number;     /* Current race standing (1 = first) */
  boosts: number;       /* Number of boost power-ups accumulated */
  carColor: string;     /* Hex color for the car sprite tint */
  progress: number;     /* Progress percentage along the track (0-100) */
}

/* Entry in the all-time leaderboard */
export interface LeaderboardEntry {
  rank: number;         /* Leaderboard position (1 = top) */
  countryCode: string;  /* Country code (uppercase) */
  countryName: string;  /* Full country name */
  wins: number;         /* Total race wins count */
}

/* Final result from a completed race */
export interface RaceResult {
  position: number;     /* Final standing (1 = winner) */
  countryCode: string;  /* Country code (uppercase) */
  countryName: string;  /* Full country name */
}

/* ===== CONFIGURATION ===== */

/* All user-adjustable game settings with defaults */
export interface GameSettings {
  masterVolume: number;         /* Overall volume (0-100) */
  musicVolume: number;          /* Background music volume (0-100) */
  soundEffects: number;         /* SFX volume (0-100) */
  fullscreenMode: boolean;      /* Whether the game runs in fullscreen */
  showCountryFlags: boolean;    /* Toggle flag icons in UI */
  raceCountdownDuration: number;/* Lobby countdown timer in seconds */
  maxPlayers: number;           /* Maximum team slots available */
  defaultCountry: string;       /* Default selected country code */
  enableConfetti: boolean;      /* Toggle confetti animation on winner screen */
}

/* ===== ROUTING ===== */

/* All valid application route paths */
export type PageRoute = '/' | '/lobby' | '/race' | '/leaderboard' | '/settings';
