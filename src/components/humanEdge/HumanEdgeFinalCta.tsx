import { useTranslation } from 'react-i18next'
import { TERMS_URL } from './constants'

interface HumanEdgeFinalCtaProps {
    onApply: () => void
}

export default function HumanEdgeFinalCta({ onApply }: HumanEdgeFinalCtaProps) {
    const { t } = useTranslation()
    const note = t('humanEdge.finalCta.note', { returnObjects: true }) as string[]
    const titleLines = t('humanEdge.finalCta.title', { returnObjects: true }) as string[]

    return (
        <section className="w-full py-20 sm:py-28 px-5 sm:px-8 bg-dark border-t border-white/[0.06] texture-grain">
            <div className="max-w-[1100px] mx-auto">
                {/* Document header — status indicator */}
                <div className="flex flex-col gap-2 pb-5 border-b border-white/[0.10]">
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {t('humanEdge.finalCta.statusLabel')}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-[#FBBF24]">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FBBF24] mr-2 align-middle" aria-hidden="true" />
                            {t('humanEdge.finalCta.statusValue')}
                        </p>
                    </div>
                    <div className="flex items-baseline justify-between gap-6">
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white/55">
                            {t('humanEdge.finalCta.deadlineLabel')}
                        </p>
                        <p className="font-mono text-[11px] sm:text-[12px] tracking-[3px] uppercase text-white">
                            {t('humanEdge.finalCta.deadlineValue')}
                        </p>
                    </div>
                </div>

                {/* Quiet note — three lines */}
                <div className="mt-10 sm:mt-12 flex flex-col gap-2 max-w-[700px]">
                    {note.map((line, i) => (
                        <p
                            key={i}
                            className={`font-satoshi text-[17px] sm:text-[19px] leading-[150%] ${
                                i === note.length - 1 ? 'text-white' : 'text-text-muted'
                            }`}
                        >
                            {line}
                        </p>
                    ))}
                </div>

                {/* Massive headline */}
                <h2 className="mt-16 sm:mt-20 font-satoshi font-bold text-[56px] sm:text-[88px] md:text-[112px] lg:text-[140px] xl:text-[160px] leading-[90%] tracking-[-0.04em] text-white">
                    {titleLines.map((line, i) => (
                        <span key={i} className="block">{line}</span>
                    ))}
                </h2>

                {/* Subtitle */}
                <div className="mt-10 sm:mt-12 flex flex-col gap-1 max-w-[640px]">
                    <p className="font-satoshi font-medium text-[18px] sm:text-[22px] leading-[140%] text-white">
                        {t('humanEdge.finalCta.subtitle1')}
                    </p>
                    <p className="font-satoshi text-[17px] sm:text-[20px] leading-[150%] text-text-muted">
                        {t('humanEdge.finalCta.subtitle2')}
                    </p>
                </div>

                {/* CTA + terms */}
                <div className="mt-10 sm:mt-12 flex flex-col gap-6">
                    <button
                        type="button"
                        onClick={onApply}
                        className="btn-gradient self-start font-mono text-sm font-extrabold tracking-[2px] uppercase text-white rounded-lg hover:brightness-110 transition-all duration-200 border-0 cursor-pointer"
                        style={{ width: '209px', height: '48px' }}
                    >
                        {t('humanEdge.finalCta.cta')}
                    </button>

                    <p className="font-mono text-[11px] sm:text-[12px] tracking-[1.5px] uppercase text-white/40">
                        {t('humanEdge.finalCta.termsPrefix')}{' '}
                        <a
                            href={TERMS_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 decoration-white/40 hover:text-white hover:decoration-white transition-colors duration-200"
                        >
                            {t('humanEdge.finalCta.termsLink')}
                        </a>{' '}
                        {t('humanEdge.finalCta.termsSuffix')}
                    </p>
                </div>
            </div>
        </section>
    )
}
