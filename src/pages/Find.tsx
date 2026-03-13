import Navbar from '../components/Navbar'
import FindSection from '../components/FindSection'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'

function Find() {
    return (
        <>
            <SEOHead page="find" path="/find" />
            <Navbar />
            <FindSection />
            <Footer />
        </>
    )
}

export default Find
