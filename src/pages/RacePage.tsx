import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { GameBackground } from '@/components/layout/GameBackground';
import { GameHeader } from '@/components/layout/GameHeader';
import { NeonButton } from '@/components/ui/NeonButton';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { CarSprite } from '@/components/ui/CarSprite';
import { GlowText } from '@/components/ui/GlowText';
import { useGameStore } from '@/hooks/useGameStore';

export default function RacePage() {
  const navigate = useNavigate();
  const { raceParticipants, votes, voteForCountry, setWinner } = useGameStore();
  const [localVotes, setLocalVotes] = useState<Record<string, number>>({ ...votes });
  const [boostedCar, setBoostedCar] = useState<string | null>(null);

  const leader = raceParticipants[0];

  const handleVote = (countryCode: string) => {
    voteForCountry(countryCode);
    setLocalVotes(prev => ({
      ...prev,
      [countryCode]: (prev[countryCode] || 0) + 1
    }));
    setBoostedCar(countryCode);
    setTimeout(() => setBoostedCar(null), 500);
  };

  const handleFinishRace = () => {
    setWinner(leader.countryCode);
    navigate('/leaderboard');
  };

  return (
    <GameBackground variant="track">
      <GameHeader />

      <div className="flex-1 flex flex-col px-4 md:px-8 lg:px-12 pb-4 min-h-0">
        {/* Leader Indicator */}
        <div className="flex justify-center mb-4">
          <div className="bg-[rgba(15,23,41,0.9)] border border-[rgba(255,215,0,0.4)] rounded-xl px-6 py-2 flex items-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            <Crown className="w-5 h-5 text-[#ffd700]" />
            <CountryFlag countryCode={leader.countryCode} size="sm" />
            <div className="flex flex-col">
              <GlowText variant="gold" size="sm" className="uppercase">
                {leader.countryCode}
              </GlowText>
              <span className="text-[#ffd700] text-xs font-heading uppercase tracking-wider">Leader</span>
            </div>
          </div>
        </div>

        {/* Race Track */}
        <div className="race-track">
          <div className="race-track__inner">
            {/* Lane dividers */}
            <div className="lane-dividers">
              {Array.from({ length: raceParticipants.length - 1 }).map((_, index) => (
                <div
                  key={index}
                  className="lane-divider"
                  style={{ top: `${((index + 1) / raceParticipants.length) * 100}%` }}
                />
              ))}
            </div>

            {/* Finish line */}
            <div className="finish-line" />

            {/* Lanes */}
            <div className="race-lanes">
              {raceParticipants.map((participant) => (
                <div key={participant.countryCode} className="race-lane">
                  {/* Left info: flag + country code */}
                  <div className="race-lane__info">
                    <CountryFlag countryCode={participant.countryCode} size="sm" />
                    <span className="race-lane__code">{participant.countryCode}</span>
                  </div>

                  {/* Car (positioned by progress %) */}
                  <div
                    className="race-lane__car"
                    style={{ left: `calc(${participant.progress}% - 40px)` }}
                  >
                    <CarSprite countryCode={participant.countryCode} />
                    {/* Speed trail */}
                    <div className="car-trail" />
                  </div>

                  {/* Boost badge */}
                  <div className="race-lane__boost">
                    <span className="boost-icon">Z</span>
                    <span className="boost-count">{participant.boosts}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Voting Section */}
        <div className="boost-panel">
          <div className="boost-panel__title">Boost Your Car</div>
          <div className="boost-panel__grid">
            {raceParticipants.map((participant) => {
              const voteCount = localVotes[participant.countryCode] || 0;
              return (
                <button
                  key={participant.countryCode}
                  onClick={() => handleVote(participant.countryCode)}
                  className={`
                    boost-card
                    ${boostedCar === participant.countryCode ? 'boost-card--active' : ''}
                  `}
                >
                  <CountryFlag countryCode={participant.countryCode} size="md" />
                  <span className="boost-card__code">{participant.countryCode}</span>
                  <div className="boost-card__votes">
                    <span className={`boost-card__count ${voteCount > 0 ? 'boost-card__count--gold' : ''}`}>
                      {voteCount}
                    </span>
                    <span className="boost-card__label">votes</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Finish Race Button */}
        <div className="flex justify-center">
          <NeonButton 
            variant="primary" 
            size="lg" 
            onClick={handleFinishRace}
            className="min-w-[200px]"
          >
            FINISH RACE
          </NeonButton>
        </div>
      </div>
    </GameBackground>
  );
}
