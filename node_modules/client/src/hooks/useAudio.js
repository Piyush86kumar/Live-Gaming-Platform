import { useRef, useEffect } from 'react';

// Placeholder empty sounds or basic beeps using Web Audio API could be used if no files.
// For now, we'll setup the structure to play files.

export const useAudio = (gameState) => {
    const audioContextRef = useRef(null);
    const musicRef = useRef(null);

    // Initialize AudioContext on first interaction (usually required by browsers)
    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    // Synthesize simple beep
    const playBeep = (freq = 440, type = 'sine', duration = 0.1) => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    // Effect for Game Phase changes (Music)
    useEffect(() => {
        // Here we would play/stop loop tracks based on gameState.phase
        // e.g. lobby -> lobby_music.mp3
        // racing -> race_music.mp3
        console.log(`Audio: Phase changed to ${gameState.phase}`);

        // Example:
        // if (gameState.phase === 'racing') playBeep(600, 'square', 0.5);

    }, [gameState.phase]);

    // Effect for specific events (SFX)
    // We might need an event queue in gameState or a separate socket event listener 
    // inside the hook to trigger SFX without reacting to state snapshots.
    // For now, let's expose play functions.

    return {
        initAudio,
        playBeep
    };
};
