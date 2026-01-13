import React from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../utils/countries';

const Results = ({ onOpenSettings }) => {
    const { gameState, adminResetRace } = useGame();
    const { winner, rankings, timer } = gameState;

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

                <div className="mt-12 flex flex-col items-center gap-4">
                    <p className="text-pink-500 font-bold text-2xl">Race reset in 00:{timer.toString().padStart(2, '0')}</p>

                    <button
                        onClick={adminResetRace}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded shadow-lg border-2 border-green-700 hover:scale-105 transition-transform text-xl">
                        Restart Race
                    </button>
                </div>
            </div>

            {/* Leaderboard Panel */}
            <div className="w-1/3 bg-gray-800 rounded-lg p-4 shadow-xl border-2 border-gray-600 flex flex-col">
                <h3 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2 mb-4">Leaderboard</h3>
                <div className="bg-gray-100 rounded flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-3 font-bold text-gray-700">Rank</th>
                                <th className="p-3 font-bold text-gray-700">Country</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map((r, i) => (
                                <tr key={i} className={`border-b ${r.country === winner ? 'bg-yellow-200' : 'even:bg-gray-50'}`}>
                                    <td className="p-3 font-bold text-gray-600">
                                        {i === 0 ? '🏆 1st' : ''}
                                        {i === 1 ? '🥈 2nd' : ''}
                                        {i === 2 ? '🥉 3rd' : ''}
                                        {i > 2 ? `#${i + 1}` : ''}
                                    </td>
                                    <td className="p-3 flex items-center gap-3">
                                        {COUNTRIES[r.country] && (
                                            <img src={COUNTRIES[r.country].flag} className="w-10 h-6 object-cover border border-gray-300 shadow-sm" alt={r.country} />
                                        )}
                                        <span className="font-bold text-gray-800 text-lg">{COUNTRIES[r.country] ? COUNTRIES[r.country].name : r.country}</span>
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
