import React from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../utils/countries';

const Lobby = ({ onOpenSettings }) => {
    const { gameState, adminStartRace, voteCountry } = useGame();
    const { timer, votes } = gameState;

    // Get top 8 voted countries or defaults
    const votedKeys = Object.keys(votes).sort((a, b) => votes[b] - votes[a]);
    const displaySlots = Array(8).fill(null).map((_, index) => {
        const code = votedKeys[index];
        return code ? { code, ...COUNTRIES[code] } : null;
    });

    return (
        <div className="flex flex-col h-full w-full bg-[#5D9CEC]"> {/* Light blue background like image */}

            {/* Header */}
            <div className="flex justify-between items-center p-4">
                <button className="text-4xl">🏠</button>
                <div className="text-center">
                    <h1 className="text-6xl font-black text-yellow-400 italic drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-wider"
                        style={{ WebkitTextStroke: '2px #B8860B' }}>
                        Race of Nations
                    </h1>
                    <h2 className="text-3xl font-bold text-pink-500 mt-2">
                        Race Starting in <span className="text-4xl">00:{timer.toString().padStart(2, '0')}</span>
                    </h2>
                </div>
                <button onClick={onOpenSettings} className="text-4xl hover:scale-110 transition-transform">⚙️</button>
            </div>

            {/* Grid */}
            <div className="flex-1 container mx-auto flex items-center justify-center p-8">
                <div className="grid grid-cols-4 gap-8 w-full max-w-6xl">
                    {displaySlots.map((slot, i) => (
                        <div key={i} className="aspect-video bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden group">
                            {slot ? (
                                <>
                                    <img src={slot.flag} alt={slot.name} className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-center font-bold py-1">
                                        {slot.name} ({votes[slot.code] || 0})
                                    </div>
                                </>
                            ) : (
                                <span className="text-gray-500 text-xl font-bold">Team {i + 1}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Admin Controls (Hidden in production or subtle) */}
            <div className="flex justify-center gap-4 mb-4">
                <button
                    onClick={adminStartRace}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow-lg border-2 border-green-700">
                    Start Race
                </button>
                <button className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-6 rounded shadow-lg border-2 border-red-600">
                    Reset Timer
                </button>
            </div>

            {/* Bottom Bar */}
            <div className="bg-black text-white p-4">
                <p className="text-center text-xl font-bold mb-4">Enter your country Name/ code to boost</p>
                <div className="flex justify-center gap-6 overflow-x-auto pb-2">
                    {['USA', 'IND', 'CHN', 'GBR', 'JPN'].map(code => ( // Display a few popular ones
                        <button
                            key={code}
                            onClick={() => voteCountry(code)}
                            className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                        >
                            <img src={COUNTRIES[code].flag} alt={code} className="w-16 h-10 object-cover border border-white" />
                            <span className="font-bold">{code}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Lobby;
