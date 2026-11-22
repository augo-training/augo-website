import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { FAQJsonLd, FeaturesBreadcrumbJsonLd, SoftwareApplicationJsonLd } from '../seo/JsonLd'
import FeaturesHero from '../components/features/FeaturesHero'
import ViewSwitch from '../components/features/ViewSwitch'
import FeatureGuide from '../components/features/FeatureGuide'
import WeekStory from '../components/features/WeekStory'
import FeaturesGlance from '../components/features/FeaturesGlance'
import FeaturesFaq from '../components/features/FeaturesFaq'
import FeaturesCta from '../components/features/FeaturesCta'
import { SECTION_IDS, viewForHash, type FeatureItem, type FeaturesView } from '../components/features/constants'

/**
 * Every augo feature, in two views a coach can flip between: the feature guide
 * (default) and the coaching-week story. Both views are always in the DOM, the
 * inactive one `hidden`, so the prerendered HTML carries all of it.
 *
 * Deliberately no GSAP, same as /mcp: prerender would bake `opacity: 0` into
 * the static HTML.
 */
export default function Features() {
    const { t } = useTranslation()
    const [view, setView] = useState<FeaturesView>('guide')
    const viewsRef = useRef<HTMLDivElement>(null)

    const featureList = [
        ...(t('features.coach.items', { returnObjects: true }) as FeatureItem[]),
        ...(t('features.athlete.items', { returnObjects: true }) as FeatureItem[]),
    ].map((item) => item.title)

    // Show the view that holds the target, then scroll once it's visible.
    const goTo = useCallback((hash: string, behavior: ScrollBehavior) => {
        const id = hash.replace(/^#/, '')
        if (!id) return
        // Frame by frame: switch the view, let React unhide it, then scroll once
        // it has layout. This also lets ScrollToTop finish first on a fresh load,
        // as in Mcp.tsx.
        requestAnimationFrame(() => {
            setView(viewForHash(hash))
            requestAnimationFrame(() =>
                requestAnimationFrame(() => {
                    const el = id === SECTION_IDS.guide || id === SECTION_IDS.week ? viewsRef.current : document.getElementById(id)
                    el?.scrollIntoView({ behavior })
                }),
            )
        })
    }, [])

    useEffect(() => {
        goTo(window.location.hash, 'auto')
        const onHashChange = () => goTo(window.location.hash, 'smooth')
        window.addEventListener('hashchange', onHashChange)
        return () => window.removeEventListener('hashchange', onHashChange)
    }, [goTo])

    // In-page links can point into the hidden view, and clicking the current
    // hash again fires no hashchange, so handle every in-page link here.
    const onClick = (e: MouseEvent<HTMLElement>) => {
        const link = (e.target as HTMLElement).closest('a[href^="#"]')
        if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        const hash = link.getAttribute('href') ?? ''
        history.replaceState(null, '', hash)
        goTo(hash, 'smooth')
    }

    const onSwitch = (next: FeaturesView) => {
        const hash = `#${next === 'week' ? SECTION_IDS.week : SECTION_IDS.guide}`
        history.replaceState(null, '', hash)
        setView(next)
        // Only scroll back up if the reader is already past the top of the views.
        const top = viewsRef.current?.getBoundingClientRect().top ?? 0
        if (top < 0) requestAnimationFrame(() => viewsRef.current?.scrollIntoView({ behavior: 'auto' }))
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
                <div ref={viewsRef} className="features-views relative">
                    <ViewSwitch view={view} onChange={onSwitch} />
                    <div
                        id={SECTION_IDS.guide}
                        role="tabpanel"
                        aria-labelledby={`${SECTION_IDS.guide}-tab`}
                        hidden={view !== 'guide'}
                    >
                        <FeatureGuide />
                    </div>
                    <div
                        id={SECTION_IDS.week}
                        role="tabpanel"
                        aria-labelledby={`${SECTION_IDS.week}-tab`}
                        hidden={view !== 'week'}
                    >
                        <WeekStory />
                    </div>
                </div>
                <FeaturesGlance />
                <FeaturesFaq />
                <FeaturesCta />
            </main>
            <Footer />
        </>
    )
}
