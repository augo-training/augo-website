import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Join from './pages/Join'
import Find from './pages/Find'
import CookieConsent from './components/CookieConsent'

function App() {
  return (
    <BrowserRouter>
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
