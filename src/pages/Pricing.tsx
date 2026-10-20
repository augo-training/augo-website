import Navbar from '../components/Navbar'
import PricingSection from '../components/PricingSection'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import useHashScroll from '../hooks/useHashScroll'

function Pricing() {
    // Lands /pricing#add-ons on the Elite block, linked from the Racing Team page.
    useHashScroll()
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
