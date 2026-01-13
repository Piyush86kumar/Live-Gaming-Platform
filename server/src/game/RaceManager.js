const {
    FPS,
    RACE_LENGTH,
    DEFAULT_LOBBY_TIMER,
    DEFAULT_RESET_TIMER,
    BASE_SPEED,
    BOOST_MULTIPLIER_DEFAULT
} = require('../config/constants');
const Physics = require('./Physics');

class RaceManager {
    constructor(io) {
        this.io = io;
        this.state = {
            phase: 'lobby', // lobby, racing, results
            timer: DEFAULT_LOBBY_TIMER,
            racers: {}, // { 'USA': { position: 0, speed: 0, finished: false, ... } }
            votes: {}, // { 'USA': 10, 'IND': 5 } - Lobby votes
            influence: {}, // { 'USA': 100 } - Racing influence
            obstacles: [],
            winner: null,
            rankings: []
        };

        this.settings = {
            boostMultiplier: BOOST_MULTIPLIER_DEFAULT,
            baseSpeed: BASE_SPEED
        };

        this.loopInterval = null;
        this.lastUpdateTime = Date.now();
    }

    init() {
        this.startLobby();
        this.startGameLoop();
    }

    startGameLoop() {
        const tickRate = 1000 / FPS;
        this.loopInterval = setInterval(() => {
            this.update();
        }, tickRate);
    }

    update() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        if (this.state.phase === 'lobby') {
            // Timer logic handles elsewhere via second-interval or tick check
            // For simplicity, we'll decrement timer 
            // But usually timers are best handled by separate interval to avoid drift, 
            // or just trust the tick for now.
        } else if (this.state.phase === 'racing') {
            this.updateRaceLogic();
        }
    }

    // Called constantly during racing phase
    updateRaceLogic() {
        let allFinished = true;
        let activeRacers = false;

        for (const [country, racer] of Object.entries(this.state.racers)) {
            if (!racer.finished) {
                allFinished = false;
                activeRacers = true;

                // correct speed calc
                const speed = Physics.calculateSpeed(
                    this.settings.baseSpeed,
                    this.state.influence[country] || 0,
                    this.settings.boostMultiplier
                );

                // Apply speed (pixels per frame)
                racer.position += speed;
                racer.speed = speed; // Sync for client

                if (racer.position >= RACE_LENGTH) {
                    racer.finished = true;
                    racer.finishTime = Date.now();
                    this.state.rankings.push({ country, ...racer });

                    if (!this.state.winner) {
                        this.state.winner = country;
                        // Trigger win music/event?
                    }
                }
            }
        }

        this.io.emit('race_update', {
            racers: this.state.racers,
            influence: this.state.influence
        });

        if (Object.keys(this.state.racers).length > 0 && allFinished) {
            this.endRace();
        }
    }

    startLobby() {
        this.state.phase = 'lobby';
        this.state.timer = DEFAULT_LOBBY_TIMER;
        this.state.racers = {};
        this.state.votes = {};
        this.state.influence = {};
        this.state.winner = null;
        this.state.rankings = [];

        this.io.emit('phase_change', 'lobby');
        this.io.emit('lobby_update', this.state);

        // Start Countdown
        this.timerInterval = setInterval(() => {
            if (this.state.phase !== 'lobby') {
                clearInterval(this.timerInterval);
                return;
            }

            this.state.timer--;
            this.io.emit('timer_update', this.state.timer);

            if (this.state.timer <= 0) {
                clearInterval(this.timerInterval);
                this.startRace();
            }
        }, 1000);
    }

    resetTimer() {
        if (this.state.phase === 'lobby') {
            this.state.timer = DEFAULT_LOBBY_TIMER;
            this.io.emit('timer_update', this.state.timer);
        }
    }

    startRace() {
        // Determine top 8 countries or use voting
        const countries = Object.keys(this.state.votes).length > 0
            ? Object.keys(this.state.votes)
            : ['USA', 'CHN', 'IND', 'GBR', 'JPN', 'GER', 'FRA', 'BRA']; // Defaults if empty

        // Select top 8 if more
        const selectedCountries = countries.slice(0, 8);

        this.state.phase = 'racing';

        selectedCountries.forEach(code => {
            this.state.racers[code] = {
                position: 0,
                baseSpeed: this.settings.baseSpeed,
                finished: false,
                lane: 0 // Will assign proper lane indices in client or here
            };
            // Initial influence from votes? optional
            this.state.influence[code] = this.state.votes[code] || 0;
        });

        this.io.emit('phase_change', 'racing');
        this.io.emit('race_start', {
            racers: this.state.racers,
            config: { length: RACE_LENGTH }
        });
    }

    endRace() {
        this.state.phase = 'results';
        this.state.timer = DEFAULT_RESET_TIMER;

        this.io.emit('phase_change', 'results');
        this.io.emit('race_finished', {
            winner: this.state.winner,
            rankings: this.state.rankings
        });

        // Start Result Countdown
        this.timerInterval = setInterval(() => {
            if (this.state.phase !== 'results') {
                clearInterval(this.timerInterval);
                return;
            }

            this.state.timer--;
            this.io.emit('timer_update', this.state.timer);

            if (this.state.timer <= 0) {
                clearInterval(this.timerInterval);
                this.startLobby();
            }
        }, 1000);
    }

    // --- External Events ---

    handleVote(country) {
        if (this.state.phase !== 'lobby') return;
        this.state.votes[country] = (this.state.votes[country] || 0) + 1;
        this.io.emit('votes_update', this.state.votes);
    }

    handleChatMessage(user, message) {
        // Normalize message
        const text = message.trim().toLowerCase();

        let foundCode = null;

        // Smart matching against Country Config
        const COUNTRIES = require('../config/countries');
        for (const [code, details] of Object.entries(COUNTRIES)) {
            // Check keywords
            if (details.keywords.some(k => text === k || text.startsWith(k + ' '))) {
                foundCode = code;
                break;
            }
        }

        // Fallback: Check if message is exactly 3 letters and is a valid code key
        if (!foundCode && text.length === 3 && COUNTRIES[text.toUpperCase()]) {
            foundCode = text.toUpperCase();
        }

        if (!foundCode) return; // No match found

        if (this.state.phase === 'lobby') {
            this.handleVote(foundCode);
        } else if (this.state.phase === 'racing') {
            // Add influence
            if (this.state.racers[foundCode]) {
                this.state.influence[foundCode] = (this.state.influence[foundCode] || 0) + 1;
            }
        }
    }
}

module.exports = RaceManager;
