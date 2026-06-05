import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'

const HumanEdgeHowToApply = forwardRef<HTMLDivElement>(function HumanEdgeHowToApply(_props, ref) {
    const { t } = useTranslation()

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

                <div className="mt-12 sm:mt-14 flex flex-col gap-6 py-8 sm:py-9 border-t border-white/[0.08] border-b">
                    <div className="inline-flex self-start items-center gap-2 font-mono text-[11px] sm:text-[12px] tracking-[2px] uppercase font-bold text-[#FBBF24] px-4 py-2.5 rounded-md border border-[#FBBF24]/30 bg-[#FBBF24]/[0.06]">
                        <span aria-hidden="true">●</span>
                        <span>{t('humanEdge.howToApply.closedBadge')}</span>
                    </div>
                    <p className="font-satoshi text-[17px] sm:text-[20px] leading-[150%] text-white max-w-[700px]">
                        {t('humanEdge.howToApply.closedNote')}
                    </p>
                </div>
            </div>
        </section>
    )
})

export default HumanEdgeHowToApply
