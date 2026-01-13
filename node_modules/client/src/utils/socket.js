import { io } from 'socket.io-client';

// Auto-detect production vs dev
// In development, Vite proxys /socket.io to localhost:3000 if configured, 
// OR we just point directly if cors is open. 
// Given the setup, we'll try to connect to the explicit server URL for now.
const URL = import.meta.env.PROD ? undefined : 'http://localhost:3000';

export const socket = io(URL, {
    autoConnect: true,
    reconnection: true,
});
