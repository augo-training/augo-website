import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import dashboard from '../../assets/images/app_web_dashboard.png?w=1280&format=webp'
import athleteHome from '../../assets/images/athlete_home.png?w=334&format=webp'
import FeatureVisual from './FeatureVisual'
import { SECTION_IDS } from './constants'

interface Platform {
    title: string
    body: string
    tags: string[]
}

/** Where augo runs: web, iOS and Android for coaches; iOS and Android for athletes. */
export default function FeaturesDevices() {
    const { t } = useTranslation()
    const { lang } = useParams<{ lang: string }>()
    const downloadHref = `/${lang ?? 'en'}/download`

    const cards = [
        { key: 'coach', visual: { src: dashboard, shape: 'wide' as const } },
        { key: 'athlete', visual: { src: athleteHome, shape: 'phone' as const } },
    ].map(({ key, visual }) => ({
        ...(t(`features.devices.${key}`, { returnObjects: true }) as Platform),
        key,
        visual,
    }))

    return (
        <section
            id={SECTION_IDS.devices}
            aria-labelledby="features-devices-title"
            className="features-target w-full px-5 sm:px-8 py-20 sm:py-24 bg-dark border-t border-white/[0.06]"
        >
            <div className="max-w-[1200px] mx-auto">
                <p className="font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">{t('features.devices.eyebrow')}</p>
                <h2
                    id="features-devices-title"
                    className="mt-3 font-satoshi font-bold text-[30px] sm:text-[44px] leading-[110%] tracking-[-0.025em] text-white"
                >
                    {t('features.devices.title')}
                </h2>
                <p className="mt-4 font-satoshi text-[16px] sm:text-[18px] leading-[155%] text-white/65 max-w-[720px]">
                    {t('features.devices.lead')}
                </p>

                <div className="mt-10 grid md:grid-cols-2 gap-5 sm:gap-6">
                    {cards.map((card) => (
                        <div key={card.key} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-6 flex flex-col gap-5">
                            <FeatureVisual visual={card.visual} alt={card.title} />
                            <div>
                                <h3 className="font-satoshi font-bold text-[20px] sm:text-[24px] text-white">{card.title}</h3>
                                <p className="mt-2 font-satoshi text-[15px] sm:text-[16px] leading-[155%] text-white/65">{card.body}</p>
                                <ul className="mt-4 flex flex-wrap gap-2">
                                    {card.tags.map((tag) => (
                                        <li
                                            key={tag}
                                            className="rounded-full border border-white/[0.14] px-3 py-1 font-mono text-[11px] tracking-[1.5px] uppercase text-white/75"
                                        >
                                            {tag}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <a
                    href={downloadHref}
                    className="inline-flex items-center justify-center mt-8 h-12 px-8 rounded-lg border border-white/20 font-mono text-sm font-extrabold tracking-[2px] uppercase text-white/80 hover:text-white hover:border-white/40 transition-colors duration-200"
                >
                    {t('features.devices.download')}
                </a>
            </div>
        </section>
    )
}
