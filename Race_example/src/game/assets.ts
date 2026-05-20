/**
 * Asset loading utilities for the Race of Nations game.
 *
 * Loads the car sprite sheet, obstacle sprite sheets (4-frame horizontal),
 * and country flag images from flagcdn.com. Includes a fallback for
 * failed flag loads that renders the country code on a gray rectangle.
 */

import type { ObstacleSpriteData, ObstacleType } from './types'
import { OBSTACLE_ANIM_FRAMES } from './constants'

/**
 * Load the base car sprite sheet from /public/car-sprite.png.
 * This is the white/grey car template that gets composited with country flags.
 */
export async function loadCarSprite(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = '/car-sprite.png'
  })
}

/**
 * Load a single obstacle sprite sheet (4-frame horizontal).
 * Path should be like '/obstacle-banana.png'.
 */
export async function loadObstacleSprite(path: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = path
  })
}

/**
 * Load all three obstacle sprite sheets in parallel and compute frame dimensions.
 * Returns a Record keyed by obstacle type with sprite data.
 */
export async function loadAllObstacleSprites(): Promise<Record<ObstacleType, ObstacleSpriteData>> {
  const paths: Record<ObstacleType, string> = {
    banana: '/obstacle-banana.png',
    oil: '/obstacle-oil.png',
    rock: '/obstacle-rock.png',
  }

  const [bananaSprite, oilSprite, rockSprite] = await Promise.all([
    loadObstacleSprite(paths.banana).catch(() => null),
    loadObstacleSprite(paths.oil).catch(() => null),
    loadObstacleSprite(paths.rock).catch(() => null),
  ])

  const toData = (img: HTMLImageElement | null): ObstacleSpriteData => ({
    img,
    frameWidth: img ? img.naturalWidth / OBSTACLE_ANIM_FRAMES : 0,
    frameHeight: img ? img.naturalHeight : 0,
  })

  return {
    banana: toData(bananaSprite),
    oil: toData(oilSprite),
    rock: toData(rockSprite),
  }
}

/**
 * Load a country flag image from flagcdn.com.
 * Falls back to a gray rectangle with the country code if the load fails.
 */
export async function loadFlagImage(countryCode: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => {
      // Fallback: gray rectangle with country code
      const canvas = document.createElement('canvas')
      canvas.width = 160
      canvas.height = 107
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#888888'
      ctx.fillRect(0, 0, 160, 107)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 28px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(countryCode.toUpperCase(), 80, 53)
      const fallbackImg = new Image()
      fallbackImg.onload = () => resolve(fallbackImg)
      fallbackImg.src = canvas.toDataURL()
    }
    img.src = `https://flagcdn.com/w160/${countryCode}.png`
  })
}
