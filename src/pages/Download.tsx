import Navbar from '../components/Navbar'
import DownloadSection from '../components/DownloadSection'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'

function Download() {
    return (
        <>
            <SEOHead page="download" path="/download" />
            <Navbar />
            <DownloadSection />
            <Footer />
        </>
    )
}

export default Download
