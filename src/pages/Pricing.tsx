import Navbar from '../components/Navbar'
import PricingSection from '../components/PricingSection'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'

function Pricing() {
    return (
        <>
            <SEOHead page="pricing" path="/pricing" />
            <Navbar />
            <PricingSection />
            <Footer />
        </>
    )
}

export default Pricing
