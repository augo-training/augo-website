import { useTranslation } from 'react-i18next'
import FeatureVisual from './FeatureVisual'
import { trackCtaClicked } from '../../utils/analytics'
import { FEATURE_CALLS, FEATURE_VISUALS, SUPPORT_SLUGS, type FeatureItem } from './constants'

/** One feature in full, laid out for the side panel: render on top, then the detail. */
export default function FeatureDetail({ item }: { item: FeatureItem }) {
    const { t } = useTranslation()
    const slug = SUPPORT_SLUGS[item.id]
    const call = FEATURE_CALLS[item.id]

    return (
        <>
            <FeatureVisual visual={FEATURE_VISUALS[item.id]} alt={item.title} />

            <p className="mt-8 font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">{item.category}</p>
            <h2
                id={`${item.id}-title`}
                className="mt-3 font-satoshi font-bold text-[28px] sm:text-[34px] leading-[112%] tracking-[-0.02em] text-white"
            >
                {item.title}
            </h2>
            <p className="mt-4 font-satoshi font-medium text-[17px] sm:text-[19px] leading-[145%] text-white/85">{item.summary}</p>
            <p className="mt-4 font-satoshi text-[15px] sm:text-[17px] leading-[160%] text-white/65">{item.lead}</p>

            {item.proof && (
                <p className="mt-5 pl-4 border-l-2 border-[#C80F25] font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white/80">
                    {item.proof}
                </p>
            )}

            <h3 className="mt-8 font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">{t('features.guide.howItWorks')}</h3>
            <ol className="mt-3 flex flex-col gap-2">
                {item.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white/75">
                        <span className="font-mono text-[13px] leading-[24px] text-white/40 shrink-0">{i + 1}</span>
                        <span>{step}</span>
                    </li>
                ))}
            </ol>

            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.08]">
                {item.specs.map((spec) => (
                    <div key={spec.label} className="bg-[#0E0E0E] px-4 py-3">
                        <dt className="font-mono text-[11px] tracking-[2px] uppercase text-white/45">{spec.label}</dt>
                        <dd className="mt-1 font-satoshi text-[14px] leading-[140%] text-white/85">{spec.value}</dd>
                    </div>
                ))}
            </dl>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                {call && (
                    <a
                        href={call}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                            void trackCtaClicked({
                                cta_text: t('features.guide.bookCall'),
                                cta_location: `features_${item.id}`,
                                destination: call,
                            })
                        }
                        className="btn-gradient inline-flex items-center justify-center h-12 px-6 rounded-lg font-mono text-sm font-extrabold tracking-[2px] uppercase text-white hover:brightness-110 transition-all duration-200"
                    >
                        {t('features.guide.bookCall')}
                    </a>
                )}
                {slug && (
                    <a
                        href={`/en/support/${slug}/`}
                        className="font-satoshi text-[14px] sm:text-[15px] text-white/70 hover:text-white underline-offset-4 hover:underline"
                    >
                        {t('features.guide.learnMore')} →
                    </a>
                )}
            </div>
        </>
    )
}
