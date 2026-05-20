import { Routes, Route } from 'react-router-dom'
import LobbyPage from '@/pages/LobbyPage'
import RacePage from '@/pages/RacePage'
import LeaderboardPage from '@/pages/LeaderboardPage'
import SettingsPage from '@/pages/SettingsPage'

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
