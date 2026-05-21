# Leaderboard Design Spec

## 1. Layout
- **Structure:** GameBackground (bg-stadium) > GameHeader > flex row (left col + sidebar)
- **Left column (flex: 1):** winner-section → .podium → timer+restart
- **Right sidebar:** .leaderboard-sidebar (width: 320px, flex-shrink: 0)
- **Wrapper:** flex-1 flex flex-col lg:flex-row, gap-4, px-4 md:px-8 lg:px-12, pb-4, min-h-0
- **Z-index:** confetti-container z-100 (on top of everything), content at default

## 2. Colors
| Token | Hex/RGBA | Usage |
|-------|----------|-------|
| .winner-name | #ffd700 | Gold winner text |
| .winner-name text-shadow | 0 0 20px rgba(255,215,0,0.3) | Gold glow |
| .laurel fill | #ffd700 | Gold laurel leaves |
| .laurel drop-shadow | 0 0 8px rgba(255,215,0,0.4) | Laurel gold glow |
| .leaderboard-panel bg | --color-bg-secondary (#0a1628) | Sidebar panel |
| .leaderboard-panel border | rgba(255,215,0,0.3) | Gold border |
| .podium-card bg | --color-bg-card (#0d1f3c) | Podium card surface |
| .podium-card border | rgba(255,255,255,0.1) | Subtle white border |
| .podium-card__rank | #00d4ff | Cyan rank number |
| .leaderboard-row:nth-child(-n+3) bg | rgba(255,215,0,0.05) | Gold tint top 3 |
| .leaderboard-row:hover bg | rgba(0,212,255,0.08) | Cyan hover tint |
| .rank-number / wins | --color-text-secondary (#94a3b8) | Dim text |
| .leaderboard-row__wins--gold | #ffd700 | Gold wins top 3 |
| .confetti-piece colors | #ffd700, #00d4ff, #ff00aa, #22c55e, #ffffff | Random palette |

## 3. Typography
| Element | Font | Size | Weight | Letter-spacing | Color |
|---------|------|------|--------|----------------|-------|
| .winner-name | Barlow Condensed | clamp(2rem,4vw,3.5rem) | 700 italic | normal | #ffd700 |
| .leaderboard-panel__title | Barlow Condensed | clamp(0.875rem,1.2vw,1rem) | 700 | 0.1em | #ffd700 |
| .podium-card__rank | Barlow Condensed | clamp(0.875rem,1vw,1rem) | 700 | normal | #00d4ff |
| .podium-card__name | Barlow Condensed | clamp(0.65rem,1vw,0.875rem) | 600 | normal | --color-text-secondary |
| .leaderboard-row__name | Barlow Condensed | clamp(0.75rem,1vw,0.875rem) | 600 | normal | #ffffff |
| .leaderboard-row__wins | Barlow Condensed | 14px | 700 | normal | --color-text-secondary |
| .rank-number | Barlow Condensed | 14px | 700 | normal | --color-text-secondary |
| .medal-circle font | Barlow Condensed | 12px | 700 | normal | inline color |
| Timer label (GlowText) | Rajdhani (font-heading) | text-sm | 700 | tracking-wider | #ffffff |
| Countdown digits | Barlow Condensed | clamp(1.4rem,2.2vw,2rem) | 700 | tabular-nums | #ff00aa |
| "WINNER IS" (GlowText) | Rajdhani | text-2xl | 700 | 0.15em italic | #ffffff (white glow) |
| "Race Reset In" (GlowText) | Rajdhani | text-sm | 700 | tracking-wider | #ffffff |

## 4. Spacing
- **Winner section padding:** 24px 16px 16px
- **Winner display gap:** 24px (flag ↔ laurels)
- **Winner title margin-bottom:** 24px
- **Winner flag max-width:** 300px
- **Laurel:** width: 60px, height: 120px
- **Podium:** grid 4 cols, gap: 12px, max-width: 800px, margin-top: 24px, padding: 0 16px
- **Podium card padding:** 16px 12px, gap: 8px
- **Sidebar panel padding:** 16px
- **Sidebar header margin-bottom:** 16px, gap: 8px
- **Leaderboard row:** grid-template-columns: 40px 1fr 50px, gap: 12px, padding: 12px, border-radius: 8px
- **Medal circle:** 28px x 28px, border-2
- **Restart pill:** px-4 py-2, rounded-xl, gap: 3
- **NeonButton (RESTART RACE):** min-w-[200px]

## 5. Components

### Winner Section
- **Box:** flex column, align-items: center, padding: 24px 16px 16px
- **Winner flag (CountryFlag):** size="full" (240x160px)
- **Winner name animation:** winner-reveal 0.6s ease-out

### @keyframes winner-reveal
- 0% { opacity: 0; transform: scale(0.8) }
- 100% { opacity: 1; transform: scale(1) }

### Laurel SVG
- **Box:** width: 60px, height: 120px, flex-shrink: 0
- **Filter:** drop-shadow(0 0 8px rgba(255,215,0,0.4))
- **.laurel--left:** scaleX(1)
- **.laurel--right:** scaleX(-1) (mirrored)
- **Leaf ellipses:** fill: #ffd700, opacity: 0.55-0.7, varying position/radius

### Podium Card
- **Box:** flex column, align-items: center, gap: 8px, padding: 16px 12px, border-radius: 10px
- **Background:** #0d1f3c, border: 2px solid rgba(255,255,255,0.1)
- **Text-align:** center

### Sidebar Panel (.leaderboard-panel)
- **Box:** flex column, border-radius: 12px, padding: 16px, height: 100%
- **Background:** #0a1628, border: 1px solid rgba(255,215,0,0.3)

### Leaderboard Row
- **Box:** display: grid, cols: 40px 1fr 50px, gap: 12px, padding: 12px, border-radius: 8px
- **State:hover:** bg rgba(0,212,255,0.08)

### Medal Circle
- **Box:** width: 28px, height: 28px, border-radius: 50%, border-2 (color inline), bg rgba(0,0,0,0.3)
- **Center:** flex, align/justify center

### Restart Pill (timer container)
- **Box:** flex items-center, gap-3, px-4 py-2, rounded-xl
- **Background:** rgba(15,23,41,0.9), border: 1px solid rgba(0,212,255,0.3)

### Confetti Container
- **Position:** fixed, inset: 0, pointer-events: none, z-index: 100, overflow: hidden

### Confetti Piece
- **Position:** absolute, top: -20px, width: 10px, height: 10px, border-radius: 2px
- **Animation:** confetti-fall 3s ease-out forwards
- **Delay:** random 0-2s (JSX style), duration: random 2-4s (JSX style)

### @keyframes confetti-fall
- 0% { transform: translateY(0) rotate(0deg); opacity: 1 }
- 100% { transform: translateY(100vh) rotate(720deg); opacity: 0 }

## 6. Effects & Motion
- **Winner reveal:** winner-reveal 0.6s ease-out (animation on .winner-name)
- **Confetti:** confetti-fall 3s ease-out forwards, 60 pieces, staggered delay
- **Row hover:** background-color 0.2s ease
- **Countdown digits pulse:** animate-pulse (when timeLeft <= 10)
- **Confetti hidden:** setTimeout 4s, showConfetti set to false

## 7. Assets
- **Flags:** CountryFlag size="full" (240x160) for winner, size="md" (48x32) for podium, size="sm" (32x22) for sidebar
- **Laurels:** inline SVG paths (no external assets)
- **Icons:** lucide-react Trophy (gold), Timer (cyan), RotateCcw
- **NeonButton variant:** primary (green) for restart

## 8. Shared Elements
- **Header:** Same as Lobby (GameHeader)
- **CountdownTimer:** seconds=7, onComplete=handleRestart, auto navigates to /lobby
- **GlowText:** variant="white" for WINNER IS, "Race Reset In"

## 9. Flow
- **Route path:** /leaderboard
- **Entry:** navigated from Race (handleFinishRace)
- **Store reads:** leaderboard, resetRace
- **Data:** MOCK_RACE_RESULTS[0] = winner, .slice(0,5) = top 5
- **Auto restart:** CountdownTimer 7s → navigate('/lobby')
- **Manual restart:** NeonButton "RESTART RACE" → resetRace() + navigate('/lobby')
- **Back navigation guard:** navigatingRef prevents double-navigate

## Visual Notes
- **Confetti count:** 60 pieces generated via Array.from({length:60})
- **Confetti colors:** random pick from [#ffd700, #00d4ff, #ff00aa, #22c55e, #ffffff]
- **Confetti stagger:** animationDelay `Math.random() * 2`s
- **Confetti fall speed:** animationDuration `2 + Math.random() * 2`s
- **Laurel leaf opacities:** 0.7 (bottom) → 0.55 (top), fading upward
