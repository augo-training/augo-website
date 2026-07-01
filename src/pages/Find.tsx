import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import DirectoryHero from '../components/find/DirectoryHero'
import AugoStandard from '../components/find/AugoStandard'
import CoachSearchBar from '../components/find/CoachSearchBar'
import CoachGrid from '../components/coachDirectory/CoachGrid'
import CoachApplyBand from '../components/coachDirectory/CoachApplyBand'
import FindFaq from '../components/find/FindFaq'
import { coaches } from '../data/coaches'
import { FindJsonLd, CoachBreadcrumbJsonLd, FAQJsonLd } from '../seo/JsonLd'
import { trackFindPageViewed } from '../utils/analytics'
import type { CoachSearchResult } from '../utils/coachSearch'

export default function Find() {
    const [searchResults, setSearchResults] = useState<CoachSearchResult[] | null>(null)
    const location = useLocation()

    useEffect(() => {
        trackFindPageViewed()
    }, [])

    // Scroll to hash section when navigating from another page or a deep link
    // (e.g. /find#coach-roster-title, used by the mobile app webview).
    useEffect(() => {
        if (location.hash) {
            requestAnimationFrame(() => {
                const el = document.querySelector(location.hash)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            })
        }
    }, [location.hash])

    return (
        <>
            <SEOHead page="find" path="/find" />
            <FindJsonLd />
            <CoachBreadcrumbJsonLd />
            <FAQJsonLd i18nKey="find.faq.items" />
            <Navbar />
            <main>
                <DirectoryHero />
                <AugoStandard />
                <CoachGrid
                    coaches={coaches}
                    searchResults={searchResults}
                    searchSlot={<CoachSearchBar onResults={setSearchResults} />}
                />
                <CoachApplyBand />
                <FindFaq />
            </main>
            <Footer />
        </>
    )
}
