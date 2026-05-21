# Leaderboard Design Spec

## 1. Layout
- **Background:** Full-bleed stadium racing scene. Dark asphalt track center, blurred crowd/stadium lights at top-left and top-right edges (blue/white spotlights). Bottom 15% of viewport: black-and-white checkered racing flag pattern (repeating 20px squares, opacity 0.25).
- **Header:** Fixed top bar, height 64px, flex row, justify-between, align-center, px-6. Centered title "RACE OF NATIONS" (see Typography). Left: home icon button. Right: settings icon button.
- **Main wrapper:** mt-16, flex-1, flex row, gap-6, px-6, pb-6, min-h-0, overflow-hidden.
- **Left/Center column (flex: 1):** flex column, align-items center, justify-start, gap-4, pt-4.
  - Winner section: flex column, align-items center, position relative.
  - Podium: flex row, gap-4, justify-center, mt-2.
  - Timer + Restart: flex column, align-items center, gap-3, mt-4.
- **Right sidebar:** width 360px, flex-shrink 0, height calc(100vh - 80px), overflow-y auto.

## 2. Colors
| Token | Hex/RGBA | Usage |
|-------|----------|-------|
| bg-primary | #050b14 | Deepest background fallback |
| bg-panel | rgba(10,22,40,0.92) | Sidebar panel |
| bg-card | #0d1f3c | Podium cards, winner card bg |
| neon-cyan | #00d4ff | Borders, glows, rank numbers |
| neon-cyan-glow | rgba(0,212,255,0.5) | Outer glows |
| neon-blue | #3b82f6 | Winner name 3D shadow layer |
| neon-pink | #ff00aa | Countdown digits |
| gold | #ffd700 | Top-3 accents, wins, trophy, laurels |
| gold-border | rgba(255,215,0,0.35) | Sidebar top border, winner accents |
| silver | #c0c0c0 | Rank 2 medal |
| bronze | #cd7f32 | Rank 3 medal |
| chrome-text | #e2e8f0 | Winner name base (metallic) |
| text-primary | #ffffff | Body text, country names |
| text-muted | #64748b | Rank 4+, headers, secondary |
| text-wins-top3 | #ffd700 | Wins column rank 1-3 |
| text-wins-other | #94a3b8 | Wins column rank 4+ |
| border-subtle | rgba(255,255,255,0.08) | Default dividers |

## 3. Typography
| Element | Font | Size | Weight | Letter-spacing | Color / Effect |
|---------|------|------|--------|----------------|----------------|
| "RACE OF NATIONS" | Barlow Condensed | clamp(1.4rem,2.4vw,2.2rem) | 800 | 0.12em | #ffffff, italic, uppercase, text-shadow: 0 0 12px rgba(0,212,255,0.6) |
| "WINNER IS" | Barlow Condensed | clamp(1.6rem,3vw,2.4rem) | 700 | 0.08em | #ffffff, italic, uppercase, text-shadow: 0 0 16px rgba(59,130,246,0.8), 0 0 4px rgba(255,255,255,0.9) |
| "ARGENTINA" (winner) | Barlow Condensed | clamp(2.8rem,5.5vw,4.2rem) | 900 | 0.04em | #e2e8f0, italic, uppercase, text-shadow: 0 2px 0 #2563eb, 0 4px 0 #1d4ed8, 0 6px 0 #1e40af, 0 0 24px rgba(59,130,246,0.4) |
| Podium rank "#N" | Barlow Condensed | clamp(0.9rem,1.2vw,1.1rem) | 700 | normal | #00d4ff |
| Podium country | Barlow Condensed | clamp(0.7rem,0.9vw,0.85rem) | 700 | 0.02em | #ffffff, uppercase |
| Sidebar title | Barlow Condensed | clamp(0.85rem,1.1vw,1rem) | 700 | 0.08em | "TODAY'S TOP" #ffffff, "WINNERS" #ffd700, both uppercase |
| Sidebar headers | Barlow Condensed | 11px | 600 | 0.1em | #64748b, uppercase |
| Sidebar country | Barlow Condensed | 14px | 600 | normal | #ffffff |
| Sidebar wins | Barlow Condensed | 14px | 700 | normal | #ffd700 (top3) / #94a3b8 (4+) |
| Medal text | Barlow Condensed | 13px | 800 | normal | #000000 |
| Timer label | Rajdhani | 14px | 700 | 0.06em | #ffffff |
| Countdown digits | Barlow Condensed | clamp(1.3rem,2vw,1.8rem) | 700 | tabular-nums | #ff00aa |
| Restart button | Barlow Condensed | 16px | 700 | 0.06em | #ffffff, uppercase |

## 4. Spacing
- Base unit: 4px.
- Header px: 24px.
- Main wrapper gap: 24px; px: 24px; pb: 24px.
- Winner section pt: 16px.
- Winner card max-width: 380px.
- Laurels offset from card: ±50px horizontal, vertically centered.
- Podium gap: 16px.
- Podium card width: 140px; padding: 14px 10px.
- Timer pill padding: 10px 24px.
- Restart button padding: 14px 40px; min-width: 220px.
- Sidebar padding: 20px.
- Sidebar row padding: 14px 12px; gap: 16px.
- Medal circle: 32px x 32px.

## 5. Components

### GameHeader
- **Box:** h-16, w-full, flex row, justify-between, align-center, px-6, fixed top-0, z-50.
- **Background:** transparent (relies on page bg).
- **Left/Right buttons:** w-10 h-10, rounded-xl, bg rgba(255,255,255,0.05), border 1px solid rgba(255,255,255,0.1), flex center, hover:bg rgba(255,255,255,0.1).
- **Icons:** lucide Home, Settings, size 20px, color #ffffff.

### Winner Flag Card
- **Box:** relative, w-full max-w-[380px], aspect-ratio 3/2, border-radius 16px, overflow hidden.
- **Border:** 2px solid rgba(0,212,255,0.6).
- **Shadow:** box-shadow: 0 0 0 1px rgba(0,212,255,0.2), 0 0 30px rgba(0,212,255,0.35), inset 0 0 20px rgba(0,212,255,0.08).
- **Flag image:** object-fit cover, width 100%, height 100%.
- **Position:** centered in winner section.

### Golden Laurels (SVG)
- **Box:** absolute, top 50%, transform translateY(-50%), width 70px, height 150px, z-index 0 (behind card).
- **Left laurel:** left -55px.
- **Right laurel:** right -55px, scaleX(-1).
- **Filter:** drop-shadow(0 0 15px rgba(255,215,0,0.6)).
- **Leaves:** fill #ffd700, opacity 0.85 bottom to 0.6 top.

### "WINNER IS" Text
- **Position:** centered above winner card, mb-3.
- **Style:** see Typography table.

### "ARGENTINA" Winner Name
- **Position:** centered below winner card, mt-3, text-align center.
- **Style:** see Typography table (3D chrome effect via stacked blue shadows).

### Podium Card
- **Box:** w-[140px], flex column, align-items center, gap-2, padding 14px 10px, border-radius 12px.
- **Background:** #0d1f3c.
- **Border:** 2px solid rgba(0,212,255,0.35).
- **Shadow:** box-shadow: 0 0 15px rgba(0,212,255,0.15).
- **Flag:** w-[80px], h-[55px], border-radius 4px, object-fit cover, box-shadow 0 2px 8px rgba(0,0,0,0.4).

### Timer Pill
- **Box:** inline-flex, align-items center, gap-2, px-6, py-2.5, rounded-full.
- **Background:** rgba(13,25,48,0.95).
- **Border:** 1px solid rgba(0,212,255,0.3).
- **Icon:** lucide Timer, size 18px, color #00d4ff.
- **Text:** "RACE RESET IN" #ffffff, digits "00:07" #ff00aa (no brackets).

### Restart Button (NeonButton)
- **Box:** inline-flex, align-items center, justify-center, gap-3, min-w-[220px], px-10, py-3.5, rounded-xl.
- **Background:** linear-gradient(180deg, #22c55e 0%, #16a34a 100%).
- **Border:** 2px solid rgba(74,222,128,0.5).
- **Shadow:** box-shadow: 0 0 0 1px rgba(34,197,94,0.2), 0 0 24px rgba(34,197,94,0.35).
- **Icon:** winner's flag image, w-6 h-4, rounded-sm, object-fit cover, border 1px solid rgba(255,255,255,0.3).
- **Text:** "RESTART RACE" (see Typography).
- **Hover:** brightness(1.1), shadow intensifies to 0 0 30px rgba(34,197,94,0.5).

### Sidebar Panel
- **Box:** w-full, h-full, flex column, border-radius 16px, overflow hidden.
- **Background:** rgba(10,22,40,0.92).
- **Backdrop-filter:** blur(12px).
- **Border:** 1px solid rgba(0,212,255,0.15), top border 2px solid rgba(255,215,0,0.35).
- **Shadow:** box-shadow: 0 0 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05).

### Sidebar Title Row
- **Box:** flex row, align-items center, gap-3, px-5, pt-5, pb-4, border-bottom 1px solid rgba(255,255,255,0.06).
- **Icon:** lucide Trophy, size 22px, color #ffd700, fill #ffd700 (solid gold).
- **Text:** "TODAY'S TOP" (white) + "WINNERS" (gold) in same line.
- **Decoration:** after "WINNERS", two cyan slashes "//" in #00d4ff, font-weight 700, ml-1.

### Sidebar Column Headers
- **Box:** grid, cols: 44px 1fr 50px, gap-3, px-3, py-3, mb-1.
- **Text:** "RANK", "COUNTRY", "WINS" — see Typography.

### Leaderboard Row
- **Box:** grid, cols: 44px 1fr 50px, gap-3, align-items center, px-3, py-3, border-radius 10px.
- **Background:** transparent default.
- **State:hover:** bg rgba(0,212,255,0.06).
- **State:nth-child(-n+3):** bg rgba(255,215,0,0.04).

### Rank Display (Conditional)
- **Ranks 1–3:** Medal circle, 32px diameter, border-radius 50%, flex center, border 2px solid:
  - Rank 1: bg #ffd700, border #b45309.
  - Rank 2: bg #c0c0c0, border #6b7280.
  - Rank 3: bg #cd7f32, border #92400e.
  - Text: 13px, weight 800, color #000000.
- **Ranks 4+:** Plain text, 16px, weight 700, color #64748b, no circle, text-align center.

### Country Cell
- **Flag:** w-8 h-5.5 (32x22), rounded-sm, object-fit cover, border 1px solid rgba(255,255,255,0.1).
- **Name:** see Typography, single line, truncate with ellipsis if overflow.

### Wins Cell
- **Text-align:** right.
- **Color:** #ffd700 for ranks 1–3; #94a3b8 for ranks 4+.

### Confetti Container
- **Position:** fixed, inset 0, pointer-events none, z-index 100, overflow hidden.

### Confetti Piece
- **Shape:** rect, width 8px, height 8px (or 6x12), border-radius 1px.
- **Colors:** #00d4ff, #ffd700, #ff00aa, #22c55e, #ffffff.
- **Animation:** confetti-fall 3.5s ease-out forwards.
- **Count:** 50 pieces.
- **Stagger:** delay 0–2.5s random, duration 2.5–4s random.

## 6. Effects & Motion
- **Winner reveal:** .winner-name opacity 0→1, transform scale(0.85)→scale(1), duration 0.7s, ease-out, delay 0.2s after mount.
- **Winner card glow:** pulsing border-glow animation, 3s infinite alternate, box-shadow from 0 0 20px to 0 0 40px rgba(0,212,255,0.5).
- **Confetti fall:** translateY(-20px)→translateY(110vh), rotate(0)→rotate(720deg), opacity 1→0.
- **Row hover:** background-color 0.15s ease.
- **Countdown urgency:** when timeLeft &lt;= 5, digits animate-pulse (1s infinite).
- **Restart button hover:** transform scale(1.02), transition 0.15s ease.

## 7. Assets
- **Flags:** winner size 380x253 (3:2), podium 80x55, sidebar 32x22, restart button 24x16.
- **Flag component:** `CountryFlag` with size prop ("full" | "podium" | "sm" | "xs").
- **Icons:** lucide-react (Home, Settings, Trophy, Timer, RotateCcw optional).
- **Laurels:** inline SVG, no external file.

## 8. Shared Elements
- **Header:** unique to this screen — contains "RACE OF NATIONS" title (not present on other screens in this form; other screens may use simpler GameHeader).
- **CountdownTimer:** 7 seconds, auto-navigates to /lobby on complete.
- **GlowText:** not used as a separate component here; text shadows are inline per element.

## 9. Flow
- **Route:** /leaderboard
- **Entry:** from /race via handleFinishRace.
- **Data:** winner = MOCK_RACE_RESULTS[0]; podium = MOCK_RACE_RESULTS.slice(1,5); sidebar = MOCK_RACE_RESULTS.slice(0,10).
- **Auto-exit:** CountdownTimer 7s → navigate('/lobby').
- **Manual exit:** Restart button → resetRace() → navigate('/lobby').
- **Nav guard:** navigatingRef boolean prevents double-push.

## Visual Notes
- **Checkered floor:** CSS `repeating-conic-gradient(#ffffff 0% 25%, #000000 0% 50%)` sized 40px 40px, positioned at bottom, height 120px, mask-image linear-gradient(to top, black, transparent).
- **Stadium lights:** radial-gradient white/blue glows at top corners (opacity 0.15), blur 60px.
- **Winner card inner sheen:** pseudo-element with linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, transparent 50%), animate 4s infinite.
- **Sidebar scrollbar:** width 6px, thumb rgba(255,255,255,0.15), track transparent.
- **Medal circles:** must be perfectly round and centered; number vertically/horizontally centered.
- **Top-3 wins:** always gold regardless of tie values.