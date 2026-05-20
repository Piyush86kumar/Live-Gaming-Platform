/**
 * Session leaderboard persistence using localStorage.
 *
 * Tracks daily wins per country. Data is scoped to the current date
 * so each day starts fresh. Only the country that wins a race
 * gets a +1 to their win count.
 */

import type { Car, LeaderboardEntry } from './types'
import { COUNTRIES } from './constants'

/** Get the localStorage key for today's leaderboard */
function getSessionKey(): string {
  return `race-leaderboard-${new Date().toISOString().slice(0, 10)}`
}

/** Load today's leaderboard from localStorage, or initialize with all countries at 0 wins */
export function loadSessionLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(getSessionKey())
    if (raw) return JSON.parse(raw)
  } catch { /* ignore corrupt data */ }
  return COUNTRIES.map(c => ({ code: c.code, name: c.name, wins: 0 }))
}

/** Persist the leaderboard to localStorage */
export function saveSessionLeaderboard(lb: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(getSessionKey(), JSON.stringify(lb))
  } catch { /* ignore storage quota errors */ }
}

/**
 * Record a race result: increment the winner's win count.
 * Returns the updated leaderboard array.
 */
export function recordRaceResult(standings: Car[]): LeaderboardEntry[] {
  const lb = loadSessionLeaderboard()
  const winner = standings[0]
  if (winner) {
    const entry = lb.find(e => e.code === winner.country.code)
    if (entry) {
      entry.wins += 1
    }
  }
  saveSessionLeaderboard(lb)
  return lb
}

/**
 * Reset today's leaderboard: clears all win counts back to 0.
 * Returns the fresh leaderboard array.
 */
export function resetSessionLeaderboard(): LeaderboardEntry[] {
  const fresh = COUNTRIES.map(c => ({ code: c.code, name: c.name, wins: 0 }))
  saveSessionLeaderboard(fresh)
  return fresh
}
