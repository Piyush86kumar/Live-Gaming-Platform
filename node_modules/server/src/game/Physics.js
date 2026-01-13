const { MAX_SPEED_MULTIPLIER } = require('../config/constants');

class Physics {
    static calculateSpeed(baseSpeed, influence, boostMultiplier) {
        // Standard formula: speed = base * (1 + log10(influence + 1) * multiplier)
        const multiplier = 1 + Math.log10(influence + 1) * boostMultiplier;
        return Math.min(multiplier, MAX_SPEED_MULTIPLIER) * baseSpeed;
    }

    static checkCollision(racer, obstacle) {
        // Simple 1D collision for now since lanes are separate
        // Assuming obstacle has x and width, and checks if racer is within bounds
        // This might be more complex if we have lane changing or 2D movement later
        // For now, let's assume obstacles are point-based on the track line
        const hitDistance = 20; // pixels
        return Math.abs(racer.position - obstacle.x) < hitDistance;
    }
}

module.exports = Physics;
