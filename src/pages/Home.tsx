import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FloatingButton from '../components/FloatingButton'
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
            <FloatingButton />
        </>
    )
}

export default Home
