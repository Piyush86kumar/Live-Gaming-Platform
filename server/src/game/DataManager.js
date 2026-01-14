const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/session_stats.json');

class DataManager {
    constructor() {
        this.stats = {};
        this.ensureDataDir();
        this.loadStats();
    }

    ensureDataDir() {
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    loadStats() {
        try {
            if (fs.existsSync(DATA_FILE)) {
                const data = fs.readFileSync(DATA_FILE, 'utf8');
                this.stats = JSON.parse(data);
            } else {
                this.stats = {};
            }
        } catch (err) {
            console.error('Error loading stats:', err);
            this.stats = {};
        }
    }

    saveStats() {
        try {
            fs.writeFileSync(DATA_FILE, JSON.stringify(this.stats, null, 2));
        } catch (err) {
            console.error('Error saving stats:', err);
        }
    }

    recordWin(countryCode) {
        if (!countryCode) return;

        if (!this.stats[countryCode]) {
            this.stats[countryCode] = 0;
        }
        this.stats[countryCode]++;
        this.saveStats();
    }

    getSessionTop10() {
        return Object.entries(this.stats)
            .sort(([, winsA], [, winsB]) => winsB - winsA)
            .slice(0, 10)
            .map(([country, wins]) => ({ country, wins }));
    }

    resetSession() {
        this.stats = {};
        this.saveStats();
    }
}

module.exports = new DataManager();
