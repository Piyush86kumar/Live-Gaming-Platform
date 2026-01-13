module.exports = {
    // Game Loop
    FPS: 60,

    // Race Config
    RACE_LENGTH: 1500, // Pixels
    DEFAULT_LOBBY_TIMER: 60,
    DEFAULT_RESET_TIMER: 30,

    // Physics
    BASE_SPEED: 1.0,
    MAX_SPEED_MULTIPLIER: 2.5,
    BOOST_MULTIPLIER_DEFAULT: 0.1,

    // Obstacles
    OBSTACLE_FREQUENCY: 0.05, // Chance per frame (roughly) - Needs tuning
    OBSTACLE_PENALTY_DURATION: 1000,
    OBSTACLE_SPEED_PENALTY: 0.8, // 80% speed

    // Scoring
    WIN_POINTS: 10,
    PARTICIPATION_POINTS: 1
};
