import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Join from './pages/Join'
import Find from './pages/Find'
import CookieConsent from './components/CookieConsent'
import CountdownBanner from './components/CountdownBanner'

// March 26, 2026 at 20:00 Zurich time
// DST starts March 29, 2026, so March 26 is still CET (UTC+1)
// March 26 20:00 CET = March 26 19:00 UTC
const LAUNCH_DATE = new Date('2026-03-26T19:00:00Z')

function App() {
  return (
    <BrowserRouter>
      <CountdownBanner targetDate={LAUNCH_DATE} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<Join />} />
        <Route path="/find" element={<Find />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  )
}

export default App
