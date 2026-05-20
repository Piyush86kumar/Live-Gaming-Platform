import { create } from 'zustand';
import type { GameSettings, Player, RaceParticipant, LeaderboardEntry } from '@/types';
import { DEFAULT_SETTINGS, MOCK_PLAYERS, MOCK_RACE_PARTICIPANTS, MOCK_LEADERBOARD, MOCK_VOTES, COUNTRIES } from '@/data/mockData';

interface GameState {
  currentPage: string;
  settings: GameSettings;
  players: Player[];
  raceParticipants: RaceParticipant[];
  leaderboard: LeaderboardEntry[];
  votes: Record<string, number>;
  countdown: number;
  raceInProgress: boolean;
  winner: string | null;
  selectedCountry: string;

  // Actions
  setPage: (page: string) => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  resetSettings: () => void;
  selectCountry: (countryCode: string, teamNumber: number) => void;
  removeCountry: (teamNumber: number) => void;
  startRace: () => void;
  resetRace: () => void;
  voteForCountry: (countryCode: string) => void;
  setCountdown: (value: number) => void;
  setWinner: (countryCode: string | null) => void;
}

export const useGameStore = create<GameState>((set) => ({
  currentPage: '/lobby',
  settings: { ...DEFAULT_SETTINGS },
  players: [...MOCK_PLAYERS],
  raceParticipants: [...MOCK_RACE_PARTICIPANTS],
  leaderboard: [...MOCK_LEADERBOARD],
  votes: { ...MOCK_VOTES },
  countdown: 60,
  raceInProgress: false,
  winner: null,
  selectedCountry: 'IN',

  setPage: (page) => set({ currentPage: page }),

  updateSettings: (newSettings) => 
    set((state) => ({ 
      settings: { ...state.settings, ...newSettings } 
    })),

  resetSettings: () => set({ settings: { ...DEFAULT_SETTINGS } }),

  selectCountry: (countryCode, teamNumber) =>
    set((state) => {
      const country = COUNTRIES.find(c => c.code === countryCode);
      return {
        players: state.players.map((p) =>
          p.teamNumber === teamNumber
            ? { ...p, countryCode, displayCode: country?.displayCode || countryCode.toUpperCase(), countryName: country?.name || countryCode, isReady: true }
            : p
        ),
        selectedCountry: countryCode,
      };
    }),

  removeCountry: (teamNumber) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.teamNumber === teamNumber
          ? { ...p, countryCode: '', displayCode: '', countryName: '', isReady: false }
          : p
      ),
    })),

  startRace: () => set({ raceInProgress: true, countdown: 0 }),

  resetRace: () => set({ 
    raceInProgress: false, 
    countdown: 60,
    winner: null,
    raceParticipants: [...MOCK_RACE_PARTICIPANTS]
  }),

  voteForCountry: (countryCode) =>
    set((state) => ({
      votes: {
        ...state.votes,
        [countryCode]: (state.votes[countryCode] || 0) + 1,
      },
    })),

  setCountdown: (value) => set({ countdown: value }),

  setWinner: (countryCode) => set({ winner: countryCode, raceInProgress: false }),
}));
