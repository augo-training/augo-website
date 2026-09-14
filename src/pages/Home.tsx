import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ConnectsSection from '../components/ConnectsSection'
import EmpowerSection from '../components/EmpowerSection'
import CoachesSection from '../components/CoachesSection'
import AthletesSection from '../components/AthletesSection'
import TestimonialsSection from '../components/TestimonialsSection'
import AthleteTestimonialsSection from '../components/AthleteTestimonialsSection'
import AboutSection from '../components/AboutSection'
import FaqSection from '../components/FaqSection'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import useHashScroll from '../hooks/useHashScroll'
import { OrganizationJsonLd, SoftwareApplicationJsonLd, FAQJsonLd } from '../seo/JsonLd'
import { useTrackSectionView } from '../hooks/useTrackSectionView'
import { useFilm } from '../contexts/FilmContext'

function Home() {
    const location = useLocation()
    const navigate = useNavigate()
    const { lang } = useParams<{ lang: string }>()
    const { requestFilm } = useFilm()

    const heroRef = useTrackSectionView('hero', 'home')
    const coachesRef = useTrackSectionView('coaches', 'home')
    const athletesRef = useTrackSectionView('athletes', 'home')
    const testimonialsRef = useTrackSectionView('testimonials', 'home')
    const athleteTestimonialsRef = useTrackSectionView('athlete-testimonials', 'home')
    const aboutRef = useTrackSectionView('about', 'home')
    const faqRef = useTrackSectionView('faq', 'home')

    // Contact used to be a section here and is now its own page. Links to
    // /en#contact are already out in emails and DMs, so send them on rather
    // than dropping people on the hero with no idea what went wrong.
    useEffect(() => {
        if (location.hash === '#contact') {
            navigate(`/${lang ?? 'en'}/contact`, { replace: true })
        }
    }, [location.hash, lang, navigate])

    // Scroll to hash section when navigating from another page (e.g. /#coaches)
    useHashScroll()

    return (
        <>
            <SEOHead page="home" path="/" />
            <OrganizationJsonLd />
            <SoftwareApplicationJsonLd />
            <FAQJsonLd />
            <Navbar />
            <div ref={heroRef}><Hero onWatchFilm={() => requestFilm('hero_cta')} /></div>
            <ConnectsSection />
            <EmpowerSection />
            <div ref={coachesRef}><CoachesSection /></div>
            <div ref={athletesRef}><AthletesSection /></div>
            <div ref={testimonialsRef}><TestimonialsSection /></div>
            <div ref={athleteTestimonialsRef}><AthleteTestimonialsSection /></div>
            <div ref={aboutRef}><AboutSection /></div>
            <div ref={faqRef}><FaqSection /></div>
            <Footer />
        </>
    )
}

export default Home
