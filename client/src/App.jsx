import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Lobby from './components/Lobby';
import RaceView from './components/RaceView';
import Results from './components/Results';
import SettingsModal from './components/SettingsModal';

const GameContainer = () => {
    const { gameState } = useGame();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const openSettings = () => setIsSettingsOpen(true);
    const closeSettings = () => setIsSettingsOpen(false);

    // Render based on phase
    const renderPhase = () => {
        if (gameState.phase === 'lobby') {
            return <Lobby onOpenSettings={openSettings} />;
        } else if (gameState.phase === 'racing') {
            return <RaceView onOpenSettings={openSettings} />;
        } else if (gameState.phase === 'results') {
            return <Results onOpenSettings={openSettings} />;
        }
        return null;
    };

    return (
        <>
            {renderPhase()}
            <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />
        </>
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
