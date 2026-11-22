import { type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../seo/SEOHead'
import { FeaturesBreadcrumbJsonLd } from '../seo/JsonLd'
import { LogoMarquee } from '../components/ConnectsSection'
import FeatureDetail from '../components/features/FeatureDetail'
import FeaturesDevices from '../components/features/FeaturesDevices'
import FeaturesIntegrations from '../components/features/FeaturesIntegrations'
import FeaturesCta from '../components/features/FeaturesCta'
import { SECTION_IDS, type FeatureItem } from '../components/features/constants'
import { INTEGRATION_LOGOS } from '../data/deviceLogos'
import { FEATURE_SLUGS, featureHref, featureIdForSlug } from '../data/featurePages'
import NotFound from './NotFound'

interface Topic {
    id: string
    title: string
    summary: string
    item?: FeatureItem
}

/**
 * One feature on its own page: /:lang/features/<slug>. Same copy as the tile
 * that links here, in full, with its own title and description for search,
 * and the previous and next feature in tile order at the bottom.
 */
export default function FeaturePage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { lang = 'en', slug = '' } = useParams<{ lang: string; slug: string }>()

    const coach = t('features.coach.items', { returnObjects: true }) as FeatureItem[]
    const athlete = t('features.athlete.items', { returnObjects: true }) as FeatureItem[]
    const migration = t('features.migration.item', { returnObjects: true }) as FeatureItem

    // Tile order, so previous and next walk the index.
    const topics: Topic[] = [
        { id: SECTION_IDS.devices, title: t('features.devices.title'), summary: t('features.devices.lead') },
        { id: SECTION_IDS.integrations, title: t('features.integrations.title'), summary: t('features.integrations.lead') },
        ...[migration, ...coach, ...athlete].map((item) => ({ id: item.id, title: item.title, summary: item.summary, item })),
    ]

    const id = featureIdForSlug(slug)
    const index = topics.findIndex((topic) => topic.id === id)
    if (!id || index < 0) return <NotFound />

    const topic = topics[index]
    const prev = topics[(index - 1 + topics.length) % topics.length]
    const next = topics[(index + 1) % topics.length]
    const allFeatures = `/${lang}/features`

    // Stay in the app for links between Features pages instead of reloading.
    const onClick = (e: MouseEvent<HTMLElement>) => {
        const link = (e.target as HTMLElement).closest('a[href]')
        const href = link?.getAttribute('href') ?? ''
        if (!href.startsWith(allFeatures) || e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        navigate(href)
    }

    const neighbour = (target: Topic, label: string, align: 'left' | 'right') => (
        <a
            href={featureHref(lang, target.id)}
            className={`flex flex-col gap-1 rounded-2xl border border-white/[0.1] bg-white/[0.02] px-5 py-4 hover:border-white/30 transition-colors ${
                align === 'right' ? 'sm:text-right sm:items-end' : ''
            }`}
        >
            <span className="font-mono text-[11px] tracking-[2px] uppercase text-white/45">{label}</span>
            <span className="font-satoshi font-medium text-[16px] sm:text-[17px] text-white">{target.title}</span>
        </a>
    )

    return (
        <>
            <SEOHead
                path={`/features/${FEATURE_SLUGS[topic.id]}`}
                title={`${topic.title} | augo`}
                description={topic.summary}
                ogImagePath="/features-og.jpg"
            />
            <FeaturesBreadcrumbJsonLd feature={{ name: topic.title, slug: FEATURE_SLUGS[topic.id] }} />
            <Navbar />
            <main className="features-page bg-dark" onClick={onClick}>
                <div className="px-5 sm:px-8 pt-28 sm:pt-36 pb-16 sm:pb-24">
                    <div className="max-w-[1200px] mx-auto">
                        <a
                            href={allFeatures}
                            className="inline-flex items-center gap-2 mb-8 sm:mb-10 font-mono text-[12px] tracking-[2px] uppercase text-white/60 hover:text-white"
                        >
                            ← {t('features.page.allFeatures')}
                        </a>

                        {topic.id === SECTION_IDS.devices ? (
                            <FeaturesDevices />
                        ) : topic.id === SECTION_IDS.integrations ? (
                            <>
                                <div className="-mx-5 sm:-mx-8 mb-10">
                                    <LogoMarquee logos={INTEGRATION_LOGOS} className="py-3" />
                                </div>
                                <FeaturesIntegrations />
                            </>
                        ) : (
                            topic.item && <FeatureDetail item={topic.item} />
                        )}

                        <nav aria-label={t('features.page.moreFeatures')} className="mt-16 sm:mt-20 grid sm:grid-cols-2 gap-4">
                            {neighbour(prev, `← ${t('features.page.previous')}`, 'left')}
                            {neighbour(next, `${t('features.page.next')} →`, 'right')}
                        </nav>
                    </div>
                </div>
                <FeaturesCta />
            </main>
            <Footer />
        </>
    )
}
