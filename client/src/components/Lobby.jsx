import React from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../utils/countries';
import CountryMarquee from './CountryMarquee';

const Lobby = ({ onOpenSettings }) => {
    const { gameState, adminStartRace, adminResetRace, adminResetTimer, voteCountry } = useGame();
    const { timer, votes } = gameState;
    const [showConfirm, setShowConfirm] = React.useState(false);

    // Safe timer display
    const formatTimer = (t) => {
        try {
            return t != null ? t.toString().padStart(2, '0') : '00';
        } catch (e) {
            return '00';
        }
    };

    const handleHomeClick = () => {
        setShowConfirm(true);
    };

    const confirmReset = () => {
        adminResetRace();
        setShowConfirm(false);
    };

    const cancelReset = () => {
        setShowConfirm(false);
    };

    // Safe slots generation
    const validVotes = votes || {};
    const votedKeys = Object.keys(validVotes).sort((a, b) => validVotes[b] - validVotes[a]);
    const displaySlots = Array(8).fill(null).map((_, index) => {
        const code = votedKeys[index];
        // Only return if code exists and is found in COUNTRIES to prevent crash
        if (code && COUNTRIES && COUNTRIES[code]) {
            return { code, ...COUNTRIES[code] };
        }
        return null;
    });

    return (
        <div className="flex flex-col h-screen w-screen bg-[#5D9CEC] overflow-hidden relative">
            {/* Header */}
            <div className="flex justify-between items-center p-4 flex-shrink-0">
                <button className="text-4xl hover:scale-110 transition-transform" onClick={handleHomeClick}>🏠</button>
                <div className="text-center">
                    <h1 className="text-6xl font-black text-yellow-400 italic drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-wider"
                        style={{ WebkitTextStroke: '2px #B8860B' }}>
                        Race of Nations
                    </h1>
                    <h2 className="text-3xl font-bold text-pink-500 mt-2">
                        Race Starting in <span className="text-4xl">00:{formatTimer(timer)}</span>
                    </h2>
                </div>
                <button onClick={onOpenSettings} className="text-4xl hover:scale-110 transition-transform">⚙️</button>
            </div>

            {/* Grid */}
            <div className="flex-1 container mx-auto flex items-center justify-center p-8 overflow-hidden">
                <div className="grid grid-cols-4 gap-8 w-full max-w-6xl h-full max-h-[60vh]">
                    {displaySlots.map((slot, i) => (
                        <div key={i} className="aspect-video bg-gray-100 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden group">
                            {slot ? (
                                <>
                                    <img src={slot.flag} alt={slot.name} className="absolute inset-0 w-full h-full object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-center font-bold py-1">
                                        {slot.name} ({validVotes[slot.code] || 0})
                                    </div>
                                </>
                            ) : (
                                <span className="text-gray-500 text-xl font-bold">Team {i + 1}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Admin Controls */}
            <div className="flex justify-center gap-4 mb-4 flex-shrink-0">
                <button
                    onClick={adminStartRace}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow-lg border-2 border-green-700 hover:scale-105 transition-transform">
                    Start Race
                </button>
                <button
                    onClick={adminResetTimer}
                    className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-6 rounded shadow-lg border-2 border-red-600 hover:scale-105 transition-transform">
                    Reset Timer
                </button>
            </div>

            {/* Bottom Bar */}
            <CountryMarquee title="Enter your country name/ code to join the race or boost car" />

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 rounded-lg shadow-xl text-center border-4 border-yellow-400">
                        <h3 className="text-2xl font-bold mb-6">Reset Lobby?</h3>
                        <div className="flex gap-6 justify-center">
                            <button
                                onClick={confirmReset}
                                className="bg-red-500 text-white px-8 py-3 rounded font-bold hover:bg-red-600 border-2 border-red-700 shadow-lg text-lg">
                                YES
                            </button>
                            <button
                                onClick={cancelReset}
                                className="bg-gray-500 text-white px-8 py-3 rounded font-bold hover:bg-gray-600 border-2 border-gray-700 shadow-lg text-lg">
                                NO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lobby;
