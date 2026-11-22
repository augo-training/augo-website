import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import dashboard from '../../assets/images/app_web_dashboard.png?w=1280&format=webp'
import athleteApp from '../../assets/images/img_for_athletes_workout.png?w=960&format=webp'
import FeatureVisual from './FeatureVisual'
import { SECTION_IDS } from './constants'

interface Platform {
    title: string
    body: string
    tags: string[]
}

/**
 * Where augo runs: web, iOS and Android for coaches; iOS and Android for
 * athletes. Content for the side panel, opened from the Devices tile.
 */
export default function FeaturesDevices() {
    const { t } = useTranslation()
    const { lang } = useParams<{ lang: string }>()
    const downloadHref = `/${lang ?? 'en'}/download`

    const cards = [
        { key: 'coach', visual: { src: dashboard, shape: 'wide' as const } },
        { key: 'athlete', visual: { src: athleteApp, shape: 'phone' as const } },
    ].map(({ key, visual }) => ({
        ...(t(`features.devices.${key}`, { returnObjects: true }) as Platform),
        key,
        visual,
    }))

    return (
        <>
            <p className="font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">{t('features.devices.eyebrow')}</p>
            <h2
                id={`${SECTION_IDS.devices}-title`}
                className="mt-3 font-satoshi font-bold text-[28px] sm:text-[34px] leading-[112%] tracking-[-0.02em] text-white"
            >
                {t('features.devices.title')}
            </h2>
            <p className="mt-4 font-satoshi text-[16px] sm:text-[18px] leading-[155%] text-white/65">{t('features.devices.lead')}</p>

            <div className="mt-8 flex flex-col gap-5">
                {cards.map((card) => (
                    <div key={card.key} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 flex flex-col gap-5">
                        <FeatureVisual visual={card.visual} alt={card.title} />
                        <div>
                            <h3 className="font-satoshi font-bold text-[20px] sm:text-[22px] text-white">{card.title}</h3>
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
        </>
    )
}
