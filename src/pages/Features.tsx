import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { FAQJsonLd, FeaturesBreadcrumbJsonLd, SoftwareApplicationJsonLd } from '../seo/JsonLd'
import FeaturesHero from '../components/features/FeaturesHero'
import FeatureIndex from '../components/features/FeatureIndex'
import FeatureDrawer, { type Panel } from '../components/features/FeatureDrawer'
import FeaturesIntegrations from '../components/features/FeaturesIntegrations'
import FeaturesFaq from '../components/features/FeaturesFaq'
import FeaturesCta from '../components/features/FeaturesCta'
import { SECTION_IDS, type FeatureItem } from '../components/features/constants'

/**
 * Every augo feature, kept short for visitors: search, a tile per feature,
 * integrations and the FAQ. Each tile opens the feature in full in a side
 * panel. The panels are prerendered closed, so search engines and AI crawlers
 * still read every feature on this one, linked page.
 *
 * Deliberately no GSAP, same as /mcp: prerender would bake `opacity: 0` into
 * the static HTML.
 */
export default function Features() {
    const { t } = useTranslation()
    const [openId, setOpenId] = useState<string | null>(null)
    const trigger = useRef<HTMLElement | null>(null)

    const coach = t('features.coach.items', { returnObjects: true }) as FeatureItem[]
    const athlete = t('features.athlete.items', { returnObjects: true }) as FeatureItem[]
    const migration = t('features.migration.item', { returnObjects: true }) as FeatureItem

    // Same order as the tiles, so "Next" in the panel walks the index.
    const panels: Panel[] = useMemo(
        () => [
            { id: SECTION_IDS.devices, title: t('features.devices.title') },
            { id: migration.id, title: migration.title, item: migration },
            ...[...coach, ...athlete].map((item) => ({ id: item.id, title: item.title, item })),
        ],
        // The copy only changes with the language.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [t],
    )
    const panelIds = useMemo(() => new Set(panels.map((p) => p.id)), [panels])
    const featureList = [...coach, ...athlete, migration].map((item) => item.title)

    const open = useCallback((id: string) => {
        setOpenId(id)
        history.replaceState(null, '', `#${id}`)
    }, [])

    const close = useCallback(() => {
        setOpenId(null)
        history.replaceState(null, '', window.location.pathname + window.location.search)
        trigger.current?.focus({ preventScroll: true })
    }, [])

    // A link to /en/features#recovery opens that panel; any other hash scrolls,
    // after ScrollToTop has had its turn (same fix as Mcp.tsx).
    useEffect(() => {
        const id = window.location.hash.slice(1)
        if (!id) return
        requestAnimationFrame(() => {
            if (panelIds.has(id)) setOpenId(id)
            else document.getElementById(id)?.scrollIntoView()
        })
    }, [panelIds])

    // Tiles, search results and in-text links: panels open, sections scroll.
    const onClick = (e: MouseEvent<HTMLElement>) => {
        const link = (e.target as HTMLElement).closest('a[href^="#"]')
        if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return
        const id = (link.getAttribute('href') ?? '').slice(1)
        if (panelIds.has(id)) {
            e.preventDefault()
            trigger.current = link as HTMLElement
            open(id)
            return
        }
        const target = document.getElementById(id)
        if (!target) return
        e.preventDefault()
        history.replaceState(null, '', `#${id}`)
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
                <FeaturesIntegrations />
                <FeaturesFaq />
                <FeaturesCta />
                <FeatureDrawer panels={panels} openId={openId} onOpen={open} onClose={close} />
            </main>
            <Footer />
        </>
    )
}
