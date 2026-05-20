// ============================================================
// FLAG PATTERN GENERATOR — creates a repeating flag texture
// ============================================================
const createFlagPattern = (ctx, code, width = 40, height = 28) => {
    const flagCanvas = document.createElement('canvas');
    flagCanvas.width = width;
    flagCanvas.height = height;
    const f = flagCanvas.getContext('2d');

    // Helper: draw horizontal stripes
    const hStripes = (colors) => {
        const h = height / colors.length;
        colors.forEach((c, i) => {
            f.fillStyle = c;
            f.fillRect(0, i * h, width, h);
        });
    };
    // Helper: draw vertical stripes
    const vStripes = (colors) => {
        const w = width / colors.length;
        colors.forEach((c, i) => {
            f.fillStyle = c;
            f.fillRect(i * w, 0, w, height);
        });
    };

    switch (code) {
        case 'USA':
            hStripes(['#B22234', '#fff', '#B22234', '#fff', '#B22234', '#fff', '#B22234']);
            f.fillStyle = '#3C3B6E'; f.fillRect(0, 0, width * 0.4, height * 0.54);
            break;
        case 'IND':
            hStripes(['#FF9932', '#fff', '#138808']);
            f.strokeStyle = '#000080'; f.lineWidth = 1;
            f.beginPath(); f.arc(width / 2, height / 2, 5, 0, Math.PI * 2); f.stroke();
            break;
        case 'AUS':
            f.fillStyle = '#00008B'; f.fillRect(0, 0, width, height);
            // Simplified Union Jack corner
            f.fillStyle = '#012169'; f.fillRect(0, 0, width * 0.35, height * 0.5);
            f.strokeStyle = '#fff'; f.lineWidth = 2;
            f.beginPath(); f.moveTo(0, 0); f.lineTo(width * 0.35, height * 0.5); f.stroke();
            f.beginPath(); f.moveTo(width * 0.35, 0); f.lineTo(0, height * 0.5); f.stroke();
            // Stars
            f.fillStyle = '#fff';
            [[width * 0.7, height * 0.25], [width * 0.8, height * 0.4], [width * 0.75, height * 0.6], [width * 0.6, height * 0.7], [width * 0.85, height * 0.75]]
                .forEach(([x, y]) => { f.beginPath(); f.arc(x, y, 1.5, 0, Math.PI * 2); f.fill(); });
            break;
        case 'CAN':
            vStripes(['#FF0000', '#fff', '#FF0000']);
            f.fillStyle = '#FF0000'; f.beginPath();
            f.moveTo(width / 2, height * 0.25); f.lineTo(width * 0.55, height * 0.4);
            f.lineTo(width * 0.5, height * 0.45); f.lineTo(width * 0.58, height * 0.55);
            f.lineTo(width * 0.5, height * 0.75); f.lineTo(width * 0.42, height * 0.55);
            f.lineTo(width * 0.5, height * 0.45); f.lineTo(width * 0.45, height * 0.4);
            f.closePath(); f.fill();
            break;
        case 'UK':
            f.fillStyle = '#012169'; f.fillRect(0, 0, width, height);
            f.strokeStyle = '#fff'; f.lineWidth = 3;
            f.beginPath(); f.moveTo(0, 0); f.lineTo(width, height); f.stroke();
            f.beginPath(); f.moveTo(width, 0); f.lineTo(0, height); f.stroke();
            f.strokeStyle = '#C8102E'; f.lineWidth = 1.5;
            f.beginPath(); f.moveTo(0, 0); f.lineTo(width, height); f.stroke();
            f.beginPath(); f.moveTo(width, 0); f.lineTo(0, height); f.stroke();
            f.fillStyle = '#fff'; f.fillRect(0, height * 0.4, width, height * 0.2);
            f.fillRect(width * 0.4, 0, width * 0.2, height);
            f.fillStyle = '#C8102E'; f.fillRect(0, height * 0.45, width, height * 0.1);
            f.fillRect(width * 0.45, 0, width * 0.1, height);
            break;
        case 'JPN':
            f.fillStyle = '#fff'; f.fillRect(0, 0, width, height);
            f.fillStyle = '#BC002D'; f.beginPath(); f.arc(width / 2, height / 2, 7, 0, Math.PI * 2); f.fill();
            break;
        case 'CHN':
            f.fillStyle = '#DE2910'; f.fillRect(0, 0, width, height);
            f.fillStyle = '#FFDE00';
            [[4, 4], [8, 7], [8, 12], [4, 15], [1, 11]].forEach(([x, y], i) => {
                f.beginPath(); f.arc(x, y, i === 0 ? 2.5 : 1.5, 0, Math.PI * 2); f.fill();
            });
            break;
        case 'ESP':
            hStripes(['#AA151B', '#F1BF00', '#AA151B']);
            break;
        case 'MEX':
            vStripes(['#006847', '#fff', '#CE1126']);
            f.fillStyle = '#8B4513'; f.beginPath(); f.arc(width / 2, height / 2, 3, 0, Math.PI * 2); f.fill();
            break;
        case 'GER':
            hStripes(['#000', '#DD0000', '#FFCE00']);
            break;
        case 'FRA':
            vStripes(['#002395', '#fff', '#ED2939']);
            break;
        case 'ITA':
            vStripes(['#009246', '#fff', '#CE2B37']);
            break;
        case 'BRA':
            hStripes(['#009C3B', '#FFDF00', '#009C3B']);
            f.fillStyle = '#002776'; f.beginPath(); f.arc(width / 2, height / 2, 6, 0, Math.PI * 2); f.fill();
            break;
        case 'ARG':
            hStripes(['#75AADB', '#fff', '#75AADB']);
            f.fillStyle = '#F6B40E'; f.beginPath(); f.arc(width / 2, height / 2, 4, 0, Math.PI * 2); f.fill();
            break;
        case 'TUR':
            f.fillStyle = '#E30A17'; f.fillRect(0, 0, width, height);
            f.fillStyle = '#fff'; f.beginPath(); f.arc(width * 0.4, height / 2, 5, 0, Math.PI * 2); f.fill();
            f.fillStyle = '#E30A17'; f.beginPath(); f.arc(width * 0.45, height / 2, 4, 0, Math.PI * 2); f.fill();
            f.fillStyle = '#fff'; f.beginPath();
            f.moveTo(width * 0.58, height * 0.35); f.lineTo(width * 0.65, height * 0.42);
            f.lineTo(width * 0.62, height * 0.42); f.lineTo(width * 0.64, height * 0.5);
            f.lineTo(width * 0.6, height * 0.46); f.lineTo(width * 0.56, height * 0.5);
            f.lineTo(width * 0.58, height * 0.42); f.lineTo(width * 0.55, height * 0.42);
            f.closePath(); f.fill();
            break;
        case 'POL':
            hStripes(['#fff', '#DC143C']);
            break;
        case 'NED':
            hStripes(['#AE1C28', '#fff', '#21468B']);
            break;
        default:
            // Fallback: use the solid color with a subtle gradient
            const grd = f.createLinearGradient(0, 0, 0, height);
            grd.addColorStop(0, '#fff');
            grd.addColorStop(0.5, COUNTRIES[code]?.color || '#999');
            grd.addColorStop(1, '#333');
            f.fillStyle = grd; f.fillRect(0, 0, width, height);
    }

    return ctx.createPattern(flagCanvas, 'repeat');
};

// ============================================================
// CAR SHAPE PATH — side-view race car silhouette
// ============================================================
const drawCarBodyPath = (ctx, x, y, w, h) => {
    ctx.beginPath();
    // Start at front bottom (behind nose)
    ctx.moveTo(x + w * 0.05, y + h * 0.62);
    // Front nose cone
    ctx.lineTo(x, y + h * 0.45);
    ctx.lineTo(x + w * 0.02, y + h * 0.28);
    // Hood
    ctx.lineTo(x + w * 0.18, y + h * 0.22);
    // Windshield
    ctx.lineTo(x + w * 0.28, y + h * 0.06);
    // Roof
    ctx.lineTo(x + w * 0.62, y + h * 0.06);
    // Rear window
    ctx.lineTo(x + w * 0.70, y + h * 0.18);
    // Trunk deck
    ctx.lineTo(x + w * 0.82, y + h * 0.20);
    // Rear spoiler upright
    ctx.lineTo(x + w * 0.84, y + h * 0.05);
    // Spoiler top
    ctx.lineTo(x + w * 0.90, y + h * 0.05);
    // Spoiler back down
    ctx.lineTo(x + w * 0.88, y + h * 0.22);
    // Rear bumper
    ctx.lineTo(x + w * 0.92, y + h * 0.55);
    // Rear bottom (above wheel)
    ctx.lineTo(x + w * 0.78, y + h * 0.58);
    // Rear wheel well
    ctx.lineTo(x + w * 0.74, y + h * 0.78);
    ctx.lineTo(x + w * 0.58, y + h * 0.78);
    ctx.lineTo(x + w * 0.54, y + h * 0.58);
    // Between wheels (skirt)
    ctx.lineTo(x + w * 0.42, y + h * 0.58);
    // Front wheel well
    ctx.lineTo(x + w * 0.38, y + h * 0.78);
    ctx.lineTo(x + w * 0.22, y + h * 0.78);
    ctx.lineTo(x + w * 0.18, y + h * 0.58);
    // Front bumper bottom
    ctx.lineTo(x + w * 0.08, y + h * 0.58);
    ctx.closePath();
};

// ============================================================
// WHEEL DRAWER
// ============================================================
const drawWheel = (ctx, cx, cy, r) => {
    // Tire
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#0a0a0a'; ctx.lineWidth = 1.5;
    ctx.stroke();
    // Rim
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2); ctx.fill();
    // Hub
    ctx.fillStyle = '#666';
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2); ctx.fill();
    // Spokes
    ctx.strokeStyle = '#888'; ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        const ang = (i * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * r * 0.5, cy + Math.sin(ang) * r * 0.5);
        ctx.stroke();
    }
};

// ============================================================
// REPLACEMENT drawCar
// ============================================================
const drawCar = (ctx, racer, code, laneIndex, laneHeight, totalLength, canvasWidth) => {
    const trackStart = 50;
    const trackEnd = canvasWidth - 150;
    const scale = (trackEnd - trackStart) / 1500.0;
    const x = trackStart + (racer.position * scale);
    const y = 40 + (laneIndex * laneHeight) + (laneHeight - CAR_HEIGHT) / 2;

    ctx.save();

    // 1. Drop shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(x + CAR_WIDTH / 2, y + CAR_HEIGHT - 2, CAR_WIDTH / 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Car body (filled with flag pattern)
    drawCarBodyPath(ctx, x, y, CAR_WIDTH, CAR_HEIGHT);
    const pattern = createFlagPattern(ctx, code);
    if (pattern) {
        ctx.fillStyle = pattern;
    } else {
        ctx.fillStyle = COUNTRIES[code]?.color || '#ccc';
    }
    ctx.fill();

    // Body outline / edge highlight
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 3. Cockpit window (dark glass)
    ctx.fillStyle = 'rgba(20, 30, 50, 0.85)';
    ctx.beginPath();
    ctx.moveTo(x + CAR_WIDTH * 0.30, y + CAR_HEIGHT * 0.18);
    ctx.lineTo(x + CAR_WIDTH * 0.28, y + CAR_HEIGHT * 0.08);
    ctx.lineTo(x + CAR_WIDTH * 0.58, y + CAR_HEIGHT * 0.08);
    ctx.lineTo(x + CAR_WIDTH * 0.56, y + CAR_HEIGHT * 0.18);
    ctx.closePath();
    ctx.fill();
    // Window glare
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + CAR_WIDTH * 0.32, y + CAR_HEIGHT * 0.14);
    ctx.lineTo(x + CAR_WIDTH * 0.54, y + CAR_HEIGHT * 0.14);
    ctx.stroke();

    // 4. Wheels (drawn on top so they cover body edges)
    const wheelR = CAR_HEIGHT * 0.22;
    drawWheel(ctx, x + CAR_WIDTH * 0.30, y + CAR_HEIGHT * 0.78, wheelR); // front
    drawWheel(ctx, x + CAR_WIDTH * 0.66, y + CAR_HEIGHT * 0.78, wheelR); // rear

    // 5. Country code on rear wing
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(x + CAR_WIDTH * 0.83, y + CAR_HEIGHT * 0.08, 18, 10);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(code, x + CAR_WIDTH * 0.91, y + CAR_HEIGHT * 0.16);

    // 6. Influence badge (nitro) — floating above car
    const inf = influence[code] || 0;
    if (inf > 0) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`⚡${inf}`, x + CAR_WIDTH + 6, y + CAR_HEIGHT * 0.35);
    }

    ctx.restore();
};