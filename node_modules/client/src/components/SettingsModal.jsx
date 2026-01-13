import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const SettingsModal = ({ isOpen, onClose }) => {
    const { gameState } = useGame(); // In real app, we'd emit update_settings
    const [activeTab, setActiveTab] = useState('race');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-200 w-[600px] rounded shadow-2xl border-2 border-gray-400 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -right-4 -top-4 text-red-600 hover:text-red-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Tabs */}
                <div className="flex border-b border-gray-400">
                    <button
                        onClick={() => setActiveTab('race')}
                        className={`px-6 py-2 font-bold ${activeTab === 'race' ? 'bg-gray-300 border-b-2 border-transparent' : 'bg-gray-400 text-gray-700'}`}
                    >
                        Race setting
                    </button>
                    <button
                        onClick={() => setActiveTab('audio')}
                        className={`px-6 py-2 font-bold ${activeTab === 'audio' ? 'bg-white border-b-2 border-transparent' : 'bg-gray-400 text-gray-700'}`}
                    >
                        audio
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 bg-gray-100 min-h-[300px] text-gray-700 font-medium text-lg">
                    {activeTab === 'race' && (
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Total teams =</span>
                                <span className="font-bold">8</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Race Start Timer =</span>
                                <input type="number" defaultValue={60} className="w-20 px-2 py-1 border rounded" />
                            </div>
                            <div className="flex justify-between">
                                <span>Race length =</span>
                                <span className="font-bold">1500</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Base Speed =</span>
                                <span className="font-bold">1</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Boost =</span>
                                <span className="font-bold">0.1</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Obstacle =</span>
                                <span className="font-bold">0.1</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Race reset timer =</span>
                                <span className="font-bold">30</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'audio' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span>Lobby music =</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">80</span>
                                    <input type="range" min="0" max="100" defaultValue="80" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Race SFX =</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">60</span>
                                    <input type="range" min="0" max="100" defaultValue="60" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Race Music =</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">80</span>
                                    <input type="range" min="0" max="100" defaultValue="80" />
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Winner Music =</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold">80</span>
                                    <input type="range" min="0" max="100" defaultValue="80" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
