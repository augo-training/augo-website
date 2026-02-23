import { useState } from 'react'
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

function Home() {
    const [videoOpen, setVideoOpen] = useState(false)

    return (
        <>
            <Navbar />
            <Hero />
            <ConnectsSection />
            <EmpowerSection />
            <CoachesSection />
            <IntegrationSection />
            <AthletesSection />
            <TestimonialsSection />
            <AboutSection />
            <FaqSection />
            <ContactSection />
            <Footer />
            <FloatingButton onClick={() => setVideoOpen(true)} />
            <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
        </>
    )
}

export default Home
