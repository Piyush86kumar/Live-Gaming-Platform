'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type {
  Car, GameState, GameData, ObstacleEffect, ObstacleSpriteData, LeaderboardEntry,
} from '@/game/types'
import {
  CANVAS_W, CANVAS_H, LANE_COUNT, LANE_HEIGHT, TRACK_TOP,
  CAR_DISPLAY_W, CAR_DISPLAY_H, RACE_DISTANCE, START_X, FINISH_X,
  FINISH_STOP_OFFSET, OBSTACLE_ANIM_SPEED, OBSTACLE_ANIM_FRAMES,
  OBSTACLE_DISPLAY_W, OBSTACLE_DISPLAY_H, SPRITE_CAR_W, SPRITE_CAR_H,
  PLAYER_MAX_SPEED, PLAYER_NITRO_MAX_SPEED, PLAYER_ACCELERATION,
  AI_MAX_SPEED_MIN, AI_MAX_SPEED_RANGE, AI_ACCEL_MIN, AI_ACCEL_RANGE,
  COUNTRIES,
} from '@/game/constants'
import { loadCarSprite, loadAllObstacleSprites, loadFlagImage } from '@/game/assets'
import { renderCountryCar } from '@/game/livery'
import { generateObstacles, processObstacleCollisions } from '@/game/obstacles'
import { loadSessionLeaderboard, recordRaceResult, resetSessionLeaderboard } from '@/game/leaderboard'
import { roundRect, formatTime } from '@/game/utils'

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function RacingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const obstacleSpritesRef = useRef<Record<string, ObstacleSpriteData>>({
    banana: { img: null, frameWidth: 0, frameHeight: 0 },
    oil: { img: null, frameWidth: 0, frameHeight: 0 },
    rock: { img: null, frameWidth: 0, frameHeight: 0 },
  })

  const gameRef = useRef<GameData | null>(null)

  // ─── React state (drives UI overlays) ─────────────────────────
  const [gameState, setGameState] = useState<GameState>('loading')
  const [assetsReady, setAssetsReady] = useState(false)
  const [playerSpeed, setPlayerSpeed] = useState(0)
  const [playerRank, setPlayerRank] = useState(1)
  const [raceTime, setRaceTime] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [playerNitro, setPlayerNitro] = useState(100)
  const [finalStandings, setFinalStandings] = useState<Car[]>([])
  const [playerLane] = useState(0)
  const [obstacleEffect, setObstacleEffect] = useState<ObstacleEffect>('none')
  const [sessionLeaderboard, setSessionLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const initDoneRef = useRef(false)

  // ─── Asset loading ─────────────────────────────────────────────
  const initGame = useCallback(async () => {
    try {
      const carSprite = await loadCarSprite()
      obstacleSpritesRef.current = await loadAllObstacleSprites()

      // Load all country flags and pre-render cars with flag liveries
      const cars: Car[] = []
      for (let i = 0; i < COUNTRIES.length; i++) {
        const country = COUNTRIES[i]
        let flagImg: HTMLImageElement
        try {
          flagImg = await loadFlagImage(country.code)
        } catch {
          flagImg = new Image()
          flagImg.src = ''
        }
        const renderedCar = renderCountryCar(carSprite, flagImg)

        cars.push({
          x: START_X,
          lane: i,
          speed: 0,
          maxSpeed: i === playerLane ? PLAYER_MAX_SPEED : AI_MAX_SPEED_MIN + Math.random() * AI_MAX_SPEED_RANGE,
          acceleration: i === playerLane ? PLAYER_ACCELERATION : AI_ACCEL_MIN + Math.random() * AI_ACCEL_RANGE,
          country,
          finished: false,
          finishTime: 0,
          nitro: 100,
          nitroActive: false,
          bounceOffset: 0,
          renderedCar,
          spinTimer: 0,
          spinAngle: 0,
          slickTimer: 0,
          slowTimer: 0,
        })
      }

      gameRef.current = {
        cars,
        playerLane,
        keys: new Set(),
        gameState: 'menu',
        countdown: 3,
        countdownTimer: 0,
        startTime: 0,
        cameraX: 0,
        particles: [],
        obstacles: generateObstacles(),
      }
      console.log('[initGame] All assets ready, setting assetsReady=true')
      setAssetsReady(true)
    } catch (err) {
      console.error('[initGame] Asset loading failed:', err)
      setLoadError(err instanceof Error ? err.message : String(err))
    }
  }, [playerLane])

  useEffect(() => {
    if (initDoneRef.current) return
    initDoneRef.current = true
    const timer = setTimeout(() => { initGame() }, 0)
    return () => clearTimeout(timer)
  }, [initGame])

  // Transition from loading to menu when assets are ready
  useEffect(() => {
    if (assetsReady) {
      const timer = setTimeout(() => { setGameState('menu') }, 0)
      return () => clearTimeout(timer)
    }
  }, [assetsReady])

  // ─── Keyboard handling ─────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()
      gameRef.current?.keys.add(e.key.toLowerCase())
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      gameRef.current?.keys.delete(e.key.toLowerCase())
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // ─── Game loop ─────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    let animId: number
    let lastTime = 0

    const gameLoop = (timestamp: number) => {
      const g = gameRef.current
      if (!g || g.gameState === 'loading') {
        animId = requestAnimationFrame(gameLoop)
        return
      }

      const dt = Math.min((timestamp - lastTime) / 16.667, 2)
      lastTime = timestamp

      // ═══ UPDATE ═══
      if (g.gameState === 'countdown') {
        g.countdownTimer += dt
        if (g.countdownTimer >= 60) {
          g.countdown--
          g.countdownTimer = 0
          if (g.countdown <= 0) {
            g.gameState = 'racing'
            g.startTime = timestamp
            setGameState('racing')
          }
        }
        setCountdown(g.countdown)
      }

      if (g.gameState === 'racing') {
        const elapsed = (timestamp - g.startTime) / 1000
        setRaceTime(elapsed)

        const player = g.cars[g.playerLane]
        const keys = g.keys

        // ── Update all cars (player + AI) ──
        for (let i = 0; i < g.cars.length; i++) {
          const car = g.cars[i]
          const isPlayer = i === g.playerLane

          // Decrement obstacle effect timers
          if (car.spinTimer > 0) car.spinTimer -= dt
          if (car.slickTimer > 0) car.slickTimer -= dt
          if (car.slowTimer > 0) car.slowTimer -= dt
          car.spinAngle += (car.spinTimer > 0 ? 0.35 : 0) * dt

          // ── Finished cars: coast to a stop ──
          if (car.finished) {
            if (car.speed > 0) {
              car.speed = Math.max(0, car.speed - 0.12 * dt)
              car.x += car.speed * dt
            }
            car.bounceOffset = Math.sin(timestamp * 0.012 + i * 30) * Math.min(car.speed * 0.25, 1.2)
            if (car.x > FINISH_X + FINISH_STOP_OFFSET) {
              car.x = FINISH_X + FINISH_STOP_OFFSET
              car.speed = 0
            }
            continue
          }

          // ── Player input ──
          if (isPlayer) {
            // Nitro
            if (keys.has('shift') && player.nitro > 0 && player.spinTimer <= 0) {
              player.nitroActive = true
              player.nitro = Math.max(0, player.nitro - 0.4 * dt)
              player.maxSpeed = PLAYER_NITRO_MAX_SPEED
            } else {
              player.nitroActive = false
              player.maxSpeed = PLAYER_MAX_SPEED
              player.nitro = Math.min(100, player.nitro + 0.08 * dt)
            }

            // Acceleration (blocked while spinning)
            if (player.spinTimer > 0) {
              player.speed = Math.max(0, player.speed - 0.1 * dt)
            } else if (keys.has('arrowup') || keys.has('w')) {
              const speedCap = player.slowTimer > 0 ? player.maxSpeed * 0.4 : player.maxSpeed
              player.speed = Math.min(speedCap, player.speed + player.acceleration * dt)
            } else if (keys.has('arrowdown') || keys.has('s')) {
              player.speed = Math.max(0, player.speed - player.acceleration * 1.5 * dt)
            } else {
              player.speed = Math.max(0, player.speed - 0.02 * dt)
            }

            // Oil slick: random speed wobble
            if (player.slickTimer > 0) {
              player.speed = Math.max(0, player.speed + (Math.random() - 0.5) * 0.3 * dt)
            }

            player.x += player.speed * dt
            player.bounceOffset = Math.sin(timestamp * 0.015) * Math.min(player.speed * 0.3, 1.5)
          } else {
            // ── AI car ──
            let aiMaxSpeed = car.maxSpeed
            if (car.spinTimer > 0) {
              aiMaxSpeed = 0
              car.speed = Math.max(0, car.speed - 0.15 * dt)
            } else if (car.slowTimer > 0) {
              aiMaxSpeed = car.maxSpeed * 0.35
            } else if (car.slickTimer > 0) {
              aiMaxSpeed = car.maxSpeed * 0.6
            }

            const variation = Math.sin(timestamp * 0.002 + i * 50) * 0.3
            const targetSpeed = aiMaxSpeed + variation
            if (car.speed < targetSpeed) {
              car.speed = Math.min(targetSpeed, car.speed + car.acceleration * dt)
            } else {
              car.speed = Math.max(targetSpeed, car.speed - car.acceleration * 0.5 * dt)
            }
            car.x += car.speed * dt
            car.bounceOffset = Math.sin(timestamp * 0.012 + i * 30) * Math.min(car.speed * 0.25, 1.2)
          }

          // ── Finish line check ──
          if (car.x >= FINISH_X && !car.finished) {
            car.finished = true
            car.finishTime = elapsed
            car.nitroActive = false
          }
        }

        // ── Obstacle collision detection ──
        processObstacleCollisions(g.obstacles, g.cars, g.particles)

        // ── Nitro exhaust particles ──
        if (player.nitroActive && player.nitro > 0) {
          const laneY = TRACK_TOP + player.lane * LANE_HEIGHT + LANE_HEIGHT / 2
          for (let i = 0; i < 2; i++) {
            g.particles.push({
              x: player.x - CAR_DISPLAY_W / 2,
              y: laneY + (Math.random() - 0.5) * 10,
              vx: -(2 + Math.random() * 3),
              vy: (Math.random() - 0.5) * 2,
              life: 15 + Math.random() * 10,
              maxLife: 25,
              color: Math.random() > 0.5 ? '#FF6600' : '#FFAA00',
              size: 3 + Math.random() * 3,
            })
          }
        }

        // ── Update & cull particles ──
        g.particles = g.particles.filter(p => {
          p.x += p.vx * dt
          p.y += p.vy * dt
          p.life -= dt
          return p.life > 0
        })

        // ── Rank calculation ──
        const sorted = [...g.cars].sort((a, b) => {
          if (a.finished && !b.finished) return -1
          if (!a.finished && b.finished) return 1
          if (a.finished && b.finished) return a.finishTime - b.finishTime
          return b.x - a.x
        })
        setPlayerRank(sorted.findIndex(c => c.lane === g.playerLane) + 1)
        setPlayerSpeed(player.speed)
        setPlayerNitro(player.nitro)

        // Obstacle effect state for HUD
        if (player.spinTimer > 0) setObstacleEffect('spin')
        else if (player.slickTimer > 0) setObstacleEffect('slick')
        else if (player.slowTimer > 0) setObstacleEffect('slow')
        else setObstacleEffect('none')

        // ── Race finish check ──
        if (player.finished) {
          const allFinished = g.cars.every(c => c.finished)
          const timeSinceFinish = elapsed - player.finishTime
          if (allFinished || timeSinceFinish > 5) {
            g.gameState = 'finished'
            setGameState('finished')
            const standings = [...g.cars].sort((a, b) => {
              if (a.finished && !b.finished) return -1
              if (!a.finished && b.finished) return 1
              if (a.finished && b.finished) return a.finishTime - b.finishTime
              return b.x - a.x
            })
            setFinalStandings(standings)
            const lb = recordRaceResult(standings)
            setSessionLeaderboard(lb)
          }
        }
      }

      // Camera: smooth follow the player
      const player = g.cars[g.playerLane]
      const targetCameraX = player.x - CANVAS_W * 0.25
      g.cameraX += (targetCameraX - g.cameraX) * 0.06 * dt
      g.cameraX = Math.max(0, g.cameraX)

      // ═══ RENDER ═══
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H)

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H)
      skyGrad.addColorStop(0, '#1a1a2e')
      skyGrad.addColorStop(0.3, '#16213e')
      skyGrad.addColorStop(1, '#0f3460')
      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)

      // Stars
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      for (let i = 0; i < 50; i++) {
        const sx = ((i * 137 + 50) % CANVAS_W)
        const sy = ((i * 97 + 30) % (TRACK_TOP - 30))
        ctx.beginPath()
        ctx.arc(sx, sy, 0.5 + (i % 3) * 0.4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Ground
      const groundGrad = ctx.createLinearGradient(0, TRACK_TOP + LANE_COUNT * LANE_HEIGHT, 0, CANVAS_H)
      groundGrad.addColorStop(0, '#2d5016')
      groundGrad.addColorStop(1, '#1a3a0a')
      ctx.fillStyle = groundGrad
      ctx.fillRect(0, TRACK_TOP + LANE_COUNT * LANE_HEIGHT, CANVAS_W, CANVAS_H - TRACK_TOP - LANE_COUNT * LANE_HEIGHT)

      // Grandstand
      const standGrad = ctx.createLinearGradient(0, 0, 0, TRACK_TOP)
      standGrad.addColorStop(0, '#333344')
      standGrad.addColorStop(1, '#444466')
      ctx.fillStyle = standGrad
      ctx.fillRect(0, TRACK_TOP - 40, CANVAS_W, 40)
      for (let i = 0; i < 200; i++) {
        const cx = (i * 17 + (g.cameraX * 0.1) % 17) % CANVAS_W
        const cy = TRACK_TOP - 35 + (i % 5) * 6
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94', '#88D8B0']
        ctx.fillStyle = colors[i % colors.length]
        ctx.beginPath()
        ctx.arc(cx, cy, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Track surface
      const trackGrad = ctx.createLinearGradient(0, TRACK_TOP, 0, TRACK_TOP + LANE_COUNT * LANE_HEIGHT)
      trackGrad.addColorStop(0, '#555555')
      trackGrad.addColorStop(0.5, '#4a4a4a')
      trackGrad.addColorStop(1, '#404040')
      ctx.fillStyle = trackGrad
      ctx.fillRect(0, TRACK_TOP, CANVAS_W, LANE_COUNT * LANE_HEIGHT)

      // Curbs (red & white alternating)
      for (let i = 0; i < CANVAS_W / 12 + 1; i++) {
        const bx = i * 12 - (g.cameraX % 12)
        ctx.fillStyle = i % 2 === 0 ? '#DD0000' : '#FFFFFF'
        ctx.fillRect(bx, TRACK_TOP - 6, 12, 6)
        ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#DD0000'
        ctx.fillRect(bx, TRACK_TOP + LANE_COUNT * LANE_HEIGHT, 12, 6)
      }

      // Lane dividers (dashed white lines)
      ctx.setLineDash([16, 12])
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 2
      for (let i = 1; i < LANE_COUNT; i++) {
        const ly = TRACK_TOP + i * LANE_HEIGHT
        ctx.beginPath()
        ctx.moveTo(0, ly)
        ctx.lineTo(CANVAS_W, ly)
        ctx.stroke()
      }
      ctx.setLineDash([])

      // Lane labels (mini car sprite + country name)
      for (let i = 0; i < g.cars.length; i++) {
        const car = g.cars[i]
        const laneY = TRACK_TOP + i * LANE_HEIGHT + LANE_HEIGHT / 2
        const labelX = 15 - g.cameraX
        if (labelX > -80 && labelX < CANVAS_W) {
          if (car.renderedCar) {
            ctx.drawImage(car.renderedCar, 0, 0, SPRITE_CAR_W, SPRITE_CAR_H,
              labelX, laneY - 6, 20, 12)
          }
          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.font = '9px monospace'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(car.country.name, labelX + 24, laneY)
        }
      }

      // Distance markers (every 1000m)
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      for (let d = 1000; d < RACE_DISTANCE; d += 1000) {
        const mx = START_X + d - g.cameraX
        if (mx > 0 && mx < CANVAS_W) {
          ctx.fillStyle = 'rgba(255,255,255,0.15)'
          ctx.fillRect(mx, TRACK_TOP, 1, LANE_COUNT * LANE_HEIGHT)
          ctx.fillStyle = 'rgba(255,255,255,0.3)'
          ctx.fillText(`${d}m`, mx, TRACK_TOP - 10)
        }
      }

      // Start line
      const startScreenX = START_X - g.cameraX
      if (startScreenX > -10 && startScreenX < CANVAS_W) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.fillRect(startScreenX, TRACK_TOP, 3, LANE_COUNT * LANE_HEIGHT)
      }

      // Finish line (checkered pattern)
      const finishScreenX = FINISH_X - g.cameraX
      if (finishScreenX > -30 && finishScreenX < CANVAS_W + 30) {
        const checkerSize = 8
        for (let col = 0; col < 3; col++) {
          for (let row = 0; row < LANE_COUNT * LANE_HEIGHT / checkerSize; row++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? '#FFFFFF' : '#111111'
            ctx.fillRect(finishScreenX + col * checkerSize, TRACK_TOP + row * checkerSize, checkerSize, checkerSize)
          }
        }
        ctx.fillStyle = '#FFD700'
        ctx.font = 'bold 11px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('FINISH', finishScreenX + 12, TRACK_TOP - 12)
      }

      // Particles
      for (const p of g.particles) {
        const alpha = p.life / p.maxLife
        const px = p.x - g.cameraX
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(px, p.y, p.size * alpha, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // ── Draw obstacles ──
      const obsSprites = obstacleSpritesRef.current
      for (const obs of g.obstacles) {
        const ox = obs.x - g.cameraX
        if (ox < -OBSTACLE_DISPLAY_W || ox > CANVAS_W + OBSTACLE_DISPLAY_W) continue
        const oy = obs.laneY

        // Advance animation frame
        obs.animTimer += dt
        if (obs.animTimer >= OBSTACLE_ANIM_SPEED) {
          obs.animTimer = 0
          obs.animFrame = (obs.animFrame + 1) % OBSTACLE_ANIM_FRAMES
        }

        const spriteData = obsSprites[obs.type]
        if (spriteData.img && spriteData.frameWidth > 0) {
          ctx.save()
          ctx.translate(ox, oy)

          const srcX = obs.animFrame * spriteData.frameWidth
          const srcW = spriteData.frameWidth
          const srcH = spriteData.frameHeight

          ctx.drawImage(
            spriteData.img,
            srcX, 0, srcW, srcH,
            -OBSTACLE_DISPLAY_W / 2, -OBSTACLE_DISPLAY_H / 2,
            OBSTACLE_DISPLAY_W, OBSTACLE_DISPLAY_H
          )

          // Oil shimmer effect
          if (obs.type === 'oil') {
            const shimmer = ctx.createRadialGradient(
              Math.sin(timestamp * 0.003) * 5, Math.cos(timestamp * 0.004) * 3, 1,
              0, 0, 14
            )
            shimmer.addColorStop(0, 'rgba(100,150,255,0.12)')
            shimmer.addColorStop(0.5, 'rgba(200,100,255,0.06)')
            shimmer.addColorStop(1, 'rgba(0,0,0,0)')
            ctx.fillStyle = shimmer
            ctx.beginPath()
            ctx.ellipse(0, 0, 14, 9, 0.15, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.restore()
        } else {
          // Fallback: colored circle if sprite not loaded
          ctx.save()
          ctx.translate(ox, oy)
          ctx.fillStyle = obs.type === 'banana' ? '#FFE135' : obs.type === 'oil' ? '#1a1a2e' : '#777777'
          ctx.beginPath()
          ctx.arc(0, 0, 10, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      // ── Draw cars ──
      for (const car of g.cars) {
        if (!car.renderedCar) continue
        const laneY = TRACK_TOP + car.lane * LANE_HEIGHT + (LANE_HEIGHT - CAR_DISPLAY_H) / 2
        const screenX = car.x - g.cameraX
        if (screenX < -CAR_DISPLAY_W - 20 || screenX > CANVAS_W + 20) continue

        ctx.save()
        ctx.translate(screenX + CAR_DISPLAY_W / 2, laneY + car.bounceOffset + CAR_DISPLAY_H / 2)

        // Spin effect (banana)
        if (car.spinTimer > 0) {
          ctx.rotate(car.spinAngle)
        }

        ctx.translate(-CAR_DISPLAY_W / 2, -CAR_DISPLAY_H / 2)

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)'
        ctx.beginPath()
        ctx.ellipse(CAR_DISPLAY_W / 2, CAR_DISPLAY_H + 3, CAR_DISPLAY_W / 2 + 2, 4, 0, 0, Math.PI * 2)
        ctx.fill()

        // Pre-rendered car (sprite + flag livery)
        ctx.drawImage(car.renderedCar, 0, 0, SPRITE_CAR_W, SPRITE_CAR_H,
          0, 0, CAR_DISPLAY_W, CAR_DISPLAY_H)

        // Oil slick visual: dark overlay
        if (car.slickTimer > 0) {
          ctx.globalAlpha = 0.25
          ctx.fillStyle = '#1a1a2e'
          ctx.fillRect(0, 0, CAR_DISPLAY_W, CAR_DISPLAY_H)
          ctx.globalAlpha = 1
        }

        // Slow visual: red tint overlay
        if (car.slowTimer > 0) {
          ctx.globalAlpha = 0.15
          ctx.fillStyle = '#FF0000'
          ctx.fillRect(0, 0, CAR_DISPLAY_W, CAR_DISPLAY_H)
          ctx.globalAlpha = 1
        }

        // Nitro flames
        if (car.nitroActive && car.nitro > 0) {
          const flameLen = 14 + Math.random() * 12
          ctx.fillStyle = '#FF6600'
          ctx.beginPath()
          ctx.moveTo(2, CAR_DISPLAY_H / 2 - 5)
          ctx.lineTo(-flameLen, CAR_DISPLAY_H / 2)
          ctx.lineTo(2, CAR_DISPLAY_H / 2 + 5)
          ctx.closePath()
          ctx.fill()
          ctx.fillStyle = '#FFDD00'
          ctx.beginPath()
          ctx.moveTo(2, CAR_DISPLAY_H / 2 - 3)
          ctx.lineTo(-flameLen * 0.55, CAR_DISPLAY_H / 2)
          ctx.lineTo(2, CAR_DISPLAY_H / 2 + 3)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      }

      // Player highlight arrow
      {
        const px = player.x - g.cameraX
        const py = TRACK_TOP + g.playerLane * LANE_HEIGHT - 12
        if (px > 0 && px < CANVAS_W) {
          ctx.fillStyle = '#FFD700'
          ctx.beginPath()
          ctx.moveTo(px + CAR_DISPLAY_W / 2, py)
          ctx.lineTo(px + CAR_DISPLAY_W / 2 - 6, py - 8)
          ctx.lineTo(px + CAR_DISPLAY_W / 2 + 6, py - 8)
          ctx.closePath()
          ctx.fill()
        }
      }

      // Progress bar (top of screen)
      const barX = 60, barY = 12, barW = CANVAS_W - 120, barH = 16
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      roundRect(ctx, barX, barY, barW, barH, 8)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.lineWidth = 1
      roundRect(ctx, barX, barY, barW, barH, 8)
      ctx.stroke()
      for (const car of g.cars) {
        const progress = Math.min(1, (car.x - START_X) / RACE_DISTANCE)
        const dotX = barX + progress * barW
        const dotY = barY + barH / 2
        const dotColors = ['#B22234','#012169','#BC002D','#009246','#002395','#DD0000','#009B3A','#FF0000']
        ctx.fillStyle = dotColors[car.lane % dotColors.length]
        ctx.beginPath()
        ctx.arc(dotX, dotY, car.lane === g.playerLane ? 5 : 3.5, 0, Math.PI * 2)
        ctx.fill()
        if (car.lane === g.playerLane) {
          ctx.strokeStyle = '#FFD700'
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      animId = requestAnimationFrame(gameLoop)
    }

    animId = requestAnimationFrame(gameLoop)
    return () => cancelAnimationFrame(animId)
  }, [])

  // ─── Race control ──────────────────────────────────────────────
  const startRace = () => {
    const g = gameRef.current
    if (!g) return
    g.gameState = 'countdown'
    g.countdown = 3
    g.countdownTimer = 0
    setGameState('countdown')
    setPlayerSpeed(0)
    setPlayerRank(1)
    setRaceTime(0)
    setPlayerNitro(100)
    setSessionLeaderboard(loadSessionLeaderboard())
  }

  const restartRace = () => {
    const g = gameRef.current
    if (!g) return

    // Reset car positions and speeds WITHOUT reloading sprites
    for (const car of g.cars) {
      car.x = START_X
      car.speed = 0
      car.finished = false
      car.finishTime = 0
      car.nitro = 100
      car.nitroActive = false
      car.bounceOffset = 0
      car.spinTimer = 0
      car.spinAngle = 0
      car.slickTimer = 0
      car.slowTimer = 0
      // Re-randomize AI stats for variety between races
      if (car.lane !== g.playerLane) {
        car.maxSpeed = AI_MAX_SPEED_MIN + Math.random() * AI_MAX_SPEED_RANGE
        car.acceleration = AI_ACCEL_MIN + Math.random() * AI_ACCEL_RANGE
      } else {
        car.maxSpeed = PLAYER_MAX_SPEED
        car.acceleration = PLAYER_ACCELERATION
      }
    }

    g.obstacles = generateObstacles()
    g.particles = []

    g.gameState = 'countdown'
    g.countdown = 3
    g.countdownTimer = 0
    g.cameraX = 0
    setGameState('countdown')
    setPlayerSpeed(0)
    setPlayerRank(1)
    setRaceTime(0)
    setPlayerNitro(100)
    setFinalStandings([])
    setObstacleEffect('none')
  }

  // ═══════════════════════════════════════════════════════════════════
  // JSX RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        className="block max-w-full max-h-full"
        style={{ imageRendering: 'auto' }}
      />

      {/* Loading Screen */}
      {gameState === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          {loadError ? (
            <>
              <div className="text-red-500 text-2xl font-bold font-mono mb-4">Error Loading Game</div>
              <div className="text-red-400 text-sm font-mono mb-4">{loadError}</div>
              <button onClick={() => { setLoadError(null); initDoneRef.current = false; setAssetsReady(false); }}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl font-mono cursor-pointer">
                RETRY
              </button>
            </>
          ) : (
            <>
              <div className="text-white text-3xl font-bold font-mono mb-4 animate-pulse">Loading...</div>
              <div className="text-gray-400 text-sm font-mono">Downloading car sprites &amp; flags</div>
            </>
          )}
        </div>
      )}

      {/* Obstacle effect indicator */}
      {(gameState === 'racing' || gameState === 'countdown') && obstacleEffect !== 'none' && (
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className={`rounded-xl px-4 py-3 border backdrop-blur-sm ${
            obstacleEffect === 'spin' ? 'bg-yellow-900/60 border-yellow-400/50' :
            obstacleEffect === 'slick' ? 'bg-purple-900/60 border-purple-400/50' :
            'bg-red-900/60 border-red-400/50'
          }`}>
            <div className={`text-lg font-bold font-mono animate-pulse ${
              obstacleEffect === 'spin' ? 'text-yellow-300' :
              obstacleEffect === 'slick' ? 'text-purple-300' :
              'text-red-300'
            }`}>
              {obstacleEffect === 'spin' ? 'SPINNING!' :
               obstacleEffect === 'slick' ? 'SLIDING!' :
               'SLOWED!'}
            </div>
          </div>
        </div>
      )}

      {/* Controls hint */}
      {gameState === 'racing' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10 pointer-events-none">
          <div className="text-gray-300 text-xs font-mono text-center">
            W / Arrow Up = Accelerate &nbsp;|&nbsp; S / Arrow Down = Brake &nbsp;|&nbsp; SHIFT = Nitro
          </div>
        </div>
      )}

      {/* Countdown */}
      {gameState === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white font-bold text-9xl drop-shadow-2xl animate-pulse" style={{
            textShadow: '0 0 40px rgba(255,50,50,0.8), 0 0 80px rgba(255,50,50,0.4)',
            fontFamily: 'monospace',
          }}>
            {countdown > 0 ? countdown : 'GO!'}
          </div>
        </div>
      )}

      {/* Start Menu */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="text-center">
            <h1 className="text-6xl font-black text-white mb-2 tracking-tight" style={{
              textShadow: '0 0 30px rgba(255,50,50,0.6), 0 4px 8px rgba(0,0,0,0.5)',
              fontFamily: 'monospace',
            }}>
              RACE OF NATIONS
            </h1>
            <p className="text-gray-400 text-lg font-mono mb-6">World Grand Prix</p>

            <div className="grid grid-cols-4 gap-3 mb-8 max-w-md mx-auto">
              {COUNTRIES.map((country, i) => (
                <div key={country.code} className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                  i === playerLane ? 'bg-yellow-500/20 border-2 border-yellow-400/50' : 'bg-white/5 border border-white/10'
                }`}>
                  <img
                    src={`https://flagcdn.com/w40/${country.code}.png`}
                    alt={country.name}
                    className="w-10 h-6 rounded-sm"
                    style={{ imageRendering: 'auto' }}
                  />
                  <span className={`text-xs font-mono ${i === playerLane ? 'text-yellow-300 font-bold' : 'text-gray-300'}`}>
                    {country.name}
                  </span>
                  {i === playerLane && <span className="text-[10px] text-yellow-400 font-mono">YOU</span>}
                </div>
              ))}
            </div>

            <button onClick={startRace}
              className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white text-2xl font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/30 font-mono tracking-wider cursor-pointer">
              START RACE
            </button>
            <div className="mt-6 text-gray-500 font-mono text-sm">
              <p>W or Arrow Up to accelerate</p>
              <p>S or Arrow Down to brake</p>
              <p>SHIFT for Nitro boost</p>
              <p>Race {RACE_DISTANCE}m to the finish!</p>
              <p className="mt-2 text-gray-400">Watch out for obstacles on the track!</p>
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <img src="/obstacle-banana.png" alt="Banana" className="w-5 h-5 object-cover" />
                  <span className="text-yellow-300 text-xs font-mono">Spin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <img src="/obstacle-oil.png" alt="Oil" className="w-5 h-5 object-cover" />
                  <span className="text-purple-300 text-xs font-mono">Slide</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <img src="/obstacle-rock.png" alt="Rock" className="w-5 h-5 object-cover" />
                  <span className="text-gray-300 text-xs font-mono">Slow</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finish Screen — Center: race top 5 | Right: session leaderboard */}
      {gameState === 'finished' && (() => {
        const top5 = finalStandings.slice(0, 5)
        const winner = top5[0]
        const sortedLeaderboard = [...sessionLeaderboard]
          .sort((a, b) => b.wins - a.wins)
          .filter(e => e.wins > 0)
        const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32']
        const podiumSizes = ['text-5xl', 'text-3xl', 'text-2xl', 'text-xl', 'text-lg']

        return (
          <div className="absolute inset-0 flex bg-gradient-to-br from-[#0a0e27] via-[#111640] to-[#0a0e27]">

            {/* CENTER PANEL: Race Results (Top 5) */}
            <div className="flex-1 flex flex-col items-center justify-center px-8">

              {/* Winner celebration header */}
              {winner && (
                <div className="mb-6 text-center">
                  <div className="inline-block px-6 py-1 mb-3 rounded-full border-2 border-yellow-500/40 bg-yellow-500/10">
                    <span className="text-yellow-400 text-xs font-mono uppercase tracking-widest">Race Winner</span>
                  </div>

                  <div className="flex items-center justify-center gap-4 mb-2">
                    <img src={`https://flagcdn.com/w80/${winner.country.code}.png`} alt={winner.country.name}
                      className="w-16 h-10 rounded shadow-lg" style={{ imageRendering: 'auto' }} />
                    <h2 className="text-5xl font-black font-mono tracking-tight" style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: 'none',
                      filter: 'drop-shadow(0 2px 8px rgba(255,215,0,0.4))',
                    }}>
                      {winner.country.name}
                    </h2>
                  </div>

                  {/* Player rank badge */}
                  <div className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-full font-mono font-bold text-lg" style={{
                    background: playerRank <= 3 ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
                    border: playerRank <= 3 ? '2px solid rgba(255,215,0,0.3)' : '2px solid rgba(255,255,255,0.1)',
                    color: playerRank === 1 ? '#FFD700' : playerRank === 2 ? '#C0C0C0' : playerRank === 3 ? '#CD7F32' : '#FFFFFF',
                  }}>
                    <span className="text-2xl">{playerRank === 1 ? '1st' : playerRank === 2 ? '2nd' : playerRank === 3 ? '3rd' : `${playerRank}th`}</span>
                    <span className="text-gray-400 text-sm">Place</span>
                  </div>
                </div>
              )}

              {/* Top 5 Podium */}
              <div className="flex items-end justify-center gap-3 mb-6">
                {top5.map((car, i) => {
                  const isPlayer = car.lane === playerLane
                  const podiumH = [140, 105, 85, 70, 60]
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <img src={`https://flagcdn.com/w40/${car.country.code}.png`} alt={car.country.name}
                        className={`rounded shadow-md mb-1 ${isPlayer ? 'ring-2 ring-yellow-400' : ''}`}
                        style={{ width: 36, height: 24, imageRendering: 'auto' }} />
                      <span className={`font-mono text-xs mb-1 ${isPlayer ? 'text-yellow-300 font-bold' : 'text-gray-300'}`}>
                        {car.country.name}
                      </span>
                      <div className={`${podiumSizes[i]} font-black font-mono mb-1`} style={{
                        color: i < 3 ? medalColors[i] : '#888888',
                      }}>
                        {i + 1}
                      </div>
                      <div className="w-16 rounded-t-lg flex items-center justify-center" style={{
                        height: podiumH[i],
                        background: i === 0 ? 'linear-gradient(180deg, #FFD700, #B8860B)'
                          : i === 1 ? 'linear-gradient(180deg, #C0C0C0, #808080)'
                          : i === 2 ? 'linear-gradient(180deg, #CD7F32, #8B4513)'
                          : 'linear-gradient(180deg, #4a5568, #2d3748)',
                      }}>
                        <span className="text-white/80 font-mono text-xs font-bold">
                          {isPlayer ? 'YOU' : `P${i + 1}`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button onClick={restartRace}
                className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-xl font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-600/30 font-mono tracking-wider cursor-pointer border border-yellow-500/30">
                RACE AGAIN
              </button>
            </div>

            {/* RIGHT PANEL: Today's Leaderboard */}
            <div className="w-80 bg-[#0d1230]/90 border-l border-yellow-500/20 flex flex-col p-5 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-yellow-500/20">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="text-yellow-400 font-mono font-bold text-sm uppercase tracking-wider">Today&apos;s Top Winners</h3>
                  <p className="text-gray-500 text-[10px] font-mono">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>

              {sortedLeaderboard.length === 0 ? (
                <div className="text-gray-500 text-sm font-mono text-center mt-8">
                  No races completed yet.
                  <br />Win a race to appear here!
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1 text-gray-500 text-[10px] font-mono uppercase tracking-wider">
                    <span className="w-6">#</span>
                    <span className="flex-1">Country</span>
                    <span className="w-12 text-right">Wins</span>
                  </div>
                  {sortedLeaderboard.map((entry, i) => (
                    <div key={entry.code} className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors ${
                      entry.code === COUNTRIES[playerLane].code ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-white/[0.02]'
                    }`}>
                      <div className="w-6 flex items-center justify-center">
                        {i < 3 ? (
                          <span className="text-lg" style={{
                            color: medalColors[i],
                            filter: `drop-shadow(0 0 4px ${medalColors[i]}40)`,
                          }}>
                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                          </span>
                        ) : (
                          <span className="text-gray-500 font-mono text-sm font-bold">{i + 1}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img src={`https://flagcdn.com/w40/${entry.code}.png`} alt={entry.name}
                          className="w-6 h-4 rounded-sm flex-shrink-0" style={{ imageRendering: 'auto' }} />
                        <span className={`font-mono text-sm truncate ${entry.code === COUNTRIES[playerLane].code ? 'text-yellow-300 font-bold' : 'text-gray-200'}`}>
                          {entry.name}
                        </span>
                      </div>
                      <div className="w-12 text-right">
                        <span className="font-mono text-sm font-bold text-yellow-400">{entry.wins}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reset leaderboard button */}
              <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
                <button
                  onClick={() => {
                    const fresh = resetSessionLeaderboard()
                    setSessionLeaderboard(fresh)
                  }}
                  className="w-full px-4 py-2.5 bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 hover:border-red-400/50 text-red-300 hover:text-red-200 text-sm font-bold font-mono rounded-lg transition-all cursor-pointer"
                >
                  Reset Daily Leaderboard
                </button>

                {/* Your stats */}
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                  <div className="text-yellow-400 text-xs font-mono uppercase tracking-wider mb-1">Your Stats</div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-mono text-sm">Position</span>
                    <span className="font-mono font-bold text-lg" style={{
                      color: playerRank === 1 ? '#FFD700' : playerRank === 2 ? '#C0C0C0' : playerRank === 3 ? '#CD7F32' : '#FFFFFF',
                    }}>P{playerRank}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
