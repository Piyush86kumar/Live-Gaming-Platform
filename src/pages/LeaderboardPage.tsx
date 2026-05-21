/* ================================================================
   FILE: LeaderboardPage.tsx
   ================================================================ */
/* Summary: The post-race leaderboard page that displays the
   winner with laurel wreaths, a top-5 podium, a daily leaderboard
   sidebar, confetti animation, and a restart action. */

import { useNavigate } from 'react-router-dom';
import { Trophy, Timer, RotateCcw } from 'lucide-react';
import { GameBackground } from '@/components/layout/GameBackground';
import { GameHeader } from '@/components/layout/GameHeader';
import { NeonButton } from '@/components/ui/NeonButton';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { GlowText } from '@/components/ui/GlowText';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { useGameStore } from '@/hooks/useGameStore';
import { MOCK_RACE_RESULTS } from '@/data/mockData';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { leaderboard, resetRace } = useGameStore();
  const [showConfetti, setShowConfetti] = useState(true);

  const winnerData = MOCK_RACE_RESULTS[0];
  const topFive = MOCK_RACE_RESULTS.slice(0, 5);
  const navigatingRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const getMedalColor = (rank: number) => {
    if (rank === 1) return '#ffd700';
    if (rank === 2) return '#c0c0c0';
    if (rank === 3) return '#cd7f32';
    return null;
  };

  const handleRestart = useCallback(() => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    resetRace();
    navigate('/lobby');
  }, [resetRace, navigate]);

  return (
    <GameBackground>

      <GameHeader />

      {/* ----- CONFETTI OVERLAY ----- */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#ffd700', '#00d4ff', '#ff00aa', '#22c55e', '#ffffff'][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* ----- MAIN LAYOUT: WINNER + PODIUM + SIDEBAR ----- */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 md:px-8 lg:px-12 pb-4 min-h-0">

        {/* ===== LEFT COLUMN: WINNER + PODIUM + TIMER ===== */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* ----- WINNER SECTION ----- */}
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
                <path d="M10 110 C5 90, 15 70, 10 50 C5 30, 15 15, 10 5" stroke="#ffd700" strokeWidth="2" fill="none"/>
                <ellipse cx="8" cy="100" rx="8" ry="15" fill="#ffd700" opacity="0.7"/>
                <ellipse cx="6" cy="75" rx="7" ry="13" fill="#ffd700" opacity="0.65"/>
                <ellipse cx="10" cy="50" rx="7" ry="12" fill="#ffd700" opacity="0.6"/>
                <ellipse cx="8" cy="27" rx="6" ry="10" fill="#ffd700" opacity="0.55"/>
              </svg>

              {/* Winner flag */}
              <div className="winner-flag">
                <CountryFlag countryCode={winnerData.countryCode} size="full" />
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
              {winnerData.countryName}
            </h1>
          </div>

          {/* ----- PODIUM CARDS (#2–#5) ----- */}
          <div className="podium">
            {topFive.slice(1).map((result) => (
              <div key={result.position} className="podium-card">
                <span className="podium-card__rank">#{result.position}</span>
                <CountryFlag countryCode={result.countryCode} size="md" />
                <span className="podium-card__name">{result.countryName}</span>
              </div>
            ))}
          </div>

          {/* ----- TIMER AND RESTART ----- */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 bg-[rgba(15,23,41,0.9)] border border-[rgba(0,212,255,0.3)] rounded-xl px-4 py-2">
              <Timer className="w-4 h-4 text-[#00d4ff]" />
              <GlowText variant="white" size="sm" className="uppercase tracking-wider">
                Race Reset In
              </GlowText>
              <CountdownTimer seconds={7} onComplete={handleRestart} />
            </div>

            <NeonButton
              variant="primary"
              size="lg"
              onClick={handleRestart}
              icon={<RotateCcw className="w-5 h-5" />}
              className="min-w-[200px]"
            >
              RESTART RACE
            </NeonButton>
          </div>

        </div>

        {/* ===== RIGHT COLUMN: LEADERBOARD SIDEBAR ===== */}
        <div className="leaderboard-sidebar">
          <div className="leaderboard-panel">
            <div className="leaderboard-panel__header">
              <Trophy className="w-5 h-5 text-[#ffd700]" />
              <div className="leaderboard-panel__title">
                Today&apos;s Top <span>Winners</span>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="space-y-2">
                {leaderboard.map((entry) => {
                  const medalColor = getMedalColor(entry.rank);
                  return (
                    <div
                      key={entry.countryCode}
                      className="leaderboard-row"
                    >
                      <div className="leaderboard-row__rank">
                        {medalColor ? (
                          <div className="medal-circle" style={{ borderColor: medalColor }}>
                            <span style={{ color: medalColor }}>{entry.rank}</span>
                          </div>
                        ) : (
                          <span className="rank-number">{entry.rank}</span>
                        )}
                      </div>
                      <div className="leaderboard-row__country">
                        <CountryFlag countryCode={entry.countryCode} size="sm" />
                        <span className="leaderboard-row__name">{entry.countryName}</span>
                      </div>
                      <div className={`leaderboard-row__wins ${entry.rank <= 3 ? 'leaderboard-row__wins--gold' : ''}`}>
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
