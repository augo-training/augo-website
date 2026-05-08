import { forwardRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { trackCtaClicked } from '../../utils/analytics'
import { AUGO_INSTAGRAM_URL, BRIAN_INSTAGRAM_URL } from './constants'

const HumanEdgeHowToApply = forwardRef<HTMLDivElement>(function HumanEdgeHowToApply(_props, ref) {
    const { t } = useTranslation()
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        try {
            navigator.clipboard.writeText('Human Coach')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            trackCtaClicked({
                cta_text: 'Copy Human Coach',
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

    return (
        <section
            ref={ref}
            id="how-to-apply"
            className="w-full py-20 sm:py-24 px-5 sm:px-8 bg-dark scroll-mt-24"
        >
            <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
                <div className="flex flex-col gap-3 text-center max-w-[700px] mx-auto">
                    <h2 className="font-mono font-bold text-[28px] sm:text-[36px] lg:text-[44px] leading-[120%] text-white">
                        {t('humanEdge.howToApply.title')}
                    </h2>
                    <p className="font-satoshi text-[16px] sm:text-[18px] text-text-muted">
                        {t('humanEdge.howToApply.lead')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                    {/* Step 1 */}
                    <div
                        className="flex flex-col gap-4 p-6 sm:p-7 rounded-2xl"
                        style={{ backgroundColor: '#151515', border: '1px solid #2D2D2D' }}
                    >
                        <span className="font-mono font-bold text-[40px] text-yellow">
                            {t('humanEdge.howToApply.step1.number')}
                        </span>
                        <h3 className="font-mono font-bold text-[20px] text-white">
                            {t('humanEdge.howToApply.step1.title')}
                        </h3>
                        <p className="font-satoshi text-[15px] leading-[150%] text-text-muted flex-1">
                            {t('humanEdge.howToApply.step1.description')}
                        </p>
                        <div className="flex flex-col gap-2">
                            <a
                                href={AUGO_INSTAGRAM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleSocialClick('augo', AUGO_INSTAGRAM_URL)}
                                className="font-mono text-[12px] tracking-[1.5px] uppercase font-bold text-white px-4 py-3 rounded-lg text-center transition-colors duration-200 hover:bg-yellow"
                                style={{ backgroundColor: '#2D2D2D' }}
                            >
                                {t('humanEdge.howToApply.step1.ctaAugo')}
                            </a>
                            <a
                                href={BRIAN_INSTAGRAM_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleSocialClick('brian', BRIAN_INSTAGRAM_URL)}
                                className="font-mono text-[12px] tracking-[1.5px] uppercase font-bold text-white px-4 py-3 rounded-lg text-center transition-colors duration-200 hover:bg-yellow"
                                style={{ backgroundColor: '#2D2D2D' }}
                            >
                                {t('humanEdge.howToApply.step1.ctaBrian')}
                            </a>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div
                        className="flex flex-col gap-4 p-6 sm:p-7 rounded-2xl"
                        style={{ backgroundColor: '#151515', border: '1px solid #2D2D2D' }}
                    >
                        <span className="font-mono font-bold text-[40px] text-yellow">
                            {t('humanEdge.howToApply.step2.number')}
                        </span>
                        <h3 className="font-mono font-bold text-[20px] text-white">
                            {t('humanEdge.howToApply.step2.title')}
                        </h3>
                        <p className="font-satoshi text-[15px] leading-[150%] text-text-muted flex-1">
                            {t('humanEdge.howToApply.step2.description')}
                        </p>
                        <button
                            type="button"
                            onClick={handleCopy}
                            aria-label="Copy 'Human Coach' to clipboard"
                            className="btn-gradient font-mono text-[12px] tracking-[1.5px] uppercase font-bold text-white px-4 py-3 rounded-lg text-center transition-all duration-200 hover:brightness-110 border-0 cursor-pointer"
                        >
                            {copied ? t('humanEdge.howToApply.step2.copied') : t('humanEdge.howToApply.step2.cta')}
                        </button>
                    </div>

                    {/* Step 3 */}
                    <div
                        className="flex flex-col gap-4 p-6 sm:p-7 rounded-2xl"
                        style={{ backgroundColor: '#151515', border: '1px solid #2D2D2D' }}
                    >
                        <span className="font-mono font-bold text-[40px] text-yellow">
                            {t('humanEdge.howToApply.step3.number')}
                        </span>
                        <h3 className="font-mono font-bold text-[20px] text-white">
                            {t('humanEdge.howToApply.step3.title')}
                        </h3>
                        <p className="font-satoshi text-[15px] leading-[150%] text-text-muted flex-1">
                            {t('humanEdge.howToApply.step3.description')}
                        </p>
                        <div
                            className="font-mono text-[12px] tracking-[1.5px] uppercase font-bold text-yellow px-4 py-3 rounded-lg text-center"
                            style={{ backgroundColor: '#2D2D2D', border: '1px dashed #FFCA1E' }}
                        >
                            {t('humanEdge.howToApply.step3.badge')}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
})

export default HumanEdgeHowToApply
