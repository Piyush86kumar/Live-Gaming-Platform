import { useNavigate } from 'react-router-dom';
import { Trophy, Timer } from 'lucide-react';
import { GameHeader } from '@/components/layout/GameHeader';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { useGameStore } from '@/hooks/useGameStore';
import { MOCK_RACE_RESULTS } from '@/data/mockData';
import { useCallback, useEffect, useRef, useState } from 'react';

const RANK_STYLES: Record<number, { bg: string; border: string }> = {
  1: { bg: '#ffd700', border: '#b45309' },
  2: { bg: '#c0c0c0', border: '#6b7280' },
  3: { bg: '#cd7f32', border: '#92400e' },
};

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { leaderboard, resetRace } = useGameStore();
  const [showConfetti, setShowConfetti] = useState(true);
  const navigatingRef = useRef(false);

  const winnerData = MOCK_RACE_RESULTS[0];
  const topFive = MOCK_RACE_RESULTS.slice(0, 5);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleRestart = useCallback(() => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    resetRace();
    navigate('/lobby');
  }, [resetRace, navigate]);

  return (
    <div className="leaderboard-page-root">
      {/* Stadium lights */}
      <div className="lb-stadium-light lb-stadium-light--tl" />
      <div className="lb-stadium-light lb-stadium-light--tr" />

      {/* Checkered floor */}
      <div className="lb-checkered-floor" />

      {/* Header — Home & Settings only, no title */}
      <GameHeader showTitle={false} />

      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: (['#00d4ff', '#ffd700', '#ff00aa', '#22c55e', '#ffffff'] as const)[Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 2.5}s`,
                animationDuration: `${2.5 + Math.random() * 1.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main wrapper */}
      <div className="lb-main">

        {/* Left column */}
        <div className="lb-left-col">

          {/* Winner section */}
          <div className="lb-winner-section">
            <h2 className="lb-winner-title">WINNER IS</h2>

            <div className="lb-winner-card-wrapper">
              <div className="lb-winner-card">
                <div className="lb-winner-card-inner">
                  <CountryFlag countryCode={winnerData.countryCode} size="full" className="lb-winner-flag" />
                </div>
              </div>
            </div>

            <h1 className="lb-winner-name">{winnerData.countryName}</h1>
          </div>

          {/* Podium */}
          <div className="lb-podium">
            {topFive.slice(1).map((result) => (
              <div key={result.position} className="lb-podium-card">
                <span className="lb-podium-rank">#{result.position}</span>
                <CountryFlag countryCode={result.countryCode} size="podium" className="lb-podium-flag" />
                <span className="lb-podium-name">{result.countryName}</span>
              </div>
            ))}
          </div>

          {/* Timer + Restart */}
          <div className="lb-timer-row">
            <div className="lb-timer-pill">
              <Timer size={18} className="shrink-0 text-[#00d4ff]" />
              <span className="text-white uppercase font-heading font-semibold text-sm tracking-[0.06em]">Race Reset In</span>
              <CountdownTimer seconds={30} onComplete={handleRestart} />
            </div>

            <button onClick={handleRestart} className="lb-restart-btn">
              <CountryFlag countryCode={winnerData.countryCode} size="xs" className="lb-restart-flag" />
              <span>RESTART RACE</span>
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="lb-sidebar">
          <div className="lb-sidebar-panel">
            <div className="lb-sidebar-header">
              <Trophy size={22} className="shrink-0 text-[#ffd700] fill-[#ffd700]" />
              <span className="lb-sidebar-title">
                TODAY'S TOP <span className="text-[#ffd700]">WINNERS</span>
                <span className="lb-sidebar-slash">//</span>
              </span>
            </div>

            <div className="lb-sidebar-col-headers">
              <span>RANK</span>
              <span>COUNTRY</span>
              <span>WINS</span>
            </div>

            <div className="lb-sidebar-list">
              {leaderboard.slice(0, 10).map((entry) => {
                const rs = RANK_STYLES[entry.rank];
                return (
                  <div key={entry.countryCode} className={`lb-row ${entry.rank <= 3 ? 'lb-row--top' : ''}`}>
                    <div className="lb-row-rank">
                      {rs ? (
                        <div className="lb-medal" style={{ background: rs.bg, borderColor: rs.border }}>
                          <span style={{ color: '#000', fontWeight: 800, fontSize: 13, fontFamily: "'Barlow Condensed',sans-serif" }}>{entry.rank}</span>
                        </div>
                      ) : (
                        <span className="lb-rank-plain">{entry.rank}</span>
                      )}
                    </div>
                    <div className="lb-row-country">
                      <CountryFlag countryCode={entry.countryCode} size="sm" className="lb-row-flag" />
                      <span className="lb-row-name">{entry.countryName}</span>
                    </div>
                    <span className={`lb-row-wins ${entry.rank <= 3 ? 'text-[#ffd700]' : ''}`}>{entry.wins}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
