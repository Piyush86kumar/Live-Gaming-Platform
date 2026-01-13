import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../utils/countries';
import CountryMarquee from './CountryMarquee';

// Assets placeholders
// In a real app, pre-load images
const CAR_WIDTH = 60;
const CAR_HEIGHT = 30;

const RaceView = (props) => {
    const canvasRef = useRef(null);
    const { gameState, voteCountry, adminResetRace } = useGame();
    const { racers, influence } = gameState;
    const [showConfirm, setShowConfirm] = useState(false);

    // Helper to draw track
    const drawTrack = (ctx, width, height) => {
        const laneHeight = height / 8;

        ctx.fillStyle = '#555'; // Asphalt
        ctx.fillRect(0, 0, width, height);

        // Draw crowd/barrier at top (simple strip)
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, width, 40);

        // Lanes
        ctx.strokeStyle = '#FFF';
        ctx.setLineDash([20, 20]);
        ctx.lineWidth = 2;

        for (let i = 1; i < 8; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * laneHeight + 40);
            ctx.lineTo(width, i * laneHeight + 40);
            ctx.stroke();
        }

        // Finish Line
        // Must match the race length mapping: 1500 units -> (width - 150)
        // trackStart (50) + 1500 * scale = width - 150
        const finishX = width - 150;
        const finishWidth = 40; // 2 squares wide
        const squareSize = 20;

        // Draw checkered pattern vertically across all lanes
        for (let y = 40; y < height; y += squareSize) {
            for (let x = finishX; x < finishX + finishWidth; x += squareSize) {
                const row = Math.floor(y / squareSize);
                const col = Math.floor(x / squareSize);
                ctx.fillStyle = (row + col) % 2 === 0 ? 'white' : 'black';
                ctx.fillRect(x, y, squareSize, squareSize);
            }
        }

        return finishX; // return x for debug if needed
    };

    // Helper to draw car
    const drawCar = (ctx, racer, code, laneIndex, laneHeight, totalLength, canvasWidth) => {
        // Map race position (0 to 1500) to Canvas X
        // We need to scroll or scale. Let's assume the track is fixed width on screen for MVP, 
        // OR we map 0-1500 to 0-(canvasWidth-150).
        // The requirements say horizontal scrolling view, but simpler for MVP is fit-to-screen or scrolling camera.
        // Let's implement camera scrolling if needed, but for now map 0-RACE_LENGTH to 100-(Width-150)

        const trackStart = 50;
        const trackEnd = canvasWidth - 150;
        const scale = (trackEnd - trackStart) / 1500.0; // Fixed mapping

        const x = trackStart + (racer.position * scale);
        const y = 40 + (laneIndex * laneHeight) + (laneHeight - CAR_HEIGHT) / 2;

        const country = COUNTRIES[code] || { color: '#FFF' };

        // Car Body
        ctx.fillStyle = country.color;

        // Simple car shape (rounded rect)
        ctx.beginPath();
        ctx.roundRect(x, y, CAR_WIDTH, CAR_HEIGHT, 5);
        ctx.fill();

        // Flag indicator above car
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(code, x, y - 5);

        // Influence Badge
        const inf = influence[code] || 0;
        if (inf > 0) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText(`⚡${inf}`, x + CAR_WIDTH + 5, y + CAR_HEIGHT / 2);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const render = () => {
            if (!canvas) return;
            const { width, height } = canvas;

            //Clear
            ctx.clearRect(0, 0, width, height);

            drawTrack(ctx, width, height);

            // Draw Racers
            const laneHeight = (height - 40) / 8;
            Object.entries(racers).forEach(([code, racer], index) => {
                drawCar(ctx, racer, code, index, laneHeight, 1500, width);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, [racers, influence]); // Re-bind if racers object reference changes heavily

    // Resize handling
    useEffect(() => {
        const resize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight - 100; // Minus bottom bar
            }
        };
        window.addEventListener('resize', resize);
        resize();
        return () => window.removeEventListener('resize', resize);
    }, []);

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

    return (
        <div className="flex flex-col h-full bg-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-[#5D9CEC] flex-shrink-0">
                <button onClick={handleHomeClick} className="text-4xl hover:scale-110 transition-transform">🏠</button>
                <h1 className="text-3xl font-black text-yellow-400 italic"
                    style={{ WebkitTextStroke: '1px #B8860B' }}>
                    Race of Nations
                </h1>
                <button onClick={props.onOpenSettings} className="text-4xl hover:scale-110 transition-transform">⚙️</button>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative overflow-hidden">
                <canvas ref={canvasRef} className="block w-full h-full" />

                {/* Confirmation Modal */}
                {showConfirm && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
                        <div className="bg-white text-black p-6 rounded-lg shadow-xl text-center border-4 border-yellow-400">
                            <h3 className="text-2xl font-bold mb-6">End Race & Return to Lobby?</h3>
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

            {/* Bottom Bar - Marquee Reused */}
            <CountryMarquee title="Enter your country name/ code to boost your car" />
        </div>
    );
};

export default RaceView;
