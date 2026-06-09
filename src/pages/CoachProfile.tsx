import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import EmailCaptureModal from '../components/EmailCaptureModal'
import CoachHero from '../components/coachProfile/CoachHero'
import CoachSpecSheet from '../components/coachProfile/CoachSpecSheet'
import CoachApplyBand from '../components/coachDirectory/CoachApplyBand'
import InquirySentToast from '../components/coachProfile/InquirySentToast'
import { getCoachBySlug } from '../data/coaches'
import {
    CoachJsonLd,
    CoachProfileBreadcrumbJsonLd,
} from '../seo/JsonLd'
import { trackCtaClicked } from '../utils/analytics'

// "[Athletes] Matching Platform" group in MailerLite. Overridable via env; the
// default is the live group ID so production works without extra CI config.
const MATCHING_GROUP_ID =
    import.meta.env.VITE_MAILERLITE_MATCHING_GROUP_ID || '185983036539537333'

// Localized discipline nouns + SEO title pattern, so de/pt visitors (and crawlers)
// get a translated, keyword-bearing <title> instead of an English-only one.
const DISCIPLINE_LABEL: Record<string, Record<string, string>> = {
    en: { running: 'Running', cycling: 'Cycling', triathlon: 'Triathlon' },
    de: { running: 'Laufen', cycling: 'Radsport', triathlon: 'Triathlon' },
    pt: { running: 'Corrida', cycling: 'Ciclismo', triathlon: 'Triatlo' },
}

function localizedCoachTitle(
    name: string,
    disciplines: string[],
    city: string,
    lang: string,
): string {
    const L = DISCIPLINE_LABEL[lang] ? lang : 'en'
    const list = disciplines.map((d) => DISCIPLINE_LABEL[L][d] ?? d).join(' & ')
    if (L === 'de') return `${name} — Coach für ${list} in ${city} | augo`
    if (L === 'pt') return `${name} — Treinador de ${list} em ${city} | augo`
    return `${name} — ${list} Coach in ${city} | augo`
}

export default function CoachProfile() {
    const { slug, lang } = useParams<{ slug: string; lang: string }>()
    const coach = slug ? getCoachBySlug(slug) : undefined
    const currentLang = lang ?? 'en'

    const [modalOpen, setModalOpen] = useState(false)
    const [toastOpen, setToastOpen] = useState(false)

    if (!coach) {
        return <Navigate to={`/${currentLang}/find`} replace />
    }

    function openContact(location: string) {
        if (!coach) return
        trackCtaClicked({
            cta_text: `Work with ${coach.firstName}`,
            cta_location: location,
            destination: `coach:${coach.slug}`,
        })
        setModalOpen(true)
    }

    return (
        <>
            <SEOHead
                page="coachProfile"
                path={`/coaches/${coach.slug}`}
                ogImagePath={coach.isFoundingCoach ? coach.media.portrait : undefined}
                title={localizedCoachTitle(
                    coach.name,
                    coach.disciplines,
                    coach.location.city,
                    currentLang,
                )}
                description={coach.tagline}
            />
            <CoachJsonLd coach={coach} />
            <CoachProfileBreadcrumbJsonLd coach={coach} />
            <Navbar />
            <article>
                <CoachHero coach={coach} onContact={() => openContact('coach_hero')} />
                <CoachSpecSheet coach={coach} />
                <CoachApplyBand />
            </article>
            <Footer />
            <EmailCaptureModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                ctaText={`Coach Inquiry — ${coach.name}`}
                groupId={MATCHING_GROUP_ID}
                fields={{ coach_name: coach.name, coach_slug: coach.slug }}
                title={`Work with ${coach.firstName}`}
                subtitle={`Drop your email and we'll introduce you to ${coach.firstName} over email — you'll both be connected so you can take it from there.`}
                submitLabel={`Send to ${coach.firstName}`}
                onSuccess={() => setToastOpen(true)}
            />
            {toastOpen && (
                <InquirySentToast
                    coachName={coach.firstName}
                    onDismiss={() => setToastOpen(false)}
                />
            )}
        </>
    )
}
