import React from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../utils/countries';

const CountryMarquee = ({ title, countryCodes }) => {
    const { voteCountry, gameState } = useGame();
    const { votes } = gameState; // Access votes from context if needed for badges
    const validVotes = votes || {};

    const availableCodes = countryCodes || Object.keys(COUNTRIES);

    // Ensure we have enough items to fill screen width for smooth loop
    // Repeat list until we have at least 20 items to guarantee screen coverage
    let baseList = [...availableCodes];
    if (baseList.length > 0) {
        while (baseList.length < 20) {
            baseList = baseList.concat(availableCodes);
        }
    }

    // Double it for the sliding window effect
    const displayList = baseList.length > 0 ? baseList.concat(baseList) : [];

    return (
        <div className="bg-transparent text-white p-4 overflow-hidden relative flex-shrink-0">
            <p className="text-center text-xl font-bold mb-4 uppercase tracking-widest text-yellow-400 drop-shadow-md">
                {title || "Enter your country name/ code to join the race"}
            </p>

            <div className="flex overflow-hidden whitespace-nowrap">
                <div
                    className="flex gap-6 animate-marquee"
                    style={{ animationDuration: `${Math.max(10, baseList.length * 0.6)}s` }}
                >
                    {displayList.length > 0 ? (
                        displayList.map((code, i) => (
                            <button
                                key={`${code}-${i}`}
                                onClick={() => voteCountry(code)}
                                className="flex flex-col items-center gap-1 hover:scale-110 transition-transform flex-shrink-0 w-24"
                            >
                                <img src={COUNTRIES[code]?.flag} alt={code} className="w-16 h-10 object-cover border-2 border-white rounded-sm shadow-sm" />
                                <span className="font-bold text-sm tracking-wider">{code}</span>
                                {validVotes[code] > 0 && <span className="text-xs text-yellow-300 font-bold">{validVotes[code]} votes</span>}
                            </button>
                        ))
                    ) : (
                        <div className="text-white">Loading countries...</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountryMarquee;
