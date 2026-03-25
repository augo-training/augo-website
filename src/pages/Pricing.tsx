import { useState } from 'react'
import Navbar from '../components/Navbar'
import PricingSection from '../components/PricingSection'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import FloatingButton from '../components/FloatingButton'
import VideoModal from '../components/VideoModal'

function Pricing() {
    const [videoOpen, setVideoOpen] = useState(false)

    return (
        <>
            <SEOHead page="pricing" path="/pricing" />
            <Navbar />
            <PricingSection />
            <Footer />
            <FloatingButton onClick={() => setVideoOpen(true)} />
            <VideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />
        </>
    )
}

export default Pricing
