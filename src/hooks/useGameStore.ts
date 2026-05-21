/* ===== FILE OVERVIEW ===== */
/* Summary: Global state management via Zustand — single source of truth for all game state */

import { create } from 'zustand';                                                  /* Lightweight state management library */
import type { GameSettings, Player, RaceParticipant, LeaderboardEntry } from '@/types';
import { DEFAULT_SETTINGS, MOCK_PLAYERS, MOCK_RACE_PARTICIPANTS, MOCK_LEADERBOARD, MOCK_VOTES, COUNTRIES } from '@/data/mockData';

/* ===== STATE INTERFACE ===== */
interface GameState {
  /* ===== DATA ===== */
  currentPage: string;                    /* Active route path */
  settings: GameSettings;                 /* User-configurable game options */
  players: Player[];                      /* All player/team slots in the lobby */
  raceParticipants: RaceParticipant[];    /* Teams currently racing */
  leaderboard: LeaderboardEntry[];        /* All-time leaderboard rankings */
  votes: Record<string, number>;          /* Boost votes per country code */
  countdown: number;                      /* Lobby countdown seconds remaining */
  raceInProgress: boolean;                /* Whether a race is actively running */
  winner: string | null;                  /* Winning country code (null = no winner yet) */
  selectedCountry: string;                /* Currently selected country in lobby dropdown */

  /* ===== ACTIONS ===== */
  setPage: (page: string) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;  /* Merge partial settings */
  resetSettings: () => void;                                   /* Restore defaults */
  selectCountry: (countryCode: string, teamNumber: number) => void;  /* Assign country to slot */
  removeCountry: (teamNumber: number) => void;                 /* Clear a team slot */
  startRace: () => void;                                       /* Begin the race */
  resetRace: () => void;                                       /* Reset race back to lobby */
  voteForCountry: (countryCode: string) => void;               /* Cast a boost vote */
  setCountdown: (value: number) => void;                       /* Update countdown seconds */
  setWinner: (countryCode: string | null) => void;             /* Declare the race winner */
}

/* ===== STORE ===== */
export const useGameStore = create<GameState>((set) => ({
  /* ===== INITIAL STATE ===== */
  currentPage: '/lobby',
  settings: { ...DEFAULT_SETTINGS },             /* Spread to avoid mutation of original */
  players: [...MOCK_PLAYERS],                    /* Spread to maintain array independence */
  raceParticipants: [...MOCK_RACE_PARTICIPANTS],
  leaderboard: [...MOCK_LEADERBOARD],
  votes: { ...MOCK_VOTES },
  countdown: 60,
  raceInProgress: false,
  winner: null,
  selectedCountry: 'IN',

  /* ===== ACTIONS ===== */

  /* Navigate to a different page */
  setPage: (page) => set({ currentPage: page }),

  /* Merge provided settings into existing settings (partial update) */
  updateSettings: (newSettings) => 
    set((state) => ({ 
      settings: { ...state.settings, ...newSettings } 
    })),

  /* Revert all settings back to the original defaults */
  resetSettings: () => set({ settings: { ...DEFAULT_SETTINGS } }),

  /* Assign a country to a specific team slot and set it ready */
  selectCountry: (countryCode, teamNumber) =>
    set((state) => {
      const country = COUNTRIES.find(c => c.code === countryCode);  /* Look up full country info */
      return {
        players: state.players.map((p) =>
          p.teamNumber === teamNumber                               /* Match the target slot */
            ? { ...p, countryCode, displayCode: country?.displayCode || countryCode.toUpperCase(), countryName: country?.name || countryCode, isReady: true }
            : p
        ),
        selectedCountry: countryCode,                               /* Update dropdown selection */
      };
    }),

  /* Clear a team slot (set country to empty, mark not ready) */
  removeCountry: (teamNumber) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.teamNumber === teamNumber
          ? { ...p, countryCode: '', displayCode: '', countryName: '', isReady: false }
          : p
      ),
    })),

  /* Start the race: mark in-progress and zero out countdown */
  startRace: () => set({ raceInProgress: true, countdown: 0 }),

  /* Reset race state back to pre-race setup */
  resetRace: () => set({ 
    raceInProgress: false, 
    countdown: 60,
    winner: null,
    raceParticipants: [...MOCK_RACE_PARTICIPANTS]  /* Restore original participant order */
  }),

  /* Increment the vote counter for a given country */
  voteForCountry: (countryCode) =>
    set((state) => ({
      votes: {
        ...state.votes,
        [countryCode]: (state.votes[countryCode] || 0) + 1,  /* Default 0 if first vote */
      },
    })),

  /* Set the countdown timer value */
  setCountdown: (value) => set({ countdown: value }),

  /* Declare a winner (stops the race in progress) */
  setWinner: (countryCode) => set({ winner: countryCode, raceInProgress: false }),
}));
