/* ================================================================
   FILE: LeaderboardPage.tsx
   ================================================================ */
/* Summary: The post-race leaderboard page that displays the
   winner with laurel wreaths, a top-5 podium, a daily leaderboard
   sidebar, confetti animation, and a restart action. */

import { useNavigate } from 'react-router-dom';          /* Hook for programmatic page navigation */
import { Trophy, Timer, RotateCcw } from 'lucide-react'; /* Icon components for UI elements */
import { GameBackground } from '@/components/layout/GameBackground'; /* Full-page stadium background wrapper */
import { GameHeader } from '@/components/layout/GameHeader';         /* Shared game header with nav links */
import { NeonButton } from '@/components/ui/NeonButton';             /* Neon-styled button component */
import { CountryFlag } from '@/components/ui/CountryFlag';           /* Reusable country flag image */
import { GlowText } from '@/components/ui/GlowText';                 /* Text component with glow effect */
import { CountdownTimer } from '@/components/ui/CountdownTimer';     /* Reusable countdown display */
import { useGameStore } from '@/hooks/useGameStore';    /* Zustand store for all game state */
import { MOCK_RACE_RESULTS } from '@/data/mockData';    /* Mock race result data for demonstration */
import { useEffect, useState } from 'react';            /* React hooks for side effects and local state */

/* ===== LEADERBOARD PAGE COMPONENT ===== */
/* Summary: Composes the winner section, podium cards, timer, restart button, and daily leaderboard sidebar. */
export default function LeaderboardPage() {
  const navigate = useNavigate();                                                      /* Navigation helper for route changes */
  const { leaderboard, resetRace } = useGameStore();                                   /* Destructure store: leaderboard entries & reset action */
  const [showConfetti, setShowConfetti] = useState(true);                              /* Local toggle for confetti visibility */

  const winnerData = MOCK_RACE_RESULTS[0];                                             /* The first-place result (winner) */
  const topFive = MOCK_RACE_RESULTS.slice(0, 5);                                      /* Top 5 results for podium display */

  /* ===== SIDE EFFECTS ===== */
  /* Summary: Automatically hide confetti after a delay. */
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000); /* Hide confetti after 4 seconds */
    return () => clearTimeout(timer);                             /* Cleanup: clear the timer on unmount */
  }, []);

  /* ===== HELPER FUNCTIONS ===== */
  /* Summary: Small utility functions used during rendering. */

  /* getMedalColor: Returns a hex colour for gold/silver/bronze medals, or null for other ranks */
  const getMedalColor = (rank: number) => {
    if (rank === 1) return '#ffd700';  /* Gold for 1st place */
    if (rank === 2) return '#c0c0c0';  /* Silver for 2nd place */
    if (rank === 3) return '#cd7f32';  /* Bronze for 3rd place */
    return null;                        /* No medal colour for lower ranks */
  };

  /* handleRestart: Reset the game state and navigate back to the lobby */
  const handleRestart = () => {
    resetRace();    /* Clear race/leaderboard state in the store */
    navigate('/lobby'); /* Redirect the browser to the lobby route */
  };

  /* ===== RENDER: LEADERBOARD PAGE LAYOUT ===== */
  /* Summary: JSX structure — confetti overlay, winner section with laurels, podium, countdown timer, and sidebar. */
  return (
    <GameBackground>                                        /* Full-page gradient background wrapper */

      <GameHeader />                                        /* Shared header with navigation icons */

      {/* ----- CONFETTI OVERLAY ----- */}
      {/* Summary: Renders 60 falling confetti pieces for a celebration effect. */}
      {showConfetti && (                                    /* Only render confetti while the flag is true */
        <div className="confetti-container">                /* Full-screen container positioning confetti absolutely */
          {Array.from({ length: 60 }).map((_, i) => (       /* Generate 60 confetti pieces */
            <div
              key={i}                                       /* Unique key per piece */
              className="confetti-piece"                    /* Individual confetti element styled in CSS */
              style={{
                left: `${Math.random() * 100}%`,            /* Random horizontal position across viewport width */
                backgroundColor: ['#ffd700', '#00d4ff', '#ff00aa', '#22c55e', '#ffffff'][Math.floor(Math.random() * 5)], /* Random colour from palette */
                animationDelay: `${Math.random() * 2}s`,    /* Stagger start times up to 2 seconds */
                animationDuration: `${2 + Math.random() * 2}s`, /* Vary fall duration between 2–4 seconds */
              }}
            />
          ))}
        </div>
      )}

      {/* ----- MAIN LAYOUT: WINNER + PODIUM + SIDEBAR ----- */}
      {/* Summary: Flex layout splitting into left (winner/podium/timer) and right (daily leaderboard sidebar). */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 md:px-8 lg:px-12 pb-4 min-h-0">

        {/* ===== LEFT COLUMN: WINNER + PODIUM + TIMER ===== */}
        {/* Summary: Contains the winner display, podium cards for 2nd–5th, and the restart controls. */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* ----- WINNER SECTION ----- */}
          {/* Summary: Large centered display of the 1st-place country with laurel wreath SVGs. */}
          <div className="winner-section">

            {/* "WINNER IS" title */}
            <div className="winner-title">
              <GlowText variant="white" size="2xl" className="uppercase tracking-[0.15em] italic">
                WINNER IS
              </GlowText>
            </div>

            {/* Winner display: laurel SVGs flanking the flag */}
            <div className="winner-display">
              {/* Left laurel wreath SVG */}
              <svg className="laurel laurel--left" viewBox="0 0 60 120" fill="none">
                <path d="M10 110 C5 90, 15 70, 10 50 C5 30, 15 15, 10 5" stroke="#ffd700" strokeWidth="2" fill="none"/>  /* Curved branch path */
                <ellipse cx="8" cy="100" rx="8" ry="15" fill="#ffd700" opacity="0.7"/>   /* Bottom leaf */
                <ellipse cx="6" cy="75" rx="7" ry="13" fill="#ffd700" opacity="0.65"/>    /* Middle leaf */
                <ellipse cx="10" cy="50" rx="7" ry="12" fill="#ffd700" opacity="0.6"/>    /* Upper-middle leaf */
                <ellipse cx="8" cy="27" rx="6" ry="10" fill="#ffd700" opacity="0.55"/>    /* Top leaf */
              </svg>

              {/* Winner flag */}
              <div className="winner-flag">
                <CountryFlag countryCode={winnerData.countryCode} size="full" /> /* Full-size flag of the winner */
              </div>

              {/* Right laurel wreath SVG (mirrored coordinates) */}
              <svg className="laurel laurel--right" viewBox="0 0 60 120" fill="none">
                <path d="M50 110 C55 90, 45 70, 50 50 C55 30, 45 15, 50 5" stroke="#ffd700" strokeWidth="2" fill="none"/>
                <ellipse cx="52" cy="100" rx="8" ry="15" fill="#ffd700" opacity="0.7"/>
                <ellipse cx="54" cy="75" rx="7" ry="13" fill="#ffd700" opacity="0.65"/>
                <ellipse cx="50" cy="50" rx="7" ry="12" fill="#ffd700" opacity="0.6"/>
                <ellipse cx="52" cy="27" rx="6" ry="10" fill="#ffd700" opacity="0.55"/>
              </svg>
            </div>

            {/* Winner country name */}
            <h1 className="winner-name">
              {winnerData.countryName}                       /* Full country name of the winner */
            </h1>
          </div>

          {/* ----- PODIUM CARDS (#2–#5) ----- */}
          {/* Summary: Horizontal row of cards for positions 2 through 5. */}
          <div className="podium">
            {topFive.slice(1).map((result) => (             /* Skip index 0 (winner), map the rest to podium cards */
              <div key={result.position} className="podium-card">
                <span className="podium-card__rank">#{result.position}</span> /* Rank number with hash prefix */
                <CountryFlag countryCode={result.countryCode} size="md" />    /* Country flag at medium size */
                <span className="podium-card__name">{result.countryName}</span> /* Country name */
              </div>
            ))}
          </div>

          {/* ----- TIMER AND RESTART ----- */}
          {/* Summary: Countdown timer auto-restarting the race and a manual restart button. */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 bg-[rgba(15,23,41,0.9)] border border-[rgba(0,212,255,0.3)] rounded-xl px-4 py-2"> /* Semi-transparent dark pill */
              <Timer className="w-4 h-4 text-[#00d4ff]" />                    /* Timer icon in cyan */
              <GlowText variant="white" size="sm" className="uppercase tracking-wider">
                Race Reset In                                                  /* Label text */
              </GlowText>
              <CountdownTimer seconds={7} onComplete={handleRestart} />       /* Auto-restart countdown (7 seconds) */
            </div>

            <NeonButton                                                       /* Manual restart button */
              variant="primary"
              size="lg"
              onClick={handleRestart}
              icon={<RotateCcw className="w-5 h-5" />}                       /* Refresh icon */
              className="min-w-[200px]"
            >
              RESTART RACE
            </NeonButton>
          </div>

        </div>

        {/* ===== RIGHT COLUMN: LEADERBOARD SIDEBAR ===== */}
        {/* Summary: Daily leaderboard panel showing ranked entries with medal styling for top 3. */}
        <div className="leaderboard-sidebar">
          <div className="leaderboard-panel">
            <div className="leaderboard-panel__header">
              <Trophy className="w-5 h-5 text-[#ffd700]" />                   /* Gold trophy icon in header */
              <div className="leaderboard-panel__title">
                Today&apos;s Top <span>Winners</span>                         /* Sidebar title */
              </div>
            </div>

            <div className="flex-1 overflow-hidden">                          /* Scrollable list container */
              <div className="space-y-2">
                {leaderboard.map((entry) => {                                 /* Iterate over all leaderboard entries */
                  const medalColor = getMedalColor(entry.rank);               /* Resolve medal colour (gold/silver/bronze) or null */
                  return (
                    <div
                      key={entry.countryCode}                                 /* Unique key per country entry */
                      className="leaderboard-row"                             /* Single entry row */
                    >
                      <div className="leaderboard-row__rank">                 /* Rank display cell */
                        {medalColor ? (                                       /* Top 3: rendered as a coloured circle with rank number */
                          <div className="medal-circle" style={{ borderColor: medalColor }}>
                            <span style={{ color: medalColor }}>{entry.rank}</span>
                          </div>
                        ) : (                                                 /* 4th+ : plain numeric rank */
                          <span className="rank-number">{entry.rank}</span>
                        )}
                      </div>
                      <div className="leaderboard-row__country">              /* Country display cell: flag + name */
                        <CountryFlag countryCode={entry.countryCode} size="sm" />
                        <span className="leaderboard-row__name">{entry.countryName}</span>
                      </div>
                      <div className={`leaderboard-row__wins ${entry.rank <= 3 ? 'leaderboard-row__wins--gold' : ''}`}> /* Wins count, gold accent for top 3 */
                        {entry.wins}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </GameBackground>
  );
}
