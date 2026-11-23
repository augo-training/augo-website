import { useEffect, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useNavigationType, useParams } from 'react-router-dom'
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

/**
 * Where the reader was in the grid when they opened a feature, so Back returns
 * there. Kept in memory, not storage: a page load (menu, footer, typed URL)
 * also reports POP and must start at the top, by the search box, and a load
 * starts with this empty. The entry key keeps it to Back to that same visit.
 */
let gridPosition: { key: string; y: number } | null = null

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
    const { key: entryKey } = useLocation()
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
            if (navigationType === 'POP' && gridPosition?.key === entryKey) {
                window.scrollTo(0, gridPosition.y)
            } else if (navigationType !== 'POP') {
                // Features clicked while already here: same path, so ScrollToTop
                // doesn't fire. Back to the top and the search box.
                window.scrollTo(0, 0)
            }
        })
    }, [lang, navigate, navigationType, entryKey])

    // Feature pages open in the app (no reload); in-page links scroll.
    const onClick = (e: MouseEvent<HTMLElement>) => {
        const link = (e.target as HTMLElement).closest('a[href]')
        const href = link?.getAttribute('href') ?? ''
        if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return
        if (href.startsWith(`/${lang}/features/`)) {
            e.preventDefault()
            gridPosition = { key: entryKey, y: Math.round(window.scrollY) }
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
