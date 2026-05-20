/**
 * Game constants for the Race of Nations.
 *
 * All tunable numbers live here so they're easy to find and adjust.
 * Grouped by subsystem: canvas/track, car display, race distance,
 * obstacles, and sprite sheet geometry.
 */

// ─── Canvas & Track ────────────────────────────────────────────────
export const CANVAS_W = 1200
export const CANVAS_H = 800
export const LANE_COUNT = 8
export const LANE_HEIGHT = 70
export const TRACK_TOP = (CANVAS_H - LANE_COUNT * LANE_HEIGHT) / 2

// ─── Car Display ───────────────────────────────────────────────────
export const CAR_DISPLAY_W = 64
export const CAR_DISPLAY_H = 40

// ─── Race Distance ─────────────────────────────────────────────────
export const RACE_DISTANCE = 6000
export const START_X = 120
export const FINISH_X = START_X + RACE_DISTANCE
/** How far past the finish line cars coast before stopping */
export const FINISH_STOP_OFFSET = 80

// ─── Obstacles ─────────────────────────────────────────────────────
export const OBSTACLE_HIT_RADIUS = 22
export const OBSTACLE_DISPLAY_W = 36
export const OBSTACLE_DISPLAY_H = 36
export const OBSTACLE_ANIM_FRAMES = 4
/** Frames between animation advances (~0.2s at 60fps) */
export const OBSTACLE_ANIM_SPEED = 12

// ─── Car Sprite Geometry ──────────────────────────────────────────
// Content area within the 612×408 source sprite sheet
export const SPRITE_CAR_W = 550
export const SPRITE_CAR_H = 252
export const SPRITE_SRC_X = 34
export const SPRITE_SRC_Y = 86

// ─── Player Stats ──────────────────────────────────────────────────
export const PLAYER_MAX_SPEED = 5.5
export const PLAYER_NITRO_MAX_SPEED = 8
export const PLAYER_ACCELERATION = 0.08

// ─── AI Range ──────────────────────────────────────────────────────
export const AI_MAX_SPEED_MIN = 3.2
export const AI_MAX_SPEED_RANGE = 2.0
export const AI_ACCEL_MIN = 0.05
export const AI_ACCEL_RANGE = 0.035

// ─── Countries ─────────────────────────────────────────────────────
import type { CountryEntry } from './types'

export const COUNTRIES: CountryEntry[] = [
  { code: 'us', name: 'USA' },
  { code: 'gb', name: 'UK' },
  { code: 'jp', name: 'Japan' },
  { code: 'it', name: 'Italy' },
  { code: 'fr', name: 'France' },
  { code: 'de', name: 'Germany' },
  { code: 'br', name: 'Brazil' },
  { code: 'ca', name: 'Canada' },
]
