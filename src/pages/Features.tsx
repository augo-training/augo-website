import { useEffect, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { FAQJsonLd, FeaturesBreadcrumbJsonLd, SoftwareApplicationJsonLd } from '../seo/JsonLd'
import FeaturesHero from '../components/features/FeaturesHero'
import FeatureIndex from '../components/features/FeatureIndex'
import SectionNav from '../components/features/SectionNav'
import FeatureGuide from '../components/features/FeatureGuide'
import FeaturesDevices from '../components/features/FeaturesDevices'
import FeaturesIntegrations from '../components/features/FeaturesIntegrations'
import FeaturesGlance from '../components/features/FeaturesGlance'
import FeaturesFaq from '../components/features/FeaturesFaq'
import FeaturesCta from '../components/features/FeaturesCta'
import type { FeatureItem } from '../components/features/constants'

/**
 * Every augo feature: an index with search at the top, then each feature in
 * detail, devices, integrations, a summary table and the FAQ. A section menu
 * stays pinned under the Navbar from the guide down.
 *
 * Deliberately no GSAP, same as /mcp: prerender would bake `opacity: 0` into
 * the static HTML.
 */
export default function Features() {
    const { t } = useTranslation()

    const featureList = [
        ...(t('features.coach.items', { returnObjects: true }) as FeatureItem[]),
        ...(t('features.athlete.items', { returnObjects: true }) as FeatureItem[]),
    ].map((item) => item.title)

    // ScrollToTop fires on every pathname change and races the browser's native
    // hash scroll, so a deep link like /en/features#recovery lands at the top
    // without this. Same fix as Mcp.tsx.
    useEffect(() => {
        if (!window.location.hash) return
        requestAnimationFrame(() => document.querySelector(window.location.hash)?.scrollIntoView())
    }, [])

    // Smooth-scroll in-page links, including a second click on the current hash,
    // which the browser would otherwise ignore.
    const onClick = (e: MouseEvent<HTMLElement>) => {
        const link = (e.target as HTMLElement).closest('a[href^="#"]')
        if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return
        const hash = link.getAttribute('href') ?? ''
        const target = document.getElementById(hash.slice(1))
        if (!target) return
        e.preventDefault()
        history.replaceState(null, '', hash)
        target.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <>
            <SEOHead page="features" path="/features" ogImagePath="/features-og.jpg" />
            <SoftwareApplicationJsonLd featureList={featureList} />
            <FAQJsonLd i18nKey="features.faq.items" />
            <FeaturesBreadcrumbJsonLd />
            <Navbar />
            <main className="features-page bg-dark" onClick={onClick}>
                <FeaturesHero />
                <FeatureIndex />
                <div className="relative">
                    <SectionNav />
                    <FeatureGuide />
                    <FeaturesDevices />
                    <FeaturesIntegrations />
                    <FeaturesGlance />
                    <FeaturesFaq />
                </div>
                <FeaturesCta />
            </main>
            <Footer />
        </>
    )
}
