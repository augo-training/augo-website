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
import Download from "./pages/Download.tsx";
import HumanEdge from './pages/HumanEdge'
import BlogPost from './pages/BlogPost'
import BlogIndex from './pages/BlogIndex'

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
        <Route path="/join" element={<Navigate to="/en/download" replace />} />
        <Route path="/find" element={<Navigate to="/en/find" replace />} />
        <Route path="/humanedge" element={<Navigate to="/en/humanedge" replace />} />

        {/* Language-prefixed routes */}
        <Route path="/:lang" element={<LanguageLayout />}>
          <Route index element={<Home />} />
          <Route path="download" element={<Download />} />
          <Route path="join" element={<Join />} />
          <Route path="find" element={<Find />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="humanedge" element={<HumanEdge />} />
          <Route path="blog" element={<BlogIndex />} />
          <Route path="blog/:slug" element={<BlogPost />} />
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
