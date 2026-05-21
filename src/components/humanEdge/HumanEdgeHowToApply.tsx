import { forwardRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trackCtaClicked } from '../../utils/analytics'
import { AUGO_INSTAGRAM_URL, BRIAN_INSTAGRAM_URL } from './constants'

const HumanEdgeHowToApply = forwardRef<HTMLDivElement>(function HumanEdgeHowToApply(_props, ref) {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        try {
            navigator.clipboard.writeText('Human Edge')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            trackCtaClicked({
                cta_text: 'Copy Human Edge',
                cta_location: 'human_edge_step2',
                destination: 'clipboard',
            })
        } catch {
            // Clipboard API blocked — silently ignore
        }
    }

    const handleSocialClick = (handle: 'augo' | 'brian', url: string) => {
        trackCtaClicked({
            cta_text: `Follow ${handle}`,
            cta_location: 'human_edge_step1',
            destination: url,
        })
    }

    const stepCount = 3
    const rowClasses =
        'group grid grid-cols-[28px_minmax(90px,140px)_1fr] sm:grid-cols-[36px_minmax(110px,180px)_1fr] gap-x-3 sm:gap-x-8 py-7 sm:py-9 border-t border-white/[0.08] last:border-b last:border-white/[0.08] transition-colors duration-200 hover:bg-white/[0.015]'
    const indexClasses =
        'font-mono text-[11px] sm:text-[12px] tracking-[1.5px] text-white/35 tabular-nums pt-[6px] sm:pt-[8px]'
    const labelClasses =
        'font-mono text-[11px] sm:text-[12px] tracking-[2.5px] uppercase text-white/55 group-hover:text-white/80 transition-colors duration-200 pt-[6px] sm:pt-[8px]'
    const titleClasses =
        'font-satoshi font-medium text-[18px] sm:text-[22px] leading-[130%] tracking-[-0.01em] text-white'
    const descClasses =
        'font-satoshi text-[15px] sm:text-[16px] leading-[150%] text-text-muted'
    const pillClasses =
        'inline-block font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase font-bold text-white px-4 py-2.5 rounded-md border border-white/15 hover:border-white/30 hover:bg-white/[0.04] transition-all duration-200'

    return (
        <section
            ref={ref}
            id="how-to-apply"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark scroll-mt-24 border-t border-white/[0.06] texture-grain"
        >
            <div className="max-w-[1100px] mx-auto">
                <h2 className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white">
                    {t('humanEdge.howToApply.title')}
                </h2>
                <p className="font-satoshi text-[16px] sm:text-[18px] text-text-muted mt-3 max-w-[640px]">
                    {t('humanEdge.howToApply.lead')}
                </p>

                <div className="mt-12 sm:mt-14 flex flex-col gap-5">
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {t('humanEdge.howToApply.applicationLabel')}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/30 tabular-nums">
                            {String(stepCount).padStart(2, '0')} / {String(stepCount).padStart(2, '0')}
                        </p>
                    </div>

                    <ol className="flex flex-col">
                        {/* Step 1 — Follow */}
                        <li className={rowClasses}>
                            <span className={indexClasses}>01</span>
                            <span className={labelClasses}>
                                {t('humanEdge.howToApply.step1.label')}
                            </span>
                            <div className="flex flex-col gap-3">
                                <h3 className={titleClasses}>
                                    {t('humanEdge.howToApply.step1.title')}
                                </h3>
                                <p className={descClasses}>
                                    {t('humanEdge.howToApply.step1.description')}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <a
                                        href={AUGO_INSTAGRAM_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => handleSocialClick('augo', AUGO_INSTAGRAM_URL)}
                                        className={pillClasses}
                                    >
                                        {t('humanEdge.howToApply.step1.ctaAugo')}
                                    </a>
                                    <a
                                        href={BRIAN_INSTAGRAM_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => handleSocialClick('brian', BRIAN_INSTAGRAM_URL)}
                                        className={pillClasses}
                                    >
                                        {t('humanEdge.howToApply.step1.ctaBrian')}
                                    </a>
                                </div>
                            </div>
                        </li>

                        {/* Step 2 — Comment */}
                        <li className={rowClasses}>
                            <span className={indexClasses}>02</span>
                            <span className={labelClasses}>
                                {t('humanEdge.howToApply.step2.label')}
                            </span>
                            <div className="flex flex-col gap-3">
                                <h3 className={titleClasses}>
                                    {t('humanEdge.howToApply.step2.title')}
                                </h3>
                                <p className={descClasses}>
                                    {t('humanEdge.howToApply.step2.description')}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    aria-label="Copy 'Human Edge' to clipboard"
                                    className={`${pillClasses} self-start cursor-pointer mt-1`}
                                >
                                    {copied ? t('humanEdge.howToApply.step2.copied') : t('humanEdge.howToApply.step2.cta')}
                                </button>
                            </div>
                        </li>

                        {/* Step 3 — Receive */}
                        <li className={rowClasses}>
                            <span className={indexClasses}>03</span>
                            <span className={labelClasses}>
                                {t('humanEdge.howToApply.step3.label')}
                            </span>
                            <div className="flex flex-col gap-3">
                                <h3 className={titleClasses}>
                                    {t('humanEdge.howToApply.step3.title')}
                                </h3>
                                <p className={descClasses}>
                                    {t('humanEdge.howToApply.step3.description')}
                                </p>
                                <div className="inline-flex self-start items-center gap-2 font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase font-bold text-white/80 px-4 py-2.5 rounded-md border border-white/15 bg-white/[0.02] mt-1">
                                    <span aria-hidden="true">✓</span>
                                    <span>{t('humanEdge.howToApply.step3.badge')}</span>
                                </div>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </section>
    )
})

export default HumanEdgeHowToApply
