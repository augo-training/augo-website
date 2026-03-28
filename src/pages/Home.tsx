import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FloatingButton from '../components/FloatingButton'
import VideoModal from '../components/VideoModal'
import ConnectsSection from '../components/ConnectsSection'
import EmpowerSection from '../components/EmpowerSection'
import CoachesSection from '../components/CoachesSection'
import IntegrationSection from '../components/IntegrationSection'
import AthletesSection from '../components/AthletesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import AboutSection from '../components/AboutSection'
import FaqSection from '../components/FaqSection'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { OrganizationJsonLd, SoftwareApplicationJsonLd, FAQJsonLd } from '../seo/JsonLd'
import { useTrackSectionView } from '../hooks/useTrackSectionView'
import { trackVideoOpened, trackVideoClosed } from '../utils/analytics'

function Home() {
    const [videoOpen, setVideoOpen] = useState(false)
    const [videoOpenedAt, setVideoOpenedAt] = useState<number | null>(null)
    const location = useLocation()

    const heroRef = useTrackSectionView('hero', 'home')
    const coachesRef = useTrackSectionView('coaches', 'home')
    const athletesRef = useTrackSectionView('athletes', 'home')
    const testimonialsRef = useTrackSectionView('testimonials', 'home')
    const aboutRef = useTrackSectionView('about', 'home')
    const faqRef = useTrackSectionView('faq', 'home')
    const contactRef = useTrackSectionView('contact', 'home')

    // Scroll to hash section when navigating from another page (e.g. /#coaches)
    useEffect(() => {
        if (location.hash) {
            requestAnimationFrame(() => {
                const el = document.querySelector(location.hash)
                if (el) el.scrollIntoView({ behavior: 'smooth' })
            })
        }
    }, [location.hash])

    const handleVideoOpen = () => {
        setVideoOpen(true)
        setVideoOpenedAt(Date.now())
        trackVideoOpened({ trigger: 'floating_button', page: 'home' })
    }

    const handleVideoClose = () => {
        setVideoOpen(false)
        const duration = videoOpenedAt ? Math.round((Date.now() - videoOpenedAt) / 1000) : 0
        trackVideoClosed({ page: 'home', watch_duration_seconds: duration })
        setVideoOpenedAt(null)
    }

    return (
        <>
            <SEOHead page="home" path="/" />
            <OrganizationJsonLd />
            <SoftwareApplicationJsonLd />
            <FAQJsonLd />
            <Navbar />
            <div ref={heroRef}><Hero /></div>
            <ConnectsSection />
            <EmpowerSection />
            <div ref={coachesRef}><CoachesSection /></div>
            <IntegrationSection />
            <div ref={athletesRef}><AthletesSection /></div>
            <div ref={testimonialsRef}><TestimonialsSection /></div>
            <div ref={aboutRef}><AboutSection /></div>
            <div ref={faqRef}><FaqSection /></div>
            <div ref={contactRef}><ContactSection /></div>
            <Footer />
            <FloatingButton onClick={handleVideoOpen} />
            <VideoModal isOpen={videoOpen} onClose={handleVideoClose} />
        </>
    )
}

export default Home
