import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../utils/socket';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        phase: 'lobby', // lobby, racing, results
        timer: 60,
        racers: {},
        votes: {},
        influence: {},
        obstacles: [],
        winner: null,
        rankings: [],
        sessionTop10: []
    });

    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log('Connected to server');
        }

        function onDisconnect() {
            setIsConnected(false);
            console.log('Disconnected from server');
        }

        function onPhaseChange(newPhase) {
            console.log('Phase changed to:', newPhase);
            setGameState(prev => ({ ...prev, phase: newPhase }));
        }

        function onLobbyUpdate(data) {
            setGameState(prev => ({ ...prev, ...data }));
        }

        function onTimerUpdate(timer) {
            setGameState(prev => ({ ...prev, timer }));
        }

        function onVotesUpdate(votes) {
            setGameState(prev => ({ ...prev, votes }));
        }

        function onRaceStart(data) {
            setGameState(prev => ({
                ...prev,
                phase: 'racing',
                racers: data.racers,
                config: data.config
            }));
        }

        function onRaceUpdate(data) {
            // High frequency update - might optimize later to not spread entire state
            setGameState(prev => ({
                ...prev,
                racers: data.racers,
                influence: data.influence
            }));
        }

        function onRaceFinished(data) {
            setGameState(prev => ({
                ...prev,
                phase: 'results',
                winner: data.winner,
                rankings: data.rankings,
                sessionTop10: data.sessionTop10 || [],
                timer: data.timer || 0
            }));
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('phase_change', onPhaseChange);
        socket.on('lobby_update', onLobbyUpdate);
        socket.on('timer_update', onTimerUpdate);
        socket.on('votes_update', onVotesUpdate);
        socket.on('race_start', onRaceStart);
        socket.on('race_update', onRaceUpdate);
        socket.on('race_finished', onRaceFinished);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('phase_change', onPhaseChange);
            socket.off('lobby_update', onLobbyUpdate);
            socket.off('timer_update', onTimerUpdate);
            socket.off('votes_update', onVotesUpdate);
            socket.off('race_start', onRaceStart);
            socket.off('race_update', onRaceUpdate);
            socket.off('race_finished', onRaceFinished);
        };
    }, []);

    // Actions
    const voteCountry = (country) => {
        socket.emit('vote_country', { country });
    };

    const adminStartRace = () => {
        socket.emit('admin_start_race');
    };

    const adminResetRace = () => {
        socket.emit('admin_reset_race');
    };

    const adminResetTimer = () => {
        socket.emit('admin_reset_timer');
    };

    const adminResetSession = () => {
        socket.emit('admin_reset_session');
    };

    return (
        <GameContext.Provider value={{ gameState, isConnected, voteCountry, adminStartRace, adminResetRace, adminResetTimer, adminResetSession }}>
            {children}
        </GameContext.Provider>
    );
};
