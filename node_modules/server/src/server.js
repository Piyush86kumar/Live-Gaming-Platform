const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for local dev, restrict in prod
    methods: ["GET", "POST"]
  }
});

// Basic health check
app.get('/', (req, res) => {
  res.send('Race of Nations Server is running');
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

const RaceManager = require('./game/RaceManager');
const raceManager = new RaceManager(io);
raceManager.init();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send current state on connection
  socket.emit('phase_change', raceManager.state.phase);
  if (raceManager.state.phase === 'lobby') {
    socket.emit('lobby_update', raceManager.state);
  }

  // Handle incoming events
  socket.on('vote_country', (data) => {
    if (data && data.country) {
      raceManager.handleVote(data.country);
    }
  });

  // Temporary: Manual chat simulation for testing
  socket.on('chat_message', (data) => {
    console.log('Chat:', data);
    if (data && data.message) {
      raceManager.handleChatMessage(data.userId || 'anon', data.message);
    }
  });

  // Admin controls
  socket.on('admin_start_race', () => {
    raceManager.startRace();
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
