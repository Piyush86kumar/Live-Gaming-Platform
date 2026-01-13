import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Lobby from './components/Lobby';
import RaceView from './components/RaceView';
import Results from './components/Results';
import SettingsModal from './components/SettingsModal';

const GameContainer = () => {
    const { gameState, isConnected } = useGame();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const openSettings = () => setIsSettingsOpen(true);
    const closeSettings = () => setIsSettingsOpen(false);

    // Render based on phase
    const renderPhase = () => {
        switch (gameState.phase) {
            case 'lobby': return <Lobby onOpenSettings={openSettings} />;
            case 'racing': return <RaceView onOpenSettings={openSettings} />;
            case 'results': return <Results onOpenSettings={openSettings} />;
            default: return <div className="text-white p-10">Unknown Game Phase: {gameState.phase}</div>;
        }
    };

    return (
        <div className="relative w-full h-full">
            {renderPhase()}
            <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />

            {/* Debug Overlay */}
            {!isConnected && (
                <div className="absolute top-0 left-0 bg-red-600 text-white p-2 font-bold z-50">
                    Disconnected
                </div>
            )}
            <div className="absolute bottom-0 right-0 bg-black/50 text-white text-xs p-1 pointer-events-none z-50">
                Phase: {gameState.phase} | Timer: {gameState.timer}
            </div>
        </div>
    );
};

function App() {
    return (
        <GameProvider>
            <div className="h-screen w-screen overflow-hidden">
                <GameContainer />
            </div>
        </GameProvider>
    )
}

export default App;
