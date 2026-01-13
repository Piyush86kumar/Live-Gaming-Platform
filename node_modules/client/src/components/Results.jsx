import React from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../utils/countries';

const Results = ({ onOpenSettings }) => {
    const { gameState } = useGame();
    const { winner, rankings } = gameState;

    const winnerData = COUNTRIES[winner] || { name: winner, flag: null };

    return (
        <div className="flex w-full h-full bg-[#5D9CEC] p-8 relative">
            <button onClick={onOpenSettings} className="absolute top-4 right-4 text-4xl hover:scale-110 transition-transform z-50">⚙️</button>
            {/* Main Stage */}
            <div className="flex-1 flex flex-col items-center justify-center relative">
                <h1 className="text-6xl font-black text-yellow-400 italic mb-8 drop-shadow-md" style={{ WebkitTextStroke: '2px #B8860B' }}>
                    Winner is
                </h1>

                <div className="relative">
                    {/* Spotlight effect (CSS radial gradient) */}
                    <div className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent scale-150 animate-pulse"></div>

                    {winnerData.flag && (
                        <img src={winnerData.flag} alt={winner} className="w-96 h-64 object-cover shadow-2xl border-4 border-white relative z-10" />
                    )}
                    <h2 className="text-5xl font-bold text-white mt-4 text-center relative z-10 drop-shadow-md">{winnerData.name}</h2>
                </div>

                <div className="mt-12">
                    <p className="text-pink-500 font-bold text-2xl">Race reset in 00:30</p>
                </div>
            </div>

            {/* Leaderboard Panel */}
            <div className="w-1/3 bg-gray-200 rounded-lg p-4 shadow-xl border-2 border-gray-400">
                <h3 className="text-2xl font-bold text-black border-b-2 border-gray-400 pb-2 mb-4">Leaderboard</h3>
                <div className="bg-white rounded h-full overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Country</th>
                                <th className="p-3 text-right">Total Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Mock historical leaderboard for now, or use rankings */}
                            {rankings.map((r, i) => (
                                <tr key={i} className={`border-b ${r.country === winner ? 'bg-yellow-100' : ''}`}>
                                    <td className="p-3 flex items-center gap-2">
                                        {COUNTRIES[r.country] && <img src={COUNTRIES[r.country].flag} className="w-8 h-6" />}
                                        {r.country}
                                    </td>
                                    <td className="p-3 text-right">
                                        {/* Currently we don't persist wins, so just show ranking pos */}
                                        #{i + 1}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Results;
