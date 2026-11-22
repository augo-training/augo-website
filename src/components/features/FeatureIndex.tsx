import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import FeaturesSearch from './FeaturesSearch'
import LabUploadVisual from './LabUploadVisual'
import { DEVICE_LOGOS } from '../../data/deviceLogos'
import dashboard from '../../assets/images/app_web_dashboard.png?w=640&format=webp'
import trainingPeaksLogo from '../../assets/images/training_peaks_logo.svg'
import augoLogo from '../../assets/images/augo_footer_1.svg'
import { FEATURE_VISUALS, SECTION_IDS, type FeatureItem } from './constants'

function Card({
    href,
    title,
    summary,
    image,
    art,
}: {
    href: string
    title: string
    summary: string
    image?: string
    /** Drawn artwork for cards with no render. Falls back to the device logos. */
    art?: ReactNode
}) {
    return (
        <li className="snap-start shrink-0 w-[72vw] max-w-[300px] sm:w-auto sm:max-w-none">
            <a
                href={href}
                className="group flex flex-col h-full rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04] overflow-hidden transition-colors"
            >
                <div
                    className="relative aspect-[4/3] flex items-center justify-center overflow-hidden"
                    style={{ background: 'linear-gradient(14.48deg, #151515 -17.53%, #090909 79.83%)' }}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(ellipse at center, rgba(200, 15, 37, 0.35) 0%, rgba(254, 95, 33, 0.12) 45%, transparent 72%)',
                        }}
                    />
                    {image ? (
                        <img
                            src={image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="relative h-[88%] w-auto max-w-[88%] object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                    ) : art ? (
                        <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                            {art}
                        </div>
                    ) : (
                        // No render for integrations: show the device logos instead.
                        <div aria-hidden className="relative grid grid-cols-3 gap-x-5 gap-y-4 px-6 items-center justify-items-center">
                            {DEVICE_LOGOS.map((logo) => (
                                <img key={logo.alt} src={logo.src} alt="" className="h-5 w-auto opacity-80" />
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-satoshi font-bold text-[16px] leading-[130%] text-white">{title}</h3>
                    <p className="mt-1.5 font-satoshi text-[14px] leading-[145%] text-white/60 line-clamp-2">{summary}</p>
                </div>
            </a>
        </li>
    )
}

/**
 * The page's front door: a search box and a card for every feature. On phones
 * each group is a sideways-swiping row, so 18 cards don't push the content a
 * screen-length down; from sm up it's a grid.
 */
export default function FeatureIndex() {
    const { t } = useTranslation()
    const coach = t('features.coach.items', { returnObjects: true }) as FeatureItem[]
    const athlete = t('features.athlete.items', { returnObjects: true }) as FeatureItem[]
    const migration = t('features.migration', { returnObjects: true }) as { label: string; item: FeatureItem }

    const group = (id: string, heading: string, cards: ReactNode, columns = 'sm:grid-cols-3 lg:grid-cols-4') => (
        <div className="mt-10">
            <h3 id={id} className="font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">
                {heading}
            </h3>
            <ul
                aria-labelledby={id}
                className={`mt-4 -mx-5 px-5 sm:mx-0 sm:px-0 flex sm:grid ${columns} gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory scroll-px-5 pb-2 sm:pb-0`}
            >
                {cards}
            </ul>
        </div>
    )

    const featureCards = (items: FeatureItem[]) =>
        items.map((item) => (
            <Card
                key={item.id}
                href={`#${item.id}`}
                title={item.title}
                summary={item.summary}
                image={FEATURE_VISUALS[item.id]?.src}
                art={FEATURE_VISUALS[item.id]?.drawing === 'labUpload' ? <LabUploadVisual /> : undefined}
            />
        ))

    return (
        <section
            id={SECTION_IDS.index}
            aria-labelledby="features-index-title"
            className="features-target w-full px-5 sm:px-8 pb-16 sm:pb-20 bg-dark"
        >
            <div className="max-w-[1200px] mx-auto">
                <h2
                    id="features-index-title"
                    className="font-satoshi font-bold text-[26px] sm:text-[32px] leading-[115%] tracking-[-0.02em] text-white"
                >
                    {t('features.index.title')}
                </h2>
                <p className="mt-2 mb-5 font-satoshi text-[16px] sm:text-[17px] leading-[155%] text-white/65">
                    {t('features.index.lead')}
                </p>
                <FeaturesSearch />

                {group(
                    'index-setup',
                    t('features.index.setupTitle'),
                    <>
                        <Card
                            href={`#${SECTION_IDS.devices}`}
                            title={t('features.index.devicesTitle')}
                            summary={t('features.index.devicesSummary')}
                            image={dashboard}
                        />
                        <Card
                            href={`#${SECTION_IDS.integrations}`}
                            title={t('features.index.integrationsTitle')}
                            summary={t('features.index.integrationsSummary')}
                        />
                        <Card
                            href={`#${SECTION_IDS.migration}`}
                            title={migration.label}
                            summary={migration.item.summary}
                            art={
                                <div className="flex items-center gap-5">
                                    <div className="flex flex-col items-start gap-3">
                                        <img src={trainingPeaksLogo} alt="" className="h-6 w-auto opacity-85" />
                                        {/* No Final Surge logo file yet: its name, set plainly, until we have one. */}
                                        <span className="font-satoshi font-bold text-[17px] leading-none tracking-[0.5px] text-white/85">
                                            Final Surge
                                        </span>
                                    </div>
                                    <span className="text-white/50 text-[22px]">→</span>
                                    <img src={augoLogo} alt="" className="h-9 w-auto" />
                                </div>
                            }
                        />
                    </>,
                    'sm:grid-cols-3',
                )}
                {group('index-coaches', t('features.guide.coachHeading'), featureCards(coach))}
                {group('index-athletes', t('features.guide.athleteHeading'), featureCards(athlete))}
            </div>
        </section>
    )
}
