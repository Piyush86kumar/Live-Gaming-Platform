import { useNavigate } from 'react-router-dom';
import { Users, Home, Settings } from 'lucide-react';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { useGameStore } from '@/hooks/useGameStore';
import { COUNTRIES } from '@/data/mockData';

export default function LobbyPage() {
  const navigate = useNavigate();
  const { players, countdown, selectCountry, removeCountry, startRace, resetRace, setCountdown } = useGameStore();

  const handleCountrySelect = (countryCode: string) => {
    const emptySlot = players.find(p => !p.isReady);
    if (emptySlot) {
      selectCountry(countryCode, emptySlot.teamNumber);
    }
  };

  const handleCardClick = (teamNumber: number, isReady: boolean) => {
    if (isReady) {
      removeCountry(teamNumber);
    }
  };

  const handleStartRace = () => {
    startRace();
    navigate('/race');
  };

  return (
    <div className="lobby-page bg-stadium">
      <header className="lobby-header">
        <button
          onClick={() => navigate('/lobby')}
          className="lobby-icon-btn lobby-icon-btn--left"
        >
          <Home className="lobby-icon-btn__icon" />
        </button>

        <h1 className="lobby-title">
          RACE <span className="lobby-title__of">OF</span> NATIONS
        </h1>

        <button
          onClick={() => navigate('/settings')}
          className="lobby-icon-btn lobby-icon-btn--right"
        >
          <Settings className="lobby-icon-btn__icon" />
        </button>

        <div className="lobby-countdown">
          <span className="lobby-countdown__label">Race Starting In</span>
          <CountdownTimer
            seconds={countdown}
            onComplete={() => navigate('/race')}
          />
        </div>
      </header>

      <div className="team-grid-section">
        <div className="team-grid">
          {players.map((player) => (
            <div
              key={player.id}
              onClick={() => handleCardClick(player.teamNumber, player.isReady)}
              className={`team-card ${player.isReady ? 'team-card--filled' : 'team-card--empty'}`}
            >
              {player.isReady ? (
                <>
                  <CountryFlag countryCode={player.countryCode} size="banner" className="card-flag" />
                  <span className="card-display-code">{player.displayCode}</span>
                  <span className="card-country-name">{player.countryName}</span>
                </>
              ) : (
                <>
                  <Users className="team-card__icon" />
                  <span className="team-card__label">TEAM {player.teamNumber}</span>
                  <span className="team-card__waiting">Waiting...</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

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

      <div className="banner-section">
        <h2 className="banner-heading">Choose Your Country</h2>
        <div className="banner-overflow">
          <div className="banner-track">
            {[...COUNTRIES, ...COUNTRIES].map((country, index) => (
              <div
                key={`${country.code}-${index}`}
                className="banner-item"
                onClick={() => handleCountrySelect(country.code)}
              >
                <CountryFlag countryCode={country.code} size="banner" className="banner-flag" />
                <span className="banner-name">{country.name}</span>
                <span className="banner-code">{country.displayCode}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}