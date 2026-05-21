/* ================================================================
   FILE: RacePage.tsx
   ================================================================ */
/* Summary: The live race page showing participants on a track,
   car sprites with position progress, a boost/vote panel, and a
   finish button that transitions to the leaderboard. */

import { useState } from 'react';                        /* React hook for local component state */
import { useNavigate } from 'react-router-dom';          /* Hook for programmatic page navigation */
import { Crown } from 'lucide-react';                    /* Icon components for UI elements */
import { GameHeader } from '@/components/layout/GameHeader';     /* Shared header with navigation buttons */
import { useGameStore } from '@/hooks/useGameStore';     /* Zustand store for all game state */
import { MOCK_VOTES } from '@/data/mockData';            /* Mock vote data for demonstration */

/* ===== RACE PAGE COMPONENT ===== */
/* Summary: Displays the race track with lanes, car sprites, a vote-to-boost panel, and finish action. */
export default function RacePage() {
  const navigate = useNavigate();                                                    /* Navigation helper for route changes */
  const { raceParticipants, voteForCountry } = useGameStore();                       /* Destructure store: participant list & vote action */
  const [votes, setVotes] = useState<Record<string, number>>(                       /* Local state tracking vote counts per country */
    Object.fromEntries(
      Object.entries(MOCK_VOTES).map(([k, v]) => [k.toLowerCase(), v])              /* Normalise mock vote keys to lowercase */
    )
  );
  const [boostingCar, setBoostingCar] = useState<string | null>(null);              /* Tracks which car is currently flashing "boosted" */

  const sortedByPosition = [...raceParticipants].sort((a, b) => a.position - b.position); /* Sort participants by race position (1st first) */
  const leader = sortedByPosition[0];                                                /* The current race leader (first in sorted list) */

  /* ===== EVENT HANDLERS ===== */
  /* Summary: Functions that respond to user interactions on the page. */

  /* handleVote: Cast a vote for a country, incrementing its vote count and triggering a boost animation */
  const handleVote = (countryCode: string) => {
    voteForCountry(countryCode);                                 /* Dispatch vote action to the store */
    setVotes(prev => ({                                          /* Increment the local vote tally for this country */
      ...prev,
      [countryCode]: (prev[countryCode] || 0) + 1                /* Default to 0 if no prior votes, then +1 */
    }));
    setBoostingCar(countryCode);                                  /* Set this country as currently boosting (triggers visual flash) */
    setTimeout(() => setBoostingCar(null), 300);                  /* Clear the boost visual after 300ms */
  };

  /* handleFinishRace: Navigate to the leaderboard page when the race ends */
  const handleFinishRace = () => {
    navigate('/leaderboard');                                     /* Redirect to the results / leaderboard page */
  };

  /* ===== RENDER: RACE PAGE LAYOUT ===== */
  /* Summary: JSX structure — header with leader pill, track lanes, car sprites, vote panel, and finish button. */
  return (
    <div className="race-page bg-track">

      <GameHeader />

      <div className="leader-pill">
        <Crown className="crown-icon" />
        <CountryFlag countryCode={leader.countryCode} size="banner" className="leader-flag" />
        <div className="leader-info">
          <span className="leader-code">{leader.countryCode.toUpperCase()}</span>
          <span className="leader-label">Leader</span>
        </div>
      </div>

      {/* ----- TRACK AREA ----- */}
      <div className="track-area">
        <div className="track-bg" />
        <div className="track-scroll-layer">
          <div className="track-lines" />
        </div>

        <div className="lanes-container">
          {sortedByPosition.map((participant) => (
            <div key={participant.countryCode} className="lane-row racing">
              <div className="lane-info">
                <CountryFlag countryCode={participant.countryCode} size="banner" className="lane-flag" />
                <span className="lane-code">{participant.countryCode.toUpperCase()}</span>
              </div>

              <div
                className="car-sprite-wrapper"
                style={{ left: `calc(${participant.progress}% - 50px)` }}
              >
                <CarSprite countryCode={participant.countryCode} className="car-sprite" />
                <div className="boost-badge">
                  <span className="boost-icon">⚡</span>
                  <span className="boost-count">{participant.boosts}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="finish-line" />
      </div>

      {/* ----- VOTE PANEL ----- */}
      <div className="vote-panel">
        <h2 className="vote-heading">Select Your Country to Boost Your Car</h2>
        <div className="vote-cards-row">
          {sortedByPosition.map((participant) => {
            const voteCount = votes[participant.countryCode] || 0;
            return (
              <button
                key={participant.countryCode}
                onClick={() => handleVote(participant.countryCode)}
                className={`vote-card ${boostingCar === participant.countryCode ? 'boosting' : ''}`}
              >
                <CountryFlag countryCode={participant.countryCode} size="banner" className="vote-flag" />
                <span className="vote-code">{participant.countryCode.toUpperCase()}</span>
                <span className="vote-name">{participant.countryName}</span>
                <span className="vote-count">{voteCount} vote{voteCount !== 1 ? 's' : ''}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ----- FINISH BUTTON ----- */}
      <button
        onClick={handleFinishRace}
        className="race-finish-btn"
      >
        FINISH RACE
      </button>

    </div>
  );
}

/* ===== CAR SPRITE HELPER COMPONENT ===== */
/* Summary: Renders a car image for a given country code from the public assets folder. */
function CarSprite({ countryCode, className }: { countryCode: string; className?: string }) {
  return (
    <img
      src={`/cars/rally_car_livery_sprites/${countryCode.toLowerCase()}.png`}
      alt={`${countryCode} car`}
      className={className}
      style={{ width: 'clamp(60px, 6vw, 100px)', height: 'auto' }}
    />
  );
}

/* ===== COUNTRY FLAG HELPER COMPONENT ===== */
/* Summary: Renders a flag image for a given country code with configurable size. */
function CountryFlag({ countryCode, size, className }: { countryCode: string; size?: string; className?: string }) {
  const widths: Record<string, number> = { banner: 24, sm: 32, md: 48, lg: 80 };
  const w = widths[size || 'banner'] || 24;
  return (
    <img
      src={`/flags/country_flag/${countryCode.toLowerCase()}.png`}
      alt={countryCode}
      className={className}
      style={{ width: `${w}px`, height: 'auto', aspectRatio: '4/3', objectFit: 'cover' }}
    />
  );
}
