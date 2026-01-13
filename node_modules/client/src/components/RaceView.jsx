import React, { useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../utils/countries';

// Assets placeholders
// In a real app, pre-load images
const CAR_WIDTH = 60;
const CAR_HEIGHT = 30;

const RaceView = (props) => {
    const canvasRef = useRef(null);
    const { gameState, voteCountry } = useGame();
    const { racers, influence } = gameState;

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
        const finishX = width - 100;
        const squareSize = 20;
        for (let y = 40; y < height; y += squareSize) {
            for (let x = finishX; x < finishX + 40; x += squareSize) {
                ctx.fillStyle = ((x + y) / squareSize) % 2 === 0 ? 'white' : 'black';
                ctx.fillRect(x, y, squareSize, squareSize);
            }
        }
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
    }, [racers, influence]); // Re-bind if racers object reference changes heavily, but mostly relies on ref access if we used refs. 
    // Since racers is state, it triggers re-render of component, which updates effect. 
    // Logic inside render loop usually reads from mutable ref for smooth anim, 
    // but with React state updates triggering re-renders, correct way is 
    // to just draw current state. 60FPS from server means 60 state updates per sec? 
    // That might overwhelm React. 
    // Ideally we use a ref for racers that gets updated without re-render, 
    // and requestAnimationFrame loop reads that ref.
    // But for MVP, let's see if React can handle 60Hz re-renders. (It usually can't smoothly).
    // Optimization: Use a Ref for racersState in GameContext to avoid widespread re-renders, 
    // or just accept it might be 30fps effectively.

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

    return (
        <div className="flex flex-col h-full bg-slate-800">
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-[#5D9CEC]">
                <button className="text-2xl">🏠</button>
                <h1 className="text-3xl font-black text-yellow-400 italic"
                    style={{ WebkitTextStroke: '1px #B8860B' }}>
                    Race in Progress
                </h1>
                <button onClick={props.onOpenSettings} className="text-2xl hover:scale-110 transition-transform">⚙️</button>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative">
                <canvas ref={canvasRef} className="block w-full h-full" />
            </div>

            {/* Bottom Bar */}
            <div className="bg-black text-white p-4">
                <p className="text-center text-xl font-bold mb-4">Chat country code to boost!</p>
                <div className="flex justify-center gap-6 overflow-x-auto pb-2">
                    {Object.keys(racers).map(code => (
                        <button
                            key={code}
                            onClick={() => voteCountry(code)}
                            className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
                        >
                            <img src={COUNTRIES[code]?.flag} alt={code} className="w-16 h-10 object-cover border border-white" />
                            <span className="font-bold">{code}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RaceView;
