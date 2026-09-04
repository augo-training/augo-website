import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import LanguageLayout from './components/LanguageLayout'
import LanguageRedirect from './components/LanguageRedirect'
import LegacyRedirect from './components/LegacyRedirect'
import Home from './pages/Home'
import Join from './pages/Join'
import Find from './pages/Find'
import Pricing from './pages/Pricing'
import BookDemo from './pages/BookDemo'
import NotFound from './pages/NotFound'
import CookieConsent from './components/CookieConsent'
import CountdownBanner from './components/CountdownBanner'
import ScrollToTop from './components/ScrollToTop'
import Download from "./pages/Download.tsx";
import HumanEdge from './pages/HumanEdge'
import CoachProfile from './pages/CoachProfile'
import BlogPost from './pages/BlogPost'
import BlogIndex from './pages/BlogIndex'
import NiceAthletes from './pages/NiceAthletes'
import NiceCoaches from './pages/NiceCoaches'
import { setupMixpanelConsentListener } from './utils/analytics'

// March 26, 2026 at 20:00 Zurich time
// DST starts March 29, 2026, so March 26 is still CET (UTC+1)
// March 26 20:00 CET = March 26 19:00 UTC
const LAUNCH_DATE = new Date('2026-03-26T19:00:00Z')

function CoachSlugLegacyRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <LegacyRedirect to={`/en/coaches/${slug ?? ''}`} />
}

function CoachesIndexToFind() {
  const { lang } = useParams<{ lang: string }>()
  return <LegacyRedirect to={`/${lang ?? 'en'}/find`} />
}

function App() {
  // App-level so Mixpanel also initialises after consent on routes outside
  // LanguageLayout (the top-level 404 and legacy redirects).
  useEffect(() => setupMixpanelConsentListener(), [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <CountdownBanner targetDate={LAUNCH_DATE} />
      <Routes>
        {/* Root: redirect to detected language */}
        <Route path="/" element={<LanguageRedirect />} />

        {/* Legacy routes: redirect to language-prefixed versions */}
        <Route path="/join" element={<LegacyRedirect to="/en/download" />} />
        <Route path="/find" element={<LegacyRedirect to="/en/find" />} />
        <Route path="/humanedge" element={<LegacyRedirect to="/en/humanedge" />} />
        <Route path="/book-a-demo" element={<LegacyRedirect to="/en/book-a-demo" />} />
        <Route path="/coaches" element={<LegacyRedirect to="/en/find" />} />
        <Route path="/coaches/:slug" element={<CoachSlugLegacyRedirect />} />

        {/* Language-prefixed routes */}
        <Route path="/:lang" element={<LanguageLayout />}>
          <Route index element={<Home />} />
          <Route path="download" element={<Download />} />
          <Route path="join" element={<Join />} />
          <Route path="find" element={<Find />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="book-a-demo" element={<BookDemo />} />
          <Route path="humanedge" element={<HumanEdge />} />
          {/* Standalone ad landing pages — nothing on the site links to them. */}
          <Route path="nice-athletes" element={<NiceAthletes />} />
          <Route path="nice-coaches" element={<NiceCoaches />} />
          <Route path="coaches" element={<CoachesIndexToFind />} />
          <Route path="coaches/:slug" element={<CoachProfile />} />
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
