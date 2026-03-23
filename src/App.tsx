import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LanguageLayout from './components/LanguageLayout'
import LanguageRedirect from './components/LanguageRedirect'
import Home from './pages/Home'
import Join from './pages/Join'
import Find from './pages/Find'
import Pricing from './pages/Pricing'
import NotFound from './pages/NotFound'
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
        {/* Root: redirect to detected language */}
        <Route path="/" element={<LanguageRedirect />} />

        {/* Legacy routes: redirect to language-prefixed versions */}
        <Route path="/join" element={<Navigate to="/en/join" replace />} />
        <Route path="/find" element={<Navigate to="/en/find" replace />} />

        {/* Language-prefixed routes */}
        <Route path="/:lang" element={<LanguageLayout />}>
          <Route index element={<Home />} />
          <Route path="join" element={<Join />} />
          <Route path="find" element={<Find />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  )
}

export default App
