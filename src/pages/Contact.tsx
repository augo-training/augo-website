import Navbar from '../components/Navbar'
import ContactSection from '../components/ContactSection'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'

function Contact() {
    return (
        <>
            <SEOHead page="contact" path="/contact" />
            <Navbar />
            <main>
                <ContactSection />
            </main>
            <Footer />
        </>
    )
}

export default Contact
