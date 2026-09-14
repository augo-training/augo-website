import SEOHead from '../seo/SEOHead'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BookDemoHero from '../components/bookDemo/BookDemoHero'

export default function BookDemo() {
    return (
        <>
            <SEOHead page="bookDemo" path="/book-a-demo" />
            <Navbar />
            <main>
                <BookDemoHero />
            </main>
            <Footer />
        </>
    )
}
