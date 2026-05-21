# Lobby Design Spec

## 1. Layout
- **Structure:** `.lobby-page` — flex column, height: 100vh, width: 100vw, overflow: hidden
- **Sections (top→bottom):** GameHeader → .lobby-countdown → .team-grid-section → .lobby-buttons → .banner-section
- **Background:** `bg-stadium` CSS class on `.lobby-page`
- **Z-index:** game-header-btn z-20, content z-10

## 2. Colors
| Token | Hex/RGBA | Usage |
|-------|----------|-------|
| --color-bg-primary | #050a1a | Deepest bg |
| --color-bg-card | #0d1f3c | Team card surface |
| --color-neon-cyan | #00d4ff | Filled card border, accent |
| --color-waiting | #4a5568 | Empty card text, icon |
| --color-btn-green | #22c55e | Start button bg |
| --color-btn-red | #c0213a | Reset button bg |
| .team-card--empty border | rgba(255,255,255,0.1) | Empty card border |
| .banner-section bg | rgba(6,13,30,0.97) | Bottom banner bg |
| .banner-code | #00d4ff | Country code in banner |
| .lobby-countdown bg | rgba(5,10,26,0.85) | Countdown pill bg |
| .team-card--filled shadow | 0 0 clamp(8px,1.2vw,20px) rgba(0,212,255,0.35) | Card glow |
| .lobby-btn--start shadow | 0 0 14px rgba(34,197,94,0.45) | Start btn glow |

## 3. Typography
| Element | Font | Size | Weight | Letter-spacing | Color |
|---------|------|------|--------|----------------|-------|
| Team card label | Barlow Condensed | clamp(0.8rem,1.2vw,1.1rem) | 700 | normal | #ffffff |
| Team card waiting | Barlow Condensed | clamp(0.6rem,0.85vw,0.8rem) | 400 | normal | #4a5568 |
| Lobby btn text | Barlow Condensed | clamp(0.8rem,1.1vw,1rem) | 700 | 0.08em | #ffffff |
| Banner heading | Barlow Condensed | clamp(0.9rem,1.4vw,1.3rem) | 600 | 0.15em | #ffffff |
| Banner name | Barlow Condensed | clamp(0.65rem,0.9vw,0.85rem) | 600 | normal | #ffffff |
| Banner code | Barlow Condensed | clamp(0.6rem,0.8vw,0.8rem) | 700 | normal | #00d4ff |
| Countdown label (via CountdownTimer) | Barlow Condensed | clamp(0.7rem,1vw,0.9rem) | 600 | 0.1em | #ffffff |
| Countdown digits | Barlow Condensed | clamp(1.4rem,2.2vw,2rem) | 700 | tabular-nums | #ff00aa |

## 4. Spacing
- **Section padding:** .team-grid-section: clamp(4px,1vh,18px) clamp(16px,2.5vw,48px)
- **Grid gap:** clamp(6px,1vw,16px)
- **Card border-radius:** clamp(6px,0.8vw,12px)
- **Button height:** clamp(44px,5.5vh,60px), min-width: clamp(160px,14vw,240px)
- **Button border-radius:** clamp(6px,0.6vw,10px)
- **Button gap:** clamp(8px,1.2vw,20px)
- **Button padding:** clamp(4px,0.6vh,12px) 0 clamp(8px,1.2vh,18px) 0
- **Banner height:** clamp(110px,18vh,170px)
- **Banner padding:** clamp(18px,2.5vh,28px) 0 clamp(6px,1vh,12px)
- **Banner gap (flag→text):** clamp(3px,0.5vh,6px)
- **Banner items gap:** clamp(24px,3vw,56px)
- **Empty card icon:** clamp(28px,3vw,48px) square
- **Empty card content gap:** clamp(4px,0.6vh,8px)

## 5. Components

### Team Card (filled)
- **Box:** width: 100%, aspect-ratio: 3/2, border-radius: clamp(6px,0.8vw,12px), bg: #0d1f3c, box-sizing: border-box
- **Border:** 2px solid #00d4ff
- **Shadow:** 0 0 clamp(8px,1.2vw,20px) rgba(0,212,255,0.35)
- **Position:** relative, overflow: hidden
- **Cursor:** pointer
- **State:hover:** filter: brightness(1.1)

### Team Card (empty)
- **Box:** identical to filled (width: 100%, aspect-ratio: 3/2, border-radius, bg: #0d1f3c)
- **Border:** 1px solid rgba(255,255,255,0.1)
- **Opacity:** 0.7
- **Cursor:** default
- **Content:** position: absolute, inset: 0, flex column, items center, justify center, gap: clamp(4px,0.6vh,8px)

### Team Card Flag (inside filled card)
- **Position:** absolute, inset: 0
- **Size:** width: 100%, height: 100%
- **Object-fit:** cover
- **Border-radius:** inherit
- **Display:** block

### Start Button
- **Box:** height: clamp(44px,5.5vh,60px), min-width: clamp(160px,14vw,240px), border-radius: clamp(6px,0.6vw,10px)
- **Background:** #22c55e, border: 1px solid #16a34a
- **Shadow:** 0 0 14px rgba(34,197,94,0.45)
- **State:hover:** filter: brightness(1.12), box-shadow: 0 0 20px rgba(34,197,94,0.6)

### Reset Button
- **Box:** same as Start
- **Background:** #c0213a, border: 1px solid #9b1a2e
- **Shadow:** 0 0 14px rgba(192,33,58,0.45)
- **State:hover:** filter: brightness(1.12), box-shadow: 0 0 20px rgba(192,33,58,0.6)

### Countdown Pill (.lobby-countdown)
- **Box:** display: flex, align-items: center, gap: clamp(8px,1vw,16px), border-radius: 8px
- **Background:** rgba(5,10,26,0.85), border: 1px solid rgba(255,255,255,0.2)
- **Padding:** clamp(4px,0.6vh,8px) clamp(12px,1.5vw,24px)
- **Width:** fit-content, margin: clamp(4px,0.8vh,10px) auto 0

### Banner Section
- **Box:** flex: 0 0 auto, height: clamp(110px,18vh,170px), overflow: hidden, flex column
- **Background:** rgba(6,13,30,0.97), border-top: 1px solid rgba(0,212,255,0.2)
- **Padding:** clamp(18px,2.5vh,28px) 0 clamp(6px,1vh,12px), gap: clamp(4px,0.8vh,10px)

### Banner Flag
- **Box:** height: clamp(43px,6vh,72px), width: auto, aspect-ratio: 4/3
- **Border:** 1px solid rgba(255,255,255,0.2), border-radius: 6px
- **Object-fit:** cover, display: block, flex-shrink: 0
- **State:hover (via .banner-item):** border-color: rgba(0,212,255,0.6), box-shadow: 0 0 8px rgba(0,212,255,0.3)

### Banner Track
- **Box:** display: flex, align-items: center, gap: clamp(24px,3vw,56px), width: max-content, padding: 0 clamp(12px,1.5vw,24px)
- **Animation:** marquee 55s linear infinite

### @keyframes marquee
- 0% { transform: translateX(0) }
- 100% { transform: translateX(-50%) }

## 6. Effects & Motion
- **Card hover:** transition: all 0.2s ease, filter: brightness(1.1)
- **Button hover:** transition: filter 0.15s, box-shadow 0.15s
- **Banner scroll:** animation: marquee 55s linear infinite
- **Banner flag hover:** transition: border-color 0.15s, box-shadow 0.15s

## 7. Assets
- **Flags:** /flags/country_flag/{code}.png, aspect-ratio: 4/3
- **Icons:** lucide-react `Users` (empty card)
- **Banner flags:** CountryFlag component with display block, object-fit cover

## 8. Shared Elements
- **Header:** Same as Race (GameHeader component, .game-header)
- **CountdownTimer:** Same as Leaderboard (uses CountdownTimer component)

## 9. Flow
- **Route path:** /lobby (and / redirects here)
- **Entry:** GameHeader → countdown pill → 2x4 team grid → Start/Reset buttons → scrolling flag banner
- **Exit (Start):** startRace() + navigate('/race')
- **Exit (Reset):** resetRace() + setCountdown(60)
- **Country select:** click banner flag → selectCountry() fills first empty slot
- **Click filled card:** removeCountry() clears that slot
