export interface Country {
  code: string;
  displayCode: string;
  name: string;
}

export interface Player {
  id: string;
  countryCode: string;
  displayCode: string;
  countryName: string;
  teamNumber: number;
  isReady: boolean;
}

export interface RaceParticipant {
  countryCode: string;
  countryName: string;
  position: number;
  boosts: number;
  carColor: string;
  progress: number;
}

export interface LeaderboardEntry {
  rank: number;
  countryCode: string;
  countryName: string;
  wins: number;
}

export interface RaceResult {
  position: number;
  countryCode: string;
  countryName: string;
}

export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  soundEffects: number;
  fullscreenMode: boolean;
  showCountryFlags: boolean;
  raceCountdownDuration: number;
  maxPlayers: number;
  defaultCountry: string;
  enableConfetti: boolean;
}

export type PageRoute = '/' | '/lobby' | '/race' | '/leaderboard' | '/settings';
