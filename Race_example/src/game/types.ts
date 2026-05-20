/**
 * Core type definitions for the Race of Nations game.
 *
 * These types are shared across all game modules — constants, rendering,
 * physics, and the main component.
 */

/** A country entry with its ISO code (for flagcdn.com) and display name */
export interface CountryEntry {
  code: string
  name: string
}

/** A single car competing in the race */
export interface Car {
  x: number
  lane: number
  speed: number
  maxSpeed: number
  acceleration: number
  country: CountryEntry
  finished: boolean
  finishTime: number
  nitro: number
  nitroActive: boolean
  bounceOffset: number
  /** Pre-rendered car canvas (sprite + flag composited via 6-pass pipeline) */
  renderedCar: HTMLCanvasElement | null
  /** Obstacle effect: spinning from banana peel */
  spinTimer: number
  spinAngle: number
  /** Obstacle effect: sliding on oil slick */
  slickTimer: number
  /** Obstacle effect: slowed by rock */
  slowTimer: number
}

/** The three obstacle types placed on the track */
export type ObstacleType = 'banana' | 'oil' | 'rock'

/** A single obstacle placed on the track */
export interface Obstacle {
  type: ObstacleType
  x: number
  lane: number
  laneY: number
  animFrame: number
  animTimer: number
  /** Set of lane indices that have already collided with this obstacle */
  hitBy: Set<number>
}

/** Loaded sprite sheet data for an obstacle type (4-frame horizontal sheet) */
export interface ObstacleSpriteData {
  img: HTMLImageElement | null
  frameWidth: number
  frameHeight: number
}

/** A single particle used for visual effects (nitro flames, obstacle impacts) */
export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

/** The overall game state machine states */
export type GameState = 'loading' | 'menu' | 'countdown' | 'racing' | 'finished'

/** The mutable game state object stored in a React ref */
export interface GameData {
  cars: Car[]
  playerLane: number
  keys: Set<string>
  gameState: GameState
  countdown: number
  countdownTimer: number
  startTime: number
  cameraX: number
  particles: Particle[]
  obstacles: Obstacle[]
}

/** Obstacle effect type for HUD display */
export type ObstacleEffect = 'none' | 'spin' | 'slick' | 'slow'

/** Session leaderboard entry persisted in localStorage */
export interface LeaderboardEntry {
  code: string
  name: string
  wins: number
}
