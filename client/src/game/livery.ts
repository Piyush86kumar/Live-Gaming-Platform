/**
 * Car livery rendering using a 6-pass compositing pipeline.
 *
 * Takes the base car sprite and a country flag image, then composites
 * them together to create a realistic paint-job effect:
 *
 *   Pass 1: Draw base car sprite
 *   Pass 2: source-atop — Paint the flag onto the car body
 *   Pass 3: multiply — Re-draw car sprite over flag (preserves shading)
 *   Pass 4: color-burn — Darken windows & outlines
 *   Pass 5: Vertical shading gradient for paint depth
 *   Pass 6: Horizontal shading for 3D body curvature
 */

import { SPRITE_SRC_X, SPRITE_SRC_Y, SPRITE_CAR_W, SPRITE_CAR_H } from './constants'

/**
 * Render a country-specific car livery by compositing the base car sprite
 * with a country flag image. Returns an offscreen canvas with the result.
 */
export function renderCountryCar(
  carSprite: HTMLImageElement,
  flagImg: HTMLImageElement,
): HTMLCanvasElement {
  const sx = SPRITE_SRC_X, sy = SPRITE_SRC_Y, sw = SPRITE_CAR_W, sh = SPRITE_CAR_H

  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh
  const ctx = canvas.getContext('2d')!

  // PASS 1: Draw the base car sprite
  ctx.drawImage(carSprite, sx, sy, sw, sh, 0, 0, sw, sh)

  // PASS 2: source-atop — Paint the flag onto the car body
  ctx.globalCompositeOperation = 'source-atop'
  ctx.drawImage(flagImg, 0, 0, sw, sh)

  // PASS 3: multiply — Re-draw car sprite over flag
  ctx.globalCompositeOperation = 'multiply'
  ctx.drawImage(carSprite, sx, sy, sw, sh, 0, 0, sw, sh)

  // PASS 4: color-burn — Darken windows & outlines
  ctx.globalCompositeOperation = 'color-burn'
  ctx.drawImage(carSprite, sx, sy, sw, sh, 0, 0, sw, sh)

  // PASS 5: Vertical shading gradient for paint depth
  ctx.globalCompositeOperation = 'source-atop'
  const shadingGrad = ctx.createLinearGradient(0, 0, 0, sh)
  shadingGrad.addColorStop(0, 'rgba(255,255,255,0.10)')
  shadingGrad.addColorStop(0.35, 'rgba(255,255,255,0.03)')
  shadingGrad.addColorStop(0.5, 'rgba(0,0,0,0)')
  shadingGrad.addColorStop(0.75, 'rgba(0,0,0,0.04)')
  shadingGrad.addColorStop(1, 'rgba(0,0,0,0.10)')
  ctx.fillStyle = shadingGrad
  ctx.fillRect(0, 0, sw, sh)

  // PASS 6: Horizontal shading for 3D body curvature
  const hGrad = ctx.createLinearGradient(0, 0, sw, 0)
  hGrad.addColorStop(0, 'rgba(0,0,0,0.05)')
  hGrad.addColorStop(0.1, 'rgba(0,0,0,0)')
  hGrad.addColorStop(0.5, 'rgba(255,255,255,0.03)')
  hGrad.addColorStop(0.9, 'rgba(0,0,0,0)')
  hGrad.addColorStop(1, 'rgba(0,0,0,0.05)')
  ctx.fillStyle = hGrad
  ctx.fillRect(0, 0, sw, sh)

  ctx.globalCompositeOperation = 'source-over'

  return canvas
}
