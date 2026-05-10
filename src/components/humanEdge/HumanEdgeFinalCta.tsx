import { useTranslation } from 'react-i18next'
import { TERMS_URL } from './constants'

interface HumanEdgeFinalCtaProps {
    onApply: () => void
}

export default function HumanEdgeFinalCta({ onApply }: HumanEdgeFinalCtaProps) {
    const { t } = useTranslation()

    return (
        <section className="w-full py-20 sm:py-28 px-5 sm:px-8 bg-dark">
            <div className="max-w-[800px] mx-auto flex flex-col gap-6 text-center">
                <div className="flex flex-col gap-2 mb-4">
                    <p className="font-satoshi text-[18px] leading-[150%] text-text-muted">
                        {t('humanEdge.finalNote.lead1')}
                    </p>
                    <p className="font-satoshi font-bold text-[18px] leading-[150%] text-white">
                        {t('humanEdge.finalNote.lead2')}
                    </p>
                    <p className="font-mono text-[14px] tracking-[1px] uppercase text-yellow">
                        {t('humanEdge.finalNote.lead3')}
                    </p>
                </div>
                <h2 className="font-mono font-bold text-[32px] sm:text-[44px] lg:text-[56px] leading-[110%] text-white">
                    {t('humanEdge.finalCta.title')}
                </h2>
                <div className="flex flex-col gap-1 max-w-[560px] mx-auto">
                    <p className="font-satoshi text-[16px] sm:text-[18px] text-text-muted">
                        {t('humanEdge.finalCta.subtitle1')}
                    </p>
                    <p className="font-satoshi text-[16px] sm:text-[18px] text-white">
                        {t('humanEdge.finalCta.subtitle2')}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onApply}
                    className="btn-gradient self-center font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 border-0 cursor-pointer mt-2"
                    style={{ width: '209px', height: '48px' }}
                >
                    {t('humanEdge.finalCta.cta')}
                </button>
                <p className="font-satoshi text-[13px] text-text-muted mt-4">
                    {t('humanEdge.finalCta.termsPrefix')}{' '}
                    <a
                        href={TERMS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white transition-colors"
                    >
                        {t('humanEdge.finalCta.termsLink')}
                    </a>{' '}
                    {t('humanEdge.finalCta.termsSuffix')}
                </p>
            </div>
        </section>
    )
}
