# Race Design Spec

## 1. Layout
- **Structure:** `.race-page` — flex column, height: 100vh, width: 100vw, overflow: hidden
- **Background:** `bg-track` (#1a1a2e dark track surface)
- **Sections (top→bottom):** GameHeader → .leader-pill → .track-area → .vote-panel
- **Track layers (z-index):** .track-bg (0), .track-scroll-layer (1), .lanes-container (2), .lane-info (3), .car-sprite-wrapper (4), .finish-line (5), .race-finish-btn (10)

## 2. Colors
| Token | Hex/RGBA | Usage |
|-------|----------|-------|
| .track-area bg | #2a2a2a | Road surface |
| .track-bg line | rgba(255,255,255,0.01) | Subtle road texture |
| .track-lines | rgba(255,255,255,0.03) | Road marker dots |
| .leader-pill bg | rgba(5,10,26,0.9) | Leader indicator bg |
| .leader-pill border | #ffd700 | Gold border |
| .crown-icon / .leader-label | #ffd700 | Gold accent |
| .lane-row border | rgba(255,255,255,0.15) | Dashed lane dividers |
| .lane-info bg | linear-gradient(to right, rgba(26,26,46,0.95) 70%, transparent) | Lane label fade |
| .car-sprite filter | drop-shadow(-6px 0 4px rgba(255,200,50,0.55)) | Headlight glow |
| .boost-badge bg | rgba(0,0,0,0.7) | Boost count badge |
| .boost-icon | #ffd700 | Gold boost icon |
| .finish-line | #000 / #fff | Checkered pattern |
| .vote-panel bg | rgba(6,13,30,0.97) | Bottom panel |
| .vote-card bg | rgba(13,31,60,0.9) | Vote button surface |
| .vote-card border | rgba(255,255,255,0.15) | Default border |
| .vote-card:hover | rgba(0,212,255,0.5) border | Hover glow |
| .vote-card.boosting border | #ffd700 | Gold boost flash |
| .race-finish-btn bg | #22c55e | Green finish btn |

## 3. Typography
| Element | Font | Size | Weight | Letter-spacing | Color |
|---------|------|------|--------|----------------|-------|
| .leader-code | Barlow Condensed | clamp(0.9rem,1.3vw,1.2rem) | 700 | normal | #ffffff |
| .leader-label | Barlow Condensed | clamp(0.55rem,0.8vw,0.75rem) | normal | 0.1em | #ffd700 |
| .lane-code | Barlow Condensed | clamp(0.75rem,1.1vw,1rem) | 700 | normal | #ffffff |
| .vote-heading | Barlow Condensed | clamp(0.7rem,1vw,0.95rem) | 600 | 0.12em | #ffffff |
| .vote-code | Barlow Condensed | clamp(0.8rem,1.1vw,1rem) | 700 | normal | #ffffff |
| .vote-name | Barlow Condensed | clamp(0.6rem,0.85vw,0.8rem) | normal | normal | #00d4ff |
| .vote-count | Barlow Condensed | clamp(0.55rem,0.75vw,0.75rem) | normal | normal | #94a3b8 |
| .race-finish-btn | Barlow Condensed | clamp(0.8rem,1.1vw,1rem) | 700 | 0.08em | #ffffff |
| .boost-count | Barlow Condensed | clamp(10px,1vw,14px) | 700 | normal | #ffffff |

## 4. Spacing
- **Leader pill padding:** clamp(4px,0.6vh,8px) clamp(12px,1.5vw,22px)
- **Leader pill margin:** clamp(4px,0.8vh,10px) auto 0
- **Track area:** flex: 1 (fills remaining height)
- **Lane info width:** clamp(100px,10vw,160px)
- **Lane info gap:** clamp(6px,0.8vw,12px)
- **Lane flag width:** clamp(22px,2.2vw,34px)
- **Finish line:** right: clamp(24px,2.5vw,40px), width: clamp(20px,2vw,32px)
- **Vote panel height:** clamp(140px,26vh,240px)
- **Vote panel padding:** clamp(8px,1.2vh,14px) clamp(16px,2vw,32px)
- **Vote card padding:** clamp(6px,1vh,12px) clamp(8px,1vw,14px)
- **Vote card min-width:** clamp(70px,8vw,120px)
- **Vote card gap:** clamp(3px,0.5vh,6px)
- **Race finish btn padding:** clamp(10px,1.5vh,16px) clamp(24px,3vw,48px)
- **Race finish btn bottom:** clamp(150px,28vh,260px)

## 5. Components

### Leader Pill (.leader-pill)
- **Box:** display: flex, align-items: center, gap: clamp(8px,1vw,14px), border-radius: clamp(6px,0.8vw,10px), width: fit-content
- **Background:** rgba(5,10,26,0.9), border: 2px solid #ffd700
- **Crown icon:** position: absolute, top: -14px, centerX, color: #ffd700, size: clamp(14px,1.4vw,20px)

### Car Sprite Wrapper
- **Position:** absolute, left: calc(var(--car-progress,50) * 1%), transform: translateX(-50%)
- **Transition:** left 0.25s linear
- **Z-index:** 4
- **Animate(:racing):** laneVibrate 0.12s ease-in-out infinite

### @keyframes laneVibrate
- 0% { transform: translateX(-50%) translateY(0) }
- 25% { transform: translateX(-50%) translateY(-1.5px) }
- 75% { transform: translateX(-50%) translateY(1.5px) }
- 100% { transform: translateX(-50%) translateY(0) }

### Boost Badge
- **Box:** display: flex, align-items: center, gap: 3px, border-radius: 5px, padding: 2px 6px, margin-left: clamp(4px,0.5vw,8px)
- **Background:** rgba(0,0,0,0.7), border: 1px solid rgba(255,255,255,0.25)

### Track Lines (scrolling road)
- **.track-scroll-layer:** position: absolute, inset: 0, width: 200vw
- **Animation:** trackScroll 8s linear infinite
- **@keyframes trackScroll:** 0% { translateX(0) } → 100% { translateX(-50%) }
- **.track-lines:** repeating-linear-gradient(90deg, transparent 100px, rgba(255,255,255,0.03) 102px)

### Finish Line
- **Position:** absolute, right: clamp(24px,2.5vw,40px), top/bottom: 0, width: clamp(20px,2vw,32px), z-index: 5
- **Pattern:** repeating-conic-gradient(#000 0% 25%, #fff 0% 50%), background-size: 16px 16px, opacity: 0.85

### Vote Card
- **Box:** flex column, align/justify center, gap: clamp(3px,0.5vh,6px), border-radius: clamp(6px,0.8vw,10px), min-width: clamp(70px,8vw,120px)
- **Background:** rgba(13,31,60,0.9), border: 1px solid rgba(255,255,255,0.15)
- **Cursor:** pointer
- **State:hover:** border-color: rgba(0,212,255,0.5), box-shadow: 0 0 12px rgba(0,212,255,0.25)
- **State:active:** transform: scale(0.95)
- **State:boosting:** border-color: #ffd700, box-shadow: 0 0 16px rgba(255,215,0,0.5), animation: boostFlash 0.3s ease-out

### @keyframes boostFlash
- 0% { background: rgba(255,215,0,0.25) }
- 100% { background: rgba(13,31,60,0.9) }

### Vote Flag
- **Width:** 85%, aspect-ratio: 4/3, object-fit: cover, border-radius: 4px, border: 1px solid rgba(255,255,255,0.2)

### Race Finish Button (.race-finish-btn)
- **Position:** absolute, bottom: clamp(150px,28vh,260px), left: 50%, translateX(-50%), z-index: 10
- **Box:** border-radius: clamp(6px,0.6vw,10px), padding: clamp(10px,1.5vh,16px) clamp(24px,3vw,48px)
- **Background:** #22c55e, border: 2px solid #16a34a, box-shadow: 0 0 14px rgba(34,197,94,0.45)
- **State:hover:** filter: brightness(1.12), box-shadow: 0 0 20px rgba(34,197,94,0.6)

### Leader Flag (.leader-flag)
- **Width:** clamp(28px,2.8vw,42px), aspect-ratio: 4/3, object-fit: cover, border-radius: 3px

### Lane Flag (.lane-flag)
- **Width:** clamp(22px,2.2vw,34px), aspect-ratio: 4/3, object-fit: cover, border-radius: 3px

## 6. Effects & Motion
- **Track scroll:** trackScroll 8s linear infinite (background layer)
- **Car vibration:** laneVibrate 0.12s ease-in-out infinite (when .racing)
- **Car movement:** left 0.25s linear transition
- **Vote card boost:** boostFlash 0.3s ease-out, gold border + shadow
- **Vote card hover:** border-color 0.15s, box-shadow 0.15s, transform 0.1s
- **Finish btn hover:** filter 0.15s, box-shadow 0.15s

## 7. Assets
- **Car sprites:** /cars/rally_car_livery_sprites/{code}.png, width: clamp(60px,6vw,100px), height: auto
- **Flags:** /flags/country_flag/{code}.png (shared with other pages)
- **Icons:** lucide-react `Crown` (leader pill), ⚡ (boost badge, raw char)

## 8. Shared Elements
- **Header:** Same as Lobby (GameHeader)
- **Flag component:** CountryFlag with size="banner" (24px width) for leader, lane, vote flags

## 9. Flow
- **Route path:** /race
- **Entry:** navigated from Lobby (startRace)
- **Store reads:** raceParticipants, voteForCountry
- **Vote:** handleVote → voteForCountry() + local state increment + 300ms boosting flash
- **Finish:** handleFinishRace → navigate('/leaderboard')
- **Leader pill:** sortedByPosition[0] drives current leader
- **Exit:** navigate('/leaderboard')
