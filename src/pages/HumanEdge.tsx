import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import {
    FAQJsonLd,
    HumanEdgeProgramJsonLd,
    HumanEdgeCoachJsonLd,
    HumanEdgeHowToJsonLd,
    HumanEdgeBreadcrumbJsonLd,
} from '../seo/JsonLd'
import EmailCaptureModal from '../components/EmailCaptureModal'
import HumanEdgeHero from '../components/humanEdge/HumanEdgeHero'
import HumanEdgeWhat from '../components/humanEdge/HumanEdgeWhat'
import HumanEdgeWhoFor from '../components/humanEdge/HumanEdgeWhoFor'
import HumanEdgeWhy from '../components/humanEdge/HumanEdgeWhy'
import HumanEdgeWhatYouGet from '../components/humanEdge/HumanEdgeWhatYouGet'
import HumanEdgeDocumenting from '../components/humanEdge/HumanEdgeDocumenting'
import HumanEdgeHowToApply from '../components/humanEdge/HumanEdgeHowToApply'
import HumanEdgeBonus from '../components/humanEdge/HumanEdgeBonus'
import HumanEdgeFinalCta from '../components/humanEdge/HumanEdgeFinalCta'
import HumanEdgeFaq from '../components/humanEdge/HumanEdgeFaq'
import { HUMAN_EDGE_GROUP_ID } from '../components/humanEdge/constants'
import { trackCtaClicked } from '../utils/analytics'

export default function HumanEdge() {
    const { t } = useTranslation()
    const [modalOpen, setModalOpen] = useState(false)
    const howToApplyRef = useRef<HTMLDivElement>(null)

    const openApplyModal = (location: string) => {
        trackCtaClicked({
            cta_text: 'Apply now',
            cta_location: location,
            destination: '#how-to-apply',
        })
        setModalOpen(true)
    }

    const handleSuccess = () => {
        howToApplyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <>
            <SEOHead page="humanEdge" path="/humanedge" />
            <FAQJsonLd i18nKey="humanEdge.faq.items" />
            <HumanEdgeProgramJsonLd />
            <HumanEdgeCoachJsonLd />
            <HumanEdgeHowToJsonLd />
            <HumanEdgeBreadcrumbJsonLd />
            <Navbar />
            <article>
                <HumanEdgeHero onApply={() => openApplyModal('hero')} />
                <HumanEdgeWhat />
                <HumanEdgeWhoFor />
                <HumanEdgeWhy />
                <HumanEdgeWhatYouGet />
                <HumanEdgeDocumenting />
                <HumanEdgeHowToApply ref={howToApplyRef} />
                <HumanEdgeBonus />
                <HumanEdgeFinalCta onApply={() => openApplyModal('final_cta')} />
                <HumanEdgeFaq />
            </article>
            <Footer />
            <EmailCaptureModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                ctaText="Human Edge Apply"
                groupId={HUMAN_EDGE_GROUP_ID}
                onSuccess={handleSuccess}
                title={t('humanEdge.modal.title')}
                subtitle={t('humanEdge.modal.subtitle')}
                submitLabel={t('humanEdge.modal.cta')}
            />
        </>
    )
}
