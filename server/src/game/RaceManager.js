const {
    FPS,
    RACE_LENGTH,
    DEFAULT_LOBBY_TIMER,
    DEFAULT_RESET_TIMER,
    BASE_SPEED,
    BOOST_MULTIPLIER_DEFAULT
} = require('../config/constants');
const Physics = require('./Physics');
const DataManager = require('./DataManager');
const COUNTRIES = require('../config/countries');

class RaceManager {
    constructor(io) {
        this.io = io;
        this.state = {
            phase: 'lobby', // lobby, racing, results
            timer: DEFAULT_LOBBY_TIMER,
            timerEndsAt: 0,
            racers: {},
            votes: {},
            influence: {},
            obstacles: [],
            winner: null,
            rankings: [],
            sessionTop10: []
        };

        this.settings = {
            boostMultiplier: BOOST_MULTIPLIER_DEFAULT,
            baseSpeed: BASE_SPEED
        };

        this.loopInterval = null;
        this.lastUpdateTime = Date.now();
        this.phaseStartedAt = Date.now(); // To prevent immediate transitions
    }

    init() {
        console.log('[Init] RaceManager initializing...');
        this.startLobby('initialization');
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

        // Handle Timer-based transitions
        if (this.state.phase === 'lobby' || this.state.phase === 'results') {
            const remaining = Math.max(0, Math.ceil((this.state.timerEndsAt - now) / 1000));

            // Sync client if timer changed
            if (remaining !== this.state.timer) {
                this.state.timer = remaining;
                this.io.emit('timer_update', this.state.timer);
            }

            // Expiration check (with 2s safety lock since phase started)
            if (remaining <= 0 && (now - this.phaseStartedAt) > 2000) {
                console.log(`[Timer] Expired for Phase: ${this.state.phase}`);
                if (this.state.phase === 'lobby') {
                    this.startRace();
                } else if (this.state.phase === 'results') {
                    this.startLobby('timer_expired');
                }
            }
        }

        // Handle Racing physics
        if (this.state.phase === 'racing') {
            this.updateRaceLogic();
        }

        this.lastUpdateTime = now;
    }

    // Called constantly during racing phase
    updateRaceLogic() {
        if (this.state.phase !== 'racing') return;

        let allFinished = true;
        const racerEntries = Object.entries(this.state.racers);
        if (racerEntries.length === 0) return;

        for (const [country, racer] of racerEntries) {
            if (!racer.finished) {
                allFinished = false;

                const speed = Physics.calculateSpeed(
                    this.settings.baseSpeed,
                    this.state.influence[country] || 0,
                    this.settings.boostMultiplier
                );

                racer.position += speed;
                racer.speed = speed;

                if (racer.position >= RACE_LENGTH) {
                    racer.finished = true;
                    racer.finishTime = Date.now();
                    this.state.rankings.push({ country, ...racer });

                    if (!this.state.winner) {
                        this.state.winner = country;
                        console.log(`[Race] Winner declared: ${country}`);
                    }
                }
            }
        }

        this.io.emit('race_update', {
            racers: this.state.racers,
            influence: this.state.influence
        });

        if (allFinished) {
            console.log('[Race] All racers finished. Transitioning to endRace.');
            this.endRace();
        }
    }

    startLobby(reason = 'unknown') {
        const now = Date.now();
        console.log(`[Phase] Transitioning to LOBBY. Reason: ${reason}`);

        this.state.phase = 'lobby';
        this.state.timer = DEFAULT_LOBBY_TIMER;
        this.state.timerEndsAt = now + (DEFAULT_LOBBY_TIMER * 1000);
        this.phaseStartedAt = now;

        this.state.racers = {};
        this.state.votes = {};
        this.state.influence = {};
        this.state.winner = null;
        this.state.rankings = [];

        console.log(`[Phase] Lobby set. Timer: ${this.state.timer}, EndsAt: ${this.state.timerEndsAt}`);

        this.io.emit('phase_change', 'lobby');
        this.io.emit('lobby_update', this.state);
    }

    resetTimer() {
        if (this.state.phase === 'lobby') {
            const now = Date.now();
            console.log('[Action] Admin reset lobby timer');
            this.state.timer = DEFAULT_LOBBY_TIMER;
            this.state.timerEndsAt = now + (DEFAULT_LOBBY_TIMER * 1000);
            this.io.emit('timer_update', this.state.timer);
        }
    }

    startRace() {
        const now = Date.now();
        console.log('[Phase] Transitioning to RACING');

        const MIN_RACERS = 8;

        let selectedCountries = Object.keys(this.state.votes).sort((a, b) => {
            return (this.state.votes[b] || 0) - (this.state.votes[a] || 0);
        });

        if (selectedCountries.length > MIN_RACERS) {
            selectedCountries = selectedCountries.slice(0, MIN_RACERS);
        }

        if (selectedCountries.length < MIN_RACERS) {
            const allCodes = Object.keys(COUNTRIES);
            const available = allCodes.filter(code => !selectedCountries.includes(code));

            // Fisher-Yates shuffle
            for (let i = available.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [available[i], available[j]] = [available[j], available[i]];
            }

            const needed = MIN_RACERS - selectedCountries.length;
            selectedCountries = selectedCountries.concat(available.slice(0, needed));
        }

        this.state.phase = 'racing';
        this.phaseStartedAt = now;

        selectedCountries.forEach(code => {
            this.state.racers[code] = {
                position: 0,
                baseSpeed: this.settings.baseSpeed,
                finished: false,
                lane: 0
            };
            this.state.influence[code] = this.state.votes[code] || 0;
        });

        console.log(`[Phase] Race started with ${selectedCountries.length} countries`);

        this.io.emit('phase_change', 'racing');
        this.io.emit('race_start', {
            racers: this.state.racers,
            config: { length: RACE_LENGTH }
        });
    }

    endRace() {
        const now = Date.now();
        if (this.state.phase !== 'racing') {
            console.log(`[Warning] endRace attempt blocked. Current phase: ${this.state.phase}`);
            return;
        }

        console.log(`[Phase] Transitioning to RESULTS. Winner: ${this.state.winner}. DEFAULT_RESET_TIMER from config is: ${DEFAULT_RESET_TIMER}`);

        this.state.phase = 'results';
        this.state.timer = DEFAULT_RESET_TIMER;
        this.state.timerEndsAt = now + (DEFAULT_RESET_TIMER * 1000);
        this.phaseStartedAt = now;

        let sessionTop10 = [];
        try {
            if (this.state.winner) {
                DataManager.recordWin(this.state.winner);
            }
            sessionTop10 = DataManager.getSessionTop10();
            this.state.sessionTop10 = sessionTop10;
        } catch (err) {
            console.error('[Error] DataManager failed in endRace:', err);
        }

        console.log(`[Phase] Results Active. Timer: ${this.state.timer}, EndsAt: ${this.state.timerEndsAt}`);

        this.io.emit('phase_change', 'results');
        this.io.emit('race_finished', {
            winner: this.state.winner,
            rankings: this.state.rankings,
            sessionTop10: sessionTop10,
            timer: this.state.timer
        });
    }

    // --- External Events ---

    handleVote(country) {
        if (this.state.phase === 'lobby') {
            this.state.votes[country] = (this.state.votes[country] || 0) + 1;
            this.io.emit('votes_update', this.state.votes);
        } else if (this.state.phase === 'racing') {
            // Check if country is actually racing
            if (this.state.racers[country] && !this.state.racers[country].finished) {
                this.state.influence[country] = (this.state.influence[country] || 0) + 1;
            }
        }
    }

    handleChatMessage(user, message) {
        const text = message.trim().toLowerCase();
        let foundCode = null;

        for (const [code, details] of Object.entries(COUNTRIES)) {
            if (details.keywords.some(k => text === k || text.startsWith(k + ' '))) {
                foundCode = code;
                break;
            }
        }

        if (!foundCode && text.length === 3 && COUNTRIES[text.toUpperCase()]) {
            foundCode = text.toUpperCase();
        }

        if (!foundCode) return;

        if (this.state.phase === 'lobby') {
            this.handleVote(foundCode);
        } else if (this.state.phase === 'racing') {
            if (this.state.racers[foundCode]) {
                this.state.influence[foundCode] = (this.state.influence[foundCode] || 0) + 1;
            }
        }
    }
}

module.exports = RaceManager;
