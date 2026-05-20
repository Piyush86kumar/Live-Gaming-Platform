import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { COUNTRIES } from '../utils/countries';
import CountryMarquee from './CountryMarquee';

import {
  CANVAS_W, CANVAS_H, LANE_COUNT, LANE_HEIGHT, TRACK_TOP,
  CAR_DISPLAY_W, CAR_DISPLAY_H, RACE_DISTANCE, START_X, FINISH_X,
  FINISH_STOP_OFFSET, OBSTACLE_ANIM_SPEED, OBSTACLE_ANIM_FRAMES,
  OBSTACLE_DISPLAY_W, OBSTACLE_DISPLAY_H, SPRITE_CAR_W, SPRITE_CAR_H,
} from '../game/constants';
import { loadCarSprite, loadAllObstacleSprites, loadFlagImage } from '../game/assets';
import { renderCountryCar } from '../game/livery';
import { roundRect } from '../game/utils';

const SERVER_RACE_LENGTH = 1500; // Matches server config

const RaceView = (props) => {
    const canvasRef = useRef(null);
    const { gameState, adminResetRace } = useGame();
    const { racers, influence, obstacles = [] } = gameState;
    const [showConfirm, setShowConfirm] = useState(false);
    
    const [assetsReady, setAssetsReady] = useState(false);
    const [loadError, setLoadError] = useState(null);
    
    // Using refs to keep the game loop decoupled from React state renders
    const gameRef = useRef(null);
    const obstacleSpritesRef = useRef({});
    const racersRef = useRef(racers);
    const influenceRef = useRef(influence);
    const obstaclesRef = useRef(obstacles);
    const initDoneRef = useRef(false);

    // Sync latest server state to refs
    useEffect(() => {
        racersRef.current = racers;
        influenceRef.current = influence;
        obstaclesRef.current = obstacles || [];
    }, [racers, influence, obstacles]);

    const initGame = useCallback(async () => {
        try {
            const carSprite = await loadCarSprite();
            obstacleSpritesRef.current = await loadAllObstacleSprites();

            const cars = [];
            const activeCodes = Object.keys(racersRef.current);
            
            for (let i = 0; i < activeCodes.length; i++) {
                const code = activeCodes[i];
                const countryData = COUNTRIES[code] || { name: code, flag: '' };
                
                let flagImg;
                try {
                    flagImg = await loadFlagImage(countryData.flag || '');
                } catch {
                    flagImg = new Image();
                    flagImg.src = '';
                }
                const renderedCar = renderCountryCar(carSprite, flagImg);

                cars.push({
                    code,
                    x: START_X,
                    lane: i,
                    speed: 0,
                    country: countryData,
                    finished: false,
                    nitroActive: false,
                    nitroFrames: 0,
                    lastInfluence: 0,
                    bounceOffset: 0,
                    renderedCar,
                    spinTimer: 0,
                    spinAngle: 0,
                    slickTimer: 0,
                    slowTimer: 0,
                });
            }

            gameRef.current = {
                cars,
                cameraX: 0,
                particles: [],
                obstacles: [],
            };
            
            setAssetsReady(true);
        } catch (err) {
            console.error('Asset loading failed:', err);
            setLoadError(err.message);
        }
    }, []);

    useEffect(() => {
        if (!initDoneRef.current && Object.keys(racers).length > 0) {
            initDoneRef.current = true;
            initGame();
        }
    }, [racers, initGame]);

    useEffect(() => {
        if (!assetsReady) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId;
        let lastTime = performance.now();

        const gameLoop = (timestamp) => {
            const g = gameRef.current;
            if (!g) return;

            const dt = Math.min((timestamp - lastTime) / 16.667, 2);
            lastTime = timestamp;

            const sRacers = racersRef.current;
            const sInfluence = influenceRef.current;
            const sObstacles = obstaclesRef.current;

            const mappedObstacles = [];
            for (let i = 0; i < sObstacles.length; i++) {
                const sObs = sObstacles[i];
                const existing = g.obstacles.find(o => o.id === sObs.id);
                const localHitBy = existing ? existing.localHitBy : new Set();
                
                const mappedObs = {
                    ...sObs,
                    x: START_X + (sObs.x / SERVER_RACE_LENGTH) * RACE_DISTANCE,
                    laneY: TRACK_TOP + sObs.lane * LANE_HEIGHT + LANE_HEIGHT / 2,
                    animTimer: existing ? existing.animTimer : 0,
                    animFrame: existing ? existing.animFrame : 0,
                    localHitBy: localHitBy
                };

                // Trigger visual effects based on server truth
                if (sObs.hitBy) {
                    for (const country of sObs.hitBy) {
                        if (!localHitBy.has(country)) {
                            localHitBy.add(country);
                            const car = g.cars.find(c => c.code === country);
                            if (car) {
                                if (sObs.type === 'banana') car.spinTimer = 45;
                                else if (sObs.type === 'oil') car.slickTimer = 60;
                                else if (sObs.type === 'rock') car.slowTimer = 80;
                                
                                // Spawn particles
                                for (let p = 0; p < 8; p++) {
                                    const angle = Math.random() * Math.PI * 2;
                                    const spd = 1 + Math.random() * 3;
                                    g.particles.push({
                                        x: mappedObs.x,
                                        y: mappedObs.laneY,
                                        vx: Math.cos(angle) * spd,
                                        vy: Math.sin(angle) * spd,
                                        life: 15 + Math.random() * 10,
                                        maxLife: 25,
                                        color: sObs.type === 'banana' ? '#FFE135' : sObs.type === 'oil' ? '#1a1a2e' : '#888888',
                                        size: 2 + Math.random() * 3,
                                    });
                                }
                            }
                        }
                    }
                }
                mappedObstacles.push(mappedObs);
            }
            g.obstacles = mappedObstacles;

            // ═══ UPDATE ═══
            for (let i = 0; i < g.cars.length; i++) {
                const car = g.cars[i];
                const sCar = sRacers[car.code];
                
                if (sCar) {
                    const targetX = START_X + (sCar.position / SERVER_RACE_LENGTH) * RACE_DISTANCE;
                    const actualSpeed = Math.max(0, targetX - car.x) / dt;
                    
                    car.x += (targetX - car.x) * 0.2; // Smooth interpolate
                    
                    if (actualSpeed > 0.1) {
                        car.bounceOffset = Math.sin(timestamp * 0.015 + car.lane * 30) * Math.min(actualSpeed * 0.5, 1.5);
                    } else {
                        car.bounceOffset = 0;
                    }

                    if (car.spinTimer > 0) car.spinTimer -= dt;
                    if (car.slickTimer > 0) car.slickTimer -= dt;
                    if (car.slowTimer > 0) car.slowTimer -= dt;
                    car.spinAngle += (car.spinTimer > 0 ? 0.35 : 0) * dt;

                    const inf = sInfluence[car.code] || 0;
                    if (inf > car.lastInfluence) {
                        car.lastInfluence = inf;
                        car.nitroFrames = 45;
                    }
                    
                    if (car.nitroFrames > 0) {
                        car.nitroFrames -= dt;
                        car.nitroActive = true;
                        
                        const laneY = TRACK_TOP + car.lane * LANE_HEIGHT + LANE_HEIGHT / 2;
                        if (Math.random() > 0.5) {
                            g.particles.push({
                                x: car.x - CAR_DISPLAY_W / 2,
                                y: laneY + (Math.random() - 0.5) * 10,
                                vx: -(2 + Math.random() * 3),
                                vy: (Math.random() - 0.5) * 2,
                                life: 15 + Math.random() * 10,
                                maxLife: 25,
                                color: Math.random() > 0.5 ? '#FF6600' : '#FFAA00',
                                size: 3 + Math.random() * 3,
                            });
                        }
                    } else {
                        car.nitroActive = false;
                    }
                    
                    if (sCar.finished && !car.finished) {
                        car.finished = true;
                    }
                }
            }

            g.particles = g.particles.filter(p => {
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.life -= dt;
                return p.life > 0;
            });

            // Camera: Follow the leader
            let leaderX = START_X;
            for (const car of g.cars) {
                if (car.x > leaderX) leaderX = car.x;
            }
            const targetCameraX = leaderX - CANVAS_W * 0.25;
            g.cameraX += (targetCameraX - g.cameraX) * 0.08 * dt;
            g.cameraX = Math.max(0, g.cameraX);

            // ═══ RENDER ═══
            ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

            const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
            skyGrad.addColorStop(0, '#1a1a2e');
            skyGrad.addColorStop(0.3, '#16213e');
            skyGrad.addColorStop(1, '#0f3460');
            ctx.fillStyle = skyGrad;
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            for (let i = 0; i < 50; i++) {
                const sx = ((i * 137 + 50) % CANVAS_W);
                const sy = ((i * 97 + 30) % (TRACK_TOP - 30));
                ctx.beginPath();
                ctx.arc(sx, sy, 0.5 + (i % 3) * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }

            const groundGrad = ctx.createLinearGradient(0, TRACK_TOP + LANE_COUNT * LANE_HEIGHT, 0, CANVAS_H);
            groundGrad.addColorStop(0, '#2d5016');
            groundGrad.addColorStop(1, '#1a3a0a');
            ctx.fillStyle = groundGrad;
            ctx.fillRect(0, TRACK_TOP + LANE_COUNT * LANE_HEIGHT, CANVAS_W, CANVAS_H - TRACK_TOP - LANE_COUNT * LANE_HEIGHT);

            const standGrad = ctx.createLinearGradient(0, 0, 0, TRACK_TOP);
            standGrad.addColorStop(0, '#333344');
            standGrad.addColorStop(1, '#444466');
            ctx.fillStyle = standGrad;
            ctx.fillRect(0, TRACK_TOP - 40, CANVAS_W, 40);
            for (let i = 0; i < 200; i++) {
                const cx = (i * 17 + (g.cameraX * 0.1) % 17) % CANVAS_W;
                const cy = TRACK_TOP - 35 + (i % 5) * 6;
                const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94', '#88D8B0'];
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }

            const trackGrad = ctx.createLinearGradient(0, TRACK_TOP, 0, TRACK_TOP + LANE_COUNT * LANE_HEIGHT);
            trackGrad.addColorStop(0, '#555555');
            trackGrad.addColorStop(0.5, '#4a4a4a');
            trackGrad.addColorStop(1, '#404040');
            ctx.fillStyle = trackGrad;
            ctx.fillRect(0, TRACK_TOP, CANVAS_W, LANE_COUNT * LANE_HEIGHT);

            for (let i = 0; i < CANVAS_W / 12 + 1; i++) {
                const bx = i * 12 - (g.cameraX % 12);
                ctx.fillStyle = i % 2 === 0 ? '#DD0000' : '#FFFFFF';
                ctx.fillRect(bx, TRACK_TOP - 6, 12, 6);
                ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#DD0000';
                ctx.fillRect(bx, TRACK_TOP + LANE_COUNT * LANE_HEIGHT, 12, 6);
            }

            ctx.setLineDash([16, 12]);
            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 2;
            for (let i = 1; i < LANE_COUNT; i++) {
                const ly = TRACK_TOP + i * LANE_HEIGHT;
                ctx.beginPath();
                ctx.moveTo(0, ly);
                ctx.lineTo(CANVAS_W, ly);
                ctx.stroke();
            }
            ctx.setLineDash([]);

            for (let i = 0; i < g.cars.length; i++) {
                const car = g.cars[i];
                const laneY = TRACK_TOP + car.lane * LANE_HEIGHT + LANE_HEIGHT / 2;
                const labelX = 15 - g.cameraX;
                if (labelX > -80 && labelX < CANVAS_W) {
                    if (car.renderedCar) {
                        ctx.drawImage(car.renderedCar, 0, 0, SPRITE_CAR_W, SPRITE_CAR_H,
                            labelX, laneY - 6, 20, 12);
                    }
                    ctx.fillStyle = 'rgba(255,255,255,0.7)';
                    ctx.font = '9px monospace';
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(car.country.name, labelX + 24, laneY);
                }
            }

            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            for (let d = 1000; d < RACE_DISTANCE; d += 1000) {
                const mx = START_X + d - g.cameraX;
                if (mx > 0 && mx < CANVAS_W) {
                    ctx.fillStyle = 'rgba(255,255,255,0.15)';
                    ctx.fillRect(mx, TRACK_TOP, 1, LANE_COUNT * LANE_HEIGHT);
                    ctx.fillStyle = 'rgba(255,255,255,0.3)';
                    ctx.fillText(`${d}m`, mx, TRACK_TOP - 10);
                }
            }

            const startScreenX = START_X - g.cameraX;
            if (startScreenX > -10 && startScreenX < CANVAS_W) {
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                ctx.fillRect(startScreenX, TRACK_TOP, 3, LANE_COUNT * LANE_HEIGHT);
            }

            const finishScreenX = FINISH_X - g.cameraX;
            if (finishScreenX > -30 && finishScreenX < CANVAS_W + 30) {
                const checkerSize = 8;
                for (let col = 0; col < 3; col++) {
                    for (let row = 0; row < LANE_COUNT * LANE_HEIGHT / checkerSize; row++) {
                        ctx.fillStyle = (row + col) % 2 === 0 ? '#FFFFFF' : '#111111';
                        ctx.fillRect(finishScreenX + col * checkerSize, TRACK_TOP + row * checkerSize, checkerSize, checkerSize);
                    }
                }
                ctx.fillStyle = '#FFD700';
                ctx.font = 'bold 11px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('FINISH', finishScreenX + 12, TRACK_TOP - 12);
            }

            for (const p of g.particles) {
                const alpha = p.life / p.maxLife;
                const px = p.x - g.cameraX;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(px, p.y, p.size * alpha, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            const obsSprites = obstacleSpritesRef.current;
            for (const obs of g.obstacles) {
                const ox = obs.x - g.cameraX;
                if (ox < -OBSTACLE_DISPLAY_W || ox > CANVAS_W + OBSTACLE_DISPLAY_W) continue;
                
                obs.animTimer += dt;
                if (obs.animTimer >= OBSTACLE_ANIM_SPEED) {
                    obs.animTimer = 0;
                    obs.animFrame = (obs.animFrame + 1) % OBSTACLE_ANIM_FRAMES;
                }

                const spriteData = obsSprites[obs.type];
                if (spriteData && spriteData.img && spriteData.frameWidth > 0) {
                    ctx.save();
                    ctx.translate(ox, obs.laneY);
                    const srcX = obs.animFrame * spriteData.frameWidth;
                    ctx.drawImage(
                        spriteData.img, srcX, 0, spriteData.frameWidth, spriteData.frameHeight,
                        -OBSTACLE_DISPLAY_W / 2, -OBSTACLE_DISPLAY_H / 2, OBSTACLE_DISPLAY_W, OBSTACLE_DISPLAY_H
                    );
                    ctx.restore();
                }
            }

            for (const car of g.cars) {
                if (!car.renderedCar) continue;
                const laneY = TRACK_TOP + car.lane * LANE_HEIGHT + (LANE_HEIGHT - CAR_DISPLAY_H) / 2;
                const screenX = car.x - g.cameraX;
                if (screenX < -CAR_DISPLAY_W - 20 || screenX > CANVAS_W + 20) continue;

                ctx.save();
                ctx.translate(screenX + CAR_DISPLAY_W / 2, laneY + car.bounceOffset + CAR_DISPLAY_H / 2);

                if (car.spinTimer > 0) ctx.rotate(car.spinAngle);
                ctx.translate(-CAR_DISPLAY_W / 2, -CAR_DISPLAY_H / 2);

                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.beginPath();
                ctx.ellipse(CAR_DISPLAY_W / 2, CAR_DISPLAY_H + 3, CAR_DISPLAY_W / 2 + 2, 4, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.drawImage(car.renderedCar, 0, 0, SPRITE_CAR_W, SPRITE_CAR_H, 0, 0, CAR_DISPLAY_W, CAR_DISPLAY_H);

                if (car.slickTimer > 0) {
                    ctx.globalAlpha = 0.25;
                    ctx.fillStyle = '#1a1a2e';
                    ctx.fillRect(0, 0, CAR_DISPLAY_W, CAR_DISPLAY_H);
                    ctx.globalAlpha = 1;
                }

                if (car.slowTimer > 0) {
                    ctx.globalAlpha = 0.15;
                    ctx.fillStyle = '#FF0000';
                    ctx.fillRect(0, 0, CAR_DISPLAY_W, CAR_DISPLAY_H);
                    ctx.globalAlpha = 1;
                }

                if (car.nitroActive) {
                    const flameLen = 14 + Math.random() * 12;
                    ctx.fillStyle = '#FF6600';
                    ctx.beginPath();
                    ctx.moveTo(2, CAR_DISPLAY_H / 2 - 5);
                    ctx.lineTo(-flameLen, CAR_DISPLAY_H / 2);
                    ctx.lineTo(2, CAR_DISPLAY_H / 2 + 5);
                    ctx.closePath();
                    ctx.fill();
                }

                ctx.restore();
            }

            // Influence Badges / Names over cars
            for (const car of g.cars) {
                const screenX = car.x - g.cameraX;
                const laneY = TRACK_TOP + car.lane * LANE_HEIGHT + (LANE_HEIGHT - CAR_DISPLAY_H) / 2;
                
                // Name Tag
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(screenX + 5, laneY - 14, 24, 12);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 9px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(car.code, screenX + 17, laneY - 5);

                const inf = sInfluence[car.code] || 0;
                if (inf > 0) {
                    ctx.fillStyle = '#FFD700';
                    ctx.font = 'bold 12px Arial';
                    ctx.textAlign = 'left';
                    ctx.fillText(`⚡${Math.ceil(inf)}`, screenX + CAR_DISPLAY_W + 5, laneY + CAR_DISPLAY_H / 2);
                }
            }



            animId = requestAnimationFrame(gameLoop);
        };

        animId = requestAnimationFrame(gameLoop);
        return () => cancelAnimationFrame(animId);
    }, [assetsReady]);

    const handleHomeClick = () => setShowConfirm(true);
    const confirmReset = () => { adminResetRace(); setShowConfirm(false); };
    const cancelReset = () => setShowConfirm(false);

    return (
        <div className="flex flex-col w-full h-full bg-slate-900 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-black/90 to-transparent flex-shrink-0 z-10">
                <button onClick={handleHomeClick} className="text-4xl hover:scale-110 transition-transform filter drop-shadow-md">🏠</button>
                <h1 className="text-3xl font-black text-yellow-400 italic" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)', WebkitTextStroke: '1px #B8860B' }}>
                    Race of Nations
                </h1>
                <button onClick={props.onOpenSettings} className="text-4xl hover:scale-110 transition-transform filter drop-shadow-md">⚙️</button>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden min-h-0">
                {!assetsReady && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                        <div className="text-white text-3xl font-bold font-mono mb-4 animate-pulse">Loading Race Assets...</div>
                        {loadError && <div className="text-red-500">{loadError}</div>}
                    </div>
                )}
                <canvas 
                    ref={canvasRef} 
                    width={CANVAS_W} 
                    height={CANVAS_H} 
                    className="block w-full h-full object-contain"
                    style={{ aspectRatio: `${CANVAS_W}/${CANVAS_H}` }} 
                />

                {/* Countdown */}
                {gameState.phase === 'countdown' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                        <div className="text-white font-bold text-9xl drop-shadow-2xl animate-pulse" style={{
                            textShadow: '0 0 40px rgba(255,50,50,0.8), 0 0 80px rgba(255,50,50,0.4)',
                            fontFamily: 'monospace',
                        }}>
                            {gameState.timer > 0 ? gameState.timer : 'GO!'}
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {showConfirm && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-slate-800 text-white p-6 rounded-xl shadow-2xl text-center border border-slate-600">
                            <h3 className="text-2xl font-bold mb-6 text-yellow-400">End Race & Return to Lobby?</h3>
                            <div className="flex gap-6 justify-center">
                                <button onClick={confirmReset} className="bg-red-500 px-8 py-3 rounded font-bold hover:bg-red-600 shadow-lg text-lg">YES</button>
                                <button onClick={cancelReset} className="bg-slate-600 px-8 py-3 rounded font-bold hover:bg-slate-500 shadow-lg text-lg">NO</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Bar */}
            <div className="flex-shrink-0 bg-gradient-to-t from-black/90 to-transparent z-10 border-t border-white/5">
                <CountryMarquee title="Enter your country name/code to boost your car" countryCodes={Object.keys(racers)} />
            </div>
        </div>
    );
};

export default RaceView;
