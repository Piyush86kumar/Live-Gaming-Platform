/* ===== FILE OVERVIEW ===== */
/* Summary: All mock/sample data for the application — used until a live backend is connected */

import type { Country, GameSettings, Player, RaceParticipant, LeaderboardEntry, RaceResult } from '@/types';

/* ===== AVAILABLE COUNTRIES ===== */
export const COUNTRIES: Country[] = [
  { code: 'us', displayCode: 'USA', name: 'United States' },
  { code: 'in', displayCode: 'IND', name: 'India' },
  { code: 'cn', displayCode: 'CHN', name: 'China' },
  { code: 'gb', displayCode: 'GBR', name: 'United Kingdom' },
  { code: 'jp', displayCode: 'JPN', name: 'Japan' },
  { code: 'de', displayCode: 'GER', name: 'Germany' },
  { code: 'fr', displayCode: 'FRA', name: 'France' },
  { code: 'ca', displayCode: 'CAN', name: 'Canada' },
  { code: 'au', displayCode: 'AUS', name: 'Australia' },
  { code: 'br', displayCode: 'BRA', name: 'Brazil' },
  { code: 'ar', displayCode: 'ARG', name: 'Argentina' },
  { code: 'es', displayCode: 'ESP', name: 'Spain' },
  { code: 'mx', displayCode: 'MEX', name: 'Mexico' },
  { code: 'tr', displayCode: 'TUR', name: 'Turkey' },
  { code: 'pl', displayCode: 'POL', name: 'Poland' },
  { code: 'nl', displayCode: 'NED', name: 'Netherlands' },
  { code: 'vn', displayCode: 'VNM', name: 'Vietnam' },
  { code: 'th', displayCode: 'THA', name: 'Thailand' },
  { code: 'id', displayCode: 'INA', name: 'Indonesia' },
  { code: 'il', displayCode: 'ISR', name: 'Israel' },
  { code: 'no', displayCode: 'NOR', name: 'Norway' },
  { code: 'it', displayCode: 'ITA', name: 'Italy' },
  { code: 'ph', displayCode: 'PHL', name: 'Philippines' },
  { code: 'cl', displayCode: 'CHI', name: 'Chile' },
];

/* ===== LOBBY PLAYERS ===== */
/* 8 player slots; first 2 are pre-filled as demo, rest are empty */
export const MOCK_PLAYERS: Player[] = [
  { id: '1', countryCode: 'us', displayCode: 'USA', countryName: 'United States', teamNumber: 1, isReady: true },
  { id: '2', countryCode: 'in', displayCode: 'IND', countryName: 'India', teamNumber: 2, isReady: true },
  { id: '3', countryCode: '', displayCode: '', countryName: '', teamNumber: 3, isReady: false },
  { id: '4', countryCode: '', displayCode: '', countryName: '', teamNumber: 4, isReady: false },
  { id: '5', countryCode: '', displayCode: '', countryName: '', teamNumber: 5, isReady: false },
  { id: '6', countryCode: '', displayCode: '', countryName: '', teamNumber: 6, isReady: false },
  { id: '7', countryCode: '', displayCode: '', countryName: '', teamNumber: 7, isReady: false },
  { id: '8', countryCode: '', displayCode: '', countryName: '', teamNumber: 8, isReady: false },
];

/* ===== RACE PARTICIPANTS ===== */
/* Pre-set 8 teams running a mock race with positions, boosts, and progress % */
export const MOCK_RACE_PARTICIPANTS: RaceParticipant[] = [
  { countryCode: 'ca', countryName: 'Canada', position: 1, boosts: 1, carColor: '#ff0000', progress: 78 },
  { countryCode: 'es', countryName: 'Spain', position: 2, boosts: 1, carColor: '#ffcc00', progress: 65 },
  { countryCode: 'mx', countryName: 'Mexico', position: 3, boosts: 1, carColor: '#00aa00', progress: 58 },
  { countryCode: 'ar', countryName: 'Argentina', position: 4, boosts: 1, carColor: '#87ceeb', progress: 52 },
  { countryCode: 'tr', countryName: 'Turkey', position: 5, boosts: 1, carColor: '#cc0000', progress: 48 },
  { countryCode: 'pl', countryName: 'Poland', position: 6, boosts: 1, carColor: '#ffffff', progress: 42 },
  { countryCode: 'nl', countryName: 'Netherlands', position: 7, boosts: 1, carColor: '#0044cc', progress: 38 },
  { countryCode: 'au', countryName: 'Australia', position: 8, boosts: 1, carColor: '#0000cc', progress: 30 },
];

/* ===== VOTES ===== */
/* Mock boost-vote counts keyed by uppercase country code */
export const MOCK_VOTES: Record<string, number> = {
  AR: 1, TR: 1, PL: 1, NL: 1, AU: 2, CA: 1, ES: 1, MX: 1,
};

/* ===== LEADERBOARD ===== */
/* Top 10 all-time leaderboard entries */
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, countryCode: 'IN', countryName: 'India', wins: 10 },
  { rank: 2, countryCode: 'NL', countryName: 'Netherlands', wins: 10 },
  { rank: 3, countryCode: 'CL', countryName: 'Chile', wins: 9 },
  { rank: 4, countryCode: 'ID', countryName: 'Indonesia', wins: 8 },
  { rank: 5, countryCode: 'TR', countryName: 'Turkey', wins: 8 },
  { rank: 6, countryCode: 'IL', countryName: 'Israel', wins: 8 },
  { rank: 7, countryCode: 'NO', countryName: 'Norway', wins: 8 },
  { rank: 8, countryCode: 'IT', countryName: 'Italy', wins: 8 },
  { rank: 9, countryCode: 'CN', countryName: 'China', wins: 8 },
  { rank: 10, countryCode: 'PH', countryName: 'Philippines', wins: 7 },
];

/* ===== RACE RESULTS ===== */
/* Final standings from a completed race */
export const MOCK_RACE_RESULTS: RaceResult[] = [
  { position: 1, countryCode: 'AR', countryName: 'Argentina' },
  { position: 2, countryCode: 'VN', countryName: 'Vietnam' },
  { position: 3, countryCode: 'AU', countryName: 'Australia' },
  { position: 4, countryCode: 'TH', countryName: 'Thailand' },
  { position: 5, countryCode: 'NL', countryName: 'Netherlands' },
];

/* ===== DEFAULT SETTINGS ===== */
/* Baseline game configuration applied on first load / reset */
export const DEFAULT_SETTINGS: GameSettings = {
  masterVolume: 80,
  musicVolume: 65,
  soundEffects: 90,
  fullscreenMode: true,
  showCountryFlags: true,
  raceCountdownDuration: 60,
  maxPlayers: 8,
  defaultCountry: 'IN',
  enableConfetti: true,
};

/* ===== SETTINGS OPTIONS ===== */
/* Dropdown option arrays used in the Settings page */
export const COUNTDOWN_OPTIONS = [15, 30, 45, 60, 90, 120];  /* Available countdown durations */
export const MAX_PLAYERS_OPTIONS = [4, 6, 8, 10, 12];         /* Available max player limits */
