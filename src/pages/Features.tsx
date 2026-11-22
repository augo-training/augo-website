import { useEffect, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useNavigationType, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { FAQJsonLd, FeaturesBreadcrumbJsonLd, SoftwareApplicationJsonLd } from '../seo/JsonLd'
import FeaturesHero from '../components/features/FeaturesHero'
import FeatureIndex from '../components/features/FeatureIndex'
import FeaturesGlance from '../components/features/FeaturesGlance'
import FeaturesFaq from '../components/features/FeaturesFaq'
import FeaturesCta from '../components/features/FeaturesCta'
import type { FeatureItem } from '../components/features/constants'
import { FEATURE_SLUGS, featureHref } from '../data/featurePages'

/** Where the reader was in the grid, so Back from a feature page returns there. */
const SCROLL_KEY = 'features-scroll'

/**
 * Every augo feature at a glance: search, a tile per feature, every feature
 * in one table, and the FAQ. Each tile, row and search result links to that
 * feature's own page, /:lang/features/<slug>.
 *
 * Deliberately no GSAP, same as /mcp: prerender would bake `opacity: 0` into
 * the static HTML.
 */
export default function Features() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const navigationType = useNavigationType()
    const { lang = 'en' } = useParams<{ lang: string }>()

    const featureList = [
        ...(t('features.coach.items', { returnObjects: true }) as FeatureItem[]),
        ...(t('features.athlete.items', { returnObjects: true }) as FeatureItem[]),
        t('features.migration.item', { returnObjects: true }) as FeatureItem,
    ].map((item) => item.title)

    useEffect(() => {
        const id = window.location.hash.slice(1)
        requestAnimationFrame(() => {
            // Old in-page links (/features#recovery) now have pages of their own.
            if (id in FEATURE_SLUGS) {
                navigate(featureHref(lang, id), { replace: true })
                return
            }
            // Same fix as Mcp.tsx: ScrollToTop races the browser's hash scroll.
            if (id) {
                document.getElementById(id)?.scrollIntoView()
                return
            }
            // Back from a feature page: return to the same place in the grid.
            if (navigationType === 'POP') {
                try {
                    const y = Number(sessionStorage.getItem(SCROLL_KEY))
                    if (y) window.scrollTo(0, y)
                } catch {
                    // Storage blocked: start at the top, as any page would.
                }
            }
        })
    }, [lang, navigate, navigationType])

    // Feature pages open in the app (no reload); in-page links scroll.
    const onClick = (e: MouseEvent<HTMLElement>) => {
        const link = (e.target as HTMLElement).closest('a[href]')
        const href = link?.getAttribute('href') ?? ''
        if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return
        if (href.startsWith(`/${lang}/features/`)) {
            e.preventDefault()
            try {
                sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)))
            } catch {
                // Storage blocked: Back just lands at the top.
            }
            navigate(href)
            return
        }
        if (!href.startsWith('#')) return
        const target = document.getElementById(href.slice(1))
        if (!target) return
        e.preventDefault()
        history.replaceState(null, '', href)
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
                <FeaturesGlance />
                <FeaturesFaq />
                <FeaturesCta />
            </main>
            <Footer />
        </>
    )
}
