import { useTranslation } from 'react-i18next'
import FeatureVisual from './FeatureVisual'
import { trackCtaClicked } from '../../utils/analytics'
import { FEATURE_CALLS, FEATURE_VISUALS, SUPPORT_SLUGS, type FeatureItem } from './constants'

/** One feature in full, on its own page: the detail on the left, the render on the right. */
export default function FeatureDetail({ item }: { item: FeatureItem }) {
    const { t } = useTranslation()
    const slug = SUPPORT_SLUGS[item.id]
    const call = FEATURE_CALLS[item.id]

    return (
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
                <p className="font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">{item.category}</p>
                <h1 className="mt-3 font-satoshi font-bold text-[34px] sm:text-[44px] lg:text-[52px] leading-[108%] tracking-[-0.025em] text-white text-balance">
                    {item.title}
                </h1>
                <p className="mt-5 font-satoshi font-medium text-[18px] sm:text-[20px] leading-[145%] text-white/85">{item.summary}</p>
                <p className="mt-5 font-satoshi text-[16px] sm:text-[17px] leading-[165%] text-white/65">{item.lead}</p>

                {item.proof && (
                    <p className="mt-6 pl-4 border-l-2 border-[#C80F25] font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white/80">
                        {item.proof}
                    </p>
                )}

                <h2 className="mt-10 font-mono text-[12px] tracking-[2.5px] uppercase text-white/50">{t('features.guide.howItWorks')}</h2>
                <ol className="mt-3 flex flex-col gap-2">
                    {item.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-white/75">
                            <span className="font-mono text-[13px] leading-[24px] text-white/40 shrink-0">{i + 1}</span>
                            <span>{step}</span>
                        </li>
                    ))}
                </ol>

                <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.08]">
                    {item.specs.map((spec) => (
                        <div key={spec.label} className="bg-[#0E0E0E] px-4 py-3">
                            <dt className="font-mono text-[11px] tracking-[2px] uppercase text-white/45">{spec.label}</dt>
                            <dd className="mt-1 font-satoshi text-[14px] leading-[140%] text-white/85">{spec.value}</dd>
                        </div>
                    ))}
                </dl>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
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
                            className="font-satoshi text-[15px] text-white/70 hover:text-white underline-offset-4 hover:underline"
                        >
                            {t('features.guide.learnMore')} →
                        </a>
                    )}
                </div>
            </div>

            <div className="md:sticky md:top-[calc(var(--features-offset)+16px)]">
                <FeatureVisual visual={FEATURE_VISUALS[item.id]} alt={item.title} />
            </div>
        </div>
    )
}
