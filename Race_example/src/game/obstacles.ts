/**
 * Obstacle generation and collision logic.
 *
 * Obstacles are distributed evenly across all lanes (2 per lane = 16 total).
 * Types are randomized. Collision detection applies different effects
 * based on obstacle type: spin (banana), slide (oil), slow (rock).
 */

import type { Obstacle, ObstacleType, Car, Particle } from './types'
import {
  LANE_COUNT, LANE_HEIGHT, TRACK_TOP,
  START_X, FINISH_X, OBSTACLE_HIT_RADIUS,
  OBSTACLE_ANIM_FRAMES,
} from './constants'

/**
 * Generate a fresh set of obstacles for a new race.
 * Each lane gets exactly 2 obstacles spread across the track distance.
 * Obstacle types are randomized within each lane.
 */
export function generateObstacles(): Obstacle[] {
  const obstacles: Obstacle[] = []
  const types: ObstacleType[] = ['banana', 'oil', 'rock']
  const minX = START_X + 400
  const maxX = FINISH_X - 300
  const range = maxX - minX

  for (let lane = 0; lane < LANE_COUNT; lane++) {
    const perLane = 2
    for (let j = 0; j < perLane; j++) {
      const segmentStart = minX + (j / perLane) * range
      const segmentEnd = minX + ((j + 1) / perLane) * range
      const x = segmentStart + Math.random() * (segmentEnd - segmentStart)
      const laneY = TRACK_TOP + lane * LANE_HEIGHT + LANE_HEIGHT / 2

      obstacles.push({
        type: types[Math.floor(Math.random() * types.length)],
        x,
        lane,
        laneY,
        animFrame: Math.floor(Math.random() * OBSTACLE_ANIM_FRAMES),
        animTimer: 0,
        hitBy: new Set(),
      })
    }
  }

  return obstacles
}

/**
 * Check and resolve obstacle collisions for all cars.
 * Applies the appropriate effect (spin/slide/slow) and spawns impact particles.
 */
export function processObstacleCollisions(
  obstacles: Obstacle[],
  cars: Car[],
  particles: Particle[],
): void {
  for (const obs of obstacles) {
    for (const car of cars) {
      if (obs.hitBy.has(car.lane)) continue
      if (car.lane !== obs.lane) continue

      const dx = car.x - obs.x
      if (Math.abs(dx) < OBSTACLE_HIT_RADIUS) {
        obs.hitBy.add(car.lane)

        switch (obs.type) {
          case 'banana':
            car.spinTimer = 45   // ~0.75 seconds
            car.speed *= 0.3     // Lose most speed
            break
          case 'oil':
            car.slickTimer = 60  // ~1 second
            car.speed *= 0.6     // Lose some speed
            break
          case 'rock':
            car.slowTimer = 80   // ~1.3 seconds
            car.speed *= 0.15    // Almost stop
            break
        }

        // Spawn impact particles
        const laneY = TRACK_TOP + car.lane * LANE_HEIGHT + LANE_HEIGHT / 2
        for (let p = 0; p < 8; p++) {
          const angle = Math.random() * Math.PI * 2
          const spd = 1 + Math.random() * 3
          particles.push({
            x: obs.x,
            y: laneY,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            life: 15 + Math.random() * 10,
            maxLife: 25,
            color: obs.type === 'banana' ? '#FFE135' : obs.type === 'oil' ? '#1a1a2e' : '#888888',
            size: 2 + Math.random() * 3,
          })
        }
      }
    }
  }
}
