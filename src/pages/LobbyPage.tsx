/* ================================================================
   FILE: LobbyPage.tsx
   ================================================================ */
/* Summary: The pre-race lobby page where players select countries,
   view team slots, start the race, or reset the countdown timer. */

import { useNavigate } from 'react-router-dom';        /* Hook for programmatic page navigation */
import { Users } from 'lucide-react';   /* Icon components for UI elements */
import { GameHeader } from '@/components/layout/GameHeader';     /* Shared header with navigation buttons */
import { CountdownTimer } from '@/components/ui/CountdownTimer'; /* Reusable countdown display */
import { CountryFlag } from '@/components/ui/CountryFlag';       /* Reusable country flag image */
import { useGameStore } from '@/hooks/useGameStore';    /* Zustand store for all game state */
import { COUNTRIES } from '@/data/mockData';            /* Static list of available countries */

/* ===== LOBBY PAGE COMPONENT ===== */
/* Summary: Renders team cards, start/reset buttons, and a scrollable country banner. */
export default function LobbyPage() {
  const navigate = useNavigate();                                                      /* Navigation helper to switch routes */
  const { players, countdown, selectCountry, removeCountry, startRace, resetRace, setCountdown } = useGameStore(); /* Destructure store actions & state */

  /* ===== EVENT HANDLERS ===== */
  /* Summary: Functions that respond to user interactions on the page. */

  /* handleCountrySelect: Assign a clicked country to the first empty team slot */
  const handleCountrySelect = (countryCode: string) => {
    const emptySlot = players.find(p => !p.isReady);   /* Find the first team slot that has no country yet */
    if (emptySlot) {                                    /* Only assign if there is an available slot */
      selectCountry(countryCode, emptySlot.teamNumber); /* Dispatch action to fill the slot with chosen country */
    }
  };

  /* handleCardClick: Remove a country from a filled team slot when clicked */
  const handleCardClick = (teamNumber: number, isReady: boolean) => {
    if (isReady) {                /* Only allow removal if the slot is already occupied */
      removeCountry(teamNumber);  /* Dispatch action to clear that team slot */
    }
  };

  /* handleStartRace: Trigger race start and navigate to the race page */
  const handleStartRace = () => {
    startRace();    /* Set game state to "racing" (locks lobby, begins race) */
    navigate('/race'); /* Redirect the browser to the race route */
  };

  /* ===== RENDER: LOBBY PAGE LAYOUT ===== */
  /* Summary: JSX structure for the entire lobby — header, team cards, action buttons, country banner. */
  return (
    <div className="lobby-page bg-stadium">

      {/* ----- HEADER ----- */}
      <GameHeader />

      <div className="lobby-countdown">
        <CountdownTimer
          seconds={countdown}
          onComplete={() => navigate('/race')}
          label="RACE STARTING IN"
        />
      </div>

      {/* ----- TEAM GRID ----- */}
      <div className="team-grid-section">
        <div className="team-grid">
          {players.map((player) => (
            <div
              key={player.id}
              onClick={() => handleCardClick(player.teamNumber, player.isReady)}
              className={`team-card ${player.isReady ? 'team-card--filled' : 'team-card--empty'}`}
            >
              {player.isReady ? (
                <CountryFlag countryCode={player.countryCode} className="team-card-flag" />
              ) : (
                <div className="team-card__empty-content">
                  <Users className="team-card__icon" />
                  <span className="team-card__label">TEAM {player.teamNumber}</span>
                  <span className="team-card__waiting">Waiting...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ----- ACTION BUTTONS ----- */}
      <div className="lobby-buttons">
        <button
          onClick={handleStartRace}
          className="lobby-btn lobby-btn--start"
        >
          START RACE
        </button>
        <button
          onClick={() => {
            resetRace();
            setCountdown(60);
          }}
          className="lobby-btn lobby-btn--reset"
        >
          RESET TIMER
        </button>
      </div>

      {/* ----- COUNTRY SELECTION BANNER ----- */}
      <div className="banner-section">
        <h2 className="banner-heading">Enter your country name to join race</h2>
        <div className="banner-overflow">
          <div className="banner-track">
            {[...COUNTRIES, ...COUNTRIES].map((country, index) => (
              <div
                key={`${country.code}-${index}`}
                className="banner-item"
                onClick={() => handleCountrySelect(country.code)}
              >
                <CountryFlag countryCode={country.code} className="banner-flag" />
                <div className="flex flex-col items-center gap-[2px]">
                  <span className="banner-name">{country.name}</span>
                  <span className="banner-code">{country.displayCode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
