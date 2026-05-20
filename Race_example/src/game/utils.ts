/**
 * Canvas drawing helpers for the game renderer.
 */

/** Draw a rounded rectangle path (does not fill or stroke — caller must do that) */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/** Format elapsed seconds as M:SS.CC */
export function formatTime(t: number): string {
  const mins = Math.floor(t / 60)
  const secs = Math.floor(t % 60)
  const ms = Math.floor((t % 1) * 100)
  return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
}
