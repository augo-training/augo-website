import Navbar from '../components/Navbar'
import JoinSection from '../components/JoinSection'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'

function Join() {
    return (
        <>
            <SEOHead page="join" path="/join" />
            <Navbar />
            <JoinSection />
            <Footer />
        </>
    )
}

export default Join
