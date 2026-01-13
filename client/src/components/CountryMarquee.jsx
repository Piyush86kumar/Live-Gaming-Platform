import React from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../utils/countries';

const CountryMarquee = ({ title }) => {
    const { voteCountry, gameState } = useGame();
    const { votes } = gameState; // Access votes from context if needed for badges
    const validVotes = votes || {};

    return (
        <div className="bg-black text-white p-4 overflow-hidden relative flex-shrink-0">
            <p className="text-center text-xl font-bold mb-4 uppercase tracking-widest text-yellow-400 drop-shadow-md">
                {title || "Enter your country name/ code to join the race"}
            </p>

            <div className="flex overflow-hidden whitespace-nowrap">
                <div className="flex gap-6 animate-marquee">
                    {COUNTRIES && Object.keys(COUNTRIES).length > 0 ? (
                        Object.keys(COUNTRIES).concat(Object.keys(COUNTRIES)).map((code, i) => (
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
