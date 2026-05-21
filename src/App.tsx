/* ===== FILE OVERVIEW ===== */
/* Summary: Root React component — defines all client-side routes for the application */

import { Routes, Route } from 'react-router-dom'  /* Route matching & rendering */
import LobbyPage from '@/pages/LobbyPage'          /* Country selection / pre-race lobby */
import RacePage from '@/pages/RacePage'            /* Live race track view */
import LeaderboardPage from '@/pages/LeaderboardPage'  /* Post-race results & leaderboard */
import SettingsPage from '@/pages/SettingsPage'    /* Game configuration tabs */

/* ===== ROUTE CONFIGURATION ===== */
function App() {
  return (
    <Routes>
      <Route path="/" element={<LobbyPage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/race" element={<RacePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  )
}

export default App
