# Race of Nations - Project Requirements Document

## 📋 Project Overview

**Project Name:** Race of Nations - Live Interactive Racing Game  
**Version:** 1.0.0 (MVP)  
**Target Platform:** Web Application (Desktop/OBS Browser Source)  
**Budget:** $0 (100% Free - Local Hosting)  
**Timeline:** 3-4 weeks for MVP  

---

## 🎯 Project Goals

### Primary Goal
Create a livestream-driven, country-based virtual racing game where viewers collectively represent their countries and influence a live race in real-time through chat activity.

### Success Criteria
- ✅ Race runs smoothly at 60 FPS with up to 8 countries
- ✅ Chat messages boost racers in real-time (< 2 second delay)
- ✅ Works as OBS Browser Source overlay
- ✅ Admin can configure all game settings
- ✅ Completely free to run locally
- ✅ Can handle 10-50 concurrent viewers for MVP

---

## 🖼️ UI/UX Requirements (Based on Provided Designs)

### Page 1: Lobby Screen (Pre-Race)
**Elements:**
- Title: "Race of Nations" (yellow italic font with shadow)
- Countdown timer: "Race Starting in 00:60" (pink text)
- 8 country slots in 4x2 grid layout
  - Selected countries show: Flag image + Country name
  - Empty slots show: "Team 1", "Team 2", etc.
- Control buttons:
  - "Start Race" (green)
  - "Reset Timer" (red)
- Bottom bar (black background):
  - Text: "Enter your country name/code to boost"
  - 5 country flags with codes: USA, IND, CHN, UK, JPN

**Behavior:**
- Timer counts down from 60 seconds
- Clicking flags adds countries to available slots
- Auto-start race when timer reaches 0
- Manual start allowed anytime

---

### Page 2: Settings Modal - Race Settings Tab
**Elements:**
- Modal with tabs: "Race setting" | "audio"
- Close button (X) in top right
- Settings displayed:
  - Total teams = 8
  - Race Start Timer = 60
  - Race length = 1500
  - Base Speed = 1
  - Boost = 0.1
  - Obstacle = 0.1
  - Race reset timer = 30
  - Reset Leaderboard = 30

**Behavior:**
- All values should be editable (input fields in final version)
- Changes saved immediately
- Applied to next race

---

### Page 3: Settings Modal - Audio Tab
**Elements:**
- Modal with tabs: "Racer setting" | "audio"
- Audio settings displayed:
  - Lobby music = 80 (volume %)
  - Race SFX = 60
  - Race Music = 80
  - Winner Music = 80

**Behavior:**
- Volume sliders (0-100)
- Preview button for each sound
- Changes apply immediately

---

### Page 4: Results Screen
**Elements:**
- Title: "Race of Nations" (yellow italic)
- Winner announcement (center):
  - Spotlight effect with lights
  - Large country flag
  - Text: "Winner is"
  - Podium/stage visual
- Leaderboard panel (right side):
  - Table with columns: "Country" | "Total Wins"
  - Shows historical win counts
  - Current winner highlighted
- Race reset timer: "Race reset in 00:60" (pink text, bottom left)
- Control buttons:
  - "Reset Race" (green)
  - "Reset Timer" (red)
- Bottom bar: Same as lobby (country selection)

**Behavior:**
- Winner announced with animation
- Leaderboard updates automatically
- Auto-reset after 60 seconds (or manual)
- Sound effects play on win

---

### Page 5: Race View (Main Gameplay)
**Elements:**
- Race track (horizontal scrolling view):
  - Crowd/stadium background at top
  - 8 lane gray asphalt track
  - White lane dividers (dashed)
  - Country flags displayed above each lane
  - Cars with country flags on them
  - Obstacles on track (banana, oil, rocks)
  - Checkered finish line on right
  - Checkered flag indicator
- Bottom bar: Same as lobby (country codes)

**Behavior:**
- 60 FPS smooth animation
- Cars move left to right
- Speed based on chat influence
- Collision with obstacles slows cars
- First to finish line wins

---

## 🔧 Technical Requirements

### Functional Requirements

#### FR1: Lobby Phase
- **FR1.1:** Display 60-second countdown timer
- **FR1.2:** Allow country selection via:
  - Clicking flags in bottom bar
  - Typing country codes in chat
- **FR1.3:** Maximum 8 countries per race
- **FR1.4:** Auto-fill empty slots with random countries if needed
- **FR1.5:** Auto-start race when timer reaches 0
- **FR1.6:** Manual start button for admin
- **FR1.7:** Reset timer button

#### FR2: Racing Phase
- **FR2.1:** Display 8 lanes with racers
- **FR2.2:** Each racer starts at position 0
- **FR2.3:** Chat messages boost corresponding country's speed
- **FR2.4:** Apply boost formula: `speed = baseSpeed * (1 + log10(influence + 1) * boostMultiplier)`
- **FR2.5:** Maximum speed cap at 2.5x base speed
- **FR2.6:** Generate 3-5 random obstacles per race
- **FR2.7:** Obstacles slow cars by 20% for 1 second on collision
- **FR2.8:** Detect finish line crossing
- **FR2.9:** Continue race until all finish or 2 minutes elapsed
- **FR2.10:** Show real-time position of all racers

#### FR3: Results Phase
- **FR3.1:** Announce winner with animation
- **FR3.2:** Display final rankings (1st, 2nd, 3rd, etc.)
- **FR3.3:** Show influence (boost points) per country
- **FR3.4:** Update leaderboard (historical wins)
- **FR3.5:** Auto-reset after 30 seconds (configurable)
- **FR3.6:** Manual reset button

#### FR4: Chat Integration (FREE Solution)
- **FR4.1:** Support simulated chat for local testing
- **FR4.2:** Parse country codes from messages (case-insensitive)
- **FR4.3:** Rate limiting: Max 1 message per user per second
- **FR4.4:** Validate country codes against allowed list
- **FR4.5:** Display recent chat messages (last 50)
- **FR4.6:** Work with YouTube Live Chat API (free tier)
- **FR4.7:** Fallback: Manual chat simulator for testing

#### FR5: Admin Controls
- **FR5.1:** Settings modal with tabs
- **FR5.2:** Adjust race parameters:
  - Total teams (1-10)
  - Start timer duration (10-300 seconds)
  - Race length (500-3000 pixels)
  - Base speed (0.5-5)
  - Boost multiplier (0-1)
  - Obstacle frequency (0-1)
- **FR5.3:** Audio controls:
  - Volume sliders for all sounds
  - Mute toggle
- **FR5.4:** Start/stop race manually
- **FR5.5:** Reset race
- **FR5.6:** Reset timer
- **FR5.7:** Clear leaderboard

#### FR6: Leaderboard
- **FR6.1:** Track total wins per country (in-memory)
- **FR6.2:** Display top 10 countries
- **FR6.3:** Persist across races (session only)
- **FR6.4:** Reset button for new session

#### FR7: Audio System
- **FR7.1:** Background music for lobby phase
- **FR7.2:** Background music for racing phase
- **FR7.3:** Winner celebration music
- **FR7.4:** Sound effects:
  - Race start countdown (beep)
  - Speed boost (whoosh)
  - Obstacle collision (crash)
  - Finish line cross (cheer)
- **FR7.5:** Volume controls per sound type
- **FR7.6:** Mute all option

### Non-Functional Requirements

#### NFR1: Performance
- **NFR1.1:** 60 FPS rendering (16.67ms per frame max)
- **NFR1.2:** Chat message processing: < 100ms latency
- **NFR1.3:** WebSocket broadcast: < 50ms to all clients
- **NFR1.4:** Smooth animations (no stuttering)
- **NFR1.5:** Support 10-50 concurrent viewers without lag

#### NFR2: Compatibility
- **NFR2.1:** Works in Chrome, Firefox, Edge (latest versions)
- **NFR2.2:** OBS Studio Browser Source compatible
- **NFR2.3:** Responsive design (1920x1080 primary, 1280x720 minimum)
- **NFR2.4:** No database required (in-memory state)

#### NFR3: Usability
- **NFR3.1:** Intuitive UI (no training needed)
- **NFR3.2:** Clear visual feedback for all actions
- **NFR3.3:** Error messages user-friendly
- **NFR3.4:** Settings changes apply immediately

#### NFR4: Maintainability
- **NFR4.1:** Modular code structure
- **NFR4.2:** Clear comments and documentation
- **NFR4.3:** Consistent naming conventions
- **NFR4.4:** Easy to add new countries
- **NFR4.5:** Easy to add new game modes (future)

#### NFR5: Cost
- **NFR5.1:** $0 hosting cost (local only)
- **NFR5.2:** $0 API costs (YouTube free tier)
- **NFR5.3:** $0 infrastructure (no database, no cloud services)
- **NFR5.4:** All assets free (flags, sounds, images)

---

## 🏗️ System Architecture

### Technology Stack

#### Frontend
- **Framework:** React 18.3+
- **Build Tool:** Vite 5+
- **Language:** JavaScript (can upgrade to TypeScript later)
- **Styling:** Tailwind CSS 3.4+
- **State Management:** React Hooks (useState, useContext)
- **Real-time:** Socket.io Client 4.7+
- **Rendering:** HTML5 Canvas API

#### Backend
- **Runtime:** Node.js 20+ LTS
- **Framework:** Express 4.19+
- **WebSocket:** Socket.io 4.7+
- **Language:** JavaScript
- **Data Storage:** In-memory (JavaScript objects)

#### Chat Integration (FREE)
- **YouTube:** YouTube Live Chat (via browser scraping - FREE alternative)
- **Testing:** Built-in chat simulator
- **Rate Limiting:** In-memory tracking

#### Assets
- **Flags:** Free SVG/PNG from Flagpedia.net
- **Sounds:** Free from Freesound.org or Pixabay
- **Images:** Free from Unsplash or create with Canva

### Project Structure

```
race-of-nations/
├── client/                          # Frontend React app
│   ├── public/
│   │   ├── assets/
│   │   │   ├── flags/              # Country flag images
│   │   │   ├── cars/               # Car sprites
│   │   │   ├── obstacles/          # Obstacle images
│   │   │   └── sounds/             # Audio files
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Lobby.jsx           # Pre-race screen
│   │   │   ├── RaceView.jsx        # Main race canvas
│   │   │   ├── Results.jsx         # Winner announcement
│   │   │   ├── Settings.jsx        # Settings modal
│   │   │   ├── Leaderboard.jsx     # Historical wins
│   │   │   ├── ChatSimulator.jsx   # Testing tool
│   │   │   └── CountryBar.jsx      # Bottom country bar
│   │   │
│   │   ├── hooks/
│   │   │   ├── useSocket.js        # WebSocket connection
│   │   │   ├── useGameState.js     # Race state management
│   │   │   └── useAudio.js         # Audio management
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js        # Game constants
│   │   │   ├── countries.js        # Country data
│   │   │   └── physics.js          # Physics calculations
│   │   │
│   │   ├── context/
│   │   │   └── GameContext.jsx     # Global state
│   │   │
│   │   ├── App.jsx                 # Main app
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                          # Backend Node.js
│   ├── src/
│   │   ├── game/
│   │   │   ├── RaceManager.js      # Main game orchestrator
│   │   │   ├── PhysicsEngine.js    # Movement & collision
│   │   │   ├── InfluenceCalculator.js
│   │   │   └── ObstacleGenerator.js
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatParser.js       # Parse country codes
│   │   │   ├── RateLimiter.js      # Prevent spam
│   │   │   └── YouTubeScraper.js   # FREE chat reader
│   │   │
│   │   ├── socket/
│   │   │   └── handlers.js         # Socket.io events
│   │   │
│   │   ├── config/
│   │   │   └── constants.js        # Server config
│   │   │
│   │   └── server.js               # Entry point
│   │
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── SETUP.md                    # Installation guide
│   ├── API.md                      # Socket.io events
│   └── DEPLOYMENT.md               # OBS setup
│
├── .gitignore
├── README.md
└── package.json                    # Root workspace
```

---

## 📊 Data Models (In-Memory)

### Race State
```javascript
{
  id: 1234567890,
  phase: 'lobby',  // 'lobby' | 'racing' | 'results'
  timer: 60,
  
  // Lobby
  votes: {
    'USA': 15,
    'IND': 8
  },
  selectedCountries: ['USA', 'IND', 'CHN'],
  
  // Racing
  racers: {
    'USA': {
      position: 345.5,      // pixels from start
      lane: 25.3,           // y-position
      speed: 7.2,           // pixels per frame
      baseSpeed: 5,
      finished: false,
      finishTime: null
    }
  },
  obstacles: [
    { x: 200, y: 45, type: 'oil', active: true },
    { x: 600, y: 80, type: 'rock', active: true }
  ],
  influence: {
    'USA': 245,
    'IND': 178
  },
  
  // Results
  rankings: [
    { country: 'USA', position: 1, time: 12345, influence: 245 },
    { country: 'IND', position: 2, time: 12567, influence: 178 }
  ],
  winner: 'USA',
  
  // Meta
  startTime: Date.now(),
  viewers: 12
}
```

### Leaderboard
```javascript
{
  'USA': { wins: 5, races: 10, lastWin: Date.now() },
  'IND': { wins: 3, races: 10, lastWin: Date.now() },
  'CHN': { wins: 2, races: 10, lastWin: Date.now() }
}
```

### Settings
```javascript
{
  race: {
    totalTeams: 8,
    startTimer: 60,
    raceLength: 1500,
    baseSpeed: 1,
    boostMultiplier: 0.1,
    obstacleFrequency: 0.1,
    resetTimer: 30,
    leaderboardResetDays: 30
  },
  audio: {
    lobbyMusic: 80,
    raceSFX: 60,
    raceMusic: 80,
    winnerMusic: 80
  }
}
```

---

## 🔌 API Specification (Socket.io Events)

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `vote_country` | `{ country: 'USA' }` | Vote for country in lobby |
| `start_race` | `{}` | Admin starts race manually |
| `reset_race` | `{}` | Admin resets race |
| `reset_timer` | `{}` | Reset countdown timer |
| `update_settings` | `{ race: {...}, audio: {...} }` | Save settings |
| `chat_message` | `{ message: 'USA', userId: 'abc' }` | Simulated chat |

### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `lobby_started` | `{ timer: 60, countries: [...] }` | Lobby phase began |
| `timer_update` | `{ timer: 45 }` | Countdown tick |
| `votes_update` | `{ votes: {...} }` | Vote counts changed |
| `race_started` | `{ racers: {...}, obstacles: [...] }` | Race began |
| `race_update` | `{ racers: {...}, influence: {...} }` | Frame update (60 FPS) |
| `influence_update` | `{ country: 'USA', total: 245 }` | Chat boost |
| `race_finished` | `{ rankings: [...], winner: 'USA' }` | Race ended |
| `leaderboard_update` | `{ leaderboard: {...} }` | Historical wins updated |
| `settings_updated` | `{ settings: {...} }` | Settings changed |
| `viewer_count` | `{ count: 12 }` | Active viewers |

---

## 🎮 Game Logic Specifications

### Boost Calculation Formula
```javascript
function calculateBoost(influence, boostMultiplier) {
  // Logarithmic scaling prevents spam from being overpowered
  const multiplier = 1 + Math.log10(influence + 1) * boostMultiplier;
  
  // Cap at 2.5x max speed
  return Math.min(multiplier, 2.5);
}

// Examples:
// influence = 0   → 1.0x speed (no boost)
// influence = 10  → 1.1x speed
// influence = 100 → 1.2x speed
// influence = 1000 → 1.3x speed
```

### Collision Detection
```javascript
function checkCollision(racer, obstacle) {
  const dx = racer.position - obstacle.x;
  const dy = racer.lane - obstacle.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Collision if within 30 pixels
  if (distance < 30) {
    racer.speed *= 0.8;  // Slow by 20%
    setTimeout(() => {
      racer.speed /= 0.8;  // Restore after 1 second
    }, 1000);
    obstacle.active = false;  // Remove obstacle
  }
}
```

### Race Completion
```javascript
function checkFinish(racer, raceLength) {
  if (racer.position >= raceLength && !racer.finished) {
    racer.finished = true;
    racer.finishTime = Date.now();
    return true;
  }
  return false;
}
```

---

## 🎨 Asset Requirements

### Country Flags
- **Format:** PNG or SVG
- **Size:** 200x150px minimum
- **Countries:** USA, IND, CHN, UK, JPN, BRA, GER, FRA (expandable)
- **Source:** https://flagpedia.net (free for non-commercial)

### Car Sprites
- **Format:** PNG with transparency
- **Size:** 60x40px
- **Variants:** 8 different colors/styles
- **Source:** Create with Canva or find on OpenGameArt.org

### Obstacles
- **Types:** Oil slick, rock, banana, bomb, lightning
- **Format:** PNG with transparency
- **Size:** 40x40px
- **Source:** Flaticon (free tier) or custom

### Sound Effects
- **Race Start:** 3-2-1 countdown beeps
- **Speed Boost:** Whoosh sound
- **Collision:** Crash/thud
- **Finish:** Crowd cheer
- **Format:** MP3 or OGG
- **Duration:** 1-3 seconds
- **Source:** Freesound.org (CC0 license)

### Background Music
- **Lobby Music:** Upbeat/exciting (30-60 sec loop)
- **Race Music:** Fast-paced/intense (60 sec loop)
- **Winner Music:** Triumphant/celebration (15-30 sec)
- **Format:** MP3 or OGG
- **Source:** Pixabay Music (free) or YouTube Audio Library

---

## 🧪 Testing Requirements

### Functional Testing
- [ ] Lobby timer counts down correctly
- [ ] Country selection works (click and chat)
- [ ] Auto-start triggers at timer=0
- [ ] Manual start button works
- [ ] Racers move at correct speeds
- [ ] Chat messages boost racers
- [ ] Boost formula produces correct values
- [ ] Obstacles appear randomly
- [ ] Collisions slow racers
- [ ] Finish line detection works
- [ ] Rankings calculated correctly
- [ ] Winner announced properly
- [ ] Leaderboard updates
- [ ] Settings save and apply
- [ ] Audio plays correctly
- [ ] Volume controls work

### Performance Testing
- [ ] 60 FPS maintained during race
- [ ] No stuttering with 8 racers
- [ ] Chat messages processed in <100ms
- [ ] WebSocket latency <50ms
- [ ] Smooth with 10 concurrent viewers
- [ ] Memory doesn't leak over 10 races

### Compatibility Testing
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Edge
- [ ] Works in OBS Browser Source
- [ ] Responsive at 1920x1080
- [ ] Responsive at 1280x720

### User Acceptance Testing
- [ ] Stream operator can setup in <5 minutes
- [ ] Viewers understand how to boost
- [ ] Settings are intuitive
- [ ] Race is exciting to watch
- [ ] Winner announcement is satisfying

---

## 📅 Development Timeline (3-4 Weeks)

### Week 1: Foundation
- **Day 1-2:** Project setup, folder structure
- **Day 3-4:** Lobby screen (UI + timer)
- **Day 5-6:** Settings modal (both tabs)
- **Day 7:** WebSocket connection + testing

### Week 2: Core Gameplay
- **Day 8-9:** Race canvas rendering
- **Day 10-11:** Physics engine + movement
- **Day 12-13:** Influence system + chat
- **Day 14:** Obstacle generation + collision

### Week 3: Polish & Features
- **Day 15-16:** Results screen + leaderboard
- **Day 17-18:** Audio system
- **Day 19-20:** Chat integration (YouTube scraper)
- **Day 21:** Admin controls finalization

### Week 4: Testing & Documentation
- **Day 22-23:** Bug fixes + performance optimization
- **Day 24-25:** OBS setup testing
- **Day 26-27:** Documentation + video tutorial
- **Day 28:** Final testing + launch prep

---

## 🚀 Deployment Strategy (Local Hosting - FREE)

### For Development/Testing
```bash
# Terminal 1: Start backend
cd server
npm run dev  # Runs on http://localhost:3000

# Terminal 2: Start frontend
cd client
npm run dev  # Runs on http://localhost:5173
```

### For Streaming (Local Network)
```bash
# Get your local IP
# Windows: ipconfig
# Mac/Linux: ifconfig

# Access from OBS on same computer:
# http://localhost:5173/overlay

# Access from another device:
# http://192.168.1.X:5173/overlay
```

### OBS Browser Source Setup
1. Add Source → Browser
2. URL: `http://localhost:5173/overlay`
3. Width: 1920, Height: 1080
4. Check: "Shutdown source when not visible"
5. Check: "Refresh browser when scene becomes active"

---

## 📦 Deliverables

### Code
- [ ] Complete React frontend
- [ ] Complete Node.js backend
- [ ] Socket.io integration
- [ ] Chat simulator
- [ ] YouTube scraper (free alternative)
- [ ] All UI components matching designs
- [ ] Audio system

### Documentation
- [ ] README.md (project overview)
- [ ] SETUP.md (installation guide)
- [ ] API.md (Socket.io events)
- [ ] DEPLOYMENT.md (OBS instructions)
- [ ] REQUIREMENTS.md (this document)

### Assets
- [ ] 8 country flags
- [ ] Car sprites
- [ ] Obstacle images
- [ ] Sound effects (5+)
- [ ] Background music (3 tracks)

### Testing
- [ ] Test coverage report
- [ ] Performance benchmarks
- [ ] Browser compatibility matrix

---

## 🔒 Security Considerations

### Rate Limiting
- Max 1 message per user per second
- Max 10 votes per IP in lobby
- Max 100 WebSocket messages per minute per client

### Input Validation
- Country codes: 2-3 uppercase letters only
- Settings values: Within min/max ranges
- Chat messages: Max 100 characters

### Data Privacy
- No user data stored persistently
- No cookies or tracking
- All data cleared on server restart

---

## 🎓 Learning Resources for Developers

### If New to React
1. React Official Tutorial: https://react.dev/learn
2. FreeCodeCamp React Course (8h): https://www.youtube.com/watch?v=bMknfKXIFA8

### If New to Node.js
1. Node.js Crash Course: https://www.youtube.com/watch?v=fBNz5xF-Kx4
2. Express.js Tutorial: https://www.youtube.com/watch?v=L72fhGm1tfE

### If New to Socket.io
1. Socket.io Docs: https://socket.io/docs/v4/
2. Real-time App Tutorial: https://www.youtube.com/watch?v=ZKEqqIO7n-k

### Canvas API
1. Canvas Tutorial: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
2. Game Development: https://www.youtube.com/watch?v=eI9idPTT0c4

---

## 📞 Support & Community

### Issues & Bugs
- Use GitHub Issues for bug reports
- Provide: Browser version, Node version, steps to reproduce

### Feature Requests
- Open GitHub Discussion
- Explain use case and benefit

### Contributing
- Fork repository
- Create feature branch
- Submit pull request with tests

---

## 🎉 Future Enhancements (Post-MVP)

### Phase 2 (After successful MVP)
- [ ] Persistent database (PostgreSQL)
- [ ] Global historical leaderboard
- [ ] User accounts for viewers