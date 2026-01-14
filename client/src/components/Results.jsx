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
                <h1 className="text-6xl font-black text-yellow-400 italic mb-4 drop-shadow-md" style={{ WebkitTextStroke: '2px #B8860B' }}>
                    Winner is
                </h1>

                <div className="relative mb-4">
                    {/* Spotlight effect (CSS radial gradient) */}
                    <div className="absolute inset-0 bg-gradient-radial from-white/30 to-transparent scale-150 animate-pulse"></div>

                    {winnerData.flag && (
                        <img src={winnerData.flag} alt={winner} className="w-80 h-56 object-cover shadow-2xl border-4 border-white relative z-10" />
                    )}
                    <h2 className="text-5xl font-bold text-white mt-4 text-center relative z-10 drop-shadow-md">{winnerData.name}</h2>
                </div>

                {/* Runners Up (Rank 2-5) */}
                <div className="flex gap-6 mt-4 mb-4">
                    {rankings.slice(1, 5).map((r, i) => (
                        <div key={i} className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                            <span className="text-gray-200 font-bold mb-1 text-xl">#{i + 2}</span>
                            {COUNTRIES[r.country] && (
                                <img src={COUNTRIES[r.country].flag} className="w-24 h-16 object-cover border-2 border-white shadow-md grayscale-[30%]" alt={r.country} />
                            )}
                            <span className="text-white font-semibold mt-1">{COUNTRIES[r.country] ? COUNTRIES[r.country].name : r.country}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <p className="text-pink-500 font-bold text-2xl">Race reset in 00:{timer.toString().padStart(2, '0')}</p>

                    <button
                        onClick={adminResetRace}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-8 rounded shadow-lg border-2 border-green-700 hover:scale-105 transition-transform text-xl">
                        Restart Race
                    </button>
                </div>
            </div>

            {/* Total Wins Session Panel */}
            <div className="w-1/3 bg-gray-900 rounded-lg p-4 shadow-xl border-2 border-gray-700 flex flex-col">
                <h3 className="text-2xl font-bold text-yellow-400 border-b-2 border-gray-700 pb-2 mb-4 flex items-center gap-2">
                    <span>🏆</span> Today's Top Winners
                </h3>
                <div className="bg-gray-800 rounded flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 text-gray-300">
                            <tr>
                                <th className="p-3 font-bold">Rank</th>
                                <th className="p-3 font-bold">Country</th>
                                <th className="p-3 font-bold text-right">Wins</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-200">
                            {(gameState.sessionTop10 || []).map((entry, i) => (
                                <tr key={i} className={`border-b border-gray-700 ${i % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}`}>
                                    <td className="p-3 font-bold text-gray-400">
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                    </td>
                                    <td className="p-3 flex items-center gap-3">
                                        {COUNTRIES[entry.country] && (
                                            <img src={COUNTRIES[entry.country].flag} className="w-8 h-5 object-cover border border-gray-600" alt={entry.country} />
                                        )}
                                        <span className="font-medium">{COUNTRIES[entry.country] ? COUNTRIES[entry.country].name : entry.country}</span>
                                    </td>
                                    <td className="p-3 font-bold text-yellow-500 text-right">{entry.wins}</td>
                                </tr>
                            ))}
                            {(gameState.sessionTop10 || []).length === 0 && (
                                <tr>
                                    <td colSpan="3" className="p-4 text-center text-gray-500 italic">No wins yet this session</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Results;
