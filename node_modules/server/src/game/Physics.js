const { MAX_SPEED_MULTIPLIER } = require('../config/constants');

class Physics {
    static calculateSpeed(baseSpeed, influence, boostMultiplier) {
        // Standard formula: speed = base * (1 + log10(influence + 1) * multiplier)
        const multiplier = 1 + Math.log10(influence + 1) * boostMultiplier;
        return Math.min(multiplier, MAX_SPEED_MULTIPLIER) * baseSpeed;
    }

    static checkCollision(racer, obstacle) {
        // racer.position is mapped to 0-1500. The car sprite visually extends forward.
        // We match the client's visual hit box exactly (scaled by 0.25).
        const dx = (racer.position + 8) - obstacle.x;
        return Math.abs(dx) < 10;
    }
}

module.exports = Physics;
